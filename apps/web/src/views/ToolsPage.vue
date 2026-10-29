<template>
  <div class="tools-page">
    <PageHeader
      eyebrow="工具"
      title="POD 卖家必备的软件与工具"
      desc="从按需打印卖家的视角评审设计、样机、个性化与营销软件，而不是泛泛的 SaaS 榜单。"
    >
      <template #actions>
        <el-button round @click="$router.push('/comparisons')">平台对比</el-button>
      </template>
    </PageHeader>

    <div class="container body">
      <div class="notice" v-reveal>
        <i class="el-icon-time"></i>
        <div>
          <p class="notice-title">工具测评即将上线</p>
          <p class="notice-text">
            下面已划好品类范围，各工具的评分标准与价格核查正在整理中。供应商数据与成本指数已可正常使用。
          </p>
        </div>
      </div>

      <div class="grid">
        <article v-for="group in groups" :key="group.title" class="card" v-reveal>
          <span class="icon"><i :class="group.icon"></i></span>
          <h2>{{ group.title }}</h2>
          <p>{{ group.desc }}</p>
          <ul>
            <li v-for="tool in group.tools" :key="tool">{{ tool }}</li>
          </ul>
          <span class="status">测评进行中</span>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'ToolsPage',
  components: { PageHeader },
  data() {
    return {
      groups: [
        {
          title: '设计与样机',
          icon: 'el-icon-picture-outline',
          desc: '用于制作设计稿，并在真实底衫上预览效果后再上架。',
          tools: ['Kittl', 'Placeit', 'Canva', 'Adobe Express']
        },
        {
          title: '个性化定制',
          icon: 'el-icon-magic-stick',
          desc: '让买家自行添加姓名、照片与文字，同时保证印刷文件依然合格。',
          tools: ['Customily', 'Zakeke', 'Inkybay']
        },
        {
          title: '营销与留存',
          icon: 'el-icon-message',
          desc: '面向设计款长尾店铺的邮件、短信与广告工具。',
          tools: ['Klaviyo', 'Postscript', 'Printful 集成']
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.body {
  padding-top: 40px;
  padding-bottom: 92px;
}

.notice {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 20px;
  margin-bottom: 26px;
  border-radius: 16px;
  border: 1px dashed rgba(91, 75, 255, 0.35);
  background: rgba(91, 75, 255, 0.05);

  > i {
    margin-top: 2px;
    font-size: 18px;
    color: $primary;
  }
}

.notice-title {
  font-size: 14px;
  font-weight: 800;
  color: $ink;
  margin-bottom: 4px;
}

.notice-text {
  font-size: 13px;
  line-height: 1.65;
  color: $ink-soft;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.card {
  display: flex;
  flex-direction: column;
  padding: 26px;
  border-radius: 20px;
  border: 1px solid $line;
  background: #fff;
  transition: transform 0.3s $ease, box-shadow 0.3s $ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-sm;
  }

  h2 {
    font-size: 17px;
    margin: 16px 0 8px;
  }

  p {
    font-size: 13.5px;
    line-height: 1.7;
    color: $ink-soft;
    margin-bottom: 16px;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-bottom: 20px;

    li {
      padding: 4px 9px;
      border-radius: 6px;
      background: $bg-soft;
      font-size: 11.5px;
      font-weight: 600;
      color: $ink-soft;
    }
  }
}

.icon {
  @include flex-center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: $primary-soft;
  color: $primary;
  font-size: 20px;
}

.status {
  margin-top: auto;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: $muted;
}

@include down(980px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@include down(560px) {
  .body {
    padding-bottom: 64px;
  }
}
</style>
