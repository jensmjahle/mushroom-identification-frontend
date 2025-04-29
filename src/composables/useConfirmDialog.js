import { ref } from 'vue'

const isVisible = ref(false)
const options = ref({})
let resolver = null

export const useConfirmDialog = () => {
  const showConfirm = ({ title, message, confirmText = "Confirm", cancelText = "Cancel" }) => {
    isVisible.value = true
    options.value = { title, message, confirmText, cancelText }

    return new Promise(resolve => {
      resolver = resolve
    })
  }

  const confirm = () => {
    isVisible.value = false
    resolver?.(true)
  }

  const cancel = () => {
    isVisible.value = false
    resolver?.(false)
  }

  return {
    isVisible,
    options,
    showConfirm,
    confirm,
    cancel
  }
}
