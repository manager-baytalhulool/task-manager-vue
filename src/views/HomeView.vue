<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const authUser = authStore.user

const isViewReady = ref<boolean>(false)
const tasks = ref<any>([])

const getTasks = async () => {
  const url = `/api/tasks`
  const response = await axios.get(url)
  tasks.value = response.data.data
}

onMounted(async () => {
  await getTasks()
  isViewReady.value = true
})
</script>

<template>
  <main class="content">
    <div class="container-fluid p-0" v-if="isViewReady">
      <h1 class="h3 mb-3">
        <strong>{{ authUser.name }}</strong>
      </h1>

      <div class="row">
        <div class="col-12 col-md-4 col-xxl-3 d-flex" v-for="task in tasks" :key="task.id">
          <div class="card flex-fill w-100">
            <div class="card-header">
              <h5 class="card-title mb-0">{{ task.user.name }}</h5>
            </div>
            <div class="card-body d-flex">
              <div class="align-self-center w-100">
                <table class="table mb-0">
                  <tbody>
                    <tr>
                      <td>{{ task.task_type.name }}</td>
                      <td class="text-end">{{ task.tasks_count }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
