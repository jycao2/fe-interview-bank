<script setup>
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useQuestionsStore } from '@/stores/questions'
import { categories } from '@/data/categories'
import { examQuestionCount } from '@/data/exam'
import SearchBar from '@/components/SearchBar.vue'
import QuestionCard from '@/components/QuestionCard.vue'

const store = useQuestionsStore()
const { totalCount, filteredQuestions, keyword } = storeToRefs(store)
</script>

<template>
  <div class="home container">
    <section class="hero">
      <h1>前端面试题库</h1>
      <p class="hero-sub">
        覆盖 HTML · CSS · JavaScript · TypeScript · Vue · React · 浏览器 · 网络 · 性能 · 工程化 · 算法 · 手写
        等方向的高质量面试题与答案解析，共 <strong>{{ totalCount }}</strong> 题，持续更新。
      </p>
    </section>

    <RouterLink to="/exam" class="exam-banner">
      <span class="exam-banner-emoji">📝</span>
      <span class="exam-banner-body">
        <strong>模拟考试</strong>
        <span class="muted">从 {{ examQuestionCount }} 道选择题随机抽 30 题，交卷即出分，附错题解析 →</span>
      </span>
      <span class="exam-banner-cta">开始考试</span>
    </RouterLink>

    <RouterLink to="/algorithm-exam" class="exam-banner algo-banner">
      <span class="exam-banner-emoji">💻</span>
      <span class="exam-banner-body">
        <strong>算法实战 · 在线判题</strong>
        <span class="muted">45 道 LeetCode 风格手写题，浏览器内 Web Worker 沙箱运行，自动判题 →</span>
      </span>
      <span class="exam-banner-cta">开始刷题</span>
    </RouterLink>

    <div class="cat-grid">
      <RouterLink
        v-for="c in store.categoryStats"
        :key="c.id"
        :to="`/category/${c.id}`"
        class="cat-tile"
      >
        <span class="cat-tile-icon">{{ c.icon }}</span>
        <span class="cat-tile-name">{{ c.name }}</span>
        <span class="cat-tile-desc">{{ c.desc }}</span>
        <span class="cat-tile-count">{{ c.count }} 题</span>
      </RouterLink>
    </div>

    <section class="all-section">
      <h2 class="section-title">全部题目</h2>
      <SearchBar />

      <div v-if="filteredQuestions.length" class="qgrid">
        <QuestionCard
          v-for="q in filteredQuestions"
          :key="q.id"
          :question="q"
        />
      </div>

      <div v-else class="empty">
        <p>没有找到与「{{ keyword }}」相关的题目。</p>
        <button class="reset-btn" @click="keyword = ''">清除搜索</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  padding-top: 8px;
}
.hero {
  text-align: center;
  padding: 32px 16px 28px;
}
.hero h1 {
  font-size: 32px;
  font-weight: 750;
  letter-spacing: -0.5px;
  margin-bottom: 12px;
  background: linear-gradient(90deg, var(--brand), var(--brand-700));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-sub {
  max-width: 680px;
  margin: 0 auto;
  color: var(--text-soft);
  font-size: 15px;
  line-height: 1.7;
}
.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  margin: 8px 0 36px;
}
.exam-banner {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 22px;
  margin-bottom: 24px;
  background: linear-gradient(135deg, var(--brand-soft), var(--bg-elevated));
  border: 1px solid var(--brand);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--text);
  transition: transform 0.12s, box-shadow 0.15s;
}
.exam-banner:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  text-decoration: none;
}
.exam-banner-emoji {
  font-size: 30px;
  flex-shrink: 0;
}
.exam-banner-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  line-height: 1.5;
}
.exam-banner-body strong {
  font-size: 16px;
}
.exam-banner-body .muted {
  font-size: 13px;
}
.exam-banner-cta {
  flex-shrink: 0;
  padding: 8px 18px;
  background: var(--brand);
  color: #fff;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
}
@media (max-width: 640px) {
  .exam-banner {
    flex-wrap: wrap;
  }
  .exam-banner-cta {
    width: 100%;
    text-align: center;
  }
}
.cat-tile {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  text-decoration: none;
  color: var(--text);
  transition: border-color 0.15s, transform 0.12s, box-shadow 0.15s;
}
.cat-tile:hover {
  border-color: var(--brand);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
  text-decoration: none;
}
.cat-tile-icon {
  font-size: 24px;
}
.cat-tile-name {
  font-size: 15px;
  font-weight: 650;
}
.cat-tile-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
  flex: 1;
}
.cat-tile-count {
  font-size: 12px;
  color: var(--brand);
  font-weight: 600;
  margin-top: 4px;
}
.section-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
}
.qgrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 14px;
}
.empty {
  text-align: center;
  padding: 48px 16px;
  color: var(--text-muted);
}
.reset-btn {
  margin-top: 12px;
  padding: 8px 18px;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--brand);
  border-radius: var(--radius-sm);
  font-size: 14px;
}
.reset-btn:hover {
  border-color: var(--brand);
}
@media (max-width: 768px) {
  .hero h1 {
    font-size: 26px;
  }
}
</style>
