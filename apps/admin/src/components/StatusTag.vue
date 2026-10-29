<template>
  <span class="status" :class="`is-${tone}`">
    <i></i>
    {{ label }}
  </span>
</template>

<script>
const MAP = {
  active: { label: '运营中', tone: 'success' },
  live: { label: '已上架', tone: 'success' },
  published: { label: '已发布', tone: 'success' },
  paused: { label: '已暂停', tone: 'warning' },
  review: { label: '待审核', tone: 'warning' },
  draft: { label: '草稿', tone: 'muted' }
}

export default {
  name: 'StatusTag',
  props: {
    status: { type: String, default: 'draft' }
  },
  computed: {
    label() {
      return (MAP[this.status] || MAP.draft).label
    },
    tone() {
      return (MAP[this.status] || MAP.draft).tone
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;

  i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  &.is-success {
    background: rgba(22, 185, 129, 0.12);
    color: #0e9c6c;
  }

  &.is-warning {
    background: rgba(245, 158, 11, 0.14);
    color: #b4740a;
  }

  &.is-muted {
    background: rgba(133, 138, 163, 0.14);
    color: #6c7189;
  }
}
</style>
