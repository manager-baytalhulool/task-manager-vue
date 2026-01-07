export interface Column {
  label: string
  field: string
  sortable?: boolean
}

export type RowClass<T> = (row: T, index: number) => Record<string, string>
