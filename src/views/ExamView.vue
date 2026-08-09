<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useExamStore } from '@/stores/exam'
import { examQuestionCount } from '@/data/exam'
import { categories } from '@/data/categories'

const store = useExamStore()
const { phase, questions, answers, currentIndex, total, currentQuestion, currentAnswer, answeredCount, progress, result, usedSeconds } =
  storeToRefs(store)

const catName = (id) => categories.find((c) => c.id === id)?.name || id
const catIcon = (id) => categories.find((c) => c.id === id)?.icon || '❓'
const letters = ['A', 'B', 'C', 'D', 'E', 'F']

const showConfirm = ref(false)

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
          从 {{ examQuestionCount }} 道选择题题库中随机抽取 {{ store.EXAM_SIZE }} 题，覆盖
          HTML / CSS / JavaScript / TypeScript / Vue / React / 浏览器 / 网络 / 性能 / 工程化等方向。
          交卷后立即出分，并附错题详细解析。
        </p>
      </div>

      <div class="rules">
        <div class="rule-item"><span class="rule-ico">🎯</span><div><strong>题量</strong><p>每次 {{ store.EXAM_SIZE }} 道单选题，随机抽取</p></div></div>
        <div class="rule-item"><span class="rule-ico">⏱️</span><div><strong>计时</strong><p>自动计时，不设时限，建议 20 分钟内完成</p></div></div>
        <div class="rule-item"><span class="rule-ico">📊</span><div><strong>计分</strong><p>每题 {{ (100 / store.EXAM_SIZE).toFixed(1) }} 分，满分 100 分</p></div></div>
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
            <span class="q-cat"><span class="cat-ico">{{ catIcon(item.question.category) }}</span>{{ catName(item.question.category) }}</span>
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
  padding: 48px 40px;
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
  max-width: 580px;
  margin: 0 auto 28px;
  font-size: 14px;
  line-height: 1.8;
}
.rules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin-bottom: 32px;
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
  margin-bottom: 10px;
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
  padding: 40px;
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
  margin: 24px 0;
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
  .start-card { padding: 32px 20px; }
  .question-card { padding: 18px; }
  .stats { gap: 18px; }
  .score-card { padding: 28px 18px; }
}
</style>
