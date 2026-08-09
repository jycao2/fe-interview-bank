// 校验所有题库数据文件能否被正确解析
const files = [
  'html', 'css', 'javascript', 'typescript', 'vue', 'react',
  'browser', 'network', 'performance', 'engineering', 'algorithm', 'handwriting',
  'aicode', 'gis'
]

let hasError = false
for (const name of files) {
  try {
    const mod = await import(`../src/data/${name}.js`)
    const arr = mod[`${name}Questions`]
    const count = Array.isArray(arr) ? arr.length : 'NOT_ARRAY'
    // 逐题检查 answer 是否为字符串
    if (Array.isArray(arr)) {
      arr.forEach((q, i) => {
        if (typeof q.answer !== 'string') {
          console.log(`  ⚠️ ${name}[${i}] answer 不是字符串: ${typeof q.answer}`)
          hasError = true
        }
        if (typeof q.title !== 'string') {
          console.log(`  ⚠️ ${name}[${i}] title 不是字符串`)
          hasError = true
        }
      })
    }
    console.log(`✓ ${name}.js  (${count} 题)`)
  } catch (e) {
    hasError = true
    console.log(`✗ ${name}.js  -> ${e.message.split('\n')[0]}`)
  }
}
console.log(hasError ? '\n存在错误，需修复' : '\n全部通过 ✓')
