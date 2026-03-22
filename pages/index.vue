<script setup lang="ts">

</script>

<template>
    <main class="container my-16">
        <UiPanel variant="outline" class=" px-6 py-16">
            <div class="flex flex-col gap-4 items-center">
                <NuxtLink to="/patients"><UiButton>สร้างรายการ</UiButton></NuxtLink>
                <NuxtLink to="/medicines"><UiButton>ยา</UiButton></NuxtLink>
                <NuxtLink to="/doctors"><UiButton>หมอ</UiButton></NuxtLink>
            </div>
        </UiPanel>
    </main>
</template>
