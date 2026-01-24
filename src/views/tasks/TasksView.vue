<script setup lang="ts">
import { Modal } from 'bootstrap'
import ModalTaskForm from '@/components/tasks/ModalTaskForm.vue'
import AppModalDelete from '@/components/AppModalDelete.vue'
import { onMounted, ref } from 'vue'
// import { RouterLink } from 'vue-router'

import api from '@/plugins/axios'
import type { TaskIndex } from '@/types/Task'
import AppDataTable from '@/components/AppDataTable.vue'
import { useDataTable } from '@/composables/useDataTable'
import type { IColumn, PaginationParams } from '@/types/Pagination'
import { TaskStatusEnum } from '@/enums/TaskStatusEnum'
// import { useDataTable } from '@/composables/useDataTable'

const tasks = ref<TaskIndex[]>([])
let modalTaskForm: Modal | null = null

let modalDelete: Modal | null = null

const warningMessage = ref<string>('')

const selectedTask = ref<TaskIndex | null>(null)

// let selectedSeasonalPlanId: any = null;
const columns: IColumn<TaskIndex>[] = [
  { label: '#', field: 'serial_number' },
  { label: 'ID', field: 'id', sortable: true },
  { label: 'Assignee', field: 'assignee_id', sortable: true },
  { label: 'Description', field: 'description', sortable: true },
  { label: 'Project', field: 'project_id', sortable: true },
  { label: 'Status', field: 'status', sortable: true },
  { label: 'Actions', field: 'actions' },
]

const taskStatusActionsEnum: Record<string, string> = {
  start: 'InProgress',
  hold: 'OnHold',
  complete: 'Completed',
}

const getTasks = async (params: PaginationParams) => {
  const url = `/api/tasks`
  const response = await api.get(url, { params: params })
  tasks.value = response.data.data.tasks.data
  return response.data.data.tasks
}

const handleDelete = async () => {
  //   const url = `https://first-touch-dev-default-rtdb.europe-west1.firebasedatabase.app/Seasonal_Plans/${selectedSeasonalPlanId}.json`;
  try {
    await api.delete(`api/tasks/${selectedTask.value!.id}`, {})
    const selectedTaskIndex = tasks.value.findIndex((t) => t.id == selectedTask.value!.id)
    tasks.value.splice(selectedTaskIndex, 1)

    //     delete seasonalPlans.value[selectedSeasonalPlanId];
  } catch (ex) {
    console.log(ex)
    alert('something went wrong')
  }

  modalDelete!.hide()
}

const handleDeleteClick = (task: TaskIndex, index: number) => {
  console.log(task, index)
  selectedTask.value = task
  //   selectedSeasonalPlanId = id;
  warningMessage.value = `Are you sure want to delete task number <strong>${selectedTask.value!.id}</strong>`
  modalDelete!.show()
}

const handleAddNewClick = () => {
  selectedTask.value = null
  modalTaskForm!.show()
}

const handleEditClick = (task: TaskIndex) => {
  selectedTask.value = task
  modalTaskForm!.show()
}

const handleTaskCreated = (task: TaskIndex) => {
  console.log('task created')
  if (selectedTask.value) {
    const selectedTaskIndex = tasks.value.findIndex((t) => t.id == selectedTask.value!.id)
    tasks.value[selectedTaskIndex] = task
  } else {
    tasks.value.push(task)
  }

  modalTaskForm!.hide()
}

const handleTaskStatusChange = async (task: TaskIndex, action: string) => {
  try {
    await api.put(`api/tasks/${task.id}`, {
      status:
        action === taskStatusActionsEnum.start
          ? TaskStatusEnum.InProgress
          : action === taskStatusActionsEnum.hold
            ? TaskStatusEnum.OnHold
            : TaskStatusEnum.Completed,
    })
  } catch (ex) {
    console.log(ex)
    alert('something went wrong')
    return
  }
  selectedTask.value = task
  if (action === taskStatusActionsEnum.start) {
    selectedTask.value.status = TaskStatusEnum.InProgress
  } else if (action === taskStatusActionsEnum.hold) {
    selectedTask.value.status = TaskStatusEnum.OnHold
  } else if (action === taskStatusActionsEnum.complete) {
    selectedTask.value.status = TaskStatusEnum.Completed
  }
}

const { pagination, handlePageChange, handleSearchChange } = useDataTable<TaskIndex>({
  fetchFunction: getTasks,
})

onMounted(async () => {
  const deleteModal = document.getElementById('modal-delete')
  const taskModal = document.getElementById('taskFormModal')
  if (deleteModal) modalDelete = new Modal(deleteModal, {})
  if (taskModal) modalTaskForm = new Modal(taskModal)
})
</script>

<template>
  <main class="content">
    <div class="container-fluid p-0">
      <h1 class="h3 mb-3">Tasks</h1>

      <div class="row">
        <div class="col-12">
          <div class="mb-3 text-end">
            <button class="btn btn-primary ms-1" @click="handleAddNewClick">Add new</button>
            <!-- <RouterLink to="/tasks/create">
            </RouterLink> -->
          </div>

          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Manage Tasks</h5>
            </div>
            <div class="card-body">
              <AppDataTable
                :pagination="pagination"
                :columns="columns"
                @page-change="handlePageChange"
                @search-change="handleSearchChange"
              >
                <template #cell-serial_number="{ rowIndex: index }">
                  {{ index + 1 }}
                </template>
                <template #cell-assignee_id="{ row: task }">
                  {{ task.assignee.name }}
                </template>
                <template #cell-description="{ row: task }">
                  <RouterLink :to="`/tasks/${task.id}`" target="_blank">
                    {{ task.description }}</RouterLink
                  >
                </template>
                <template #cell-project_id="{ row: task }">
                  {{ task.project.name }}
                </template>
                <template #cell-actions="{ row: task, rowIndex: index }">
                  <div class="d-flex gap-1">
                    <button
                      class="btn btn-info btn-sm"
                      @click="handleTaskStatusChange(task, taskStatusActionsEnum.start!)"
                    >
                      Start
                    </button>
                    <button
                      class="btn btn-warning btn-sm"
                      @click="handleTaskStatusChange(task, taskStatusActionsEnum.hold!)"
                    >
                      Hold
                    </button>
                    <button
                      class="btn btn-info btn-sm"
                      @click="handleTaskStatusChange(task, taskStatusActionsEnum.complete!)"
                    >
                      Complete
                    </button>
                    <button @click="handleEditClick(task)" class="btn btn-info btn-sm">Edit</button>
                    <button class="btn btn-danger btn-sm" @click="handleDeleteClick(task, index)">
                      Delete
                    </button>
                  </div>
                </template>
              </AppDataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AppModalDelete @onSubmit="handleDelete" :message="warningMessage" />
    <ModalTaskForm :selectedTask="selectedTask" @taskCreated="handleTaskCreated" />
  </main>
</template>
