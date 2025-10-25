<template>
  <div class="max-w-4xl mx-auto px-4 py-4">
    <h1>Posts</h1>
  </div>
  <div>
    <form @submit.prevent="submitPost" class="max-w-2xl mx-auto mb-6">
    <textarea v-model="newPost" placeholder="What's on your mind?" class="w-full p-4 border rounded-lg mb-4"></textarea>
    <div class="space-y-4">
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Post
        </button>
    </div>
    </form>
    
    <div class="max-w-2xl mx-auto space-y-4">
      <div v-for="post in posts" :key="post.id" class="bg-white p-4 border rounded-lg shadow">
        <p class="text-gray-800">{{ post.content }}</p>
        <div class="text-sm text-gray-500 mt-2">
          {{ new Date(post.timestamp).toLocaleString() }}
        </div>
      </div>
    </div>
</div>
</template>

<script setup lang="ts">
interface Post {
  id: number
  content: string
  timestamp: string
}

const newPost = ref('')
const posts = ref<Post[]>([])

const loadPosts = async () => {
  try {
    const data = await $fetch<Post[]>('/api/posts')
    posts.value = data || []
  } catch (error) {
    console.error('Failed to load posts:', error)
  }
}

const submitPost = async () => {
  if (newPost.value.trim()) {
    try {
      const post = await $fetch<Post>('/api/posts', {
        method: 'POST',
        body: { content: newPost.value.trim() }
      })
      posts.value.unshift(post)
      newPost.value = ''
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }
}

onMounted(() => {
  loadPosts()
})
</script>