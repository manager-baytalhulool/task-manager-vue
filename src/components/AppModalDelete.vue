<script setup lang="ts">

const props = defineProps<{
  message: string,
}>()


defineEmits(['onSubmit'])


</script>

<template>
  <!-- Modal -->
  <div
    class="modal fade modal-danger"
    id="modal-delete"
    tabindex="-1"
    aria-labelledby="modal-delete-label"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modal-delete-label">Warning</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Are you sure want to delete record</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="$emit('onSubmit')">Yes</button>
        </div>
      </div>
    </div>
  </div>
</template>
