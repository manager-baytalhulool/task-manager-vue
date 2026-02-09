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
import { useAuthStore } from '@/stores/authStore'
import type { IColumn, PaginationParams } from '@/types/Pagination'
import { TaskStatusEnum } from '@/enums/TaskStatusEnum'

const tasks = ref<TaskIndex[]>([])
const users = ref<any[]>([])
const projects = ref<any[]>([])
const authStore = useAuthStore()
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

const taskStatusActionsEnum = {
  start: 'InProgress',
  hold: 'OnHold',
  review: 'InReview',
  approve: 'CompletionApproved',
  reject: 'NeedsRevision',
} as const

const getTasks = async (params: PaginationParams) => {
  const url = `/api/tasks`
  const response = await api.get(url, { params: params })
  tasks.value = response.data.data.tasks.data
  return response.data.data.tasks
}

const fetchOptions = async () => {
  const [resUsers, resProjects] = await Promise.all([
    api.get('/api/users', { params: { for: 'select' } }),
    api.get('/api/projects', { params: { for: 'select' } }),
  ])
  users.value = resUsers.data.data.users
  projects.value = resProjects.data.data.projects
}

const handleDelete = async () => {
  //   const url = `https://first-touch-dev-default-rtdb.europe-west1.firebasedatabase.app/Seasonal_Plans/${selectedSeasonalPlanId}.json`;
  try {
    await api.delete(`api/tasks/${selectedTask.value!.id}`, {})
    const selectedTaskIndex = tasks.value.findIndex((t) => t.id == selectedTask.value!.id)
    tasks.value.splice(selectedTaskIndex, 1)
  } catch (ex) {
    console.log(ex)
    alert('something went wrong')
  }

  modalDelete!.hide()
}

const handleDeleteClick = (task: TaskIndex, index: number) => {
  console.log(task, index)
  selectedTask.value = task
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

const handleSaveTask = async (payload: any) => {
  try {
    let response
    if (selectedTask.value) {
      response = await api.put(`api/tasks/${selectedTask.value.id}`, payload)
      const index = tasks.value.findIndex((t) => t.id == selectedTask.value!.id)
      tasks.value[index] = response.data.data.task
    } else {
      response = await api.post('/api/tasks', payload)
      tasks.value.push(response.data.data.task)
    }
    modalTaskForm!.hide()
  } catch (error) {
    console.error('Task save failed', error)
  }
}

const handleTaskStatusChange = async (
  task: TaskIndex,
  action: (typeof taskStatusActionsEnum)[keyof typeof taskStatusActionsEnum],
) => {
  try {
    await api.put(`api/tasks/${task.id}`, {
      status:
        action === taskStatusActionsEnum.start
          ? TaskStatusEnum.InProgress
          : action === taskStatusActionsEnum.hold
            ? TaskStatusEnum.OnHold
            : action === taskStatusActionsEnum.review
              ? TaskStatusEnum.InReview
              : action === taskStatusActionsEnum.approve
                ? TaskStatusEnum.CompletionApproved
                : TaskStatusEnum.NeedsRevision,
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
  } else if (action === taskStatusActionsEnum.review) {
    selectedTask.value.status = TaskStatusEnum.InReview
  } else if (action === taskStatusActionsEnum.approve) {
    selectedTask.value.status = TaskStatusEnum.CompletionApproved
  } else if (action === taskStatusActionsEnum.reject) {
    selectedTask.value.status = TaskStatusEnum.NeedsRevision
  }
}

const { pagination, handlePageChange, handleSearchChange } = useDataTable<TaskIndex>({
  fetchFunction: getTasks,
})

onMounted(async () => {
  fetchOptions()
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
                <!-- <template #cell-actions="{ row: task, rowIndex: index }">
                  <div class="d-flex gap-1">
                    <button
                      class="btn btn-info btn-sm"
                      v-if="
                        task.status !== TaskStatusEnum.Completed &&
                        task.status !== TaskStatusEnum.InProgress
                      "
                      @click="handleTaskStatusChange(task, taskStatusActionsEnum.start!)"
                    >
                      Start
                    </button>
                    <button
                      class="btn btn-warning btn-sm"
                      v-if="
                        task.status !== TaskStatusEnum.Completed &&
                        task.status !== TaskStatusEnum.OnHold &&
                        task.status !== TaskStatusEnum.Created
                      "
                      @click="handleTaskStatusChange(task, taskStatusActionsEnum.hold!)"
                    >
                      Hold
                    </button>
                    <button
                      class="btn btn-info btn-sm"
                      v-if="
                        task.status !== TaskStatusEnum.Completed &&
                        task.status !== TaskStatusEnum.Created
                      "
                      @click="handleTaskStatusChange(task, taskStatusActionsEnum.complete!)"
                    >
                      Complete
                    </button>
                    <button
                      @click="handleEditClick(task)"
                      v-if="task.status !== TaskStatusEnum.Completed"
                      class="btn btn-info btn-sm"
                    >
                      Edit
                    </button>
                    <button class="btn btn-danger btn-sm" @click="handleDeleteClick(task, index)">
                      Delete
                    </button>
                  </div>
                </template> -->

                <template #cell-actions="{ row: task, rowIndex: index }">
                  <div class="d-flex gap-1">
                    <!-- Start/Resume Button -->
                    <button
                      class="btn btn-primary btn-sm"
                      v-if="
                        [
                          TaskStatusEnum.Created,
                          TaskStatusEnum.OnHold,
                          TaskStatusEnum.NeedsRevision,
                        ].includes(task.status) && authStore.user?.id === task.assignee_id
                      "
                      @click="handleTaskStatusChange(task, taskStatusActionsEnum.start)"
                    >
                      {{ task.status === TaskStatusEnum.NeedsRevision ? 'Fix & Start' : 'Start' }}
                    </button>

                    <!-- Hold Button -->
                    <button
                      class="btn btn-warning btn-sm"
                      v-if="
                        task.status === TaskStatusEnum.InProgress &&
                        authStore.user?.id === task.assignee_id
                      "
                      @click="handleTaskStatusChange(task, taskStatusActionsEnum.hold)"
                    >
                      Hold
                    </button>

                    <!-- Submit for Review (Developer Action) -->
                    <button
                      class="btn btn-info btn-sm"
                      v-if="
                        task.status === TaskStatusEnum.InProgress &&
                        authStore.user?.id === task.assignee_id
                      "
                      @click="handleTaskStatusChange(task, taskStatusActionsEnum.review)"
                    >
                      Submit for Review
                    </button>

                    <!-- Admin Approval Buttons -->
                    <template
                      v-if="
                        authStore.user?.role_id === 1 && task.status === TaskStatusEnum.InReview
                      "
                    >
                      <button
                        class="btn btn-success btn-sm"
                        @click="handleTaskStatusChange(task, taskStatusActionsEnum.approve)"
                      >
                        Approve
                      </button>
                      <button
                        class="btn btn-danger btn-sm"
                        @click="handleTaskStatusChange(task, taskStatusActionsEnum.reject)"
                      >
                        Reject
                      </button>
                    </template>

                    <!-- Edit/Delete (Only if not approved) -->
                    <button
                      @click="handleEditClick(task)"
                      v-if="task.status !== TaskStatusEnum.CompletionApproved"
                      class="btn btn-secondary btn-sm"
                    >
                      Edit
                    </button>
                    <button
                      class="btn btn-outline-danger btn-sm"
                      @click="handleDeleteClick(task, index)"
                    >
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
    <ModalTaskForm
      :selectedTask="selectedTask"
      :users="users"
      :projects="projects"
      @submit="handleSaveTask"
    />
  </main>
</template>
