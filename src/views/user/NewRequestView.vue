<template>
  <div class="flex flex-col items-center justify-center h-full w-full relative">
    <div class="absolute top-6 w-full flex justify-center">
      <StepIndicator :step="currentStep" />
    </div>
    <div class="flex items-center justify-center w-full h-full">
      <StepOne v-if="currentStep === 1" @next="goToStepTwo" />
      <StepTwo v-else-if="currentStep === 2" :referenceCode="userCode" @next="currentStep++" @back="currentStep--" />
      <StepThree v-else-if="currentStep === 3" :referenceCode="userCode" @back="currentStep--" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StepIndicator from '@/components/User/steps/StepIndicator.vue'
import StepOne from '@/components/User/steps/StepOne.vue'
import StepTwo from '@/components/User/steps/StepTwo.vue'
import StepThree from '@/components/User/steps/StepThree.vue'

const currentStep = ref(1)
const userCode = ref(null)

function goToStepTwo(result) {
  userCode.value = result
  currentStep.value = 2
}
</script>
