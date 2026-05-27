import { Response } from 'express';
import { prisma } from '../../lib/prisma';
import { groq } from '../../lib/groq';
import { env } from '../../config/env';
import { buildsRepository } from './builds.repository';
import { AppError } from '../../util/errors';

function buildSystemPrompt(build: Awaited<ReturnType<typeof buildsRepository.findBuildById>>): string {
  if (!build) throw new AppError('Build no encontrado', 404, 'BUILD_NOT_FOUND');

  const group = build.compatibility_group;
  const allRoles = group.component_role;
  const selectedRoleIds = new Set(build.build_item.map(i => i.role_id));
  const missingRoles = allRoles.filter(r => r.is_required && !selectedRoleIds.has(r.role_id));

  const componentLines = build.build_item.length
    ? build.build_item.map(item => {
        const product = item.product_variant.product;
        const price = Number(item.unit_price);
        return `  - ${item.component_role.name}: ${product.name} — $${price.toFixed(2)} MXN [variant_id: ${item.variant_id}]`;
      }).join('\n')
    : '  (ninguno seleccionado aún)';

  const missingLines = missingRoles.length
    ? missingRoles.map(r => `  - ${r.name} (REQUERIDO)`).join('\n')
    : '  (todos los roles requeridos están cubiertos)';

  const compatLines = build.build_compat_result.length
    ? build.build_compat_result.map(r =>
        `  - [${r.passed ? 'OK' : 'FALLO'}] ${r.severity.toUpperCase()}: ${r.message}`
      ).join('\n')
    : '  (sin verificación de compatibilidad aún — ejecuta /compatibility)';

  return [
    'Eres un experto en hardware de PC para la tienda Fierro Components.',
    'Tu rol es ayudar al usuario a elegir y compatibilizar componentes. Responde siempre en español.',
    'Cuando recomiendes un componente específico, menciona su variant_id.',
    'No puedes agregar componentes directamente — solo recomienda, el usuario lo hace desde la interfaz.',
    '',
    '=== BUILD ACTUAL ===',
    `Nombre: ${build.name}`,
    `Grupo: ${group.name}`,
    `Precio total: $${Number(build.total_price).toFixed(2)} MXN`,
    `Estado: ${build.status}`,
    '',
    '=== COMPONENTES SELECCIONADOS ===',
    componentLines,
    '',
    '=== ROLES FALTANTES (REQUERIDOS) ===',
    missingLines,
    '',
    '=== COMPATIBILIDAD ===',
    compatLines,
  ].join('\n');
}

async function verifySessionOwner(sessionId: string, userId: string) {
  const session = await prisma.build_ai_session.findUnique({ where: { session_id: sessionId } });
  if (!session) throw new AppError('Sesión no encontrada', 404, 'SESSION_NOT_FOUND');
  if (session.user_id !== userId) throw new AppError('No autorizado', 403, 'FORBIDDEN');
  return session;
}

export const buildsAiService = {

  createSession: async (buildId: string, userId: string, title?: string) => {
    const build = await buildsRepository.findBuildById(buildId);
    if (!build || build.user_id !== userId) throw new AppError('Build no encontrado', 404, 'BUILD_NOT_FOUND');

    return prisma.build_ai_session.create({
      data: { build_id: buildId, user_id: userId, title: title ?? null },
      include: { messages: false },
    });
  },

  getSessions: async (buildId: string, userId: string) => {
    const build = await buildsRepository.findBuildById(buildId);
    if (!build || build.user_id !== userId) throw new AppError('Build no encontrado', 404, 'BUILD_NOT_FOUND');

    return prisma.build_ai_session.findMany({
      where: { build_id: buildId, user_id: userId },
      orderBy: { updated_at: 'desc' },
      include: {
        _count: { select: { messages: true } },
      },
    });
  },

  getMessages: async (sessionId: string, userId: string) => {
    await verifySessionOwner(sessionId, userId);
    return prisma.build_ai_message.findMany({
      where: { session_id: sessionId },
      orderBy: { created_at: 'asc' },
    });
  },

  deleteSession: async (sessionId: string, userId: string) => {
    await verifySessionOwner(sessionId, userId);
    await prisma.build_ai_session.delete({ where: { session_id: sessionId } });
    return { message: 'Sesión eliminada.' };
  },

  chat: async (buildId: string, sessionId: string, userId: string, userMessage: string, res: Response) => {
    const session = await verifySessionOwner(sessionId, userId);
    if (session.build_id !== buildId) throw new AppError('Sesión no pertenece a este build', 400, 'SESSION_BUILD_MISMATCH');

    const build = await buildsRepository.findBuildById(buildId);
    const systemPrompt = buildSystemPrompt(build);

    await prisma.build_ai_message.create({
      data: { session_id: sessionId, role: 'user', content: userMessage },
    });

    const history = await prisma.build_ai_message.findMany({
      where: { session_id: sessionId },
      orderBy: { created_at: 'asc' },
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    let fullResponse = '';

    try {
      const stream = await groq.chat.completions.create({
        model: env.GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        ],
        stream: true,
        max_tokens: 1024,
        temperature: 0.7,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content ?? '';
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      await prisma.build_ai_message.create({
        data: { session_id: sessionId, role: 'assistant', content: fullResponse },
      });

      await prisma.build_ai_session.update({
        where: { session_id: sessionId },
        data: { updated_at: new Date() },
      });

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (err) {
      if (!res.headersSent) {
        throw new AppError('Error al conectar con el asistente de IA', 502, 'AI_UNAVAILABLE');
      }
      res.write('data: [DONE]\n\n');
      res.end();
    }
  },

  suggest: async (buildId: string, userId: string) => {
    const build = await buildsRepository.findBuildById(buildId);
    if (!build || build.user_id !== userId) throw new AppError('Build no encontrado', 404, 'BUILD_NOT_FOUND');

    const systemPrompt = buildSystemPrompt(build);

    let completion;
    try {
      completion = await groq.chat.completions.create({
        model: env.GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              'Analiza el build actual y devuelve sugerencias concretas.',
              'Responde SOLO con un JSON válido con este formato exacto, sin texto adicional:',
              '{"suggestions":[{"role":"nombre_rol","reason":"razón concisa","variantId":"uuid o null"}]}',
              'Máximo 5 sugerencias, priorizando roles requeridos faltantes.',
            ].join('\n'),
          },
        ],
        max_tokens: 512,
        temperature: 0.3,
      });
    } catch {
      throw new AppError('Error al conectar con el asistente de IA', 502, 'AI_UNAVAILABLE');
    }

    const raw = completion.choices[0]?.message?.content ?? '{"suggestions":[]}';
    try {
      return JSON.parse(raw);
    } catch {
      return { suggestions: [] };
    }
  },
};
