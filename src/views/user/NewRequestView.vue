<template>
  <div
    v-if="currentStep !== 0"
    class="absolute top-6 flex flex-col items-center justify-center w-full h-auto">
  >
    <StepIndicator :step="currentStep" />
  </div>
  <div class="flex items-center justify-center h-full w-full relative">
    <div class="relative mt-10 flex items-center justify-center w-full h-full">
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
import StepIndicator from '@/components/user/steps/StepIndicator.vue'
import StepZero from '@/components/user/steps/StepZero.vue'
import StepOne from '@/components/user/steps/StepOne.vue'
import StepTwo from '@/components/user/steps/StepTwo.vue'
import StepThree from '@/components/user/steps/StepThree.vue'

const LOCAL_STORAGE_KEY = 'currentStep'

const storedStep = parseInt(sessionStorage.getItem(LOCAL_STORAGE_KEY))
const currentStep = ref(!isNaN(storedStep) ? storedStep : 0)

const userCode = ref(null)

watch(currentStep, (newStep) => {
  sessionStorage.setItem(LOCAL_STORAGE_KEY, newStep)
})

onUnmounted(() => {
  sessionStorage.removeItem(LOCAL_STORAGE_KEY)
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

