<template>
  <i :class="iconClass" aria-hidden="true"></i>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

// Computed property ที่ปรับปรุงใหม่ให้รองรับ class ทั้ง 2 แบบ
const iconClass = computed(() => {
  const name = props.name;

  // 1. สำหรับ Material Design Icons
  if (name.startsWith("mdi-")) {
    return ["mdi", name];
  }

  // 2. รายการไอคอนที่ใช้เครื่องหมาย _ (underscore)
  const underscoreIcons = [
    "language",
    "language_dark",
    "product_access",
    "product_stock_access",
    "quotation_access",
    "sale_report_access",
  ];

  if (underscoreIcons.includes(name)) {
    return `icon_${name}`; // จะได้ class "icon_sale_report_access"
  }

  // 3. สำหรับไอคอนอื่นๆ ที่ใช้ - (hyphen) เป็นค่าเริ่มต้น
  return ["icon", `icon-${name}`]; // จะได้ class "icon icon-edit"
});
</script>
