<script setup lang="ts">
import { ref } from "vue";

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

<style>
.fixture {
  padding: var(--ds-space-inset);
  font-size: var(--ds-text-size-body);
}

.fixture-button {
  border: var(--ds-focus-width) solid var(--ds-color-border-strong);
  border-radius: var(--ds-radius-control);
  background: var(--ds-color-accent);
  color: var(--ds-color-on-accent);
}
</style>
