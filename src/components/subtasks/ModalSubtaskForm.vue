<script setup lang="ts">
import vSelect from 'vue-select'
import { onMounted, ref, toRefs, watch } from 'vue'
import api from '@/plugins/axios'
import type { TaskIndex } from '@/types/Task'
import type { BaseEntity } from '@/types/BaseEntity'
import type { SubtaskIndex } from '@/types/Subtask'

const tasks = ref([])
const selectedTask = ref<BaseEntity | null>(null)
// const selectedSubtask = ref<BaseEntity | null>(null)
const description = ref('')
const sortNo = ref('')

async function fetchTasks() {
  const res = await api.get('/api/tasks', {
    params: { for: 'select' },
  })
  tasks.value = res.data.data.tasks
}

async function handleSubmit() {
  let selectedTaskId = null
  selectedTaskId = selectedTask.value ? selectedTask.value.id : null

  let response = null
  try {
    if (selectedSubtask.value) {
      response = await api.put(`api/subtasks/${selectedSubtask.value.id}`, {
        description: description.value,
        task_id: selectedTaskId,
        sort_no: sortNo.value,
      })
    } else {
      response = await api.post('/api/subtasks', {
        description: description.value,
        task_id: selectedTaskId,
        sort_no: sortNo.value,
      })
    }
    emits('subtaskCreated', response.data.data.subtask)
  } catch {}
}

onMounted(() => {
  fetchTasks()
})

const props = defineProps<{
  selectedSubtask: SubtaskIndex | null
}>()

const emits = defineEmits<{
  (e: 'subtaskCreated', subtask: SubtaskIndex): void
}>()

const { selectedSubtask } = toRefs(props)

function setForm() {
  if (props.selectedSubtask) {
    description.value = props.selectedSubtask.description
    sortNo.value = props.selectedSubtask.sort_no.toString()
  } else {
    description.value = ''
    sortNo.value = ''
  }
}

watch(selectedSubtask, async () => {
  setForm()
})
</script>

<template>
  <div
    class="modal fade"
    id="addSubtaskFormModal"
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
              <input v-model="description" type="text" class="form-control" id="recipient-name" />
            </div>

            <div class="mb-3">
              <label for="message-text" class="col-form-label">Sort No:</label>
              <input v-model="sortNo" type="number" class="form-control" id="sort-no" />
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
