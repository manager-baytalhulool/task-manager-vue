import type { TaskStatusEnum } from '@/enums/TaskStatusEnum'
import type { BaseEntity } from './BaseEntity'

export interface TaskIndex {
  id: number
  description: string
  status: TaskStatusEnum
  assignee: BaseEntity
  assignee_id: number
}
