<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import FormInput from '@/components/form/FormInput.vue'
import FormSelect from '@/components/form/FormSelect.vue'

const route = useRoute()
const id = route.params.id

const router = useRouter()

/* data */
const isEditMode = id ? true : false

const formBody = ref<any>({
  name: '',
  email: '',
  quantity: 1,
  price: '',
  discounted_price: '',
  size: '',
  color: ''
})

const getProduct = async (id: any) => {
  const response = await axios.get(`/api/products/${id}`)
  const product = response.data
  const obj = {
    name: product.name,
    category_id: product.category_id,
    price: product.price,
    discounted_price: product.discounted_price,
    image: product.image,
    size: product.size,
    color: product.color,
    quantity: product.quantity
  }
  formBody.value = obj
}

const handleSubmit = async () => {
  try {
    const response = await saveProduct(formBody.value)
    alert(response.data.message)
    router.push(`/products`)
    // json.value = {
    //   name: null,
    //   category_id: 1,
    // }
  } catch (ex) {
    console.log(ex)
  }
}

const saveProduct = (data: any) => {
  if (id) {
    data['_method'] = 'PUT'
    return axios.post(`/api/products/${id}`, data)
  }
  return axios.post(`/api/products`, data)
}

onMounted(() => {
  if (id) {
    getProduct(id)
  }
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
                    <FormSelect name="role_id" label="Role" v-model="formBody.role_id" :items="[]"/>
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
