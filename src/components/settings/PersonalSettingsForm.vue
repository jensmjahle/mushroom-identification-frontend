<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">{{ $t('settings.personal.title') }}</h3>

    <BaseInput id="firstName" label="First Name" v-model="firstName" />
    <BaseInput id="lastName" label="Last Name" v-model="lastName" />
    <BaseInput id="email" type="email" label="Email" v-model="email" />

    <h4 class="text-md font-medium mt-4">Change Password</h4>
    <BaseInput id="newPassword" type="password" label="New Password" v-model="newPassword" />
    <BaseInput id="confirmPassword" type="password" label="Confirm Password" v-model="confirmPassword" />

    <BaseButton :block="true" variant="1" @click="submitChanges">
      Save Changes
    </BaseButton>
  </div>
</template>

<script setup>
import BaseInput from "@/components/base/BaseInput.vue"
import BaseButton from "@/components/base/BaseButton.vue"
import { ref } from "vue"

const firstName = ref("")
const lastName = ref("")
const email = ref("")
const newPassword = ref("")
const confirmPassword = ref("")

const submitChanges = () => {
  if (newPassword.value !== confirmPassword.value) {
    alert("Passwords do not match.")
    return
  }
  // submit form logic here
}
</script>
