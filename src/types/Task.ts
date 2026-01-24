import type { TaskStatusEnum } from '@/enums/TaskStatusEnum'
import type { BaseEntity } from './BaseEntity'

export interface Task {
  serial_number: number
  id: number
  description: string
  status: TaskStatusEnum
  is_paid: boolean
  assignee: BaseEntity
  assignee_id: number
  project: BaseEntity
  project_id: number
}

export type TaskIndex = Pick<
  Task,
  'id' | 'description' | 'status' | 'is_paid' | 'assignee_id' | 'project_id' | 'serial_number'
> & {
  project: BaseEntity
  assignee: BaseEntity
}
