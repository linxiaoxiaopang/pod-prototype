<template>
  <span class="social-icon" :class="'social-icon--' + name" v-html="svg"></span>
</template>

<script>
const ICONS = {
  facebook: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#1877F2"/>
      <path fill="#fff" d="M16.67 15.47 17.2 12h-3.33V9.76c0-.95.47-1.88 1.96-1.88h1.45V4.93s-1.37-.24-2.68-.24c-2.74 0-4.53 1.66-4.53 4.67V12H7.04v3.47h3.03V24a12.06 12.06 0 0 0 3.8 0v-8.53h2.8Z"/>
    </svg>`,
  feishu: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#3370FF"/>
      <path fill="#fff" d="M12.3 5.2c-2.6 0-4.6 1.1-5.9 2.5-.5.5-.2 1.3.5 1.3h5.6c1.2 0 1.9.6 2 1.6H8.1c-1.6 0-2.7 1.1-2.7 2.5 0 .5.1.9.3 1.3h6.5c.9 0 1.5.4 1.7 1.1H7.4c1.3 1.2 3.2 1.9 5.5 1.9 4.3 0 7.1-2.7 7.1-6.6 0-3.3-2.4-5.6-7.7-5.6Z"/>
    </svg>`,
  telegram: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#29A9EB"/>
      <path fill="#fff" d="M5.5 11.8 18.4 6.8c.6-.2 1.1.2.9.9l-2.2 10.4c-.2.7-.6.9-1.2.6l-3.2-2.4-1.6 1.5c-.2.2-.3.3-.6.3l.2-3.3 6-5.4c.3-.2-.1-.4-.4-.2l-7.4 4.7-3.2-1c-.7-.2-.7-.7.1-1Z"/>
    </svg>`,
  whatsapp: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#25D366"/>
      <path fill="#fff" d="M12 4.5a7.4 7.4 0 0 0-6.3 11.3L4.5 19.5l3.8-1.2A7.4 7.4 0 1 0 12 4.5Zm0 13.5a6.1 6.1 0 0 1-3.1-.9l-.2-.1-2.3.7.7-2.2-.2-.3A6.1 6.1 0 1 1 12 18Zm3.4-4.6c-.2-.1-1.1-.5-1.2-.6-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.2-.4.1a5 5 0 0 1-2.4-2.1c-.2-.3 0-.4.1-.5l.5-.6c.1-.1 0-.3 0-.4l-.6-1.3c-.1-.3-.2-.3-.4-.3h-.4c-.1 0-.4.1-.6.3-.2.2-.8.7-.8 1.8s.8 2.1.9 2.3c.1.1 1.6 2.5 3.9 3.4 2.2.9 2.2.6 2.6.6.4 0 1.1-.5 1.3-.9.2-.5.2-.9.1-.9-.1-.1-.2-.1-.4-.2Z"/>
    </svg>`,
  instagram: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="social-ig-gradient" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stop-color="#FEDA75"/>
          <stop offset="0.3" stop-color="#FA7E1E"/>
          <stop offset="0.6" stop-color="#D62976"/>
          <stop offset="1" stop-color="#962FBF"/>
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#social-ig-gradient)"/>
      <rect x="5.5" y="5.5" width="13" height="13" rx="4" fill="none" stroke="#fff" stroke-width="1.6"/>
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="#fff" stroke-width="1.6"/>
      <circle cx="16.4" cy="7.6" r="1" fill="#fff"/>
    </svg>`,
  pinterest: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#E60023"/>
      <path fill="#fff" d="M12.04 4.8c-4.02 0-6.04 2.7-6.04 4.95 0 1.37.55 2.58 1.72 3.03.19.08.36 0 .42-.21l.17-.67c.06-.21.03-.28-.12-.46-.34-.4-.55-.9-.55-1.6 0-2.08 1.55-3.94 4.04-3.94 2.2 0 3.41 1.35 3.41 3.15 0 2.37-1.05 4.37-2.6 4.37-.86 0-1.5-.71-1.3-1.58.25-1.04.73-2.17.73-2.92 0-.67-.36-1.24-1.11-1.24-.88 0-1.59.91-1.59 2.13 0 .78.26 1.3.26 1.3l-1.05 4.47c-.31 1.33-.05 2.96-.03 3.12.02.1.14.12.2.05.08-.11 1.13-1.4 1.49-2.69.1-.36.58-2.26.58-2.26.28.54 1.11 1.02 1.99 1.02 2.62 0 4.4-2.39 4.4-5.58 0-2.42-2.05-4.38-4.87-4.38Z"/>
    </svg>`
}

export default {
  name: 'SocialIcon',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    svg() {
      return ICONS[this.name] || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.social-icon {
  display: inline-flex;
  width: 100%;
  height: 100%;
}
</style>
