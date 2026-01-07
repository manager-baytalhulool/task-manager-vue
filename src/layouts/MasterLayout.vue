<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

import sidebar from '@/assets/js/modules/sidebar'

import AppFooter from '@/components/AppFooter.vue'
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'

onMounted(() => {
  sidebar.initialize()
})
</script>

<template>
  <div class="wrapper">
    <AppSidebar />
    <div class="main">
      <AppNavbar />

      <RouterView />

      <AppFooter />
    </div>
  </div>
</template>
