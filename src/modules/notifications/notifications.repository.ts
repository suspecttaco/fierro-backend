import { prisma } from '../../lib/prisma';

export const notificationsRepository = {

  findNotificationsByUser: async (userId: string, page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.notification.count({ where: { user_id: userId } }),
    ]);
    return { items, total, page, limit };
  },

  markAsRead: async (notificationId: string, userId: string) => {
    return prisma.notification.updateMany({
      where: { notification_id: notificationId, user_id: userId },
      data:  { read_at: new Date() },
    });
  },

  markAllAsRead: async (userId: string) => {
    return prisma.notification.updateMany({
      where: { user_id: userId, read_at: null },
      data:  { read_at: new Date() },
    });
  },

  findPreferencesByUser: async (userId: string) => {
    return prisma.notification_preference.findMany({
      where: { user_id: userId },
    });
  },

  upsertPreference: async (userId: string, data: {
    event:          string;
    email_enabled?: boolean;
    sms_enabled?:   boolean;
    push_enabled?:  boolean;
    in_app_enabled?: boolean;
  }) => {
    return prisma.notification_preference.upsert({
      where:  { user_id_event: { user_id: userId, event: data.event } },
      update: {
        email_enabled:  data.email_enabled,
        sms_enabled:    data.sms_enabled,
        push_enabled:   data.push_enabled,
        in_app_enabled: data.in_app_enabled,
      },
      create: {
        user_id:        userId,
        event:          data.event,
        email_enabled:  data.email_enabled  ?? true,
        sms_enabled:    data.sms_enabled    ?? false,
        push_enabled:   data.push_enabled   ?? true,
        in_app_enabled: data.in_app_enabled ?? true,
      },
    });
  },
};