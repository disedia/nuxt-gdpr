<template>
  <section class="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-24">
    <div class="bg-gray-50 border-1 rounded min-h-screen">
      <h1 class="text-red-600">
        Test
      </h1>
      <div>
        {{ t('title') }}
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
  const { t } = useTexts('gdpr')

</script>
