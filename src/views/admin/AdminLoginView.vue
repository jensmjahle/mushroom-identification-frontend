
<template>
  <h1>Fleinsoppkontroll.no</h1>
  <AdminLoginForm :onLogin="loginUser" />
</template>

<script setup>
import { useRouter } from "vue-router";
import AdminLoginForm from "../../components/AdminLoginForm.vue";
import {loginAdmin} from "@/services/authService";

const router = useRouter();


const loginUser = async (username, password) => {
  try {
    const response = await loginAdmin(username, password);
    console.log(response);

    const token = response.data.token;

    if (token) {
      alert("Login successful!");
      sessionStorage.setItem("jwt", token);
      await router.push("/admin/dashboard");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed. Please check your credentials.");
  }
};

</script>

