<template>
  <div class="flex flex-col items-center justify-center h-full w-full relative">
    <div
      v-if="currentStep !== 0"
      class="absolute top-6 w-full flex justify-center"
    >
      <StepIndicator :step="currentStep" />
    </div>

    <div class="flex items-center justify-center w-full h-full">
      <StepZero v-if="currentStep === 0" @next="handleNextStep" />
      <StepOne v-if="currentStep === 1" @next="goToStepTwo" /> 
      <StepTwo
        v-else-if="currentStep === 2"
        :referenceCode="userCode"
        @next="goToStepThree"
        @back="currentStep--"
      />
      <StepThree v-else-if="currentStep === 3" :referenceCode="userCode" @back="currentStep--" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import StepIndicator from '@/components/User/steps/StepIndicator.vue'
import StepZero from '@/components/User/steps/StepZero.vue'
import StepOne from '@/components/User/steps/StepOne.vue'
import StepTwo from '@/components/User/steps/StepTwo.vue'
import StepThree from '@/components/User/steps/StepThree.vue'

const LOCAL_STORAGE_KEY = 'currentStep'

const storedStep = parseInt(localStorage.getItem(LOCAL_STORAGE_KEY))
const currentStep = ref(!isNaN(storedStep) ? storedStep : 0)

const userCode = ref(null)

watch(currentStep, (newStep) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, newStep)
})

onUnmounted(() => {
  localStorage.removeItem(LOCAL_STORAGE_KEY)
})

function goToStepTwo(result) {
  userCode.value = result
  currentStep.value = 2
}

function goToStepThree(codeFromStepTwo) {
  userCode.value = codeFromStepTwo
  currentStep.value = 3
}

function handleNextStep() {
  currentStep.value++
}
</script>

