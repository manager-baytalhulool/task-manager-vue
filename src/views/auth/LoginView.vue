<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import type { LoginPayload } from '@/types/Auth'

import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const formBody = ref<LoginPayload>({
  email: '',
  password: '',
  device_name: window.navigator.userAgent,
})
const isLoading = ref<boolean>(false)

const handleSubmit = async () => {
  isLoading.value = true
  try {
    await authStore.login(formBody.value)
    router.push('/')
  } catch (error: unknown) {
    console.log(error)
  }
  isLoading.value = false
}
</script>

<template>
  <div class="d-table-cell align-middle">
    <div class="text-center mt-4">
      <h1 class="h2">Welcome back!</h1>
      <p class="lead">Sign in to your account to continue</p>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="m-sm-3">
          <form method="post" @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input
                class="form-control form-control-lg"
                type="email"
                name="email"
                placeholder="Enter your email"
                v-model="formBody.email"
                autofocus
                autocomplete="username"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input
                class="form-control form-control-lg"
                type="password"
                name="password"
                placeholder="Enter your password"
                v-model="formBody.password"
                autocomplete="current-password"
              />
            </div>
            <!-- <div>
              <div class="form-check align-items-center">
                <input
                  id="customControlInline"
                  type="checkbox"
                  class="form-check-input"
                  value="remember-me"
                  name="remember-me"
                  checked
                />
                <label class="form-check-label text-small" for="customControlInline"
                  >Remember me</label
                >
              </div>
            </div> -->
            <div class="d-grid gap-2 mt-3">
              <!-- <a href="index.html" class="btn btn-lg btn-primary">Sign in</a> -->
              <button class="btn btn-lg btn-primary" type="button" disabled v-if="isLoading">
                <span
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Loading...
              </button>
              <button class="btn btn-lg btn-primary" type="submit" v-else>Sign in</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- <div class="text-center mb-3">
      Don't have an account? <a href="pages-sign-up.html">Sign up</a>
    </div> -->
  </div>
</template>
