import { notificationsRepository } from './notifications.repository';
import type { UpdatePreferenceInput } from './notifications.schema';

export const notificationsService = {

  getNotifications: async (userId: string, page = 1, limit = 20) => {
    const { items, total } = await notificationsRepository.findNotificationsByUser(userId, page, limit);
    return {
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  markAsRead: async (notificationId: string, userId: string) => {
    await notificationsRepository.markAsRead(notificationId, userId);
    return { message: 'Notificación marcada como leída.' };
  },

  markAllAsRead: async (userId: string) => {
    await notificationsRepository.markAllAsRead(userId);
    return { message: 'Todas las notificaciones marcadas como leídas.' };
  },

  getPreferences: async (userId: string) => {
    return notificationsRepository.findPreferencesByUser(userId);
  },

  updatePreference: async (input: UpdatePreferenceInput, userId: string) => {
    return notificationsRepository.upsertPreference(userId, {
      event:          input.event,
      email_enabled:  input.emailEnabled,
      sms_enabled:    input.smsEnabled,
      push_enabled:   input.pushEnabled,
      in_app_enabled: input.inAppEnabled,
    });
  },
};