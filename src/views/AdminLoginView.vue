
<template>
  <h1>Fleinsoppkontroll.no</h1>
  <AdminLoginForm :onLogin="loginUser" />
</template>

<script setup>
import { useRouter } from "vue-router";
import AdminLoginForm from "../components/AdminLoginForm.vue";
import { loginAdmin as loginAdminAPI } from "../services/apiService";

const router = useRouter();


const loginUser = async (username, password) => {  
  try {
    const response = await loginAdminAPI(username, password); 
console.log(response);
    if (response.token) {
      alert("Login successful!");
      sessionStorage.setItem("jwt", response.token); // Store the token in the session storage
      await router.push("/admin-dashboard");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    throw error;
  }
};
</script>

