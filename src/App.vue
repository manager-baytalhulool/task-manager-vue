<script setup lang="ts">
import { RouterView } from 'vue-router'

import AppLoader from './components/AppLoader.vue'
import { useAppStore } from './stores/appStore'

const appStore = useAppStore()
</script>

<template>
  <AppLoader v-if="appStore.isAppLoading" />
  <RouterView v-else />
</template>

<style scoped></style>
