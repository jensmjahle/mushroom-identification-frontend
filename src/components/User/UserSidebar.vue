<template>
  <nav :class="['user-sidebar', collapsed ? 'collapsed' : '']">
    <div class="user-sidebar-button" :class="{ active: $route.path === '/user' }">
      <router-link to="/user" class="user-sidebar-link">
        <HomeIcon class="user-sidebar-icon" />
        <span class="user-sidebar-text">Home</span>
      </router-link>
    </div>

    <div class="user-sidebar-button" :class="{ active: $route.path === '/user/new' }">
      <router-link to="/user/new" class="user-sidebar-link">
        <SendIcon class="user-sidebar-icon" />
        <span class="user-sidebar-text">Send In</span>
      </router-link>
    </div>

    <div class="user-sidebar-button" :class="{ active: $route.path === '/user/login' }">
      <router-link to="/user/login" class="user-sidebar-link">
        <CheckCircle class="user-sidebar-icon" />
        <span class="user-sidebar-text">Check Answer</span>
      </router-link>
    </div>

    <div class="user-sidebar-button" :class="{ active: $route.path === '/user/become-member' }">
      <router-link to="/user/become-member" class="user-sidebar-link">
        <Star class="user-sidebar-icon" />
        <span class="user-sidebar-text">Become a Member</span>
      </router-link>
    </div>

    <div class="user-sidebar-button" :class="{ active: $route.path === '/user/support' }">
      <router-link to="/user/support" class="user-sidebar-link">
        <HelpingHand class="user-sidebar-icon" />
        <span class="user-sidebar-text">Support</span>
      </router-link>
    </div>
    
  </nav>
</template>

<script setup>
import { HomeIcon, SendIcon, CheckCircle, Star, HelpingHand} from "lucide-vue-next";

defineProps({ collapsed: Boolean });
</script>
