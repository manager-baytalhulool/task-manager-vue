<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/plugins/axios'

import FormInput from '@/components/form/FormInput.vue'
import FormSelect from '@/components/form/FormSelect.vue'

const route = useRoute()
const id = route.params.id

const router = useRouter()

/* data */
const isEditMode = id ? true : false
const roles = ref<any[]>([])
const selectedUser = ref<any>(null)

const formBody = ref<any>({
  name: '',
  email: '',
  password: '',
  role_id: ''
})



const getRoles = async () => {
  const response = await api.get('/api/roles')
  roles.value = response.data.roles
}

const getUser = async () => {
  const response = await api.get(`/api/users/${id}`)
  selectedUser.value = response.data.data.user
}

const setForm = () => {

    formBody.value.name = selectedUser.value.name;
    formBody.value.email = selectedUser.value.email;
    formBody.value.password = selectedUser.value.password;
    formBody.value.role_id = selectedUser.value.role_id;
}

const handleSubmit = async () => {
  let selectedUserId = null
  selectedUserId = selectedUser.value ? selectedUser.value.id : null

  let response = null;
  if (isEditMode) {


    response = await api.put(`api/users/${id}`, {
      name: formBody.value.name,
      email: formBody.value.email,
      password: formBody.value.password,
      role_id: formBody.value.role_id,
    })
  } else {
    response = await api.post('/api/users', {
      name: formBody.value.name,
      email: formBody.value.email,
      password: formBody.value.password,
      role_id: formBody.value.role_id,
    })
  }

  alert(response.data.message);

  router.push('/users')
  // emits('userCreated', response.data.data.user)

}


onMounted( async () => {

  if(id) {
    await getUser();
    setForm();
  }
  await getRoles()

})
</script>

<template>
  <main class="content">
    <div class="container-fluid p-0">
      <h1 class="h3 mb-3">Products</h1>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <form action="" method="post" @submit.prevent="handleSubmit">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  {{ `${isEditMode ? 'Edit' : 'Add new'} User` }}
                </h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-sm-6">
                    <FormInput name="name" label="Name" v-model="formBody.name" type="text" />
                  </div>
                  <div class="col-sm-6">
                    <FormInput name="email" label="Email" v-model="formBody.email" type="email" />
                  </div>
                  <div class="col-sm-6">
                    <FormInput name="password" label="Password" v-model="formBody.password" type="password" />
                  </div>

                  <div class="col-sm-6">
                    <FormSelect
                      name="role_id"
                      label="Role"
                      v-model="formBody.role_id"
                      :items="roles"
                    />
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <div class="text-end">
                  <button type="submit" class="btn btn-success">Save</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
