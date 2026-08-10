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
  },
  {
    id: 'network-017',
    category: 'network',
    title: 'QUIC 与 HTTP/3 协议详解：为什么基于 UDP？多路复用无队头阻塞、连接迁移、0-RTT 如何实现？',
    difficulty: '困难',
    tags: ['QUIC', 'HTTP/3', 'UDP', '多路复用'],
    answer: `## 演进脉络

HTTP/1.1 → HTTP/2（基于 TCP，多路复用解决应用层 HoL，但仍有 TCP 层 HoL）→ HTTP/3（基于 QUIC，在 UDP 上自建可靠传输，从传输层消除 HoL）。

## QUIC 是什么

QUIC（Quick UDP Internet Connections）是 Google 主导、IETF 标准化（RFC 9000，2021）的**基于 UDP 的可靠传输协议**，集成 TLS 1.3 加密、多路复用、连接迁移、拥塞控制于一身。

HTTP/3 = HTTP/2 的语义（头部压缩、帧、流）+ **QUIC 作为传输层**替代 TCP。

## 为什么基于 UDP

- TCP 协议在内核实现，升级难（服务器/OS/运营商中间盒都要升级）；UDP 用户态可直接迭代，应用侧下发新特性即时生效。
- TCP 层 HoL 无解：一个包丢了，TCP 必须等重传，同一连接上所有 HTTP/2 流都被阻塞。UDP 没有"必须按序交付"的内核限制，QUIC 在用户态自实现可靠性与流隔离。
- TCP 四元组（src IP:port - dst IP:port）绑定连接，WiFi→4G 切换必须断连；QUIC 用 Connection ID 标识，换 IP 不断连。
- 合并握手：QUIC 在传输层内直接跑 TLS 1.3，把"传输握手 + TLS 握手"合并为 1-RTT（或 0-RTT），比 TCP+TLS 的 3+RTT 快很多。

## QUIC 核心能力

### 1. 传输层多路复用（无队头阻塞 HoL Blocking）

TCP 是**单一流**：字节流按序交付，丢一个序列号的包，后续所有到达的包都必须在内核缓冲区等它重传回来才能上送应用——即使后续包属于另一个 HTTP 请求。

QUIC 在一条 UDP 连接上承载多条**独立的 QUIC Stream**：
- 每个 Stream 自己维护序列号、重传、流控。
- 丢一个 Stream 的包，只会阻塞那一个 Stream，其他 Stream 继续交付。

\`\`\`
UDP 数据报
└─ QUIC Packet
   ├─ Stream 1 帧（HTML 片段，OK）
   ├─ Stream 2 帧（JS 片段，丢了 → 重传，只阻塞 Stream 2）
   └─ Stream 3 帧（CSS 片段，OK → 上送应用，不等 Stream 2）
\`\`\`

这是 HTTP/3 相对 HTTP/2 的**核心性能收益**：高丢包率下（移动弱网、跨国）HTTP/2 因 TCP HoL 实际吞吐暴跌，HTTP/3 不受影响。

### 2. 1-RTT / 0-RTT 连接建立

传统 TCP + TLS 1.3：
- TCP 三次握手 1-RTT → TLS 1.3 握手 1-RTT = 合计 2-RTT 才能发 HTTP 请求（TLS 1.2 要 3-RTT）。

QUIC：
- **首次连接**：Client 在第一个 UDP 包里就带上 ClientHello（TLS 参数）+ 传输参数，Server 返回 ServerHello + 加密握手 + 传输参数 → 合计 **1-RTT** 完成连接建立并加密（传输层与 TLS 握手合并）。
- **会话复连（PSK / Session Ticket）**：
  - **0-RTT**：客户端把"应用数据"直接打在第一个包（用上次协商的密钥），服务端验证合法即可立即处理——**0 次往返就开始发业务请求**。
  - 0-RTT 适用于重复访问用户（CDN 静态资源、电商二次访问）。

0-RTT 风险：重放攻击（攻击者复制 0-RTT 包再发一次会触发业务，如重复下单）。只允许用于幂等请求（GET / HEAD），非幂等（POST）拒绝 0-RTT 降级到 1-RTT。

### 3. 连接迁移（Connection Migration）

TCP 连接由四元组（源 IP:port ↔ 目标 IP:port）唯一标识，切换网络（WiFi → 4G / 换路由器）四元组变了，旧连接作废，必须重新握手。

QUIC 连接由**一个 64 位的 Connection ID** 标识，独立于 IP/端口：
- 用户从 WiFi 切到 4G，源 IP 变了 → 客户端发一个 UDP 包给服务端，带上**旧 Connection ID** → 服务端识别同一连接，继续用新地址发后续包，无需重连。
- 中间 NAT 重绑定端口也不会断。
- 视频会议、实时游戏、长下载的体验极大改善（"走进电梯断网出电梯恢复下载"几乎无感）。

### 4. 内置 TLS 1.3 与加密

QUIC 强制加密（除极少数初始帧外），包头、Payload、流编号大部分都加密，甚至连接关闭帧都加密：
- 抗篡改、抗窃听。
- 减少中间盒（运营商路由器）"好心"修改字段导致的 ossification（协议僵化）——TCP 的新字段常被老旧设备丢弃，QUIC 因为加密，中间盒只能按 UDP 原样转发，后续 QUIC 升级新特性不容易被阻挠。

### 5. 用户态拥塞控制可插拔

TCP 拥塞控制（CUBIC / BBR）在内核，升级困难；QUIC 拥塞控制在用户态实现：
- 可针对业务选不同算法（实时视频用 BBR、长肥管道用 CUBIC、弱网自定义）。
- 支持发送方 pacing（匀速发包，避免 burst）。
- 更细粒度的丢包探测与重传（区分真正丢包 vs 乱序到达，减少不必要重传）。

## HTTP/3 帧与层结构

\`\`\`
HTTP/3（应用层）  HTTP/2 的语义：HEADERS、DATA、SETTINGS 帧，但运行在 QUIC Stream 上
QUIC（传输层）   STREAM、CRYPTO、ACK、PADDING、PATH_CHALLENGE 帧
UDP（网络层）    User Datagram
IP               IP 数据包
\`\`\`

- 每个 HTTP 请求/响应独占一个 QUIC Stream（bidi 双向流），Server Push（已废弃）用 push stream。
- QPACK 替代 HPACK：HTTP/3 的头部压缩算法，比 HTTP/2 HPACK 略改以适配"乱序到达不解阻塞"。

## 部署情况

- **浏览器支持**：Chrome/Edge 2019、Firefox 2021、Safari 15+ 全部支持；HTTPS 下自动协商（Alt-Svc: h3=":443"）。
- **服务端**：Nginx 1.25+ 官方支持；Cloudflare / Fastly / Google CDN 已全球开启；Node 有 @nodejs/quic；Caddy 默认启。
- **网络环境**：少数老旧运营商 / 企业防火墙会阻断 UDP 443 → 浏览器自动回退 HTTP/2（Alt-Svc 控制回退机制）。

## 性能实测收益

| 场景 | HTTP/3 收益 |
| --- | --- |
| 弱网（丢包 2%+） | 比 HTTP/2 快 30~200%（无传输层 HoL） |
| 重复访问 | 0-RTT 比 1-RTT 快数百 ms |
| 移动网络切换 | WiFi/4G 切换连接不断，秒级恢复 |
| 理想网络、短连接 | 1-RTT vs 2-RTT 节省一次 RTT |
| 理想网络、长连接 | 与 HTTP/2 差距不明显（都已多路复用） |

## 常见误区

1. **"HTTP/3 = 快，必须全量上"**：对 HTTP/2 优化很好且网络稳定的站点，收益有限；应先测真实网络分布（移动弱网占比高收益才高）。
2. **"丢开 HTTP/2 直接 3"**：渐进部署，Alt-Svc 允许客户端优先 3、失败回 2。
3. **"QUIC 不丢包"**：QUIC 仍是可靠传输，会丢包会重传，只是一个 Stream 丢包不阻塞其他 Stream。
4. **"UDP = 不安全"**：QUIC 自带 TLS 1.3 强制加密 + 包级认证，比 TCP+TLS 更严格。
5. **"QUIC 就是 TCP 的替代"**：对浏览器 HTTP 流量是替代；但邮件、SSH、数据库连接等仍以 TCP 为主，QUIC 是专用协议。

## 调试工具

- Chrome：\`chrome://net-export/\` 抓 QUIC 事件，上传到 netlog-viewer 分析。
- curl：\`curl --http3 https://example.com\`（需编译带 quiche）。
- h3.is / http3check.net 检查目标站点是否启 HTTP/3。
- DevTools Protocol 的 Network.report* 事件查看请求实际协议（h3）。`
  },
  {
    id: 'network-018',
    category: 'network',
    title: 'TLS 1.3 相比 TLS 1.2 做了哪些改进？握手流程、0-RTT、移除的算法？',
    difficulty: '困难',
    tags: ['TLS', 'TLS 1.3', 'HTTPS', '握手'],
    answer: `## TLS 演进背景

TLS 1.0（1999）→ 1.1 → 1.2（2008）→ 1.3（RFC 8446，2018）。TLS 1.3 的目标：更快、更安全、更简单。

## 改进一：更快的握手（1-RTT / 0-RTT）

### TLS 1.2 完整握手（2-RTT，ECDHE 密钥交换）

\`\`\`
Client                                                  Server
  │── ClientHello (支持的套件, Client Random, key_share?) ──│  1st RTT 开始
  │                                                        │
  │◀── ServerHello (选套件, Server Random, key_share) ────│
  │◀── Certificate                                          │
  │◀── CertificateVerify                                    │
  │◀── ServerKeyExchange (ECDHE 参数签名)                 │  ← 1.2 才有
  │◀── ServerHelloDone                                      │
  │  （客户端计算会话密钥）                                  │  1st RTT 结束 + 2nd 开始
  │── ClientKeyExchange, ChangeCipherSpec, Finished ──────│
  │                                                        │  2nd RTT 结束
  │◀── ChangeCipherSpec, Finished ────────────────────────│
  │                      现在开始发加密 HTTP 请求           │
\`\`\`

合计 **2 RTT** 才能开始发送应用数据（TLS 1.2 + RSA 密钥交换会多一些往返）。

### TLS 1.3 完整握手（1-RTT）

关键变化：
- **删除所有非前向安全的密钥交换（RSA、静态 ECDH）**，强制 (EC)DHE。
- **在 ClientHello 里直接带上所有可能的密钥共享（key_share 扩展）**（预生成几个 ECDHE 临时公钥候选）。
- Server 直接选一个 key_share，**在 ServerHello 里就回自己的 DH 公钥**，把 Certificate 等后续消息和 ServerHello 合并在同一个 RTT 里带回来。

\`\`\`
Client                                                     Server
  │── ClientHello (key_share + 所有可能参数 + cipher_suites) ─│  RTT 1
  │                                                         │
  │◀── ServerHello + key_share 选好                          │
  │◀── EncryptedExtensions                                    │
  │◀── Certificate                                            │  ← 用握手密钥已加密
  │◀── CertificateVerify                                      │
  │◀── Finished                                               │
  │     （两端立刻能算会话密钥了）                              │  RTT 1 结束，立即发 HTTP
  │── Encrypted HTTP request / Finished ───────────────────│
\`\`\`

合计 **1 RTT**，比 1.2 整整少一次往返。跨国 200ms RTT 的情况下，首请求节省 200ms+。

### TLS 1.3 会话恢复：0-RTT

**PSK（Pre-Shared Key）恢复模式**：若客户端持有上次协商的会话票据（PSK），可直接在 ClientHello 里带上 PSK，并且把**应用数据**（HTTP 请求）也和 ClientHello 打在同一个包里发出。

\`\`\`
Client                                                    Server
  │── ClientHello + PSK + [0-RTT Encrypted App Data] ───────│  ← 这里直接带 GET/POST 请求
  │                                                        │
  │◀── ServerHello + Encrypted Extensions + Finished ────│
  │◀── Encrypted HTTP Response ───────────────────────────│
\`\`\`

0 次往返就开始处理业务请求——理想情况下比 1.2 节省几百 ms。

0-RTT 安全前提：
- 服务端必须维护 PSK 的 anti-replay（重放防护），常见策略：PSK 一次性使用、短 TTL、记录 unique ticket id 拒绝重复。
- 非幂等请求（POST）默认拒绝 0-RTT，客户端回退 1-RTT。

## 改进二：更安全——删除大量弱算法

TLS 1.3 对算法做了"砍半"策略，移除了所有已知不安全的选项：

| 类别 | TLS 1.2 存在但 TLS 1.3 删除 |
| --- | --- |
| 密钥交换 | RSA、静态 DH、静态 ECDH（无 PFS） |
| 对称加密 | 3DES、DES、RC4、AES-CBC（CBC 模式）、Camellia、NULL 加密 |
| 哈希 / MAC | MD5、SHA-1、AEAD 以外的 MAC 模式 |
| 压缩 | 所有压缩方法（之前 CRIME/BREACH 攻击） |
| 重协商 | 不安全的 Client-Initiated Renegotiation |
| 其他 | 自定义 DHE 群、不安全的 NamedCurve、各种扩展清洗 |

**TLS 1.3 仅保留：**

- 密钥交换：x25519 / secp256r1 / x448 等 ECDHE 群（强制前向安全 PFS）。
- 密码套件（只有 5 个，TLS 1.2 有 300+ 组合）：
  - TLS_AES_256_GCM_SHA384
  - TLS_CHACHA20_POLY1305_SHA256（移动 ARM 友好）
  - TLS_AES_128_GCM_SHA256
  - 剩下两个是 CBC 被废弃后保留的 GCM/CCM 变体。
- 签名：RSA-PSS RSASSA-PSS、ECDSA（secp256r1/secp384r1）、Ed25519。
- **强制 AEAD 认证加密（GCM / ChaCha20-Poly1305）**，杜绝 padding oracle。

## 改进三：更简单——删改消息与流程

1. **移除 ServerKeyExchange、ClientKeyExchange、ChangeCipherSpec**：
   - 密钥交换参数在 Hello 扩展里（key_share）。
   - ChangeCipherSpec 因为有中间盒兼容问题，只作为"空壳"保留一条，实际加密切换由密钥调度直接进行。
2. **Hello Retry Request（HRR）**：若客户端发送的 key_share 没有服务端支持的群，服务端回 HRR 要求客户端换一个参数重发 ClientHello——仅增加一次往返概率较低。
3. **Key Schedule 简化**：HKDF 分层派生密钥（握手密钥、应用数据密钥、恢复主密钥），密钥调度从 1.2 混乱的 PRF 多阶段改为清晰的 HKDF。
4. **Certificate 消息加密**：1.2 中证书是明文（能被中间人看到你访问的具体证书链，部分攻击利用），1.3 中 Certificate 及之后消息在握手密钥加密下发送，增加隐私。
5. **SNI 加密（ECH / ESNI 前身）**：Encrypted Client Hello，把 ClientHello 里原本明文的 SNI（你访问哪个域名）用公钥加密，只有服务端能解密，防止运营商/DPI 按域名劫持。后续会强制。

## 前向安全（PFS）强制化

PFS（Perfect Forward Secrecy / 完美前向保密）：即使**攻击者现在录下所有密文，未来某一天拿到了服务端证书私钥，也无法解密过去的历史会话**。因为每次会话都用临时 DH 公钥协商会话密钥，私钥只用于身份认证签名。

- TLS 1.2：只有选 ECDHE/DHE 套件才有 PFS，RSA 密钥交换没有。
- TLS 1.3：删除了 RSA 密钥交换，**所有套件都是 (EC)DHE + 临时密钥 → 强制 PFS**。

这对大规模数据泄露和监控是质的提升：现在被记录的 HTTPS 流量，5 年后拿到证书私钥也解不开。

## 兼容性与部署

- 客户端支持：Chrome 70+、Firefox 63+、Safari 14+、Edge 79+、iOS 15+。
- 服务端支持：OpenSSL 1.1.1+、Nginx 1.13+、Caddy、Cloudflare、各大 CDN 默认启。
- 降级策略：TLS 1.3 握手中客户端会在 supported_versions 扩展里列出支持的版本，服务端若无 1.3 自然回 1.2，协议协商失败极少。
- 运维：TLS 1.0/1.1 已被 PCI 禁用，现代站点通常配置 TLS 1.2 起（兼容老系统），优先 1.3。

## 握手性能对比

| 握手类型 | RTT 数 | 典型端到端时间（100ms RTT） |
| --- | --- | --- |
| TLS 1.2 + RSA 完整握手 | 3 | ~600ms+ |
| TLS 1.2 + ECDHE 完整握手 | 2 | ~400ms+ |
| TLS 1.2 + Session Resumption | 1 | ~200ms |
| TLS 1.3 完整握手 | 1 | ~200ms |
| TLS 1.3 + 0-RTT 恢复 | 0 | ~<100ms（客户端直接发请求） |

## 前端开发者能观察到的

- 首次访问冷站：TLS 时间 TTFB 内约 1RTT（DevTools Timing 的 TLS 阶段）。
- 二次访问：看到 0-RTT 的首请求响应几乎与 DNS 解析并行结束。
- 抓包看：TLS 1.3 的消息几乎都加密了；TLS 1.2 还能看到证书明文、ServerKeyExchange。

## 常见面试陷阱

1. **"TLS 1.3 为什么能做到 1-RTT？"**：核心是 ClientHello 里直接带 key_share 预生成 DH 公钥，服务端不用再发 ServerKeyExchange，在 ServerHello 里就能完成 DH 参数交换。
2. **"为什么 TLS 1.3 比 1.2 安全？"**：删除弱算法 + 强制 AEAD + 强制 PFS + 加密 Certificate/ECH。
3. **"0-RTT 的风险？怎么防？"**：重放攻击。服务端做 anti-replay cache、PSK 一次一换、禁止 POST 用 0-RTT。
4. **"TLS 1.3 能被中间盒干预吗？"**：明文部分只剩 ClientHello 基本字段（当前 ECH 未完全落地）。但 ServerHello 及之后全加密，比 1.2 难干预，因为中间盒无法再看握手细节"优化"。`
  },
  {
    id: 'network-019',
    category: 'network',
    title: 'OAuth 2.0 与 OpenID Connect（OIDC）详解：授权码模式、PKCE、Access Token 与 ID Token 的区别？',
    difficulty: '困难',
    tags: ['OAuth2', 'OIDC', '鉴权', '授权码'],
    answer: `## OAuth 2.0 是什么

OAuth 2.0（RFC 6749）是一个**授权（Authorization）框架**：让用户授权"第三方应用"**有限访问**用户在"资源服务器"上的数据，而**不把用户名密码泄露**给第三方。

典型场景："用 GitHub 登录本网站"、"允许头条读取我手机相册"。

### 四个角色

| 角色 | 例子 |
| --- | --- |
| Resource Owner（资源所有者） | 你（最终用户） |
| Client（客户端） | 本网站 app.example.com（要访问你的 GitHub 数据） |
| Authorization Server（授权服务器） | GitHub 登录中心（发放令牌） |
| Resource Server（资源服务器） | GitHub user API（返回你的头像、昵称） |

## OAuth 2.0 四种授权模式

| 模式 | 流程简化 | 适用 |
| --- | --- | --- |
| **Authorization Code（授权码，推荐）** | 前端拿 code → 后端 code→token | Web 有后端、生产最安全 |
| Authorization Code + PKCE | 加 code_challenge，无 client_secret | SPA、移动端、原生 App |
| Client Credentials | client_id + secret → token | 机器对机器、无用户参与（后台 API） |
| Implicit（已废弃） | 直接返回 access_token 在 URL 里 | 老 SPA，不安全 |
| Password（已废弃） | 用户名密码 → token | 只有自家 App 能凑合 |

## 授权码模式（Authorization Code Grant）

最常用的"第三方登录"流程，也是面试重点：

\`\`\`
          1. 用户点"GitHub登录"
用户浏览器 ──────────────────▶ Client（前端）
                                  │
                                  │ 2. 302 跳授权服务器，带参数
                                  │    response_type=code
                                  │    client_id=abc123
                                  │    redirect_uri=https://app.example.com/cb
                                  │    scope=user:read
                                  │    state=xyz（防CSRF）
                                  ▼
                            GitHub Authorization Server
                                  │
                            3. 用户登录 GitHub + 点击"同意授权"（授权页面）
                                  │
                                  │ 4. 302 回跳 redirect_uri，带：
                                  │    code=AUTH_CODE（一次性授权码）
                                  │    state=xyz（前端比对）
                                  ▼
用户浏览器 ◀────────────────── Client（前端）
  │
  │ 5. 浏览器访问 /cb 页面，前端把 code 发给后端
  ▼
Client 后端 ─────── 6. 后端 code + client_id + client_secret + redirect_uri
                     POST https://github.com/login/oauth/access_token
  │
  │ 7. 授权服务器校验后返回：access_token (, refresh_token, expires_in)
  ▼
Client 后端
  │
  │ 8. 后端用 access_token 调 Resource Server：
  │    GET https://api.github.com/user  +  Authorization: Bearer xxx
  ▼
Resource Server (GitHub) 返回 {id, name, avatar_url, email}
  │
  │ 9. Client 后端：根据 GitHub id 查自家系统用户（无则创建）
  │    → 签发自家系统的 Session/JWT → 返回前端登录成功
\`\`\`

### 参数详解

- **client_id / client_secret**：在授权服务器提前为 App 申请的标识。secret **绝对不能暴露给浏览器**，只能后端持有。
- **redirect_uri**：授权后回跳地址，授权服务器严格白名单校验（URL 全匹配）。
- **scope**：权限范围（user:read、repo:write 等），用户同意时能看到授权清单。
- **state**：随机字符串，前端生成→授权服务器原封不动带回→前端校验一致。防 CSRF（防止攻击者诱导受害者用攻击者的 code 登录）。
- **response_type=code**：告知授权服务器使用授权码模式。

### 为什么要"先给 code，再换 token"（两步？不能直接给 token？）

1. **前端通道不安全（URL / Referer / 浏览器历史）**：token 直接放 redirect_uri 里容易泄露；授权码只有一次有效、时效极短（几分钟），即使被截获也只能用一次。
2. **Client Secret 不暴露**：code→token 交换在后端到后端（POST）完成，前端永远看不到 secret，减少泄露面。
3. **能做客户端认证**：授权服务器在这一步验证 client_id + secret 对得上，防止别人冒充你的 App 拿 token。

## PKCE（Proof Key for Code Exchange，授权码交换证明）

原生 App 与 SPA（无后端，没法安全存 client_secret）场景下对授权码的增强，RFC 7636，**推荐所有现代 OAuth 客户端启**。

### 流程差异

1. App 在发起授权前生成一对：
   - \`code_verifier = 随机高熵字符串\`
   - \`code_challenge = BASE64URL(SHA256(code_verifier))\`
2. **跳授权服务器时**带：
   - \`code_challenge\` + \`code_challenge_method=S256\`（服务端保存）
3. **code→token 交换时** App 再带上：
   - \`code_verifier\`（明文）
4. 授权服务器用收到的 verifier 按 S256 算一遍，和之前存的 challenge 对比：
   - 一致 → 证明"申请授权的人"就是"拿 code 换 token 的人"。
   - 不一致 → 拒绝。

效果：即使攻击者在移动端通过自定义 URI scheme 截获了 \`code\`，没有 \`code_verifier\` 也换不到 token——**把本来靠 client_secret 保证的安全，改为"用户设备上临时生成的密钥"保证**。

OIDC、现代 Auth0 / Cognito 对 SPA 和移动端强制 PKCE。

## Access Token vs Refresh Token

| 令牌 | 作用 | 生命周期 | 存储建议 |
| --- | --- | --- | --- |
| **Access Token** | 调用 Resource Server 时放 Authorization: Bearer | 短（15 分钟~2 小时） | 放内存、短期 cookie；尽量不要 localStorage（XSS 可偷） |
| **Refresh Token** | 过期后用它换新 access_token，不用用户再登录 | 长（1 天~几 0 天） | HttpOnly + Secure + SameSite Cookie 最佳 |

刷新流程：
\`\`\`
POST /token
  grant_type=refresh_token
  &refresh_token=xxx
  &client_id=...
  (&client_secret=... 非 PKCE)
→ 返回 { access_token, refresh_token（可轮换）, expires_in }
\`\`\`

Refresh Token Rotation（推荐）：每次刷新返回新的 refresh_token，旧的作废，一旦泄露立刻失效，且能检测重放攻击。

## OpenID Connect（OIDC）= OAuth 2.0 + 身份认证

OAuth 2.0 是**授权**（"允许谁访问什么数据"），不是**认证**（"你是谁"）。比如我有 GitHub token，只能知道"我有权调 user API"，但并不知道"当前登录的是哪个用户"——还得额外调一次 user 接口。

OIDC（OpenID Connect Core 1.0）在 OAuth 2.0 上加一层，解决认证：

- 授权时 scope 加 \`openid\`。
- 令牌除了 access_token，**多返回一个 ID Token（JWT）**。
- 定义了 \`UserInfo Endpoint\` 用 access_token 拿完整用户信息。

### ID Token（JWT）

ID Token 是一个 JWT，Header.Payload.Signature，Payload 标准字段：

| 声明 | 含义 |
| --- | --- |
| iss (issuer) | 授权服务器 URL，如 https://accounts.google.com |
| sub (subject) | 用户的唯一 ID（稳定不变，如 10086） |
| aud (audience) | 我的 client_id |
| exp / iat | 过期时间 / 签发时间 |
| nonce | 客户端传入随机值，防止重放 |
| auth_time | 用户实际认证时间 |
| name / email / picture | （可选）用户信息 |

客户端（有验签能力的后端/SPA 库）验签 JWT：
1. 签名正确（用授权服务器公开的 JWKS）。
2. iss / aud / exp / nonce 校验通过。

**验签通过即证明"这个用户在授权服务器认证成功了"，无需额外调 user 接口。** 这就是 OIDC 比 OAuth 2.0 多的"认证"能力。

### Access Token vs ID Token（面试必考）

| | Access Token | ID Token |
| --- | --- | --- |
| 作用 | 访问资源服务器（API）的凭据 | 证明用户"已认证"，携带身份信息 |
| 格式 | 任意（opaque string 或 JWT） | 必须是 JWT |
| 使用者 | Client 后端发请求给 Resource Server | Client 前端/后端判断用户身份、登录取昵称 |
| 给谁看 | 只给 Resource Server 看 | 给 Client 自己看 |
| 能否替代对方 | ❌ 不能当 ID Token 用（不保证含 sub） | ❌ 绝不能用来调 Resource Server（aud 与权限不匹配） |

**严重错误示例**：
- "我的 SPA 用 ID Token 调后端业务接口" → 错误。业务接口应校验 Access Token（或自家 JWT）。
- "我拿到 Access Token 就直接解码用户 id" → 错误。Access Token 不保证是 JWT，也不保证有 sub；应解码 ID Token 或调 UserInfo。

### 标准端点（OIDC Discovery /.well-known/openid-configuration）

OIDC 提供自动发现：GET \`https://auth.example.com/.well-known/openid-configuration\` 返回所有端点：authorization_endpoint、token_endpoint、userinfo_endpoint、jwks_uri、supported scopes 等。写 OIDC SDK 几乎不用手动配置 URL。

## 安全要点清单

1. **绝不使用 Implicit / Password 模式**。
2. **Web 应用一律授权码模式（有后端）+ state**。SPA / 移动端必须加 **PKCE S256**。
3. **redirect_uri 严格白名单**（精确匹配，不能正则宽松）。
4. **client_secret 只在后端用**，前端绝不打包。
5. **nonce（OIDC）+ state（OAuth CSRF）**：两者都用，不同随机值，存 Session/HttpOnly Cookie。
6. **access_token 短期 + refresh_token 轮换（Rotation）+ 吊销机制**。
7. **签名算法 RS256（非对称）**，拒绝 HS256（共享密钥）客户端可造伪。用 JWKS 验签，别硬编码公钥。
8. **scope 最小化**：只申请必要权限，过多 scope 被用户拒绝的概率高。
9. **所有通信 HTTPS**（授权服务器 + 你的 client 回调）。
10. **Token 不放在 localStorage**：XSS 可偷，优先内存 + HttpOnly Cookie 存储 refresh。

## 常见坑

- **授权码只能用一次**：再次提交应被拒绝，同时吊销之前基于该 code 签发的所有 token（防并发竞争窃取）。
- **redirect_uri 开放过宽（如允许通配符子域）** → 子域 XSS 就能拿到 code 换 token。
- **把 GitHub/Google access_token 当自家会话** → 错。应该用 OAuth 完成后签发自家 JWT/Session。OAuth token 仅在后端一次性调 user 接口用，用完丢弃。
- **State 绑定到当前会话**：不要存在全局 storage 跨用户共享。`
  },
  {
    id: 'network-020',
    category: 'network',
    title: 'WebSocket 协议细节：帧结构、掩码、心跳 ping/pong、关闭码、扩展（压缩、多路复用）？',
    difficulty: '中等',
    tags: ['WebSocket', '协议', '实时通信'],
    answer: `## WebSocket 协议概览

WebSocket（RFC 6455，2011）是一个**基于 TCP 的应用层协议**，通过 HTTP Upgrade 握手建立连接后，转为长连接、**全双工、二进制/文本帧**的消息通道。

默认端口：ws:// = 80，wss:// = 443（WSS = WebSocket over TLS，生产必须用）。

## 建立连接：HTTP Upgrade 握手

客户端发起 HTTP 请求，带 Upgrade 头：

\`\`\`http
GET /chat?room=123 HTTP/1.1
Host: ws.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==      # 随机 16 字节 Base64
Sec-WebSocket-Version: 13
Origin: https://app.example.com                   # 服务端可做来源校验
\`\`\`

服务端返回 101 Switching Protocols：

\`\`\`http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=  # Key + GUID 后 SHA1 + Base64
\`\`\`

握手校验：
- 客户端生成随机 Sec-WebSocket-Key。
- 服务端按 RFC：计算 \`Base64(SHA1(Key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"))\` 作为 Accept。
- 客户端验证 Accept 正确，确认对方确实是 WebSocket 服务器而非 HTTP 缓存"误命中"。

## 为什么还需要 Origin 校验

WebSocket **不受浏览器同源策略限制**（可跨域连任意服务端）。服务端必须自行校验 \`Origin\` 头是否在白名单里，否则任何恶意网站都能连你的 WebSocket 服务器发起 CSRF 式攻击（用户已登录 Cookie 会自动带上，导致在用户不知情下发送实时消息）。

## 数据帧结构（RFC 6455 §5.2）

每个 WebSocket 消息被拆成若干**帧（Frame）**。二进制帧格式（单位：位）：

\`\`\`
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-------+-+-------------+-------------------------------+
|F|R|R|R| opcode|M| Payload len |    Extended payload length    |
|I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
|N|V|V|V|       |S|             |   (if payload len==126/127)   |
| |1|2|3|       |K|             |                               |
+-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - -+
|     Extended payload length continued, if payload len == 127  |
+ - - - - - - - - - - - - - - - +-------------------------------+
|                               |Masking-key, if MASK set to 1  |
+-------------------------------+-------------------------------+
| Masking-key (continued)       |          Payload Data         |
+-------------------------------- - - - - - - - - - - - - - - - +
:                     Payload Data continued ...                :
+ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
|                     Payload Data continued ...                |
+---------------------------------------------------------------+
\`\`\`

### 字段详解

| 字段 | 位长 | 含义 |
| --- | --- | --- |
| FIN | 1 | **是否本消息最后一帧**：1=是，0=消息还有后续分片帧 |
| RSV1/2/3 | 各 1 | 扩展保留位（压缩、多路复用等扩展用），无扩展必须 0 |
| opcode | 4 | 帧类型，见下表 |
| MASK | 1 | 是否掩码：客户端 → 服务端帧必须为 1；服务端 → 客户端必须为 0 |
| Payload len | 7 | 负载长度：<126=实际；126→接下来 2 字节；127→接下来 8 字节（64 位） |
| Masking-key | 32 | MASK=1 时存在：4 字节掩码密钥，加密数据用 |
| Payload Data | 变长 | 实际消息体（若掩码则已 XOR 加密） |

### opcode（操作码）

| 值 | 含义 |
| --- | --- |
| 0x0 | 延续帧（continuation）：分片消息的后续帧 |
| 0x1 | 文本帧（UTF-8 编码） |
| 0x2 | 二进制帧 |
| 0x3-7 | 保留给未来非控制帧 |
| 0x8 | 关闭帧（Connection Close） |
| 0x9 | Ping（心跳） |
| 0xA | Pong（心跳回应） |
| 0xB-F | 保留给未来控制帧 |

## 掩码机制（Masking）

**客户端发送给服务端的每一个数据帧必须做掩码**：
- 客户端生成 4 字节随机 masking-key。
- 对每个 payload 字节 \`data[i]\`，计算：\`data[i] ^= mask[i % 4]\`（XOR）。
- 服务端收到后，用收到的 masking-key 再 XOR 一次还原原文。

为什么要掩码？**防代理缓存误投毒（cache poisoning）**：早期研究发现，若 HTTP 中间代理看到 WebSocket 数据里"看起来像 HTTP 响应"的字节（如有 "HTTP/1.1 200..." 文本），可能误以为是 HTTP 响应而缓存。掩码让"攻击者构造的 WebSocket payload"在链路上永远呈现随机字节，无法被代理缓存。

反之，服务端发客户端不需要掩码（客户端不缓存）。

## 分片与消息边界

一条大消息可以被拆成多帧发送：
- 第一帧 opcode=0x1（文本）或 0x2（二进制），FIN=0。
- 中间若干帧 opcode=0x0（continuation），FIN=0。
- 最后一帧 opcode=0x0，FIN=1。
- 控制帧（Close/Ping/Pong）可以插在分片消息中间，不中断分片。

浏览器 JS 层通常不用关心分片（WebSocket API 自动合并成一条 onmessage）；但服务端实现需要处理。

## 心跳：Ping / Pong

连接空闲时 TCP 层可能被 NAT / 防火墙因为"长时间无数据包"而踢掉。应用层 Ping/Pong 定时探活：

- 任何一端发 **Ping 帧**（opcode=0x9，可带少量数据）。
- 对端收到 Ping 后必须尽快回 **Pong 帧**（opcode=0xA，数据原样复制回去）。
- 若连续几次 Pong 超时没收到 → 主动关连。

浏览器 JS 没有**主动**发 Ping 的 API（浏览器内部自动处理）；服务端应负责发 Ping（通常 30~60 秒一次）。

JS 层如果要自己探活，用业务级心跳消息（setInterval 发 {type:'ping'}）。

## 关闭帧与关闭码

任一端发 Close 帧（opcode=0x8），对端收到必须尽快回 Close 帧（TCP 关闭前必须双向关 WebSocket）。Close 帧 Payload 前 2 字节是无符号 16 位关闭码（大端），之后可选 UTF-8 关闭原因字符串。

常见关闭码：

| 码 | 含义 |
| --- | --- |
| 1000 | 正常关闭 |
| 1001 | 端点离开（浏览器页签关闭 / 服务端停机） |
| 1002 | 协议错误 |
| 1003 | 收到不支持的数据类型（如只能文本收到二进制） |
| 1005 | 保留：表示实际未收到关闭码 |
| 1006 | 保留：表示异常关闭（没收到 Close 帧 TCP 就断了） |
| 1007 | 数据不一致（文本帧非 UTF-8） |
| 1008 | 违反策略（通用） |
| 1009 | 消息过大 |
| 1011 | 服务端内部错误 |
| 3000-3999 / 4000-4999 | 自定义业务关闭码 |

## 扩展：压缩（permessage-deflate）

WebSocket 扩展通过握手时 HTTP 头 \`Sec-WebSocket-Extensions\` 协商：

\`\`\`
# 请求
Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits
# 响应
Sec-WebSocket-Extensions: permessage-deflate; server_max_window_bits=15
\`\`\`

开启 \`permessage-deflate\`（DEFLATE 压缩，RFC 7692）：
- 传输文本（JSON）时压缩率非常高（JSON 通常能压 60-90%）。
- 浏览器基本都支持，服务端 ws、uWebSockets.js 默认协商开启。
- 此时 RSV1 位=1 表示该帧是 DEFLATE 压缩帧。

## 扩展：多路复用

单 TCP 连接上承载多个"逻辑通道"（类似 HTTP/2 Stream），比如一个 WebSocket 同时跑聊天 + 推送 + 数据同步，避免多个 WS 握手与长连占用。

- \`multiplex\` 扩展（RFC 8323，coap 适配；ws 早期私有扩展）：不多见，主流用 JSON 里自己带 channel id 实现应用层多路复用更实用。
- 若需极致效率，业务场景（协同编辑、游戏）多采用应用层自研多路复用心跳帧结构。

## 消息大小与限制

- 理论上支持 64 位长度（16 EB，超大）。
- 实际服务端都配置上限（Nginx 默认 1MB，Node ws 默认 100MB）。
- **超过 1MB 的大二进制内容建议分片发送 + 进度回调**，避免单帧阻塞连接导致心跳来不及发送而被踢。

## 浏览器 WebSocket API 要点

\`\`\`js
const ws = new WebSocket('wss://ws.example.com/chat?token=xxx')
ws.onopen = () => console.log('open')
ws.onmessage = (e) => {
  // e.data 若是文本是 DOMString，二进制是 Blob/ArrayBuffer（ws.binaryType 控制）
}
ws.onerror = () => {}
ws.onclose = (e) => console.log(e.code, e.reason, e.wasClean)

ws.send(JSON.stringify({ type: 'msg', text: 'hi' }))   // 文本
ws.send(new Uint8Array([1,2,3]))                        // 二进制
\`\`\`

注意：
- 鉴权通常放 URL 查询参数（?token=jwt）或 Cookie；子协议头 \`Sec-WebSocket-Protocol\` 也行。
- **断线重连必须手动实现**：onclose 里退避重试（1s, 2s, 4s, ...）。
- 发送前要检查 \`ws.readyState === WebSocket.OPEN\`，否则抛错。

## 常见实现库

- **服务端（Node）**：ws（纯 JS，稳定标准）、uWebSockets.js（C++ 绑 Node，高并发性能 10x+）、Socket.IO（上层封装，带自动重连 + 房间 + ACK）。
- **前端**：原生浏览器 WebSocket 就够用；断线重连 + 心跳简单封装或用 reconnecting-websocket、Socket.IO client。
- **注意**：Socket.IO 不是纯 WebSocket，会尝试 long polling 升级；对端非 Socket.IO 服务端不能直接连。

## 与 SSE / 长轮询对比（温习）

| | WebSocket | SSE | 长轮询 |
| --- | --- | --- | --- |
| 方向 | 全双工 | 仅服务端 → 客户端 | 客户端发起"一问一答" |
| 协议 | 独立协议（HTTP 握手升级） | HTTP 长连接（text/event-stream） | HTTP 短轮询变种 |
| 二进制支持 | ✅ | ❌（仅文本） | ❌ |
| 心跳/重连 | 需自研（或库） | 浏览器自动断线重连 + Last-Event-ID | 纯自研 |
| 跨平台兼容 | 现代浏览器 IE10+ | 现代浏览器（可用 polyfill），IE 完全不行 | 所有 |
| 合适场景 | 聊天、协同、游戏、双向实时 | 股票推送、通知（仅需服务端推） | 最兼容的简单通知 |`
  },
  {
    id: 'network-021',
    category: 'network',
    title: 'CORS 预检（Preflight）深入：什么请求会触发 OPTIONS？预检响应头、缓存、安全问题？',
    difficulty: '中等',
    tags: ['CORS', '预检', 'OPTIONS'],
    answer: `## CORS 回顾

浏览器在跨域请求时，根据请求是"简单请求"还是"预检请求"采取不同策略。CORS 的本质是**服务端通过响应头显式授权**浏览器放行跨域响应。

## 简单请求（Simple Request，不触发预检）

同时满足全部条件才叫简单请求，浏览器会直接发出，不会先发 OPTIONS：

1. **方法**是 \`GET / HEAD / POST\` 三者之一。
2. **请求头**只包含以下安全头集合（CORS-safelisted request-header）：
   - \`Accept\`、\`Accept-Language\`、\`Content-Language\`
   - \`Content-Type\`（仅允许以下三种值之一）
     - \`application/x-www-form-urlencoded\`
     - \`multipart/form-data\`
     - \`text/plain\`
3. \`Content-Type\` 如上，不得出现其他值（如 application/json）。
4. **请求中无** \`UploadEvent\` 的事件监听（XHR upload 进度回调会触发预检）。
5. **无 ReadableStream 对象**被用作请求体。

典型简单请求：
- GET / HEAD（无自定义头）
- HTML \`<form>\` 默认表单提交（application/x-www-form-urlencoded）

## 预检请求（Preflighted Request）

**只要不满足"简单请求"任何一条**，浏览器都会先发送一个 **HTTP OPTIONS 方法** 的请求（预检）给目标域，确认服务端允许后续"真正的请求"。

典型会触发预检的操作：
- PUT / PATCH / DELETE 方法。
- POST 但 Content-Type: application/json（最常见，如 fetch JSON）。
- 带自定义请求头：\`Authorization\`、\`X-Requested-With\`、\`X-CSRF-Token\`、\`X-Trace-Id\`。
- 带 \`Accept: application/vnd.api+json\` 这种非安全 Accept 值。
- 带 \`credentials: 'include'\` + 自定义头。
- fetch 用 \`mode: 'cors'\` 发非简单请求。

### OPTIONS 预检请求头示例

\`\`\`http
OPTIONS /resource HTTP/1.1
Host: api.other.com
Origin: https://app.example.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: Authorization, Content-Type
\`\`\`

关键字段：
- **Origin**：发起方。
- **Access-Control-Request-Method**：接下来真请求要用的方法（PUT）。
- **Access-Control-Request-Headers**：接下来真请求要带的自定义头（多个逗号分隔）。

### 预检响应头（服务端必须返回）

\`\`\`http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, X-CSRF-Token
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
Vary: Origin
\`\`\`

### 每个响应头详解

| 响应头 | 作用 | 注意事项 |
| --- | --- | --- |
| **Access-Control-Allow-Origin**（必选） | 允许的源 | 不能为 \`*\` + credentials:true；必须精确匹配；多源按需回显请求的 Origin 值 |
| **Access-Control-Allow-Methods** | 允许的方法列表 | 用逗号分隔，预检通过才能发实际方法 |
| **Access-Control-Allow-Headers** | 允许的自定义头 | 预检里 Request-Headers 出现的头必须这里包含，否则失败 |
| **Access-Control-Allow-Credentials** | 是否允许携带 Cookie / Authorization + credentials | 与前端 \`credentials: 'include'\` 必须同时存在/同时不存在 |
| **Access-Control-Max-Age** | 预检结果缓存秒数 | 期间同 URL/方法/头不再发 OPTIONS，减少请求；Chrome 上限 7200s（2h），默认 5s；Firefox 上限 86400s |
| **Access-Control-Expose-Headers**（放实际响应，非预检） | 允许 JS 读取哪些响应头 | 除 Cache-Control / Content-Language / Content-Type / Expires / Last-Modified / Pragma 这 6 个 safelisted 头外，其他（如 X-Total-Count）必须显式 Expose，JS 的 xhr.getResponseHeader() 才拿得到 |
| Vary: Origin | 告诉 CDN/代理：同 URL 不同 Origin 要缓存不同版本 | 防止 Allow-Origin 返回错值缓存串用户（非常重要） |

## 缓存与重复请求

### 预检缓存（Access-Control-Max-Age）

- **缓存键 = Origin + 请求 URL + 方法 + 头集合**（同一会话内）。
- 一旦缓存，浏览器在 Max-Age 内遇到匹配请求，跳过 OPTIONS 直接发实际请求，减少 RTT。
- 过短会导致大量 OPTIONS 浪费 RTT（跨国 OPTIONS 200ms 就白等一次）；生产建议 3600~86400s。
- DevTools 中"Disable cache"也会禁用预检缓存。

### 为什么请求看起来"每次都预检"

- 每次改方法/头缓存键失效。
- 浏览器重启后缓存清空。
- Max-Age 没设或 5s 太短。
- Chrome DevTools disable cache 开启了。
- 多个 Tab 或 Service Worker 有不同上下文。

## 实际请求的发送

预检通过（HTTP 200/204/2xx + 正确的头）后，浏览器才会发送真正的 PUT / POST 请求：

\`\`\`http
PUT /resource HTTP/1.1
Host: api.other.com
Origin: https://app.example.com
Authorization: Bearer xxx
Content-Type: application/json

{ "name": "new" }
\`\`\`

响应也必须含 \`Access-Control-Allow-Origin\`、可选 \`Allow-Credentials\`，否则实际响应仍被拦截（即使预检通过）。

## 预检绕过？不，必须过的几个槛

1. **预检不通过（OPTIONS 403/404）** → 实际请求根本不会发出，控制台报 CORS 错。
2. **预检通过但实际响应没有 Allow-Origin** → 实际响应还是被拦截（读不到 body）。
3. **Allow-Headers 漏了某个头** → 预检失败。
4. **Allow-Origin 写 \`*\` 又有 credentials** → 预检直接失败（规范不允许）。

## 常见生产配置（Nginx 示例）

\`\`\`nginx
location /api/ {
  # 预检请求
  if ($request_method = OPTIONS) {
    add_header Access-Control-Allow-Origin $http_origin always;   # 动态回显
    add_header Access-Control-Allow-Methods 'GET,POST,PUT,DELETE,OPTIONS' always;
    add_header Access-Control-Allow-Headers 'Authorization,Content-Type,X-CSRF-Token' always;
    add_header Access-Control-Allow-Credentials 'true' always;
    add_header Access-Control-Max-Age '86400' always;
    add_header Vary 'Origin' always;
    return 204;
  }
  # 实际请求
  add_header Access-Control-Allow-Origin $http_origin always;
  add_header Access-Control-Allow-Credentials 'true' always;
  add_header Vary 'Origin' always;
  add_header Access-Control-Expose-Headers 'X-Total-Count' always;
  proxy_pass http://backend;
}
\`\`\`

- 重点：**\`always\`** 参数必须加（否则 4xx/5xx 时 nginx 默认不发 add_header，预检/错误响应仍会 CORS 失败）。
- 动态回显 \$http_origin + Origin 白名单校验（不要简单全回显，除非真的允许任意源）。

## 常见坑与面试问答

### Q1: 为什么浏览器要做预检？

因为跨域"非简单请求"（如 DELETE、带 application/json）很可能会**改变服务端状态**，浏览器必须在发真正有副作用的请求前，先问服务端"你允许这个源发 DELETE 吗？"——防止 CSRF 式的跨站写操作在用户不知情下先斩后奏。

### Q2: postman/curl 发请求为什么从来没 CORS 问题？

CORS 是**浏览器**的同源策略限制（防止浏览器里的恶意 JS 跨域读数据）。postman、curl 等客户端不是浏览器，**没有**同源策略与 CORS 拦截机制——它们是"用户直接发起"，不会自动带目标域 Cookie，也没有被注入恶意 JS 的上下文。

### Q3: CORS 和 CSRF 防御关系？

- CORS 只管"能不能读响应"，不阻止请求发送（简单请求其实先发了再拦响应）。
- **CSRF 攻击者并不需要读响应**——只要能"发请求"就能造成副作用（如 GET /logout、POST /transfer）。
- 所以 CORS 不防 CSRF！CSRF 要靠 SameSite Cookie + CSRF Token。

### Q4: 预检 OPTIONS 带 Cookie 吗？

不带。预检本身不会带 credentials，只有实际请求才会带。

### Q5: 预检响应里能返回业务逻辑吗？

不建议。规范明确 OPTIONS 预检是 CORS 的协商机制，服务端不要执行业务、不要鉴权、不要返回 401（很多客户端预检 401 直接认为失败）——直接 204 No Content 最干净。

### Q6: 有 custom header + origin 是同源，会触发预检吗？

不会。同源请求不走 CORS 流程（浏览器判断 Origin 和目标同域就跳过 CORS）。

### Q7: 携带自定义头 X-User-Session 值 "application/json" 的 GET 方法会触发预检吗？

会。因为有**非安全头**（X-User-Session）。简单请求的第二个条件要求头必须是 safelist 集合里的白名单头。

### Q8: 怎么避免 OPTIONS 开销？

- 合理设置 **Access-Control-Max-Age**。
- 能拆成简单请求的就拆（如短 JSON 用 text/plain + 自解析），但不推荐（语义不好）。
- 把服务端和前端放同域（反向代理），根本不用 CORS，自然无 OPTIONS。
- 把常用自定义头（如 Authorization）始终带上，缓存键稳定不新增。`
  },
  {
    id: 'network-022',
    category: 'network',
    title: '证书链、数字签名原理与 HSTS：浏览器如何验证 HTTPS 证书？证书透明 CT 是什么？',
    difficulty: '中等',
    tags: ['HTTPS', '证书链', 'HSTS', 'CT'],
    answer: `## 为什么需要证书

公钥加密里，客户端拿到"服务端公钥"——怎么证明这个公钥真的属于目标网站，而不是中间人伪造的？答案：**数字证书**。证书是"被信任的第三方（CA）用自己私钥签名的公钥 + 域名声明"。

## 数字签名原理（非对称 + 哈希）

CA 给你的证书签名过程：

\`\`\`
1. CA 拿"待签名证书内容"（公钥、域名、有效期、序列号、版本…TBSCertificate）
   ↓ 计算
2. SHA-256 哈希（得到固定长度摘要）
   ↓ 用 CA 私钥加密
3. 签名结果 = RSA(CA_PrivateKey, Hash(TBS))
   ↓ 附加
4. 最终证书 = 原始内容 + 签名算法 + 签名
\`\`\`

浏览器验签过程：
1. 取证书里的"签名算法"（如 SHA256withRSA）。
2. 浏览器用相同算法对 TBS 做 Hash，得到 H1。
3. 浏览器用**CA 的公钥**解密"签名值"得到原始 Hash H2。
4. H1 == H2 即签名合法 → 证书没被篡改。
5. 同时检查：证书中的"发行者（Issuer）"== CA 证书的"主体（Subject）" → 保证链式关系正确。

## 证书链（Chain of Trust）

浏览器不会内置几百万张网站证书，只内置一小撮**根 CA 证书**（信任锚 Trust Anchor，约 150 个，如 DigiCert Global Root、ISRG Root X1）。中间用**中间 CA 证书**桥接，构成链。

\`\`\`
用户证书（leaf，*.example.com，由 Intermediate CA 签发）
  ↑ 用 Intermediate CA 公钥验签
中间 CA 证书（Intermediate CA，由 Root CA 签发）
  ↑ 用 Root CA 公钥验签
根 CA 证书（Root CA，自签名，浏览器/OS 内置信任）
\`\`\`

### 服务端必须下发完整证书链

正确：服务端在 TLS ServerHello 里下发 **leaf cert + 所有 intermediate cert**（不含 root）。浏览器拿内置 root 拼完整链验签。

- 根证书不用下发（浏览器本来就有）。
- 少了 intermediate cert → 浏览器无法构建完整链 → 报"NET::ERR_CERT_AUTHORITY_INVALID"。
- 很多人配置 Nginx 只用 leaf.crt，忘了把 intermediate 拼到 fullchain.pem 里——Chrome 在桌面端可能"自动下载缺失的中间证书勉强过"，移动端/老浏览器必挂。

### 常用证书类型

| 类型 | 覆盖范围 | 例子 | 价格 |
| --- | --- | --- | --- |
| DV（Domain Validated） | 验证域名控制权（邮件/HTTP-01/DNS-01） | Let's Encrypt，适合个人/非电商 | 免费 |
| OV（Organization Validated） | 额外验证申请组织真实存在 | 公司站/小电商 | 几百~几千/年 |
| EV（Extended Validation） | 最严格线下审核，证书 Subject 含企业名，老浏览器地址栏绿锁显示公司名（现大多取消） | 金融、银行 | 几万+/年 |
| 通配符 | *.example.com 覆盖一级子域 | 内部系统、SaaS 多子域 | 略贵，Let's Encrypt 免费 |

### 证书常见字段

- **Subject CN**：Common Name，旧字段，浏览器已忽略，实际域名校验看 SAN。
- **Subject Alternative Name (SAN)**：必须包含该证书覆盖的所有域名/IP（DNS:example.com, DNS:*.example.com, IP:1.2.3.4），浏览器严格按 SAN 校验域名。
- **Validity**：有效期，Apple 限制 TLS 证书最长 398 天，超过直接不接受。
- **Key Usage / Extended Key Usage**：用途（服务器认证、客户端认证、签名证书…）。
- **Basic Constraints**：CA:TRUE / FALSE，限制能否继续签发下级。
- **CRL Distribution Points / Authority Info Access (AIA)**：吊销信息与上级 CA 证书下载地址。
- **SCT（Signed Certificate Timestamp）**：证书透明日志条目（下文讲 CT）。

## 域名校验

浏览器验签通过后还要校验域名——防止攻击者拿自己合法的 \`evil.com\` 证书冒充 \`bank.com\`：

- 证书 SAN 必须包含用户访问的域名（精确匹配）。
- 通配符 \`*.example.com\` 匹配一级子域（app.example.com ✅，a.b.example.com ❌）。
- SAN 里 IP 地址字面值也支持。
- 不匹配 → 报"ERR_CERT_COMMON_NAME_INVALID"。

## 证书吊销机制

证书私钥泄漏 / 域名不再持有，需要能**提前让证书失效**（否则要等过期）。

### CRL（Certificate Revocation List）

- CA 定期发布"吊销的证书序列号列表"，浏览器下载检查。
- 问题：CRL 越来越大（几十万条），下载慢；发布有延迟（几小时到几天）。

### OCSP（Online Certificate Status Protocol）

- 浏览器实时请求 CA 的 OCSP 接口："这个序列号吊销了吗？"
- 问题：隐私（CA 知道你访问了哪些站）+ 性能（额外 RTT）+ 网络不通时连不上就卡住。
- Chrome 已弃用实时 OCSP。

### OCSP Stapling（装订）

- **服务端**定期去 CA 取 OCSP 响应，在 TLS 握手时把"装订好的 OCSP 响应"随证书一起发给客户端。
- 兼顾：性能好（无额外 RTT）、隐私（客户端不用直接连 CA）、新（由服务端定期刷新）。
- Must-Staple 扩展：服务端可以声明"我的证书必须装订 OCSP，否则浏览器视为无效"。Nginx / Caddy 都支持。

## HSTS（HTTP Strict Transport Security）

告诉浏览器：**以后只能用 HTTPS 访问本域名**，且所有 HTTP 请求自动在内部升级 HTTPS（连 301 跳 RTT 都省了）。

\`\`\`http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
\`\`\`

- **max-age=31536000**：强制 HTTPS 持续 1 年，期间用户输入 http:// 自动内部 307 升级。
- **includeSubDomains**：也对所有子域生效（必须保证自己能覆盖 *.example.com，否则会把还没迁 HTTPS 的老系统搞挂）。
- **preload**：表示愿意加入浏览器的 HSTS Preload 列表（永久硬编码到 Chrome/Firefox/Safari）。

### HSTS Preload

- 提交到 https://hstspreload.org/ 后，经过几周同步到各浏览器代码。
- 效果：**用户第一次访问你的域名之前**，浏览器就知道必须 HTTPS——彻底消灭"第一次 HTTP 明文访问仍可能被劫持"的 HSTS 小缺口（SSL Stripping 攻击）。
- Preload 是**近乎永久**的，移除流程很麻烦（Chrome 要求 max-age 至少 1 年，包含 includeSubDomains + preload 才能申请）。务必测试好。

### 为什么 HSTS 能防 SSL Stripping

中间人攻击（如公共 Wi-Fi 的假冒热点）：
1. 受害者 HTTP 访问银行 → 中间人拦截，假冒用户 HTTPS 去真实银行拿页面。
2. 中间人返回 HTTP 明文给受害者，偷一切。

有 HSTS：
- 受害者浏览器拿到过 STS 响应（或在 Preload 里）→ HTTP 请求根本不发出，直接浏览器内部发 HTTPS。
- 中间人要想劫持必须伪造 TLS 证书，但用户浏览器验签会挂。

## 证书透明（Certificate Transparency，CT / RFC 6962）

### 背景：CA 被攻破或作恶

理论上任何一家被信任的 CA，都能签发任意域名的证书。2011 年 DigiNotar 被攻破，签发了 *.google.com 的假证书，被伊朗政府用来监控 Gmail 用户。传统机制下，浏览器只要链到受信任的根就接受，根本不知道"这张证书是否是网站真正申请的"。

### CT 工作原理

1. 所有 CA 签发证书后，必须把证书**公开**提交到多个公共日志服务器（Log）。
2. 日志服务器维护一个**Merkle Tree（默克尔树）**结构：任何人都能查看、不能偷偷改写、可证明某张证书在树里。
3. 提交后日志返回 **SCT（Signed Certificate Timestamp）**——日志对"我已接收这条日志并在某个时间点加入树"的签名。
4. **浏览器在 TLS 握手时要求 leaf cert 必须携带 SCT**（三种方式之一：内嵌在证书 X.509 v3 扩展、TLS 扩展、OCSP 装订扩展），SCT 数量和来自不同 Log 满足浏览器要求，否则——拒绝该证书！

Chrome 目前要求：
- 证书必须由公开受信任 CA 签发。
- 至少 2 个不同 SCT，或嵌入 + 装订组合满足最小数。
- 不满足 → 直接 NET::ERR_CERTIFICATE_TRANSPARENCY_REQUIRED。

### 效果

- CA 再不敢乱签证书——签发任何域名的证书都会被公开到日志，域名所有者可以通过日志监控工具（crt.sh、censys、Facebook Certificate Transparency Monitor）订阅自己域名的新证书，一旦发现不是自己申请的，立刻联系 CA 吊销 + 上报浏览器，浏览器后续版本把该 CA 打入不信任名单（如 Symantec、Trustico 就是因为签发不当被 Chrome 踢出根计划）。
- 同时提供"存在性证明（Merkle Audit Proof）"和"一致性证明（Merkle Consistency Proof）"，防止日志服务器今天给一个 SCT 明天把记录删掉骗人。

## 常见证书错误码速解

| Chrome 错误 | 典型原因 |
| --- | --- |
| ERR_CERT_AUTHORITY_INVALID | 自签证书、中间证书没下发、CA 根不在浏览器内置 |
| ERR_CERT_COMMON_NAME_INVALID | SAN 不包含访问的域名（CN 已不管用） |
| ERR_CERT_DATE_INVALID | 证书过期或当前时钟错误（检查系统时间） |
| ERR_CERT_KEYUSAGE_INCORRECT | Key Usage 没有服务端认证用途 |
| ERR_CERTIFICATE_TRANSPARENCY_REQUIRED | SCT 数量不足或未嵌入 |
| ERR_SSL_PROTOCOL_ERROR / SSL_VERSION | 协议版本不匹配（如服务器只支持 TLS 1.0/1.1，客户端已禁） |
| ERR_SSL_WEAK_SERVER_EPHEMERAL_DH_KEY | DH 参数弱（< 1024 位 Logjam），服务端升级配置 |

## 运维要点

1. Let's Encrypt 自动续期（certbot、acme.sh），证书有效期 90 天，监控到期时间提前告警。
2. 用 Nginx/caddy 配置 OCSP Stapling 开启。
3. HSTS 先短 max-age（3600 秒）灰度试一周 → 加 includeSubDomains → 再拉长到 1 年 → 最后 preload。
4. 订阅 crt.sh/censys 监控自己域名的新证书告警。
5. 禁用 TLS 1.0/1.1，保留 TLS 1.2 + TLS 1.3，优先 1.3 套件。`
  },
  {
    id: 'network-023',
    category: 'network',
    title: 'gRPC 与 Protocol Buffers（Protobuf）详解：相比 REST/JSON 的优劣、HTTP/2 流式、服务定义？',
    difficulty: '中等',
    tags: ['gRPC', 'Protobuf', 'HTTP/2', 'RPC'],
    answer: `## gRPC 是什么

gRPC 是 Google 开源的、高性能的、**跨语言的 RPC 框架**，基于 HTTP/2 传输，用 Protocol Buffers 做 IDL（接口定义语言）与消息序列化格式。

- **RPC（Remote Procedure Call）**：调用远程服务的方法像调用本地函数，不用自己拼装 URL/JSON/错误码。
- 典型用于**微服务内部通信**（服务间调用）、移动端 App ↔ 后端高吞吐、低延迟 API。

四个特性：
1. **IDL 用 .proto 文件**：跨语言统一契约（Go、Java、C++、Python、JS/TS、PHP 全支持）。
2. **Protobuf 二进制序列化**：比 JSON 小且快。
3. **基于 HTTP/2**：多路复用、头部压缩、双向流。
4. **四种通信模式**：Unary / Server Streaming / Client Streaming / Bidirectional Streaming。

## Protocol Buffers（Protobuf / .proto）

Google 发明的二进制序列化格式 + IDL，比 JSON/XML 体积小、序列化/反序列化快、**强类型**。

### 示例 .proto（契约先行）

\`\`\`proto
syntax = "proto3";  // 最新版 proto3（默认字段可选、无 required/optional）

package user.v1;
option go_package = "user/v1";

// 服务定义
service UserService {
  // 1. 一元 RPC：一发一收
  rpc GetUser(GetUserRequest) returns (GetUserResponse);

  // 2. 服务端流式：发一次请求，服务端返回多批
  rpc ListUsers(ListUsersRequest) returns (stream ListUsersResponse);

  // 3. 客户端流式：客户端多次推送，服务端一次响应
  rpc UploadAvatar(stream UploadChunkRequest) returns (UploadAvatarResponse);

  // 4. 双向流：双方均可随时发消息
  rpc Chat(stream ChatMessage) returns (stream ChatMessage);
}

// 消息定义
message GetUserRequest {
  int64 user_id = 1;  // 字段编号 ≠ 默认值！持久化二进制的关键
}

message GetUserResponse {
  User user = 1;
}

message User {
  int64 id = 1;
  string name = 2;
  string email = 3;
  Gender gender = 4;    // 枚举
  repeated string tags = 5;  // 数组（repeated）
  map<string, string> metadata = 6;  // map
}

enum Gender {
  GENDER_UNSPECIFIED = 0;  // proto3 enum 第一个值必须 0
  GENDER_MALE = 1;
  GENDER_FEMALE = 2;
}
\`\`\`

### 为什么快/小：编码格式

Protobuf 的二进制是**Tag-Length-Value（TLV）** 变长编码：
- **Tag** = (field_number << 3) | wire_type，字段编号和类型合一。
- **Length**（可选）：定长字段无；变长/嵌套字段有。
- **Value**：实际值，varint（整数变长编码）、定长 32/64bit、长度定界（字符串/嵌套/字节）。

对比 JSON：
- JSON：\`{"id":1,"name":"Tom"}\` → 25 字节（含字段名原文、引号、括号）。
- Protobuf：仅存 (id tag + varint 1) + (name tag + length "Tom" + 字节 Tom) → 通常 8 字节。
- 字段名不进二进制（用编号），改字段名不破坏兼容。

### 版本兼容规则

1. **不要改旧字段编号**：字段编号是二进制里的唯一标识，改 1 为 2 等于新字段。
2. **新增字段加新编号**：旧代码忽略未知 tag（wire type 能跳过），新代码读旧数据给默认值。
3. **删除字段保留编号**：标记 \`reserved 3;\`，防止未来复用到老编号导致老数据误解析。
4. **枚举按号兼容**，不要改已有编号。

## gRPC 运行在 HTTP/2 上

gRPC 利用 HTTP/2 的帧与流实现各种 RPC 模式。

| gRPC 概念 | HTTP/2 映射 |
| --- | --- |
| 一次 RPC 调用 | 一个 HTTP/2 Stream（流 ID 唯一） |
| 客户端请求消息 | HTTP/2 DATA 帧（Length-Prefixed-Message） |
| 服务端响应消息 | 同上，服务端到客户端 DATA 帧 |
| 流式多条消息 | 同一个 Stream 上连续多个 DATA 帧，每个消息前 5 字节头（1 字节压缩标志 + 4 字节长度） |
| 状态码 | 结束时 HTTP/2 Trailers（尾头）：\`grpc-status\`、\`grpc-message\` |

请求伪头（Pseudo-Headers）：
\`\`\`
:method = POST
:scheme = http / https
:path = /user.v1.UserService/GetUser      # 包名 + 服务名 + 方法名
:authority = api.example.com
content-type = application/grpc
te = trailers          # 声明能处理 Trailer
grpc-encoding = identity / gzip
grpc-timeout = 1S      # 1 Second (H/M/S/m/u/n)
\`\`\`

响应：
\`\`\`
:status = 200 OK
content-type = application/grpc
grpc-encoding = identity

→ 若干 DATA 帧（消息）

Trailers（最后 HEADERS 帧 END_STREAM 标志）:
grpc-status = 0                    # 0 = OK, 非0 = 具体错误码（见下）
grpc-message = OK                  # 错误详情字符串
\`\`\`

## 四种通信模式

### 1. Unary（一元）：一发一收（最常见，对应 REST 的 req/resp）

\`\`\`proto
rpc GetUser(GetUserRequest) returns (GetUserResponse);
\`\`\`

适合常规 CRUD、查询。

### 2. Server Streaming（服务端流）：客户端一次请求，服务端多次推送

\`\`\`proto
rpc ListUsers(ListUsersRequest) returns (stream ListUsersResponse);
\`\`\`

适合：列表翻页批量推、日志流、搜索结果逐步返回。

### 3. Client Streaming（客户端流）：客户端多次推，服务端最后汇总一个响应

\`\`\`proto
rpc UploadAvatar(stream UploadChunkRequest) returns (UploadAvatarResponse);
\`\`\`

适合：客户端上传大文件分片、批量上报数据。

### 4. Bidirectional Streaming（双向流）：全双工，任意顺序互发消息

\`\`\`proto
rpc Chat(stream ChatMessage) returns (stream ChatMessage);
\`\`\`

适合：实时聊天、协同编辑、多人游戏、双向信令。

## gRPC vs REST/JSON 对比

| 维度 | gRPC（Protobuf + HTTP/2） | REST（JSON + HTTP 1.1/2） |
| --- | --- | --- |
| 契约 | .proto 强类型契约先行，自动生成客户端 SDK | OpenAPI/Swagger 是附加品，JSON 无类型 |
| 性能 | 二进制小 3~10 倍，序列化快 5~100 倍；HTTP/2 多路复用无队头阻塞 | JSON 文本冗长；HTTP 1.1 有队头阻塞/连接数限制 |
| 流式 | 原生 4 种模式，双向流稳定 | 仅 SSE 能做服务端单向流；WebSocket 是非 REST 方案 |
| 浏览器支持 | 需 grpc-web（中转代理，或 connect-go 直连） | 原生完美支持 |
| 调试 | 需要 grpcurl、grpcui、bloomrpc | curl/Postman 直接用 |
| 缓存 | HTTP 语义不完全对应，难用 HTTP 缓存 | GET 请求天然可缓存、CDN 友好 |
| 网关 / 中间件生态 | 生态少一些，主流用 Envoy 做 gRPC 网关 | Nginx、CDN、OAuth 代理全成熟 |
| 错误语义 | 16 个标准 gRPC 状态码（OK/Canceled/Unknown/InvalidArgument/DeadlineExceeded/NotFound…） | HTTP 状态码表达力不够，业务码自定 |
| 版本兼容 | Protobuf 字段编号保证前后向兼容 | JSON 容易不小心改坏（删字段/改结构） |

## gRPC-Web 与浏览器

浏览器没有完整 HTTP/2 API（不能直接发 Trailers、伪头也受限制），原生 JS 不能直接发 gRPC 请求。

解决方案：
1. **grpc-web**：浏览器端发 gRPC-Web 协议（HTTP/1.1 兼容，把 Trailers 转 body 最后消息），中间经 Envoy 或 grpc-web 代理转成标准 gRPC 给后端。
2. **Connect（Buf connect-go）**：gRPC 新协议，同时支持 gRPC / gRPC-Web / Connect-RPC（更贴近 REST + JSON 风格），浏览器可直连，无需代理，支持 GET 查询缓存，现代化推荐。

## 错误码标准（gRPC Status Code）

16 个通用码，跨语言一致：

| Code | 含义 | 对应 HTTP |
| --- | --- | --- |
| 0 OK | 成功 | 200 |
| 1 CANCELLED | 调用被取消（客户端取消/超时） | 499 |
| 2 UNKNOWN | 未知错误 | 500 |
| 3 INVALID_ARGUMENT | 参数非法（客户端问题） | 400 |
| 4 DEADLINE_EXCEEDED | 超过 deadline 超时 | 504 |
| 5 NOT_FOUND | 资源不存在 | 404 |
| 6 ALREADY_EXISTS | 创建冲突 | 409 |
| 7 PERMISSION_DENIED | 权限不足（已认证但无权） | 403 |
| 8 RESOURCE_EXHAUSTED | 限流 / 配额不足 | 429 |
| 9 FAILED_PRECONDITION | 前置条件失败（乐观锁冲突） | 400 |
| 10 ABORTED | 中止（并发竞争） | 409 |
| 11 OUT_OF_RANGE | 越界（分页 index 非法） | 400 |
| 12 UNIMPLEMENTED | 方法未实现 | 501 |
| 13 INTERNAL | 服务端内部 | 500 |
| 14 UNAVAILABLE | 不可用（瞬态，客户端应重试） | 503 |
| 15 DATA_LOSS | 数据丢失 | 500 |
| 16 UNAUTHENTICATED | 未认证（没 token / token 错） | 401 |

## 最佳实践

1. **先写 .proto 再写代码**：契约驱动（API-first），代码由 protoc + 插件生成，不用手写 DTO/序列化。
2. **Deadline 必传**：客户端每次调用传 \`grpc-timeout\`（deadline），防止服务端阻塞。
3. **拦截器（Interceptor）**：统一加鉴权、日志、追踪、重试、限流（像中间件）。
4. **重试策略（Service Config）**：对 UNAVAILABLE / DEADLINE_EXCEEDED 做指数退避重试，幂等方法才能重试。
5. **反射 / 健康检查**：启用 gRPC Reflection（grpcurl 动态发现）与 Health Checking Protocol（k8s liveness/readiness）。
6. **安全**：生产用 mTLS（双向 TLS），服务间证书认证 + 加密，结合 HSTS。
7. **对外 API 不建议 gRPC**：仍用 REST（或 Connect）对外给浏览器/第三方；内部微服务间 gRPC。

## 常见问题

- **能不能通过 RESTful 网关做转码？** 能：gRPC-Gateway 工具读取 proto + google.api.http 注解，自动生成反向代理把 REST 请求转 gRPC。
- **大字段（图片/附件）放哪？** 不要直接放 proto message 二进制里（protobuf 解码要整个加载进内存）。用"引用 + 流式 RPC 上传/下载对象存储"模式。
- **JSON 转 proto 有坑吗？** proto3 JSON Mapping 对 int64 会转成字符串（JS 精度丢失）、enum 默认显示字符串名，注意序列化库选择。
- **怎么断点调试？** grpcurl 模拟调用：\`grpcurl -plaintext localhost:50051 list\`、\`grpcurl -d '{"user_id":1}' ... GetUser\`；grpcui 本地 Web UI 交互。`
  }
]
