export const categories = [
  {
    id: 'html',
    name: 'HTML',
    icon: '📄',
    desc: '语义化、可访问性、HTML5 新特性'
  },
  {
    id: 'css',
    name: 'CSS',
    icon: '🎨',
    desc: '布局、选择器、动画、工程化'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '✨',
    desc: '类型、作用域、原型、异步、ES6+'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: '🧩',
    desc: '类型系统、泛型、类型体操'
  },
  {
    id: 'vue',
    name: 'Vue',
    icon: '💚',
    desc: '响应式、组件、Composition API、生态'
  },
  {
    id: 'react',
    name: 'React',
    icon: '⚛️',
    desc: 'Hooks、Fiber、状态管理、性能'
  },
  {
    id: 'browser',
    name: '浏览器原理',
    icon: '🌐',
    desc: '渲染机制、事件循环、存储、安全'
  },
  {
    id: 'network',
    name: '计算机网络',
    icon: '🔗',
    desc: 'HTTP、缓存、跨域、WebSocket'
  },
  {
    id: 'performance',
    name: '性能优化',
    icon: '⚡',
    desc: '加载、渲染、运行时性能、指标'
  },
  {
    id: 'engineering',
    name: '工程化',
    icon: '🛠️',
    desc: '构建、模块化、规范、CI/CD、监控'
  },
  {
    id: 'algorithm',
    name: '数据结构与算法',
    icon: '📊',
    desc: '复杂度、常见数据结构、经典算法'
  },
  {
    id: 'handwriting',
    name: '手写代码',
    icon: '✍️',
    desc: '高频手写实现与原理'
  },
  {
    id: 'aicode',
    name: 'AI 编程',
    icon: '🤖',
    desc: 'AI 辅助编程工具、Agent、RAG、提示工程'
  },
  {
    id: 'gis',
    name: 'GIS 地理信息',
    icon: '🗺️',
    desc: 'GeoJSON、坐标系、瓦片、Turf、WebGL 可视化'
  },
  {
    id: 'mobile',
    name: '移动端 / 小程序',
    icon: '📱',
    desc: '移动端 H5 兼容、微信小程序、uni-app / Taro 跨端、Hybrid JSBridge、RN/Flutter 选型'
  }
]

export const difficulties = [
  { id: '简单', color: 'var(--easy)', bg: 'var(--easy-bg)' },
  { id: '中等', color: 'var(--medium)', bg: 'var(--medium-bg)' },
  { id: '困难', color: 'var(--hard)', bg: 'var(--hard-bg)' }
]

// GIS 分类下按框架细分展示，按此顺序分组
// 题目对象的 framework 字段缺省时归入 'general'
export const gisFrameworks = [
  { id: 'general', name: '通用 / 基础', icon: '🧭', desc: '坐标系、GeoJSON、瓦片、性能、可视化等通用知识' },
  { id: 'openlayers', name: 'OpenLayers', icon: '🟠', desc: '政企级 GIS，OGC 全协议、矢量编辑' },
  { id: 'mapbox', name: 'Mapbox / MapLibre', icon: '🟦', desc: '矢量瓦片、style spec、3D 地形、表达式' },
  { id: 'leaflet', name: 'Leaflet', icon: '🍃', desc: '轻量地图、插件生态、Canvas 渲染' },
  { id: 'cesium', name: 'Cesium', icon: '🌍', desc: '3D 地球、地形影像、3D Tiles' },
  { id: 'threejs', name: 'Three.js', icon: '🎲', desc: '3D 城市白模、坐标集成、自定义场景' },
  { id: 'deckgl', name: 'Deck.gl', icon: '📊', desc: '大规模地理可视化、百万级 GPU 渲染' },
  { id: 'turf', name: 'Turf.js', icon: '🧮', desc: '空间分析、布尔运算、缓冲、距离' }
]
