<script setup lang="ts">
import { Modal } from 'bootstrap'
import ModalTaskForm from '@/components/tasks/ModalTaskForm.vue'
import AppModalDelete from '@/components/AppModalDelete.vue'
import { onMounted, ref } from 'vue'
// import { RouterLink } from 'vue-router'

import api from '@/plugins/axios'
import type { TaskIndex } from '@/types/Task'
// import { useDataTable } from '@/composables/useDataTable'

const tasks = ref<TaskIndex[]>([])
let modalTaskForm: Modal | null = null

let modalDelete: Modal | null = null

const warningMessage= ref<string>("")

const selectedTask = ref<TaskIndex | null>(null)

// let selectedSeasonalPlanId: any = null;

const getTasks = async () => {
  const url = `/api/tasks`
  const response = await api.get(url)
  // return response.data.data.tasks
  tasks.value = response.data.data.tasks.data
}

const handleDelete = async () => {
//   const url = `https://first-touch-dev-default-rtdb.europe-west1.firebasedatabase.app/Seasonal_Plans/${selectedSeasonalPlanId}.json`;
  try {
    await api.delete(`api/tasks/${selectedTask.value!.id}`, {});
    const selectedTaskIndex = tasks.value.findIndex((t)=> t.id == selectedTask.value!.id)
    tasks.value.splice(selectedTaskIndex, 1)

//     delete seasonalPlans.value[selectedSeasonalPlanId];
  } catch (ex) {
    console.log(ex);
    alert("something went wrong");
  }

  modalDelete.hide();
};

const handleDeleteClick = (task: TaskIndex, index: number) => {
  console.log(task, index)
  selectedTask.value = task
  //   selectedSeasonalPlanId = id;
    warningMessage.value = `Are you sure want to delete task number <strong>${selectedTask.value!.id}</strong>`;
    modalDelete!.show();
}

const handleAddNewClick = () => {
  selectedTask.value = null
  modalTaskForm.show()
}

const handleEditClick = (task) => {
  selectedTask.value = task
  modalTaskForm.show()
}

const handleTaskCreated = (task: TaskIndex) => {
  console.log('task created')
  if (selectedTask.value) {
    const selectedTaskIndex = tasks.value.findIndex((t)=> t.id == selectedTask.value!.id)
    tasks.value[selectedTaskIndex] = task;
  } else {
    tasks.value.push(task)
  }

  modalTaskForm.hide()
}

// const { pagination, handlePageChange, handleSearchChange } = useDataTable({
//   fetchFunction: getTasks,
// })

onMounted(async () => {
  await getTasks()
  modalDelete = new Modal(document.getElementById("modal-delete"), {});
  modalTaskForm = new Modal(document.getElementById('taskFormModal'))
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
              <div class="table-responsive">
                <table class="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Assignee</th>
                      <th>Task</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(task, index) in tasks" :key="index">
                      <td>{{ index != null ? index + 1 : '' }}</td>
                      <td>{{ task.assignee.name }}</td>

                      <td>{{ task.description }}</td>
                      <td>{{ task.status }}</td>
                      <td class="text-nowrap">
                        <!-- <RouterLink :to="`/agreements/${index}`">
                          <button class="btn btn-primary btn-sm">View</button>
                        </RouterLink>
                        <RouterLink :to="`/agreements/${index}/print`">

                        </RouterLink> -->
                        <div class="d-flex gap-1">
                          <button class="btn btn-info btn-sm">Start</button>
                          <button class="btn btn-warning btn-sm">Stop</button>
                          <button class="btn btn-info btn-sm">Complete</button>
                          <button @click="handleEditClick(task)" class="btn btn-info btn-sm">
                            Edit
                          </button>
                          <button
                            class="btn btn-danger btn-sm"
                            @click="handleDeleteClick(task, index)"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AppModalDelete @onSubmit="handleDelete" :message="warningMessage" />
    <ModalTaskForm :selectedTask="selectedTask" @taskCreated="handleTaskCreated" />
  </main>
</template>
