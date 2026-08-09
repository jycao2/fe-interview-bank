export const networkQuestions = [
  {
    id: 'network-001',
    category: 'network',
    title: 'HTTP 和 HTTPS 的区别？HTTPS 的握手过程？',
    difficulty: '中等',
    tags: ['HTTP', 'HTTPS', 'TLS'],
    answer: `## 区别

| | HTTP | HTTPS |
| --- | --- | --- |
| 端口 | 80 | 443 |
| 传输 | 明文 | TLS/SSL 加密 |
| 证书 | 不需要 | 需要 CA 证书 |
| 性能 | 快 | 略慢（握手开销） |
| 安全性 | 低（可被窃听/篡改） | 高（加密 + 完整性 + 身份认证） |

HTTPS = HTTP + TLS/SSL，在 TCP 之上加一层加密。

## HTTPS 握手（TLS 1.2 简化）

1. **ClientHello**：客户端发送支持的 TLS 版本、加密套件、随机数 Client Random。
2. **ServerHello**：服务端选定套件、返回随机数 Server Random + **证书**（含公钥）。
3. **证书校验**：客户端用 CA 公钥验证证书合法性（链式签名、域名、有效期）。
4. **密钥协商**：客户端生成 Pre-Master Secret，用服务端公钥加密发送（或用 ECDHE 协商）。
5. 双方用 Client Random + Server Random + Pre-Master 生成**会话密钥（对称密钥）**。
6. 后续通信用**对称密钥**加密（性能好）。

> 非对称加密只用于密钥协商，对称加密用于数据传输（兼顾安全与性能）。

## TLS 1.3 优化

- 握手从 2-RTT 减到 1-RTT，支持 0-RTT 恢复。
- 移除不安全算法，强制前向安全（ECDHE）。

## 为什么需要证书

防止中间人攻击：客户端通过 CA 信任链验证服务端身份，确保公钥确实属于目标服务器而非攻击者。`
  },
  {
    id: 'network-002',
    category: 'network',
    title: 'HTTP/1.1、HTTP/2、HTTP/3 的区别？',
    difficulty: '困难',
    tags: ['HTTP/1.1', 'HTTP/2', 'HTTP/3'],
    answer: `## HTTP/1.1

- **持久连接**：默认 keep-alive，复用 TCP 连接。
- **管道化**：可连续发请求，但响应必须按序返回（队头阻塞 HoL）。
- **文本协议**，明文。
- 问题：队头阻塞、头部冗余（每次带完整 Cookie 等）、并发受限（浏览器每域名 6 个连接）。

## HTTP/2

- **二进制分帧**：数据拆为二进制帧，更紧凑高效。
- **多路复用**：一个 TCP 连接上并行多个请求 / 响应，解决应用层 HoL。
- **头部压缩**：HPACK 算法，维护头部表，消除冗余。
- **服务端推送**：服务端可主动推送资源（已逐渐被 preload 取代）。
- **优先级**：可标记请求优先级。
- 问题：底层仍是 TCP，**TCP 层队头阻塞**（丢一个包，整连接等待重传）；连接迁移困难（基于 IP+端口）。

## HTTP/3（基于 QUIC）

- **基于 UDP 的 QUIC 协议**，在传输层解决 TCP 的 HoL。
- **多路复用无 HoL**：一个流丢包不影响其他流。
- **0-RTT / 1-RTT 连接建立**：合并传输层 + TLS 握手，更快。
- **连接迁移**：基于 Connection ID，切换网络（WiFi→4G）不断连。
- **内置加密**：TLS 1.3 集成在 QUIC 中，强制加密。

## 演进核心

\`\`\`
HTTP/1.1: 文本、串行、队头阻塞
HTTP/2:   二进制、多路复用、头部压缩（解决应用层 HoL，仍有 TCP 层 HoL）
HTTP/3:   QUIC/UDP、无传输层 HoL、0-RTT、连接迁移
\`\`\`

## 前端如何利用

- HTTP/2 下：合并雪碧图、域名分片等旧优化**反而有害**（多连接反而劣化），应减少域名、用单一连接。
- 资源预加载（preload / preconnect）依然有效。
- 服务端推送在 HTTP/2 用得不多，HTTP/3 已废弃。`
  },
  {
    id: 'network-003',
    category: 'network',
    title: 'HTTP 缓存机制是怎样的？',
    difficulty: '困难',
    tags: ['缓存', '强缓存', '协商缓存'],
    answer: `## 两级缓存

### 1. 强缓存（不发请求，直接用本地）

命中条件（按优先级）：

- **Cache-Control**（HTTP/1.1，优先）：
  - \`max-age=seconds\`：相对过期时间。
  - \`no-cache\`：不用强缓存，每次都协商（名字误导）。
  - \`no-store\`：完全不缓存。
  - \`public/private\`、\`s-maxage\`（代理缓存）、\`immutable\`。
- **Expires**（HTTP/1.0）：绝对过期时间（依赖客户端时钟，已过时）。

命中时状态码 200（from disk/memory cache），无网络请求。

### 2. 协商缓存（发请求询问是否变化）

强缓存过期后，带条件请求头询问服务端：

- **ETag + If-None-Match**（优先）：资源内容哈希，变化则 ETag 变。
- **Last-Modified + If-Modified-Since**：最后修改时间，精度秒。

服务端对比后：
- 未变 → 返回 **304 Not Modified**（无 body），客户端用本地缓存。
- 已变 → 返回 **200** + 新资源 + 新缓存头。

## 决策流程

\`\`\`
请求资源
 ├─ Cache-Control/Expires 未过期？ → 强缓存命中（200 from cache）
 └─ 过期 or no-cache → 携带 If-None-Match / If-Modified-Since
      ├─ 服务端判定未变 → 304（用本地缓存）
      └─ 已变 → 200（新资源）
\`\`\`

## 常见策略

- **带 hash 的静态资源**（如 app.3a1b.js）：\`Cache-Control: max-age=31536000, immutable\`，一年强缓存；更新靠文件名 hash 变化。
- **HTML**：\`Cache-Control: no-cache\`，每次协商，确保拿到最新入口。
- **频繁变化的 API**：\`no-cache\` + ETag 协商。
- **用户私有数据**：\`private\`，避免 CDN 缓存。

## 启发式缓存

无明确缓存头时，浏览器可能用 \`(Date - Last-Modified) / 10\` 作为缓存时间，应显式设置避免意外缓存。`
  },
  {
    id: 'network-004',
    category: 'network',
    title: 'GET 和 POST 的区别？',
    difficulty: '简单',
    tags: ['GET', 'POST', 'HTTP方法'],
    answer: `## 语义区别

- **GET**：获取资源，**幂等**（多次请求结果一致）、**安全**（不改变服务端状态）、可缓存。
- **POST**：提交数据，**非幂等**、不安全、默认不缓存。

## 技术细节对比

| 方面 | GET | POST |
| --- | --- | --- |
| 参数位置 | URL 查询字符串 | 请求体（body） |
| 长度限制 | 浏览器/服务端有 URL 长度限制（~2KB） | 理论上无限制（受服务端配置） |
| 编码 | URL 编码 | 多种（application/x-www-form-urlencoded、multipart/form-data、application/json） |
| 浏览器历史 / 收藏 | 会保留 URL | 不保留 |
| 后退/刷新 | 无副作用（幂等） | 浏览器会提示重新提交 |
| 缓存 | 可缓存 | 默认不缓存 |
| 安全性 | 参数暴露在 URL，会被日志 / 历史记录 | 相对隐蔽（但仍明文，需 HTTPS） |

## 常见误区澄清

1. **"GET 不能有 body"**：HTTP 规范未禁止，但部分服务器/代理会丢弃或报错，不推荐。
2. **"POST 比 GET 安全"**：仅指参数不暴露在 URL，但抓包都能看到明文，真正的安全靠 HTTPS。
3. **"GET 产生一个 TCP 包，POST 产生两个"**：这是某些浏览器（如 Firefox）对 POST 先发 header（Expect: 100-continue）再发 body 的行为，并非规范，现代大多一次发送。

## 选择

- 查询 / 获取 → GET（幂等可缓存，利于 CDN / 浏览器缓存）。
- 创建 / 提交 / 敏感操作 → POST。
- 更新 → PUT / PATCH，删除 → DELETE（语义化）。`
  },
  {
    id: 'network-005',
    category: 'network',
    title: 'TCP 三次握手与四次挥手？为什么？',
    difficulty: '困难',
    tags: ['TCP', '三次握手', '四次挥手'],
    answer: `## 三次握手（建立连接）

\`\`\`
客户端                 服务端
  | --- SYN, seq=x ---> |   1. 客户端发 SYN，进入 SYN_SENT
  | <-- SYN+ACK, ack=x+1, seq=y -- |  2. 服务端回 SYN+ACK，进入 SYN_RCVD
  | --- ACK, ack=y+1 --> |   3. 客户端发 ACK，双方 ESTABLISHED
\`\`\`

### 为什么是三次

- **确认双方的收发能力**：第一次确认客户端能发；第二次确认服务端能收能发；第三次确认客户端能收。
- **防止历史连接延误**：若两次握手，旧的 SYN 延迟到服务端会建立无效连接，浪费资源。三次握手让客户端有机会用 ACK / RST 拒绝旧连接。
- **同步序列号**：双方需交换并确认初始序列号（ISN），三次才能确认双向序列号。

## 四次挥手（断开连接）

\`\`\`
客户端                  服务端
  | --- FIN, seq=u ---> |   1. 客户端发 FIN，进入 FIN_WAIT_1
  | <-- ACK, ack=u+1 --- |  2. 服务端回 ACK，进入 CLOSE_WAIT；客户端进入 FIN_WAIT_2
  |   （服务端可能还有数据要发）|
  | --- FIN, seq=v ---> |   3. 服务端数据发完后发 FIN，进入 LAST_ACK
  | <-- ACK, ack=v+1 --- |  4. 客户端回 ACK，进入 TIME_WAIT；服务端 CLOSED
  |   （等待 2MSL 后 CLOSED）|
\`\`\`

### 为什么是四次

- TCP 是**全双工**，关闭需要双向各自关闭。
- 服务端收到客户端 FIN 后，可能**还有数据没发完**，所以先回 ACK（第二次），发完数据再发自己的 FIN（第三次），不能像握手那样合并。

### TIME_WAIT 与 2MSL

- 主动关闭方进入 TIME_WAIT，等待 2 倍最大段寿命（MSL）才真正 CLOSED。
- 原因：确保最后的 ACK 能到达对端（若丢失，对端会重发 FIN）；让旧连接的报文在网络中消失，避免影响新连接。
- 大量 TIME_WAIT 会占用端口，服务端可用 \`SO_REUSEADDR\` 等优化。

## 状态速记

- 握手：SYN_SENT → SYN_RCVD → ESTABLISHED
- 挥手：FIN_WAIT_1 → FIN_WAIT_2 → TIME_WAIT；对端 CLOSE_WAIT → LAST_ACK`
  },
  {
    id: 'network-006',
    category: 'network',
    title: '常见 HTTP 状态码有哪些？',
    difficulty: '简单',
    tags: ['状态码', 'HTTP'],
    answer: `## 分类

| 类别 | 含义 |
| --- | --- |
| 1xx | 信息性（很少见） |
| 2xx | 成功 |
| 3xx | 重定向 |
| 4xx | 客户端错误 |
| 5xx | 服务端错误 |

## 常见状态码

### 2xx 成功

- **200 OK**：请求成功。
- **201 Created**：资源创建成功（POST）。
- **204 No Content**：成功但无返回体（DELETE / PUT）。
- **206 Partial Content**：范围请求成功（断点续传、视频流）。

### 3xx 重定向

- **301 Moved Permanently**：永久重定向，缓存，SEO 权重转移。
- **302 Found**：临时重定向，不缓存。
- **304 Not Modified**：协商缓存命中，用本地缓存。
- **307 / 308**：保持原请求方法的重定向（307 临时 / 308 永久），302 可能把 POST 变 GET。

### 4xx 客户端错误

- **400 Bad Request**：请求语法错误。
- **401 Unauthorized**：未认证（需登录 / token）。
- **403 Forbidden**：已认证但无权限。
- **404 Not Found**：资源不存在。
- **405 Method Not Allowed**：方法不允许（如对只读资源 POST）。
- **409 Conflict**：冲突（如重复创建）。
- **413 Payload Too Large**：请求体过大。
- **429 Too Many Requests**：限流。

### 5xx 服务端错误

- **500 Internal Server Error**：服务端内部错误。
- **502 Bad Gateway**：网关收到上游无效响应。
- **503 Service Unavailable**：服务不可用（过载 / 维护）。
- **504 Gateway Timeout**：网关等待上游超时。

## 前端关注点

- 401 → 跳登录 / 刷新 token。
- 403 → 提示无权限。
- 404 → 友好提示 / 重定向。
- 5xx → 重试 / 降级 / 提示稍后再试。
- 304 → 正常的缓存机制，无需处理。`
  },
  {
    id: 'network-007',
    category: 'network',
    title: 'WebSocket 与 HTTP 的区别？应用场景？',
    difficulty: '中等',
    tags: ['WebSocket', '实时通信', 'HTTP'],
    answer: `## WebSocket

- 基于 TCP 的**全双工**通信协议，通过 HTTP 升级握手建立连接后，可在单个连接上双向实时通信。
- 不受同源策略限制（但有自身的 Origin 校验）。

## 建立过程

1. 客户端发起 HTTP 请求，带升级头：
   \`\`\`
   GET /ws HTTP/1.1
   Upgrade: websocket
   Connection: Upgrade
   Sec-WebSocket-Key: ...
   \`\`\`
2. 服务端返回 101 Switching Protocols，连接升级为 WebSocket。
3. 之后双方可在同一 TCP 连接上随时互发消息（帧），无需反复握手。

## 与 HTTP 对比

| | HTTP | WebSocket |
| --- | --- | --- |
| 通信方向 | 请求-响应（单向，客户端发起） | 全双工双向 |
| 连接 | 短连接 / keep-alive | 长连接（持续） |
| 协议头开销 | 较大（每次带 header） | 极小（帧头 2-10 字节） |
| 实时性 | 低（需轮询） | 高（服务端主动推） |
| 状态 | 无状态 | 有状态 |

## 实时通信方案对比

- **短轮询**：客户端定时发请求，简单但延迟高、浪费带宽。
- **长轮询（Long Polling）**：服务端 hold 住请求直到有数据，减少请求次数。
- **SSE（Server-Sent Events）**：服务端单向推送（基于 HTTP），简单，只能服务端→客户端。
- **WebSocket**：双向、低延迟、低开销，适合高频双向通信。

## 应用场景

- 即时通讯 / 聊天。
- 实时协作（文档、白板）。
- 股票 / 行情推送。
- 多人游戏。
- 实时通知。

## 注意

- 需处理断线重连、心跳保活（ping/pong）。
- 鉴权通常在握手 URL（token 参数）或 Cookie / Sec-WebSocket-Protocol 中传递。
- 单纯服务端推送可用更简单的 SSE。`
  },
  {
    id: 'network-008',
    category: 'network',
    title: '前端如何处理跨域？开发环境与生产环境的方案？',
    difficulty: '中等',
    tags: ['跨域', 'CORS', '代理'],
    answer: `## 跨域根因

同源策略：协议 + 域名 + 端口不一致即跨域，浏览器会拦截跨域响应。详见 [同源策略](#) 一题。

## 开发环境：本地代理

利用 Vite / webpack dev server 把请求代理到后端，浏览器看到的是同源请求：

\`\`\`js
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\\/api/, '')
      }
    }
  }
}
\`\`\`

- 代理服务器（同源）转发请求到后端，服务器之间无同源限制。
- 简单、无需后端配合。

## 生产环境

### 方案一：CORS（推荐）

后端配置响应头：

\`\`\`
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
\`\`\`

- 简单请求直接放行；非简单请求先 OPTIONS 预检。
- 携带 Cookie 时不能 \`*\`，需精确域名。

### 方案二：反向代理（Nginx）

用 Nginx 把前后端统一在同一域名下：

\`\`\`nginx
server {
  listen 80;
  location / { root /usr/share/nginx/html; }      # 前端静态
  location /api { proxy_pass http://backend:3000; } # 后端
}
\`\`\`

- 浏览器始终同源，无跨域问题。
- 生产最常用。

### 方案三：BFF / 网关

后端聚合层或网关统一对外，前端只请求 BFF。

## 其他场景

- **跨窗口通信**（iframe / window.open）：postMessage。
- **图片打点**（无跨域限制）：\`<img src>\` / \`navigator.sendBeacon\`。
- **第三方字体 / Canvas 图片**：需服务端 \`Access-Control-Allow-Origin\` + 前端 \`crossorigin\` 属性。

## 选择

- 开发：dev server proxy。
- 生产：CORS 或 Nginx 反代（同源部署最省心）。`
  },
  {
    id: 'network-009',
    category: 'network',
    title: 'TCP 与 UDP 的区别？分别适用什么场景？',
    difficulty: '中等',
    tags: ['TCP', 'UDP', '传输层'],
    answer: `## 核心对比

| | TCP | UDP |
| --- | --- | --- |
| 连接 | 面向连接（三次握手） | 无连接 |
| 可靠性 | 可靠（确认、重传、排序） | 不可靠（尽力而为） |
| 顺序 | 有序到达 | 不保证顺序 |
| 流量 / 拥塞控制 | 有（滑动窗口、慢启动） | 无 |
| 头部开销 | 大（20 字节+） | 小（8 字节） |
| 传输效率 | 略低 | 高 |
| 通信方式 | 点对点 | 一对一 / 一对多 / 多对多（广播、组播） |

## TCP 特点

- **面向连接**：通信前建立连接（三次握手），结束释放（四次挥手）。
- **可靠传输**：序列号 + 确认应答 + 超时重传 + 校验和。
- **有序**：按序列号重组，保证顺序到达。
- **流量控制**：滑动窗口，接收方通告可用缓冲。
- **拥塞控制**：慢启动、拥塞避免、快重传、快恢复，避免网络拥塞。

## UDP 特点

- **无连接**，发送前无需握手，直接发包。
- **不保证可靠 / 顺序**，丢包不重传。
- **轻量**，头部仅 8 字节，开销小。
- **支持广播 / 组播**。

## 适用场景

- **TCP**：要求可靠传输 —— HTTP/1.1、HTTP/2、FTP、SMTP、SSH、文件传输。
- **UDP**：
  - 实时性 > 可靠性 —— 直播、视频会议、VoIP、游戏。
  - DNS、DHCP、SNMP（小包查询，省握手）。
  - QUIC（HTTP/3 基于 UDP，在 UDP 上自实现可靠 + 拥塞控制）。

## 为什么实时通信选 UDP

- 音视频丢一帧不影响整体，重传反而增加延迟。
- TCP 的队头阻塞（一个包丢失阻塞整连接）对实时流是致命的。
- UDP 可在应用层自行取舍可靠性与延迟（如 WebRTC 的 NACK / FEC）。`
  },
  {
    id: 'network-010',
    category: 'network',
    title: 'CDN 的原理与缓存策略是怎样的？',
    difficulty: '中等',
    tags: ['CDN', '缓存', '加速'],
    answer: `## CDN（Content Delivery Network）

通过在多地部署**边缘节点**，让用户就近获取内容，降低延迟、减轻源站压力、提高可用性。

## 工作原理

1. 用户请求域名（如 \`cdn.example.com\`），DNS 解析时根据用户位置 / 运营商，返回**最近的边缘节点 IP**（DNS 调度 / GSLB）。
2. 边缘节点检查本地是否有缓存且未过期：
   - **命中** → 直接返回给用户。
   - **未命中 / 过期** → 回源（向源站或上级 CDN 节点请求），拿到后缓存并返回。

\`\`\`
用户 → DNS 调度 → 就近边缘节点
                  ├─ 命中缓存 → 返回
                  └─ 未命中 → 回源 → 缓存 → 返回
\`\`\`

## 缓存策略

CDN 节点本质是反向代理缓存，遵循 HTTP 缓存机制：

- **Cache-Control**：\`max-age\` 控制边缘节点缓存时长；\`s-maxage\` 专指共享缓存（CDN）的有效期。
- **no-cache / no-store**：no-cache 仍可缓存但每次回源协商；no-store 不缓存。
- **ETag / Last-Modified**：过期后回源协商，未变返回 304。
- **Vary**：按指定请求头（如 Accept-Encoding、User-Agent）缓存不同版本，避免内容错配。
- **源站可主动 Purge**（刷新）CDN 缓存。

## 常见配置

- **静态资源**（带 hash 的 JS/CSS/图片）：长 \`max-age\` + immutable，命中率高。
- **HTML 入口**：短缓存或 no-cache，避免更新延迟。
- **API / 动态内容**：通常不缓存（或短缓存 + 协商），\`private\` 避免被 CDN 缓存用户私有数据。
- **大文件 / 视频**：分片缓存、Range 请求支持。

## 调度方式

- **DNS 调度**：解析时返回不同节点 IP（最常见）。
- **Anycast**：多个节点宣告同一 IP，路由就近。
- **HTTP 302 调度**：先请求调度中心，302 跳转到具体节点。

## 关键收益

- 加速：就近访问，降低 RTT。
- 抗压 / 容灾：边缘分担流量，源站故障时部分缓存仍可服务。
- 安全：隐藏源站 IP，可集成 WAF / DDoS 防护。

## 注意

- 更新静态资源应改文件名 hash，而非覆盖同名文件（CDN 缓存可能未过期）。
- 私有数据务必 \`Cache-Control: private\`，防止 CDN 缓存串用户。
- 注意 Vary 头，避免压缩 / 多语言版本缓存错配。`
  },
  {
    id: 'network-011',
    category: 'network',
    title: 'DNS 解析过程是怎样的？如何做 DNS 预解析？',
    difficulty: '中等',
    tags: ['DNS', '预解析', '性能'],
    answer: `## DNS 作用

把域名解析为 IP 地址。解析过程涉及多级缓存与递归查询。

## 解析流程

1. **浏览器 DNS 缓存**：Chrome 自带 DNS 缓存（约 60s，可调）。
2. **操作系统缓存**：OS 级 DNS 缓存 + hosts 文件。
3. **本地 DNS 服务器**（递归解析器，通常是 ISP / 公共 DNS 如 8.8.8.8）：
   - 查自身缓存，未命中则开始递归查询。
4. **根域名服务器**（.）：返回顶级域（如 .com）服务器地址。
5. **顶级域服务器**（TLD，.com）：返回权威 DNS 服务器地址。
6. **权威 DNS 服务器**（example.com）：返回域名最终 A / AAAA 记录。
7. 结果沿链路返回，各级缓存。

\`\`\`
浏览器缓存 → OS 缓存 → 本地 DNS（递归）
   → 根 → TLD → 权威 DNS → 返回 IP
\`\`\`

## 记录类型

- **A**：域名 → IPv4。
- **AAAA**：域名 → IPv6。
- **CNAME**：别名，指向另一个域名（常用于 CDN 接入）。
- **MX**：邮件服务器。
- **TXT**：任意文本（域名所有权验证、SPF）。
- **NS**：该域的权威 DNS 服务器。

## DNS 预解析（dns-prefetch）

提前对第三方域名做 DNS 查询，使用时省去解析时间：

\`\`\`html
<link rel="dns-prefetch" href="//cdn.example.com">
<link rel="dns-prefetch" href="//api.example.com">
<link rel="dns-prefetch" href="//fonts.gstatic.com">
\`\`\`

- 适用于：会用到但尚未请求的第三方域名（CDN、API、字体、图片域名）。
- 浏览器在空闲时发起解析，不阻塞页面。

## 相关优化

- **preconnect**：DNS + TCP + TLS 握手全部提前，比 dns-prefetch 更进一步，适合关键第三方。
  \`\`\`html
  <link rel="preconnect" href="https://cdn.example.com">
  \`\`\`
- **preload**：预加载具体资源（高优先级）。
- **prefetch**：预取下一页可能用到的资源（低优先级）。

## 注意

- DNS 解析有成本（几十到几百 ms），首屏关键域名尽量减少。
- HTTPS 下浏览器默认不做 dns-prefetch（隐私），可用 \`<meta http-equiv="x-dns-prefetch-control" content="on">\` 开启。
- HTTPDNS：客户端直接 HTTP 请求 DNS 服务绕过运营商劫持（移动端常用）。`
  },
  {
    id: 'network-012',
    category: 'network',
    title: '跨域 Cookie 与 SameSite 属性是怎样的？',
    difficulty: '中等',
    tags: ['Cookie', 'SameSite', '安全'],
    answer: `## Cookie 的跨域携带

默认情况下，浏览器在发起请求时会自动带上**目标域**的同域 Cookie。但跨站（cross-site）请求是否携带 Cookie，由 \`SameSite\` 属性决定。

> 区分"跨域"和"跨站"：同域 = 同协议+域名+端口；同站 = 同 eTLD+1（如 \`a.example.com\` 与 \`b.example.com\` 是同站不同域）。

## SameSite 取值

| 值 | 行为 | 适用 |
| --- | --- | --- |
| **Strict** | 仅同站请求携带，跨站链接 / 第三方嵌入都不带 | 最高安全，但影响体验（从外站跳转过来不登录） |
| **Lax**（默认） | 同站携带；跨站**仅顶层导航的 GET** 携带（如点击链接跳转），其他跨站请求不带 | 平衡安全与体验，现代浏览器默认 |
| **None** | 跨站也携带 | 需第三方 Cookie 场景；**必须同时设 Secure** |

\`\`\`
Set-Cookie: id=abc; SameSite=Strict
Set-Cookie: id=abc; SameSite=Lax
Set-Cookie: id=abc; SameSite=None; Secure
\`\`\`

## 跨域 Cookie 共享

- **同站不同子域**：通过 \`Domain=.example.com\` 让 Cookie 在所有子域共享。
  \`\`\`
  Set-Cookie: token=xxx; Domain=.example.com; Path=/
  \`\`\`
- **完全跨站**：不能直接共享 Cookie；若需携带，必须 \`SameSite=None; Secure\` 且目标域允许（CORS 中 \`Access-Control-Allow-Credentials: true\` + 前端 \`credentials: 'include'\`）。

## 跨域请求携带 Cookie（CORS）

\`\`\`js
fetch('https://api.example.com/data', { credentials: 'include' })
\`\`\`

需同时满足：
1. 前端 \`credentials: 'include'\`。
2. 服务端 \`Access-Control-Allow-Credentials: true\`。
3. \`Access-Control-Allow-Origin\` **不能为 \`*\`**，必须是具体域名。
4. Cookie 的 \`SameSite=None; Secure\`（跨站时）。

## 安全与趋势

- **SameSite 默认 Lax**：有效缓解 CSRF（跨站表单 POST 不再自动带 Cookie）。
- **第三方 Cookie 限制**：Chrome 逐步限制第三方 Cookie（隐私沙盒），依赖跨站 Cookie 的场景需改用其他方案（OAuth、server-side session、Storage Access API）。
- 仍需配合 **HttpOnly**（防 XSS 窃取）和 **Secure**（仅 HTTPS）。`
  },
  {
    id: 'network-013',
    category: 'network',
    title: '正向代理与反向代理的区别？',
    difficulty: '中等',
    tags: ['代理', '正向代理', '反向代理'],
    answer: `## 核心区别

| | 正向代理 | 反向代理 |
| --- | --- | --- |
| 代理对象 | 客户端 | 服务端 |
| 客户端是否感知 | 是（明确知道走代理） | 否（以为直接访问服务端） |
| 服务端是否感知 | 否（以为请求来自代理） | 是（请求都到代理） |
| 主要用途 | 翻墙 / 突破访问限制、隐藏客户端、缓存、过滤 | 负载均衡、安全隔离、缓存、SSL 卸载、路由分发 |

> 口诀：**正向代理代理客户端，反向代理代理服务端**。

## 正向代理

客户端配置代理，请求先发给代理，代理转发给目标服务器，再把响应回客户端。

- 代理知道客户端是谁，目标服务器只看到代理 IP。
- 场景：访问受限资源（翻墙）、企业上网行为管理、爬虫 IP 池、隐藏真实 IP。

\`\`\`
客户端 → 正向代理 → 目标服务器
\`\`\`

## 反向代理

部署在服务端前，客户端直接访问代理地址，代理根据规则转发到后端真实服务器集群。

- 客户端不知道后端真实服务器，以为代理就是服务端。
- 场景：
  - **负载均衡**：Nginx / HAProxy 把请求分发到多台后端。
  - **SSL 卸载**：代理处理 HTTPS，后端用 HTTP。
  - **缓存**：静态资源在代理层缓存。
  - **安全 / 隐藏后端**：后端不直接暴露公网。
  - **路由 / BFF**：按路径分发到不同服务。

\`\`\`
客户端 → 反向代理 → 后端服务器集群
\`\`\`

## Nginx 反向代理示例

\`\`\`nginx
server {
  listen 80;
  location / {
    proxy_pass http://backend_upstream;
  }
  location /static/ {
    root /var/www;
  }
}
upstream backend_upstream {
  server 10.0.0.1:3000;
  server 10.0.0.2:3000;
}
\`\`\`

## 前端开发中的代理

- **dev server proxy**（Vite / webpack）：本质是开发服务器作为正向 / 反向代理，把 \`/api\` 转发到后端，绕过浏览器同源策略（开发环境同源访问代理，代理再访问后端）。
- **生产 Nginx 反代**：前后端统一域名，前端走静态、\`/api\` 转发后端，无跨域问题。

## CDN 与代理

CDN 节点本质是**反向代理 + 缓存**：用户访问 CDN，CDN 命中缓存直接返回，未命中回源。`
  },
  {
    id: 'network-014',
    category: 'network',
    title: 'HTTP 请求方法有哪些？幂等性如何理解？',
    difficulty: '中等',
    tags: ['HTTP', '请求方法', '幂等'],
    answer: `## 常见方法

| 方法 | 语义 | 安全 | 幂等 | 有 body | 缓存 |
| --- | --- | --- | --- | --- | --- |
| GET | 获取资源 | ✅ | ✅ | 一般无 | ✅ |
| POST | 创建资源 / 提交数据 | ❌ | ❌ | ✅ | 默认不缓存 |
| PUT | **完整替换**资源（不存在则创建） | ❌ | ✅ | ✅ | ❌ |
| PATCH | **部分更新**资源 | ❌ | ❌（一般） | ✅ | ❌ |
| DELETE | 删除资源 | ❌ | ✅ | 可有 | ❌ |
| HEAD | 同 GET 但只返回头 | ✅ | ✅ | 无 | ✅ |
| OPTIONS | 查询支持的方法（预检） | ✅ | ✅ | 无 | ❌ |
| TRACE | 回显请求（调试，多禁用） | ✅ | ✅ | 无 | ❌ |
| CONNECT | 建立隧道（HTTPS 代理） | ❌ | ❌ | 无 | ❌ |

## 幂等性（Idempotency）

**幂等**：同一个请求执行一次与执行多次，对资源产生的**副作用相同**（结果一致）。

- **GET**：只读，多次请求结果相同 → 幂等。
- **PUT**：用完整数据替换，多次执行后资源状态一致 → 幂等。
  - 第一次 \`PUT /users/1 {name:'A'}\` 创建；第二次相同请求，资源仍是 \`{name:'A'}\`。
- **DELETE**：删除一次和多次，资源最终都是"已删除" → 幂等。
- **POST**：每次创建新资源（如生成新订单）→ **非幂等**。
- **PATCH**：取决于实现。如果是"设置为 X"则幂等；如果是"增量 +1"则非幂等。

## 安全性（Safe）

**安全方法**：不改变服务端状态（只读）。GET / HEAD / OPTIONS 是安全的。安全方法可被缓存 / 预取，浏览器可自动重试。

## PUT vs PATCH

- **PUT**：替换整个资源，客户端需提供所有字段；缺失字段会被置空 / 移除。
- **PATCH**：只传需要改的字段，其他保持不变。

\`\`\`
PUT /users/1        { "name": "Tom", "age": 20 }   # 整体替换
PATCH /users/1      { "age": 21 }                   # 只改 age
\`\`\`

## 实际使用

- RESTful API 中严格区分语义：
  - 创建 → POST（返回 201 + 新资源 URI）。
  - 整体更新 → PUT。
  - 部分更新 → PATCH。
  - 删除 → DELETE。
- 实际很多项目用 POST 模拟一切（简单但不规范），需要权衡规范与实用。
- 幂等性可用于**安全重试**：网络抖动重试 PUT/DELETE 是安全的，重试 POST 可能产生重复数据（需幂等 key 防重）。`
  },
  {
    id: 'network-015',
    category: 'network',
    title: 'RESTful API 的设计原则是什么？',
    difficulty: '中等',
    tags: ['RESTful', 'API', '设计'],
    answer: `## REST 核心思想

REST（Representational State Transfer）：以**资源**为中心，通过统一接口对资源进行操作，无状态通信。

## 设计原则

### 1. 资源导向（URI 表达资源，不是动作）

URI 是名词，动作用 HTTP 方法表达。

\`\`\`
✗ POST /createUser
✗ GET /getUserList
✓ POST /users
✓ GET /users
\`\`\`

### 2. 用 HTTP 方法表达操作

| 方法 | 用途 | 示例 |
| --- | --- | --- |
| GET | 列表 / 详情 | \`GET /users\`、\`GET /users/1\` |
| POST | 创建 | \`POST /users\` |
| PUT | 整体更新 | \`PUT /users/1\` |
| PATCH | 部分更新 | \`PATCH /users/1\` |
| DELETE | 删除 | \`DELETE /users/1\` |

### 3. 无状态（Stateless）

每个请求自包含所有信息（认证、参数），服务端不依赖会话状态，便于水平扩展 / 负载均衡。

### 4. 用状态码表达结果

- 200 / 201（创建）/ 204（无内容）
- 400 / 401 / 403 / 404 / 409
- 500 / 502 / 503

避免"永远返回 200，用 body 里的 code 表达错误"的反模式。

### 5. 资源关系用嵌套 URI

\`\`\`
GET /users/1/orders          # 用户的订单列表
GET /users/1/orders/99       # 用户的某个订单
\`\`\`

### 6. 版本控制

\`\`\`
/api/v1/users
/api/v2/users
\`\`\`

### 7. 过滤 / 分页 / 排序用查询参数

\`\`\`
GET /users?role=admin&page=1&pageSize=20&sort=-createdAt
\`\`\`

### 8. 统一响应格式

\`\`\`json
{
  "code": 0,
  "message": "ok",
  "data": { "id": 1, "name": "Tom" }
}
\`\`\`

错误时：

\`\`\`json
{ "code": 40101, "message": "token expired", "data": null }
\`\`\`

> 业务码与 HTTP 状态码可并存：HTTP 状态码表达协议层，业务码表达业务细节。

## 常见争议

- **是否严格 REST**：实际中为方便常放宽，如批量操作、复杂动作（\`POST /users/1/disable\`）。可视为 RPC 风格补充。
- **PATCH vs PUT**：多数场景 PATCH 更实用。
- **HATEOAS**：响应中带相关链接（超媒体驱动），理论理想但前端落地少。

## 好的 RESTful API 特征

- URI 自描述、可读。
- 一致的方法语义与状态码。
- 无状态、可缓存。
- 清晰的版本与错误约定。`
  },
  {
    id: 'network-016',
    category: 'network',
    title: '前端鉴权方案有哪些？（Cookie/Session/Token/JWT/OAuth）',
    difficulty: '困难',
    tags: ['鉴权', 'Cookie', 'Session', 'JWT', 'OAuth'],
    answer: `## 常见方案对比

| 方案 | 状态存储 | 携带方式 | 适用 | 特点 |
| --- | --- | --- | --- | --- |
| Cookie + Session | 服务端存 session | Cookie 自动带 | 传统 Web | 服务端有状态，简单 |
| Token（自包含） | 客户端存 token | Authorization 头 | 前后端分离 / API | 无状态，易跨域 |
| JWT | 客户端存 | Authorization 头 | API / 微服务 | 自包含、签名，难撤销 |
| OAuth 2.0 | 授权服务器 | access_token | 第三方登录 | 授权码模式最安全 |

## 1. Cookie + Session

1. 用户登录，服务端创建 session（存内存 / Redis），返回 \`sessionId\` 到 Cookie（HttpOnly）。
2. 后续请求自动带 Cookie，服务端按 sessionId 找到用户。

- 优点：简单，HttpOnly 防 XSS 窃取。
- 缺点：**有状态**，服务端需存 session，分布式需共享 session（Redis）；跨域麻烦；CSRF 风险（用 SameSite / CSRF Token 防御）。

## 2. Token（Bearer Token）

1. 登录后服务端签发一个**不透明 token**（随机串），服务端用 Redis 记录 token→用户。
2. 前端把 token 放 \`Authorization: Bearer xxx\` 请求。
3. 服务端查 Redis 校验。

- 优点：无 Cookie 跨域简单；可主动撤销（删 Redis）。
- 缺点：仍需服务端存储（除非用 JWT）。

## 3. JWT（JSON Web Token）

自包含的 token，三段式：\`Header.Payload.Signature\`。

\`\`\`
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImV4cCI6MTcwMH0.s8K9...
\`\`\`

- **Header**：算法类型。
- **Payload**：声明（userId、过期 exp 等），**Base64 编码（非加密）**，不要放敏感信息。
- **Signature**：用密钥对前两段签名，防篡改。

服务端**无需存储**，验签 + 检查过期即可。

- 优点：无状态、自包含、跨服务方便。
- 缺点：
  - **难主动撤销**：签发后到过期前一直有效（需黑名单 / 短期 + refresh token）。
  - Payload 明文（Base64），不放敏感数据。
  - 续期麻烦：常用 access_token（短期，如 15 分钟）+ refresh_token（长期，存 HttpOnly Cookie）。

\`\`\`js
// 前端
fetch('/api/me', { headers: { Authorization: 'Bearer ' + accessToken } })
\`\`\`

## 4. OAuth 2.0

用于**第三方授权登录**（如"用微信 / GitHub 登录"），最常用**授权码模式（Authorization Code）**：

1. 前端跳转到授权服务器登录页（带 client_id、redirect_uri、state）。
2. 用户同意授权，授权服务器回跳 redirect_uri 并带上 **code**。
3. 后端用 code + client_secret 换取 **access_token**（服务端到服务端，secret 不暴露前端）。
4. 后端用 access_token 调用资源接口获取用户信息，签发自家 token 给前端。

- state 防 CSRF；redirect_uri 严格校验；client_secret 只放后端。
- PKCE（移动端 / SPA 无后端场景）替代 client_secret。

## 安全要点

1. **HTTPS** 全程加密。
2. **access_token 短期** + refresh_token 续期；refresh-token 存 HttpOnly Cookie。
3. token 不要放 localStorage（XSS 可窃取），优先内存 + refresh 兜底。
4. **Cookie**：HttpOnly + Secure + SameSite。
5. 关键操作二次验证（密码 / 验证码）。
6. 登出时撤销 token（黑名单 / 删除 Redis）。

## 选择

- 传统同源 Web → Cookie + Session（HttpOnly）。
- 前后端分离 / 多端 API → Token / JWT（access + refresh）。
- 第三方登录 → OAuth 2.0 授权码 + 自家 token。`
  }
]
