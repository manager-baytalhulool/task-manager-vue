<script setup lang="ts">
// import vSelect from 'vue-select'
import { ref, toRefs, watch } from 'vue'
// import api from '@/plugins/axios'
// import type { TaskIndex } from '@/types/Task'
// import type { BaseEntity } from '@/types/BaseEntity'
// import type { SubtaskIndex } from '@/types/Subtask'
// import { useRoute } from 'vue-router'

// const props = defineProps<{
//   selectedSubtask: SubtaskIndex | null
//   taskId: number | null
// }>()

// const route = useRoute()
// const tasks = ref([])
// const selectedTask = ref<BaseEntity | null>(null)
// // const selectedSubtask = ref<BaseEntity | null>(null)
// const selectedTaskId = props.taskId || Number(route.params.id)

import type { SubtaskIndex } from '@/types/Subtask'

const props = defineProps<{
  selectedSubtask: SubtaskIndex | null
}>()

const description = ref('')
const sortNo = ref('')

// async function fetchTasks() {
//   const res = await api.get('/api/tasks', {
//     params: { for: 'select' },
//   })
//   tasks.value = res.data.data.tasks
// }

// async function handleSubmit() {
//   let response = null

//   const payload = {
//     description: description.value,
//     task_id: selectedTaskId,
//     sort_no: sortNo.value,
//   }

//   try {
//     if (props.selectedSubtask) {
//       // Update existing subtask
//       response = await api.put(`api/subtasks/${props.selectedSubtask.id}`, payload)
//     } else {
//       // Create new subtask
//       response = await api.post('/api/subtasks', payload)
//     }
//     emits('subtaskCreated', response.data.data.subtask)
//   } catch (error) {
//     console.error('Submission failed:', error)
//   }
// }

async function handleSubmit() {
  const payload = {
    description: description.value,
    sort_no: sortNo.value,
  }
  emits('submit', payload)
}

// onMounted(() => {
//   fetchTasks()
// })

// const emits = defineEmits<{
//   (e: 'subtaskCreated', subtask: SubtaskIndex): void
// }>()

const emits = defineEmits<{
  (e: 'submit', payload: any): void
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
              {{ selectedSubtask ? 'Edit' : 'Create' }} Subtask
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
            <button type="submit" class="btn btn-primary">
              {{ selectedSubtask ? 'Update' : 'Save' }} Subtask
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
