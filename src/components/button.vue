<script setup>
const props = defineProps({
  type: {
    type: String,
    default: "button",
  },
  customClass: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

// ให้ emit ทำงานเฉพาะตอนมี listener จริง
const emit = defineEmits(["click"]);

function handleClick(event) {
  emit("click", event); // emit click ตามปกติ
}
</script>

<template>
  <button
    :class="customClass"
    :type="type"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
