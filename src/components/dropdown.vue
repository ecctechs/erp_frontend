<template>
  <div class="dropdown-wrapper">
    <label v-if="label" :for="id" class="form-label">
      <span v-if="required" style="color: red">*</span>{{ label }}
    </label>
    <select
      :id="id"
      class="form-control form-select"
      :class="{ 'error': error }"  :value="modelValue"
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
  modelValue: [String, Number],
  options: {
    type: Array,
    required: true,
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
  // 2. เพิ่ม prop 'error' เข้าไป
  error: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
/* 3. เพิ่ม CSS สำหรับ class 'error' (ถ้ายังไม่มี) */
.error {
  border-color: #dc3545 !important; /* สีแดงสำหรับ error */
}
</style>