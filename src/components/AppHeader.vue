<script setup>
import { RouterLink } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <RouterLink to="/" class="brand">
        <span class="logo">📝</span>
        <span class="brand-text">
          <strong>前端面试题库</strong>
          <small>FE Interview Bank</small>
        </span>
      </RouterLink>

      <nav class="nav">
        <RouterLink to="/" exact-active-class="active">首页</RouterLink>
        <RouterLink to="/exam" active-class="active">考试</RouterLink>
        <RouterLink to="/algorithm-exam" active-class="active">算法</RouterLink>
        <RouterLink to="/wrong-questions" active-class="active">错题</RouterLink>
        <RouterLink to="/favorites" active-class="active">收藏</RouterLink>
        <RouterLink to="/about" active-class="active">关于</RouterLink>
      </nav>

      <button class="theme-btn" :title="theme === 'dark' ? '切换到浅色' : '切换到深色'"
        @click="toggleTheme">
        <span v-if="theme === 'dark'">☀️</span>
        <span v-else>🌙</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-h);
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border);
  backdrop-filter: saturate(180%) blur(8px);
}
.header-inner {
  height: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 20px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text);
}
.logo {
  font-size: 24px;
}
.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.brand-text strong {
  font-size: 15px;
}
.brand-text small {
  font-size: 11px;
  color: var(--text-muted);
}
.nav {
  display: flex;
  gap: 4px;
  margin-left: auto;
}
.nav a {
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  color: var(--text-soft);
  font-size: 14px;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}
.nav a:hover {
  background: var(--bg-sunken);
  color: var(--text);
  text-decoration: none;
}
.nav a.active {
  color: var(--brand);
  background: var(--brand-soft);
  font-weight: 600;
}
.theme-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  font-size: 16px;
  transition: background 0.15s, transform 0.1s;
}
.theme-btn:hover {
  background: var(--bg-sunken);
}
.theme-btn:active {
  transform: scale(0.94);
}
@media (max-width: 768px) {
  .brand-text small {
    display: none;
  }
  .header-inner {
    padding: 0 14px;
    gap: 10px;
  }
  .nav a {
    padding: 6px 10px;
  }
}
</style>
