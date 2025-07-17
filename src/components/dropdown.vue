<template>
  <div class="dropdown-wrapper">
    <label v-if="label" :for="id" class="form-label">
      <span v-if="required" style="color: red">*</span>{{ label }}
    </label>
    <select
      :id="id"
      class="form-control form-select"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
    >
      <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  id: String,
  modelValue: [String, Number], // ใช้สำหรับ v-model
  options: {
    type: Array,
    required: true, // รูปแบบ: [{ value: '1', text: 'Option 1' }]
  },
  label: String,
  placeholder: String,
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["update:modelValue"]);
</script>
