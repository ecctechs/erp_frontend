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
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

function handleClick(event) {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
}
</script>

<template>
  <button
    :class="customClass"
    :type="type"
    :disabled="disabled || loading"
    aria-busy="loading"
    @click="handleClick"
  >
    <span
      v-if="loading"
      class="spinner-border spinner-border-sm me-1"
      role="status"
      aria-hidden="true"
    ></span>
    <slot />
  </button>
</template>
