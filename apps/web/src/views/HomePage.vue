<template>
  <div class="home">
    <HeroSection />
    <FeaturedSuppliers />
    <NewsletterSection />
    <FaqSection />
  </div>
</template>

<script>
import HeroSection from '@/components/HeroSection.vue'
import FeaturedSuppliers from '@/components/FeaturedSuppliers.vue'
import NewsletterSection from '@/components/NewsletterSection.vue'
import FaqSection from '@/components/FaqSection.vue'

export default {
  name: 'HomePage',
  components: {
    HeroSection,
    FeaturedSuppliers,
    NewsletterSection,
    FaqSection
  }
}
</script>
