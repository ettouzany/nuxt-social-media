<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="text-2xl font-bold text-blue-600 hover:text-blue-700">
            SocialApp
          </NuxtLink>
          <nav class="flex items-center space-x-6">
            <NuxtLink to="/" class="text-gray-600 hover:text-blue-600 transition-colors">
              🏠 Home
            </NuxtLink>
            <NuxtLink to="/profile" class="text-gray-600 hover:text-blue-600 transition-colors">
              👤 Profile
            </NuxtLink>
            <NuxtLink to="/notifications" class="text-blue-600 font-medium">
              🔔 Notifications 
              <span v-if="unreadCount > 0" class="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {{ unreadCount }}
              </span>
            </NuxtLink>
          </nav>
          <div class="flex items-center space-x-4">
            <span class="text-2xl">😊</span>
            <span class="font-medium">You</span>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-4 py-6">
      <!-- Page Header -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-2xl font-bold text-gray-900">Notifications</h1>
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Mark All as Read
          </button>
        </div>

        <!-- Filter Tabs -->
        <div class="flex space-x-4">
          <button
            @click="filter = 'all'"
            :class="[
              'px-4 py-2 rounded-lg transition-colors',
              filter === 'all'
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-600 hover:text-blue-600'
            ]"
          >
            All ({{ notifications.length }})
          </button>
          <button
            @click="filter = 'unread'"
            :class="[
              'px-4 py-2 rounded-lg transition-colors',
              filter === 'unread'
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-600 hover:text-blue-600'
            ]"
          >
            Unread ({{ unreadCount }})
          </button>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="space-y-4">
        <div v-if="filteredNotifications.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <div class="text-4xl mb-4">🔔</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            {{ filter === 'unread' ? 'No unread notifications' : 'No notifications yet' }}
          </h3>
          <p class="text-gray-500">
            {{ filter === 'unread' 
              ? 'You\'re all caught up!'
              : 'Start interacting with posts to get notifications!'
            }}
          </p>
        </div>
        <div 
          v-else
          v-for="notification in filteredNotifications" 
          :key="notification.id"
          :class="[
            'bg-white rounded-lg shadow-sm p-4 border-l-4 hover:shadow-md transition-shadow cursor-pointer',
            notification.read 
              ? 'border-gray-200' 
              : 'border-blue-500 bg-blue-50'
          ]"
          @click="!notification.read && markAsRead(notification.id)"
        >
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <span class="text-2xl">{{ notification.avatar }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-2 mb-1">
                <span class="text-lg">{{ getNotificationIcon(notification.type) }}</span>
                <span class="font-medium text-gray-900">{{ notification.user }}</span>
                <span class="text-gray-600">{{ notification.content }}</span>
                <div v-if="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <p class="text-sm text-gray-500">{{ notification.timestamp }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
interface Notification {
  id: number;
  type: 'like' | 'comment' | 'follow';
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  read: boolean;
}

const notifications = ref<Notification[]>([]);
const filter = ref<'all' | 'unread'>('all');

const defaultNotifications: Notification[] = [
  {
    id: 1,
    type: 'like',
    user: 'John Doe',
    avatar: '🧑‍💻',
    content: 'liked your post',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 2,
    type: 'comment',
    user: 'Sarah Wilson',
    avatar: '👩‍🎨',
    content: 'commented on your post: "Great work!"',
    timestamp: '4 hours ago',
    read: false
  },
  {
    id: 3,
    type: 'follow',
    user: 'Mike Johnson',
    avatar: '👨‍🔬',
    content: 'started following you',
    timestamp: '1 day ago',
    read: true
  },
  {
    id: 4,
    type: 'like',
    user: 'Emma Davis',
    avatar: '👩‍💼',
    content: 'liked your post',
    timestamp: '2 days ago',
    read: true
  }
];

onMounted(() => {
  if (process.client) {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      notifications.value = JSON.parse(savedNotifications);
    } else {
      notifications.value = defaultNotifications;
      localStorage.setItem('notifications', JSON.stringify(defaultNotifications));
    }
  }
});

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length);

const filteredNotifications = computed(() => 
  filter.value === 'unread' 
    ? notifications.value.filter(n => !n.read)
    : notifications.value
);

const markAsRead = (notificationId: number) => {
  const notificationIndex = notifications.value.findIndex(n => n.id === notificationId);
  if (notificationIndex !== -1) {
    notifications.value[notificationIndex].read = true;
    if (process.client) {
      localStorage.setItem('notifications', JSON.stringify(notifications.value));
    }
  }
};

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true;
  });
  if (process.client) {
    localStorage.setItem('notifications', JSON.stringify(notifications.value));
  }
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'like': return '❤️';
    case 'comment': return '💬';
    case 'follow': return '👥';
    default: return '🔔';
  }
};
</script>