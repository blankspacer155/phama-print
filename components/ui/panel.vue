<script setup lang="ts">
import { cva } from 'class-variance-authority'
import { cn } from '@/libs/utils'

const panelVariants = cva('', {
  variants: {
    variant: {
      white: 'bg-white rounded-lg',
      gray1: 'bg-gray-10 rounded',
      gray2: 'bg-gray-20 rounded',
      outline: 'border bg-white border-divider-divider3 rounded-lg',
    },
  },
  defaultVariants: {
    variant: 'white',
  },
})

withDefaults(
  defineProps<{
    variant?: NonNullable<Parameters<typeof panelVariants>[0]>['variant']
  }>(),
  {
    variant: 'white',
  },
)
</script>

<template>
  <div :class="cn(panelVariants({ variant }), $attrs.class ?? '')">
    <slot />
  </div>
</template>
