<script setup lang="ts">
import { cn } from '@/libs/utils'
</script>

<template>
  <div :class="cn('de-14-400 mt-1  text-red-400', $attrs.class ?? '')" aria-live="polite">
    <slot />
  </div>
</template>
