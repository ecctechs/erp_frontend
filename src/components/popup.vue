<template>
  <transition name="fade">
    <div v-if="isOpen" class="popup">
      <div class="popup-content">
        <div>
          <!-- close popup content -->
          <span class="close" @click="closePopup">&times;</span>
        </div>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    isOpen: Boolean,
    closePopup: Function,
    formData: Object,
  },
};
</script>
