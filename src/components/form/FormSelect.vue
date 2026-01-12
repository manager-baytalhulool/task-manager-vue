<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps(['name', 'label', 'modelValue', 'items'])
const { name, label, modelValue, items } = toRefs(props)

const emit = defineEmits(['update:modelValue'])

const updateValue = ($event: any) => {
  emit('update:modelValue', $event.target.value)
}
</script>

<template>
  <div class="mb-3">
    <label :for="name" class="form-label">{{ label }}</label>
    <select
      class="form-control"
      :id="name"
      :name="name"
      :value="modelValue"
      :placeholder="label"
      @change="updateValue"
    >
    <option value="" selected>Select Option</option>
    <option  v-for="item in items" :value="item.id" :key="item.id">{{ item.name }}</option>
    </select>
  </div>
</template>
