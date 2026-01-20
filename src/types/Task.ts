import type { TaskStatusEnum } from '@/enums/TaskStatusEnum'
import type { BaseEntity } from './BaseEntity'

export interface TaskIndex {
  id: number
  description: string
  status: TaskStatusEnum
  is_paid: boolean
  assignee: BaseEntity
  assignee_id: number
  project: BaseEntity
  project_id: number
}
