<script setup lang="ts">
import vSelect from 'vue-select'
import { onMounted, ref, toRefs, watch } from 'vue'
import api from '@/plugins/axios'
import type { TaskIndex } from '@/types/Task'

const users = ref([])
const selectedUser = ref<any>(null)
const description = ref('')

async function fetchUsers() {
  const res = await api.get('/api/users', {
    params: { for: 'select' },
  })
  users.value = res.data.data.users
}

async function handleSubmit(params: type) {
  let selectedUserId = null
  selectedUserId = selectedUser.value ? selectedUser.value.id : null

  const response = await api.post('/api/tasks', {
    description: description.value,
    assignee_id: selectedUserId,
  })
}


onMounted(() => {
  fetchUsers()
})

const props = defineProps<{
  selectedTask: TaskIndex | null
}>()

const {selectedTask} = toRefs(props);

function setForm() {
  if (props.selectedTask) {
    description.value = props.selectedTask.description;
    selectedUser.value = props.selectedTask.assignee_id;
  }
}

watch(selectedTask, async () => {
setForm();

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

            <h1 class="modal-title fs-5" id="taskFormModalLabel">{{ selectedTask ? 'Edit' : 'Create'}} Task</h1>
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
              <input v-model="description" type="text" class="form-control" id="recipient-name" />
            </div>
            <div class="mb-3">
              <label for="message-text" class="col-form-label">Assignee:</label>
              <v-select label="name" v-model="selectedUser" :options="users" />
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
