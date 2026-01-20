<script setup lang="ts">
import { Modal } from 'bootstrap'
// import ModalUserForm from '@/components/users/ModalUserForm.vue'
import AppModalDelete from '@/components/AppModalDelete.vue'
import { onMounted, ref } from 'vue'
import AppDataTable from '@/components/AppDataTable.vue'
// import { RouterLink } from 'vue-router'

import api from '@/plugins/axios'
import type { ProjectIndex } from '@/types/Project'
import { useDataTable } from '@/composables/useDataTable'
import { useRouter } from 'vue-router'
import type { IColumn, PaginationParams } from '@/types/Pagination'
// import { useDataTable } from '@/composables/useDataTable'

const projects = ref<ProjectIndex[]>([])
const router = useRouter()
// let modalUserForm: Modal | null = null

let modalDelete: Modal | null = null

const warningMessage = ref<string>('')

const selectedProject = ref<ProjectIndex | null>(null)

const columns: IColumn<ProjectIndex>[] = [
  { label: 'ID', field: 'id', sortable: true },
  { label: 'Name', field: 'name', sortable: true },
  { label: 'Live URL', field: 'live_url', sortable: true },
  { label: 'Demo URL', field: 'demo_url', sortable: true },
  { label: 'Is Live', field: 'is_live', sortable: true },
  { label: 'Started At', field: 'started_at', sortable: true },
  { label: 'Actions', field: 'actions' },
]

// let selectedSeasonalPlanId: any = null;

const getProjects = async (params: PaginationParams) => {
  const url = `/api/projects`
  const response = await api.get(url, { params: params })

  projects.value = response.data.data.projects.data
  return response.data.data.projects
}

const handleDelete = async () => {
  //   const url = `https://first-touch-dev-default-rtdb.europe-west1.firebasedatabase.app/Seasonal_Plans/${selectedSeasonalPlanId}.json`;
  try {
    await api.delete(`api/projects/${selectedProject.value!.id}`, {})
    const selectedProjectIndex = projects.value.findIndex((p) => p.id == selectedProject.value!.id)
    projects.value.splice(selectedProjectIndex, 1)

    //     delete seasonalPlans.value[selectedSeasonalPlanId];
  } catch (ex) {
    console.log(ex)
    alert('something went wrong')
  }

  modalDelete!.hide()
}

const handleDeleteClick = (project: ProjectIndex, index: number) => {
  console.log(project, index)
  selectedProject.value = project
  //   selectedSeasonalPlanId = id;
  warningMessage.value = `Are you sure want to delete this project <strong>${selectedProject.value!.id}</strong>`
  modalDelete!.show()
}

// const handleAddNewClick = () => {

//   selectedUser.value = null
//   modalUserForm.show()
// }

const handleEditClick = (project: ProjectIndex) => {
  selectedProject.value = project
  router.push(`/projects/${project.id}/edit`)
  // modalUserForm.show()
}

const { pagination, handlePageChange, handleSearchChange } = useDataTable<ProjectIndex>({
  fetchFunction: getProjects,
})

onMounted(async () => {
  const modal = document.getElementById('modal-delete')
  if (modal) {
    modalDelete = new Modal(modal, {})
  }
})
</script>

<template>
  <main class="content">
    <div class="container-fluid p-0">
      <h1 class="h3 mb-3">Projects</h1>

      <div class="row">
        <div class="col-12">
          <div class="mb-3 text-end">
            <RouterLink to="/projects/create">
              <button class="btn btn-primary ms-1">Add new</button>
            </RouterLink>
          </div>

          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Manage Projects</h5>
            </div>
            <div class="card-body">
              <AppDataTable
                :columns="columns"
                :pagination="pagination"
                @page-change="handlePageChange"
                @search-change="handleSearchChange"
              >
                <template #cell-name="{ row: project }">
                  <RouterLink :to="`/projects/${project.id}`">
                    {{ project.name }}
                  </RouterLink>
                </template>
                <template #cell-is_live="{ row: project }">
                  {{ project.is_live ? 'Yes' : 'No' }}
                </template>
                <template #cell-actions="{ row: project, rowIndex: index }">
                  <div class="d-flex gap-1">
                    <button @click="handleEditClick(project)" class="btn btn-info btn-sm">
                      Edit
                    </button>
                    <button
                      class="btn btn-danger btn-sm"
                      @click="handleDeleteClick(project, index)"
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
  </main>
</template>
