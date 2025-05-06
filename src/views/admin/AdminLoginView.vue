<template>
  <img src="/assets/logo-horizontal.svg" alt="Fleinsoppkontroll logo" class=" h-auto absolute m-4 w-52" />
  <AdminLoginForm :onLogin="loginUser" />
</template>

<script setup>
import { useRouter } from "vue-router";
import AdminLoginForm from "@/components/AdminLoginForm.vue";
import { loginAdmin } from "@/services/rest/authService.js";

const router = useRouter();

const loginUser = async (username, password) => {
  try {
    const response = await loginAdmin(username, password);
    const token = response.data.token;

    if (token) {
      sessionStorage.setItem("jwt", token);
      await router.push({ name: "admin-dashboard" });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
</script>
