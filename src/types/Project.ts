interface Project {
  id: number
  name: string
  live_url: string
  demo_url: string
  started_at: Date | null
  is_live: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export type ProjectIndex = Pick<
  Project,
  'id' | 'name' | 'live_url' | 'demo_url' | 'is_live' | 'started_at'
>

export type ProjectForm = Pick<Project, 'name' | 'live_url' | 'demo_url' | 'is_live' | 'started_at'>
