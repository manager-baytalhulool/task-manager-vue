<script setup lang="ts">
import vSelect from 'vue-select'
import { onMounted, ref, toRefs, watch } from 'vue'
import api from '@/plugins/axios'
import type { TaskIndex } from '@/types/Task'
import type { BaseEntity } from '@/types/BaseEntity'

const users = ref([])
const projects = ref([])
const selectedUser = ref<BaseEntity | null>(null)
const selectedProject = ref<BaseEntity | null>(null)
const description = ref('')

async function fetchUsers() {
  const res = await api.get('/api/users', {
    params: { for: 'select' },
  })
  users.value = res.data.data.users
}

async function fetchProjects() {
  const res = await api.get('/api/projects', {
    params: { for: 'select' },
  })
  projects.value = res.data.data.projects
}

async function handleSubmit() {
  let selectedUserId = null
  let selectedProjectId = null
  selectedUserId = selectedUser.value ? selectedUser.value.id : null
  selectedProjectId = selectedProject.value ? selectedProject.value.id : null

  let response = null
  try {
    if (selectedTask.value) {
      response = await api.put(`api/tasks/${selectedTask.value.id}`, {
        description: description.value,
        assignee_id: selectedUserId,
        project_id: selectedProjectId,
      })
    } else {
      response = await api.post('/api/tasks', {
        description: description.value,
        assignee_id: selectedUserId,
        project_id: selectedProjectId,
      })
    }
    emits('taskCreated', response.data.data.task)
  } catch {}
}

onMounted(() => {
  fetchUsers()
  fetchProjects()
})

const props = defineProps<{
  selectedTask: TaskIndex | null
}>()

const emits = defineEmits<{
  (e: 'taskCreated', task: TaskIndex): void
}>()

const { selectedTask } = toRefs(props)

function setForm() {
  if (props.selectedTask) {
    description.value = props.selectedTask.description
    selectedUser.value = props.selectedTask.assignee
    selectedProject.value = props.selectedTask.project
  } else {
    description.value = ''
    selectedUser.value = null
    selectedProject.value = null
  }
}

watch(selectedTask, async () => {
  setForm()
})
</script>

<template>
  <div
    class="modal fade"
    id="taskFormModal"
    tabindex="-1"
    aria-labelledby="taskFormModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <form v-on:submit.prevent="handleSubmit">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="taskFormModalLabel">
              {{ selectedTask ? 'Edit' : 'Create' }} Task
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="recipient-name" class="col-form-label">Description:</label>
              <textarea
                v-model="description"
                class="form-control"
                id="recipient-name"
                rows="3"
              ></textarea>
            </div>
            <div class="mb-3">
              <label for="message-text" class="col-form-label">Assignee:</label>
              <v-select label="name" v-model="selectedUser" :options="users" />
            </div>
            <div class="mb-3">
              <label for="message-text" class="col-form-label">Project:</label>
              <v-select label="name" v-model="selectedProject" :options="projects" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
