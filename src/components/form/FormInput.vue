<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps(['name', 'label', 'modelValue', 'type'])
const { name, label, modelValue, type } = toRefs(props)

const emit = defineEmits(['update:modelValue'])

const updateValue = ($event: any) => {
  emit('update:modelValue', $event.target.value)
}
</script>

<template>
  <div class="mb-3">
    <label :for="name" class="form-label">{{ label }}</label>
    <input
      :type="type"
      class="form-control"
      :id="name"
      :name="name"
      :value="modelValue"
      :placeholder="label"
      @input="updateValue"
    />
  </div>
</template>
