<template>
  <div class="textfield-wrapper mb-3">
    <label v-if="label" class="form-label">
      <span v-if="required" style="color: red">* </span>{{ label }}
    </label>
    <input
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="form-control"
      :class="{ error: error, readonly: readonly }"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      @keypress="handleKeyPress"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: [String, Number], // สำหรับ v-model
  label: String,
  type: {
    type: String,
    default: "text", // text, password, email, number, tel
  },
  placeholder: String,
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  maxlength: [String, Number],
});

const emit = defineEmits(["update:modelValue"]);

// ฟังก์ชันสำหรับจัดการการกดปุ่ม (เช่น รับเฉพาะตัวเลข)
const handleKeyPress = (event) => {
  if (props.type === "tel" || props.type === "number") {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
};
</script>

