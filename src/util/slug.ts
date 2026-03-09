import { prisma } from "../lib/prisma";

export const generateSlug = async (text: string, table: 'product' | 'category' | 'brand' | 'tag' | 'attribute_type'): Promise<string> => {
    const base = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

    let slug = base;
    let count = 0;

    while (true) {
        const existing = await (prisma as any)[table].findUnique({ where: { slug } });
        if (!existing) {
            return slug;
        }

        count++;
        slug = `${base}-${count}`
    }
};