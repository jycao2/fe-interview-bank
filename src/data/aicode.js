﻿export const aicodeQuestions = [
  {
    id: 'ai-001',
    category: 'aicode',
    title: 'AI 辅助编程工具的原理是什么？',
    difficulty: '中等',
    tags: ['AI编程', 'LLM', '原理', 'Copilot'],
    answer: `## 核心原理

AI 编程工具（GitHub Copilot、Cursor、Claude Code 等）本质是基于**大语言模型（LLM）**的代码生成系统，关键技术栈包括：

## 1. 基础模型

- **代码专用模型**：在大量开源代码（GitHub、Stack Overflow）上微调的 LLM，如 Codex（GPT 系列前身）、Code Llama、DeepSeek-Coder、StarCoder。
- **通用大模型**：GPT-4、Claude、Gemini 等也具备强大代码能力，且推理与上下文理解更强。

模型通过**预测下一个 token** 的方式生成代码，本质是概率分布采样。

## 2. 上下文构建（Context Engineering）

AI 编程的核心不只是模型，更是**如何把相关上下文喂给模型**：

\`\`\`
用户输入 + 当前文件 + 相关文件 + 类型定义 + 项目规则 + 历史对话
            ↓
        LLM 推理
            ↓
       生成 / 补全代码
\`\`\`

- **光标上下文**：当前光标位置前后的代码。
- **检索增强（RAG）**：从代码库检索相关文件、符号定义。
- **项目规则**：\`.cursorrules\`、\`.windsurfrules\` 等约定项目风格。
- **类型信息**：TypeScript 类型、函数签名帮助模型理解接口。

## 3. 交互方式

| 方式 | 说明 | 典型场景 |
| --- | --- | --- |
| **Inline 补全** | 光标处实时补全（灰色提示） | Copilot、Cursor Tab |
| **Chat 对话** | 侧边栏对话，可引用文件/代码 | Cursor Chat、Copilot Chat |
| **Agent 模式** | 自主规划、多步执行、编辑多文件 | Claude Code、Cursor Agent |
| **Cmd-K 编辑** | 选中代码后用指令修改 | Cursor Cmd-K |

## 4. 工具调用（Tool Use / Function Calling）

Agent 模式下，模型可调用工具扩展能力：

- \`read_file\`：读文件
- \`edit_file\` / \`write_file\`：修改文件
- \`run_command\`：执行 shell
- \`grep\` / \`glob\`：搜索代码
- \`web_search\`：联网搜索

模型决定"调用什么工具、传什么参数"，工具返回结果后模型继续推理，形成 **ReAct 循环**（Reason + Act）。

## 5. 长上下文与压缩

- 现代模型支持 100K~2M token 上下文（Claude 200K、Gemini 2M）。
- 但**长上下文≠好效果**：存在"中间遗忘"问题，关键信息应放在开头/结尾。
- 大项目无法全塞进上下文 → 需要 RAG + 上下文压缩 + 子 Agent 分工。

## 关键挑战

1. **幻觉**：生成不存在的 API、错误的函数签名。
2. **上下文不足**：不了解全局架构、跨文件依赖。
3. **安全**：可能引入漏洞、泄露密钥、生成侵权代码。
4. **成本**：长上下文 + 多轮调用带来高昂 API 费用。
5. **可验证性**：生成的代码需要人工 review 和测试。

## 总结

AI 编程工具 = **LLM + 上下文工程 + 工具调用 + 交互设计**。模型决定上限，上下文工程决定下限，工具调用决定能力边界。`
  },
  {
    id: 'ai-002',
    category: 'aicode',
    title: 'Copilot、Cursor、Claude Code、Windsurf 等工具有何区别？',
    difficulty: '中等',
    tags: ['Copilot', 'Cursor', 'Claude Code', 'Windsurf', '对比'],
    answer: `## 主流工具对比

| 工具 | 定位 | 核心特点 | 适合场景 |
| --- | --- | --- | --- |
| **GitHub Copilot** | 编辑器插件 | VS Code/JetBrains 集成，补全 + Chat | 通用补全、企业集成 |
| **Cursor** | VS Code Fork | 原生 Agent、Cmd-K、Tab 智能补全、多模型 | 全流程 AI 编程 |
| **Claude Code** | 终端 Agent | CLI 运行，自主多步执行，强推理 | 复杂任务、重构、自动化 |
| **Windsurf** | VS Code Fork | Cascade（Agent + Copilot 融合）、Flow | 长任务协作 |
| **Continue** | 开源插件 | 自托管、可接任意模型 | 隐私敏感、自部署 |
| **Aider** | 开源 CLI | 终端、Git 自动提交、开源 | 命令行党、可脚本化 |
| **Cody (Sourcegraph)** | 编辑器插件 | 强代码检索、企业级 | 大型代码库 |

## 核心差异维度

### 1. 补全 vs Agent

- **补全型**（Copilot、Cursor Tab）：在光标处预测下一段代码，低延迟，用户主导。
- **Agent 型**（Claude Code、Cursor Agent、Windsurf Cascade）：接收任务后自主规划、读写文件、运行命令、迭代修复。

### 2. 编辑器集成度

- **插件型**（Copilot、Continue、Cody）：受宿主编辑器 API 限制，能力上限较低。
- **Fork 型**（Cursor、Windsurf）：直接改 VS Code 内核，能做更深的上下文采集（如全仓库索引、语义检索）。

### 3. 上下文能力

| 工具 | 上下文获取方式 |
| --- | --- |
| Copilot | 邻近代码 + Chat 中 @file 引用 |
| Cursor | 全仓库语义索引 + @codebase RAG + 多文件引用 |
| Claude Code | 工具调用主动 grep/read，按需探索 |
| Windsurf | Cascade 自动追踪上下文 + 手动 @引用 |

### 4. 模型策略

- **Copilot**：主要用 OpenAI 系列（GPT-4o、o3）。
- **Cursor**：多模型可选（Claude、GPT、Gemini、自研 Cursor Tab 模型）。
- **Claude Code**：仅 Claude（Sonnet/Opus）。
- **Windsurf**：Claude + GPT + 自研模型。
- **Aider**：任意 OpenAI 兼容 API。

### 5. 工作流差异

**Cursor 工作流**：
\`\`\`
写注释 → Tab 补全 → Cmd-K 选中修改 → Chat 问问题 → Agent 处理大任务
\`\`\`

**Claude Code 工作流**：
\`\`\`
终端输入任务 → Agent 自主探索代码 → 编辑多文件 → 运行测试 → 自我修复 → 汇报
\`\`\`

**Windsurf Cascade**：
\`\`\`
描述需求 → Cascade 规划步骤 → 逐步执行 → 实时预览 → 用户确认
\`\`\`

## 选型建议

- **个人开发、想要最强补全** → Cursor。
- **复杂重构、跨文件大改动** → Claude Code 或 Cursor Agent。
- **企业、需 SSO/合规** → Copilot Enterprise 或 Cody。
- **开源 / 自托管** → Continue + 本地模型 / Aider。
- **VS Code 重度用户不想换编辑器** → Copilot + Continue。
- **多模型灵活切换** → Cursor 或 Windsurf。

## 趋势

工具正在从"补全"走向"Agent"，从"插件"走向"原生编辑器"。模型能力提升 + 上下文工程成熟，让 AI 越来越能独立完成端到端任务。`
  },
  {
    id: 'ai-003',
    category: 'aicode',
    title: '什么是 Context Engineering（上下文工程）？',
    difficulty: '困难',
    tags: ['上下文工程', 'Context', 'RAG', 'Prompt'],
    answer: `## 定义

Context Engineering 是**为 LLM 构造合适上下文**的工程实践——决定"在用户输入之外，还应该把什么信息以什么顺序、什么格式塞进 prompt"。

> Prompt Engineering 关注"如何提问"，Context Engineering 关注"如何提供背景"。

## 为什么重要

1. **模型没有记忆**：每次调用都是无状态的，所有背景必须重新提供。
2. **长上下文有成本与衰减**：上下文越长越贵，且存在"中间遗忘"（lost in the middle）。
3. **代码库远超上下文窗口**：百万行代码不可能全塞进去。
4. **质量取决于上下文质量**：模型再强，喂错上下文也生成垃圾。

## 上下文的组成

\`\`\`
完整 Prompt = 系统提示 + 项目规则 + 检索结果 + 当前代码 + 用户输入 + 工具结果
\`\`\`

### 1. 系统提示（System Prompt）

模型的角色、能力边界、输出格式约定。

\`\`\`
你是一名资深前端工程师，遵循 Vue3 Composition API 风格...
\`\`\`

### 2. 项目规则（Project Rules）

- \`.cursorrules\` / \`.windsurfrules\` / \`CLAUDE.md\`
- 约定代码风格、架构、禁止事项。

### 3. 检索结果（RAG）

从代码库 / 文档中检索相关片段，注入上下文。

### 4. 当前代码

光标周围代码、打开的文件、选中的代码。

### 5. 工具结果

Agent 调用 \`read_file\`、\`grep\` 后返回的内容。

## 关键技术

### 1. 检索增强生成（RAG）

\`\`\`
用户问题 → embedding → 向量检索 → top-K 相关片段 → 拼入 prompt → LLM 生成
\`\`\`

- **嵌入模型**：OpenAI text-embedding-3、Cohere、BGE。
- **向量库**：Pinecone、Weaviate、Chroma、pgvector。
- **代码检索**：除语义检索外，还可用 AST、符号索引、LSP。

### 2. 上下文压缩

- **摘要**：把长文件压缩成摘要 + 关键签名。
- **分层**：先给目录结构，按需深入文件。
- **过滤**：去掉注释、空行、无关 import。

### 3. 上下文优先级

关键信息放**开头或结尾**（中间容易被遗忘）：

\`\`\`
[系统提示]              ← 开头，模型记得牢
[检索到的相关代码]
[当前文件]
[用户问题]              ← 结尾，最相关
\`\`\`

### 4. 工具调用扩展上下文

不预塞所有信息，而是让模型**按需取用**：

\`\`\`
模型："我需要看 utils.js" → read_file('utils.js') → 内容注入上下文 → 继续推理
\`\`\`

这种方式上下文更聚焦，但轮次更多、更慢。

### 5. 子 Agent 分工

复杂任务拆给多个 Agent，每个 Agent 处理子任务并返回**摘要**，主 Agent 只看摘要不看原始上下文。

\`\`\`
主 Agent → 子 Agent A（探索代码库） → 返回 5 行摘要
       → 子 Agent B（写测试）       → 返回 5 行摘要
       → 主 Agent 综合摘要做决策
\`\`\`

## 实践要点

1. **明确角色与边界**：系统提示里说清楚"做什么、不做什么"。
2. **提供示例**：Few-shot 示例比抽象描述有效。
3. **结构化输入**：用 XML/Markdown 标签区分上下文区块。
4. **减少噪音**：只给相关文件，避免"信息淹没"。
5. **反馈机制**：让模型说"我还需要什么信息"，再补充。
6. **缓存**：相同上下文复用（如系统提示 + 项目规则）。

## 与传统编程的对比

| | 传统编程 | AI 编程 |
| --- | --- | --- |
| 输入 | 函数参数 | 上下文（prompt + 文件 + 工具结果） |
| 处理 | 确定性算法 | 概率性推理 |
| 关键工程 | 算法、数据结构 | 上下文工程 |
| 调试 | 断点、日志 | 看 prompt、看检索结果、看工具调用 |

## 总结

Context Engineering 是 AI 编程时代的"新算法工程"。决定 AI 编程工具上限的，不仅是模型，更是上下文的构造能力——这正是一些工具（如 Cursor）能超越裸调 GPT API 的根本原因。`
  },
  {
    id: 'ai-004',
    category: 'aicode',
    title: 'AI Agent 与 Function Calling / Tool Use 是什么？',
    difficulty: '困难',
    tags: ['Agent', 'Function Calling', 'Tool Use', 'ReAct'],
    answer: `## Function Calling / Tool Use

让 LLM 能调用外部工具（函数）的能力。模型本身不执行代码，而是输出"调用哪个函数、传什么参数"，由外部执行后把结果返回给模型。

## 基本流程

\`\`\`
1. 系统提示中描述可用工具（JSON Schema）
2. 用户提问
3. 模型判断：直接回答 or 调用工具
4. 若调用工具：模型输出 { name, args }
5. 外部执行该函数，得到结果
6. 结果作为新消息注入对话
7. 模型基于结果继续推理 / 回答 / 再调工具
\`\`\`

## 示例

\`\`\`json
// 工具定义
{
  "name": "read_file",
  "description": "读取文件内容",
  "parameters": {
    "type": "object",
    "properties": {
      "path": { "type": "string", "description": "文件路径" }
    },
    "required": ["path"]
  }
}

// 模型输出
{
  "name": "read_file",
  "args": { "path": "src/utils.js" }
}

// 执行后返回
{ "content": "export function add(a, b) { return a + b }" }
\`\`\`

## 常见工具

AI 编程 Agent 的典型工具集：

| 工具 | 用途 |
| --- | --- |
| \`read_file\` | 读取文件 |
| \`write_file\` / \`edit_file\` | 创建 / 修改文件 |
| \`grep\` / \`glob\` | 搜索代码 |
| \`run_command\` | 执行 shell（测试、构建、git） |
| \`web_search\` / \`web_fetch\` | 联网搜索 |
| \`list_dir\` | 列目录 |

## Agent = LLM + Tool Use + 循环

Agent 在 Function Calling 基础上加入**自主循环**：

\`\`\`
任务 → 模型思考（Reason）→ 调用工具（Act）→ 观察结果（Observe）
     → 继续思考 → 调用工具 → 观察 → ... → 任务完成
\`\`\`

这就是 **ReAct 模式**（Reasoning + Acting）。

## 代码示例（伪代码）

\`\`\`js
async function runAgent(task) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: task }
  ]

  while (true) {
    const response = await llm.chat({
      messages,
      tools: TOOL_DEFINITIONS
    })

    // 模型决定结束
    if (response.stop_reason === 'end_turn') {
      return response.content
    }

    // 模型要调用工具
    if (response.tool_calls) {
      messages.push(response)  // 把模型的 tool_call 入栈
      for (const call of response.tool_calls) {
        const result = await executeTool(call.name, call.args)
        messages.push({ role: 'tool', tool_call_id: call.id, content: result })
      }
    }
  }
}
\`\`\`

## Agent 的关键设计

### 1. 工具设计

- **粒度合适**：太细（每个 sed 命令一个工具）模型决策累，太粗（一个 \`code\` 工具）失去结构。
- **描述清晰**：description 是模型理解工具的唯一来源。
- **错误反馈**：工具失败时返回结构化错误，让模型知道如何修正。

### 2. 循环控制

- **最大轮次**：防止死循环。
- **超时**：整体任务时间上限。
- **成本上限**：token 累计超过阈值停止。
- **人工确认**：危险操作（删除、部署）前请求用户确认。

### 3. 上下文管理

Agent 多轮调用后上下文会膨胀：

- **滚动窗口**：保留最近 N 轮。
- **摘要压缩**：把早期对话总结。
- **子 Agent 隔离**：子任务用独立上下文。

### 4. 规划与反思

- **Plan-then-Execute**：先列计划，再逐步执行（Claude Code、Devin 风格）。
- **Self-Reflection**：执行后自我评估，发现错误则回退重试。
- **TodoList**：维护任务清单，逐项推进。

## Agent vs 传统代码

| | 传统代码 | Agent |
| --- | --- | --- |
| 控制流 | 程序员写死 | 模型实时决策 |
| 鲁棒性 | 输入异常即崩溃 | 可自适应、重试 |
| 可解释性 | 强（可断点） | 弱（黑盒推理） |
| 成本 | 固定 | 与 token 量正相关 |
| 适用场景 | 流程明确 | 开放性、探索性任务 |

## 典型 Agent 框架

- **LangChain / LangGraph**：通用 Agent 框架。
- **AutoGPT / BabyAGI**：早期自主 Agent。
- **Claude Code / Cursor Agent**：编程专用 Agent。
- **Devin / OpenHands**：自主软件工程师。

## 挑战

1. **可靠性**：模型可能陷入循环、调用错误工具、编造参数。
2. **成本**：长任务可能消耗数十万 token。
3. **安全**：Agent 能执行命令、改文件，权限管理关键。
4. **可观测性**：调试 Agent 行为难，需要详细日志。
5. **评估**：如何衡量 Agent 完成任务的好坏？

## 总结

Function Calling 是基础能力，Agent 是基于它的自主系统。AI 编程工具正在从"补全"演化到"Agent"——能独立理解任务、规划、执行、验证。掌握 Agent 设计原理，是构建高级 AI 应用的关键。`
  },
  {
    id: 'ai-005',
    category: 'aicode',
    title: '什么是 MCP（Model Context Protocol）？',
    difficulty: '中等',
    tags: ['MCP', '协议', 'Anthropic', '工具集成'],
    answer: `## 定义

MCP（Model Context Protocol）是 Anthropic 于 2024 年开源的**开放协议**，标准化了 AI 应用与外部数据源 / 工具之间的连接方式——被誉为"AI 应用的 USB-C 接口"。

## 解决什么问题

在 MCP 之前，每个 AI 工具（Cursor、Claude Desktop、Continue）要接入外部能力（GitHub、数据库、Slack），都要**各自实现一套集成**：

\`\`\`
Cursor → 写 GitHub 集成 → 写数据库集成 → 写 Slack 集成
Claude Desktop → 写 GitHub 集成 → 写数据库集成 → 写 Slack 集成
Continue → 写 GitHub 集成 → 写数据库集成 → 写 Slack 集成
\`\`\`

N 个客户端 × M 个工具 = N×M 份集成代码，重复且低效。

MCP 把它变成 N+M：

\`\`\`
GitHub MCP Server（写一次） ← MCP 协议 → 任意 MCP 客户端
数据库 MCP Server（写一次） ← MCP 协议 → 任意 MCP 客户端
\`\`\`

## 架构

\`\`\`
MCP Host（如 Claude Desktop）
   ↓
MCP Client（host 内嵌的协议客户端）
   ↓ (JSON-RPC over stdio / SSE)
MCP Server（独立进程，封装某个工具/数据源）
   ↓
外部系统（GitHub / DB / 文件系统 / API）
\`\`\`

## 三类能力

MCP Server 可向 Client 暴露三种能力：

### 1. Tools（工具）

可被模型调用的函数（即 Function Calling 的标准化形式）。

\`\`\`json
{
  "name": "create_issue",
  "description": "在 GitHub 仓库创建 issue",
  "inputSchema": {
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "body": { "type": "string" }
    }
  }
}
\`\`\`

### 2. Resources（资源）

可被读取的数据源（文件、数据库记录、API 响应），类似 REST 的 GET。

\`\`\`
resource: "github://repos/anthropics/claude-code/issues"
\`\`\`

### 3. Prompts（提示模板）

预定义的 prompt 模板，用户可在 host 中选择使用。

## 协议要点

- **传输层**：stdio（本地进程）或 SSE/HTTP（远程）。
- **消息格式**：JSON-RPC 2.0。
- **双向通信**：Client 可调用 Server 的工具，Server 也可向 Client 推送（如订阅、采样）。
- **能力协商**：连接时双方声明自己支持的能力。

## 一个简单 MCP Server 示例

\`\`\`js
import { Server } from "@modelcontextprotocol/sdk/server"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio"

const server = new Server({
  name: "my-server",
  version: "1.0.0"
}, {
  capabilities: { tools: {} }
})

server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "get_weather",
    description: "获取天气",
    inputSchema: {
      type: "object",
      properties: { city: { type: "string" } },
      required: ["city"]
    }
  }]
}))

server.setRequestHandler("tools/call", async (req) => {
  if (req.params.name === "get_weather") {
    const { city } = req.params.arguments
    return { content: [{ type: "text", text: \`\${city} 晴 25°C\` }] }
  }
})

const transport = new StdioServerTransport()
await server.connect(transport)
\`\`\`

## 客户端配置（以 Claude Desktop 为例）

\`\`\`json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "xxx" }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://..."]
    }
  }
}
\`\`\`

启动后，Claude 就能直接查 GitHub、查数据库。

## 与传统 Function Calling 的区别

| | Function Calling | MCP |
| --- | --- | --- |
| 集成方式 | 每个应用单独实现 | 标准协议，一次实现多方可用 |
| 工具发现 | 静态写死 | 运行时动态发现 |
| 生态 | 厂商各自封闭 | 跨厂商共享 |
| 部署 | 与应用同进程 | 独立进程，可远程 |

## 现状与生态

- **官方 Server**：filesystem、git、github、postgres、sqlite、slack、google-drive 等。
- **社区 Server**：上千个，覆盖各种 SaaS 与工具。
- **支持客户端**：Claude Desktop、Cursor、Cline、Continue、Zed 等。
- **SDK**：TypeScript、Python、Java、Go、Rust。

## 局限与挑战

1. **安全**：MCP Server 可访问敏感数据，需谨慎配置权限。
2. **性能**：每个 Server 是独立进程，启动与通信有开销。
3. **标准化程度**：协议仍在演进，部分能力（如资源订阅）实现不一。
4. **可发现性**：Server 越多，模型选择工具越难（需良好的工具描述）。

## 总结

MCP 是 AI 应用走向**开放生态**的关键基础设施——让工具集成从"一对一硬编码"变成"即插即用"。对前端工程师而言，理解 MCP 既能扩展 AI 工具能力，也能成为构建 AI 应用的加分项。`
  },
  {
    id: 'ai-006',
    category: 'aicode',
    title: 'RAG（检索增强生成）在代码场景中如何应用？',
    difficulty: '困难',
    tags: ['RAG', '检索增强', 'Embedding', '向量检索'],
    answer: `## 什么是 RAG

RAG（Retrieval-Augmented Generation）= **先检索，再生成**。在调用 LLM 前，从知识库中检索相关片段，拼到 prompt 里，让模型基于"具体上下文"而非"训练记忆"回答。

## 为什么代码场景需要 RAG

1. **代码库不在训练集**：私有仓库、最新依赖模型都不知道。
2. **上下文窗口有限**：百万行代码塞不进去。
3. **降低幻觉**：基于真实代码生成，而非编造 API。
4. **可溯源**：能指出答案来自哪个文件、哪一行。

## RAG 的标准流程

\`\`\`
[索引阶段]
代码库 → 切分 → Embedding → 存入向量库

[查询阶段]
用户问题 → Embedding → 向量检索 top-K → 拼入 prompt → LLM 生成
\`\`\`

## 1. 切分（Chunking）

代码不能像文章那样按段落切，需要考虑语义完整性：

### 切分策略

| 策略 | 优点 | 缺点 |
| --- | --- | --- |
| 固定 token 数 | 简单 | 可能切断函数 |
| 按行数 | 简单 | 同上 |
| 按函数 / 类（AST） | 语义完整 | 函数过大时不适用 |
| 按文件 | 完整上下文 | 文件过大塞不进 |
| 滑动窗口 + 重叠 | 不漏边界 | 冗余存储 |

**实践**：用 AST 解析（如 tree-sitter）按函数 / 类切，大文件再拆；保留 import 与导出签名作为元数据。

### 元数据

每个 chunk 附带元数据，便于过滤：

\`\`\`json
{
  "content": "export function add(a, b) { ... }",
  "file": "src/utils/math.js",
  "line": 12,
  "language": "javascript",
  "symbols": ["add"],
  "type": "function"
}
\`\`\`

## 2. Embedding

把文本转成向量，便于相似度检索。

### 代码专用 Embedding 模型

- **Voyage Code**：Anthropic 推出的代码 embedding。
- **OpenAI text-embedding-3**：通用 + 代码都不错。
- **BGE / jina-embeddings-v2-code**：开源可自部署。
- **Nomic Embed**：开源，长上下文。

### 维度与存储

- 维度通常 768~1536。
- 大型代码库（百万 chunk）需要专业向量库：Pinecone、Weaviate、Milvus、Qdrant、Chroma。
- 中小型可用 pgvector（PostgreSQL 扩展）。

## 3. 检索

### 纯向量检索的问题

向量检索是**语义相似**，但代码场景常需要**精确匹配**：

- 想找所有 \`useState\` 的用法 → 向量检索可能漏掉。
- 找某个函数名的定义 → 精确匹配更准。

### 混合检索（Hybrid Search）

\`\`\`
向量检索（语义相似）  ┐
                    ├─→ 融合排序 → top-K
关键词检索（BM25）   ┘
\`\`\`

- **向量**：找"做类似事情"的代码。
- **BM25**：找"提到具体名字"的代码。
- **融合**：用 RRF（Reciprocal Rank Fusion）合并。

### 重排（Re-ranking）

检索 top-50 后，用更精细的模型（如 Cohere Rerank、cross-encoder）重新打分，取 top-5。

## 4. 代码特有的检索方式

### 符号检索（LSP）

借用语言服务器（TypeScript Language Server、tsserver）的能力：

\`\`\`
"找 add 函数的所有调用处" → LSP find references
"找 User 类的定义" → LSP go to definition
\`\`\`

精确且语义准确，但需要为每种语言单独集成。

### AST / 结构化检索

\`\`\`
"找所有 try-catch 中调用了 fetch 的代码"
→ 解析 AST → 匹配模式
\`\`\`

### 文件路径检索

简单但有效——找 \`utils/\` 下的所有文件。

## 5. 上下文组装

检索到的 chunk 需要合理组装到 prompt：

\`\`\`
你是一名资深工程师，请基于以下代码回答问题。

## 相关代码

### src/utils/math.js:12
\`\`\`js
export function add(a, b) { return a + b }
\`\`\`

### src/utils/math.js:25
\`\`\`js
export function multiply(a, b) { ... }
\`\`\`

## 问题

add 函数在哪里被调用？
\`\`\`

要点：
- 标注**文件路径与行号**，便于模型引用与用户溯源。
- 控制 token 总量，避免超窗口。
- 优先级排序：最相关的放前面 / 后面（首尾效应）。

## 6. 评估 RAG 效果

### 检索质量

- **Recall@K**：top-K 中是否包含正确答案。
- **MRR**（Mean Reciprocal Rank）：正确答案的排名倒数。

### 生成质量

- **忠实度**（Faithfulness）：答案是否基于检索内容，不幻觉。
- **答案相关性**：是否回答了问题。
- **上下文相关性**：检索是否精准（不塞无关内容）。

工具：RAGAS、TruLens、LangSmith。

## 实际应用

### Cursor 的 @codebase

输入 \`@codebase\` 触发全仓库 RAG：

\`\`\`
问题 → 向量检索 + BM25 → top-K 文件 → 注入上下文 → 模型回答
\`\`\`

### Sourcegraph Cody

强项是企业级代码检索，结合 Sourcegraph 的代码图谱。

### Continue 自建 RAG

可对接本地代码库，构建私有索引。

## 挑战

1. **代码与自然语言差异**：通用 embedding 模型对代码理解弱。
2. **依赖关系**：单个函数依赖类型、import，单 chunk 不够。
3. **版本演进**：代码库频繁变化，索引需实时更新。
4. **多语言**：不同语言需不同处理。
5. **大型 monorepo**：索引构建与查询性能挑战。

## 总结

RAG 是让 AI 编程工具"看懂你代码库"的核心技术。代码 RAG 与文档 RAG 的关键差异在于**切分方式、检索策略（混合检索 + LSP）、上下文组装**。理解 RAG 不仅有助于用好 AI 工具，也是构建企业级 AI 应用的必备能力。`
  },
  {
    id: 'ai-007',
    category: 'aicode',
    title: '如何写好 .cursorrules / CLAUDE.md 等项目规则文件？',
    difficulty: '简单',
    tags: ['cursorrules', 'CLAUDE.md', '项目规则', '实践'],
    answer: `## 这些文件是什么

AI 编程工具读取的**项目级规则文件**，相当于给 AI 一份"项目说明书"，让它生成符合你项目风格的代码。

| 文件 | 工具 |
| --- | --- |
| \`.cursorrules\` | Cursor |
| \`.windsurfrules\` | Windsurf |
| \`CLAUDE.md\` | Claude Code |
| \`.github/copilot-instructions.md\` | GitHub Copilot |
| \`.continue/config.yaml\` 中的 instructions | Continue |

> 趋势：MCP 与 IDE 正在统一为"项目记忆"概念（如 Cursor 的 \`.cursor/rules/\`、Claude Code 的 \`CLAUDE.md\` 嵌套）。

## 为什么重要

1. **一致性**：所有 AI 生成的代码遵循同一风格。
2. **避免错误**：明确禁止事项（如"不要用 any"）。
3. **减少重复说明**：不用每次对话都强调风格。
4. **团队对齐**：规则文件入 Git，团队共享。

## 写好规则文件的核心原则

### 1. 简洁、明确、可执行

❌ 模糊：
\`\`\`
写干净的代码，遵循最佳实践。
\`\`\`

✅ 具体：
\`\`\`
- 使用 Vue3 <script setup> 语法，不要用 Options API。
- 函数名用 camelCase，常量用 UPPER_SNAKE_CASE。
- 每个函数不超过 50 行，超过则拆分。
\`\`\`

### 2. 给"是什么"而非"怎么做"

❌ 长篇大论：
\`\`\`
当你要创建一个组件时，先用 vue create，然后...
\`\`\`

✅ 声明式：
\`\`\`
组件放在 src/components/，每个组件一个 .vue 文件，使用 <script setup>。
\`\`\`

### 3. 结构化

用清晰的标题分区：

\`\`\`markdown
# 项目规则

## 技术栈
- Vue 3 + TypeScript + Vite
- 状态管理：Pinia
- 样式：UnoCSS

## 代码风格
- 使用 <script setup lang="ts">
- 使用 Composition API
- 禁止使用 any

## 目录结构
- src/components/  通用组件
- src/views/       页面
- src/composables/ 组合式函数
- src/api/         接口请求

## 命名规范
- 组件：PascalCase
- 文件：kebab-case（组件文件用 PascalCase）
- 变量：camelCase

## 禁止事项
- 不要引入 jQuery
- 不要直接操作 DOM，用 ref
- 不要在 template 中写复杂逻辑
\`\`\`

## 推荐内容板块

### 1. 技术栈与版本

\`\`\`
- Vue 3.4 + TypeScript 5.x
- Vite 5 + UnoCSS
- Node 20+
- 包管理：pnpm
\`\`\`

### 2. 代码风格

\`\`\`
- 优先 Composition API + <script setup>
- 用 ref/reactive，避免 reactive 大对象
- props 用 defineProps + withDefaults
- 事件用 defineEmits
\`\`\`

### 3. 目录与文件命名

\`\`\`
- 组件文件：PascalCase（UserCard.vue）
- 普通 ts 文件：camelCase（userUtils.ts）
- 页面：src/views/[module]/[Page].vue
\`\`\`

### 4. 测试与提交

\`\`\`
- 测试框架：Vitest
- 提交前运行：pnpm test && pnpm lint
- commit message 用 Conventional Commits（feat: / fix: / chore:）
\`\`\`

### 5. 业务约定

\`\`\`
- 接口请求统一通过 src/api/request.ts 的 request 方法
- 错误处理用 ElMessage.error 提示
- 列表分页固定为 10/20/50
\`\`\`

### 6. 禁止事项

\`\`\`
- 不要用 var
- 不要直接 mutate props
- 不要在 template 中用 v-if 与 v-for 同时作用于同一元素
\`\`\`

## 嵌套规则（Claude Code / Cursor 新版）

支持按目录加载规则：

\`\`\`
project/
├── CLAUDE.md              ← 全局规则
├── src/
│   ├── CLAUDE.md          ← src 目录规则
│   └── components/
│       └── CLAUDE.md      ← 组件规则
\`\`\`

Agent 进入某目录时会自动读取该目录及父级的规则文件。

## 动态规则（Cursor .cursor/rules/）

Cursor 支持按条件触发的规则文件：

\`\`\`yaml
# .cursor/rules/vue-component.mdc
description: Vue 组件规则
globs: ["src/components/**/*.vue"]
alwaysApply: false
---

组件必须使用 <script setup lang="ts">...
\`\`\`

当编辑匹配的文件时才加载该规则，节省上下文。

## 反模式

### 1. 规则过多

塞几百行规则 → 占满上下文、互相冲突、模型反而记不住。**控制在 100 行以内**，把次要规则放按需触发的子文件。

### 2. 过于抽象

"代码要有良好的可读性"——模型无法据此判断具体行为。

### 3. 与 lint 工具重复

ESLint / Prettier 已经能强制的，不必写进规则。规则应写**工具无法强制的**业务约定与架构选择。

### 4. 写完不维护

代码库演进，规则文件却没更新，反而误导 AI。**规则文件应随项目一起演进**，PR 时同步更新。

## 实用技巧

1. **从 review 反馈中提炼**：每次纠正 AI 的错误，就把规则加进文件。
2. **给示例**：复杂规则附一个正例与反例。
3. **分层**：核心规则全局加载，边缘规则按目录加载。
4. **测试**：故意问 AI 一个会触发规则的问题，看它是否遵守。

## 总结

项目规则文件是 AI 编程时代的".editorconfig + ESLint + 团队 Wiki"集合体。写好它，能让 AI 持续产出符合团队标准的代码，是 AI 编程 ROI 最高的一笔投入。`
  },
  {
    id: 'ai-008',
    category: 'aicode',
    title: 'AI 生成代码的安全风险与防范？',
    difficulty: '中等',
    tags: ['安全', '代码安全', '幻觉', '合规'],
    answer: `## 主要风险类型

### 1. 引入漏洞代码

LLM 训练数据包含历史漏洞代码，可能复刻 OWASP Top 10：

\`\`\`js
// AI 生成的"看似正确"的 SQL
db.query(\`SELECT * FROM users WHERE name='\${name}'\`)  // ❌ SQL 注入

// AI 可能生成 eval
eval(userInput)  // ❌ XSS / 代码注入
\`\`\`

### 2. 幻觉 API

- 调用不存在的库 / 函数。
- 用了错误的方法签名（参数顺序、类型）。
- 引用已被废弃的 API。

### 3. 泄露密钥

- 把 API key、token 写进代码（甚至提交到 Git）。
- 把密钥通过 prompt 发送给云端 LLM（数据外泄）。

### 4. 知识产权风险

- 模型可能"背诵"训练集中的 GPL / 私有代码片段。
- 引入不兼容的开源协议代码。

### 5. 隐私数据外泄

把业务数据、用户隐私、内部代码作为 prompt 发送给第三方 LLM API，可能违反 GDPR、合规要求。

### 6. 过度依赖

- 开发者不 review 直接使用 → bug 进生产。
- 安全审计流于形式。

## 防范措施

### 1. 代码审查（最关键）

- **所有 AI 生成代码必须经过人工 review**，等同同事 PR。
- 重点检查：边界条件、错误处理、安全敏感操作（SQL、命令执行、文件读写）。

### 2. 静态扫描

接入 SAST / SCA 工具：

- **SonarQube / CodeQL**：漏洞模式扫描。
- **Snyk / Dependabot**：依赖漏洞检测。
- **Semgrep**：自定义规则扫描 AI 易犯的错误模式。

### 3. 秘密扫描

- **GitGuardian / TruffleHog**：检测代码与提交中的密钥。
- 提交前 hook 拦截。

### 4. 沙箱执行

- Agent 执行命令、运行代码在沙箱（容器、VM）中。
- 限制文件系统、网络、进程权限。

### 5. 数据合规

- 敏感项目用**自托管模型**或**企业版**（不训练、不留存）。
- Copilot Enterprise、Claude Enterprise 提供数据隔离。
- 对 prompt 脱敏：去掉真实用户数据、密钥、内部业务逻辑。

### 6. 协议合规

- 配置 AI 工具的代码过滤（如 Copilot 可限制建议源于开源协议）。
- 大型项目设法律审核流程。

### 7. 输出验证

- 关键代码（加密、认证、支付）必须用**测试**验证，不轻信 AI。
- 用 property-based testing 检查不变量。

### 8. 团队规范

- 制定 AI 代码使用政策：哪些场景可用、必须 review、必须测试。
- 标记 AI 生成代码（commit message / PR 标签）便于追溯。
- 定期安全培训，让开发者了解 AI 代码的典型陷阱。

## 典型案例与陷阱

### 陷阱 1： confidently wrong

AI 用非常确定的语气生成错误代码：

\`\`\`js
// AI：localStorage 在 SSR 中也可用
localStorage.getItem('token')  // ❌ SSR 下 localStorage 未定义
\`\`\`

→ 必须在目标环境实测。

### 陷阱 2： 编造依赖

\`\`\`js
import { debounce } from 'lodash-next'  // ❌ 这个包不存在
\`\`\`

→ 安装前确认包存在、来源可信。

### 陷阱 3： 错误的加密实现

AI 可能给出"看起来对"的加密，实际强度不足或随机数不安全。

→ 涉及安全的关键代码用成熟库，不自己实现。

### 陷阱 4： 移除必要的安全检查

为简化代码，AI 可能"顺手"删掉原本的权限校验、输入验证。

→ review 时对比 diff，留意被删除的代码。

## 工具链建议

\`\`\`
AI 生成代码
   ↓
pre-commit hook：lint + 秘密扫描
   ↓
PR：人工 review + SAST 扫描
   ↓
CI：测试 + 依赖扫描 + 安全审计
   ↓
合并到主分支
\`\`\`

## 企业级落地

1. **统一工具**：用企业版（数据隔离、合规、可审计）。
2. **白名单模型**：只允许审慎选择的 LLM。
3. **审计日志**：记录谁用了 AI、生成了什么、合并到哪。
4. **培训**：让团队知道风险与最佳实践。
5. **度量**：跟踪 AI 代码的 bug 率、安全事件率。

## 总结

AI 生成代码的安全风险**本质与人写代码相同**，但有两个特殊性：① 速度更快，漏洞产出更快；② 表面更"像对的"，更容易蒙混过 review。防范的核心是**不放弃人工把关**，并把传统安全工具链（SAST/SCA/秘密扫描）与 AI 工作流深度结合。`
  },
  {
    id: 'ai-009',
    category: 'aicode',
    title: '如何评估 AI 编程工具的效果与 ROI？',
    difficulty: '中等',
    tags: ['评估', 'ROI', '指标', '度量'],
    answer: `## 为什么需要评估

- 工具采购决策：贵不贵？值不值？
- 团队推广：哪些场景有效？哪些反而拖累？
- 持续改进：用了 3 个月，效率到底提升了吗？

## 评估维度

### 1. 效率（Productivity）

| 指标 | 说明 |
| --- | --- |
| PR 周期 | 从开分支到合并的时间 |
| 代码提交频率 | 单位时间 commit / PR 数 |
| 任务完成数 | Sprint 完成的 story point |
| 首次响应时间 | AI 补全首次出现的延迟 |
| AI 建议采纳率 | 显示的补全中接受的比例 |

**注意**：单看"代码行数"会误导——AI 可能生成冗余代码。

### 2. 质量（Quality）

| 指标 | 说明 |
| --- | --- |
| Bug 率 | 上线后 bug 数 / 代码量 |
| PR 改动次数 | review 后需要的修改次数 |
| 测试覆盖率 | 是否下降 |
| 回归缺陷率 | 引入新 bug 的频率 |
| 静态扫描告警数 | AI 代码是否更易触发告警 |

### 3. 开发者体验（DX）

- NPS 评分：是否推荐给同事。
- 满意度调研：减少 / 增加了哪些痛点。
- 主观效率感受（与客观数据对比）。
- 中断与心流：是减少切换还是更频繁打断？

### 4. 成本（Cost）

- 工具订阅费（每人每月）。
- API 调用费用（按 token）。
- 集成与维护成本。
- 培训成本。

### 5. 安全与合规

- 数据外泄事件数。
- 引入漏洞数。
- 协议合规事件数。

## 评估方法

### 1. A/B 测试

把团队分两组：

- 对照组：不用 AI 工具。
- 实验组：用 AI 工具。

对比 PR 周期、bug 率等指标。注意：

- 控制变量（任务难度、成员水平）。
- 时间够长（至少 1~2 个月，避免新奇效应）。
- GitHub Copilot 研究：实验组完成相同任务快 55%。

### 2. 前后对比

同一团队引入工具前后的指标对比。

陷阱：同时期可能有其他变化（流程、人员），需归因分析。

### 3. 任务级实验

给开发者相同任务，分别用 / 不用 AI 完成，记录时间与质量。

适合小范围试点，难以大规模执行。

### 4. 调研与访谈

定量数据 + 定性反馈：

- 哪些场景最有用？（补全、重构、查 API）
- 哪些场景反而拖累？（错误引导、调试 AI 代码）
- 哪些功能希望改进？

## 实战指标模板

\`\`\`
每周采集：
- AI 补全采纳率：xx%
- 平均 PR 周期：xx 天（对照基线：yy 天）
- AI 代码占比：xx%（按行数 / commit 标记）
- Bug 率：xx 个/千行（基线：yy）
- 工具成本：xx 元/人/月

每月汇总：
- 开发者 NPS：xx
- 任务完成数：xx（同比 +/- x%）
- 安全事件：xx 起
\`\`\`

## 标识 AI 代码

为评估精准，需标记哪些代码来自 AI：

- **commit message**：\`feat: add login (ai-assisted)\`。
- **PR 标签**：\`ai-generated\`。
- **工具自动标记**：部分 IDE 可记录补全来源。
- **行级标记**：在 git blame 中标注（实验性）。

## 评估陷阱

### 1. 只看采纳率

高采纳率不一定意味着效率高——可能是开发者只接受简单补全，反而打断思路。

### 2. 只看短期

新工具上线头几周效率可能下降（学习曲线），3 个月后才开始收益。

### 3. 忽略隐性成本

调试 AI 错误代码、review AI PR 的时间，常常被忽略。

### 4. 幸存者偏差

只收集"成功用 AI 完成"的案例，忽略"AI 搞砸了，重写更慢"的情况。

### 5. 不分层级

AI 对初级开发者效率提升大，对资深者可能中性甚至负面（打断心流）。一刀切评估会掩盖差异。

## 行业基准（参考）

GitHub 2023 研究（Copilot）：
- 任务完成速度快 55%。
- 78% 开发者觉得更专注。
- 87% 觉得心智负担减轻。

但 2025 年一些反向研究（如 METR）显示：熟悉代码库的老手用 AI 反而略慢——因为需要校对 AI 输出。

## 落地建议

1. **先小范围试点**（1~2 个团队，1 个月）。
2. **明确度量指标**与基线。
3. **定期复盘**，调整工具与工作流。
4. **不要追求"全员使用率"**——某些场景、某些人 AI 收益低。
5. **关注长期质量**，而非短期速度。

## 总结

AI 编程工具的评估应多维（效率 / 质量 / DX / 成本 / 安全）、多方法（A/B、前后对比、调研）、长期化（避免新奇效应）。最关键是**标记 AI 代码 + 对照基线**，否则一切"感觉变快了"都是空谈。`
  },
  {
    id: 'ai-010',
    category: 'aicode',
    title: 'AI 编程对开发者技能与工作流的影响？',
    difficulty: '中等',
    tags: ['开发者', '工作流', '技能', '职业'],
    answer: `## 工作流的变化

### 传统工作流

\`\`\`
理解需求 → 查文档/StackOverflow → 写代码 → 调试 → 测试 → review
\`\`\`

### AI 时代工作流

\`\`\`
理解需求 → 描述给 AI → 校对 AI 生成 → 调试 → 测试 → review
   ↑                                      ↓
   └────── 反馈给 AI 修正 ←───────────────┘
\`\`\`

变化点：
1. **从"写"到"读 + 校对"**：核心技能从产出代码变成评估代码。
2. **从"搜"到"问"**：查 API 不再 Google，直接问 AI。
3. **从"调试代码"到"调试 prompt"**：AI 输出不对时，先调 prompt 再调代码。
4. **更高的抽象**：从"实现函数"到"描述系统行为"。

## 技能的此消彼长

### 在贬值的技能

- **样板代码编写**：CRUD、表单、配置。
- **API 用法记忆**：不需要记 \`Array.prototype.flatMap\` 的参数。
- **基础语法**：AI 写得又快又对。
- **简单正则 / SQL**：AI 写得更好。

### 在升值的技能

1. **系统设计**：AI 不懂全局架构，需人来定。
2. **需求拆解**：把模糊需求拆成 AI 可执行的任务。
3. **代码评审**：评估 AI 代码的正确性、安全性、可维护性。
4. **调试**：复杂 bug AI 也搞不定，靠人对系统的理解。
5. **领域知识**：业务逻辑、行业经验是 AI 的盲区。
6. **沟通协作**：与产品、测试、运维的协作，AI 替代不了。
7. **AI 协作能力**：会写 prompt、会用 Agent、会搭工具链。

## 新的"必备技能"

### 1. Prompt Engineering

清晰描述意图：

❌ "做个登录页"
✅ "用 Vue3 + Element Plus 做登录页，包含手机号 + 密码字段，提交前做正则校验，错误用 ElMessage 提示，调用 \`/api/login\` 接口"

### 2. Context Engineering

知道给 AI 喂什么上下文：

- 引用相关文件（@file）
- 提供类型定义
- 说明项目约定（.cursorrules）
- 给出示例

### 3. 校对能力

快速判断 AI 代码是否正确：

- 看逻辑是否符合需求。
- 看边界条件是否处理。
- 看是否引入安全风险。
- 看是否符合架构规范。

### 4. 调试 AI

AI 输出错误时：

- 判断是 prompt 不清还是模型能力不足。
- 给 AI 反馈具体问题，让它修正。
- 必要时自己上手改。

## 不同层级的差异

### 初级开发者

**机遇**：
- 快速学习（AI 像私人导师）。
- 减少查文档时间。
- 完成超出自己水平的任务。

**风险**：
- 不再深究原理，基础不牢。
- 盲目信任 AI，无法识别错误。
- 失去"从做中学"的训练机会。

**建议**：用 AI 之前先自己想 5 分钟，写一版粗糙的；再让 AI 改进；对比差异学习。

### 中级开发者

**机遇**：
- 效率显著提升。
- 跳过琐碎工作，专注设计。
- 接触更多技术栈。

**风险**：
- 陷入"工具人"——会调 AI 但不会从 0 设计。
- 对工具依赖加深，换工具就低效。

### 资深开发者

**机遇**：
- 把经验编码成规则（.cursorrules），放大影响力。
- 用 Agent 自动化重复工作。
- 跳出细节，专注架构与方向。

**风险**：
- 对最新具体 API 不熟（AI 更熟）。
- 需要重新定位自己的价值。

## 对团队的影响

### 正面

- **拉平水平差异**：初级能写中级代码，团队下限提高。
- **加速知识流动**：新人问 AI 比问同事快。
- **减少低效会议**：很多讨论可由 AI 解答。

### 负面

- **同质化**：大家都用 AI，代码风格趋同但也趋同地错。
- **代码所有权模糊**：这段代码到底谁写的？谁负责？
- **review 负担加重**：PR 量大、AI 代码需仔细看。
- **隐式知识流失**：不写文档的人更依赖 AI，但 AI 不知道项目历史。

## 心智与职业建议

### 1. 把 AI 当同事，不是替代品

它会犯错、会偷懒、会编造。该 review 还是 review，该测试还是测试。

### 2. 投资不可替代的能力

- 系统设计、领域知识、沟通、判断力。
- 这些是 AI 短期内无法替代的。

### 3. 保持"能从零写"的能力

定期不靠 AI 写一些代码，保持肌肉记忆与深度理解。

### 4. 学会"教 AI"

写好规则、维护好文档、给好示例——这些投入会持续放大。

### 5. 拥抱变化但不焦虑

工具会变，但**解决问题**的核心能力不变。焦虑被替代，不如学习用得更好。

## 一些常见误解

### 1. "AI 会取代程序员"

短期内不会。它替代的是"重复性编码"，不是"软件工程"。复杂系统、需求沟通、运维仍需要人。

### 2. "会用 AI 就够了"

会用是基础，会用好是进阶，能判断与改进是核心。

### 3. "AI 让编程变简单"

让"写出代码"变简单，但让"做出好系统"更难——因为速度加快，错误也加快，对判断力的要求更高。

## 总结

AI 编程改变了**怎么写代码**，没改变**为什么写代码**。开发者应当：拥抱 AI 提升效率，同时投资"AI 替代不了"的能力——系统思维、领域深度、判断力、沟通协作。把 AI 当作放大器：放大你的优势，也放大你的盲点。`
  },
  {
    id: 'ai-011',
    category: 'aicode',
    title: '什么是 Vibe Coding？AI-first 开发模式是怎样的？',
    difficulty: '中等',
    tags: ['Vibe Coding', 'AI-first', '开发模式', '趋势'],
    answer: `## Vibe Coding 的由来

2025 年 Andrej Karpathy 提出 "Vibe Coding"——一种**以自然语言为主、AI 生成为主、人工校对为辅**的编程风格：

> "你完全顺着自己的感觉（vibe），让 AI 写代码。能跑就跑，跑不动就让 AI 修。看不懂的代码也让 AI 解释。"

核心特征：
- 主要交互方式是**对话**，不是键入。
- 接受"不完全理解每一行代码"。
- 重视**结果**而非**过程**。
- 适合原型、玩具项目、一次性脚本。

## Vibe Coding 的典型流程

\`\`\`
1. 用自然语言描述："做个 Todo List，能拖拽排序"
2. AI 生成完整代码
3. 运行，发现 bug
4. 把错误截图 / 日志贴给 AI
5. AI 修复
6. 重复 3-5 直到能用
\`\`\`

## 与传统 AI 辅助编程的区别

| | AI 辅助编程 | Vibe Coding |
| --- | --- | --- |
| 主导方 | 人写、AI 补全 | AI 主写、人校对 |
| 代码理解度 | 高（每行都过目） | 可低（接受黑盒） |
| 适用场景 | 生产代码、严肃项目 | 原型、个人项目、一次性脚本 |
| Review 严格度 | 严格 | 宽松甚至跳过 |
| 心智模型 | 工程师 | "产品经理 + 验收者" |

## 何时适合 Vibe Coding

✅ 适合：
- 个人玩具 / Demo / Hackathon。
- 一次性脚本（数据清洗、批量处理）。
- 学习新技术（让 AI 写示例，跑起来感受）。
- 不打算长期维护的代码。

❌ 不适合：
- 生产环境关键代码。
- 安全敏感（支付、认证、医疗）。
- 长期维护的产品。
- 团队协作项目（其他人看不懂）。

## AI-first 开发模式

比 Vibe Coding 更系统化的方法论——**项目从一开始就围绕 AI 能力设计**。

### 1. 设计阶段

- 不只设计功能，还设计**如何让 AI 理解项目**。
- 写好 \`CLAUDE.md\` / \`.cursorrules\` 与文档。
- 把架构、约定、禁忌明确化。

### 2. 编码阶段

- 用 Agent 模式处理"明确边界"的任务（"实现登录模块，遵循 X 规范"）。
- 用补全处理"细节填充"（写完函数签名后让 AI 写实现）。
- 用 Chat 处理"探索性问题"（"这个库怎么用？"）。

### 3. 测试阶段

- 让 AI 写测试用例（包括边界）。
- 用 AI 跑测试、读日志、修复。
- Property-based testing 让 AI 难以"凑出通过用例"。

### 4. Review 阶段

- AI 先 self-review（"找出这段代码的潜在问题"）。
- AI 互审（用一个 Agent review 另一个 Agent 的输出）。
- 人工 review 关键路径与业务逻辑。

### 5. 维护阶段

- AI 监控告警，自动归因。
- AI 协助 hotfix，先生成测试再修复。
- 文档随代码演进（AI 提取变更点）。

## AI-first 的关键原则

### 1. 文档先行

> 在 AI 时代，文档不是写给人看的，是写给 AI 看的。

\`\`\`
ADR（架构决策记录）+ API 文档 + 项目规则 + 提交信息
\`\`\`

这些"机器可读上下文"决定 AI 能否正确理解项目。

### 2. 小步快走

不要让 AI 一次写 1000 行。拆成小任务：

\`\`\`
1. 先建目录结构
2. 写类型定义
3. 写工具函数 + 测试
4. 写主流程
5. 写 UI
\`\`\`

每步验证后再推进。

### 3. 反馈闭环

\`\`\`
让 AI 写 → 跑 → 报错 → 让 AI 修 → 跑 → ...
\`\`\`

快速反馈比"想清楚再写"更重要——AI 修正成本低。

### 4. 抽象层级提升

不再纠结变量名、缩进——交给 AI。专注：
- 系统边界。
- 数据流。
- 不变量。
- 风险点。

### 5. 拥抱"足够好"

生产代码追求 80 分（够用、可维护），不追求 100 分（极致优雅）。AI 帮你快速到 80 分。

## 工作流示例（Cursor + Claude Code）

\`\`\`
1. Claude Code：探索代码库，生成"如何实现 X 功能"的方案
2. 人 review 方案，确认
3. Claude Code：按方案分步实现，写测试
4. 人跑测试，确认通过
5. Cursor：进入文件做细节调整、补全
6. 人 review 整体 diff
7. 提交 PR，AI 生成 PR 描述
8. CI 跑测试 + 静态分析
9. 合并
\`\`\`

## 风险与反思

### 1. "技术债加速"

Vibe Coding 容易产出"能跑但烂"的代码，长期维护成本高。

### 2. "理解债"

不读代码就上线，bug 来了不知道怎么修。

### 3. "依赖陷阱"

习惯了 AI，离了 AI 写不动代码。

### 4. "评估困难"

代码是 AI 写的，怎么评估工程师的贡献？

### 5. "责任归属"

AI 写的代码出 bug，谁负责？开发者、AI 厂商、还是公司？

## 平衡之道

- **生产代码**：AI-first 但严格 review + 测试 + 文档。
- **原型 / 工具**：Vibe Coding 快速试错。
- **学习**：先 AI 看，再自己写一遍理解。
- **关键路径**：人主导，AI 辅助；非关键路径：AI 主导，人监督。

## 总结

Vibe Coding 是一种**风格**——快速、宽松、结果导向；AI-first 是一种**方法论**——围绕 AI 能力设计整个开发流程。两者代表了编程从"手工艺"向"指挥 + 校对"演化的趋势。但**对系统的理解与判断力**始终是工程师的核心价值——AI 越强，这反而越值钱。`
  },
  {
    id: 'ai-012',
    category: 'aicode',
    title: '如何用 AI 工具做代码重构、写测试、做 Code Review？',
    difficulty: '中等',
    tags: ['重构', '测试', 'Code Review', '实践'],
    answer: `## 一、用 AI 做代码重构

### 适合 AI 的重构场景

1. **机械式重构**：重命名、改 API、统一风格。
2. **模式应用**：把回调改成 Promise、把 class 改成 hooks。
3. **拆分大函数 / 大文件**：按职责拆分。
4. **提取组件 / 工具函数**：识别重复逻辑。
5. **类型补全**：给 JS 加 TS 类型。

### 工作流

\`\`\`
1. 让 AI 先分析现状（"读这个文件，总结它的问题"）
2. 让 AI 提出重构方案（"列出 3 种重构思路 + 利弊"）
3. 选定方案后让 AI 分步执行
4. 每步运行测试，确认行为不变
5. 人工 review 关键改动
\`\`\`

### 示例 prompt

\`\`\`
重构 src/utils/legacy.js：
- 它有 500 行，职责混杂。
- 把日期处理拆到 dateUtils.ts，字符串处理拆到 stringUtils.ts。
- 保持导出 API 不变，避免影响调用方。
- 每个函数加 JSDoc。
- 先列出计划，等我确认再执行。
\`\`\`

### 关键原则

- **小步推进**：不要让 AI 一次重构整个文件，分 5~10 个 commit。
- **保持测试通过**：每步后跑测试，行为不变是底线。
- **保留 diff 可读**：让 AI 用最小改动，不要顺手"美化"无关代码。
- **关键处人工介入**：架构性决策不交给 AI。

### 不适合 AI 的重构

- 涉及业务语义的（"这个状态机要重新设计"）。
- 跨多服务、多仓库的。
- 性能优化涉及测量与剖析的。

## 二、用 AI 写测试

### 适合的场景

1. **单元测试**：纯函数、工具方法。
2. **组件测试**：UI 交互、props / emit。
3. **集成测试**：模块组合。
4. **边界用例**：让 AI 列举容易漏的边界。
5. **回归测试**：bug 修复后写防止回归的用例。

### 工作流

\`\`\`
1. 给 AI 看被测代码 + 已有用例（保持风格一致）
2. 让 AI 先列举测试场景
3. 确认后让 AI 写具体用例
4. 跑测试，把失败的反馈给 AI 修
5. 检查覆盖率，补漏
\`\`\`

### 示例 prompt

\`\`\`
为 src/utils/format.ts 中的 formatPrice 函数写测试：
- 用 Vitest。
- 风格参考 tests/utils/format.test.ts。
- 覆盖正常值、负数、0、小数、超长数字、非数字输入。
- 每个用例用 it('should ...') 描述。
\`\`\`

### 让 AI 帮你发现盲点

\`\`\`
"基于这段代码，列出 10 个容易遗漏的边界场景，
按风险从高到低排序，并解释每个场景的潜在 bug。"
\`\`\`

AI 常能想到开发者忽略的：时区、闰年、Unicode、空字符串、循环引用、并发等。

### 测试质量检查

AI 写的测试常见问题：
- **断言过弱**：只测"不抛错"，不测具体值。
- **冗余用例**：10 个用例测同一件事。
- **依赖实现细节**：测私有方法、调用顺序。
- **mock 过多**：测的是 mock 不是代码。

review 时重点看这些。

### Property-based Testing

\`\`\`
"用 fast-check 写 property test：
对于任意数字 x，formatPrice(x) 的结果应能被 parsePrice 解析回 x。"
\`\`\`

让 AI 生成不变量，比具体用例更能发现 bug。

## 三、用 AI 做 Code Review

### AI Review 的优势

- **速度快**：PR 一开就出评论。
- **覆盖广**：每行都看，不会疲倦。
- **一致性**：规则统一，不会因心情遗漏。
- **跨语言 / 跨仓库**：人难精通所有栈，AI 可以。

### 典型能力

1. **找 bug**：逻辑错误、边界遗漏、null 引用。
2. **安全审计**：SQL 注入、XSS、密钥泄露、不安全依赖。
3. **风格一致性**：命名、结构、约定。
4. **性能**：N+1 查询、不必要的重渲染、内存泄漏。
5. **可维护性**：函数过长、耦合过重、缺文档。
6. **测试覆盖**：是否漏测关键路径。

### 工具集成

| 工具 | 形式 |
| --- | --- |
| **GitHub Copilot Code Review** | PR 自动评论 |
| **Cursor Agent** | 在 PR 视图让 Agent review |
| **CodeRabbit** | 独立 AI review 服务 |
| **Claude Code** | 命令行调用 \`review PR #123\` |
| **自建**：用 LLM API + GitHub Webhook | 定制化 |

### 实践工作流

\`\`\`
1. 开发者提 PR
2. CI 触发 AI review（自动评论）
3. 开发者先回应 AI 意见
4. 人工 reviewer 看 AI 已发现的问题 + AI 漏掉的
5. 合并
\`\`\`

### 让 AI Review 更有效

1. **给上下文**：不只看 diff，给 AI 看相关文件、架构约定、PR 描述。
2. **设规则**：自定义 review 标准（"我们项目禁止 any"）。
3. **分级**：critical / warning / nitpick 分开，避免噪音。
4. **闭环**：AI 意见要有"已修复 / 不修复（说明原因）"的回应。
5. **学习**：把人工 reviewer 的反馈喂回 AI，让它越用越准。

### 局限

- **不懂业务**：业务逻辑对错 AI 难判断。
- **架构盲区**：跨 PR、跨服务的长期影响 AI 看不到。
- **误报**：可能挑无关紧要的"问题"，制造噪音。
- **被绕过**：开发者学会"写让 AI 看不出问题的烂代码"。

### AI Review 不能替代人

人 reviewer 不可替代的价值：
- 业务正确性判断。
- 架构合理性。
- 团队约定的隐式知识。
- "这段代码为什么这样写"的历史。
- 培养新人（review 是教学场景）。

最佳模式：**AI 先扫一遍**（找机械问题），**人专注高价值判断**。

## 通用最佳实践

### 1. 始终给 AI 上下文

\`\`\`
- 当前文件 + 相关类型定义
- 项目规则文件
- 已有的同类代码（保持风格）
- 测试文件（说明测试约定）
\`\`\`

### 2. 让 AI 解释"为什么"

不只是让 AI 写，还要它解释：

\`\`\`
"重构这段代码，并解释每个改动的理由。"
\`\`\`

解释让你能 review，也帮你学习。

### 3. 让 AI 列计划再执行

\`\`\`
"先列出重构步骤（不要执行），等我确认。"
\`\`\`

避免 AI 一通乱改，diff 难看。

### 4. 保留撤回能力

每步一个 commit，错了能回滚。不要让 AI 一次改 20 个文件。

### 5. 测试是底线

行为不变是重构的底线。让 AI 写测试 → 跑测试 → 重构 → 再跑测试。

## 总结

AI 在重构、测试、review 三个场景都能显著提效，但**核心是把 AI 当作"快速但需监督的助手"**：

- 让它干机械活、想边界、列场景。
- 人定方向、判业务、做架构决策。
- 测试与 review 是质量底线，AI 不能替代人的判断。

掌握"任务拆解、上下文提供、反馈迭代"这三招，就能把 AI 用得又快又稳。`
  },
  {
    id: 'ai-013',
    category: 'aicode',
    title: '如何用 AI 快速搭建前端项目脚手架？',
    difficulty: '中等',
    tags: ['脚手架', 'Vite', '项目初始化', '实战'],
    answer: `## 核心思路

用 AI 搭建脚手架的核心是**把"重复性初始化工作"交给 AI，把"架构决策"留给自己**。AI 擅长：目录结构、配置文件、样板代码；人擅长：技术选型、架构设计、业务约定。

## 第一步：明确需求，给 AI 清晰指令

### 示例 Prompt

\`\`\`
用 Vite + React + TypeScript 创建一个企业级前端项目脚手架，要求：

1. 目录结构：
   src/
   ├── assets/       静态资源
   ├── components/   通用组件
   ├── hooks/        自定义 hooks
   ├── pages/        页面组件
   ├── services/     API 请求封装
   ├── stores/       状态管理(Zustand)
   ├── styles/       全局样式
   ├── utils/        工具函数
   └── router/       路由配置

2. 配置：
   - ESLint + Prettier + Husky + lint-staged
   - Vitest 测试框架
   - React Router v6
   - Zustand 状态管理
   - Axios 请求封装（含拦截器、token 刷新、错误处理）
   - 路径别名 @ 指向 src/

3. 要求：
   - 用 pnpm 作为包管理器
   - 生成 .cursorrules 规则文件
   - 生成 README.md 说明文档
   - 每个配置文件加注释说明用途

先列执行计划，等我确认再动手。
\`\`\`

## 第二步：AI 执行，人工审核

### AI 通常会做的事

1. 创建目录结构
2. 写入 \`package.json\` 及依赖
3. 配置 \`vite.config.ts\`、\`tsconfig.json\`
4. 创建入口文件 \`main.tsx\`、\`App.tsx\`
5. 配置路由、状态管理、请求封装
6. 写入 \`.eslintrc.cjs\`、\`.prettierrc\`
7. 配置 Husky + lint-staged
8. 创建示例组件和页面

### 关键审核点

\`\`\`
- 依赖版本是否合适？（不要用 alpha/beta 版）
- ESLint 规则是否过于严格？（初期不宜太严）
- Axios 封装是否考虑了 token 过期自动刷新？
- 路由是否有懒加载配置？
- 路径别名是否在 tsconfig 和 vite 中都正确配置？
\`\`\`

## 第三步：补充 AI 容易遗漏的细节

### 1. 环境变量管理

\`\`\`typescript
// src/config/env.ts
const env = {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE || 'My App',
}

export default env
\`\`\`

同时创建 \`.env.development\`、\`.env.production\`、\`.env.test\`。

### 2. 请求封装（增强版）

\`\`\`typescript
// src/services/request.ts
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

interface CustomConfig extends AxiosRequestConfig {
  skipToken?: boolean
  retryCount?: number
}

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
})

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token && !(config as CustomConfig).skipToken) {
      config.headers.Authorization = \`Bearer \${token}\`
    }
    return config
  },
  (error) => Promise.reject(error)
)

request.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const { data } = await axios.post('/api/refresh', { refreshToken })
          localStorage.setItem('token', data.token)
          error.config.headers.Authorization = \`Bearer \${data.token}\`
          return request(error.config)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default request
\`\`\`

### 3. 错误边界（React Error Boundary）

\`\`\`tsx
// src/components/ErrorBoundary.tsx
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error: Error | null }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>出了点问题</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            重试
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
\`\`\`

### 4. .cursorrules 示例

\`\`\`markdown
# 项目规则

## 技术栈
- React 18 + TypeScript 5 + Vite 5
- 状态管理：Zustand
- 路由：React Router v6
- 请求：Axios
- 样式：TailwindCSS 3

## 代码风格
- 使用函数组件 + Hooks
- 禁止使用 any，必须定义类型
- Props 必须用 interface 定义
- 事件处理函数用 handle 前缀

## 目录约定
- pages/ 放路由页面
- components/ 放可复用组件，每个组件一个文件夹
- hooks/ 放自定义 hook，use 前缀
- services/ 放 API 请求，按模块分文件

## 禁止事项
- 不要直接用 axios，统一用 services/request.ts
- 不要在组件里写复杂业务逻辑
- 不要用 localStorage 存敏感信息
\`\`\`

## 第四步：验证与完善

\`\`\`bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 构建
pnpm build

# 代码检查
pnpm lint
\`\`\`

## Pro Tips

1. **先小后大**：先让 AI 搭核心结构，再逐步添加功能模块。
2. **版本锁定**：让 AI 在 package.json 中固定版本号，避免依赖冲突。
3. **模板沉淀**：把好的脚手架提交为团队模板，新项目直接复用。
4. **对比差异**：让 AI 生成后，自己手动从零搭建一次对比，加深理解。

## 常见坑

- AI 可能生成不存在的依赖包（如 \`@types/react-router\` 实际是 \`react-router-dom\`），务必核实。
- ESLint 规则太严导致 AI 自己生成的代码都过不了 lint，建议初期用宽松规则。
- 路径别名配置容易遗漏 \`jsconfig.json\` 或 \`vite-env.d.ts\` 中的配置。

## 总结

AI 搭建脚手架的价值在于**把 2 小时的初始化工作压缩到 5 分钟**，但你需要清楚地告诉 AI "要什么"和"不要什么"，并在关键架构决策上亲自把关。`
  },
  {
    id: 'ai-014',
    category: 'aicode',
    title: 'AI 辅助调试的高效技巧有哪些？',
    difficulty: '中等',
    tags: ['调试', 'Debug', '错误分析', '实战'],
    answer: `## 核心思路

调试是 AI 最能帮上忙的场景之一——因为 AI 擅长**阅读错误信息、分析堆栈、联想可能原因**。但 AI 不能运行代码，所以需要你提供充分的上下文。

## 技巧一：把错误信息完整喂给 AI

### 不要只说"报错了"

\`\`\`
❌ "这个组件报错了，帮我看看"
✅ "点击登录按钮后控制台报错：
TypeError: Cannot read properties of undefined (reading 'token')
  at LoginForm.vue:45:12
  at submit (http://localhost:5173/src/components/LoginForm.vue:45:12)
  at callWithErrorHandling (http://localhost:5173/node_modules/.vite/deps/chunk-xxx.js:1234:56)
  ..."
\`\`\`

### 有效 Prompt 模板

\`\`\`
以下是登录页的错误堆栈和相关代码，请帮我分析：

【错误信息】
TypeError: Cannot read properties of undefined (reading 'token')
  at handleSubmit (LoginForm.vue:45)

【相关代码】
// LoginForm.vue 第 40-50 行
const handleSubmit = async () => {
  const res = await login(formData)
  localStorage.setItem('token', res.data.token)
  // ...
}

【已排查】
- login 接口返回了 200
- res 不是 undefined
- 但 res.data 是 undefined

请列出可能的原因和排查步骤。
\`\`\`

## 技巧二：让 AI 分析堆栈调用链

AI 擅长从堆栈中定位问题根源：

\`\`\`
以下是生产环境的错误堆栈：

Error: Request failed with status code 500
  at createError (http://cdn.example.com/api.js:1:2345)
  at settle (http://cdn.example.com/api.js:1:3456)
  at XMLHttpRequest.onloadend (http://cdn.example.com/api.js:1:5678)
  ... 3 more frames

相关代码：
// services/userService.ts
export async function getUserInfo(id: string) {
  return request.get(\`/users/\${id}\`)
}

// stores/userStore.ts
const fetchUser = async (id: string) => {
  const user = await getUserInfo(id)
  setUser(user)
}

请分析可能的原因，并给出排查清单。
\`\`\`

AI 通常能联想到：
- 后端接口变更，返回结构变了
- 鉴权 token 过期
- 请求参数格式错误
- 中间件/代理配置问题

## 技巧三：用 AI 复现 Bug

### 描述场景 + 预期 vs 实际

\`\`\`
Bug 描述：
- 场景：用户在搜索框输入"张"，选中下拉建议中的"张三"，页面显示"张伟"的信息
- 预期：显示"张三"的信息
- 实际：显示"张伟"的信息

相关代码：
// SearchSelect.vue 选择逻辑
const handleSelect = (item: User) => {
  selectedId.value = item.id
  fetchUserDetail(item.id)
}

// API 请求
const fetchUserDetail = async (id: number) => {
  const { data } = await request.get(\`/api/users/\${id}\`)
  userDetail.value = data
}

// 接口响应示例
{ "id": 1, "name": "张三" }
{ "id": 2, "name": "张伟" }

请分析问题所在，给出修复方案。
\`\`\`

AI 可能发现：
- 下拉建议的 click 事件与 option 绑定错位
- 异步竞态：快速连续选择时，旧请求覆盖新请求
- id 类型不匹配（数字 vs 字符串）

## 技巧四：根因分析（RCA）

### 5-Why 分析法 + AI

\`\`\`
用 5-Why 分析法排查以下问题：

问题：页面刷新后用户登录状态丢失

1. 为什么登录状态丢失？
   → token 没了
2. 为什么 token 没了？
   → localStorage 被清空了
3. 为什么 localStorage 被清空？
   → 退出登录函数被意外调用
4. 为什么退出函数被意外调用？
   → 某个组件在 useEffect 中调用了退出
5. 为什么 useEffect 中调用了退出？
   → ...

以下是相关代码，请帮我完成分析并给出修复建议：

// App.vue
onMounted(async () => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      await fetchUserInfo()
    } catch {
      logout() // 这里
    }
  }
})
\`\`\`

## 技巧五：Chrome DevTools + AI 工作流

### 步骤

1. **打开 DevTools → Sources 面板**，设置断点
2. **触发 Bug**，在断点处暂停
3. **把当前变量值截图/复制给 AI**

\`\`\`
断点暂停在 LoginForm.vue:45，以下是当前作用域变量：

formData: { username: 'test', password: '123456' }
res: { data: undefined, status: 200, message: 'ok' }
res.data: undefined

接口响应（Network 面板）：
{ "code": 0, "data": { "token": "abc123" }, "message": "ok" }

注意：返回结构是 { code, data, message }，但代码直接取 res.data。
请分析问题并修复。
\`\`\`

AI 会立刻发现：代码用的是 \`res.data.token\`，但实际应该是 \`res.data.data.token\`（响应被 axios 拦截器解包了一层）。

## 技巧六：让 AI 设计调试日志

\`\`\`
帮我在以下函数中加入调试日志，要求：
1. 用 console.group 分组
2. 标记函数名、入参、返回值
3. 标记关键分支
4. 生产环境可通过 flag 开关

function processOrder(order) {
  const validated = validateOrder(order)
  if (!validated.valid) {
    return { success: false, errors: validated.errors }
  }
  const processed = calculatePrice(validated.order)
  return { success: true, total: processed.total }
}
\`\`\`

AI 通常能生成带 \`DEBUG_ORDER\` 环境变量控制的日志方案。

## 技巧七：性能调试

### 描述性能现象给 AI

\`\`\`
页面性能问题：
- 首屏加载 3.2s（目标 < 1.5s）
- Lighthouse 分数 45
- 主要耗时在：
  - Main-thread work: 2.1s
  - Longest task: 800ms
  - JS 执行: 1.2s

关键文件：
- main.js: 加载了 500KB 的 vendor chunk
- App.vue: 同步引入了 10 个页面组件
- router/index.js: 使用同步路由

请分析原因并给出优化方案。
\`\`\`

## 常见调试反模式

1. **只给截图不给文字**：AI 无法读取图片中的文字，始终复制文本错误信息。
2. **过度简化代码**：删得太多导致 AI 看不到真实上下文。
3. **不说明已做了什么**：你已经排查过的线索告诉 AI，避免它重复走弯路。
4. **期望 AI 运行代码**：AI 不能执行，所有运行结果要你提供。

## 总结

AI 调试的核心是**把 AI 当作"永不疲倦的高级同事"**——它能同时看堆栈、看代码、看日志、联想可能原因。关键是**给够上下文、描述清楚场景、说明已排查的线索**。`
  },
  {
    id: 'ai-015',
    category: 'aicode',
    title: '前端开发者必备的 Prompt Engineering 实战技巧',
    difficulty: '中等',
    tags: ['Prompt', '提示工程', '实战', '前端'],
    answer: `## 核心原则

好的 Prompt = **清晰角色 + 明确任务 + 充分上下文 + 输出约定**。

## 20+ 实战 Prompt 模板

### 1. 生成组件

\`\`\`
【角色】你是一名 Vue3 组件库开发者
【任务】创建一个 Tree 树形组件
【上下文】项目使用 Vue3 + TypeScript + Element Plus
【要求】
- 支持展开/折叠、点击选中、拖拽排序
- Props：data, nodeKey, label, children, defaultExpandAll
- Events：node-click, node-drop
- 用 <script setup lang="ts"> 语法
- 写 Props 类型定义
- 用 CSS 变量控制样式
\`\`\`

### 2. 调试错误

\`\`\`
【角色】你是一名资深前端调试专家
【任务】分析以下错误并给出修复方案
【错误】TypeError: Cannot read properties of null (reading 'map')
【代码片段】
  const list = response.data.items
  return list.map(item => item.name)
【补充信息】response.data 可能为 null
【要求】给出 3 种修复方案，列出各自优缺点
\`\`\`

### 3. 代码重构

\`\`\`
【角色】你是一名代码重构专家
【任务】把以下 class 组件改写成 Hooks 函数组件
【要求】
- 保持 props 和 行为完全一致
- 用 useReducer 或 useState 管理状态
- 用 useEffect 处理生命周期
- 拆分自定义 hook
- 保持代码简洁，不要过度抽象
\`\`\`

### 4. 写测试

\`\`\`
【角色】你是一名测试工程师
【任务】为以下函数写 Vitest 单元测试
【代码】
  function formatDate(date, format = 'YYYY-MM-DD') {
    // ...
  }
【要求】
- 覆盖正常输入、边界情况、异常输入
- 用 describe/it 组织
- 每个用例有清晰的中文描述
- Mock 掉日期相关的系统调用
- 包含至少 1 个 property-based 测试
\`\`\`

### 5. 解释代码

\`\`\`
【角色】你是一名导师
【任务】解释以下代码的工作原理
【代码】（粘贴代码）
【要求】
- 用初学者能理解的语言
- 分步骤说明执行流程
- 指出关键设计决策
- 给出优化建议
- 用比喻帮助理解
\`\`\`

### 6. 性能优化

\`\`\`
【角色】你是一名前端性能专家
【任务】分析以下代码的性能问题并优化
【代码】（粘贴代码）
【上下文】该代码在首屏渲染时执行，影响 LCP
【要求】
- 识别不必要的重渲染、重复计算
- 给出优化后的代码
- 解释优化原理
- 预估性能提升
\`\`\`

### 7. 生成 API 封装

\`\`\`
【角色】你是一名 API 层开发者
【任务】为 /api/users 接口封装请求函数
【接口文档】
  GET /api/users?page=1&size=10 → { list: [], total: 0 }
  POST /api/users → 创建用户
  DELETE /api/users/:id → 删除用户
【要求】
- 用 TypeScript 定义请求和响应类型
- 统一错误处理
- 支持请求取消（AbortController）
- 支持批量请求
\`\`\`

### 8. 写 Git Commit

\`\`\`
【角色】你是一名 Git 专家
【任务】根据以下 diff 生成规范的 commit message
【规则】Conventional Commits
【diff 摘要】修改了登录页表单校验逻辑，增加了手机号格式校验
【要求】
- 类型：feat/fix/docs/style/refactor/test/chore
- 简洁描述改动
- Body 说明改动原因
\`\`\`

### 9. 写文档

\`\`\`
【角色】你是一名技术文档工程师
【任务】为以下组件生成 API 文档
【代码】（粘贴组件代码）
【要求】
- 包含 Props、Events、Slots、Methods
- 每个属性说明类型、默认值、是否必填
- 提供使用示例
- 说明注意事项
\`\`\`

### 10. 技术选型

\`\`\`
【角色】你是一名架构师
【任务】为以下需求做技术选型
【需求】实时协作白板，支持 50+ 人同时编辑
【候选方案】WebSocket + CRDT / WebSocket + OT / Server-sent Events
【要求】
- 对比各方案的优缺点
- 给出推荐方案
- 说明推荐理由
- 列出技术风险
\`\`\`

### 11. 代码 Review

\`\`\`
【角色】你是一名严格的代码 reviewer
【任务】Review 以下代码，指出问题
【代码】（粘贴代码）
【Review 标准】
- 正确性：逻辑是否正确
- 性能：是否有性能问题
- 安全：是否有安全隐患
- 可维护性：命名、结构、注释
- 规范性：是否符合项目 ESLint 规则
\`\`\`

### 12. 生成正则

\`\`\`
【角色】你是一名正则专家
【任务】写正则匹配以下场景
【需求】匹配中国大陆手机号（1 开头，第二位 3-9，共 11 位）
【要求】
- 给出正则表达式
- 解释每个部分的含义
- 给出正例和反例
- 说明边界情况
\`\`\`

### 13. 迁移代码

\`\`\`
【角色】你是一名迁移专家
【任务】把以下 jQuery 代码迁移到原生 JS
【代码】（粘贴 jQuery 代码）
【要求】
- 用现代 JS API（fetch、classList、querySelector）
- 保持行为完全一致
- 代码量减少 30% 以上
- 加注释说明迁移要点
\`\`\`

### 14. 写 SQL

\`\`\`
【角色】你是一名数据库专家
【任务】写 SQL 查询满足以下需求
【需求】查询每个部门薪资最高的员工
【表结构】employees(id, name, dept_id, salary), departments(id, name)
【要求】
- 给出 3 种写法（子查询、窗口函数、JOIN）
- 对比性能
- 说明索引建议
\`\`\`

### 15. 生成 Mock 数据

\`\`\`
【角色】你是一名 Mock 数据专家
【任务】生成符合以下接口的 Mock 数据
【接口】GET /api/users → { list: User[], total: number }
【User 结构】{ id: number, name: string, email: string, avatar: string, createdAt: string }
【要求】
- 生成 20 条数据
- 用 Mock.js 或类似库的格式
- 数据合理（名字、邮箱、头像 URL）
- 包含边界数据（空字符串、超长名）
\`\`\`

### 16. 错误处理设计

\`\`\`
【角色】你是一名可靠性工程师
【任务】为以下场景设计统一错误处理方案
【场景】前端应用需要处理：网络错误、业务错误、权限错误、系统错误
【要求】
- 定义错误分类体系
- 设计错误码规范
- 实现全局错误处理
- 用户友好提示策略
- 错误上报监控
\`\`\`

### 17. 表单校验

\`\`\`
【角色】你是一名表单专家
【任务】为注册表单设计校验逻辑
【字段】
- username: 3-16 位字母数字
- email: 标准邮箱格式
- password: 至少 8 位，含大小写字母和数字
- confirmPassword: 必须与 password 一致
【要求】
- 实时校验 + 提交校验
- 错误提示友好
- 支持国际化
- 用 vee-validate 或 zod 实现
\`\`\`

### 18. 设计模式应用

\`\`\`
【角色】你是一名设计模式专家
【任务】为以下需求选择合适的设计模式
【需求】实现一个事件总线，支持订阅/发布/取消
【候选模式】观察者模式、发布-订阅模式
【要求】
- 用 TypeScript 实现
- 支持通配符
- 支持优先级
- 支持一次监听
- 内存泄漏防护
\`\`\`

### 19. 生成 CI/CD 配置

\`\`\`
【角色】你是一名 DevOps 工程师
【任务】为前端项目生成 GitHub Actions 配置
【流程】push → lint → test → build → deploy
【要求】
- pnpm 缓存加速
- 矩阵测试（Node 18/20）
- 构建产物上传
- 部署到 Vercel
- 失败时通知
\`\`\`

### 20. 面试准备

\`\`\`
【角色】你是一名面试官
【任务】根据以下简历生成面试问题
【候选人技能】Vue3、TypeScript、Vite、Pinia
【岗位】高级前端工程师
【要求】
- 10 个技术问题（由浅入深）
- 3 个系统设计问题
- 1 个 coding 问题
- 每个问题附考察点
\`\`\`

## Prompt 通用公式

\`\`\`
【角色】[你希望 AI 扮演的角色]
【任务】[具体要做什么]
【上下文】[背景信息、相关代码、约束条件]
【要求】[输出格式、质量标准、技术规范]
【示例】[期望的输出样例]（可选）
\`\`\`

## 避坑指南

1. **不要用自然语言描述复杂需求**：用结构化的分节（角色/任务/上下文/要求）。
2. **不要一次要求太多**：一个 prompt 聚焦一个任务，复杂任务拆成多轮。
3. **给示例比给描述更有效**：AI 从示例中学习比从规则中学习快。
4. **明确"不要做什么"**：禁止事项和要求同等重要。
5. **指定技术栈和版本**：避免 AI 用你项目中没有的技术。

## 总结

Prompt Engineering 不是玄学，是**结构化沟通**的能力。掌握"角色 + 任务 + 上下文 + 要求"四要素，结合本文的 20+ 模板，能覆盖前端 90% 的日常 AI 使用场景。`
  },
  {
    id: 'ai-016',
    category: 'aicode',
    title: 'AI 生成的代码如何高效 Review？',
    difficulty: '中等',
    tags: ['Code Review', '代码审查', '实战', '质量'],
    answer: `## 为什么 AI 代码需要特殊 Review

AI 生成的代码有独特的"故障模式"——它不是"故意写烂"，而是**"自信地犯错"**：
- 看起来很正确，实际上有逻辑漏洞
- 使用不存在的 API 或错误的签名
- 依赖不存在的包
- 安全隐患不易察觉

## Review Checklist（10 项）

### 1. 正确性

\`\`\`
□ 代码是否实现了需求描述的功能？
□ 边界条件是否处理？（空值、数组为空、超长字符串）
□ 异步操作是否正确处理 loading/error 状态？
□ 状态更新是否遵循不可变原则？
□ 事件处理是否防止了默认行为/冒泡？
\`\`\`

### 2. 安全性

\`\`\`
□ 是否存在 XSS 风险？（innerHTML、v-html、dangerouslySetInnerHTML）
□ 是否存在 SQL 注入？（拼接 SQL、未参数化）
□ 是否硬编码了密钥/密码/token？
□ 是否使用了 eval()、new Function() 等动态执行？
□ 文件上传是否校验了类型和大小？
\`\`\`

### 3. 性能

\`\`\`
□ 是否有不必要的重渲染？
□ 是否在 render 中做了昂贵计算？
□ 是否正确使用了 memo/computed/cache？
□ 列表是否有 key 且 key 稳定？
□ 是否存在内存泄漏风险？（未清理的定时器、事件监听）
\`\`\`

### 4. 依赖

\`\`\`
□ 引入的包是否存在？（去 npm 官网核实）
□ 引入的包是否在项目 package.json 中？
□ 版本是否与项目其他依赖兼容？
□ 是否引入了不必要的大型依赖？（可以用原生 API 替代）
□ 是否引入了已知有漏洞的版本？
\`\`\`

### 5. 类型安全

\`\`\`
□ 是否有 any 类型？（应消除）
□ 可选类型是否正确处理了 undefined？
□ 泛型是否正确使用？
□ 类型守卫是否完整？
□ 接口定义是否与后端一致？
\`\`\`

### 6. 可维护性

\`\`\`
□ 函数是否过长？（建议 < 30 行）
□ 命名是否清晰？（避免 a, b, temp, data）
□ 魔法数字是否提取为常量？
□ 复杂逻辑是否有注释？
□ 是否符合项目的代码风格约定？
\`\`\`

### 7. 错误处理

\`\`\`
□ 异步请求是否有 try-catch？
□ catch 块中是否做了有意义的处理？（不是空 catch）
□ 错误是否上报/显示给用户？
□ 是否有全局错误边界？
□ Promise 是否都有 .catch 或 await 处理？
\`\`\`

### 8. 测试覆盖

\`\`\`
□ 是否有关键路径的测试？
□ 边界条件是否有测试？
□ 是否有 property-based 测试？
□ Mock 是否合理？（不要过度 mock）
□ 测试是否真的在测行为而非实现？
\`\`\`

### 9. 国际化/可访问性

\`\`\`
□ 硬编码文本是否提取到 i18n？
□ 日期/数字/货币是否用了 Intl API？
□ 颜色对比度是否达标？（WCAG AA）
□ 表单是否有 label 和错误提示关联？
□ 键盘导航是否可用？
\`\`\`

### 10. 环境适配

\`\`\`
□ 是否依赖了浏览器特有 API？（检查兼容性）
□ 是否考虑了 SSR/SSG 场景？
□ 是否考虑了国际化（RTL 布局）？
□ 是否考虑了不同分辨率和 DPI？
□ 是否有暗色模式支持？
\`\`\`

## AI 代码常见错误模式

### 模式一：幻觉 API

\`\`\`typescript
// AI 可能生成不存在的 API
import { useDebounce } from 'react-use'  // 实际包名是 react-use，但检查是否在依赖中
const result = await fetchUser(userId)   // 函数名可能与实际项目不一致
\`\`\`

**应对**：交叉验证 API 文档、检查 import 的包是否在 package.json 中。

### 模式二：过度简化

\`\`\`javascript
// 需求：带 token 刷新的请求
// AI 可能简化为：
const token = localStorage.getItem('token')
const headers = token ? { Authorization: \`Bearer \${token}\` } : {}
// 缺少：token 过期自动刷新、并发请求的 token 队列、401 统一处理
\`\`\`

**应对**：对比需求与实现，看是否遗漏关键逻辑。

### 模式三：虚假安全感

\`\`\`typescript
// AI 生成的"看似有类型"的代码
interface User {
  id: number
  name: string
  email?: string  // 可选，但没说明什么时候为 undefined
}
// 使用时：
const email = user.email  // 可能为 undefined，但没处理
user.email.toUpperCase()  // 💥 Runtime error
\`\`\`

**应对**：检查可选类型是否被正确处理。

### 模式四：复制粘贴 Bug

AI 在多处生成相似代码时，可能不小心把 A 的变量名带到 B 中：

\`\`\`typescript
// 组件 A 中引用了 userId，但组件 B 中没有这个变量
const userName = users[userId].name  // userId 在当前作用域不存在
\`\`\`

**应对**：搜索变量引用，确保每个变量都有定义。

## 用 AI 来 Review AI

### AI 审 AI 工作流

\`\`\`
1. AI 生成代码 A
2. 把代码 A 喂给 AI，让它用 Review Checklist 自查
3. 人工抽查 AI 的 Review 结果
4. 关键代码再用另一个 AI 交叉审查
\`\`\`

### 示例 Prompt

\`\`\`
请用以下 Checklist Review 这段代码，逐条检查，给出 PASS/FAIL 和修改建议：

【代码】（粘贴 AI 生成的代码）

【Checklist】
1. 是否存在 XSS 风险？
2. 是否硬编码了密钥？
3. 依赖的包是否存在？
4. 可选类型是否正确处理？
5. 是否有空的 catch 块？
6. 函数是否超过 30 行？
7. 是否有不必要的重渲染？
8. 命名是否清晰？

请对每条给出结论和具体建议。
\`\`\`

## 人工 Review 重点区域

AI 能发现 80% 的机械问题，但以下必须人工把关：

1. **业务逻辑正确性**：AI 不理解业务，你要判断逻辑是否符合需求。
2. **架构合理性**：这段代码是否应该在这里？是否符合项目架构？
3. **用户体验**：交互是否符合用户预期？动效是否合理？
4. **性能影响评估**：这段代码在生产环境的性能影响如何？
5. **安全关键路径**：认证、支付、加密相关代码必须手动逐行审查。

## 工具辅助

| 工具 | 用途 |
| --- | --- |
| ESLint + Prettier | 强制风格和基本规范 |
| SonarQube | 静态代码分析 |
| CodeQL | 安全漏洞检测 |
| Snyk | 依赖漏洞扫描 |
| TypeScript strict mode | 类型安全检查 |
| vitest + coverage | 测试覆盖率 |

## 总结

AI 代码 Review 的核心心态是**"不信任，但验证"**——假设 AI 代码有问题，用 Checklist 系统性排查，关键路径人工把关，让 AI 帮你做第一轮机械审查。最终目标是**建立人机协作的 Review 流程**：AI 扫雷，人决策。`
  },
  {
    id: 'ai-017',
    category: 'aicode',
    title: '如何用 AI 快速生成单元测试？',
    difficulty: '中等',
    tags: ['单元测试', 'Vitest', 'Jest', '实战'],
    answer: `## 核心思路

AI 在生成测试方面的优势是**覆盖广、速度快、不知疲倦**。但 AI 写的测试也有"通病"——断言太弱、mock 太多、测实现不测行为。所以核心策略是：**让 AI 生成初稿 + 人工聚焦高价值补充**。

## 快速上手工作流

### Step 1：给 AI 提供上下文

\`\`\`
为以下代码写 Vitest 单元测试：

【被测代码】
// src/utils/price.ts
export function formatPrice(price: number, currency = 'CNY'): string {
  if (price < 0) throw new Error('Price cannot be negative')
  if (price === 0) return '¥0.00'
  const symbols: Record<string, string> = { CNY: '¥', USD: '$', EUR: '€' }
  const symbol = symbols[currency] || '¥'
  return \`\${symbol}\${price.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')}\`
}

【已有测试风格】
// tests/utils/format.test.ts
import { describe, it, expect } from 'vitest'
describe('format', () => {
  it('should format normal number', () => {
    expect(format(1234)).toBe('1,234')
  })
})

【要求】
- 覆盖正常值、边界值、异常值
- 用 describe/it 组织，每个用例用中文描述
- 测试命名用 it('应该...') 格式
\`\`\`

### Step 2：AI 生成初稿

AI 通常能生成类似这样的测试：

\`\`\`typescript
import { describe, it, expect } from 'vitest'
import { formatPrice } from '@/utils/price'

describe('formatPrice', () => {
  it('应该格式化正常价格', () => {
    expect(formatPrice(1234.56)).toBe('¥1,234.56')
  })

  it('应该处理零价格', () => {
    expect(formatPrice(0)).toBe('¥0.00')
  })

  it('应该处理负数并抛错', () => {
    expect(() => formatPrice(-1)).toThrow('Price cannot be negative')
  })

  it('应该支持美元', () => {
    expect(formatPrice(99.99, 'USD')).toBe('$99.99')
  })

  it('应该支持欧元', () => {
    expect(formatPrice(50, 'EUR')).toBe('€50.00')
  })

  it('应该处理未知货币默认人民币', () => {
    expect(formatPrice(100, 'GBP')).toBe('¥100.00')
  })

  it('应该处理大数字加千分位', () => {
    expect(formatPrice(1000000)).toBe('¥1,000,000.00')
  })

  it('应该处理小数精度', () => {
    expect(formatPrice(1234.567)).toBe('¥1,234.57')
  })
})
\`\`\`

### Step 3：人工增强

检查 AI 生成的测试，补充遗漏的边界：

\`\`\`typescript
  // 补充：超大数字
  it('应该处理超大数字', () => {
    expect(formatPrice(9999999999.99)).toBe('¥9,999,999,999.99')
  })

  // 补充：NaN 输入
  it('NaN 应该抛错', () => {
    expect(() => formatPrice(NaN)).toThrow()
  })

  // 补充：默认货币
  it('默认货币应该是人民币', () => {
    expect(formatPrice(100)).toBe('¥100.00')
  })
\`\`\`

## 组件测试

### Prompt 示例

\`\`\`
为以下 Vue 组件写 Vitest 测试：

【组件代码】
// components/UserCard.vue
<template>
  <div class="user-card" @click="$emit('select', user.id)">
    <img :src="user.avatar" :alt="user.name" />
    <span class="name">{{ user.name }}</span>
    <span v-if="user.online" class="status online">在线</span>
    <span v-else class="status offline">离线</span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
interface User { id: number; name: string; avatar: string; online: boolean }
const props = defineProps<{ user: User }>()
defineEmits<{ (e: 'select', id: number): void }>()
</script>

【要求】
- 用 @vue/test-utils
- 测试渲染、props、事件、条件渲染
- 至少 5 个测试用例
\`\`\`

## 发现盲点的高级技巧

### 技巧一：让 AI 列场景

\`\`\`
基于这段代码，列出 10 个容易被忽略的边界场景，
按风险从高到低排序，并说明每个场景的潜在 bug。
\`\`\`

AI 常能想到的盲点：
- 时区/夏令时
- Unicode 字符
- 循环引用
- 并发竞态
- 内存泄漏
- 输入极端值（Infinity、NaN、空字符串）

### 技巧二：Property-based Testing

\`\`\`
用 fast-check 写 property-based 测试：
对于任意数字 x (x >= 0)，formatPrice(x) 的结果：
1. 以货币符号开头
2. 包含小数点后两位
3. 数字部分等于 x 的格式化值
\`\`\`

AI 示例：

\`\`\`typescript
import * as fc from 'fast-check'
import { formatPrice } from '@/utils/price'

describe('formatPrice properties', () => {
  it('结果应该以货币符号开头', () => {
    fc.assert(
      fc.property(fc.double({ min: 0, noNaN: true }), (price) => {
        const result = formatPrice(price)
        expect(result.startsWith('¥')).toBe(true)
      })
    )
  })

  it('结果小数点后应该有两位', () => {
    fc.assert(
      fc.property(fc.double({ min: 0, noNaN: true }), (price) => {
        const result = formatPrice(price)
        const decimalPart = result.split('.')[1]
        expect(decimalPart).toHaveLength(2)
      })
    )
  })
})
\`\`\`

### 技巧三：变异测试

让 AI 分析你的测试是否能检测到代码变异：

\`\`\`
对 formatPrice 函数做以下变异：
1. 把 toFixed(2) 改成 toFixed(3)
2. 把 throw 改成 return null
3. 把 symbols[currency] 改成 symbols['USD']

运行现有测试，看哪些变异能被检测到。
\`\`\`

## 常见 AI 测试质量问题

| 问题 | 表现 | 解决方案 |
| --- | --- | --- |
| 断言过弱 | 只测不抛错，不测具体值 | 补充精确断言 |
| 冗余用例 | 10 个用例测同一件事 | 合并去重 |
| 过度 Mock | Mock 了所有依赖 | 减少 mock，测真实行为 |
| 测实现 | 测私有方法、调用顺序 | 只测公开接口 |
| 忽略边界 | 不测 null/undefined/空数组 | 补充边界用例 |
| 依赖时间 | 用真实 Date.now() | Mock 时间 |

## 测试质量自检清单

\`\`\`
□ 覆盖率是否达到项目要求？（通常 80%+）
□ 核心逻辑是否有多个用例覆盖？
□ 边界条件是否都测了？
□ 是否有 property-based 测试？
□ 是否有回归测试防特定 bug？
□ 测试名称是否描述了意图？
□ 测试是否快速、可重复、独立？
□ 是否有 E2E 测试覆盖关键流程？
\`\`\`

## 总结

AI 生成测试的价值是**快速产出覆盖面广的初稿**，但最终质量取决于你的补充和审查。最佳实践是：AI 生成基础用例 → 你补充边界和 property 测试 → 用变异测试验证有效性 → 定期让 AI 分析覆盖率盲点。`
  },
  {
    id: 'ai-018',
    category: 'aicode',
    title: 'AI 编程的常见陷阱与避坑指南',
    difficulty: '简单',
    tags: ['陷阱', '避坑', '实战', '经验'],
    answer: `## 陷阱总览

AI 编程的陷阱可以归为 **7 大类**，每个开发者都会遇到。认识陷阱是避坑的第一步。

## 陷阱一：过度依赖

### 表现

- "AI 会帮我写" → 不思考实现思路
- "AI 说的应该没错" → 不 review 直接提交
- 离开 AI 写不出代码

### 危害

- 技能退化，基础不牢
- AI 的 bug 直接进生产
- 换工具后效率骤降

### 对策

\`\`\`
1. **先自己想 5 分钟**：让 AI 写之前，先在纸上/脑中设计方案
2. **对比学习**：AI 写完后，自己再写一遍，对比差异
3. **定期"戒 AI"**：每周挑一天完全不用 AI，保持肌肉记忆
4. **关键代码自己写**：核心逻辑不用 AI，保持手感
\`\`\`

## 陷阱二：AI 幻觉

### 表现

AI "编造"不存在的 API、函数、包、配置：

\`\`\`typescript
// AI 可能生成：
import { useVirtualList } from '@tanstack/react-virtual'  // 实际是 @tanstack/react-virtual
const result = await api.batchDelete(ids)  // batchDelete 可能不存在
element.animate({ scrollTop: 0 })  // animate API 参数顺序可能不对
\`\`\`

### 识别信号

- AI 用非常确定的语气说"这个 API 就是这样的"
- 涉及你不太熟悉的库/API
- 代码看起来"太完美"

### 对策

\`\`\`
1. **交叉验证**：AI 说的 API 去官方文档核实
2. **安装前检查**：新依赖先 npm search 确认存在
3. **跑类型检查**：TypeScript 编译不通过说明有问题
4. **跑测试**：AI 代码必须通过测试才能合入
5. **看运行时**：能编译过不代表逻辑正确
\`\`\`

## 陷阱三：上下文污染

### 表现

- AI 从历史对话中"记住"了过时的信息
- 切换文件后，AI 仍按上一个文件的风格生成
- 多个任务的上下文互相干扰

### 案例

\`\`\`
// 上一个任务：写 Vue2 的 Options API
// 当前任务：写 Vue3 的 Composition API
// AI 可能仍然生成 Options API 风格
export default {
  data() { return { count: 0 } },
  methods: { increment() { this.count++ } }
}
\`\`\`

### 对策

\`\`\`
1. **新对话新上下文**：不同任务开不同对话
2. **明确技术栈**：prompt 中反复强调当前技术栈
3. **规则文件**：用 .cursorrules 锁定项目风格
4. **主动纠偏**：发现 AI 跑偏，立即纠正并说明
\`\`\`

## 陷阱四：复制粘贴 Bug

### 表现

AI 在生成多处相似代码时，不小心把一处的变量名/逻辑"粘"到另一处：

\`\`\`typescript
// 组件 A
const userName = ref('')
const userAge = ref(0)

// 组件 B（AI 复制时出错）
const orderName = ref('')  // 应该是 orderId
const orderAge = ref(0)    // 应该是 orderStatus
// 甚至可能引用了组件 A 的变量
const orderTotal = computed(() => userName.value * price.value)  // 💥
\`\`\`

### 识别信号

- 变量名与业务不符
- 出现跨组件引用
- 一处修改后另一处莫名出错

### 对策

\`\`\`
1. **变量命名检查**：搜索不相关的变量名
2. **每个组件独立 review**：不要批量接受
3. **让 AI 重构时声明：每个组件独立**
4. **用 linter 检查未定义变量**
\`\`\`

## 陷阱五：依赖编造

### 表现

AI 编造不存在的 npm 包或使用错误的包名：

\`\`\`bash
# AI 建议安装不存在的包
npm install @vueuse/shared-utils  # 实际是 @vueuse/shared
npm install react-hooks-extra      # 不存在
\`\`\`

### 对策

\`\`\`
1. **安装前搜索**：npm search package-name
2. **检查 GitHub**：去包的 GitHub 确认存在
3. **用 lock 文件验证**：CI 中如果 lock 文件冲突，说明有问题
4. **记录依赖变更**：每次新增依赖都单独提交，便于审查
\`\`\`

## 陷阱六：安全陷阱

### 表现

\`\`\`
1. AI 把密钥/token 硬编码进代码
2. AI 用 eval() 执行用户输入
3. AI 生成不安全的加密代码
4. AI 跳过了权限检查
\`\`\`

### 案例

\`\`\`javascript
// AI 生成的"方便"但不安全的代码
const token = 'sk-abc123def456'  // 硬编码的密钥！
localStorage.setItem('adminToken', token)  // token 不该存 localStorage

// AI 生成的"简单"加密
function encrypt(data) {
  return btoa(data)  // Base64 不是加密！
}
\`\`\`

### 对策

\`\`\`
1. **密钥扫描**：用 GitGuardian 等工具自动检测
2. **敏感代码手动审查**：认证、支付、加密相关代码必须手动审查
3. **用成熟库**：加密用 crypto-js，不要自己实现
4. **安全 checklist**：Review 时逐条检查安全项

## 陷阱七：不理解就用

### 表现

- AI 生成了 200 行代码，你一行没看就接受了
- 代码能跑就行，不理解实现原理
- 出 bug 时不知道从哪排查

### 案例

\`\`\`
// AI 生成的复杂 Hooks
function useDebouncedValue<T>(value: T, delay?: number, options?: DebounceOptions) {
  // 50 行代码...
  // 你不知道它内部用了什么，出问题了只能继续问 AI
}
\`\`\`

### 对策

\`\`\`
1. **让 AI 解释**：生成代码后让 AI 解释每一部分
2. **自己跑一遍**：用 debugger 跟踪执行流程
3. **简化理解**：把 AI 代码简化成最小可理解版本
4. **加注释**：让 AI 或自己给关键部分加注释

## AI 生成"坏代码"的 10 个信号

\`\`\`
1. 变量命名混乱（a, b, temp, data, result）
2. 函数过长（> 50 行）
3. 嵌套过深（> 3 层）
4. 大量重复代码
5. 注释解释"做什么"而非"为什么"
6. 缺少错误处理
7. 硬编码的魔法数字/字符串
8. 使用了 any 类型但本可以用具体类型
9. 大段注释掉的代码
10. 能跑但你不知道为什么能跑
\`\`\`

## 总结

AI 编程的最大陷阱不是 AI 本身，而是**使用者的心态和习惯**：
- 把 AI 当"加速器"而非"替代者"
- 保持思考、保持怀疑、保持动手能力
- 建立"AI 代码必过 Review + 测试"的流程
- 认识陷阱、主动规避，就能把 AI 变成可靠的生产力倍增器`
  },
  {
    id: 'ai-019',
    category: 'aicode',
    title: '如何在团队中落地 AI 编程工具？',
    difficulty: '中等',
    tags: ['团队', '落地', '实践', '企业'],
    answer: `## 落地路线图

团队引入 AI 编程工具不是"装个插件"的事，而是**一次工作方式的变革**。需要分阶段推进。

## 阶段一：试点期（1~2 个月）

### 1.1 选定试点团队

- 选择 **1~2 个愿意尝新、技术能力较强**的团队
- 不要全员同时铺开，避免混乱
- 试点团队负责产出经验和规范

### 1.2 工具选型

| 场景 | 推荐 | 理由 |
| --- | --- | --- |
| 企业安全合规 | GitHub Copilot Enterprise | 数据隔离、SSO、审计 |
| 追求最强能力 | Cursor + Cursor Team Plan | Agent 模式、多模型、团队同步规则 |
| 私有化部署 | Continue + 本地模型 | 数据不出内网 |
| 成本敏感 | 阿里云百炼 / 腾讯混元 | 国内服务，价格有优势 |

### 1.3 制定初始规则

\`\`\`markdown
# 团队 AI 编程规范 v0.1

## 适用范围
- 所有前端项目

## 代码提交
- AI 生成的代码必须经过人工 review
- commit message 标注 [ai-assisted]
- 关键模块（支付、认证）必须人工逐行审查

## 安全
- 禁止把密钥、生产数据作为 prompt
- 敏感项目使用企业版工具（数据不用于训练）
- 代码中禁止出现硬编码密钥

## 质量
- AI 代码必须通过所有测试
- AI 代码必须通过 ESLint/Prettier
- AI 代码必须通过 CodeQL/Snyk 扫描

## 培训
- 每周 15 分钟分享一个 AI 使用技巧
- 每月一次 AI 编程 demo 会议
\`\`\`

### 1.4 收集反馈

\`\`\`
每周采集：
- AI 工具使用时长
- AI 代码占比（按 commit 标记）
- AI 代码 bug 数
- 开发者满意度（1-5 分）
- 遇到的问题和建议
\`\`\`

## 阶段二：推广期（2~4 个月）

### 2.1 制定团队规则文件

每个项目建立统一的 \`.cursorrules\` 或 \`CLAUDE.md\`：

\`\`\`markdown
# 项目 AI 规则

## 技术栈
- React 18 + TypeScript 5 + Vite 5
- TailwindCSS 3 + shadcn/ui
- Zustand + TanStack Query
- React Router v6

## 目录约定
- /app    路由页面
- /components  通用组件
- /hooks  自定义 Hooks
- /lib    工具函数
- /services  API 请求
- /types  类型定义

## 代码规范
- 函数组件 + Hooks
- Props 用 interface 定义
- 禁用 any
- 组件文件用 kebab-case
- 工具函数用 camelCase

## 禁止
- 不引入 jQuery
- 不直接操作 DOM
- 不使用 CSS-in-JS 库（用 Tailwind）
- 不手动管理 loading 状态（用 TanStack Query）
\`\`\`

### 2.2 培训与分享

\`\`\`
每周 15 分钟分享（轮值）：
- 第 1 周：Prompt Engineering 基础
- 第 2 周：用 AI 写测试的技巧
- 第 3 周：AI 代码 Review 经验
- 第 4 周：AI 调试实战
- 第 5 周：团队规则文件介绍
- 第 6 周：AI 生成组件的最佳实践
\`\`\`

### 2.3 建立 AI 代码标记

\`\`\`bash
# 提交 AI 生成代码时使用
git commit -m "feat: add user profile page [ai-assisted]"

# PR 标签
# ai-generated / ai-assisted / ai-reviewed
\`\`\`

### 2.4 质量门禁

\`\`\`
PR 流程：
1. 开发者提交 PR（标记 [ai-assisted]）
2. CI 自动运行：lint + test + security scan
3. AI 自动化 review（CodeRabbit / Copilot Review）
4. 人工 review（重点关注 AI 标记的 PR）
5. 合并

度量：
- AI PR 的 review 时长（应减少 30%+）
- AI PR 的 bug 率（不应高于非 AI PR）
\`\`\`

## 阶段三：成熟期（4~6 个月）

### 3.1 量化评估

\`\`\`
核心指标：
- PR 周期：目标缩短 20%
- AI 代码采纳率：目标 > 40%
- 开发者满意度：目标 > 4/5
- AI 代码 bug 率：目标不高于基线
- 工具 ROI：每月节省 X 小时 / 每人

分析维度：
- 按团队/项目/个人
- 按任务类型（新功能 vs 维护 vs 重构）
- 按 AI 使用场景（补全 vs Chat vs Agent）
\`\`\`

### 3.2 治理与迭代

\`\`\`
每季度复盘：
1. 工具效果评估：继续用？换工具？加工具？
2. 规则文件更新：删掉没用的，加新约定
3. 培训内容更新：基于实际使用经验
4. 安全审计：检查是否有数据泄露风险
5. 成本优化：是否有更经济的方案
\`\`\`

### 3.3 高级应用

\`\`\`
- 自建 MCP Server：把内部 API、文档、代码索引接入 AI 工具
- 建立团队知识库：AI 能查询内部 Wiki、API 文档
- 自动化 Code Review：AI 实时审查所有 PR
- AI 辅助 onboarding：新人配 AI 导师，加速上手
- AI + 性能监控：告警后 AI 自动分析根因
\`\`\`

## 组织保障

### 3.1 指定 AI 工具负责人

每个团队指定 1 人负责：
- 收集团队反馈
- 维护规则文件
- 组织培训分享
- 对接工具供应商

### 3.2 变革管理

\`\`\`
常见阻力与应对：
| 阻力 | 原因 | 应对 |
| --- | --- | --- |
| "AI 写的代码不可靠" | 担心质量 | 展示试点数据 + 建立 review 流程 |
| "我不想学新东西" | 惰性 | 安排培训 + 一对一辅导 |
| "AI 会让我失业" | 焦虑 | 强调 AI 是辅助，不是替代 |
| "工具太贵了" | 成本顾虑 | 展示 ROI + 分期投入 |
| "我的代码 AI 写不了" | 特殊性 | 识别 AI 擅长和不擅长的，各司其职 |
\`\`\`

### 3.3 激励机制

- 设立"AI 编程标兵"月度奖项
- 分享会纳入绩效考核
- 把 AI 使用能力作为技能矩阵的一项

## 反模式

1. **一刀切**：所有团队用同一个工具、同一套规则 → 不同团队需求不同
2. **只推不训**：只让用，不教怎么用 → 效率上不去
3. **无度量**：不跟踪效果 → 无法证明价值
4. **规则过多**：写 500 行规则 → AI 记不住，人也不想维护
5. **忽视反馈**：开发者抱怨没人管 → 工具被弃用

## 总结

团队落地 AI 编程是一次**组织变革**，不是技术选型。关键成功因素：
1. **试点先行**：小范围验证，用数据说服
2. **规则明确**：统一规范，降低混乱
3. **培训跟上**：教方法，造氛围
4. **度量闭环**：持续评估，持续改进
5. **人机协作**：明确 AI 做什么、人做什么`
  },
  {
    id: 'ai-020',
    category: 'aicode',
    title: '用 AI 做前端性能优化分析的实战案例',
    difficulty: '困难',
    tags: ['性能', '优化', 'Lighthouse', '实战'],
    answer: `## 核心思路

性能优化的 AI 工作流：**测量 → AI 分析 → 制定方案 → 实施 → 验证**。AI 的价值在于把性能数据转化为可执行的优化方案。

## 实战案例：Lighthouse + AI 分析

### Step 1：采集性能数据

\`\`\`bash
# 用 Lighthouse CI 采集
npx @lhci/cli autorun --collect.url=http://localhost:3000 --collect.numberOfRuns=3
\`\`\`

### Step 2：把数据喂给 AI

\`\`\`
以下是 Lighthouse 性能报告，请分析并给出优化方案：

【分数】Performance: 45 | Accessibility: 92 | Best Practices: 85
【核心指标】FCP: 3.2s | LCP: 4.8s | TTI: 5.1s | CLS: 0.15 | TBT: 1200ms
【诊断】未使用 JS: 280KB | 未使用 CSS: 45KB | 图片未优化: 1.2MB | 主线程阻塞: 2.1s
【技术栈】React 18 + Vite + Element Plus 全量引入 + 20+ 图标库

请按优先级排序优化项，每项给具体代码示例、预估提升、实施难度。
\`\`\`

### Step 3：AI 给出的优化方案

\`\`\`
| 优先级 | 优化项 | 预估提升 | 难度 |
| --- | --- | --- | --- |
| P0 | Element Plus 按需引入 | -180KB JS, LCP -1.2s | 低 |
| P0 | 图片 WebP + 懒加载 | -800KB, LCP -0.8s | 低 |
| P1 | 路由懒加载 + 代码分割 | -120KB JS, TTI -0.5s | 中 |
| P1 | 关键 CSS 内联 | FCP -0.6s | 中 |
| P2 | Service Worker 缓存 | 重复访问 -1.5s | 中 |
\`\`\`

### Step 4：实施优化（AI 辅助编码）

#### 优化 1：Element Plus 按需引入

\`\`\`typescript
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({ resolvers: [ElementPlusResolver()] }),
    Components({ resolvers: [ElementPlusResolver()] }),
  ],
})
\`\`\`

#### 优化 2：图片处理

\`\`\`html
<!-- 预加载关键图片 -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high" />

<!-- 使用 WebP + 懒加载 -->
<img src="/hero.webp" alt="Hero" loading="eager" decoding="async"
     width="1920" height="1080" />

<!-- 非首屏图片懒加载 -->
<img src="/list.webp" alt="List" loading="lazy" decoding="async" />
\`\`\`

#### 优化 3：路由懒加载

\`\`\`typescript
const routes = [
  { path: '/', component: () => import('@/pages/Home.vue') },
  { path: '/about', component: () => import('@/pages/About.vue') },
]
\`\`\`

## 渲染性能优化案例

### 问题

\`\`\`
页面滚动卡顿，FPS 从 60 降到 20。
React DevTools Profiler 显示：列表渲染耗时 800ms，每次滚动全量重渲染。
\`\`\`

### 让 AI 分析

\`\`\`
请分析以下代码的渲染性能问题并优化：

function ProductList({ products, onSelect }) {
  const [sortBy, setSortBy] = useState('price')
  const sorted = products.sort((a, b) => a[sortBy] - b[sortBy])
  return (
    <div>
      {sorted.map(product => (
        <ProductCard key={product.id} product={product} onSelect={onSelect} />
      ))}
    </div>
  )
}
\`\`\`

### AI 指出的问题

\`\`\`
1. products.sort() 会 mutate 原数组 → 应该用 toSorted() 或 [...products].sort()
2. 每次渲染都重新排序 → 应该用 useMemo
3. ProductCard 没有 memo → 父组件渲染时所有子组件都重渲染
4. onSelect 是新函数 → 应用 useCallback 稳定引用
5. 列表过长未虚拟化 → 超过 100 条应用 react-window
\`\`\`

### 优化后代码

\`\`\`typescript
import { memo, useMemo, useCallback, useState } from 'react'
import { FixedSizeList as List } from 'react-window'

const ProductCard = memo(({ product, onSelect }: Props) => (
  <div onClick={() => onSelect(product.id)}>...</div>
))

function ProductList({ products, onSelect }: Props) {
  const [sortBy, setSortBy] = useState('price')

  const sorted = useMemo(
    () => [...products].sort((a, b) => a[sortBy] - b[sortBy]),
    [products, sortBy]
  )

  const handleSelect = useCallback((id: number) => {
    onSelect(id)
  }, [onSelect])

  const Row = ({ index, style }) => (
    <div style={style}>
      <ProductCard product={sorted[index]} onSelect={handleSelect} />
    </div>
  )

  return (
    <List height={600} itemCount={sorted.length} itemSize={80} width="100%">
      {Row}
    </List>
  )
}
\`\`\`

### 验证效果

\`\`\`
优化前：滚动 FPS 20，渲染 800ms
优化后：滚动 FPS 60，渲染 120ms
\`\`\`

## AI 性能分析的高级技巧

### 1. 让 AI 分析 Bundle

\`\`\`
把 webpack-bundle-analyzer 的输出截图给 AI：
"分析这个 bundle，找出体积最大的 5 个模块，给出瘦身方案"
\`\`\`

### 2. 让 AI 分析火焰图

\`\`\`
把 Chrome DevTools 的 CPU 火焰图截图给 AI：
"分析这个火焰图，找出主线程阻塞最严重的函数"
\`\`\`

### 3. 让 AI 写性能监控

\`\`\`
"用 PerformanceObserver 监控 LCP/CLS/FID，上报到 /api/metrics，
注意：页面卸载前用 sendBeacon 上报，采样率 10%"
\`\`\`

## 总结

AI 在性能优化中的价值：**快速把性能数据转化为可执行方案**。流程是测量（Lighthouse/Profiler）→ 喂给 AI 分析 → AI 给优先级排序和代码 → 实施 → 验证。关键是**用真实数据驱动 AI 分析**，而非让 AI 凭空猜测。`
  },
  {
    id: 'ai-021',
    category: 'aicode',
    title: '用 AI 生成正则、SQL、Shell 等复杂代码',
    difficulty: '简单',
    tags: ['正则', 'SQL', 'Shell', '实战'],
    answer: `## 为什么这些场景适合 AI

正则、SQL、Shell 是开发者最"头疼"的三类代码——语法晦涩、写完就忘、调试困难。AI 在这些场景的价值是**用自然语言描述意图，AI 生成精确代码**。

## 一、正则表达式

### 场景：写一个校验密码强度的正则

\`\`\`
写一个正则，校验密码：
- 8-20 位
- 必须包含大写字母、小写字母、数字、特殊字符各至少一个
- 特殊字符限 !@#$%^&*
- 给出 JS 和 Python 两个版本
- 解释每个部分含义
\`\`\`

AI 输出：

\`\`\`js
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,20}$/

// 解释：
// (?=.*[a-z])        正向预查：后面必须有小写字母
// (?=.*[A-Z])        正向预查：后面必须有大写字母
// (?=.*\\d)           正向预查：后面必须有数字
// (?=.*[!@#$%^&*])   正向预查：后面必须有特殊字符
// [A-Za-z\\d!@#$%^&*]{8,20}  匹配 8-20 位允许的字符
\`\`\`

### 场景：从混乱文本提取信息

\`\`\`
从以下日志中提取：时间、IP、状态码、路径
日志格式：
[2024-01-15 10:30:45] 192.168.1.1 GET /api/users 200 45ms
[2024-01-15 10:31:02] 10.0.0.5 POST /api/login 401 12ms
\`\`\`

AI 输出：

\`\`\`js
const logRegex = /^\\[(.*?)\\]\\s+(\\S+)\\s+(\\S+)\\s+(\\S+)\\s+(\\d+)\\s+(\\d+ms)$/

const logs = [...].map(line => {
  const [, time, ip, method, path, status, duration] = line.match(logRegex) || []
  return { time, ip, method, path, status: +status, duration }
})
\`\`\`

### 正则调试技巧

\`\`\`
这个正则为什么匹配失败？
预期：匹配 "2024-01-15" 格式的日期
正则：/\\d{4}-\\d{1,2}-\\d{1,2}/
测试字符串："日期是 2024-1-5 和 2024-01-15"
\`\`\`

让 AI 解释为什么、给修正方案。

## 二、SQL

### 场景：复杂查询

\`\`\`
表结构：
users(id, name, dept_id, created_at)
departments(id, name)
orders(id, user_id, amount, status, created_at)

查询：每个部门本月订单总额 Top 3 的用户
要求：
1. 只统计 status='paid' 的订单
2. 按部门分组，每个部门取前 3
3. 结果含部门名、用户名、订单总额
4. 用 MySQL 语法
\`\`\`

AI 输出：

\`\`\`sql
SELECT d.name AS dept_name, u.name AS user_name, total.amount
FROM (
  SELECT u.id AS user_id, u.dept_id, SUM(o.amount) AS amount,
    ROW_NUMBER() OVER (PARTITION BY u.dept_id ORDER BY SUM(o.amount) DESC) AS rn
  FROM users u
  JOIN orders o ON o.user_id = u.id
  WHERE o.status = 'paid'
    AND o.created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')
  GROUP BY u.id, u.dept_id
) total
JOIN users u ON u.id = total.user_id
JOIN departments d ON d.id = total.dept_id
WHERE total.rn <= 3
ORDER BY d.name, total.amount DESC;
\`\`\`

### 场景：SQL 优化

\`\`\`
这条查询很慢（5秒），表有 100 万行，请优化：
SELECT * FROM orders WHERE DATE(created_at) = '2024-01-15' AND status = 'paid'
\`\`\`

AI 指出问题：

\`\`\`
1. DATE(created_at) 导致索引失效 → 改为范围查询
2. SELECT * 浪费 → 只查需要的列
3. 缺少复合索引
\`\`\`

\`\`\`sql
-- 优化后
SELECT id, user_id, amount FROM orders
WHERE created_at >= '2024-01-15 00:00:00'
  AND created_at < '2024-01-16 00:00:00'
  AND status = 'paid';

-- 建议索引
CREATE INDEX idx_status_created ON orders(status, created_at);
\`\`\`

## 三、Shell 脚本

### 场景：批量处理文件

\`\`\`
写一个 shell 脚本：
1. 遍历 src/ 下所有 .js 文件
2. 把每个文件的 console.log 替换成 // console.log
3. 统计替换了多少处
4. 输出报告到 report.txt
5. 支持 --dry-run 预览不实际修改
\`\`\`

AI 输出：

\`\`\`bash
#!/bin/bash
DRY_RUN=false
[[ "$1" == "--dry-run" ]] && DRY_RUN=true

count=0
report="report.txt"
echo "Console.log 清理报告" > "$report"
echo "运行模式: $([ $DRY_RUN = true ] && echo '预览' || echo '实际修改')" >> "$report"
echo "---" >> "$report"

find src/ -name "*.js" -type f | while read file; do
  matches=$(grep -c "console\\.log" "$file" 2>/dev/null || echo 0)
  if [ "$matches" -gt 0 ]; then
    echo "$file: $matches 处" >> "$report"
    if [ "$DRY_RUN" = false ]; then
      sed -i 's/console\\.log/\/\/ console.log/g' "$file"
    fi
    count=$((count + matches))
  fi
done

echo "---" >> "$report"
echo "总计: $count 处" >> "$report"
cat "$report"
\`\`\`

### 场景：Git 批量操作

\`\`\`
写一个脚本：找出过去 7 天修改过的所有 .ts 文件，
检查是否有未使用的 import（用 tsc --noUnusedLocals），
输出有问题的文件列表。
\`\`\`

## 四、其他实用场景

### 1. Cron 表达式

\`\`\`
"每月最后一个工作日下午 6 点执行" 的 cron 表达式怎么写？
\`\`\`

### 2. jq 数据处理

\`\`\`
用 jq 从这个 JSON 提取所有 status=active 的用户名：
{ "users": [{"name":"a","status":"active"}, {"name":"b","status":"inactive"}] }
\`\`\`

\`\`\`bash
cat data.json | jq -r '.users[] | select(.status=="active") | .name'
\`\`\`

### 3. Vim 操作

\`\`\`
在 Vim 中：把 50-100 行的所有 Tab 替换成 2 个空格，怎么做？
\`\`\`

## 通用技巧

1. **给示例数据**：给 AI 真实输入和期望输出，比描述规则更有效。
2. **要求解释**：让 AI 解释代码含义，方便 review。
3. **要测试用例**：让 AI 同时给测试数据验证。
4. **指定语言版本**：MySQL 还是 PostgreSQL？Bash 还是 Zsh？ES2015 还是 ES2022？
5. **要求边界处理**：空输入、异常格式怎么处理。

## 总结

正则、SQL、Shell 是 AI 最能发挥价值的场景——因为它们语法晦涩、容易出错、人工编写耗时。关键技巧是**用自然语言精确描述意图 + 给示例数据 + 要求解释**，让 AI 生成可验证的代码。`
  },
  {
    id: 'ai-022',
    category: 'aicode',
    title: '用 AI 生成 TypeScript 类型与 API 接口定义',
    difficulty: '中等',
    tags: ['TypeScript', '类型', 'API', '实战'],
    answer: `## 为什么用 AI 生成类型

手写 TypeScript 类型是最枯燥的工作——尤其是从后端 API 文档、数据库 schema、JSON 响应推导类型。AI 能把这些工作自动化。

## 一、从 JSON 生成类型

### 场景：API 返回的 JSON 转类型

\`\`\`
把这个 API 响应转成 TypeScript 类型：
{
  "code": 0,
  "data": {
    "id": 123,
    "name": "张三",
    "roles": ["admin", "editor"],
    "profile": {
      "avatar": "https://...",
      "bio": "前端工程师"
    },
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "success"
}

要求：
1. 严格模式（no any）
2. 用 interface 不用 type
3. 时间字段用 string 还是 Date？给建议
4. 导出所有类型并加 JSDoc
\`\`\`

AI 输出：

\`\`\`typescript
/** API 统一响应结构 */
interface ApiResponse<T = unknown> {
  /** 业务状态码，0 表示成功 */
  code: number
  /** 响应数据 */
  data: T
  /** 提示信息 */
  message: string
}

/** 用户信息 */
interface User {
  /** 用户 ID */
  id: number
  /** 用户名 */
  name: string
  /** 角色列表 */
  roles: UserRole[]
  /** 用户资料 */
  profile: UserProfile
  /** 创建时间（ISO 8601 字符串，用 dayjs 解析） */
  createdAt: string
}

/** 用户资料 */
interface UserProfile {
  avatar: string
  bio: string
}

type UserRole = 'admin' | 'editor' | 'viewer'

type UserResponse = ApiResponse<User>
\`\`\`

## 二、从后端文档生成

### 场景：Swagger / OpenAPI 转 TS

\`\`\`
把这个 Swagger 接口定义转成 TypeScript 请求函数：

POST /api/users
请求体：{ name: string, email: string, role?: 'admin'|'user' }
响应：{ code: 0, data: { id: number } }

要求：
1. 用 axios
2. 请求和响应都有类型
3. 错误处理统一
\`\`\`

AI 输出：

\`\`\`typescript
// types.ts
interface CreateUserRequest {
  name: string
  email: string
  role?: 'admin' | 'user'
}

interface CreateUserResponse {
  code: number
  data: { id: number }
}

// api/user.ts
import { request } from './request'

export function createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
  return request.post('/api/users', data)
}
\`\`\`

## 三、从数据库 Schema 生成

\`\`\`
把这些数据库表转成 TypeScript 类型：
users 表：id(int), name(varchar), email(varchar), created_at(timestamp)
posts 表：id(int), user_id(int), title(varchar), content(text), tags(json)

要求：
1. 日期用 string（序列化后是字符串）
2. tags 解析后是 string[]
3. 给"创建"和"更新"的变体类型
\`\`\`

AI 输出：

\`\`\`typescript
interface User {
  id: number
  name: string
  email: string
  createdAt: string
}

interface Post {
  id: number
  userId: number
  title: string
  content: string
  tags: string[]
  createdAt: string
}

// 创建时不需要 id 和 createdAt
type CreateUser = Omit<User, 'id' | 'createdAt'>
type CreatePost = Omit<Post, 'id' | 'createdAt'>

// 更新时所有字段可选
type UpdateUser = Partial<CreateUser>
type UpdatePost = Partial<CreatePost>
\`\`\`

## 四、复杂类型体操

### 场景：工具类型

\`\`\`
实现一个 DeepPartial<T>，把 T 所有层级的属性都变成可选。
再实现一个 DeepReadonly<T>。
\`\`\`

AI 输出：

\`\`\`typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// 使用
interface Config {
  api: { baseUrl: string; timeout: number }
  ui: { theme: string }
}
type PartialConfig = DeepPartial<Config>
// { api?: { baseUrl?: string; timeout?: number }; ui?: { theme?: string } }
\`\`\`

### 场景：从联合类型提取

\`\`\`
有一组事件类型，请实现：
1. EventMap：事件名到事件数据的映射
2. on<T>(event: T, cb: (data: EventMap[T]) => void)：类型安全的事件监听
\`\`\`

\`\`\`typescript
interface EventMap {
  login: { userId: number; time: string }
  logout: { userId: number }
  purchase: { orderId: string; amount: number }
}

function on<K extends keyof EventMap>(
  event: K,
  cb: (data: EventMap[K]) => void
): void {
  // ...
}

// 类型安全：
on('login', (data) => { data.userId })    // ✅
on('login', (data) => { data.orderId })   // ❌ Error
on('unknown', () => {})                    // ❌ Error
\`\`\`

## 五、类型推导与窄化

### 场景：判别联合

\`\`\`
设计一个 API 结果类型：
- loading 状态：{ status: 'loading' }
- 成功：{ status: 'success', data: User }
- 失败：{ status: 'error', error: Error }

要求使用时能通过 status 窄化类型。
\`\`\`

\`\`\`typescript
type Result<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

function handleResult(result: Result<User>) {
  switch (result.status) {
    case 'loading':
      // result 类型窄化为 { status: 'loading' }
      break
    case 'success':
      // result.data 自动是 User
      console.log(result.data.name)
      break
    case 'error':
      // result.error 自动是 Error
      console.log(result.error.message)
      break
  }
}
\`\`\`

## 六、实用 Prompt 模板

\`\`\`
把以下 [JSON/SQL/Swagger] 转成 TypeScript 类型：
[粘贴数据]

要求：
1. 严格模式，不用 any
2. 加 JSDoc 注释
3. 导出所有类型
4. 日期字段用 string（解释 why）
5. 给出使用示例
\`\`\`

## 常见问题

| 问题 | 解决 |
| --- | --- |
| AI 用了 any | prompt 明确禁止 + 要求 strict |
| 字段命名混乱 | 指定 camelCase 或 snake_case |
| 缺少 null/undefined | 给示例数据包含 null 值 |
| 枚举用 string 还是 number | 让 AI 分析利弊给建议 |
| 嵌套太深 | 要求拆成多个 interface |

## 总结

AI 生成 TypeScript 类型的核心是**给充分的数据样本 + 明确约束**。从 JSON/SQL/Swagger 到类型，从类型到 API 函数，AI 能把类型定义的工作从"小时级"缩短到"分钟级"。关键是严格 review AI 是否正确处理了可选、联合、null 等边界。`
  },
  {
    id: 'ai-023',
    category: 'aicode',
    title: '用 AI 处理遗留代码库：老项目改造与迁移',
    difficulty: '困难',
    tags: ['遗留代码', '迁移', '重构', '实战'],
    answer: `## 遗留代码库的典型痛点

- 没有文档、没有测试、原作者已离职
- 技术栈过时（Vue2 + JS + Webpack3）
- 代码风格混乱、耦合严重
- "能跑就别动"的恐惧心理

AI 在这里的价值：**快速理解代码 + 渐进式改造 + 风险评估**。

## 场景一：理解遗留代码

### 1. 让 AI 生成项目概览

\`\`\`
@codebase 请分析这个项目：
1. 技术栈与版本
2. 目录结构与职责
3. 核心业务模块
4. 数据流向（状态管理如何组织）
5. 存在的技术债（3 个最严重的）
\`\`\`

AI 能在几分钟内给出一份"项目地图"，比人工翻代码快 10 倍。

### 2. 让 AI 解释复杂函数

\`\`\`
@file src/legacy/auth.js 这个 checkPermission 函数逻辑很复杂，
请逐行解释，并画出流程图（用文字描述）。
\`\`\`

### 3. 让 AI 找依赖关系

\`\`\`
@codebase 找出 updateUser 这个函数：
1. 在哪些文件被调用？
2. 它依赖了哪些其他函数？
3. 调用链最深有几层？
\`\`\`

## 场景二：JS → TypeScript 迁移

### 渐进式迁移策略

\`\`\`
不要一次全改！按以下顺序渐进迁移：
1. 先配 tsconfig（allowJs: true）
2. 工具函数（纯函数，风险低）
3. 类型定义文件（src/types/）
4. API 层（src/api/）
5. Store / 状态管理
6. 组件（最后迁移，风险最高）
\`\`\`

### 用 AI 批量加类型

**Step 1：让 AI 分析文件并生成类型**

\`\`\`
为 src/utils/format.js 生成 TypeScript 版本：
1. 推导所有函数的参数和返回值类型
2. 不改变原有逻辑
3. 文件名改为 format.ts
4. 给复杂函数加 JSDoc
\`\`\`

**Step 2：处理第三方依赖**

\`\`\`
这个文件用了 moment.js，但项目要迁到 dayjs。
请把所有 moment 用法替换成 dayjs，保持功能不变。
\`\`\`

**Step 3：处理 any**

\`\`\`
检查这个 TS 文件里的 any，逐个替换成具体类型。
对无法确定的类型，用 unknown + 类型守卫。
\`\`\`

### 迁移示例：Vue2 → Vue3

\`\`\`
把这个 Vue2 组件迁移到 Vue3 <script setup>：

【原代码】
export default {
  data() {
    return { count: 0, name: '' }
  },
  computed: {
    double() { return this.count * 2 }
  },
  methods: {
    increment() { this.count++ }
  },
  mounted() {
    console.log('mounted')
  }
}

【要求】
1. 用 <script setup lang="ts">
2. data → ref/reactive
3. computed → computed()
4. methods → 普通函数
5. mounted → onMounted
6. 保持模板兼容（必要时调整）
\`\`\`

AI 输出：

\`\`\`vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const name = ref('')
const double = computed(() => count.value * 2)

function increment() {
  count.value++
}

onMounted(() => {
  console.log('mounted')
})
</script>

<template>
  <button @click="increment">{{ count }} ({{ double }})</button>
</template>
\`\`\`

## 场景三：技术栈升级

### Webpack → Vite 迁移

\`\`\`
把这个项目的构建工具从 Webpack 4 迁移到 Vite 5：

当前配置：
- webpack.config.js（200 行）
- 用了 webpack-dev-server
- 有多个 loader（babel-loader, css-loader, vue-loader）
- 有自定义插件

请：
1. 列出迁移步骤
2. 给出 vite.config.ts 等价配置
3. 指出哪些 webpack 功能没有 Vite 对应
4. 给出 polyfill 方案（Vite 不自动 polyfill）
\`\`\`

### Element UI → Element Plus

\`\`\`
把项目从 Element UI (Vue2) 迁移到 Element Plus (Vue3)：
1. 组件名变化对照表（el-button 还是 el-button？事件变化？）
2. 按需引入配置
3. 主题定制方式变化
4. 给一个迁移前后的对比示例
\`\`\`

## 场景四：补测试

遗留代码最大问题：没测试，不敢改。

\`\`\`
为 src/utils/legacy.js 补单元测试：
1. 先分析每个函数的输入输出
2. 列出测试场景（正常 + 边界 + 异常）
3. 用 Vitest 写测试
4. 目标覆盖率 80%+
\`\`\`

\`\`\`
这个函数没有文档，行为不明。
请根据代码推导它的"契约"（输入约束、输出保证、副作用），
然后基于契约写测试。
\`\`\`

## 场景五：拆分大文件

\`\`\`
src/utils/helpers.js 有 1500 行，20 个函数混在一起。
请：
1. 分析每个函数的职责
2. 按职责分成 4-5 个文件
3. 保持导出路径不变（用 re-export）
4. 给出迁移步骤（分 commit）
\`\`\`

AI 输出方案：

\`\`\`
建议拆分：
- dateUtils.ts：formatDate, parseDate, relativeTime
- stringUtils.ts：truncate, capitalize, template
- arrayUtils.ts：unique, groupBy, chunk
- validators.ts：isEmail, isPhone, isUrl
- helpers.ts：re-export 上述所有（保持兼容）

迁移步骤（5 个 commit）：
1. 创建新文件，复制函数
2. 在 helpers.ts 加 re-export
3. 跑测试确认通过
4. 逐个文件改 import 路径
5. 删除 helpers.ts 中的旧函数
\`\`\`

## 风险控制

### 1. 每步都验证

\`\`\`
改一步 → 跑测试 → 跑起来看 → 再改下一步
\`\`\`

### 2. 用 Git 保护

\`\`\`
每完成一个小迁移就 commit，出问题能快速回滚。
不要让 AI 一次改 50 个文件。
\`\`\`

### 3. 保留原始文件

\`\`\`
迁移时先复制一份（.bak 或新文件），改完跑通再删旧的。
\`\`\`

### 4. 让 AI 评估风险

\`\`\`
我要把这个文件的 JS 改成 TS，请评估：
1. 可能影响哪些模块？
2. 有哪些隐式依赖（全局变量、原型扩展）？
3. 风险等级（低/中/高）？
4. 建议的验证方式？
\`\`\`

## 反模式

| 反模式 | 后果 | 正确做法 |
| --- | --- | --- |
| 一次性大重构 | 全员加班修 bug | 渐进式、分 commit |
| 不写测试就改 | 改完不知道哪坏了 | 先补测试再改 |
| 信任 AI 的全量改写 | 引入隐蔽 bug | 每步 review + 验证 |
| 迁移时加新功能 | 出问题不知道是谁的锅 | 迁移归迁移，功能归功能 |
| 不留迁移记录 | 下次还要踩坑 | 写 ADR 记录决策 |

## 总结

用 AI 处理遗留代码的核心是**渐进式 + 验证驱动**：让 AI 理解代码、生成迁移方案、辅助编码，但每一步都用测试和运行验证。关键是**小步快走、每步可回滚**——把"大爆炸式重构"变成"可追溯的渐进演化"。`
  },
  {
    id: 'ai-024',
    category: 'aicode',
    title: '如何自建一个 AI 编程助手？（调用 LLM API）',
    difficulty: '困难',
    tags: ['LLM', 'API', '补全', 'MCP', '实战'],
    answer: `## 为什么要自建

- **学习原理**：理解 Copilot/Cursor 的工作机制
- **定制需求**：接入内部知识库、私有模型
- **成本控制**：用开源模型 + 自部署
- **隐私合规**：数据不出内网

## 一、最小可用：调用 LLM API 生成代码

### 基础调用

\`\`\`typescript
// 最简代码生成
async function generateCode(prompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: '你是一个资深前端工程师，只返回代码，不要解释。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2  // 代码生成用低温度
    })
  })
  const data = await response.json()
  return data.choices[0].message.content
}

// 使用
const code = await generateCode('写一个防抖函数，TypeScript')
\`\`\`

## 二、实现代码补全（类 Copilot）

### 核心思路

\`\`\`
光标前代码 + 光标后代码 + 上下文 → LLM → 补全建议
\`\`\`

### 实现

\`\`\`typescript
interface CompletionRequest {
  beforeCursor: string  // 光标前的代码
  afterCursor: string   // 光标后的代码
  language: string      // 语言
  fileName?: string     // 文件名（给 AI 参考）
}

async function completeCode(req: CompletionRequest): Promise<string> {
  const prompt = \`请补全以下代码，只返回补全部分，不要重复已有代码：

文件：\${req.fileName || req.language}
语言：\${req.language}

\`\`\`\${req.language}
\${req.beforeCursor}
/* 光标位置 */
\${req.afterCursor}
\`\`\`
\`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: '你是代码补全助手。只返回要插入的代码，不带 markdown 代码块。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 200,
      stop: ['\\n\\n', 'function', 'class']  // 停止符号
    })
  })
  const data = await response.json()
  return data.choices[0].message.content.trim()
}
\`\`\`

## 三、实现 Chat（带上下文）

### 多轮对话

\`\`\`typescript
class CodeAssistant {
  private messages: Array<{ role: string; content: string }> = []

  constructor(systemPrompt: string) {
    this.messages.push({ role: 'system', content: systemPrompt })
  }

  async ask(question: string, fileContext?: string): Promise<string> {
    const userContent = fileContext
      ? \`相关代码：\\n\${fileContext}\\n\\n问题：\${question}\`
      : question

    this.messages.push({ role: 'user', content: userContent })

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: this.messages,
        temperature: 0.3
      })
    })

    const data = await response.json()
    const answer = data.choices[0].message.content
    this.messages.push({ role: 'assistant', content: answer })

    // 上下文过长时压缩
    if (this.messages.length > 20) {
      this.compressContext()
    }

    return answer
  }

  private compressContext() {
    // 保留 system + 最近 10 条
    const system = this.messages[0]
    const recent = this.messages.slice(-10)
    this.messages = [system, ...recent]
  }
}
\`\`\`

## 四、实现 Function Calling（工具调用）

### 定义工具

\`\`\`typescript
const tools = [
  {
    type: 'function',
    function: {
      name: 'read_file',
      description: '读取项目文件内容',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: '文件路径' }
        },
        required: ['path']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'list_files',
      description: '列出目录下的文件',
      parameters: {
        type: 'object',
        properties: {
          dir: { type: 'string', description: '目录路径' }
        },
        required: ['dir']
      }
    }
  }
]

async function executeTool(name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case 'read_file':
      return await fs.readFile(args.path as string, 'utf-8')
    case 'list_files':
      return JSON.stringify(await fs.readdir(args.dir as string))
    default:
      throw new Error(\`Unknown tool: \${name}\`)
  }
}
\`\`\`

### Agent 循环

\`\`\`typescript
async function runAgent(task: string): Promise<string> {
  const messages = [
    { role: 'system', content: '你是编程助手，可以读写文件来帮助用户。' },
    { role: 'user', content: task }
  ]

  for (let i = 0; i < 10; i++) {  // 最多 10 轮
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        tools,
        tool_choice: 'auto'
      })
    })

    const data = await response.json()
    const msg = data.choices[0].message

    // 没有 tool_call，说明任务完成
    if (!msg.tool_calls) {
      return msg.content
    }

    // 执行工具调用
    messages.push(msg)
    for (const call of msg.tool_calls) {
      const args = JSON.parse(call.function.arguments)
      const result = await executeTool(call.function.name, args)
      messages.push({
        role: 'tool',
        tool_call_id: call.id,
        content: result
      })
    }
  }

  return '任务超出最大轮次'
}
\`\`\`

## 五、接入 RAG（检索增强）

\`\`\`typescript
import { OpenAI } from 'openai'

// 1. 建索引（简化版：按文件存）
async function buildIndex(projectDir: string) {
  const files = await getAllFiles(projectDir, ['ts', 'js', 'vue'])
  const chunks = []
  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8')
    // 按函数切分（简化：按行数）
    const lines = content.split('\\n')
    for (let i = 0; i < lines.length; i += 50) {
      chunks.push({
        file,
        startLine: i,
        content: lines.slice(i, i + 50).join('\\n')
      })
    }
  }
  return chunks
}

// 2. 检索（简化版：关键词匹配，生产用 embedding）
function retrieve(chunks: Chunk[], query: string, topK = 5): Chunk[] {
  return chunks
    .map(c => ({ ...c, score: query.split(' ').filter(w => c.content.includes(w)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
}

// 3. 带上下文的回答
async function askWithContext(question: string, chunks: Chunk[]) {
  const relevant = retrieve(chunks, question)
  const context = relevant.map(c => \`// \${c.file}:\${c.startLine}\\n\${c.content}\`).join('\\n\\n')

  return await askLLM(\`基于以下项目代码回答问题。\\n\\n代码：\\n\${context}\\n\\n问题：\${question}\`)
}
\`\`\`

## 六、成本与性能优化

### 1. 模型分级

\`\`\`
简单补全 → 用小模型（GPT-4o-mini / Claude Haiku）
复杂推理 → 用大模型（GPT-4o / Claude Sonnet）
\`\`\`

### 2. 缓存

\`\`\`typescript
const cache = new Map<string, string>()
function cacheKey(prompt: string) {
  return crypto.createHash('md5').update(prompt).digest('hex')
}

async function askWithCache(prompt: string) {
  const key = cacheKey(prompt)
  if (cache.has(key)) return cache.get(key)!
  const result = await askLLM(prompt)
  cache.set(key, result)
  return result
}
\`\`\`

### 3. 流式输出

\`\`\`typescript
async function* streamChat(messages: Message[]) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { /* ... */ },
    body: JSON.stringify({ model: 'gpt-4o', messages, stream: true })
  })

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value)
    const lines = buffer.split('\\n')
    buffer = lines.pop() || ''
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6))
        const delta = data.choices[0]?.delta?.content
        if (delta) yield delta
      }
    }
  }
}
\`\`\`

## 七、部署为 VS Code 插件

\`\`\`typescript
// 插件入口
import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  // 注册补全提供者
  const provider: vscode.InlineCompletionItemProvider = {
    async provideInlineCompletionItems(document, position) {
      const beforeCursor = document.getText(
        new vscode.Range(new vscode.Position(0, 0), position)
      )
      const suggestion = await completeCode({
        beforeCursor,
        afterCursor: '',
        language: document.languageId,
        fileName: document.fileName
      })
      return [new vscode.InlineCompletionItem(suggestion)]
    }
  }

  context.subscriptions.push(
    vscode.languages.registerInlineCompletionItemProvider(
      { pattern: '**' }, provider
    )
  )
}
\`\`\`

## 总结

自建 AI 编程助手的核心组件：**LLM API 调用 + 上下文构造 + 工具调用（Function Calling）+ RAG 检索**。从最简的 API 调用开始，逐步加上多轮对话、工具调用、RAG，最后封装成插件或 IDE 集成。理解这套原理，不仅能自建工具，更能深刻理解 Copilot/Cursor 等工具的工作机制。`
  }
]
