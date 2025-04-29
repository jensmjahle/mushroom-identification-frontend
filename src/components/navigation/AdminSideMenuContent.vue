<template>
  <div>
    <LogoButton v-if="!isRequestPage" />
    <hr class="my-4 border-border2" />
    <h2 class="text-xl font-semibold text-text4 text-right">{{ $t('sideMenu.completedTitle') }}</h2>
    <div class="text-5xl font-bold mb-4 text-right">{{ completedCount }}</div>

    <div class="space-y-2">
      <BaseButton v-if="!isRequestPage" @click=getNextFromQueue block variant="2">
        {{ $t('sideMenu.nextFromQueue') }}
      </BaseButton>
      <BaseButton v-if="!isRequestPage" @click="navigate('admin-all-requests')" block variant="4">
        {{ $t('sideMenu.allRequests') }}
      </BaseButton>
      <BaseButton v-if="!isRequestPage" @click="navigate('admin-statistics')" block variant="4">
        {{ $t('sideMenu.statistics') }}
      </BaseButton>

      <BaseButton
          v-if="isRequestPage"
          @click="handleStatusChange('COMPLETED')"
          block
          variant="2"
      >
        {{ $t('sideMenu.completeRequest') }}
      </BaseButton>
      <BaseButton
          v-if="isRequestPage"
          @click="handleStatusChange('NEW')"
          block
          variant="4"
      >
        {{ $t('sideMenu.putBackIntoQueue') }}
      </BaseButton>
      <BaseButton
          v-if="isRequestPage"
          @click="handleStatusChange('PENDING')"
          block
          variant="4"
      >
        {{ $t('sideMenu.placeOnHold') }}
      </BaseButton>

    </div>

    <hr class="my-4 border-border2" />

    <div class="space-y-2">
      <StatusIndicator label="New" :count="newCount" status="NEW" />
      <StatusIndicator label="Pending" :count="pendingCount" status="PENDING" />
      <StatusIndicator label="Completed" :count="completedCount" status="COMPLETED" />
    </div>

    <hr class="my-4 border-border2" />

    <div class="space-y-2">
      <h3 class="text-left text-text4">{{ $t('sideMenu.admins') }}</h3>
      <BaseButton v-if="!isRequestPage"  @click="navigate('admin-management')" block variant="2">
        {{ $t('sideMenu.allAdmins') }}
      </BaseButton>
      <BaseButton v-if="!isRequestPage"  @click="navigate('admin-new-administrator')" block variant="4">
        {{ $t('sideMenu.createNewAdmin') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import StatusIndicator from '@/components/base/StatusIndicator.vue'
import { useAdminSideMenu} from '@/composables/useAdminSideMenu'
import LogoButton from "@/components/LogoButton.vue";
import { useToast } from 'vue-toastification'
import {changeUserRequestStatus, getNextRequestFromQueue} from "@/services/adminRequestService.js";
import { useRouter } from 'vue-router'




const { newCount, pendingCount, completedCount, navigate, route, fetchCounts } = useAdminSideMenu()

const isRequestPage = computed(() => route.name === 'admin-request')
const userRequestId = computed(() => route.params.userRequestId)
const toast = useToast()
const router = useRouter()


const handleStatusChange = async (newStatus) => {
  if (!userRequestId.value) return

  try {
    await changeUserRequestStatus(userRequestId.value, newStatus)
    await fetchCounts()
    navigate('admin-all-requests')
    toast.success('Status updated!')
  } catch (error) {
    console.error(`Failed to change status:`, error)
  }
}

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
</script>
