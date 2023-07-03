<script setup lang="ts">
  useHead({
    title: "ORT Search",
  });

  definePageMeta({
    auth: true,
    roles : []
  });

  onMounted(()=>{
    
  })
  const { locale, setLocale,  } = useI18n()
  const switchLocalePath = useSwitchLocalePath();
  const localePath = useLocalePath()

  async function switchLocale (locale){
    console.log(locale)
    setLocale(locale);
    const newLocalePath = switchLocalePath(locale);
    await navigateTo(newLocalePath);       
  }
</script>

<template>
  <div>
    <code>
        Welcome to search   
    </code>
  </div>
</template>