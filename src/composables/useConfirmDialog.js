import { ref } from "vue"

const isVisible = ref(false)
const options = ref({
  title: "",
  message: "",
  confirmText: "",
  cancelText: "",
  resolve: null
})

export const useConfirmDialog = () => {
  const showConfirm = ({ title, message, confirmText = "Confirm", cancelText = "Cancel" }) => {
    return new Promise(resolve => {
      options.value = { title, message, confirmText, cancelText, resolve }
      isVisible.value = true
    })
  }

  const confirm = () => {
    isVisible.value = false
    options.value.resolve(true)
  }

  const cancel = () => {
    isVisible.value = false
    options.value.resolve(false)
  }

  return {
    isVisible,
    options,
    confirm,
    cancel,
    showConfirm
  }
}
