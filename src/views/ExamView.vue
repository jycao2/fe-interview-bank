<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useExamStore } from '@/stores/exam'
import { examQuestionCount } from '@/data/exam'
import { categories, difficulties } from '@/data/categories'

const store = useExamStore()
const {
  phase, questions, answers, currentIndex, total, currentQuestion,
  currentAnswer, answeredCount, progress, result, usedSeconds,
  difficultyMode, selectedCategories, categoryBreakdown, difficultyBreakdown
} = storeToRefs(store)

const catName = (id) => categories.find((c) => c.id === id)?.name || id
const catIcon = (id) => categories.find((c) => c.id === id)?.icon || '❓'
const catDesc = (id) => categories.find((c) => c.id === id)?.desc || ''
const diffStyle = (d) => difficulties.find(x => x.id === d) || { color: 'var(--medium)', bg: 'var(--medium-bg)' }
const letters = ['A', 'B', 'C', 'D', 'E', 'F']

const showConfirm = ref(false)

// 可选分类（只展示有考试题的分类：核心分类 + mobile）
const examCategories = computed(() => {
  const core = ['html', 'css', 'javascript', 'typescript', 'vue', 'react', 'browser', 'network', 'performance', 'engineering', 'mobile']
  return core.map(id => categories.find(c => c.id === id)).filter(Boolean)
})

const allCatsSelected = computed(() => !selectedCategories.value || selectedCategories.value.length === 0)

function toggleCat(id) {
  const cur = selectedCategories.value ? [...selectedCategories.value] : []
  const idx = cur.indexOf(id)
  if (idx >= 0) cur.splice(idx, 1)
  else cur.push(id)
  store.setSelectedCategories(cur)
}
function selectAllCats() {
  store.setSelectedCategories(null)
}

function start() {
  store.startExam()
}
function select(idx) {
  store.selectOption(idx)
}
function next() {
  store.next()
}
function prev() {
  store.prev()
}
function goTo(i) {
  store.goTo(i)
}
function confirmSubmit() {
  showConfirm.value = true
}
function doSubmit() {
  showConfirm.value = false
  store.submitExam()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function retry() {
  store.startExam()
  window.scrollTo({ top: 0 })
}
function exit() {
  store.resetExam()
}

// 难度模式元数据
const modeMeta = {
  easy:     { label: '简单模式', desc: '简单60% / 中等30% / 困难10%', color: 'var(--easy)',   icon: '🌱' },
  balanced: { label: '均衡模式', desc: '简单30% / 中等50% / 困难20%', color: 'var(--brand)',  icon: '⚖️' },
  hard:     { label: '困难模式', desc: '简单10% / 中等40% / 困难50%', color: 'var(--hard)',   icon: '🔥' }
}

// 结果等级
const grade = computed(() => {
  if (!result.value) return ''
  const s = result.value.score
  if (s >= 90) return { text: '优秀 🏆', color: 'var(--easy)' }
  if (s >= 75) return { text: '良好 👍', color: 'var(--brand)' }
  if (s >= 60) return { text: '及格 ✅', color: 'var(--medium)' }
  return { text: '需努力 💪', color: 'var(--hard)' }
})

const timeText = computed(() => {
  const s = usedSeconds.value
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}分${sec.toString().padStart(2, '0')}秒`
})
</script>

<template>
  <div class="exam-view container">
    <!-- ============ 开始页 ============ -->
    <section v-if="phase === 'idle'" class="card start-card">
      <div class="start-hero">
        <div class="start-emoji">📝</div>
        <h1>前端面试模拟考试</h1>
        <p class="muted desc">
          从 {{ examQuestionCount }} 道选择题题库中按<strong class="hl">分类权重 + 难度比例</strong>抽取 {{ store.EXAM_SIZE }} 题，覆盖
          HTML / CSS / JavaScript / TypeScript / Vue / React / 浏览器 / 网络 / 性能 / 工程化等方向。
          交卷后立即出分，并附错题详细解析。
        </p>
      </div>

      <!-- 难度选择 -->
      <div class="config-block">
        <div class="config-title"><span class="cfg-ico">🎯</span>选择难度模式</div>
        <div class="mode-grid">
          <button
            v-for="(meta, mode) in modeMeta"
            :key="mode"
            class="mode-card"
            :class="{ active: difficultyMode === mode }"
            :style="difficultyMode === mode ? { borderColor: meta.color, background: meta.color + '14' } : {}"
            @click="store.setDifficultyMode(mode)"
          >
            <div class="mode-ico">{{ meta.icon }}</div>
            <div class="mode-label" :style="difficultyMode === mode ? { color: meta.color } : {}">{{ meta.label }}</div>
            <div class="mode-desc">{{ meta.desc }}</div>
          </button>
        </div>
      </div>

      <!-- 分类选择 -->
      <div class="config-block">
        <div class="config-title-row">
          <div class="config-title"><span class="cfg-ico">📚</span>选择分类（默认全部）</div>
          <button class="link-btn" @click="selectAllCats">全选 / 重置</button>
        </div>
        <div class="cat-grid">
          <button
            v-for="c in examCategories"
            :key="c.id"
            class="cat-chip"
            :class="{ active: allCatsSelected || selectedCategories?.includes(c.id) }"
            @click="toggleCat(c.id)"
            :title="c.desc"
          >
            <span class="cat-emoji">{{ c.icon }}</span>
            <span class="cat-name">{{ c.name }}</span>
          </button>
        </div>
        <div class="muted small-tip">
          💡 当前：{{ allCatsSelected ? '全部分类（按预设权重）' : `已选 ${selectedCategories.length} 个分类（权重归一化）` }}
        </div>
      </div>

      <div class="rules">
        <div class="rule-item"><span class="rule-ico">🎯</span><div><strong>题量</strong><p>每次 {{ store.EXAM_SIZE }} 道单选题，<span class="hl">按分类权重抽题</span></p></div></div>
        <div class="rule-item"><span class="rule-ico">⚖️</span><div><strong>难度</strong><p>{{ modeMeta[difficultyMode].desc }}</p></div></div>
        <div class="rule-item"><span class="rule-ico">⏱️</span><div><strong>计时</strong><p>自动计时，不设时限，建议 20 分钟内完成</p></div></div>
        <div class="rule-item"><span class="rule-ico">💡</span><div><strong>解析</strong><p>交卷后展示分数 + 错题正确答案与解析</p></div></div>
      </div>

      <button class="btn-primary big" @click="start">开始考试 →</button>
    </section>

    <!-- ============ 答题页 ============ -->
    <section v-else-if="phase === 'taking'" class="taking">
      <div class="taking-top">
        <div class="progress-info">
          <span class="q-no">第 {{ currentIndex + 1 }} / {{ total }} 题</span>
          <span class="muted">已答 {{ answeredCount }}/{{ total }}</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" :style="{ width: progress + '%' }"></div></div>
      </div>

      <div class="card question-card" v-if="currentQuestion">
        <div class="q-meta">
          <span class="q-cat"><span class="cat-ico">{{ catIcon(currentQuestion.category) }}</span>{{ catName(currentQuestion.category) }}</span>
          <span
            class="q-diff"
            :style="{ color: diffStyle(currentQuestion.difficulty).color, background: diffStyle(currentQuestion.difficulty).bg }"
          >{{ currentQuestion.difficulty || '中等' }}</span>
        </div>
        <h2 class="q-title">{{ currentQuestion.question }}</h2>

        <ul class="options">
          <li
            v-for="(opt, i) in currentQuestion.options"
            :key="i"
            class="option"
            :class="{ selected: currentAnswer === i }"
            @click="select(i)"
          >
            <span class="opt-letter">{{ letters[i] }}</span>
            <span class="opt-text">{{ opt }}</span>
            <span class="opt-check" v-if="currentAnswer === i">✓</span>
          </li>
        </ul>
      </div>

      <div class="taking-actions">
        <button class="btn-ghost" :disabled="currentIndex === 0" @click="prev">← 上一题</button>
        <button v-if="currentIndex < total - 1" class="btn-primary" @click="next">下一题 →</button>
        <button v-else class="btn-submit" @click="confirmSubmit">交卷 📤</button>
      </div>

      <!-- 题号导航 -->
      <div class="navigator">
        <button
          v-for="(a, i) in answers"
          :key="i"
          class="nav-cell"
          :class="{ answered: a >= 0, current: i === currentIndex }"
          @click="goTo(i)"
          :title="`第${i+1}题 · ${catName(questions[i]?.category)} · ${questions[i]?.difficulty || '中等'}`"
        >{{ i + 1 }}</button>
      </div>
    </section>

    <!-- ============ 结果页 ============ -->
    <section v-else-if="phase === 'result' && result" class="result">
      <div class="card score-card">
        <div class="score-circle" :style="{ color: grade.color, borderColor: grade.color }">
          <span class="score-num">{{ result.score }}</span>
          <span class="score-unit">分</span>
        </div>
        <h2 :style="{ color: grade.color }">{{ grade.text }}</h2>
        <div class="stats">
          <div class="stat"><span class="stat-num correct">{{ result.correct }}</span><span class="stat-label">答对</span></div>
          <div class="stat"><span class="stat-num wrong">{{ result.wrong }}</span><span class="stat-label">答错</span></div>
          <div class="stat"><span class="stat-num skip">{{ result.unanswered }}</span><span class="stat-label">未答</span></div>
          <div class="stat"><span class="stat-num time">⏱️</span><span class="stat-label">{{ timeText }}</span></div>
        </div>

        <!-- 分布统计 -->
        <div class="breakdowns">
          <div class="breakdown-card">
            <div class="bd-title">📚 分类分布</div>
            <div class="bd-bars">
              <div v-for="c in categoryBreakdown" :key="c.id" class="bd-bar-row">
                <span class="bd-label">{{ catIcon(c.id) }} {{ catName(c.id) }}</span>
                <div class="bd-bar"><div class="bd-fill brand" :style="{ width: (c.count / total * 100) + '%' }"></div></div>
                <span class="bd-count">{{ c.count }}题</span>
              </div>
            </div>
          </div>
          <div class="breakdown-card">
            <div class="bd-title">⚖️ 难度分布</div>
            <div class="bd-bars">
              <div v-for="d in ['简单','中等','困难']" :key="d" class="bd-bar-row">
                <span class="bd-label" :style="{ color: diffStyle(d).color }">{{ d }}</span>
                <div class="bd-bar"><div class="bd-fill" :style="{ width: (difficultyBreakdown[d] / total * 100) + '%', background: diffStyle(d).color }"></div></div>
                <span class="bd-count">{{ difficultyBreakdown[d] }}题</span>
              </div>
            </div>
          </div>
        </div>

        <div class="result-actions">
          <button class="btn-primary" @click="retry">再考一次</button>
          <button class="btn-ghost" @click="exit">返回</button>
        </div>
      </div>

      <!-- 错题解析 -->
      <div class="wrong-section" v-if="result.wrongList.length">
        <h3 class="wrong-head">错题解析（{{ result.wrongList.length }} 题）</h3>
        <div v-for="(item, idx) in result.wrongList" :key="idx" class="card wrong-card">
          <div class="w-meta">
            <div class="w-meta-left">
              <span class="q-cat"><span class="cat-ico">{{ catIcon(item.question.category) }}</span>{{ catName(item.question.category) }}</span>
              <span
                class="q-diff small"
                :style="{ color: diffStyle(item.question.difficulty).color, background: diffStyle(item.question.difficulty).bg }"
              >{{ item.question.difficulty || '中等' }}</span>
            </div>
            <span class="w-no">错题 {{ idx + 1 }}</span>
          </div>
          <p class="w-title">{{ item.question.question }}</p>

          <ul class="options review">
            <li
              v-for="(opt, i) in item.question.options"
              :key="i"
              class="option"
              :class="{
                correct: i === item.correctIndex,
                wrongpick: i === item.selected,
                review: true
              }"
            >
              <span class="opt-letter">{{ letters[i] }}</span>
              <span class="opt-text">{{ opt }}</span>
              <span class="opt-tag" v-if="i === item.correctIndex">正确答案</span>
              <span class="opt-tag wrong" v-else-if="i === item.selected">你的选择</span>
            </li>
          </ul>

          <div class="analysis">
            <span class="analysis-label">💡 解析</span>
            <p class="analysis-text">{{ item.question.analysis }}</p>
          </div>
        </div>
      </div>

      <div v-else class="card all-correct">
        <span class="big-emoji">🎉</span>
        <p>全部答对，没有错题！</p>
      </div>
    </section>

    <!-- 交卷确认弹窗 -->
    <div v-if="showConfirm" class="modal-mask" @click.self="showConfirm = false">
      <div class="modal card">
        <h3>确认交卷？</h3>
        <p class="muted">
          已答 {{ answeredCount }} / {{ total }} 题
          <span v-if="total - answeredCount > 0" class="warn">（还有 {{ total - answeredCount }} 题未答）</span>
        </p>
        <div class="modal-actions">
          <button class="btn-ghost" @click="showConfirm = false">继续答题</button>
          <button class="btn-submit" @click="doSubmit">确认交卷</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exam-view {
  padding-top: 8px;
}

/* ---- 通用卡片 ---- */
.card {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
}

/* ---- 开始页 ---- */
.start-card {
  padding: 40px 40px 48px;
  text-align: center;
}
.start-emoji {
  font-size: 56px;
  margin-bottom: 8px;
}
.start-card h1 {
  font-size: 28px;
  margin-bottom: 12px;
}
.start-card .desc {
  max-width: 620px;
  margin: 0 auto 28px;
  font-size: 14px;
  line-height: 1.8;
}
.hl {
  color: var(--brand);
  font-weight: 600;
}

/* ---- 配置块 ---- */
.config-block {
  max-width: 780px;
  margin: 0 auto 22px;
  text-align: left;
}
.config-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.config-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.cfg-ico {
  font-size: 18px;
}
.link-btn {
  background: none;
  border: none;
  color: var(--brand);
  font-size: 13px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}
.link-btn:hover {
  background: var(--brand-soft);
}

/* 难度模式卡片 */
.mode-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.mode-card {
  padding: 16px 14px;
  border: 2px solid var(--border);
  background: var(--bg-sunken);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
}
.mode-card:hover {
  border-color: var(--border-strong);
}
.mode-card.active {
  border-width: 2px;
}
.mode-ico {
  font-size: 26px;
  margin-bottom: 4px;
}
.mode-label {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 3px;
}
.mode-desc {
  font-size: 11.5px;
  color: var(--text-muted);
  line-height: 1.5;
}

/* 分类 chip */
.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
}
.cat-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1.5px solid var(--border);
  background: var(--bg-elevated);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.15s;
  font-size: 13.5px;
}
.cat-chip:hover {
  border-color: var(--border-strong);
  background: var(--bg-sunken);
}
.cat-chip.active {
  border-color: var(--brand);
  background: var(--brand-soft);
  color: var(--brand);
  font-weight: 600;
}
.cat-emoji {
  font-size: 18px;
}
.small-tip {
  margin-top: 8px;
  font-size: 12.5px;
}

.rules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin: 20px auto 32px;
  max-width: 780px;
  text-align: left;
}
.rule-item {
  display: flex;
  gap: 12px;
  padding: 14px;
  background: var(--bg-sunken);
  border-radius: var(--radius);
}
.rule-ico {
  font-size: 22px;
}
.rule-item strong {
  font-size: 14px;
}
.rule-item p {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--text-muted);
}

/* ---- 按钮 ---- */
.btn-primary,
.btn-ghost,
.btn-submit {
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 600;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-primary {
  background: var(--brand);
  color: #fff;
}
.btn-primary:hover {
  background: var(--brand-700);
}
.btn-primary.big {
  padding: 14px 36px;
  font-size: 16px;
}
.btn-ghost {
  background: var(--bg-elevated);
  border-color: var(--border-strong);
  color: var(--text-soft);
}
.btn-ghost:hover:not(:disabled) {
  color: var(--text);
  border-color: var(--brand);
}
.btn-ghost:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.btn-submit {
  background: var(--hard);
  color: #fff;
}
.btn-submit:hover {
  filter: brightness(1.1);
}

/* ---- 答题页 ---- */
.taking-top {
  margin-bottom: 16px;
}
.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 14px;
  margin-bottom: 8px;
}
.q-no {
  font-weight: 700;
  font-size: 16px;
}
.progress-bar {
  height: 6px;
  background: var(--bg-sunken);
  border-radius: 3px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--brand);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.question-card {
  padding: 24px 28px;
  margin-bottom: 16px;
}
.q-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 12px;
}
.q-cat {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  font-size: 12px;
  background: var(--brand-soft);
  color: var(--brand);
  border-radius: 999px;
}
.cat-ico {
  font-size: 13px;
}
.q-diff {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  font-size: 12px;
  border-radius: 999px;
  font-weight: 600;
}
.q-diff.small {
  font-size: 11px;
  padding: 2px 8px;
}
.q-title {
  font-size: 18px;
  line-height: 1.7;
  margin-bottom: 20px;
  white-space: pre-wrap;
}

.options {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.15s;
  background: var(--bg-elevated);
}
.option:hover {
  border-color: var(--border-strong);
  background: var(--bg-sunken);
}
.option.selected {
  border-color: var(--brand);
  background: var(--brand-soft);
}
.opt-letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--bg-sunken);
  color: var(--text-soft);
  font-size: 13px;
  font-weight: 700;
}
.option.selected .opt-letter {
  background: var(--brand);
  color: #fff;
}
.opt-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}
.opt-check {
  color: var(--brand);
  font-weight: 700;
}

.taking-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.navigator {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(38px, 1fr));
  gap: 8px;
  padding: 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.nav-cell {
  height: 38px;
  padding: 0;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--text-muted);
  border-radius: var(--radius-sm);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.12s;
}
.nav-cell:hover {
  border-color: var(--border-strong);
}
.nav-cell.answered {
  background: var(--brand-soft);
  color: var(--brand);
  border-color: var(--brand);
}
.nav-cell.current {
  outline: 2px solid var(--brand);
  outline-offset: 1px;
  font-weight: 700;
}

/* ---- 结果页 ---- */
.score-card {
  padding: 36px 40px;
  text-align: center;
  margin-bottom: 24px;
}
.score-circle {
  width: 140px;
  height: 140px;
  margin: 0 auto 16px;
  border-radius: 50%;
  border: 5px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.score-num {
  font-size: 44px;
  font-weight: 800;
  line-height: 1;
}
.score-unit {
  font-size: 13px;
  margin-top: 2px;
}
.stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin: 24px 0 28px;
}
.stat {
  display: flex;
  flex-direction: column;
}
.stat-num {
  font-size: 24px;
  font-weight: 700;
}
.stat-num.correct { color: var(--easy); }
.stat-num.wrong { color: var(--hard); }
.stat-num.skip { color: var(--text-muted); }
.stat-num.time { font-size: 22px; }
.stat-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

/* 分布统计 */
.breakdowns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 28px;
  text-align: left;
}
.breakdown-card {
  padding: 18px 20px;
  background: var(--bg-sunken);
  border-radius: var(--radius);
}
.bd-title {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 12px;
}
.bd-bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bd-bar-row {
  display: grid;
  grid-template-columns: 130px 1fr 48px;
  gap: 10px;
  align-items: center;
  font-size: 12.5px;
}
.bd-label {
  color: var(--text-soft);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}
.bd-bar {
  height: 8px;
  background: var(--bg-elevated);
  border-radius: 4px;
  overflow: hidden;
}
.bd-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
}
.bd-fill.brand {
  background: var(--brand);
}
.bd-count {
  color: var(--text-muted);
  text-align: right;
  font-weight: 600;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

/* ---- 错题解析 ---- */
.wrong-head {
  font-size: 18px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.wrong-card {
  padding: 22px 24px;
  margin-bottom: 14px;
  border-left: 4px solid var(--hard);
}
.w-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.w-meta-left {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
}
.w-no {
  font-size: 12px;
  color: var(--hard);
  font-weight: 600;
}
.w-title {
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 16px;
  white-space: pre-wrap;
}

/* 选项复核态 */
.options.review .option {
  cursor: default;
}
.options.review .option:hover {
  background: var(--bg-elevated);
  border-color: var(--border);
}
.options.review .option.correct {
  border-color: var(--easy);
  background: var(--easy-bg);
}
.options.review .option.correct .opt-letter {
  background: var(--easy);
  color: #fff;
}
.options.review .option.wrongpick {
  border-color: var(--hard);
  background: var(--hard-bg);
}
.options.review .option.wrongpick .opt-letter {
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
  margin-left: auto;
  flex-shrink: 0;
}
.opt-tag.wrong {
  background: var(--hard);
}

.analysis {
  margin-top: 16px;
  padding: 14px 16px;
  background: var(--bg-sunken);
  border-radius: var(--radius);
  border-left: 3px solid var(--brand);
}
.analysis-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--brand);
}
.analysis-text {
  margin: 6px 0 0;
  font-size: 14px;
  line-height: 1.75;
  color: var(--text-soft);
}

.all-correct {
  padding: 48px;
  text-align: center;
}
.big-emoji {
  font-size: 48px;
  display: block;
  margin-bottom: 8px;
}

/* ---- 弹窗 ---- */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}
.modal {
  padding: 28px 32px;
  max-width: 380px;
  width: calc(100% - 32px);
  text-align: center;
}
.modal h3 {
  font-size: 18px;
  margin-bottom: 8px;
}
.modal .warn {
  color: var(--hard);
}
.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .start-card { padding: 28px 18px 36px; }
  .question-card { padding: 18px; }
  .stats { gap: 18px; }
  .score-card { padding: 28px 18px; }
  .mode-grid { grid-template-columns: 1fr; }
  .breakdowns { grid-template-columns: 1fr; }
  .bd-bar-row { grid-template-columns: 110px 1fr 40px; }
}
</style>
