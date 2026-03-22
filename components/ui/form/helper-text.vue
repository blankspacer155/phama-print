<script setup lang="ts">
import { cn } from '@/libs/utils'
</script>

<template>
  <div :class="cn('de-14-400 ml-0.5 text-gray-70', $attrs.class ?? '')">
    <slot />
  </div>
</template>
