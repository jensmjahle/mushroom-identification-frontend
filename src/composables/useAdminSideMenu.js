import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCountOfRequestFromStatus } from '@/services/apiService.js'

export function useAdminSideMenu() {
  const router = useRouter()
  const route = useRoute()
  const token = sessionStorage.getItem('jwt')

  const newCount = ref(null)
  const pendingCount = ref(null)
  const completedCount = ref(null)

  const fetchCounts = async () => {
    try {
      newCount.value = await getCountOfRequestFromStatus('NEW', token)
      pendingCount.value = await getCountOfRequestFromStatus('PENDING', token)
      completedCount.value = await getCountOfRequestFromStatus('COMPLETED', token)
    } catch (e) {
      console.error(e)
      newCount.value = '?'
    }
  }

  const navigate = (name) => router.push({ name })

  onMounted(fetchCounts)

  return {
    route,
    newCount,
    pendingCount,
    completedCount,
    navigate,
    fetchCounts
  }
  
  
}
