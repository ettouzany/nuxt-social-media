<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="text-2xl font-bold text-blue-600 hover:text-blue-700">
            Nuxt
          </NuxtLink>
          <nav class="flex items-center space-x-6">
            <NuxtLink to="/" class="text-blue-600 font-medium">
              🏠 Home
            </NuxtLink>
            <NuxtLink to="/profile" class="text-gray-600 hover:text-blue-600 transition-colors">
              👤 Profile
            </NuxtLink>
            <NuxtLink to="/notifications" class="text-gray-600 hover:text-blue-600 transition-colors">
              🔔 Notifications
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
      <!-- Post Creation -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <form @submit.prevent="handleSubmitPost">
          <div class="flex items-start space-x-3">
            <span class="text-2xl">😊</span>
            <div class="flex-1">
              <textarea
                v-model="newPost"
                placeholder="What's on your mind?"
                class="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
              <div class="flex justify-end mt-3">
                <button
                  type="submit"
                  class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  :disabled="!newPost.trim()"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Posts Feed -->
      <div class="space-y-6">
        <div 
          v-for="post in posts" 
          :key="post.id" 
          class="bg-white rounded-lg shadow-sm p-6"
        >
          <!-- Post Header -->
          <div class="flex items-center space-x-3 mb-4">
            <span class="text-2xl">{{ post.avatar }}</span>
            <div>
              <h3 class="font-semibold text-gray-900">{{ post.author }}</h3>
              <p class="text-sm text-gray-500">{{ post.timestamp }}</p>
            </div>
          </div>

          <!-- Post Content -->
          <p class="text-gray-800 mb-4">{{ post.content }}</p>

          <!-- Post Actions -->
          <div class="flex items-center space-x-6 pt-4 border-t border-gray-100">
            <button
              @click="handleLike(post.id)"
              class="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <span>❤️</span>
              <span>{{ post.likes }}</span>
            </button>
            <button class="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <span>💬</span>
              <span>{{ post.comments }}</span>
            </button>
            <button class="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <span>📤</span>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
interface Post {
  id: number;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
}

const posts = ref<Post[]>([]);
const newPost = ref('');
const isLoaded = ref(false);

const defaultPosts: Post[] = [
  {
    id: 1,
    author: "John Doe",
    avatar: "🧑‍💻",
    content: "Just built an amazing Nuxt.js app! The developer experience is incredible.",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 5
  },
  {
    id: 2,
    author: "Sarah Wilson",
    avatar: "👩‍🎨", 
    content: "Working on some new designs today. Love how Tailwind CSS makes styling so much easier!",
    timestamp: "4 hours ago",
    likes: 18,
    comments: 3
  }
];

onMounted(() => {
  if (process.client) {
    const savedPosts = localStorage.getItem('socialMediaPosts');
    if (savedPosts) {
      posts.value = JSON.parse(savedPosts);
    } else {
      posts.value = defaultPosts;
    }
    isLoaded.value = true;
  }
});

watch(posts, (newPosts) => {
  if (process.client && isLoaded.value) {
    localStorage.setItem('socialMediaPosts', JSON.stringify(newPosts));
  }
}, { deep: true });

const handleSubmitPost = () => {
  if (newPost.value.trim()) {
    const post: Post = {
      id: Date.now(),
      author: "You",
      avatar: "😊",
      content: newPost.value,
      timestamp: new Date().toLocaleString(),
      likes: 0,
      comments: 0
    };
    posts.value.unshift(post);
    newPost.value = '';
  }
};

const handleLike = (postId: number) => {
  const postIndex = posts.value.findIndex(post => post.id === postId);
  if (postIndex !== -1) {
    posts.value[postIndex].likes++;
  }
};
</script>