<script setup lang="ts">
import ModalSubtaskForm from '@/components/subtasks/ModalSubtaskForm.vue'
import api from '@/plugins/axios'
import type { SubtaskIndex } from '@/types/Subtask'
import type { TaskIndex } from '@/types/Task'
import { Modal } from 'bootstrap'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const task = ref<any>({})
const isViewReady = ref<boolean>(false)
let addSubtaskModal: Modal | null = null
const selectedSubtask = ref<SubtaskIndex | null>(null)
const commentBody = ref('')
const replyToId = ref<number | null>(null)

const getTask = async () => {
  const id = route.params.id
  const url = `/api/tasks/${id}`
  const response = await api.get(url)
  task.value = response.data.data.task
  if (!task.value.comments) task.value.comments = []
}

const handleCommentSubmit = async (parentId: number | null = null) => {
  if (!commentBody.value) return
  try {
    const res = await api.post('/api/comments', {
      task_id: route.params.id,
      body: commentBody.value,
      parent_id: parentId,
    })
    if (parentId === null) {
      task.value.comments.push({ ...res.data.comment, replies: [] })
    } else {
      await getTask() // Tree refresh karne ke liye simple tareeqa
    }
    commentBody.value = ''
    replyToId.value = null
  } catch (err) {
    console.error(err)
  }
}

const handleCheckboxToggle = async (task: TaskIndex) => {
  const url = `/api/subtasks/${task.id}`
  if (task.completed_at !== null) {
    await api.put(url, {
      completed_at: task.completed_at,
    })
    task.completed_at = null
  } else {
    const response = await api.put(url, {
      completed_at: task.completed_at,
    })
    task.completed_at = response.data.data.subtask.completed_at
  }
}

const handleAddSubtaskClick = async () => {
  selectedSubtask.value = null
  addSubtaskModal!.show()
}

// const handleSubtaskCreated = (subtask: SubtaskIndex) => {
//   task.value.subtasks.push(subtask)
//   addSubtaskModal!.hide()
// }

const handleSubtaskCreated = (subtask: SubtaskIndex) => {
  const index = task.value.subtasks.findIndex((s: any) => s.id === subtask.id)
  if (index !== -1) {
    task.value.subtasks[index] = subtask
  } else {
    task.value.subtasks.push(subtask)
  }
  addSubtaskModal!.hide()
}

const handleSubtaskSubmit = async (payload: any) => {
  let response = null
  const taskId = route.params.id
  const finalPayload = { ...payload, task_id: taskId }

  try {
    if (selectedSubtask.value) {
      // Update logic
      response = await api.put(`api/subtasks/${selectedSubtask.value.id}`, finalPayload)
      handleSubtaskCreated(response.data.data.subtask)
    } else {
      // Create logic
      response = await api.post('/api/subtasks', finalPayload)
      handleSubtaskCreated(response.data.data.subtask)
    }
  } catch (error) {
    console.error('Subtask operation failed:', error)
  }
}

const handleDeleteSubtask = async (subtaskId: number, index: number) => {
  if (!confirm('Are you sure you want to delete this subtask?')) return
  try {
    await api.delete(`/api/subtasks/${subtaskId}`)
    task.value.subtasks.splice(index, 1)
  } catch (error) {
    console.error('Delete failed:', error)
  }
}

onMounted(async () => {
  await getTask()
  isViewReady.value = true
  const addSubtaskFormModal = document.getElementById('addSubtaskFormModal')
  if (addSubtaskFormModal) addSubtaskModal = new Modal(addSubtaskFormModal)
})
</script>

<template>
  <main class="content">
    <div class="container-fluid p-0" v-if="isViewReady">
      <h1 class="h3 mb-3">Task</h1>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Task Information</h5>
            </div>
            <div class="text-end"></div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered table-hover">
                  <tbody>
                    <tr>
                      <th style="width: 30%">Task Id</th>
                      <td>{{ task.id }}</td>
                    </tr>
                    <tr>
                      <th>Description</th>
                      <td>{{ task.description }}</td>
                    </tr>
                    <tr>
                      <th>Assignee</th>
                      <td>{{ task.assignee.name }}</td>
                    </tr>
                    <tr>
                      <th>Status</th>
                      <td>{{ task.status }}</td>
                    </tr>
                    <tr>
                      <th>Is Paid</th>
                      <td>{{ task.is_paid == '1' ? true : false }}</td>
                    </tr>
                    <tr>
                      <th>Started At</th>
                      <td>{{ task.started_at }}</td>
                    </tr>
                    <tr>
                      <th>Completed At</th>
                      <td>{{ task.completed_at }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">Subtasks</h5>
              <button class="btn btn-primary" @click="handleAddSubtaskClick">Add Subtask</button>
            </div>
            <div class="text-end"></div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Checkbox</th>
                      <th>Description</th>
                      <th>Completed At</th>
                      <th>Sort No</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(subtask, i) in task.subtasks" :key="subtask.id">
                      <td>{{ (i as number) + 1 }}</td>
                      <td>
                        <input
                          type="checkbox"
                          @change="handleCheckboxToggle(subtask)"
                          :checked="subtask.completed_at !== null"
                        />
                      </td>
                      <td>{{ subtask.description }}</td>
                      <td>{{ subtask.completed_at }}</td>
                      <td>{{ subtask.sort_no }}</td>
                      <td>
                        <button
                          class="btn btn-sm btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#addSubtaskFormModal"
                          @click="selectedSubtask = subtask"
                        >
                          Edit
                        </button>
                        <button
                          class="btn btn-sm btn-danger"
                          @click="handleDeleteSubtask(subtask.id, i as number)"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header"><h5 class="card-title mb-0">Comments & Discussion</h5></div>
            <div class="card-body">
              <!-- Comment List -->
              <div
                v-for="comment in task.comments"
                :key="comment.id"
                class="mb-3 border-bottom pb-2"
              >
                <div class="d-flex justify-content-between">
                  <strong>{{ comment.user.name }}</strong>
                  <small class="text-muted">{{ comment.created_at }}</small>
                </div>
                <p class="mb-1">{{ comment.body }}</p>
                <button class="btn btn-link btn-sm p-0" @click="replyToId = comment.id">
                  Reply
                </button>

                <!-- Replies (Nesting) -->
                <div
                  v-if="comment.replies && comment.replies.length"
                  class="ms-4 mt-2 border-start ps-3"
                >
                  <div v-for="reply in comment.replies" :key="reply.id" class="mb-2">
                    <strong>{{ reply.user.name }}:</strong> <span>{{ reply.body }}</span>
                  </div>
                </div>

                <!-- Reply Input -->
                <div v-if="replyToId === comment.id" class="mt-2">
                  <textarea
                    v-model="commentBody"
                    class="form-control mb-2"
                    rows="2"
                    placeholder="Write a reply..."
                  ></textarea>
                  <button
                    class="btn btn-primary btn-sm me-2"
                    @click="handleCommentSubmit(comment.id)"
                  >
                    Submit Reply
                  </button>
                  <button class="btn btn-light btn-sm" @click="replyToId = null">Cancel</button>
                </div>
              </div>

              <!-- Main Comment Input (Only for Assignee) -->
              <div v-if="!replyToId" class="mt-4">
                <h6>Add a Comment</h6>
                <textarea
                  v-model="commentBody"
                  class="form-control mb-2"
                  rows="3"
                  placeholder="Type your update here..."
                ></textarea>
                <button class="btn btn-primary" @click="handleCommentSubmit(null)">
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <ModalSubtaskForm
      :task-id="Number($route.params.id)"
      :selected-subtask="selectedSubtask"
      @subtask-created="handleSubtaskCreated"
    /> -->

    <ModalSubtaskForm :selected-subtask="selectedSubtask" @submit="handleSubtaskSubmit" />
  </main>
</template>
