<script setup lang="ts">
import ModalSubtaskForm from '@/components/subtasks/ModalSubtaskForm.vue'
import api from '@/plugins/axios'
import type { SubtaskIndex } from '@/types/Subtask'
import { Modal } from 'bootstrap'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const task = ref<any>({})
const isViewReady = ref<boolean>(false)
let addSubtaskModal: Modal | null = null
const selectedSubtask = ref<SubtaskIndex | null>(null)

const getTask = async () => {
  const id = route.params.id
  const url = `/api/tasks/${id}`
  const response = await api.get(url)
  task.value = response.data.data.task
}

const handleCheckboxToggle = async (task) => {
  const url = `/api/subtasks/${task.id}`
  if (task.completed_at !== null) {
    await api.put(url, {
      completed_at: task.completed_at,
    })
    task.completed_at = null
  } else {
    const response = await api.put(url, {
      completed_at: task.completed_at,
    })
    task.completed_at = response.data.data.subtask.completed_at
  }
}

const handleAddSubtaskClick = async () => {
  addSubtaskModal!.show()
}

const handleSubtaskCreated = (subtask: SubtaskIndex) => {
  task.value.subtasks.push(subtask)
  addSubtaskModal!.hide()
}

onMounted(() => {
  getTask()
  isViewReady.value = true
  const addSubtaskFormModal = document.getElementById('addSubtaskFormModal')
  if (addSubtaskFormModal) addSubtaskModal = new Modal(addSubtaskFormModal)
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
              <button class="btn btn-primary" @click="handleAddSubtaskClick">Add Subtask</button>
            </div>
            <div class="text-end"></div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Checkbox</th>
                      <th>Description</th>
                      <th>Completed At</th>
                      <th>Sort No</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(subtask, i) in task.subtasks" :key="subtask.id">
                      <td>{{ i + 1 }}</td>
                      <td>
                        <input
                          type="checkbox"
                          @change="handleCheckboxToggle(subtask)"
                          :checked="subtask.completed_at !== null"
                        />
                      </td>
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
    <ModalSubtaskForm @subtask-created="handleSubtaskCreated" />
  </main>
</template>
