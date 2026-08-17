<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAlgorithmExamStore } from '@/stores/algorithmExam'
import { algorithmProblems, algorithmStats } from '@/data/algorithmExam'
import { renderMarkdown } from '@/utils/markdown'
import { difficulties } from '@/data/categories'

const store = useAlgorithmExamStore()
const {
  phase, problems, currentIndex, currentProblem, currentUserCode,
  total, passedCount, attemptedCount, usedSeconds, startTime,
  lastRunResult, isRunning, problemStatus
} = storeToRefs(store)

// ─── Idle 阶段：筛选 ───────────────────────────────
const diffFilter = ref('all')
const searchQuery = ref('')

const allTags = computed(() => {
  const s = new Set()
  algorithmProblems.forEach(p => p.tags.forEach(t => s.add(t)))
  return [...s].sort()
})
const selectedTag = ref('all')

const filteredProblems = computed(() => {
  return algorithmProblems.filter(p => {
    if (diffFilter.value !== 'all' && p.difficulty !== diffFilter.value) return false
    if (selectedTag.value !== 'all' && !p.tags.includes(selectedTag.value)) return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      if (!p.title.toLowerCase().includes(q) && !p.no.includes(q)) return false
    }
    return true
  })
})

function startAll() {
  store.startExam([...filteredProblems.value])
}
function startSingle(p) {
  store.startExam([p])
}

// ─── Taking 阶段 ───────────────────────────────────
const code = computed({
  get: () => currentUserCode.value,
  set: (v) => store.setCode(v)
})

const renderedDesc = computed(() => {
  if (!currentProblem.value) return ''
  return renderMarkdown(currentProblem.value.desc)
})

const renderedSolution = computed(() => {
  if (!currentProblem.value) return ''
  return renderMarkdown(currentProblem.value.solution)
})

const showSolution = ref(false)

function handleTab(e) {
  if (e.key === 'Tab') {
    e.preventDefault()
    const ta = e.target
    const s = ta.selectionStart
    const en = ta.selectionEnd
    const indent = '  '
    code.value = ta.value.substring(0, s) + indent + ta.value.substring(en)
    nextTick(() => { ta.selectionStart = ta.selectionEnd = s + indent.length })
  }
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    store.runTests(false)
  }
}

async function doRun() { await store.runTests(false) }
async function doSubmit() {
  await store.runTests(true)
  // 如果是最后一题，自动滚动到结果
}
function exit() { store.resetExam() }
function resetCode() { store.resetCode(); showSolution.value = false }

// ─── 计时器 ────────────────────────────────────────
let timer = null
const displayTime = ref('00:00')
function tick() {
  // 仅在答题阶段计时，避免 idle 时显示一个无意义的巨大时间
  if (phase.value !== 'taking' || !startTime.value) return
  const s = usedSeconds.value
  const m = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  displayTime.value = `${m}:${ss}`
}
onMounted(() => {
  timer = setInterval(tick, 1000)
})
onUnmounted(() => { if (timer) clearInterval(timer) })

// ─── 辅助 ──────────────────────────────────────────
function diffClass(d) {
  return { 'diff-easy': d === '简单', 'diff-medium': d === '中等', 'diff-hard': d === '困难' }
}
function navClass(i) {
  const p = problems.value[i]
  const status = problemStatus.value[p?.id]
  return {
    active: i === currentIndex.value,
    passed: status === 'passed',
    failed: status === 'failed'
  }
}
function statusIcon(pid) {
  const s = problemStatus.value[pid]
  if (s === 'passed') return '✅'
  if (s === 'failed') return '❌'
  return '⬜'
}
function exitToIdle() { store.resetExam() }

// 结果页
const grade = computed(() => {
  const r = total.value ? passedCount.value / total.value : 0
  if (r >= 0.9) return { label: '优秀', color: 'var(--easy)', emoji: '🏆' }
  if (r >= 0.75) return { label: '良好', color: 'var(--brand)', emoji: '👍' }
  if (r >= 0.6) return { label: '及格', color: 'var(--medium)', emoji: '📚' }
  return { label: '继续加油', color: 'var(--hard)', emoji: '💪' }
})
</script>

<template>
  <div class="algo-exam">
    <!-- ═══════════════ 阶段一：选题列表 ═══════════════ -->
    <template v-if="phase === 'idle'">
      <div class="page-header">
        <h1>🖥️ 算法实战 · 在线判题</h1>
        <p class="subtitle">
          {{ algorithmStats.total }} 道 LeetCode 风格算法题 · 支持<strong>在线编写代码</strong> ·
          <strong>自动运行测试用例</strong> · <strong>即时判题</strong>（Web Worker 沙箱，防死循环）
        </p>
        <div class="stats-row">
          <span class="stat-pill">📊 总计 {{ algorithmStats.total }}</span>
          <span class="stat-pill diff-easy">🟢 简单 {{ algorithmStats.easy }}</span>
          <span class="stat-pill diff-medium">🟡 中等 {{ algorithmStats.medium }}</span>
        </div>
      </div>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="filter-group">
          <button :class="{ active: diffFilter === 'all' }" @click="diffFilter = 'all'">全部</button>
          <button :class="{ active: diffFilter === '简单' }" @click="diffFilter = '简单'">简单</button>
          <button :class="{ active: diffFilter === '中等' }" @click="diffFilter = '中等'">中等</button>
        </div>
        <select v-model="selectedTag" class="tag-select">
          <option value="all">全部分类</option>
          <option v-for="t in allTags" :key="t" :value="t">{{ t }}</option>
        </select>
        <input v-model="searchQuery" class="search-input" placeholder="搜索题号或标题..." />
      </div>

      <!-- 题目列表 -->
      <div class="problem-grid">
        <div
          v-for="p in filteredProblems"
          :key="p.id"
          class="problem-card"
          @click="startSingle(p)"
        >
          <div class="card-top">
            <span class="card-no">{{ p.no }}</span>
            <span class="card-diff" :class="diffClass(p.difficulty)">{{ p.difficulty }}</span>
          </div>
          <h3 class="card-title">{{ p.title }}</h3>
          <div class="card-tags">
            <span v-for="t in p.tags" :key="t" class="card-tag">{{ t }}</span>
          </div>
        </div>
      </div>

      <div class="start-all-bar">
        <span>当前筛选 {{ filteredProblems.length }} 题</span>
        <button class="btn-primary" @click="startAll">开始全部练习 →</button>
      </div>
    </template>

    <!-- ═══════════════ 阶段二：答题 ═══════════════ -->
    <template v-else-if="phase === 'taking' && currentProblem">
      <!-- 顶栏 -->
      <div class="taking-topbar">
        <button class="btn-ghost" @click="exitToIdle">← 返回列表</button>
        <span class="top-progress">第 {{ currentIndex + 1 }} / {{ total }} 题</span>
        <span class="top-timer">⏱ {{ displayTime }}</span>
        <span class="top-stats">✅ {{ passedCount }} 通过</span>
        <button class="btn-submit" @click="store.submitExam()">交卷 →</button>
      </div>

      <!-- 分屏视图 -->
      <div class="split-view">
        <!-- 左侧：题目描述 -->
        <div class="left-panel">
          <div class="problem-head">
            <span class="p-no">{{ currentProblem.no }}.</span>
            <h2>{{ currentProblem.title }}</h2>
            <span class="card-diff" :class="diffClass(currentProblem.difficulty)">{{ currentProblem.difficulty }}</span>
          </div>
          <div class="problem-tags">
            <span v-for="t in currentProblem.tags" :key="t" class="card-tag">{{ t }}</span>
          </div>
          <div class="problem-desc markdown-body" v-html="renderedDesc"></div>

          <!-- 复杂度信息 -->
          <div class="complexity-box">
            <div class="complexity-item">
              <span class="complexity-label">⏱ 时间复杂度</span>
              <code>{{ currentProblem.timeComplexity }}</code>
            </div>
            <div class="complexity-item">
              <span class="complexity-label">💾 空间复杂度</span>
              <code>{{ currentProblem.spaceComplexity }}</code>
            </div>
          </div>

          <!-- 参考题解入口（移到编辑器头部按钮区，点击弹出模态框） -->
          <div class="solution-hint">
            💡 卡住了？点击右上方 <strong>📖 题解</strong> 按钮查看参考答案
          </div>
        </div>

        <!-- 右侧：代码编辑器 + 测试结果 -->
        <div class="right-panel">
          <!-- 编辑器头 -->
          <div class="editor-header">
            <span class="lang-badge">JavaScript</span>
            <div class="editor-actions">
              <button class="btn-ghost" @click="resetCode" title="重置为初始代码">↺ 重置</button>
              <button class="btn-solution" @click="showSolution = true" title="查看参考题解">📖 题解</button>
              <button class="btn-run" @click="doRun" :disabled="isRunning">
                {{ isRunning ? '⏳ 运行中...' : '▶ 运行' }}
              </button>
              <button class="btn-submit" @click="doSubmit" :disabled="isRunning">
                {{ isRunning ? '⏳...' : '✓ 提交评测' }}
              </button>
            </div>
          </div>

          <!-- 代码编辑器 -->
          <textarea
            v-model="code"
            class="code-textarea"
            spellcheck="false"
            autocomplete="off"
            placeholder="// 在这里编写你的代码..."
            @keydown="handleTab"
          ></textarea>

          <!-- 测试结果面板 -->
          <div class="results-panel" v-if="lastRunResult">
            <div class="results-header">
              <span v-if="lastRunResult.error" class="result-status error">❌ 执行错误</span>
              <span v-else-if="lastRunResult.passed" class="result-status pass">
                ✅ {{ lastRunResult.submitAll ? '全部通过' : '样例通过' }}（{{ lastRunResult.results.filter(r => r.passed).length }}/{{ lastRunResult.results.length }}）
              </span>
              <span v-else class="result-status fail">
                ❌ 未通过（{{ lastRunResult.results.filter(r => r.passed).length }}/{{ lastRunResult.results.length }}）
              </span>
              <button class="btn-ghost btn-sm" @click="lastRunResult = null">✕</button>
            </div>

            <!-- 编译/执行错误 -->
            <div v-if="lastRunResult.error" class="error-box">
              <pre>{{ lastRunResult.error }}</pre>
            </div>

            <!-- 用例列表 -->
            <div v-else class="testcase-list">
              <div
                v-for="tc in lastRunResult.results"
                :key="tc.index"
                class="testcase-item"
                :class="{ passed: tc.passed, failed: !tc.passed }"
              >
                <div class="testcase-head">
                  <span class="tc-icon">{{ tc.passed ? '✅' : '❌' }}</span>
                  <span class="tc-label">用例 {{ tc.index + 1 }}</span>
                  <span v-if="tc.error" class="tc-error">{{ tc.error }}</span>
                </div>
                <div class="testcase-body">
                  <div class="tc-row">
                    <span class="tc-key">输入</span>
                    <code class="tc-val">{{ tc.input }}</code>
                  </div>
                  <div class="tc-row">
                    <span class="tc-key">期望</span>
                    <code class="tc-val">{{ tc.expected }}</code>
                  </div>
                  <div class="tc-row">
                    <span class="tc-key">输出</span>
                    <code class="tc-val" :class="{ mismatch: !tc.passed }">{{ tc.output }}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态提示 -->
          <div class="results-empty" v-else>
            <p>💡 点击 <strong>▶ 运行</strong> 测试样例（前 3 个用例）</p>
            <p>💡 点击 <strong>✓ 提交评测</strong> 运行全部用例</p>
            <p>💡 快捷键 <kbd>Ctrl</kbd> + <kbd>Enter</kbd> 快速运行</p>
          </div>
        </div>
      </div>

      <!-- 参考题解模态框 -->
      <Teleport to="body">
        <div v-if="showSolution" class="solution-modal-mask" @click.self="showSolution = false">
          <div class="solution-modal">
            <div class="solution-modal-header">
              <h3>📖 参考题解 · {{ currentProblem?.title }}</h3>
              <button class="solution-modal-close" @click="showSolution = false" title="关闭">✕</button>
            </div>
            <div class="solution-modal-body markdown-body" v-html="renderedSolution"></div>
            <div class="solution-modal-footer">
              <span class="complexity-inline">
                ⏱ {{ currentProblem?.timeComplexity }} · 💾 {{ currentProblem?.spaceComplexity }}
              </span>
              <button class="btn-primary" @click="showSolution = false">关闭</button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- 底部导航 -->
      <div class="nav-bar">
        <button class="btn-ghost" @click="store.prev()" :disabled="currentIndex === 0">← 上一题</button>
        <div class="nav-dots">
          <button
            v-for="(p, i) in problems"
            :key="p.id"
            class="nav-dot"
            :class="navClass(i)"
            @click="store.goTo(i)"
            :title="`${p.no}. ${p.title}`"
          >{{ i + 1 }}</button>
        </div>
        <button class="btn-ghost" @click="store.next()" :disabled="currentIndex === total - 1">下一题 →</button>
      </div>
    </template>

    <!-- ═══════════════ 阶段三：结果 ═══════════════ -->
    <template v-else-if="phase === 'result'">
      <div class="result-page">
        <div class="result-hero">
          <span class="result-emoji">{{ grade.emoji }}</span>
          <h1>{{ grade.label }}</h1>
          <div class="result-score">
            <span class="score-num">{{ passedCount }}</span>
            <span class="score-sep">/</span>
            <span class="score-total">{{ total }}</span>
          </div>
          <p class="result-time">用时 {{ displayTime }} · 尝试 {{ attemptedCount }} 题</p>
        </div>

        <!-- 题目状态列表 -->
        <div class="result-list">
          <div
            v-for="(p, i) in problems"
            :key="p.id"
            class="result-item"
            :class="problemStatus[p.id]"
          >
            <span class="result-no">{{ p.no }}</span>
            <span class="result-title">{{ p.title }}</span>
            <span class="card-diff" :class="diffClass(p.difficulty)">{{ p.difficulty }}</span>
            <span class="result-status-text">
              {{ problemStatus[p.id] === 'passed' ? '✅ 通过' : problemStatus[p.id] === 'failed' ? '❌ 未通过' : '⬜ 未尝试' }}
            </span>
          </div>
        </div>

        <div class="result-actions">
          <button class="btn-primary" @click="store.resetExam()">← 返回列表</button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.algo-exam {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 20px 60px;
}

/* ─── 通用按钮 ─── */
.btn-primary {
  background: var(--brand);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-primary:hover { background: var(--brand-700); }
.btn-ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-soft);
  border-radius: var(--radius-sm);
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-ghost:hover:not(:disabled) { border-color: var(--brand); color: var(--brand); }
.btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-sm { padding: 2px 8px; font-size: 12px; }
.btn-run {
  background: var(--bg-sunken);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: var(--radius-sm);
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-run:hover:not(:disabled) { border-color: var(--brand); color: var(--brand); }
.btn-run:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-submit {
  background: var(--brand);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-submit:hover:not(:disabled) { background: var(--brand-700); }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

/* ─── 难度标签 ─── */
.card-diff {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
}
.diff-easy { color: var(--easy); background: var(--easy-bg); }
.diff-medium { color: var(--medium); background: var(--medium-bg); }
.diff-hard { color: var(--hard); background: var(--hard-bg); }

/* ─── Idle 阶段 ─── */
.page-header { margin-bottom: 24px; }
.page-header h1 { font-size: 28px; margin: 0 0 8px; }
.subtitle { color: var(--text-soft); font-size: 14px; line-height: 1.6; margin: 0 0 12px; }
.stats-row { display: flex; gap: 8px; flex-wrap: wrap; }
.stat-pill {
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--bg-sunken);
  border: 1px solid var(--border);
  color: var(--text-soft);
}
.stat-pill.diff-easy { color: var(--easy); border-color: var(--easy); }
.stat-pill.diff-medium { color: var(--medium); border-color: var(--medium); }

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
}
.filter-group { display: flex; gap: 4px; }
.filter-group button {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  color: var(--text-soft);
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}
.filter-group button.active {
  background: var(--brand);
  color: #fff;
  border-color: var(--brand);
}
.tag-select, .search-input {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 6px 12px;
  font-size: 13px;
  color: var(--text);
  outline: none;
}
.search-input { flex: 1; min-width: 180px; }
.tag-select:focus, .search-input:focus { border-color: var(--brand); }

.problem-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}
.problem-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  cursor: pointer;
  transition: all 0.15s;
}
.problem-card:hover {
  border-color: var(--brand);
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}
.card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.card-no { font-size: 12px; color: var(--text-muted); font-weight: 600; }
.card-title { font-size: 15px; font-weight: 600; margin: 0 0 8px; color: var(--text); }
.card-tags { display: flex; gap: 4px; flex-wrap: wrap; }
.card-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--bg-sunken);
  color: var(--text-muted);
}

.start-all-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid var(--border);
  color: var(--text-soft);
  font-size: 14px;
}

/* ─── Taking 阶段 ─── */
.taking-topbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 12px;
}
.top-progress { font-size: 14px; font-weight: 600; color: var(--text); }
.top-timer { font-size: 14px; color: var(--text-soft); font-variant-numeric: tabular-nums; }
.top-stats { font-size: 13px; color: var(--easy); }
.taking-topbar .btn-submit { margin-left: auto; }

.split-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  height: calc(100vh - 220px);
  min-height: 500px;
}
.left-panel, .right-panel {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.left-panel { overflow-y: auto; padding: 20px; }
.problem-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.p-no { font-size: 16px; color: var(--text-muted); }
.problem-head h2 { font-size: 18px; margin: 0; flex: 1; }
.problem-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 16px; }
.problem-desc { font-size: 14px; line-height: 1.7; color: var(--text); }
.problem-desc :deep(p) { margin: 8px 0; }
.problem-desc :deep(pre) {
  background: var(--code-bg);
  border-radius: var(--radius-sm);
  padding: 12px;
  overflow-x: auto;
  font-size: 13px;
}
.problem-desc :deep(code) { font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace; }
.problem-desc :deep(.code-block) { margin: 8px 0; }
.problem-desc :deep(.code-block-toolbar) { display: none; }

.complexity-box {
  display: flex;
  gap: 16px;
  margin: 16px 0;
  padding: 12px;
  background: var(--bg-sunken);
  border-radius: var(--radius-sm);
}
.complexity-item { display: flex; flex-direction: column; gap: 4px; }
.complexity-label { font-size: 12px; color: var(--text-muted); }
.complexity-item code {
  font-size: 14px;
  font-weight: 600;
  color: var(--brand);
  background: var(--bg-elevated);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}

.solution-hint {
  margin-top: 16px;
  padding: 10px 14px;
  font-size: 13px;
  color: var(--text-muted);
  background: var(--bg-sunken);
  border-radius: var(--radius-sm);
  border: 1px dashed var(--border);
}
.solution-hint strong { color: var(--brand); }

/* 题解按钮 */
.btn-solution {
  background: var(--bg-sunken);
  border: 1px solid var(--border);
  color: var(--text-soft);
  border-radius: var(--radius-sm);
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-solution:hover {
  border-color: var(--medium);
  color: var(--medium);
  background: var(--medium-bg);
}

/* 题解模态框（Teleport 到 body，不受父容器 overflow/scroll 影响） */
.solution-modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(2px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.solution-modal {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: min(820px, 100%);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.solution-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-sunken);
}
.solution-modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}
.solution-modal-close {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--text-soft);
  cursor: pointer;
  font-size: 16px;
  transition: all 0.15s;
}
.solution-modal-close:hover {
  background: var(--hard-bg);
  color: var(--hard);
  border-color: var(--hard);
}
.solution-modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text);
}
.solution-modal-body :deep(pre) {
  background: var(--code-bg);
  border-radius: var(--radius-sm);
  padding: 12px;
  overflow-x: auto;
  font-size: 13px;
  margin: 12px 0;
}
.solution-modal-body :deep(code) {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
}
.solution-modal-body :deep(p) { margin: 10px 0; }
.solution-modal-body :deep(h2) {
  font-size: 16px;
  margin: 16px 0 8px;
}
.solution-modal-body :deep(.code-block-toolbar) { display: none; }
.solution-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-top: 1px solid var(--border);
  background: var(--bg-sunken);
}
.complexity-inline {
  font-size: 13px;
  color: var(--text-muted);
  font-family: 'SF Mono', Monaco, monospace;
}

/* 编辑器 */
.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-sunken);
}
.lang-badge {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.editor-actions { display: flex; gap: 6px; }

.code-textarea {
  flex: 1;
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: 16px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  background: var(--code-bg);
  color: var(--code-text);
  tab-size: 2;
  white-space: pre;
  overflow: auto;
}

/* 测试结果 */
.results-panel {
  border-top: 1px solid var(--border);
  max-height: 40%;
  overflow-y: auto;
  background: var(--bg-sunken);
}
.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--bg-elevated);
  z-index: 1;
}
.result-status { font-size: 14px; font-weight: 600; }
.result-status.pass { color: var(--easy); }
.result-status.fail { color: var(--hard); }
.result-status.error { color: var(--hard); }

.error-box {
  padding: 12px;
  margin: 8px;
  background: var(--hard-bg);
  border-radius: var(--radius-sm);
  border: 1px solid var(--hard);
}
.error-box pre { margin: 0; font-size: 13px; color: var(--hard); white-space: pre-wrap; word-break: break-all; }

.testcase-list { padding: 4px 0; }
.testcase-item {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
}
.testcase-head { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.tc-icon { font-size: 14px; }
.tc-label { font-size: 13px; font-weight: 600; color: var(--text-soft); }
.tc-error { font-size: 12px; color: var(--hard); margin-left: auto; }
.testcase-body { padding-left: 24px; }
.tc-row { display: flex; gap: 8px; margin: 2px 0; font-size: 12px; }
.tc-key { color: var(--text-muted); min-width: 36px; }
.tc-val { color: var(--text); font-family: 'SF Mono', Monaco, monospace; word-break: break-all; }
.tc-val.mismatch { color: var(--hard); font-weight: 600; }

.results-empty {
  padding: 24px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
  line-height: 2;
}
.results-empty kbd {
  background: var(--bg-sunken);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 12px;
  font-family: monospace;
}

/* 底部导航 */
.nav-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding: 8px 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.nav-dots { display: flex; gap: 4px; flex: 1; overflow-x: auto; padding: 4px 0; }
.nav-dot {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--text-muted);
  border-radius: var(--radius-sm);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-dot:hover { border-color: var(--brand); color: var(--brand); }
.nav-dot.active { border-color: var(--brand); background: var(--brand); color: #fff; font-weight: 700; }
.nav-dot.passed { border-color: var(--easy); color: var(--easy); }
.nav-dot.failed { border-color: var(--hard); color: var(--hard); }
.nav-dot.passed.active { background: var(--easy); color: #fff; }
.nav-dot.failed.active { background: var(--hard); color: #fff; }

/* ─── Result 阶段 ─── */
.result-page { max-width: 700px; margin: 0 auto; padding: 40px 20px; text-align: center; }
.result-hero { margin-bottom: 32px; }
.result-emoji { font-size: 64px; display: block; margin-bottom: 8px; }
.result-hero h1 { font-size: 32px; margin: 0 0 16px; }
.result-score { font-size: 48px; font-weight: 800; display: flex; justify-content: center; align-items: baseline; gap: 4px; }
.score-num { color: var(--brand); }
.score-sep { color: var(--text-muted); }
.score-total { color: var(--text-soft); }
.result-time { color: var(--text-muted); font-size: 14px; margin-top: 8px; }

.result-list {
  text-align: left;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin-bottom: 24px;
}
.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}
.result-item:last-child { border-bottom: none; }
.result-item.passed { background: var(--easy-bg); }
.result-item.failed { background: var(--hard-bg); }
.result-no { color: var(--text-muted); font-weight: 600; min-width: 32px; }
.result-title { flex: 1; color: var(--text); }
.result-status-text { font-size: 13px; font-weight: 600; }

.result-actions { display: flex; justify-content: center; gap: 12px; }

/* ─── 响应式 ─── */
@media (max-width: 900px) {
  .split-view {
    grid-template-columns: 1fr;
    height: auto;
  }
  .left-panel { max-height: 400px; }
  .right-panel { min-height: 400px; }
  .problem-grid { grid-template-columns: 1fr; }
  .filter-bar { flex-direction: column; align-items: stretch; }
  .taking-topbar { flex-wrap: wrap; }
}
</style>
