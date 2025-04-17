<template>
    <div class="support-page flex items-center justify-center px-4 py-10 overflow-y-auto">
        <div class="max-w-2xl w-full">
            <h1 class="text-3xl font-bold text-center text-text1 mb-6">Trenger du hjelp?</h1>

            <p class="text-text1-faded mb-6 text-center">
                Her finner du svar på vanlige spørsmål og hvordan du kan ta kontakt med oss.
            </p>

            <!-- FAQ Section -->
            <div class="mb-10 ml-6">
                <h2 class="text-xl font-semibold text-text1 text-center mb-4">Vanlige spørsmål</h2>
                <ul class="space-y-4">
                    <li>
                        <h3 class="text-lg font-medium text-text1 mb-1">Hvordan fungerer soppidentifikasjonstjenesten?</h3>
                        <p class="text-text1-faded">Du sender inn bilder og får svar innen 1-2 dager.</p>
                    </li>
                    <li>
                        <h3 class="text-lg font-medium text-text1 mb-1">Hvordan bruker jeg referansekoden min?</h3>
                        <p class="text-text1-faded">Gå til <router-link to="/user/request/..." class="text-text4 underline">"Sjekk svar"</router-link> og skriv inn koden du fikk.</p>
                    </li>
                    <li>
                        <h3 class="text-lg font-medium text-text1 mb-1">Kan jeg få en ny vurdering?</h3>
                        <p class="text-text1-faded">Ja, last opp nye bilder og send inn en ny forespørsel.</p>
                    </li>
                </ul>
            </div>

            <!-- Contact Form -->
            <div class="bg-bg2 p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-text1 mb-4">Kontakt oss</h2>
                <form @submit.prevent="handleSubmit">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-text1 mb-1">E-post</label>
                        <input type="email" v-model="email" required class="w-full border rounded p-2 text-sm" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-text1 mb-1">Melding</label>
                        <textarea v-model="message" rows="4" required class="w-full border rounded p-2 text-sm"></textarea>
                    </div>
                    <button class="btn-1 w-full">Send melding</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const message = ref('');

function handleSubmit() {
    console.log('Sending message:', email.value, message.value);
    // Later: send message to backend
}
</script>
