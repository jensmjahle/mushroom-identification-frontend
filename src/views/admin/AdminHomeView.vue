<template>
  <p>Hello {{name}}, pick "next from que" on the left to get started</p>
</template>

<script setup>
import { ref } from 'vue';
import {parseJwt} from "../../utils/jwt.js";

const name = parseJwt(sessionStorage.getItem('jwt')).sub;
</script>