<script setup lang="ts">
import { Modal } from 'bootstrap'
// import ModalUserForm from '@/components/users/ModalUserForm.vue'
import AppModalDelete from '@/components/AppModalDelete.vue'
import { onMounted, ref } from 'vue'
// import { RouterLink } from 'vue-router'

import api from '@/plugins/axios'
import type { UserIndex } from '@/types/User'
// import { useDataTable } from '@/composables/useDataTable'

const users = ref<UserIndex[]>([])
// let modalUserForm: Modal | null = null

let modalDelete: Modal | null = null

const warningMessage= ref<string>("")

const selectedUser = ref<UserIndex | null>(null)

// let selectedSeasonalPlanId: any = null;

const getUsers = async () => {
  const url = `/api/users`
  const response = await api.get(url)
  // return response.data.data.users
  users.value = response.data.data.users.data
}

const handleDelete = async () => {
//   const url = `https://first-touch-dev-default-rtdb.europe-west1.firebasedatabase.app/Seasonal_Plans/${selectedSeasonalPlanId}.json`;
  try {
    await api.delete(`api/users/${selectedUser.value!.id}`, {});
    const selectedUserIndex = users.value.findIndex((u)=> u.id == selectedUser.value!.id)
    users.value.splice(selectedUserIndex, 1)

//     delete seasonalPlans.value[selectedSeasonalPlanId];
  } catch (ex) {
    console.log(ex);
    alert("something went wrong");
  }

  modalDelete.hide();
};

const handleDeleteClick = (user: UserIndex, index: number) => {
  console.log(user, index)
  selectedUser.value = user
  //   selectedSeasonalPlanId = id;
    warningMessage.value = `Are you sure want to delete this user <strong>${selectedUser.value!.id}</strong>`;
    modalDelete!.show();
}

// const handleAddNewClick = () => {


//   selectedUser.value = null
//   modalUserForm.show()
// }

const handleEditClick = (user) => {
  selectedUser.value = user
  // modalUserForm.show()
}

const handleUserCreated = (user: UserIndex) => {
  console.log('user created')
  if (selectedUser.value) {
    const selectedUserIndex = users.value.findIndex((t)=> t.id == selectedUser.value!.id)
    users.value[selectedUserIndex] = user;
  } else {
    users.value.push(user)
  }

  // modalUserForm.hide()
}

// const { pagination, handlePageChange, handleSearchChange } = useDataTable({
//   fetchFunction: getUsers,
// })

onMounted(async () => {
  await getUsers()
  modalDelete = new Modal(document.getElementById("modal-delete"), {});
  // modalUserForm = new Modal(document.getElementById('userFormModal'))
})
</script>

<template>
  <main class="content">
    <div class="container-fluid p-0">
      <h1 class="h3 mb-3">Users</h1>

      <div class="row">
        <div class="col-12">
          <div class="mb-3 text-end">
            <RouterLink to="/users/create">
              <button class="btn btn-primary ms-1">Add new</button>
            </RouterLink>
          </div>

          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Manage Users</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Role</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(user, index) in users" :key="index">
                      <td>{{ index != null ? index + 1 : '' }}</td>
                      <td>{{ user.role.name }}</td>

                      <td>{{ user.name }}</td>
                      <td>{{ user.email }}</td>
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

                          <RouterLink :to="`/users/${user.id}/edit`">

                            <button @click="handleEditClick(user)" class="btn btn-info btn-sm">
                              Edit
                            </button>
                        </RouterLink>
                          <button
                            class="btn btn-danger btn-sm"
                            @click="handleDeleteClick(user, index)"
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
    <!-- <ModalUserForm :selectedUser="selectedUser" @userCreated="handleUserCreated" /> -->
  </main>
</template>
