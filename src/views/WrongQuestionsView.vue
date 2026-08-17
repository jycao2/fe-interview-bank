<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWrongQuestionsStore } from '@/stores/wrongQuestions'
import { useExamWrongQuestionsStore } from '@/stores/examWrongQuestions'
import { useAlgorithmExamStore } from '@/stores/algorithmExam'
import { useExamStore } from '@/stores/exam'
import { renderMarkdown } from '@/utils/markdown'
import { categories, difficulties } from '@/data/categories'

const router = useRouter()
const algoWrongStore = useWrongQuestionsStore()
const mcqWrongStore = useExamWrongQuestionsStore()
const algoStore = useAlgorithmExamStore()
const examStore = useExamStore()

const {
  wrongList: algoWrongList,
  count: algoCount,
  statsByDifficulty: algoStatsByDiff
} = storeToRefs(algoWrongStore)
const {
  wrongList: mcqWrongList,
  count: mcqCount,
  statsByDifficulty: mcqStatsByDiff,
  statsByCategory: mcqStatsByCat
} = storeToRefs(mcqWrongStore)

// 当前激活的 tab：'mcq' = 选择题错题 / 'algo' = 算法错题
const activeTab = ref('mcq')

// 难度筛选
const mcqDiffFilter = ref('all')
const algoDiffFilter = ref('all')

const filteredMcqList = computed(() => {
  if (mcqDiffFilter.value === 'all') return mcqWrongList.value
  return mcqWrongList.value.filter(it => it.question.difficulty === mcqDiffFilter.value)
})
const filteredAlgoList = computed(() => {
  if (algoDiffFilter.value === 'all') return algoWrongList.value
  return algoWrongList.value.filter(it => it.problem.difficulty === algoDiffFilter.value)
})

// 选中查看详情的题目
const selectedMcqId = ref(null)
const selectedAlgoId = ref(null)
const selectedMcqItem = computed(() => {
  if (!selectedMcqId.value) return null
  return mcqWrongList.value.find(it => it.id === selectedMcqId.value) || null
})
const selectedAlgoItem = computed(() => {
  if (!selectedAlgoId.value) return null
  return algoWrongList.value.find(it => it.id === selectedAlgoId.value) || null
})
const renderedAlgoSolution = computed(() => {
  if (!selectedAlgoItem.value) return ''
  return renderMarkdown(selectedAlgoItem.value.problem.solution)
})

function viewMcqHistory(id) {
  selectedMcqId.value = selectedMcqId.value === id ? null : id
}
function viewAlgoHistory(id) {
  selectedAlgoId.value = selectedAlgoId.value === id ? null : id
}

function removeMcqOne(id) {
  if (!confirm('确定从选择题错题集移除该题？')) return
  mcqWrongStore.removeOne(id)
  if (selectedMcqId.value === id) selectedMcqId.value = null
}
function removeAlgoOne(id) {
  if (!confirm('确定从算法错题集移除该题？')) return
  algoWrongStore.removeOne(id)
  if (selectedAlgoId.value === id) selectedAlgoId.value = null
}

function clearMcqAll() {
  if (!mcqCount.value) return
  if (!confirm(`确定清空全部 ${mcqCount.value} 道选择题错题？此操作不可恢复。`)) return
  mcqWrongStore.clearAll()
  selectedMcqId.value = null
}
function clearAlgoAll() {
  if (!algoCount.value) return
  if (!confirm(`确定清空全部 ${algoCount.value} 道算法错题？此操作不可恢复。`)) return
  algoWrongStore.clearAll()
  selectedAlgoId.value = null
}

// 从错题集生成考试
function startMcqWrongExam() {
  const questions = mcqWrongStore.generateExam({ limit: 30, shuffle: true })
  if (!questions.length) return
  examStore.questions = questions
  examStore.answers = new Array(questions.length).fill(-1)
  examStore.currentIndex = 0
  examStore.startTime = Date.now()
  examStore.endTime = 0
  examStore.phase = 'taking'
  router.push('/exam')
}
function startAlgoWrongExam() {
  const ids = algoWrongStore.generateExam({ limit: 20, shuffle: true })
  if (!ids.length) return
  const problems = ids
    .map(id => algoWrongList.value.find(it => it.id === id)?.problem)
    .filter(Boolean)
  if (!problems.length) return
  algoStore.startExam(problems)
  router.push('/algorithm-exam')
}

// 工具函数
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
function catName(id) {
  return categories.find(c => c.id === id)?.name || id
}
function catIcon(id) {
  return categories.find(c => c.id === id)?.icon || '❓'
}
function diffStyle(d) {
  return difficulties.find(x => x.id === d) || { color: 'var(--medium)', bg: 'var(--medium-bg)' }
}
const letters = ['A', 'B', 'C', 'D', 'E', 'F']
</script>

<template>
  <div class="wrong-questions">
    <!-- 头部 -->
    <div class="page-header">
      <h1>❌ 错题集</h1>
      <p class="subtitle">
        统一收录「模拟考试」与「算法实战」中答错的题目，浏览器 <strong>localStorage 永久存储</strong>。<br>
        再次答对的题目会自动移除，也支持手动移除单题或一键清空，可从错题集一键生成新考试重做。
      </p>
      <div class="stats-row">
        <span class="stat-pill">📊 选择题错题 {{ mcqCount }}</span>
        <span class="stat-pill">💻 算法错题 {{ algoCount }}</span>
        <span class="stat-pill diff-easy">🟢 简单 {{ mcqStatsByDiff.简单 + algoStatsByDiff.简单 }}</span>
        <span class="stat-pill diff-medium">🟡 中等 {{ mcqStatsByDiff.中等 + algoStatsByDiff.中等 }}</span>
        <span class="stat-pill diff-hard">🔴 困难 {{ mcqStatsByDiff.困难 + algoStatsByDiff.困难 }}</span>
      </div>
    </div>

    <!-- Tab 切换 -->
    <div class="tabs">
      <button
        :class="{ active: activeTab === 'mcq' }"
        @click="activeTab = 'mcq'"
      >
        📝 选择题错题 <span class="tab-count">{{ mcqCount }}</span>
      </button>
      <button
        :class="{ active: activeTab === 'algo' }"
        @click="activeTab = 'algo'"
      >
        💻 算法错题 <span class="tab-count">{{ algoCount }}</span>
      </button>
    </div>

    <!-- ============ 选择题错题 ============ -->
    <div v-if="activeTab === 'mcq'">
      <!-- 操作栏 -->
      <div v-if="mcqCount > 0" class="action-bar">
        <div class="filter-group">
          <button :class="{ active: mcqDiffFilter === 'all' }" @click="mcqDiffFilter = 'all'">全部</button>
          <button :class="{ active: mcqDiffFilter === '简单' }" @click="mcqDiffFilter = '简单'">简单</button>
          <button :class="{ active: mcqDiffFilter === '中等' }" @click="mcqDiffFilter = '中等'">中等</button>
          <button :class="{ active: mcqDiffFilter === '困难' }" @click="mcqDiffFilter = '困难'">困难</button>
        </div>
        <div class="actions-right">
          <button class="btn-primary" @click="startMcqWrongExam" :disabled="!filteredMcqList.length">
            🎯 从错题生成考试（最多 30 题）
          </button>
          <button class="btn-danger" @click="clearMcqAll">🗑 清空</button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="mcqCount === 0" class="empty-state">
        <div class="empty-emoji">🎉</div>
        <h2>暂无选择题错题</h2>
        <p>去「模拟考试」答题，答错的题目会自动收入这里。</p>
        <RouterLink to="/exam" class="btn-primary">前往模拟考试 →</RouterLink>
      </div>

      <!-- 选择题错题列表 -->
      <div v-else class="wrong-list">
        <div v-for="it in filteredMcqList" :key="it.id" class="wrong-card mcq-card">
          <div class="card-head">
            <div class="card-head-left">
              <span class="card-cat">
                <span class="cat-ico">{{ catIcon(it.question.category) }}</span>{{ catName(it.question.category) }}
              </span>
              <span class="card-diff" :class="diffClass(it.question.difficulty)">{{ it.question.difficulty }}</span>
              <span class="attempts-badge">📝 {{ it.attempts }} 次尝试</span>
            </div>
            <span class="last-time">{{ formatTime(it.lastAttemptAt) }}</span>
          </div>

          <p class="card-question">{{ it.question.question }}</p>

          <ul class="options review">
            <li
              v-for="(opt, i) in it.question.options"
              :key="i"
              class="option"
              :class="{
                correct: i === it.question.answer,
                wrongpick: it.history[0] && i === it.history[0].selected,
                review: true
              }"
            >
              <span class="opt-letter">{{ letters[i] }}</span>
              <span class="opt-text">{{ opt }}</span>
              <span class="opt-tag" v-if="i === it.question.answer">正确答案</span>
              <span class="opt-tag wrong" v-else-if="it.history[0] && i === it.history[0].selected">你的选择</span>
            </li>
          </ul>

          <div class="analysis">
            <span class="analysis-label">💡 解析</span>
            <p class="analysis-text">{{ it.question.analysis }}</p>
          </div>

          <div class="card-actions">
            <button class="btn-ghost btn-sm" @click="viewMcqHistory(it.id)">
              {{ selectedMcqId === it.id ? '收起历史' : '📜 查看答题历史' }}
            </button>
            <button class="btn-danger-soft btn-sm" @click="removeMcqOne(it.id)">✕ 移除</button>
          </div>

          <!-- 历史记录 -->
          <div v-if="selectedMcqId === it.id" class="card-detail">
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
                    <span class="history-case">
                      你的选择：{{ h.selected >= 0 ? letters[h.selected] : '未答' }}
                      ｜ 正确：{{ letters[h.correctIndex] }}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============ 算法错题 ============ -->
    <div v-else>
      <!-- 操作栏 -->
      <div v-if="algoCount > 0" class="action-bar">
        <div class="filter-group">
          <button :class="{ active: algoDiffFilter === 'all' }" @click="algoDiffFilter = 'all'">全部</button>
          <button :class="{ active: algoDiffFilter === '简单' }" @click="algoDiffFilter = '简单'">简单</button>
          <button :class="{ active: algoDiffFilter === '中等' }" @click="algoDiffFilter = '中等'">中等</button>
          <button :class="{ active: algoDiffFilter === '困难' }" @click="algoDiffFilter = '困难'">困难</button>
        </div>
        <div class="actions-right">
          <button class="btn-primary" @click="startAlgoWrongExam" :disabled="!filteredAlgoList.length">
            🎯 从错题生成考试（最多 20 题）
          </button>
          <button class="btn-danger" @click="clearAlgoAll">🗑 清空</button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="algoCount === 0" class="empty-state">
        <div class="empty-emoji">🎉</div>
        <h2>暂无算法错题</h2>
        <p>去「算法实战」答题，答错的题目会自动收入这里。</p>
        <RouterLink to="/algorithm-exam" class="btn-primary">前往算法实战 →</RouterLink>
      </div>

      <!-- 算法错题列表 -->
      <div v-else class="wrong-list">
        <div v-for="it in filteredAlgoList" :key="it.id" class="wrong-card algo-card">
          <div class="card-head">
            <div class="card-head-left">
              <span class="card-no">{{ it.problem.no }}</span>
              <span class="card-diff" :class="diffClass(it.problem.difficulty)">{{ it.problem.difficulty }}</span>
              <h3 class="card-title">{{ it.problem.title }}</h3>
            </div>
            <div class="card-head-right">
              <span class="attempts-badge">📝 {{ it.attempts }} 次尝试</span>
              <span class="last-time">{{ formatTime(it.lastAttemptAt) }}</span>
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
            <button class="btn-ghost btn-sm" @click="viewAlgoHistory(it.id)">
              {{ selectedAlgoId === it.id ? '收起历史' : '📖 查看历史 / 题解' }}
            </button>
            <button class="btn-danger-soft btn-sm" @click="removeAlgoOne(it.id)">✕ 移除</button>
          </div>

          <!-- 历史记录 + 题解 -->
          <div v-if="selectedAlgoId === it.id" class="card-detail">
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
              <div class="solution-body markdown-body" v-html="renderedAlgoSolution"></div>
            </div>
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

/* Tabs */
.tabs {
  display: flex;
  gap: 4px;
  border-bottom: 2px solid var(--border);
  margin-bottom: 18px;
  padding: 0 4px;
}
.tabs button {
  padding: 10px 18px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-soft);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
  margin-bottom: -2px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.tabs button:hover {
  color: var(--text);
}
.tabs button.active {
  color: var(--brand);
  border-bottom-color: var(--brand);
  font-weight: 600;
}
.tab-count {
  background: var(--bg-sunken);
  color: var(--text-muted);
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
}
.tabs button.active .tab-count {
  background: var(--brand-soft);
  color: var(--brand);
}

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
  padding: 16px 20px;
  transition: box-shadow 0.15s;
}
.wrong-card:hover { box-shadow: var(--shadow); }
.algo-card { border-left: 4px solid var(--medium); }
.mcq-card { border-left: 4px solid var(--hard); }

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.card-head-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.card-head-right {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--text-muted);
}
.card-no {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 600;
  background: var(--bg-sunken);
  padding: 2px 8px;
  border-radius: 4px;
}
.card-cat {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  font-size: 12px;
  background: var(--brand-soft);
  color: var(--brand);
  border-radius: 999px;
}
.cat-ico { font-size: 13px; }
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
.attempts-badge {
  padding: 3px 8px;
  background: var(--hard-bg);
  color: var(--hard);
  border-radius: 4px;
  font-weight: 500;
  font-size: 12px;
}
.last-time {
  font-size: 12px;
  color: var(--text-muted);
}
.card-question {
  font-size: 15px;
  line-height: 1.7;
  margin: 0 0 14px;
  white-space: pre-wrap;
}

/* 选择题选项复核 */
.options {
  list-style: none;
  padding: 0;
  margin: 0 0 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.options .option {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-elevated);
  font-size: 13px;
  cursor: default;
}
.opt-letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--bg-sunken);
  color: var(--text-soft);
  font-size: 12px;
  font-weight: 700;
}
.opt-text {
  flex: 1;
  line-height: 1.5;
  white-space: pre-wrap;
}
.options .option.correct {
  border-color: var(--easy);
  background: var(--easy-bg);
}
.options .option.correct .opt-letter {
  background: var(--easy);
  color: #fff;
}
.options .option.wrongpick {
  border-color: var(--hard);
  background: var(--hard-bg);
}
.options .option.wrongpick .opt-letter {
  background: var(--hard);
  color: #fff;
}
.opt-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--easy);
  color: #fff;
  font-weight: 600;
  flex-shrink: 0;
}
.opt-tag.wrong {
  background: var(--hard);
}

/* 解析 */
.analysis {
  margin-bottom: 12px;
  padding: 12px 14px;
  background: var(--bg-sunken);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--brand);
}
.analysis-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--brand);
  display: block;
  margin-bottom: 6px;
}
.analysis-text {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.75;
  color: var(--text-soft);
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
  flex-wrap: wrap;
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
  .tabs button { padding: 8px 12px; font-size: 13px; }
}
</style>
