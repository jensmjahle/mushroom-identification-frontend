<template>
  <div>
    <LogoButton v-if="!isRequestPage" />
    <hr class="my-4 border-border2" />
    <h2 class="text-xl font-semibold text-text4 text-right">{{ $t('sideMenu.completedTitle') }}</h2>
    <div class="text-5xl font-bold mb-4 text-right">{{ completedCount }}</div>

    <div class="space-y-2" v-if="!isRequestPage">
      <BaseButton @click=getNextFromQueue block variant="2">
        {{ $t('sideMenu.nextFromQueue') }}
      </BaseButton>
      <BaseButton @click="navigate('admin-all-requests')" block variant="4">
        {{ $t('sideMenu.allRequests') }}
      </BaseButton>
      <BaseButton @click="navigate('admin-statistics')" block variant="4">
        {{ $t('sideMenu.statistics') }}
      </BaseButton>
    </div>
    
    <div class="space-y-2" v-if="isRequestPage">
      <div class="flex items-center gap-2">
        <BaseButton
            v-if="isRequestPage"
            @click="handleStatusChange('COMPLETED')"
            block
            variant="2"
        >
          {{ $t('sideMenu.completeRequest') }}
        </BaseButton>
        <TooltipIcon tooltipKey="completeRequest" :variant="'1'" :position="tooltipPosition" />
      </div>
      <div class="flex items-center gap-2">
        <BaseButton
            v-if="isRequestPage"
            @click="handleStatusChange('NEW')"
            block
            variant="4"
        >
          {{ $t('sideMenu.putBackIntoQueue') }}
        </BaseButton>
        <TooltipIcon tooltipKey="putBackIntoQueue" :variant="'1'" :position="tooltipPosition" />
      </div>
      <div class="flex items-center gap-2">
        <BaseButton
            v-if="isRequestPage"
            @click="handleStatusChange('PENDING')"
            block
            variant="4"
        >
          {{ $t('sideMenu.placeOnHold') }}
        </BaseButton>
        <TooltipIcon tooltipKey="placeOnHold" :variant="'1'" :position="tooltipPosition" />
      </div>
    </div>
      
    <hr class="my-4 border-border2" />

    <div class="space-y-2">
      <StatusIndicator label="New" :count="newCount" status="NEW" />
      <StatusIndicator label="Pending" :count="pendingCount" status="PENDING" />
      <StatusIndicator label="Completed" :count="completedCount" status="COMPLETED" />
    </div>

    <hr class="my-4 border-border2" v-if="!isRequestPage" />

    <div class="space-y-2">
      <h4 v-if="!isRequestPage" class="text-left text-text4">{{ $t('sideMenu.admins') }}</h4>
      <p class="text-xs text-text4-faded text-left">{{ $t('sideMenu.onlineAdmins') }}: {{ onlineAdmins }}</p>
      <BaseButton v-if="!isRequestPage"  @click="navigate('admin-management')" block variant="2">
        {{ $t('sideMenu.allAdmins') }}
      </BaseButton>
      <BaseButton v-if="!isRequestPage"  @click="navigate('admin-new-administrator')" block variant="4">
        {{ $t('sideMenu.createNewAdmin') }}
      </BaseButton>
    </div>

    <hr class="my-4 border-border2" v-if="!isRequestPage" />
    <div class="space-y-2 block sm:hidden">
      <BaseButton v-if="!isRequestPage"  @click="navigate('admin-settings')" block variant="2">
        {{ $t('sideMenu.settings') }}
      </BaseButton>
      <BaseButton v-if="!isRequestPage"  @click="logout" block variant="3">
        {{ $t('sideMenu.logout') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import StatusIndicator from '@/components/base/StatusIndicator.vue'
import { useAdminSideMenu} from '@/composables/useAdminSideMenu'
import LogoButton from "@/components/LogoButton.vue";
import { useToast } from 'vue-toastification'
import {changeUserRequestStatus, getNextRequestFromQueue} from "@/services/rest/adminRequestService.js";
import { useRouter } from 'vue-router'
import TooltipIcon from "@/components/base/TooltipIcon.vue";
import {getOnlineAdminCount} from "@/services/rest/websocketService.js";




const { newCount, pendingCount, completedCount, navigate, route, fetchCounts } = useAdminSideMenu()

const isRequestPage = computed(() => route.name === 'admin-request')
const userRequestId = computed(() => route.params.userRequestId)
const toast = useToast()
const router = useRouter()
const onlineAdmins = ref(0)

const tooltipPosition = ref('right')

function updateTooltipPosition() {
  tooltipPosition.value = window.innerWidth < 640 ? 'left' : 'right'
}

const handleStatusChange = async (newStatus) => {
  if (!userRequestId.value) return;

  try {
    const msg = await changeUserRequestStatus(userRequestId.value, newStatus);
    await fetchCounts();
    navigate('admin-dashboard');
    toast.success(msg);
  } catch (error) {
    console.error('Failed to change status:', error);
  }
};


const getNextFromQueue = async () => {
  try {
    const request = await getNextRequestFromQueue()
    if (request) {
      await router.push({name: 'admin-request', params: {userRequestId: request.userRequestId}})
    } else {
      toast.info('No requests in the queue')
    }
  } catch (error) {
    console.error(error)
    toast.error('Failed to fetch next request from queue')
  }
}
const logout = () => {
  sessionStorage.removeItem('jwt')
  router.push({ name: 'admin-login' })
}


const fetchOnlineAdmins = async () => {
  onlineAdmins.value = await getOnlineAdminCount()
}

onMounted(() => {
  fetchOnlineAdmins()
  updateTooltipPosition()
  window.addEventListener('resize', updateTooltipPosition)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTooltipPosition)
})
</script>
