<script setup lang="ts">
import api from '@/plugins/axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const project = ref<any>({})
const isViewReady = ref<boolean>(false)

const getProject = async () => {
  const id = route.params.id
  const url = `/api/projects/${id}`
  const response = await api.get(url)
  project.value = response.data.data.project
}

onMounted(async () => {
  await getProject()
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
                      <th style="width: 30%">Project Id</th>
                      <td>{{ project.id }}</td>
                    </tr>
                    <tr>
                      <th>Name</th>
                      <td>{{ project.name }}</td>
                    </tr>
                    <tr>
                      <th>Live URL</th>
                      <td>{{ project.live_url }}</td>
                    </tr>
                    <tr>
                      <th>Demo URL</th>
                      <td>{{ project.demo_url }}</td>
                    </tr>
                    <tr>
                      <th>Started At</th>
                      <td>{{ project.started_at }}</td>
                    </tr>
                    <tr>
                      <th>Is Live</th>
                      <td>{{ project.is_live ? 'Yes' : 'No' }}</td>
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
            <div class="card-header">
              <h5 class="card-title mb-0">Latest Tasks</h5>
            </div>
            <div class="text-end"></div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>ID</th>
                      <th>Assignee</th>
                      <th>Description</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(task, i) in project.tasks" :key="task.id">
                      <td>{{ i + 1 }}</td>
                      <td>{{ task.id }}</td>
                      <td>{{ task.assignee.name }}</td>
                      <td>{{ task.description }}</td>
                      <td>
                        <span
                          :class="`badge text-bg-${task.status == 'created' ? 'info' : task.status == 'in_progress' ? 'primary' : task.status == 'on_hold' ? 'warning' : task.status == 'completed' ? 'success' : 'danger'}`"
                          >{{ task.status }}</span
                        >
                      </td>
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
            <div class="card-header">
              <h5 class="card-title mb-0">Repositories</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>URL</th>
                      <th>Provider</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="repo in project.repositories" :key="repo.id">
                      <td>{{ repo.name }}</td>
                      <td>
                        <a :href="repo.url" target="_blank">{{ repo.url }}</a>
                      </td>
                      <td>{{ repo.provider }}</td>
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
