<script>
import Navigate from "./components/Navigation.vue";
export default {
  name: "App",
  components: {
    Navigate,
  },
  computed: {
    showNavigate() {
      // ตรวจสอบว่าเส้นทางปัจจุบันไม่ใช่ login
      // alert(this.$route.name);
      return (
        this.$route.path !== "/login" &&
        this.$route.path !== "/register" &&
        this.$route.path !== "/forgetpassword"
      ); // หรือใช้ this.$route.path !== '/login'
    },
  },
};
</script>

<template>
  <div>
    <!-- แสดง Navigate เมื่อไม่ใช่หน้า login -->
    <Navigate v-if="showNavigate" />
    <router-view></router-view>
  </div>
</template>

<style></style>
