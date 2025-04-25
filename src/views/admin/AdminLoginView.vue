<template>
  <AdminLoginForm :onLogin="loginUser" />
</template>

<script setup>
import { useRouter } from "vue-router";
import AdminLoginForm from "@/components/AdminLoginForm.vue";
import { loginAdmin } from "@/services/authService";

const router = useRouter();

const loginUser = async (username, password) => {
  try {
    const response = await loginAdmin(username, password);
    const token = response.data.token;

    if (token) {
      sessionStorage.setItem("jwt", token);
      await router.push({ name: "admin-dashboard" }); // use route name
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
</script>
