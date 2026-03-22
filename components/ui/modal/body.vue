<script setup lang="ts">
import { cn } from '@/libs/utils'

defineProps<{
  scroll?: boolean
}>()
</script>
<template>
  <div
    :class="
      cn('my-6 px-6', {
        'max-h-[600px] overflow-y-auto': scroll,
      })
    "
  >
    <slot />
  </div>
</template>
