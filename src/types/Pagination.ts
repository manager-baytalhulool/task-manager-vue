export interface Pagination<T> {
  data: T[]
  currentPage: number
  from: number
  perPage: number
  to: number
  total: number
  lastPage: number
}

export interface PaginationParams {
  page: number
  per_page: number
  search?: string
}

export interface PaginationResponse<T> {
  data: T[]
  current_page: number
  from: number
  per_page: number
  to: number
  total: number
  last_page: number
}
