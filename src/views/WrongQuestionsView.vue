<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWrongQuestionsStore } from '@/stores/wrongQuestions'
import { useAlgorithmExamStore } from '@/stores/algorithmExam'
import { renderMarkdown } from '@/utils/markdown'

const router = useRouter()
const store = useWrongQuestionsStore()
const algoStore = useAlgorithmExamStore()
const { wrongList, count, statsByDifficulty } = storeToRefs(store)

// 筛选
const diffFilter = ref('all')
const filteredList = computed(() => {
  if (diffFilter.value === 'all') return wrongList.value
  return wrongList.value.filter(it => it.problem.difficulty === diffFilter.value)
})

// 选中查看历史记录的题目
const selectedId = ref(null)
const selectedItem = computed(() => {
  if (!selectedId.value) return null
  return wrongList.value.find(it => it.id === selectedId.value) || null
})
const renderedSolution = computed(() => {
  if (!selectedItem.value) return ''
  return renderMarkdown(selectedItem.value.problem.solution)
})

function viewHistory(id) {
  selectedId.value = selectedId.value === id ? null : id
}

function removeOne(id) {
  if (!confirm('确定从错题集移除该题？')) return
  store.removeOne(id)
  if (selectedId.value === id) selectedId.value = null
}

function clearAll() {
  if (!count.value) return
  if (!confirm(`确定清空全部 ${count.value} 道错题？此操作不可恢复。`)) return
  store.clearAll()
  selectedId.value = null
}

// 从错题集生成考试
function startWrongExam() {
  const ids = store.generateExam({ limit: 20, shuffle: true })
  if (!ids.length) return
  const problems = ids
    .map(id => wrongList.value.find(it => it.id === id)?.problem)
    .filter(Boolean)
  if (!problems.length) return
  algoStore.startExam(problems)
  router.push('/algorithm-exam')
}

// 时间格式化
function formatTime(ts) {
  if (!ts) return '-'
  const d = new Date(ts)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
function formatDuration(sec) {
  if (!sec) return '-'
  if (sec < 60) return `${sec}s`
  return `${Math.floor(sec / 60)}m ${sec % 60}s`
}

function diffClass(d) {
  return { 'diff-easy': d === '简单', 'diff-medium': d === '中等', 'diff-hard': d === '困难' }
}
</script>

<template>
  <div class="wrong-questions">
    <!-- 头部 -->
    <div class="page-header">
      <h1>❌ 算法错题集</h1>
      <p class="subtitle">
        自动收录你在「算法实战」中答错的题目，浏览器 <strong>localStorage 永久存储</strong>。<br>
        再次答对的题目会自动移除，也支持手动移除单题或一键清空。
      </p>
      <div class="stats-row">
        <span class="stat-pill">📊 错题 {{ count }}</span>
        <span class="stat-pill diff-easy">🟢 简单 {{ statsByDifficulty.简单 }}</span>
        <span class="stat-pill diff-medium">🟡 中等 {{ statsByDifficulty.中等 }}</span>
        <span class="stat-pill diff-hard">🔴 困难 {{ statsByDifficulty.困难 }}</span>
      </div>
    </div>

    <!-- 操作栏 -->
    <div v-if="count > 0" class="action-bar">
      <div class="filter-group">
        <button :class="{ active: diffFilter === 'all' }" @click="diffFilter = 'all'">全部</button>
        <button :class="{ active: diffFilter === '简单' }" @click="diffFilter = '简单'">简单</button>
        <button :class="{ active: diffFilter === '中等' }" @click="diffFilter = '中等'">中等</button>
        <button :class="{ active: diffFilter === '困难' }" @click="diffFilter = '困难'">困难</button>
      </div>
      <div class="actions-right">
        <button class="btn-primary" @click="startWrongExam" :disabled="!filteredList.length">
          🎯 从错题生成考试（最多 20 题）
        </button>
        <button class="btn-danger" @click="clearAll">🗑 清空</button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="count === 0" class="empty-state">
      <div class="empty-emoji">🎉</div>
      <h2>暂无错题</h2>
      <p>去「算法实战」答题，答错的题目会自动收入这里。</p>
      <RouterLink to="/algorithm-exam" class="btn-primary">前往算法实战 →</RouterLink>
    </div>

    <!-- 错题列表 -->
    <div v-else class="wrong-list">
      <div v-for="it in filteredList" :key="it.id" class="wrong-card">
        <div class="card-head">
          <div class="card-head-left">
            <span class="card-no">{{ it.problem.no }}</span>
            <span class="card-diff" :class="diffClass(it.problem.difficulty)">{{ it.problem.difficulty }}</span>
            <h3 class="card-title">{{ it.problem.title }}</h3>
          </div>
          <div class="card-head-right">
            <span class="attempts-badge" title="历史答题次数">
              📝 {{ it.attempts }} 次尝试
            </span>
            <span class="last-time" title="最近一次答题时间">{{ formatTime(it.lastAttemptAt) }}</span>
          </div>
        </div>

        <div class="card-tags">
          <span v-for="t in it.problem.tags" :key="t" class="card-tag">{{ t }}</span>
        </div>

        <div class="card-meta">
          <span class="meta-item">⏱ 期望复杂度 {{ it.problem.timeComplexity }}</span>
          <span class="meta-item">💾 空间复杂度 {{ it.problem.spaceComplexity }}</span>
        </div>

        <div class="card-actions">
          <button class="btn-ghost btn-sm" @click="viewHistory(it.id)">
            {{ selectedId === it.id ? '收起历史' : '📖 查看历史 / 题解' }}
          </button>
          <button class="btn-danger-soft btn-sm" @click="removeOne(it.id)">✕ 移除</button>
        </div>

        <!-- 历史记录 + 题解（展开式） -->
        <div v-if="selectedId === it.id" class="card-detail">
          <div class="detail-section">
            <h4>📜 答题历史（最近 {{ it.history.length }} 次）</h4>
            <ul class="history-list">
              <li
                v-for="(h, idx) in it.history"
                :key="h.time"
                class="history-item"
                :class="{ pass: h.passed, fail: !h.passed }"
              >
                <div class="history-row">
                  <span class="history-no">#{{ it.history.length - idx }}</span>
                  <span class="history-status">{{ h.passed ? '✅ 通过' : '❌ 未通过' }}</span>
                  <span class="history-time">{{ formatTime(h.time) }}</span>
                  <span class="history-dur">用时 {{ formatDuration(h.duration) }}</span>
                  <span v-if="!h.passed && h.failedCase != null" class="history-case">
                    失败用例 #{{ h.failedCase + 1 }}
                  </span>
                </div>
                <div v-if="h.error" class="history-error">
                  <code>{{ h.error }}</code>
                </div>
                <details v-if="h.userCode" class="history-code">
                  <summary>查看本次提交代码</summary>
                  <pre>{{ h.userCode }}</pre>
                </details>
              </li>
            </ul>
          </div>

          <div class="detail-section">
            <h4>💡 参考题解</h4>
            <div class="solution-body markdown-body" v-html="renderedSolution"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrong-questions {
  max-width: var(--max-content);
  margin: 0 auto;
  padding: 16px;
}
.page-header {
  margin-bottom: 20px;
}
.page-header h1 {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 8px;
}
.subtitle {
  color: var(--text-soft);
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 14px;
}
.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.stat-pill {
  padding: 5px 12px;
  background: var(--bg-sunken);
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 13px;
  color: var(--text-soft);
}
.stat-pill.diff-easy { color: var(--easy); border-color: var(--easy); background: var(--easy-bg); }
.stat-pill.diff-medium { color: var(--medium); border-color: var(--medium); background: var(--medium-bg); }
.stat-pill.diff-hard { color: var(--hard); border-color: var(--hard); background: var(--hard-bg); }

/* 操作栏 */
.action-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  padding: 12px 14px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.filter-group {
  display: flex;
  gap: 4px;
  background: var(--bg-sunken);
  padding: 3px;
  border-radius: var(--radius-sm);
}
.filter-group button {
  padding: 6px 14px;
  border: none;
  background: transparent;
  color: var(--text-soft);
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
}
.filter-group button.active {
  background: var(--bg-elevated);
  color: var(--brand);
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}
.actions-right {
  display: flex;
  gap: 8px;
}
.btn-primary {
  background: var(--brand);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  transition: background 0.15s;
}
.btn-primary:hover:not(:disabled) { background: var(--brand-700); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-danger {
  background: var(--hard);
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: background 0.15s;
}
.btn-danger:hover { background: #b51c25; }
.btn-danger-soft {
  background: var(--hard-bg);
  color: var(--hard);
  border: 1px solid var(--hard);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
}
.btn-danger-soft:hover { background: var(--hard); color: white; }
.btn-ghost {
  background: var(--bg-sunken);
  color: var(--text-soft);
  border: 1px solid var(--border);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
}
.btn-ghost:hover { border-color: var(--brand); color: var(--brand); }
.btn-sm { padding: 5px 10px; font-size: 12px; }

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-muted);
}
.empty-emoji {
  font-size: 64px;
  margin-bottom: 16px;
}
.empty-state h2 {
  font-size: 22px;
  margin-bottom: 8px;
  color: var(--text);
}
.empty-state p {
  margin-bottom: 20px;
  font-size: 14px;
}

/* 错题卡片 */
.wrong-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.wrong-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 18px;
  transition: box-shadow 0.15s;
}
.wrong-card:hover { box-shadow: var(--shadow); }
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.card-head-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.card-no {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 600;
  background: var(--bg-sunken);
  padding: 2px 8px;
  border-radius: 4px;
}
.card-diff {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 600;
}
.card-diff.diff-easy { color: var(--easy); background: var(--easy-bg); }
.card-diff.diff-medium { color: var(--medium); background: var(--medium-bg); }
.card-diff.diff-hard { color: var(--hard); background: var(--hard-bg); }
.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}
.card-head-right {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--text-muted);
}
.attempts-badge {
  padding: 3px 8px;
  background: var(--hard-bg);
  color: var(--hard);
  border-radius: 4px;
  font-weight: 500;
}
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}
.card-tag {
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-sunken);
  border: 1px solid var(--border);
  padding: 2px 8px;
  border-radius: 4px;
}
.card-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 10px;
}
.card-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* 详情展开 */
.card-detail {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--border);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.detail-section h4 {
  font-size: 14px;
  margin-bottom: 10px;
  color: var(--text);
}
.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.history-item {
  background: var(--bg-sunken);
  border-left: 3px solid var(--border);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
}
.history-item.pass { border-left-color: var(--easy); }
.history-item.fail { border-left-color: var(--hard); }
.history-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  color: var(--text-soft);
}
.history-no {
  font-weight: 600;
  color: var(--text);
  min-width: 28px;
}
.history-status {
  font-weight: 600;
}
.history-item.pass .history-status { color: var(--easy); }
.history-item.fail .history-status { color: var(--hard); }
.history-case {
  color: var(--hard);
  font-size: 12px;
}
.history-error {
  margin-top: 6px;
  padding: 6px 8px;
  background: var(--hard-bg);
  border-radius: 4px;
}
.history-error code {
  font-size: 12px;
  color: var(--hard);
  word-break: break-word;
}
.history-code {
  margin-top: 6px;
  font-size: 12px;
}
.history-code summary {
  cursor: pointer;
  color: var(--brand);
  user-select: none;
}
.history-code summary:hover { text-decoration: underline; }
.history-code pre {
  margin-top: 6px;
  background: var(--code-bg);
  color: var(--code-text);
  padding: 10px;
  border-radius: var(--radius-sm);
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.5;
}

/* 题解 markdown */
.solution-body {
  font-size: 13px;
  line-height: 1.7;
  color: var(--text);
}
.solution-body :deep(pre) {
  background: var(--code-bg);
  color: var(--code-text);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  overflow-x: auto;
  font-size: 12px;
  margin: 8px 0;
}
.solution-body :deep(.code-block-toolbar) { display: none; }

@media (max-width: 720px) {
  .action-bar { flex-direction: column; align-items: stretch; }
  .actions-right { flex-direction: column; }
  .card-head { flex-direction: column; align-items: flex-start; }
}
</style>
