<template>
  <nav class="user-sidebar">
    <router-link to="/" class="user-sidebar-button">
      <HomeIcon class="user-sidebar-icon" />
      <span class="user-sidebar-text">Home</span>
    </router-link>

    <router-link to="/new-request" class="user-sidebar-button">
      <SendIcon class="user-sidebar-icon" />
      <span class="user-sidebar-text">Send In</span>
    </router-link>

    <router-link to="/" class="user-sidebar-button">
      <CheckCircle class="user-sidebar-icon" />
      <span class="user-sidebar-text">Check Answer</span>
    </router-link>

    <router-link to="/new-request" class="user-sidebar-button">
      <Star class="user-sidebar-icon" />
      <span class="user-sidebar-text">Become a Member</span>
    </router-link>

    <router-link to="/new-request" class="user-sidebar-button">
      <HelpingHand class="user-sidebar-icon" />
      <span class="user-sidebar-text">Support</span>
    </router-link>
  </nav>
</template>

<script setup>
import { HomeIcon, SendIcon, CheckCircle, Star, HelpingHand} from "lucide-vue-next";
</script>
