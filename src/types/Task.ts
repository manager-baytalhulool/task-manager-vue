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
  completed_at: string | null
}

export type TaskIndex = Pick<
  Task,
  'id' | 'description' | 'status' | 'is_paid' | 'assignee_id' | 'project_id' | 'serial_number' | 'completed_at'
> & {
  project: BaseEntity
  assignee: BaseEntity
}
