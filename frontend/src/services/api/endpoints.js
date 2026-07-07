export const endpoints = {
  auth: {
    login: '/auth/login',
    sendOtp: '/auth/register/send-otp',
    verifyAndRegister: '/auth/register/verify',
  },
  settings: {
    smtp: {
      getAll: '/settings/smtp',
      create: '/settings/smtp',
      update: (id) => `/settings/smtp/${id}`,
      delete: (id) => `/settings/smtp/${id}`,
    },
    sms: {
      getAll: '/settings/sms',
      create: '/settings/sms',
      update: (id) => `/settings/sms/${id}`,
      delete: (id) => `/settings/sms/${id}`,
    },
    razorpay: {
      getAll: '/settings/razorpay',
      create: '/settings/razorpay',
      update: (id) => `/settings/razorpay/${id}`,
      delete: (id) => `/settings/razorpay/${id}`,
    },
    digio: {
      getAll: '/settings/digio',
      create: '/settings/digio',
      update: (id) => `/settings/digio/${id}`,
      delete: (id) => `/settings/digio/${id}`,
    },
    youtube: {
      getAll: '/settings/youtube',
      create: '/settings/youtube',
      update: (id) => `/settings/youtube/${id}`,
      delete: (id) => `/settings/youtube/${id}`,
    },
  },
  users: {
    getAll: '/users',
    getOne: (id) => `/users/${id}`,
    create: '/users',
    update: (id) => `/users/${id}`,
    delete: (id) => `/users/${id}`,
  },
  roles: {
    getAll: '/roles',
    getOne: (id) => `/roles/${id}`,
    create: '/roles',
    update: (id) => `/roles/${id}`,
    delete: (id) => `/roles/${id}`,
  },
  permissions: {
    getAll: '/permissions',
  },
  blogs: {
    getAll: '/blogs',
    getById: (id) => `/blogs/${id}`,
    create: '/blogs',
    update: (id) => `/blogs/${id}`,
    delete: (id) => `/blogs/${id}`,
  },
  blogCategories: {
    getAll: '/blog-categories',
    getById: (id) => `/blog-categories/${id}`,
    create: '/blog-categories',
    update: (id) => `/blog-categories/${id}`,
    delete: (id) => `/blog-categories/${id}`,
  },
  media: {
    getAll: '/media',
    delete: (id) => `/media/${id}`,
    upload: '/upload'
  },
  upload: {
    image: '/upload',
    video: '/upload/video'
  },
  youtube: {
    preview: '/youtube/preview',
    sync: '/youtube/sync'
  },
  notifications: {
    my: '/notifications/my',
    all: '/notifications/all',
    types: '/notifications/types',
    unreadCount: '/notifications/unread-count',
    create: '/notifications',
    update: (id) => `/notifications/${id}`,
    delete: (id) => `/notifications/${id}`,
    read: (id) => `/notifications/${id}/read`,
    readAll: '/notifications/read-all',
    dismiss: (id) => `/notifications/${id}/dismiss`,
  },



  chats: {
    conversations: '/chats/conversations',
    messages: (userId) => `/chats/${userId}/messages`,
    send: '/chats/send',
    markAsRead: (chatId) => `/chats/${chatId}/read`,
    superAdmin: '/chats/super-admin/info',
    updateOnlineStatus: '/chats/online',
    setTypingStatus: '/chats/typing',
  },

  brokers: {
    getAll: '/brokers',
    getActive: '/brokers/active',
    getById: (id) => `/brokers/${id}`,
    create: '/brokers',
    update: (id) => `/brokers/${id}`,
    updateStatus: (id) => `/brokers/${id}/status`,
    delete: (id) => `/brokers/${id}`,
  },
  trades: {
    getAll: '/trades',
    getById: (id) => `/trades/${id}`,
    create: '/trades',
    update: (id) => `/trades/${id}`,
    updateStatus: (id) => `/trades/${id}/status`,
    delete: (id) => `/trades/${id}`,
  },

  // Add this inside the main endpoints object
  subscriptionPlans: {
    getAll: "/subscription-plans",
    getById: (id) => `/subscription-plans/${id}`,
    create: "/subscription-plans",
    update: (id) => `/subscription-plans/${id}`,
    delete: (id) => `/subscription-plans/${id}`,
    updateStatus: (id) => `/subscription-plans/${id}/status`,
    toggleFeatured: (id) => `/subscription-plans/${id}/featured`,
  },

  userSubscriptions: {
    getAll: "/user-subscriptions",
    getById: (id) => `/user-subscriptions/${id}`,
    create: "/user-subscriptions",
    update: (id) => `/user-subscriptions/${id}`,
    delete: (id) => `/user-subscriptions/${id}`,
    updateStatus: (id) => `/user-subscriptions/${id}/status`,
  },

  subscriptionPayments: {
    getAll: "/subscription-payments",
    getById: (id) => `/subscription-payments/${id}`,
    create: "/subscription-payments",
    update: (id) => `/subscription-payments/${id}`,
    delete: (id) => `/subscription-payments/${id}`,
    updateStatus: (id) => `/subscription-payments/${id}/status`,
  },
  tradeJournals: {
    getAll: '/trade-journals',
    getById: (id) => `/trade-journals/${id}`,
    create: '/trade-journals',
    update: (id) => `/trade-journals/${id}`,
    delete: (id) => `/trade-journals/${id}`,
  },

};