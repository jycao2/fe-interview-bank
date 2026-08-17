import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/category/:category',
    name: 'category',
    component: () => import('@/views/CategoryView.vue'),
    meta: { title: '分类' }
  },
  {
    path: '/question/:id',
    name: 'question',
    component: () => import('@/views/QuestionView.vue'),
    meta: { title: '题目详情' }
  },
  {
    path: '/exam',
    name: 'exam',
    component: () => import('@/views/ExamView.vue'),
    meta: { title: '模拟考试' }
  },
  {
    path: '/algorithm-exam',
    name: 'algorithm-exam',
    component: () => import('@/views/AlgorithmExamView.vue'),
    meta: { title: '算法考试' }
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('@/views/FavoritesView.vue'),
    meta: { title: '我的收藏' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: '关于' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to) => {
  const base = '前端面试题库'
  document.title = to.meta.title ? `${to.meta.title} · ${base}` : base
})

export default router
