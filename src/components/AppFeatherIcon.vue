<script setup lang="ts">
import * as feather from 'feather-icons'
import { onMounted, toRefs } from 'vue'

const props = defineProps(['icon'])
const { icon } = toRefs(props)

onMounted(() => {
  feather.replace()
})
</script>

<template>
  <i class="align-middle" :data-feather="icon"></i>
</template>
