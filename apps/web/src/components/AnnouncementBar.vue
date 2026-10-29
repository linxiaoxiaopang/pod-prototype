<template>
  <div v-if="visible" class="announce">
    <div class="container announce-inner">
      <span class="announce-tag">{{ data.tag }}</span>

      <p class="announce-text">
        <strong>{{ data.title }}</strong>
        <span class="announce-desc">{{ data.desc }}</span>
      </p>

      <router-link class="announce-cta" :to="data.to">
        {{ data.cta }}
        <i class="el-icon-right"></i>
      </router-link>

      <button class="announce-close" aria-label="关闭公告" @click="close">
        <i class="el-icon-close"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { announcement } from '@/data/content'

const STORAGE_KEY = 'pod-announcement-dismissed'

export default {
  name: 'AnnouncementBar',
  data() {
    return {
      data: announcement,
      visible: true
    }
  },
  mounted() {
    this.visible = window.sessionStorage.getItem(STORAGE_KEY) !== '1'
  },
  methods: {
    close() {
      this.visible = false
      window.sessionStorage.setItem(STORAGE_KEY, '1')
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.announce {
  position: relative;
  z-index: 60;
  background: $ink;
  color: #fff;
}

.announce-inner {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: $announce-h;
  padding-top: 8px;
  padding-bottom: 8px;
}

.announce-tag {
  flex-shrink: 0;
  padding: 3px 9px;
  border-radius: 6px;
  background: $accent;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.announce-text {
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
  font-size: 13.5px;
  line-height: 1.5;

  strong {
    font-weight: 800;
    white-space: nowrap;
  }
}

.announce-desc {
  color: rgba(255, 255, 255, 0.6);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.announce-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  margin-left: auto;
  padding: 6px 14px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 99px;
  font-size: 12.5px;
  font-weight: 700;
  color: #fff;
  transition: background 0.25s $ease, border-color 0.25s $ease;

  i {
    font-size: 11px;
    transition: transform 0.25s $ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.14);
    border-color: rgba(255, 255, 255, 0.5);

    i {
      transform: translateX(3px);
    }
  }
}

.announce-close {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s $ease, color 0.2s $ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
  }
}

@include down(900px) {
  .announce-desc {
    display: none;
  }
}

@include down(560px) {
  .announce-inner {
    gap: 10px;
  }

  .announce-tag {
    padding: 3px 7px;
    font-size: 10px;
  }

  .announce-text {
    flex: 1;
    min-width: 0;
    font-size: 12.5px;

    strong {
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .announce-cta {
    padding: 5px 10px;
    font-size: 11.5px;
  }
}

@include down(430px) {
  .announce-tag {
    display: none;
  }
}
</style>
