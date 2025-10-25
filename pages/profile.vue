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
            <NuxtLink to="/profile" class="text-blue-600 font-medium">
              👤 Profile
            </NuxtLink>
            <NuxtLink to="/notifications" class="text-gray-600 hover:text-blue-600 transition-colors">
              🔔 Notifications
            </NuxtLink>
          </nav>
          <div class="flex items-center space-x-4">
            <span class="text-2xl">{{ profile.avatar }}</span>
            <span class="font-medium">{{ profile.name }}</span>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-6">
      <!-- Profile Header -->
      <div class="bg-white rounded-lg shadow-sm p-8 mb-6">
        <div class="flex items-start justify-between">
          <div class="flex items-center space-x-6">
            <div class="text-6xl">{{ profile.avatar }}</div>
            <div>
              <div v-if="isEditing" class="space-y-3">
                <input
                  v-model="editForm.name"
                  type="text"
                  class="text-2xl font-bold border border-gray-300 rounded px-2 py-1"
                />
                <textarea
                  v-model="editForm.bio"
                  class="w-full border border-gray-300 rounded px-2 py-1 resize-none"
                  rows="2"
                />
                <div class="flex space-x-2">
                  <button
                    @click="handleSaveProfile"
                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    @click="isEditing = false"
                    class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div v-else>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ profile.name }}</h1>
                <p class="text-gray-600 mb-4 max-w-md">{{ profile.bio }}</p>
                <button
                  @click="isEditing = true"
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="flex space-x-8 mt-6 pt-6 border-t border-gray-200">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ profile.postsCount }}</div>
            <div class="text-gray-600">Posts</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ profile.followers }}</div>
            <div class="text-gray-600">Followers</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ profile.following }}</div>
            <div class="text-gray-600">Following</div>
          </div>
        </div>
      </div>

      <!-- User Posts -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">My Posts</h2>
        <div v-if="userPosts.length === 0" class="text-center py-8">
          <p class="text-gray-500 mb-4">You haven't posted anything yet!</p>
          <NuxtLink
            to="/"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Create Your First Post
          </NuxtLink>
        </div>
        <div v-else class="space-y-6">
          <div 
            v-for="post in userPosts" 
            :key="post.id" 
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center space-x-3 mb-3">
              <span class="text-xl">{{ post.avatar }}</span>
              <div>
                <h3 class="font-semibold text-gray-900">{{ post.author }}</h3>
                <p class="text-sm text-gray-500">{{ post.timestamp }}</p>
              </div>
            </div>
            <p class="text-gray-800 mb-3">{{ post.content }}</p>
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <span>❤️ {{ post.likes }}</span>
              <span>💬 {{ post.comments }}</span>
            </div>
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

interface UserProfile {
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  postsCount: number;
}

const profile = ref<UserProfile>({
  name: "You",
  avatar: "😊",
  bio: "Hello! I'm enjoying this social media app built with Nuxt.js!",
  followers: 125,
  following: 89,
  postsCount: 0
});

const userPosts = ref<Post[]>([]);
const isEditing = ref(false);
const editForm = ref({ name: "", bio: "" });

onMounted(() => {
  if (process.client) {
    const savedPosts = localStorage.getItem('socialMediaPosts');
    if (savedPosts) {
      const allPosts: Post[] = JSON.parse(savedPosts);
      userPosts.value = allPosts.filter(post => post.author === "You");
      profile.value.postsCount = userPosts.value.length;
    }

    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      profile.value = { ...profile.value, ...profileData };
      editForm.value = { name: profileData.name, bio: profileData.bio };
    } else {
      editForm.value = { name: profile.value.name, bio: profile.value.bio };
    }
  }
});

const handleSaveProfile = () => {
  profile.value.name = editForm.value.name;
  profile.value.bio = editForm.value.bio;
  if (process.client) {
    localStorage.setItem('userProfile', JSON.stringify(profile.value));
  }
  isEditing.value = false;
};
</script>