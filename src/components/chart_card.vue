<template>
  <Card class="bg-light" style="height: 100%;">
    <div class="card-body">
      <p class="card-body-p">{{ title }}</p>
      <div class="card-body-detail">
        <div
          ref="chartContainer"
          :style="{ width: chartWidth, height: chartHeight }"
        ></div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref, defineProps, defineExpose } from 'vue';
import Card from './Card.vue'; // Import Card component ที่มีอยู่

// 1. รับ props จาก Parent
defineProps({
  title: {
    type: String,
    required: true,
  },
  chartWidth: {
    type: String,
    default: '100%',
  },
  chartHeight: {
    type: String,
    default: '400px',
  },
});

// 2. สร้าง ref สำหรับ div ที่จะใช้แสดงกราฟ
const chartContainer = ref(null);

// 3. ส่ง ref กลับไปให้ Parent component ใช้งาน
defineExpose({
  chartContainer,
});
</script>