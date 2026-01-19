<script setup lang="ts">
import api from '@/plugins/axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const task = ref<any>({})
const isViewReady = ref<boolean>(false)

const getTask = async () => {
  const id = route.params.id
  const url = `/api/tasks/${id}`
  const response = await api.get(url)
  task.value = response.data.data.task
}

onMounted(() => {
  getTask()
  isViewReady.value = true
})
</script>

<template>
  <main class="content">
    <div class="container-fluid p-0" v-if="isViewReady">
      <h1 class="h3 mb-3">Task</h1>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Task Information</h5>
            </div>
            <div class="text-end"></div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered table-hover">
                  <tbody>
                    <tr>
                      <th style="width: 30%">Task Id</th>
                      <td>{{ task.id }}</td>
                    </tr>
                    <tr>
                      <th>Description</th>
                      <td>{{ task.description }}</td>
                    </tr>
                    <tr>
                      <th>Assignee</th>
                      <td>{{ task.assignee.name }}</td>
                    </tr>
                    <tr>
                      <th>Status</th>
                      <td>{{ task.status }}</td>
                    </tr>
                    <tr>
                      <th>Is Paid</th>
                      <td>{{ task.is_paid == '1' ? true : false }}</td>
                    </tr>
                    <tr>
                      <th>Started At</th>
                      <td>{{ task.started_at }}</td>
                    </tr>
                    <tr>
                      <th>Completed At</th>
                      <td>{{ task.completed_at }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">Subtasks</h5>
              <button class="btn btn-primary">Add Subtask (Not Implemented)</button>
            </div>
            <div class="text-end"></div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Completed At</th>
                      <th>Sort No</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="subtask in task.subtasks" :key="subtask.id">
                      <td>{{ subtask.description }}</td>
                      <td>{{ subtask.completed_at }}</td>
                      <td>{{ subtask.sort_no }}</td>
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
