<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps({
  name: String,
  label: String,
  modelValue: String,
  type: { type: String, default: 'text' },
})
const { name, label, modelValue, type } = toRefs(props)

const emit = defineEmits(['update:modelValue'])

const updateValue = ($event: any) => {
  emit('update:modelValue', $event.target.value)
}
</script>

<template>
  <div class="col-12">
    <label class="visually-hidden" :for="name">{{ label }}</label>

    <input
      class="form-control"
      :id="name"
      :placeholder="label"
      :type="type"
      :value="modelValue"
      @input="updateValue"
    />
  </div>
</template>
