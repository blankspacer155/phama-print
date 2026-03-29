<template>
    <div class="app">
    <nav class="flex h-16 w-full items-center border-b border-gray-400 bg-white">
      <ul class="container flex justify-between gap-4">
        <li>
          <NuxtLink href="/" class=" text-2xl">
            หน้าแรก
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <slot />
    <UiFixedFooter>
      <div class=" w-full text-center">
         <p class=" text-sm  text-white ">
        &copy; บิ่มบิ้ม และเพื่อนๆ 2026. สงวนลิขสิทธิ์.
      </p>
      </div>
     
    </UiFixedFooter>
  </div>
</template>