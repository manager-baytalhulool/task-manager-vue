// composables/useDatatable.ts
import { ref, watch, onMounted } from 'vue'
import type { Ref } from 'vue'
import type { Pagination, PaginationParams, PaginationResponse } from '@/types/Pagination'

export interface DatatableOptions<Row> {
  fetchFunction: (params: PaginationParams) => Promise<PaginationResponse<Row>>
  initialPerPage?: number
  autoLoad?: boolean
  transformResponse?: (response: PaginationResponse<Row>) => Pagination<Row>
}

export function useDataTable<Row>(options: DatatableOptions<Row>) {
  const { fetchFunction, initialPerPage = 15, autoLoad = true, transformResponse } = options

  // State
  const pagination = ref<Pagination<Row>>({
    data: [],
    currentPage: 1,
    lastPage: 1,
    perPage: initialPerPage,
    total: 0,
    from: 0,
    to: 0,
  }) as Ref<Pagination<Row>>

  const params = ref<PaginationParams>({
    page: 1,
    per_page: initialPerPage,
    search: '',
  })

  const isLoading = ref(false)

  // Default transform function for Laravel pagination
  const defaultTransform = (responseData: PaginationResponse<Row>): Pagination<Row> => ({
    data: responseData.data,
    currentPage: responseData.current_page,
    total: responseData.total,
    lastPage: responseData.last_page,
    perPage: responseData.per_page,
    from: responseData.from,
    to: responseData.to,
  })

  // Fetch items from server
  const fetchServerItems = async (): Promise<Pagination<Row>> => {
    const responseData = await fetchFunction(params.value)
    const transform = transformResponse || defaultTransform
    return transform(responseData)
  }

  // Load data from server
  const loadFromServer = async () => {
    isLoading.value = true
    try {
      const paginatedData = await fetchServerItems()
      pagination.value = paginatedData
    } catch (error) {
      console.error('Error loading data:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Reload current page
  const reload = () => {
    loadFromServer()
  }

  // Page change handler
  const handlePageChange = (newPageNo: number) => {
    params.value = { ...params.value, page: newPageNo }
  }

  // Search change handler
  const handleSearchChange = (newValue: string) => {
    params.value = { ...params.value, page: 1, search: newValue }
  }

  // Per page change handler
  const handlePerPageChange = (newPerPage: number) => {
    params.value = { ...params.value, page: 1, per_page: newPerPage }
  }

  // Update params (for custom filters)
  const updateParams = (newParams: Partial<PaginationParams>) => {
    params.value = { ...params.value, ...newParams, page: 1 }
  }

  // Watch params for changes
  watch(
    params,
    () => {
      loadFromServer()
    },
    { deep: true },
  )

  // Auto load on mount
  if (autoLoad) {
    onMounted(() => {
      loadFromServer()
    })
  }

  return {
    // State
    pagination,
    params,
    isLoading,

    // Methods
    loadFromServer,
    reload,
    handlePageChange,
    handleSearchChange,
    handlePerPageChange,
    updateParams,
  }
}
