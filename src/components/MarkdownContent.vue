<script setup>
import { computed, onMounted, watch, nextTick } from 'vue'
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps({
  source: { type: String, default: '' }
})

const html = computed(() => renderMarkdown(props.source))

function setupCodeBlocks() {
  document.querySelectorAll('.markdown-body .code-block').forEach(block => {
    if (block.dataset.enhanced) return
    block.dataset.enhanced = '1'

    const copyBtn = block.querySelector('.cb-copy')
    const runBtn = block.querySelector('.cb-run')
    const closeBtn = block.querySelector('.cb-close-output')
    const lang = block.dataset.lang
    const codeEl = block.querySelector('pre code')
    const outputEl = block.querySelector('.code-block-output')
    const outputBody = block.querySelector('.cb-output-body')

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const text = codeEl ? codeEl.textContent : ''
        copyText(text)
        copyBtn.textContent = '✓ 已复制'
        setTimeout(() => { copyBtn.textContent = '📋 复制' }, 1500)
      })
    }

    if (runBtn && !runBtn.disabled) {
      runBtn.addEventListener('click', async () => {
        if (runBtn.dataset.running === '1') return
        runBtn.dataset.running = '1'
        const origText = runBtn.textContent
        runBtn.textContent = '⏳ 运行中...'
        runBtn.style.opacity = '0.7'

        try {
          const code = codeEl ? codeEl.textContent : ''
          const result = await runCode(code, lang)
          showOutput(block, outputEl, outputBody, result, lang)
        } catch (e) {
          showOutput(block, outputEl, outputBody, `❌ 运行出错:\n${e.message}`, lang)
        } finally {
          runBtn.dataset.running = '0'
          runBtn.textContent = origText
          runBtn.style.opacity = ''
        }
      })
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (outputEl) {
          outputEl.hidden = true
          const iframe = outputEl.querySelector('iframe')
          if (iframe) iframe.remove()
        }
      })
    }
  })
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
}

function showOutput(block, outputEl, outputBody, result, lang) {
  if (!outputEl || !outputBody) return
  outputEl.hidden = false

  const langLower = (lang || '').toLowerCase()
  if (langLower === 'html' || langLower === 'css') {
    outputBody.innerHTML = ''
    const iframe = document.createElement('iframe')
    iframe.className = 'cb-preview-frame'
    iframe.srcdoc = result
    iframe.style.cssText = 'width:100%;height:300px;border:none;border-radius:4px;background:#fff;'
    outputBody.appendChild(iframe)
  } else {
    outputBody.textContent = result
  }

  outputEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

async function runCode(code, lang) {
  const langLower = (lang || '').toLowerCase()
  if (langLower === 'javascript' || langLower === 'js') {
    return runJavaScript(code)
  } else if (langLower === 'typescript' || langLower === 'ts') {
    return runJavaScript(code)
  } else if (langLower === 'html') {
    return runHTML(code)
  } else if (langLower === 'css') {
    return runCSS(code)
  } else if (langLower === 'json') {
    return runJSON(code)
  } else if (langLower === 'bash' || langLower === 'shell') {
    throw new Error('Shell 代码只能在服务端或终端执行，无法在浏览器中运行。')
  } else {
    throw new Error('该语言暂不支持运行。')
  }
}

async function runJavaScript(code) {
  const logs = []
  const origLog = console.log
  const origError = console.error
  const origWarn = console.warn
  const origInfo = console.info

  console.log = (...args) => logs.push(args.map(formatVal).join(' '))
  console.error = (...args) => logs.push('❌ ' + args.map(formatVal).join(' '))
  console.warn = (...args) => logs.push('⚠️ ' + args.map(formatVal).join(' '))
  console.info = (...args) => logs.push('ℹ️ ' + args.map(formatVal).join(' '))

  try {
    const transformed = transformCode(code)
    const wrappedCode = `
      return (async () => {
        ${transformed}
      })()
    `
    const fn = new Function('console', wrappedCode)
    const result = await fn({
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info
    })
    if (result !== undefined) {
      logs.push('→ ' + formatVal(result))
    }
    return logs.join('\n') || '（无输出）'
  } finally {
    console.log = origLog
    console.error = origError
    console.warn = origWarn
    console.info = origInfo
  }
}

function transformCode(code) {
  if (/\bconsole\.(log|error|warn|info|debug)\s*\(/.test(code)) {
    return code
  }
  const lines = code.split('\n')
  const result = []
  for (let line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*')) {
      result.push(line)
      continue
    }
    const codeOnly = line.replace(/\/\/.*$/, '').trim()
    if (!codeOnly) {
      result.push(line)
      continue
    }
    if (/^[{}\[\];]+$/.test(codeOnly)) {
      result.push(line)
      continue
    }
    if (/^(const|let|var|function|return|if|for|while|switch|class|import|export|try|catch|finally)\b/.test(codeOnly)) {
      result.push(line)
      continue
    }
    const indent = line.match(/^\s*/)[0]
    result.push(`${indent}console.log(${codeOnly})`)
  }
  return result.join('\n')
}

function formatVal(v) {
  if (v === null) return 'null'
  if (v === undefined) return 'undefined'
  if (typeof v === 'object') {
    try {
      return JSON.stringify(v, null, 2)
    } catch {
      return String(v)
    }
  }
  return String(v)
}

function runHTML(code) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
    body{font-family:system-ui,sans-serif;padding:16px;margin:0;color:#24292f;background:#fff;}
  </style></head><body>${code}</body></html>`
}

function runCSS(code) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${code}</style></head><body>
    <div style="padding:20px;font-family:system-ui,sans-serif;">
      <h3 style="margin:0 0 8px;">CSS 预览效果</h3>
      <p style="margin:0 0 12px;color:#57606a;">这是一段测试文本，用于展示 CSS 效果。</p>
      <button>按钮示例</button>
      <div class="box" style="width:60px;height:60px;background:#42b883;margin-top:10px;border-radius:6px;"></div>
    </div></body></html>`
}

function runJSON(code) {
  const parsed = JSON.parse(code)
  return '✅ JSON 合法:\n' + JSON.stringify(parsed, null, 2)
}

watch(html, () => {
  nextTick(setupCodeBlocks)
})

onMounted(() => {
  nextTick(setupCodeBlocks)
})
</script>

<template>
  <div class="markdown-body" v-html="html"></div>
</template>
