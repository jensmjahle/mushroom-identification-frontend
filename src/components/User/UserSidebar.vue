<template>
  <nav class="user-sidebar">
    <router-link to="/user" class="user-sidebar-button" exact-active-class="user-sidebar-button-active">
      <HomeIcon class="user-sidebar-icon" />
      <span class="user-sidebar-text">Home</span>
    </router-link>

    <router-link to="/user/new" class="user-sidebar-button" exact-active-class="user-sidebar-button-active">
      <SendIcon class="user-sidebar-icon" />
      <span class="user-sidebar-text">Send In</span>
    </router-link>

    <router-link to="/user/request/:userRequestId'" class="user-sidebar-button" exact-active-class="user-sidebar-button-active">
      <CheckCircle class="user-sidebar-icon" />
      <span class="user-sidebar-text">Check Answer</span>
    </router-link>

    <router-link to="/user/become-member" class="user-sidebar-button" exact-active-class="user-sidebar-button-active">
      <Star class="user-sidebar-icon" />
      <span class="user-sidebar-text">Become a Member</span>
    </router-link>

    <router-link to="/user/support" class="user-sidebar-button" exact-active-class="user-sidebar-button-active">
      <HelpingHand class="user-sidebar-icon" />
      <span class="user-sidebar-text">Support</span>
    </router-link>
  </nav>
</template>

<script setup>
import { HomeIcon, SendIcon, CheckCircle, Star, HelpingHand} from "lucide-vue-next";
</script>
