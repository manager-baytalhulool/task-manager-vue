<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/plugins/axios'

import FormInput from '@/components/form/FormInput.vue'
import type { ProjectForm, ProjectIndex } from '@/types/Project'

const route = useRoute()
const id = route.params.id

const router = useRouter()

const isEditMode = id ? true : false
const selectedProject = ref<ProjectIndex | null>(null)

const formBody = ref<ProjectForm>({
  name: '',
  live_url: '',
  demo_url: '',
  is_live: '',
  started_at: null,
})

const getProject = async () => {
  const response = await api.get(`/api/projects/${id}`)
  selectedProject.value = response.data.data.project
}

const setForm = () => {
  formBody.value.name = selectedProject.value!.name
  formBody.value.live_url = selectedProject.value!.live_url
  formBody.value.demo_url = selectedProject.value!.demo_url
  formBody.value.is_live = selectedProject.value!.is_live
  formBody.value.started_at = selectedProject.value!.started_at
}

const handleSubmit = async () => {
  let response = null
  const data = {
    name: formBody.value.name,
    live_url: formBody.value.live_url,
    demo_url: formBody.value.demo_url,
    started_at: formBody.value.started_at,
    is_live: formBody.value.is_live,
  }

  if (isEditMode) {
    response = await api.put(`api/projects/${id}`, data)
  } else {
    response = await api.post('/api/projects', data)
  }

  alert(response.data.message)
  router.push('/projects')
}

onMounted(async () => {
  if (id) {
    await getProject()
    setForm()
  }
})
</script>

<template>
  <main class="content">
    <div class="container-fluid p-0">
      <h1 class="h3 mb-3">Projects</h1>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <form action="" method="post" @submit.prevent="handleSubmit">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  {{ `${isEditMode ? 'Edit' : 'Add new'} Project` }}
                </h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-sm-6">
                    <FormInput name="name" label="Name" v-model="formBody.name" type="text" />
                  </div>
                  <div class="col-sm-6">
                    <FormInput
                      name="live_url"
                      label="Live URL"
                      v-model="formBody.live_url"
                      type="text"
                    />
                  </div>
                  <div class="col-sm-6">
                    <FormInput
                      name="demo_url"
                      label="Demo URL"
                      v-model="formBody.demo_url"
                      type="text"
                    />
                  </div>
                  <div class="col-sm-6">
                    <FormInput
                      name="started_at"
                      label="Started At"
                      v-model="formBody.started_at"
                      type="date"
                    />
                  </div>
                  <div class="col-sm-6">
                    <div class="mb-3">
                      <label class="form-label">Is Live</label>
                      <select class="form-control" v-model="formBody.is_live">
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </select>
                    </div>
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
