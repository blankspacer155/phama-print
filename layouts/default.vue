<template>
    <div class="app">
      <img 
      src="~/assets/images/hospital.jpg" 
      class="absolute inset-0 w-full h-full object-cover -z-10" 
      alt="background"/>
      <div class="absolute inset-0 bg-white/30 backdrop-blur-sm -z-10"></div>

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
        &copy; ชนิสรา ปิ่นสุวรรณ และ ศิริประภา หมากสุข มหาวิทยาลัยเชียงใหม่ 2569. สงวนลิขสิทธิ์.
      </p>
      </div>
     
    </UiFixedFooter>
  </div>
</template>