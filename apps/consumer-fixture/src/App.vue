<script setup lang="ts">
import { ref } from "vue";

import "./App.css";

const props = defineProps<{ label: string }>();
const count = ref(0);

function increment(): void {
  count.value += 1;
}
</script>

<template>
  <main class="fixture">
    <h1>{{ props.label }}</h1>
    <button type="button" class="fixture-button" @click="increment">Added {{ count }}</button>
  </main>
</template>
