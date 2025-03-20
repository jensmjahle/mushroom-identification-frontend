<template>
  <div class="login-container">
    <h2>{{ t("login.title") }}</h2>

    <input
        type="text"
        v-model="username"
        :placeholder="t('login.username')"
        class="input-field"
    />

    <input
        type="password"
        v-model="password"
        :placeholder="t('login.password')"
        class="input-field"
    />

    <button @click="handleLogin" class="login-btn">{{ t("login.submit") }}</button>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n(); 

const props = defineProps(["onLogin"]);

const username = ref("");
const password = ref("");
const errorMessage = ref("");

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = t("login.fill_in_both_username_and_password"); 
    return;
  }

  try {
    await props.onLogin(username.value, password.value);
  } catch (error) {
    errorMessage.value = t("login.error"); 
  }
};
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.input-field {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.login-btn {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
