<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <main class="d-flex w-100">
    <div class="container d-flex flex-column">
      <div class="row vh-100">
        <div class="col-sm-10 col-md-8 col-lg-6 col-xl-5 mx-auto d-table h-100">
          <RouterView />
        </div>
      </div>
    </div>
  </main>
</template>
