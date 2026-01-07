import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('appStore', () => {
  const isInitiated = ref<boolean>(false)
  const isLoading = ref<boolean>(true)
  const layout = ref<any>('loader')

  const getLayout = computed(() => layout.value)
  const isAppLoading = computed(() => isLoading.value)

  function setAppLoading(loading: boolean) {
    isLoading.value = loading
  }

  function setLayout(localLayout: any) {
    // isLoading.value = true;
    layout.value = localLayout
  }

  return {
    isInitiated,
    isLoading,
    layout,
    getLayout,
    isAppLoading,
    setAppLoading,
    setLayout
  }
})
