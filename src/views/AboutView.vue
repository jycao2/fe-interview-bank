<script setup>
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useQuestionsStore } from '@/stores/questions'
import { categories } from '@/data/categories'

const store = useQuestionsStore()
const { totalCount, categoryStats } = storeToRefs(store)
</script>

<template>
  <div class="about-view container">
    <h1>关于本题库</h1>

    <section class="block">
      <h2>项目简介</h2>
      <p>
        这是一个基于 <strong>Vue 3 + Vite + Pinia + Vue Router</strong> 构建的前端技术总结与面试题库项目，
        旨在系统整理前端面试高频知识点，提供覆盖全面的题目与<strong>答案解析</strong>，方便复习与备战面试。
      </p>
      <p>
        目前收录 <strong>{{ totalCount }}</strong> 道题目，覆盖 {{ categories.length }} 个方向，支持
        分类浏览、关键词搜索、难度筛选、收藏等功能。
      </p>
    </section>

    <section class="block">
      <h2>覆盖方向</h2>
      <ul class="dir-list">
        <li v-for="c in categoryStats" :key="c.id">
          <RouterLink :to="`/category/${c.id}`">
            <span class="dir-icon">{{ c.icon }}</span>
            <span class="dir-name">{{ c.name }}</span>
            <span class="dir-count">{{ c.count }}</span>
          </RouterLink>
        </li>
      </ul>
    </section>

    <section class="block">
      <h2>功能特性</h2>
      <ul class="feat-list">
        <li>🗂️ 分类导航：12 个前端方向，按主题系统化学习。</li>
        <li>🔍 全文搜索：支持按题目、标签、答案内容检索。</li>
        <li>🎯 难度筛选：简单 / 中等 / 困难分级。</li>
        <li>⭐ 收藏功能：本地持久化保存，随时回顾重点题目。</li>
        <li>🌙 深色模式：跟随系统或手动切换，护眼舒适。</li>
        <li>📱 响应式布局：桌面与移动端皆可使用。</li>
        <li>🔗 上下题导航与相关推荐，便于连贯学习。</li>
      </ul>
    </section>

    <section class="block">
      <h2>技术栈</h2>
      <div class="tech-tags">
        <span>Vue 3</span><span>Vite</span><span>Pinia</span>
        <span>Vue Router</span><span>Marked</span>
      </div>
    </section>

    <section class="block">
      <h2>使用说明</h2>
      <pre><code>npm install      # 安装依赖
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览构建产物</code></pre>
      <p class="muted small">
        题目内容均为内置数据，存储在 <code>src/data/</code> 目录下，可按相同结构持续扩充。
      </p>
    </section>

    <section class="block">
      <h2>项目仓库</h2>
      <p>本项目已开源至 GitHub，欢迎 Star ⭐ / PR / Issue。</p>
      <div class="repo-card">
        <a
          class="repo-link"
          href="https://github.com/jycao2/fe-interview-bank"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="repo-icon">🐙</span>
          <span class="repo-text">
            <span class="repo-url">github.com/jycao2/fe-interview-bank</span>
            <span class="repo-desc">前端面试题库 · 源代码仓库</span>
          </span>
          <span class="repo-cta">访问仓库 →</span>
        </a>
        <div class="author-row">
          <span class="author-label">作者：</span>
          <a
            class="author-link"
            href="https://github.com/jycao2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="author-avatar">👾</span>
            <span class="author-name">jycao2</span>
          </a>
        </div>
      </div>
    </section>

    <p class="footer muted">
      本题库内容仅供学习交流，欢迎补充与指正。
    </p>
  </div>
</template>

<style scoped>
.about-view {
  padding-top: 8px;
  max-width: 760px;
}
.about-view h1 {
  font-size: 28px;
  margin-bottom: 24px;
}
.block {
  margin-bottom: 32px;
}
.block h2 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}
.block p {
  line-height: 1.8;
}
.dir-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
}
.dir-list a {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-soft);
  text-decoration: none;
  font-size: 14px;
}
.dir-list a:hover {
  border-color: var(--brand);
  color: var(--brand);
  text-decoration: none;
}
.dir-icon {
  font-size: 16px;
}
.dir-name {
  flex: 1;
}
.dir-count {
  font-size: 12px;
  color: var(--text-muted);
}
.feat-list {
  line-height: 2.1;
  padding-left: 1.2em;
}
.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tech-tags span {
  padding: 4px 12px;
  background: var(--brand-soft);
  color: var(--brand);
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}
pre {
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  overflow-x: auto;
}
pre code {
  color: var(--code-text);
  font-size: 13px;
  line-height: 1.7;
}

/* 项目仓库卡片 */
.repo-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.repo-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: linear-gradient(135deg, var(--brand-soft), var(--bg-elevated));
  border: 1px solid var(--border);
  border-radius: var(--radius);
  text-decoration: none;
  color: var(--text);
  transition: all 0.18s;
}
.repo-link:hover {
  border-color: var(--brand);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}
.repo-icon {
  font-size: 28px;
  flex-shrink: 0;
}
.repo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}
.repo-url {
  font-size: 15px;
  font-weight: 700;
  color: var(--brand);
  font-family: 'SF Mono', 'Consolas', monospace;
  word-break: break-all;
}
.repo-desc {
  font-size: 12px;
  color: var(--text-muted);
}
.repo-cta {
  font-size: 13px;
  font-weight: 600;
  color: var(--brand);
  flex-shrink: 0;
  white-space: nowrap;
}
.author-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--bg-sunken);
  border-radius: var(--radius-sm);
  font-size: 14px;
}
.author-label {
  color: var(--text-muted);
}
.author-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: var(--text);
  padding: 3px 10px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 999px;
  transition: all 0.15s;
}
.author-link:hover {
  border-color: var(--brand);
  color: var(--brand);
}
.author-avatar {
  font-size: 16px;
}
.author-name {
  font-weight: 700;
  color: var(--brand);
}

.small {
  font-size: 13px;
}
.footer {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  font-size: 13px;
  text-align: center;
}
</style>
