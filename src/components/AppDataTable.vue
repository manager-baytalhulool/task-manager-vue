<script setup lang="ts" generic="Row extends { id: number }">
import { ref, computed, useSlots, watch } from 'vue'
import AppFeatherIcon from '@/components/AppFeatherIcon.vue'
import { useDebounce } from '@/composables/useDebounce'
import type { RowClass } from '@/types/DataTable'
import type { IColumn, Pagination } from '@/types/Pagination'

// type FormatterFn = (value: unknown) => unknown

// interface Column {
//   field: string
//   label?: string
//   sortable?: boolean
//   editable?: boolean
//   formatter?: FormatterFn | null
//   width?: string | number | null
// }

// interface Pagination {
//   data: unknown[]
//   lastPage: number
//   currentPage: number
//   from?: number
//   to?: number
//   total?: number
//   prevPageUrl?: string | null
//   nextPageUrl?: string | null
// }

// withDefaults(
//   ,
//   {
//     rows: () => [],
//     rowClass: () => () => ({}),
//     loading: false,
//     showSearch: true,
//     pagination: null,
//     serverSide: false,
//     columnEditable: false,
//   },
// )

const props = withDefaults(
  defineProps<{
    // rows: Row[]
    rowClass?: RowClass<Row>
    columns: IColumn<Row>[]
    loading?: boolean
    showSearch?: boolean
    pagination: Pagination<Row>
    serverSide?: boolean
    columnEditable?: boolean
  }>(),
  {
    rowClass: () => () => ({}),
    serverSide: true,
    showSearch: true,
    columnEditable: false,
  },
)

const emit = defineEmits([
  'sort-change',
  'search-change',
  'page-change',
  'row-edit',
  'row-update',
  'row-delete',
])

// Reactive state
const searchQuery = ref('')
const sortField = ref('')
const sortDirection = ref('asc')

// Computed properties
const processedColumns = computed(() => {
  return props.columns.map((col) => ({
    field: col.field,
    label: col.label || col.field,
    sortable: col.sortable || false,
    // editable: col.editable || false,
    // formatter: col.formatter || null,
    // width: col.width || null,
  }))
})

const processedRows = computed(() => {
  if (props.serverSide) {
    return props.pagination.data
  }

  /* code for without server-side processing */
  // let filtered = [...props.rows]

  // Local search
  // if (searchQuery.value) {
  //   const query = searchQuery.value.toLowerCase()
  //   filtered = filtered.filter((row) => {
  //     return props.columns.some((column) => {
  //       const value = row[column.field]
  //       return value && value.toString().toLowerCase().includes(query)
  //     })
  //   })
  // }

  // Local sorting
  // if (sortField.value) {
  //   filtered.sort((a, b) => {
  //     let aVal = a[sortField.value]
  //     let bVal = b[sortField.value]

  //     if (typeof aVal === 'string') {
  //       aVal = aVal.toLowerCase()
  //       bVal = bVal.toLowerCase()
  //     }

  //     if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
  //     if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
  //     return 0
  //   })
  // }

  // return filtered

  return props.pagination.data
})

const hasActions = computed(() => {
  return props.columnEditable || !!useSlots().actions
})

const visiblePages = computed(() => {
  if (!props.pagination) return []

  const total = props.pagination.lastPage
  const current = props.pagination.currentPage
  const delta = 2
  const range = []

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }

  if (current - delta > 2) {
    range.unshift('...')
  }
  if (current + delta < total - 1) {
    range.push('...')
  }

  range.unshift(1)
  if (total > 1) range.push(total)

  return range
})

// Methods
const handleSearch = () => {
  isImmediateAction = true
  if (props.serverSide) {
    emit('search-change', searchQuery.value)
  }

  // Reset the flag
  setTimeout(() => {
    isImmediateAction = false
  }, 0)
}

const clearSearch = () => {
  isImmediateAction = true
  searchQuery.value = ''
  if (props.serverSide) {
    emit('search-change', '')
  }
  // Reset the flag
  setTimeout(() => {
    isImmediateAction = false
  }, 0)
}

const sortColumn = (field: string) => {
  if (!props.columns.find((col) => col.field === field && col.sortable)) {
    return
  }

  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }

  if (props.serverSide) {
    emit('sort-change', {
      field: sortField.value,
      direction: sortDirection.value,
    })
  }
}

const getSortIcon = () => {
  // if (sortField.value !== field) return "↕";
  // return sortDirection.value === "asc" ? "↑" : "↓";
  return sortDirection.value === 'asc' ? 'chevron-up' : 'chevron-down'
}

const formatValue = (value: unknown) => {
  // , column: Column
  // if (column.formatter && typeof column.formatter === 'function') {
  //   return column.formatter(value)
  // }
  return value
}

const changePage = (page: number | string) => {
  if (typeof page === 'string') return
  if (!props.pagination || page < 1 || page > props.pagination.lastPage) return
  emit('page-change', page)
}

// Watch for external changes
// watch(
//  () => props.rows,
//  () => {
//    editingRowId.value = null;
//    editedData.value = {};
//  }
//);

const debouncedSearch = useDebounce(searchQuery, 500)
// Store the watcher so we can temporarily disable it
let isImmediateAction = false

watch(debouncedSearch, (newValue) => {
  console.log(newValue)
  if (!isImmediateAction && props.serverSide) {
    emit('search-change', newValue)
  }
})
</script>

<!-- DataTable.vue -->
<template>
  <div class="datatable-wrapper">
    <!-- Global Search -->
    <div class="datatable-header" v-if="showSearch || $slots.header">
      <slot name="header">
        <form
          class="row row-cols-md-auto g-3 align-items-center mb-3"
          @submit.prevent="handleSearch"
          v-if="showSearch"
        >
          <div class="col-12">
            <label class="visually-hidden" for="datatable-search">Search</label>
            <input
              type="text"
              class="form-control"
              id="datatable-search"
              placeholder="Search"
              v-model="searchQuery"
            />
          </div>
          <div class="col-12">
            <button @click="clearSearch" class="btn btn-primary" v-if="searchQuery" type="button">
              Clear
            </button>
          </div>
        </form>
      </slot>
    </div>

    <!-- Loading State -->
    <div class="loading-overlay" v-if="loading">
      <div class="loading-spinner"></div>
      <span>Loading...</span>
    </div>

    <!-- Table Container -->
    <div class="table-responsive" :class="{ loading: loading }">
      <table class="table table-bordered table-hover">
        <thead>
          <tr>
            <th v-for="column in processedColumns" :key="column.field">
              <div class="header-cell">
                <span>{{ column.label }}</span>
                <span
                  v-if="column.sortable"
                  @click="sortColumn(column.field as string)"
                  class="cursor-pointer sort-btn mx-1"
                >
                  <AppFeatherIcon v-if="sortField !== column.field" :icon="getSortIcon()" />
                  <AppFeatherIcon v-else icon="sliders" />
                </span>
              </div>
            </th>
            <th v-if="hasActions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!loading && processedRows.length === 0">
            <td :colspan="processedColumns.length + (hasActions ? 1 : 0)" class="no-data">
              No data available
            </td>
          </tr>
          <tr
            v-for="(row, index) in processedRows"
            :key="row.id || index"
            :class="[{ 'even-row': index % 2 === 0 }, rowClass(row, index)]"
          >
            <td v-for="column in processedColumns" :key="column.field">
              <template v-if="column.field != 'actions'">
                <slot
                  :name="`cell-${column.field as string}`"
                  :row="row"
                  :value="row[column.field]"
                  :rowIndex="index"
                >
                  <!-- , column -->
                  {{ formatValue(row[column.field]) }}
                </slot>
              </template>
              <slot
                v-else
                :name="`cell-actions`"
                :row="row"
                :value="'actions'"
                :rowIndex="index"
              ></slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      class="pagination-container d-flex flex-column align-items-end justify-content-center gap-2"
      v-if="pagination"
    >
      <div class="pagination-info">
        Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} entries
      </div>

      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item" :class="pagination.currentPage == 1 ? 'disabled' : ''">
            <a
              class="page-link"
              href="#"
              @click.prevent="changePage(pagination.currentPage - 1)"
              :disabled="!(pagination.currentPage == 1)"
              >Previous</a
            >
          </li>
          <li
            class="page-item"
            :class="page === pagination.currentPage ? 'active' : ''"
            v-for="page in visiblePages"
            :key="page"
          >
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
          </li>
          <li
            class="page-item"
            :class="pagination.currentPage < pagination.lastPage ? '' : 'disabled'"
          >
            <a
              class="page-link"
              href="#"
              @click="changePage(pagination.currentPage + 1)"
              :disabled="!(pagination.currentPage < pagination.lastPage)"
              >Next</a
            >
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style></style>
