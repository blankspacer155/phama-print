<script setup lang="ts">
import { cva } from 'class-variance-authority'
import { cn } from '@/libs/utils'

const buttonVariants = cva(
  'inline-flex items-center gap-2 justify-center rounded relative align-middle transition-all appearance-none select-none whitespace-nowrap',
  {
    variants: {
      variant: {
        primary:
          'text-white bg-cta-primary hover:bg-cta-primary-hover active:bg-cta-primary-clicked disabled:bg-cta-primary-disable',
        secondary:
          'text-gray-80 border border-gray-60 hover:text-gray-90 hover:bg-gray-30 active:text-gray-90 active:bg-gray-40 disabled:text-gray-50 disabled:border-gray-50',
        warning:
          'text-white bg-cta-warning hover:bg-cta-warning-hover active:bg-cta-warning-clicked disabled:bg-cta-warning-disable',
        danger:
          'text-white bg-cta-danger hover:bg-cta-danger-hover active:bg-cta-danger-clicked disabled:bg-cta-danger-disable',
        'danger-outline':
          'text-cta-danger border border-cta-danger hover:bg-badge-danger active:text-white active:bg-cta-danger-clicked active:border-cta-danger-clicked disabled:text-gray-50 disabled:border-gray-50',
      },
      size: {
        regular: 'h-10 min-w-10 px-[14px] hl-16px-400',
        sm: 'h-8 min-w-8 px-[10px] hl-14px-400',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'regular',
    },
  },
)

const loadingVariants = cva('animate-spin', {
  variants: {
    size: {
      regular: 'text-2xl',
      sm: 'text-xl',
    },
  },
  defaultVariants: {
    size: 'regular',
  },
})

withDefaults(
  defineProps<{
    variant?: NonNullable<Parameters<typeof buttonVariants>[0]>['variant']
    size?: NonNullable<Parameters<typeof buttonVariants>[0]>['size']
    loading?: boolean
    disabled?: boolean
    href?: string
    target?: '_bank' | '_self' | '_parent' | '_top'
    rel?: 'noopener' | 'noreferrer' | 'nofollow'
    type?: 'button' | 'submit'
  }>(),
  {
    variant: 'primary',
    size: 'regular',
    href: undefined,
    target: undefined,
    rel: undefined,
    type: 'button',
  },
)
</script>

<template>
  <NuxtLink
    v-if="href"
    :href="href"
    :target="target"
    :rel="rel"
    :class="
      cn(buttonVariants({ variant, size }), $attrs.class ?? '', {
        'pointer-events-none bg-cta-primary-disable': loading || disabled,
      })
    "
  >
    <Icon v-if="loading" name="ph:circle-notch" :class="loadingVariants({ size })" />
    <slot v-else />
  </NuxtLink>

  <button
    v-else
    :type="type"
    :class="cn(buttonVariants({ variant, size }), $attrs.class ?? '')"
    :disabled="loading || disabled"
  >
    <Icon v-if="loading" name="ph:circle-notch" :class="loadingVariants({ size })" />
    <slot v-else />
  </button>
</template>
