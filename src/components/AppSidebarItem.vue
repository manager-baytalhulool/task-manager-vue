<script setup lang="ts">
import { toRefs } from 'vue'
import AppFeatherIcon from './AppFeatherIcon.vue'

const props = defineProps(['icon', 'text', 'url'])
const { icon, text, url } = toRefs(props)
</script>

<template>
  <li class="sidebar-item">
    <RouterLink class="sidebar-link" :to="url">
      <AppFeatherIcon :icon="icon" />
      <span class="align-middle">{{ text }}</span>
    </RouterLink>
  </li>
</template>
