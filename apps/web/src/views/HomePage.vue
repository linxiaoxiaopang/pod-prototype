<template>
  <div class="home">
    <HeroSection />
    <PlatformProof />
    <FeaturedSuppliers />
    <NewsletterSection />
    <DiscoveryCards />
    <LatestArticles />
    <FaqSection />
  </div>
</template>

<script>
import HeroSection from '@/components/HeroSection.vue'
import PlatformProof from '@/components/PlatformProof.vue'
import FeaturedSuppliers from '@/components/FeaturedSuppliers.vue'
import NewsletterSection from '@/components/NewsletterSection.vue'
import DiscoveryCards from '@/components/DiscoveryCards.vue'
import LatestArticles from '@/components/LatestArticles.vue'
import FaqSection from '@/components/FaqSection.vue'

export default {
  name: 'HomePage',
  components: {
    HeroSection,
    PlatformProof,
    FeaturedSuppliers,
    NewsletterSection,
    DiscoveryCards,
    LatestArticles,
    FaqSection
  }
}
</script>
