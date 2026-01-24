<script setup lang="ts">
import AppSidebarItem from '@/components/AppSidebarItem.vue'
const appName = import.meta.env.VITE_APP_NAME
</script>

<template>
  <nav id="sidebar" class="sidebar js-sidebar">
    <div class="sidebar-content js-simplebar">
      <RouterLink class="sidebar-brand" to="">
        <span class="align-middle">{{ appName }}</span>
      </RouterLink>

      <ul class="sidebar-nav">
        <li class="sidebar-header">Pages</li>

        <!-- active -->
        <!-- <li class="sidebar-item">
          <RouterLink class="sidebar-link" to="/">
            <i class="align-middle" data-feather="sliders"></i>
            <span class="align-middle">Dashboard</span>
          </RouterLink>
        </li> -->

        <AppSidebarItem icon="sliders" text="Dashboard" url="/" />

        <!-- <li class="sidebar-item">
          <a
            data-bs-target="#accounts"
            data-bs-toggle="collapse"
            class="sidebar-link collapsed"
            aria-expanded="false"
          >
            <AppFeatherIcon icon="book-open" />
            <span class="align-middle">Accounts</span>
          </a>
          <ul
            id="accounts"
            class="sidebar-dropdown list-unstyled collapse"
            data-bs-parent="#sidebar"
            style=""
          >
            <li class="sidebar-item">
              <RouterLink class="sidebar-link" to="/accounts/account-heads"
                >Account Heads</RouterLink
              >
            </li>
            <li class="sidebar-item">
              <RouterLink class="sidebar-link" to="/accounts/trial-balance"
                >Trial Balance</RouterLink
              >
            </li>
          </ul>
        </li> -->

        <AppSidebarItem icon="users" text="Projects" url="/projects" />
        <AppSidebarItem icon="database" text="Tasks" url="/tasks" />
        <AppSidebarItem icon="users" text="Users" url="/users" />
      </ul>
    </div>
  </nav>
</template>
