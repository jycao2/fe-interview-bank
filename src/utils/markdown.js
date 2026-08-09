import { marked } from 'marked'
import hljs from 'highlight.js'

marked.setOptions({
  gfm: true,
  breaks: false
})

const ALLOWED_LANGS = ['javascript', 'js', 'typescript', 'ts', 'html', 'css', 'json', 'bash', 'shell', 'sql']

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

marked.use({
  renderer: {
    code(code, infostring, escaped) {
      const lang = (infostring || '').trim()
      const highlighted = lang && hljs.getLanguage(lang)
        ? hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
        : escapeHtml(code)

      const langLabel = lang || 'text'
      const runnable = ALLOWED_LANGS.some(l => langLabel.toLowerCase().startsWith(l))

      const runBtn = runnable
        ? `<button class="cb-btn cb-run" title="运行代码">▶ 运行</button>`
        : `<button class="cb-btn cb-run cb-disabled" title="此语言不支持运行" disabled>▶ 运行</button>`

      return `<div class="code-block" data-lang="${langLabel}">
  <div class="code-block-toolbar">
    <span class="code-block-lang">${escapeHtml(langLabel)}</span>
    <div class="code-block-actions">
      <button class="cb-btn cb-copy" title="复制代码">📋 复制</button>
      ${runBtn}
    </div>
  </div>
  <pre><code class="hljs language-${langLabel}">${highlighted}</code></pre>
  <div class="code-block-output" hidden>
    <div class="cb-output-header">
      <span>运行结果</span>
      <button class="cb-btn cb-close-output" title="关闭">✕</button>
    </div>
    <pre class="cb-output-body"></pre>
  </div>
</div>`
    }
  }
})

export function renderMarkdown(source) {
  if (!source) return ''
  return marked.parse(source)
}
