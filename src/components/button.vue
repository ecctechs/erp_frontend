<template>
  <button
    :class="customClass"
    :type="type"
    @click="$emit('click')"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: "button",
  },
  customClass: {
    type: String,
    default: "", // ให้สามารถส่ง class จากภายนอกได้
  },
  disabled: {
    type: Boolean,
    default: false, // เพิ่ม prop สำหรับ disabled
  },
});
</script>
