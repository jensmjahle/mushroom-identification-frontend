<template>
  <div class="main-view space-y-6">

    <div class="bg-bg2 p-4 rounded-lg shadow-sm">
      <h1 class="text-3xl font-bold text-text1">{{ t('admin.adminDashboard.greeting', { name }) }}</h1>
      <p class="text-muted mt-2">
        {{ t('admin.adminDashboard.welcome') }}
      </p>
      <ul class="list-disc list-inside mt-4 text-sm text-text1-faded">
        <li>{{ t('admin.adminDashboard.tips.tip1') }}</li>
        <li>{{ t('admin.adminDashboard.tips.tip2') }}</li>
        <li>{{ t('admin.adminDashboard.tips.tip3') }}</li>
      </ul>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <BaseButton @click="() => navigate('admin-all-requests')" block variant="2">
        {{ t('admin.adminDashboard.buttons.allRequests', { count: newRequests.length }) }}
      </BaseButton>
      <BaseButton @click="getNextFromQueue" block variant="2">
        {{ t('admin.adminDashboard.buttons.nextInQueue') }}
      </BaseButton>
      <BaseButton @click="() => navigate('admin-statistics')" block variant="4">
        {{ t('admin.adminDashboard.buttons.statistics') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { parseJwt } from '@/utils/jwt.js';
import {getNextRequestFromQueue } from '@/services/rest/adminRequestService.js';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import BaseButton from '@/components/base/BaseButton.vue';

const { t } = useI18n();
const name = parseJwt(sessionStorage.getItem('jwt')).sub;
const newRequests = ref([]);

const router = useRouter();
const toast = useToast();

const navigate = (routeName) => {
  router.push({ name: routeName });
};

const getNextFromQueue = async () => {
  try {
    const request = await getNextRequestFromQueue();
    if (request) {
      await router.push({ name: 'admin-request', params: { userRequestId: request.userRequestId } });
    } else {
      toast.info('Ingen forespørsler i køen');
    }
  } catch (error) {
    console.error(error);
    toast.error('Kunne ikke hente neste forespørsel fra kø');
  }
};

onMounted(async () => {
  try {
    const newRes = await getPaginatedNewRequests(0);
    newRequests.value = newRes.content;
  } catch (err) {
    console.error('Feil ved henting av forespørsler', err);
  }
});
</script>

<style scoped>
.main-view {
  padding: 2rem;
}
</style>