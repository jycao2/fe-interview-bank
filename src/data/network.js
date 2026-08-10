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
  },
  {
    id: 'network-024',
    category: 'network',
    title: 'WebSocket 升级握手过程？Sec-WebSocket-Key / Sec-WebSocket-Accept 的作用与计算方式？',
    difficulty: '困难',
    tags: ['WebSocket', 'Upgrade', '握手', 'Sec-WebSocket-Key', 'Sec-WebSocket-Accept', 'GUID'],
    answer: `## 握手是 HTTP Upgrade，不是新建协议

WebSocket 为了能复用现有 HTTP 基础设施（代理、防火墙、Nginx、443 端口穿透），**首次"握手"用 HTTP/1.1 发起 Upgrade 请求**，服务端回复 101 Switching Protocols 之后，连接就切换为 WebSocket 二进制帧协议——不再有 HTTP 语义。

## 完整握手流程

\`\`\`
  客户端 (C)                                   服务端 (S)
     │                                            │
     │  TCP 三次握手 / TLS 握手（wss 时）         │
     │◀──────────────────────────────────────────▶│
     │                                            │
     │  GET /chat HTTP/1.1                        │
     │  Host: example.com                         │
     │  Upgrade: websocket          ←── 声明升级   │
     │  Connection: Upgrade          ←── 必带字段  │
     │  Sec-WebSocket-Key: dGhlIHNhbXBs...        │
     │  Sec-WebSocket-Version: 13   ←── 固定 13   │
     │  Origin: https://foo.com     ←── 同源校验  │
     │  (Sec-WebSocket-Protocol)    ←── 可选子协议│
     │───────────────────────────────────────────▶│
     │                                            │ 1. 校验 Upgrade/Connection
     │                                            │ 2. 校验 Version = 13
     │                                            │ 3. 校验 Origin（防盗链）
     │                                            │ 4. 计算 Accept
     │  HTTP/1.1 101 Switching Protocols ◀───────│
     │  Upgrade: websocket                        │
     │  Connection: Upgrade                       │
     │  Sec-WebSocket-Accept: s3pPLMBiTxaQ9k...   │
     │  (Sec-WebSocket-Protocol: chat)            │
     │                                            │
     │◀──────────── TCP 连接已变 WS 帧协议 ──────▶│
     │       双向消息帧（二进制/text/ping/pong）    │
\`\`\`

## Sec-WebSocket-Key 与 Accept 的计算

### 目的
不是"鉴权"，而是**防止代理/缓存误把之前缓存的 Upgrade 请求再回放**。避免代理缓存"错误地认为这是一个普通 HTTP 响应"造成协议错乱。

### Key（客户端）
浏览器每次握手**随机生成 16 字节二进制，再 Base64 编码**：
\`\`\`
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==   // 只是示例
\`\`\`
长度固定为 24 字符（16 字节→Base64）。无密码学意义，也**不保证随机性强度**。

### Accept（服务端）
服务端按 RFC 6455 §4.2.2 步骤算：

\`\`\`
Accept = Base64( SHA1( Key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11" ) )
                                                  ↑ 这是 WebSocket 的"魔数 GUID"
\`\`\`

Node 原生实现（不要依赖任何库）：
\`\`\`js
const crypto = require('crypto')
function computeAccept(key) {
  const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
  return crypto
    .createHash('sha1')
    .update(key + GUID)
    .digest('base64')
}
console.log(computeAccept('dGhlIHNhbXBsZSBub25jZQ==')
// → s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
\`\`\`

客户端收到 Accept 后做校验：
- **相等** → 服务端确实理解 WebSocket，不是某个中间盒乱回 200
- **不等 / 缺失** → 关闭连接（\`ws.close()\`），握手失败

## 各字段检查清单（服务端必做）

| 字段 | 必须值/检查项 | 不满足时 |
| --- | --- | --- |
| Method | GET | 返回 405 |
| HTTP 版本 | ≥ 1.1 | 400 |
| Upgrade（大小写不敏感） | 包含 \`websocket\` | 400 |
| Connection（大小写不敏感） | 包含 \`Upgrade\` | 400 |
| Sec-WebSocket-Version | 13 | 不支持返回 426 + \`Sec-WebSocket-Version: 13\` |
| Sec-WebSocket-Key | 存在，长度 24（可选校验） | 400 |
| Origin（可选但强烈推荐） | 业务允许的白名单域名 | 403 |

## 常见 Nginx 反代配置（踩坑点）

\`\`\`nginx
location /ws {
  proxy_pass http://ws_backend;
  proxy_http_version 1.1;            # ★ 不能用默认 1.0
  proxy_set_header Upgrade \$http_upgrade;          # ★ 透传 Upgrade
  proxy_set_header Connection "upgrade";            # ★ 不能是 keep-alive
  proxy_set_header Host \$host;
  proxy_read_timeout 3600s;           # ★ 默认 60s 无数据断连
  proxy_send_timeout 3600s;
}
\`\`\`

> 最常见坑：**Nginx 默认 \`proxy_read_timeout 60s\`**，如果你的 WS 应用 60 秒内双方都没消息会被 Nginx 一刀断。要么用心跳（30s ping），要么改超时时间，**推荐心跳**。

## 加密版本：wss:// vs ws://
- \`ws://\` → TCP 明文，默认 80
- \`wss://\` → TCP + TLS，默认 443（推荐，和 https 共用 443 方便穿透公司/运营商代理）

生产部署一律 **wss + 心跳 + Nginx 升级头透传**。`
  },
  {
    id: 'network-025',
    category: 'network',
    title: 'WebSocket 数据帧格式？文本/二进制/控制帧（Ping/Pong/Close）、掩码（Masking）的作用是什么？',
    difficulty: '困难',
    tags: ['WebSocket', '帧格式', 'MASK', 'Ping', 'Pong', 'Close', 'OpCode'],
    answer: `## 帧总览

握手完成后，双方在同一条 TCP 上互发的是**WebSocket Frame**（RFC 6455 §5）。帧分两大类：

- **数据帧（Data Frame）**：承载应用数据
  - \`0x1\` TEXT（UTF-8 文本）
  - \`0x2\` BINARY（任意二进制，如 protobuf/图片/音视频）
  - \`0x0\` CONTINUATION（分片延续帧，超大消息切成多帧）
- **控制帧（Control Frame）**：协议控制，长度 ≤ 125 字节，不可被分片
  - \`0x8\` CLOSE（关闭帧，带关闭码）
  - \`0x9\` PING（心跳探测）
  - \`0xA\` PONG（心跳应答）

## 二进制帧结构（按位 / 按字节）

\`\`\`
  0                   1                   2                   3
  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 +-+-+-+-+-------+-+-------------+-------------------------------+
 |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
 |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
 |N|V|V|V|       |S|             |   (if payload len==126/127)   |
 | |1|2|3|       |K|             |                               |
 +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
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

逐字段：

| 字段 | 位 | 含义 |
| --- | --- | --- |
| FIN | 1 | \`1\`=这是最后一帧；\`0\`=后续还有 CONTINUATION 帧（分片） |
| RSV1/2/3 | 各 1 | 扩展位，没启用扩展必须 0；若用 permessage-deflate 压缩 RSV1=1 |
| Opcode | 4 | 0x0 续 / 0x1 文本 / 0x2 二进制 / 0x8 Close / 0x9 Ping / 0xA Pong |
| MASK | 1 | **客户端→服务端必须为 1（加掩码）**；服务端→客户端必须 0 |
| Payload len | 7 | 表示"载荷长度"或"长度扩展标志"：<126 直接是长度；=126 再用 2 字节扩展；=127 再用 8 字节扩展 |
| Extended payload len | 0/16/64bit | 按上面规则出现的真实长度（大端序） |
| Masking-key | 0/32bit | MASK=1 时出现，4 字节随机数 |
| Payload Data | N字节 | 掩码后的数据 |

## 长度三段式的例子
- 30 字节 → Payload len=30，无扩展
- 300 字节 → Payload len=126，随后 2 字节大端 0x012C=300
- 200KB → Payload len=127，随后 8 字节大端长度

## MASK 掩码机制（为什么客户端要做？）

**这是 WebSocket 设计里最被误解的字段。它不是"加密"！** 目的纯粹是：

> 防止**恶意的 JS 代码**构造恰好与"HTTP 请求行/头部格式一样"的 WebSocket 二进制帧，欺骗中间代理（透明代理、缓存）认为这是普通 HTTP 请求，从而进行**缓存投毒 / 请求走私**。

### 算法（RFC 6455 §5.3）
客户端每发一个帧都生成一个**新的 32 位随机 Masking-Key**，对载荷逐字节 XOR：

\`\`\`
octet-i = original-octet-i  XOR  masking-key-octet[i mod 4]
\`\`\`

服务端拿到 MASK=1 的帧后，再用同样的 4 字节 key **XOR 回来**还原明文：

\`\`\`js
// Node.js 解码掩码
function unmask(payload, maskKey /* Buffer(4) */) {
  for (let i = 0; i < payload.length; i++) {
    payload[i] ^= maskKey[i & 3]
  }
}
\`\`\`

### 规则记忆
- **Client→Server**：必须 MASK=1；服务器收到没掩码的帧 → **必须立即关闭（1002 Protocol Error）**
- **Server→Client**：必须 MASK=0；客户端收到有掩码的帧 → **必须立即关闭**

> 为什么服务端发不用掩码？因为**浏览器信任自己**——不会有"伪造 HTTP"的风险；而"不信任"执行环境中的脚本代码。

## 分片消息（FIN + CONTINUATION）

超大消息不必一次发完，可拆成多帧：
1. 第 1 帧：FIN=0，OpCode=TEXT/BINARY（消息类型只在首帧标注）
2. 中间帧：FIN=0，OpCode=CONTINUATION（必为 0x0）
3. 最后帧：FIN=1，OpCode=CONTINUATION

优点：流式发送/接收，内存占用小；**控制帧（Ping/Pong）可以在分片之间插进来**，保证心跳不被大消息阻塞。

## Ping/Pong 心跳

任何一端都可随时发 Ping（0x9）：
- 收到 Ping 的**必须尽快回 Pong（0xA）**，Payload 必须原样拷贝 Ping 的 Payload。
- 端上判定对端失联的通用策略：连续 N 次心跳周期没收到 Pong → 关闭并进入重连。
- **不建议只靠 TCP keepalive**：默认 2 小时触发一次，太慢；中间盒的"空闲 TCP 会话表"常常早于 keepalive 被清理。

## Close 关闭帧（1002 / 1006 / 1007…）

关闭帧可带 2 字节关闭码 + 可选 UTF-8 reason。常见：

| Code | 名称 | 用途 |
| --- | --- | --- |
| 1000 | NORMAL | 正常关闭 |
| 1001 | GOING_AWAY | 服务端要下线 / 浏览器跳走 |
| 1002 | PROTOCOL_ERROR | 协议错误（收到无掩码客户端帧、越界 OpCode…） |
| 1006 | ABNORMAL | 保留，**不能出现在 Close 帧里**，只在底层检测到没收到 Close 帧就断（如 TCP RST）时上报给上层 API（\`event.code === 1006\`） |
| 1007 | UNSUPPORTED_DATA | 收到文本帧但内容不是 UTF-8 |
| 1008 | POLICY_VIOLATION | 业务策略拒绝（过大消息、鉴权失败…） |
| 1009 | MESSAGE_TOO_BIG | 单帧/单消息超过实现允许的大小 |
| 1011 | INTERNAL_ERROR | 服务端内部错 |
| 3000-3999 / 4000-4999 | 自定义 | 3xxx 需 IETF 注册；4xxx 给应用私有（游戏房解散、重复登录顶号等） |

面试中常被"追问"的两题：
1. **MASK 是不是加密？** ——不是，XOR 的目的是防止代理被脚本伪装的 HTTP 包投毒。
2. **1006 能出现在 Close 帧吗？** ——不能，只在底层异常关闭的事件里出现。`
  },
  {
    id: 'network-026',
    category: 'network',
    title: 'WebSocket 断线重连、心跳保活、指数退避的生产级实现思路与代码？',
    difficulty: '中等',
    tags: ['WebSocket', '心跳', 'Ping Pong', '断线重连', '指数退避', '重连风暴', '背压'],
    answer: `## 为什么 WS 不能"连上就不管"

现实世界有几类必现问题：

1. **NAT/防火墙空闲表超时**：运营商/公司内网通常 5~30 分钟没包就丢会话，TCP 层都还以为连着。
2. **移动端网络切换**：WiFi→5G / 电梯→地面，QUIC 有迁移但 WS 靠 TCP，必然断。
3. **服务端滚动发布**：滚动升级实例会优雅关闭一批连接。
4. **中间代理"断了却不说"**：半开连接，一端以为还连着其实对端早就 RST。

所以生产级 WS 客户端必须同时有：**心跳保活 + 自动重连 + 指数退避 + 防重连风暴**。

## 一、心跳保活（双向）

原则：**宁可多跳一次，也不要让代理空闲超时**。

\`\`\`js
class HeartbeatWS {
  constructor(url) {
    this.url = url
    this.pingIntervalMs = 30_000            // 30s 发一次 Ping
    this.pongTimeoutMs  = 10_000            // 10s 没收到 Pong 判死
    this._pingTimer = null
    this._pongTimer = null
    this._connect()
  }

  _connect() {
    this.ws = new WebSocket(this.url)
    this.ws.addEventListener('open', () => this._startHeartbeat())
    this.ws.addEventListener('pong', () => this._resetPongTimer())    // 浏览器 WS API 不一定暴露 pong 事件
    this.ws.addEventListener('message', (e) => {
      // 收到任意消息都认为链路是活的
      this._resetPongTimer()
    })
    this.ws.addEventListener('close', () => this._stopHeartbeat())
    this.ws.addEventListener('error', () => {})
  }

  _startHeartbeat() {
    this._stopHeartbeat()
    this._pingTimer = setInterval(() => {
      // 方案 A：发浏览器原生 Ping（注意：不是所有浏览器都暴露 ws.ping）
      if (this.ws.ping) this.ws.ping()
      // 方案 B（通用）：业务层面约定 \`{"type":"ping"}\`，服务端回 \`{"type":"pong"}\`
      else this.ws.send(JSON.stringify({ type: 'ping', ts: Date.now() }))

      this._pongTimer = setTimeout(() => {
        console.warn('[WS] pong timeout, force close and reconnect')
        this.ws.close(4000, 'pong timeout')
      }, this.pongTimeoutMs)
    }, this.pingIntervalMs)
  }

  _resetPongTimer() {
    clearTimeout(this._pongTimer)
    this._pongTimer = null
  }

  _stopHeartbeat() {
    clearInterval(this._pingTimer)
    clearTimeout(this._pongTimer)
  }
}
\`\`\`

> 面试提醒：浏览器原生的 \`WebSocket\` 对象**没有公开的 \`ping()/pong 事件\`**（这是 Node 的 \`ws\` 库才有的），前端 99% 场景用**业务层心跳**（约定 JSON 帧）更稳。

## 二、断线重连 + 指数退避（Exponential Backoff）

每次失败等待时间翻倍，上限封顶：
- 1s → 2s → 4s → 8s → 16s → 30s（封顶）
- 连接稳定**超过 10s** 后把重试计数清零，下次失败从头 1s 起。

\`\`\`js
class ReconnectingWS extends HeartbeatWS {
  constructor(url) {
    super(url)
    this.baseDelay = 1_000
    this.maxDelay  = 30_000
    this.attempts  = 0
    this.wasStableMs = 10_000
    this._stableTimer = null
    this.ws.addEventListener('open', () => {
      this._stableTimer = setTimeout(() => { this.attempts = 0 }, this.wasStableMs)
    })
    this.ws.addEventListener('close', () => {
      clearTimeout(this._stableTimer)
      this._reconnect()
    })
    this.ws.addEventListener('error', () => { /* 浏览器 error 之后一定会 close，交给 close 处理 */ })
  }

  _reconnect() {
    // ★ 加 0~50% 随机抖动，避免"整个机房的连接一起断，一起重连"打爆服务端
    const jitter = Math.random() * 0.5 + 0.5
    const delay  = Math.min(this.maxDelay, this.baseDelay * 2 ** this.attempts) * jitter
    this.attempts++
    console.log(\`[WS] reconnect in \$\{Math.round(delay)}ms (attempt \$\{this.attempts})\`)
    setTimeout(() => this._connect(), delay)
  }
}
\`\`\`

### 防重连风暴（Thundering Herd）
上面的 **jitter（随机抖动）** 是关键。若 1000 个客户端一起断（比如服务端滚动重启）：
- 无 jitter：1s 后 1000 个同时打过来，直接把握手包队列打爆（SYN Flood）
- 有 jitter：1s 区间均匀分布到 500~1500ms，服务端压力下降一个数量级

## 三、发送队列 + 背压（Backpressure）

\`ws.send()\` 在连接未就绪（CONNECTING/CLOSED）时会抛异常；在 \`bufferedAmount\` 很大时继续塞，会把内存撑爆。

\`\`\`js
class SafeWS extends ReconnectingWS {
  constructor(url) {
    super(url)
    this.queue = []
    this.highWater = 4 * 1024 * 1024      // 4MB 以上停止往内核队列塞
  }

  enqueue(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      if (this.ws.bufferedAmount < this.highWater) this.ws.send(data)
      else this.queue.push(data)          // 积压到应用层队列
    } else {
      this.queue.push(data)               // 连不上也先存着
    }
  }

  _onOpen() {
    // 连接成功，先把积压消息刷出去（按顺序）
    while (this.queue.length && this.ws.bufferedAmount < this.highWater) {
      this.ws.send(this.queue.shift())
    }
  }

  _onDrain() {
    // 定时轮询 bufferedAmount 或监听 drain（Node 端有，浏览器靠定时器）
  }
}
\`\`\`

浏览器版小知识：\`WebSocket.bufferedAmount\` 是可查的，但**没有 \`drain\` 事件**，需要用 \`setInterval\` 或者"每发一次后判断"。

## 四、鉴权 URL 的 token 过期 + 续期

常见做法是把 token 放 URL：\`wss://api.foo.com/ws?token=JWT\`。
但 JWT 过期了，下一次重连就会 **401 直接失败**。所以在重连之前要先刷新 token：

\`\`\`js
async _reconnect() {
  try {
    if (isTokenExpired(this.token)) this.token = await refreshMyToken()
  } catch (e) {
    /* 续期失败，让用户去登录 */
    return this.emit('authFailed')
  }
  // 重新拼 URL（不要闭包缓存旧 token）
  this.url = buildWsUrlWithToken(this.baseUrl, this.token)
  super._reconnect()
}
\`\`\`

## 服务端对应动作
- **同一用户"重复登录"顶号**：收到新连接时，查 Redis 中 uid→connId，如果旧连接还在，给旧连接发 \`Close(4001, 'duplicate login')\` 后替换。
- **广播风暴**：房间消息先聚合到 Redis Pub/Sub 再下发到各实例；不做"每条消息循环遍历所有连接"。
- **单连接限流**：\`ws\` 库可用 \`maxPayload\` 限制最大单帧，避免一个 1GB 帧打爆内存。

面试里的"加分项表述"：
> 心跳 30s、Pong 超时 10s、重连指数退避 + jitter、bufferedAmount 背压、token 过期预刷新、服务端 Redis Pub/Sub 广播去遍历化。`
  },
  {
    id: 'network-027',
    category: 'network',
    title: 'WebSocket 与 SSE（Server-Sent Events）的区别？选型建议？SSE 的自动重连、Last-Event-ID、消息 ID 机制？',
    difficulty: '中等',
    tags: ['WebSocket', 'SSE', 'Server-Sent Events', 'EventSource', '单向推送', 'Last-Event-ID'],
    answer: `## 一句话区分

- **WebSocket**：**全双工双向**，客户端↔服务端都能随时发；需要 HTTP Upgrade 握手；走自定义二进制/文本帧。
- **SSE (Server-Sent Events)**：**半双工单向**，只能 服务端→客户端；**就是普通 HTTP/1.1 响应**，只是把 Content-Type 设为 \`text/event-stream\`，基于 HTTP Chunked 持久推送；**浏览器自带自动重连 + 断线续传（Last-Event-ID）**。

## 协议对比表

| | WebSocket | SSE | 长轮询 |
| --- | --- | --- | --- |
| 方向 | 双向 | 服务端→客户端单向 | 单向（客户端拉） |
| 连接 | HTTP Upgrade 后走 WS 帧 | 普通 HTTP（长连接 Chunked） | 普通 HTTP（每拉一次一个请求） |
| 端口 | ws=80 / wss=443 | HTTP=80 / HTTPS=443 | 同 HTTP |
| 断线重连 | 自己实现心跳+重连 | **浏览器内置**（EventSource 默认 3s 自动重连） | 客户端循环 setTimeout |
| 续传 | 自己实现消息 ID + 服务端补偿 | **浏览器内置 Last-Event-ID** | 不支持 |
| 二进制 | 原生 BINARY 帧 | 只能文本（要发二进制需 Base64） | 都可 |
| 多路复用（一个连接多通道） | 自己约定 JSON channel 字段 | 原生支持 \`event:\` 多事件名 | 不支持 |
| 跨域 | 握手 Origin 头校验（服务端放行） | **CORS**（需服务端返回 Access-Control-Allow-Origin） | 同普通 fetch |
| 移动端后台保活 | 各自处理 | iOS Safari 后台会暂停 SSE 流，回到前台自动续 | 无 |
| 浏览器兼容 | IE10+，全主流 | Edge 79+ / Safari 全版本 / Firefox/Chrome；**IE 全不支持** | 都支持 |
| 调试 | 需抓 WS 帧（DevTools Network→WS→Frames） | **普通 HTTP 响应**，直接看 Response Body 流式输出 | 跟普通请求一样 |

## SSE 的格式：text/event-stream

SSE 的每一条"事件"都用纯文本按行拼：

\`\`\`
HTTP/1.1 200 OK
Content-Type: text/event-stream; charset=utf-8
Cache-Control: no-cache, no-transform
Connection: keep-alive
X-Accel-Buffering: no        ← ★★ 告诉 Nginx "别缓冲，立即 flush"

: this is a comment line     ← 以 : 开头是注释，可做心跳
retry: 5000                  ← 告诉浏览器"断线后隔 5000ms 再连"

id: 42                       ← 消息 ID（保存在浏览器，下次重连会放到 Last-Event-ID 头里）
event: chat                  ← 事件名（客户端 addEventListener('chat', fn) 来监听）
data: {"from":"tom","msg":"hi"}
                             ← 空行表示事件结束（定界符）

data: 第一行
data: 第二行（同一个 data 分多行，接收端用 \n 拼起来）

id: 43
data: 下一条消息
\`\`\`

### 关键字段
- **\`data:\`**（必填）：事件载荷，多行 data 会用 \`\n\` 拼成一个字符串后作为 \`event.data\`。
- **\`id:\`**（强烈推荐）：写入浏览器内部的"last event ID 缓冲区"，后续**无论断线重连还是首次重连**，浏览器都会自动在请求头加：
  \`\`\`
  Last-Event-ID: 43
  \`\`\`
  服务端根据这个 ID，**从消息队列（Kafka/RabbitMQ/Redis Stream）里把 ID 之后的消息补发过来**，实现"客户端被动也不丢消息"。
- **\`event:\`**（可选）：自定义事件类型；省略就触发默认的 \`message\` 事件。
- **\`retry:\`**（可选）：告诉浏览器重连间隔毫秒数；不写默认约 3 秒（各实现略有差异）。
- **\`: comment\`**（注释行）：可做心跳，客户端不会触发事件；**每隔 15s 左右发一次注释行**，防止代理空闲超时。

## 浏览器端使用 SSE（EventSource）

\`\`\`js
const es = new EventSource('https://api.foo.com/stream?topic=news', {
  withCredentials: true      // 带 Cookie，默认 false
})

es.addEventListener('open', () => console.log('SSE connected'))

// 普通消息（没写 event: 字段）
es.addEventListener('message', e => {
  console.log('新消息：', e.data, 'id=', e.lastEventId)
})

// 自定义事件（对应 event: chat 字段）
es.addEventListener('chat', e => {
  console.log('聊天室消息：', JSON.parse(e.data))
})

es.addEventListener('error', e => {
  // 注意：EventSource 不会因为"网络断了"就停掉，它会自动重连。
  // readyState：CONNECTING=0, OPEN=1, CLOSED=2
  if (es.readyState === EventSource.CLOSED) {
    console.log('被主动关闭，不会再连')
  }
})

// 用户登出时记得关，否则一直重连
function logout() { es.close() }
\`\`\`

## 服务端实现要点（Node / Nginx）

### Node Express
\`\`\`js
app.get('/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  })

  // ★ 发一条注释心跳，防止中间代理 30s 超时断连
  const hb = setInterval(() => res.write(': keepalive\n\n'), 15_000)

  const lastId = Number(req.header('Last-Event-ID') || 0)
  replayMissedEvents(lastId, ev => res.write(formatSSE(ev)))

  // ...业务消息写进来
  pubsub.on('news', ev => res.write(formatSSE(ev)))

  req.on('close', () => clearInterval(hb))
})

function formatSSE({ id, event, data }) {
  let s = ''
  if (id)    s += \`id: \$\{id}\n\`
  if (event) s += \`event: \$\{event}\n\`
  s += \`data: \$\{typeof data === 'string' ? data : JSON.stringify(data)}\n\n\`
  return s
}
\`\`\`

### Nginx 配置的两个致命坑
\`\`\`nginx
location /stream {
  proxy_pass http://backend;
  proxy_http_version 1.1;
  proxy_set_header Connection "";

  proxy_buffering off;          # ★ 别缓冲（默认 on，会攒到满才吐）
  gzip off;                     # ★ SSE 本身就是长连接，gzip 要等 EOF，永远不会输出
  chunked_transfer_encoding on;
}
\`\`\`

漏了 \`proxy_buffering off\` / \`gzip off\`，客户端永远会"看起来还在连，但一条消息也收不到"，直到连接结束。

## SSE 自动重连与 Last-Event-ID 的保证

SSE 的"可靠"是**浏览器帮你做了一半**：

1. 浏览器断开 → 等 \`retry\` 毫秒自动发起一个新请求，并带上 \`Last-Event-ID\` 头。
2. 服务端读到 \`Last-Event-ID\`，把该 ID 之后的未收到消息回放给它。
3. 如果服务端的消息日志已经被清理（超过保留期），应**返回 204 No Content** 或**回一个自定义事件通知客户端做全量同步**，避免"永远少消息"。

\`\`\`
 浏览器 断连 → 自动重连 + Last-Event-ID: 42 ──► 服务端
                                           ┌───────► 查 Redis Stream "42 之后"的消息
                                           └───────► 回 200 + 依次输出 id=43/44/45…
\`\`\`

## 选型建议

| 场景 | 推荐 |
| --- | --- |
| 股票行情、通知中心、ChatGPT 流式输出、实时仪表盘（**纯展示、服务端推为主**） | **SSE**（简单，HTTP 友好，自带重连+续传） |
| IM 聊天、协作编辑（OT/CRDT）、在线游戏、白板同步、RTC 信令（**客户端也要高频发**） | **WebSocket** |
| 兼容 IE 老浏览器、内网代理各种封 | **长轮询（降级兜底）** |
| 跨端 App + H5 同用一套实时通道 | **WebSocket + 长轮询降级（Socket.IO）** |

一句话经验：**服务端单向推优先 SSE，真·双向才上 WS**。SSE 实现成本和运维复杂度都比 WS 低很多。`
  },
  {
    id: 'network-028',
    category: 'network',
    title: 'Socket.IO 的作用、连接建立流程（XHR Polling → WebSocket 升级）、房间/命名空间/Ack 机制？',
    difficulty: '中等',
    tags: ['Socket.IO', 'Engine.IO', '轮询降级', '房间', '命名空间', 'Acknowledgement', '房间广播'],
    answer: `## Socket.IO ≠ WebSocket

Socket.IO 是一个**构建在 WebSocket + 回退传输之上的实时通信库**，它解决了浏览器原生 WS 的这些痛点：

1. **降级兜底**：用户在旧浏览器、企业内网、代理把 Upgrade 头剥离时，会自动从 WebSocket 降级为 **XHR Polling / JSONP Polling / WebSocket**，保证"无论如何都能连上"。
2. **自动重连 + 指数退避**：像 SSE 一样内置。
3. **房间/命名空间**：多频道逻辑（服务端广播、加入/离开房间）。
4. **Ack 回执**：类似 RPC——send 带回调，对端处理完可以回复一个"收到+处理结果"。
5. **二进制支持**：自动序列化 Blob/File/ArrayBuffer。
6. **多房间多路复用**：一个底层连接上承载多个逻辑"频道"，不用为每间房开一个 WS。

底层靠 **Engine.IO** 做抽象：Engine.IO 负责"连接升级/降级"，Socket.IO 在上层做"事件 + 房间 + 命名空间"。

\`\`\`
┌───────────────────────────────────────┐
│              Socket.IO                │
│  事件 / 房间 / 命名空间 / Ack / 重试    │
└───────────────────────────────────────┘
                ▲ 事件语义层
┌───────────────────────────────────────┐
│              Engine.IO                │
│  握手 + 心跳 + 传输（WS↔XHR↔JSONP）     │
│  Packet 编码 + 升级协商                │
└───────────────────────────────────────┘
                ▲ 传输抽象层
 ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
   WebSocket / XHR-Polling / JSONP
\`\`\`

## 连接建立流程（经典"先长轮询，后升级"）

为什么不一开始就 WS？因为浏览器在"代理把 Upgrade 头吃了"的环境里，**WS 握手会超时失败**，用户看到"白屏等了十几秒才好"。Socket.IO 默认先走**一定成功的 HTTP 长轮询**建立一个可用传输，**然后后台尝试升级到 WS**，升级成功就切过去，失败就继续轮询——**对应用透明**。

\`\`\`
  浏览器                                  Socket.IO Server
     │                                         │
     │ ① GET /socket.io/?EIO=4&transport=polling   "Engine.IO 握手"
     │────────────────────────────────────────────▶│
     │ ② 200 { sid: "abc123", upgrades:["websocket"], pingInterval, pingTimeout, maxPayload }
     │◀────────────────────────────────────────────│  ← 拿到 sid，后面所有包绑同一会话
     │                                         │
     │ ③ POST /socket.io/?transport=polling&sid=abc123  (发消息)
     │  GET  ...polling&sid=abc123              (拉消息，Long Poll 挂起)
     │◀──────────── HTTP 长轮询收发消息 ────────▶│ ← 轮询模式已经可用，业务不阻塞
     │                                         │
     │ ④ 后台悄悄 GET /socket.io/?EIO=4&transport=websocket&sid=abc123
     │    (Upgrade: websocket) 携带同一个 sid   │
     │────────────────────────────────────────────▶│
     │ ⑤ 101 Switching Protocols                  │
     │◀────────────────────────────────────────────│
     │         发送 Engine.IO "ping probe" 验证   │
     │ ⑥ 升级成功 → 后续所有消息改走 WS 帧        │
     │◀───────────── WS 双向帧协议 ──────────────▶│
     │                                         │
     │ ⑦ 若升级超时/失败 → 不影响业务，继续用 polling
     │       （对上层完全透明）                    │
\`\`\`

所以 Socket.IO 的首次可用**一定比原生 WS 更快**（握手成功就有通道），但首次升级期间会多 1~2 个 HTTP 请求。

## 房间（Room）与命名空间（Namespace）

这是 Socket.IO 跟原生 WS **最大的不同**，也是它最常用的功能。

### 1. Namespace（命名空间 / 逻辑连接）
同一个底层连接上的**逻辑分隔**，URL 路径式：

\`\`\`js
// 客户端：同一个 TCP / WS 连接上逻辑挂到三个命名空间
const main = io('https://srv/')          // 默认 "/"
const chat = io('https://srv/chat')      // chat 命名空间
const admin = io('https://srv/admin')    // admin 命名空间（可单独加鉴权中间件）

// 服务端
io.of('/admin').use((socket, next) => {
  if (socket.handshake.auth.token === ADMIN_TOKEN) next()
  else next(new Error('unauthorized'))            // 只拒绝 /admin，不影响 /chat
})
io.of('/admin').on('connection', socket => { /* … */ })
\`\`\`

### 2. Room（房间）
一个 Namespace 内的**临时组播单元**，加入/离开只服务端操作：

\`\`\`js
// 服务端
io.on('connection', socket => {
  // 加入房间（多房间可重复 join）
  socket.join('room-101')
  socket.join(['room-101', 'user-friends'])

  socket.on('say', (text) => {
    // 给除自己外"房间内所有"人广播
    socket.to('room-101').emit('msg', { from: socket.id, text })
    // 给房间内所有人（含自己）
    io.in('room-101').emit('msg', { … })
    // 跨命名空间
    io.of('/chat').to('room-101').emit(…)
  })

  socket.on('disconnect', () => {
    // 断开后 socket 自动从所有房间移除，不用手动 leave
  })
})
\`\`\`

### 广播范围速记
- \`socket.emit(...)\` → 只发给自己
- \`socket.to('room').emit(...)\` → 发给 room 内**除自己外**的所有人（经典"我发言，别人收到"）
- \`io.to('room').emit(...)\` → 发给 room 内**所有人**
- \`socket.broadcast.emit(...)\` → 发给"本命名空间所有连接除自己"
- \`io.emit(...)\` → 发给"本命名空间所有连接"

## Acknowledgement（Ack）—— 请求-响应模式

原生 WS 只有"发"，Socket.IO 支持类似 RPC 的**发-回调**模式：客户端第 N 个参数是函数，服务端调用它就会回包。

\`\`\`js
// 客户端
socket.emit('getUser', 123, (user /* 服务端给的结果 */) => {
  console.log('拿到用户了：', user)
})

// 服务端
io.on('connection', socket => {
  socket.on('getUser', async (id, callback /* 这就是回调 */) => {
    const user = await db.User.findByPk(id)
    callback(user)                     // ← 调了 callback 就会回一个 Ack 包给客户端
  })
})
\`\`\`

底层实现：emit 时在包体里带一个 **ackId（递增整数）**，客户端存 \`id → fn\` 映射；服务端 Ack 包把同样的 ackId 带回来，客户端根据 id 取到函数并调用。跟 JSONP 的 callbackId 思路一致。

Ack **默认没有超时**，若对端挂了会内存泄漏。生产要自己加超时：
\`\`\`js
function emitWithAck(event, payload, timeoutMs = 10_000) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('ack timeout')), timeoutMs)
    socket.emit(event, payload, (resp) => { clearTimeout(t); resolve(resp) })
  })
}
\`\`\`

## 多实例（Redis Adapter）+ 粘性会话（Sticky Session）

Socket.IO 默认"房间"是单机内存里的 Map。多实例部署时：

1. **Sticky Session（会话粘滞）必须开**：因为长轮询模式下同一 sid 会发多个 HTTP 请求，**必须落到同一台实例上**，否则轮询拉不到消息。
   - Nginx：\`ip_hash\` / \`hash \$cookie_io\`
   - k8s Ingress：nginx.ingress.kubernetes.io/affinity: cookie
2. **Adapter 扩展**：用 \`@socket.io/redis-adapter\` 或 \`@socket.io/mongo-adapter\`，任何实例收到 \`io.to(room)\` 都通过 Redis Pub/Sub 同步到其他实例。
   - Adapter 只广播**消息**；\`socket.rooms\`、\`socket.id\` 等"本地连接状态"仍只在单实例上，跨实例查"谁在线"需维护额外 Redis 在线集合。

## 选型与替代

- **Socket.IO 适合**：IM 聊天、协作、实时表单、需要兼容复杂网络环境 + 房间语义的业务；不想自己封装降级/重连/ACK。
- **原生 WS 适合**：简单 IM、游戏（自建自定义二进制协议更省带宽）、或者已经用 SSE + Fetch 覆盖了场景。
- **Socket.IO 客户端必须用 Socket.IO 服务端**：协议不是标准 WS（多了 Engine.IO 握手、Packet 编码），**不能跟普通 WS 客户端互通**。这点是面试常考点——"能不能用浏览器 new WebSocket 连 socket.io？"——**不行**，会直接 400 Bad Request。`
  },
  {
    id: 'network-029',
    category: 'network',
    title: 'WebSocket 跨域、鉴权、CSP 混合内容限制？wss 自签证书问题、Origin 校验该如何做？',
    difficulty: '中等',
    tags: ['WebSocket', '跨域', '鉴权', 'Origin', 'CSP', '混合内容', 'wss 证书'],
    answer: `## 一、WebSocket 的"跨域"跟 HTTP CORS 不一样

浏览器 \`new WebSocket('wss://other.com/ws')\` **不受同源策略限制**——不会先偷偷发 Preflight，也不会被浏览器拦截（拦截的只是响应）。但浏览器**会自动带上 \`Origin\` 头**，要不要"放行"完全由服务端决定。

\`\`\`
 浏览器 https://a.com
   │  new WebSocket('wss://b.com/ws')
   ├─▶ 握手请求（HTTP）
   │    Host: b.com
   │    Origin: https://a.com     ← 浏览器自动带
   │    Upgrade: websocket
   │
   ▼ 服务端 b.com：
       检查 Origin 白名单
          ├─ 命中白名单 → 回 101 → ✅ 连上
          └─ 没命中     → 回 403 → 浏览器 close(1008)
\`\`\`

因此 WS 的"跨域策略" = **服务端 Origin 白名单校验**，没有对应 HTTP 的 Access-Control-Allow-Origin 机制（因为握手后就不是 HTTP 了）。

### 服务端 Origin 校验示例（Node + ws 库）
\`\`\`js
import { WebSocketServer } from 'ws'
import { createServer } from 'http'

const allowedOrigins = new Set([
  'https://app.example.com',
  'https://admin.example.com',
  'http://localhost:5173'
])

const server = createServer()
const wss = new WebSocketServer({ noServer: true })

server.on('upgrade', (req, socket, head) => {
  const origin = req.headers.origin ?? ''
  // 1. Origin 校验（★★ 最关键）
  if (!allowedOrigins.has(origin)) {
    socket.write('HTTP/1.1 403 Forbidden\r\n\r\n')
    socket.destroy()
    return
  }
  // 2. 鉴权（在 URL 或 Cookie / Header 里取 token）
  const token = new URL(req.url, 'http://x').searchParams.get('token')
  const user  = verifyToken(token)
  if (!user) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
    socket.destroy()
    return
  }
  // 3. 通过，升级到 WS
  wss.handleUpgrade(req, socket, head, (ws) => {
    ws.user = user    // 挂载给后续消息处理
    wss.emit('connection', ws, req)
  })
})
\`\`\`

> 面试反问：如果 Origin 为空怎么办？通常是**非浏览器客户端**（curl/Postman/移动端 SDK/Node）不会带 Origin，此时策略由你定——可以允许（因为 CORS 问题只在浏览器场景才有），也可以强制要求携带自定义 Header/URL token。

## 二、WS 鉴权的四种主流放法

| 方案 | 放置位置 | 优点 | 缺点 |
| --- | --- | --- | --- |
| **URL Query** | \`wss://srv/ws?token=jwt\` | 最简单，所有浏览器都能用 | 会出现在**服务端 access log、Nginx log、URL 历史、Referer**；容易泄露；URL 有长度上限 |
| **Cookie（HttpOnly）** | 握手请求带 Cookie | 和 Web 登录统一，无 URL 泄露 | 必须同站（First-Party）或 **SameSite=None + Secure**；跨第三方站 Chrome 默认不传 |
| **Sec-WebSocket-Protocol** | 放进子协议头：\`new WebSocket(url, ['base64token'])\` | 握手头部，不会出现在日志 | 是**滥用子协议字段**；服务端必须回 \`Sec-WebSocket-Protocol\`（哪怕只是 echo 回来），否则浏览器会报"子协议不匹配"并自动 close |
| **HTTP 握手 Header**（Authorization） | \`new WebSocket\` 不支持自定义 Header！⚠️ | 规范—— | **浏览器原生 WebSocket API 不允许自定义任何握手 Header**，Node 端 ws 库可以，浏览器不行 |

### 第 3 种的坑（很多人踩）
\`\`\`js
// 前端
const token64 = btoa(token)
const ws = new WebSocket('wss://srv/ws', [\`token.\$\{token64}\`])

// 服务端一定要回，不然浏览器"Protocol Error"强制关闭
const proto = req.headers['sec-websocket-protocol']
res.setHeader('Sec-WebSocket-Protocol', proto)   // 原封不动回
\`\`\`

### 生产推荐组合
- **H5 / SPA 同域**：**HttpOnly + SameSite=Lax Cookie**（安全，零前端代码）。
- **跨域 / 多端 SDK / 小程序**：**URL token + 短 TTL（10min）+ 一次性换取 sid**——先调一次 REST 接口拿一次性 shortToken，再用 shortToken 连 WS，shortToken 5 分钟且只能用一次，日志泄露也不怕。

## 三、混合内容（Mixed Content）：HTTPS 页面不能连 ws://

这是浏览器的硬限制（和"https 页面不能 http 请求资源"一样）：

| 页面协议 | 连 ws:// | 连 wss:// |
| --- | --- | --- |
| http:// | ✅ | ✅ |
| **https://** | ❌ **被拦（Mixed Content）** | ✅ |

错误信息：
\`\`\`
Mixed Content: The page at 'https://foo.com' was loaded over HTTPS,
but attempted to connect to the insecure WebSocket endpoint 'ws://bar.com/'.
This request has been blocked; this endpoint must be available over WSS.
\`\`\`

解决：生产 **一律 wss://**。本地开发可以用 http+ws，或者让前端根据 \`location.protocol\` 自动切：
\`\`\`js
const wsUrl = location.protocol === 'https:'
  ? \`wss://\$\{location.host}/ws\`
  : \`ws://\$\{location.host}/ws\`
\`\`\`

## 四、CSP（Content-Security-Policy）的 WS 指令

CSP 里控制 WebSocket 的是**connect-src**（和 fetch/XHR/SSE/EventSource 共用），没有单独的 ws-src。

\`\`\`http
Content-Security-Policy:
  connect-src 'self'
    wss://api.example.com
    wss://*.thirdparty.io;
\`\`\`

- **'self'** 匹配同协议、同主机、同端口的 ws/wss。
- 显式白名单：写 \`wss://host\`（不写默认不允许任何外部 WS）。
- 被 CSP 拦时，浏览器控制台会报：\`Refused to connect to 'wss://x/' because it violates the following Content Security Policy directive: "connect-src ..."\`。

## 五、自签证书的 wss://（本地/测试环境）

浏览器访问 \`wss://192.168.1.99:8443/\` 如果证书是自签 / 内部 CA：

1. **先在浏览器里打开 https://192.168.1.99:8443/ （任意同主机 HTTPS 页面）**。
2. 在"不安全 → 继续访问"里把证书加入浏览器信任。
3. 之后 WebSocket 到同主机就会复用这个信任。

> 小程序、WebView、Electron 场景要各自加"忽略证书错误"开关或"预埋根证书"，不能用上面的办法。**生产禁止忽略证书错误**。

## 六、代理 / 负载均衡下的客户端 IP

握手是 HTTP 经过反代时，服务端直接看到的 \`req.socket.remoteAddress\` 是 **Nginx 的 IP**。记得在 Nginx 加：
\`\`\`nginx
proxy_set_header X-Forwarded-For  \$proxy_add_x_forwarded_for;
proxy_set_header X-Real-IP        \$remote_addr;
proxy_set_header X-Forwarded-Proto \$scheme;
\`\`\`
Node 服务端用 \`req.headers['x-forwarded-for']\` 拿真实客户端 IP 做风控/封禁。

## 面试高频"踩坑"追问

1. **new WebSocket 能不能带自定义 Header？** —— **浏览器不行**；Node 的 \`ws\` 可以。很多初学者会以为能像 fetch 那样传 \`headers: { Authorization }\`。
2. **https 页面连 ws:// 会咋样？** —— 被浏览器直接拦，请求根本发不出去；这是 Mixed Content。
3. **Sec-WebSocket-Protocol 放 token 的副作用？** —— 服务端必须在握手响应里**原样回写该值**，否则浏览器自动 close(1002/1008)。
4. **Origin 校验缺了会怎么样？** —— 任何网站都能打开你 WS 连接建立消息通道，易被"跨站 WebSocket 劫持 + 伪造消息"打（类似 CSRF 但更严重，因为是双向持久通道）。`
  },
  {
    id: 'network-030',
    category: 'network',
    title: 'WebSocket 在弱网/高并发场景的优化？消息压缩（permessage-deflate）、二进制协议、批量发送、广播风暴如何处理？',
    difficulty: '困难',
    tags: ['WebSocket', 'permessage-deflate', '二进制协议', '广播风暴', '背压', 'Redis Pub/Sub', '负载均衡'],
    answer: `## 一、带宽优化：permessage-deflate 消息压缩

WebSocket 有一个标准扩展（RFC 7692）叫 **permessage-deflate**——每条"数据帧"在发送前做一次 deflate（zlib）压缩。对 JSON 文本大消息能拿到 **60~80% 的压缩比**。

浏览器原生 WebSocket 支持该扩展（自动在握手时协商），服务端 ws 库配置：
\`\`\`js
import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: { chunkSize: 1024, memLevel: 7, level: 3 },   // 服务端发
    zlibInflateOptions: { chunkSize: 1024 },
    clientNoContextTakeover: true,   // 省内存（不保留上一帧上下文字典）
    serverNoContextTakeover: true,
    serverMaxWindowBits: 10,
    concurrencyLimit: 20             // 同时压缩的帧数上限（防 CPU 打爆）
  }
})
\`\`\`

### 什么时候开/不开？
- ✅ **开**：JSON 聊天、通知、长消息、大 JSON 同步（协作文档快照）。
- ❌ **不开**：小二进制心跳包、protobuf 已压缩、游戏高频小包（每帧 < 64B，压缩反而"字典头 + 更多字节"）。
- ⚠️ **内存代价**：开启后每个连接多一份 zlib 状态（~32KB~256KB）；\`NoContextTakeover=true\` 能降到最小但压缩率下降 10~20%。

## 二、协议选择：JSON 文本 vs 二进制（protobuf / msgpack / flatbuffer）

| | 文本（JSON） | Protobuf | FlatBuffers | MessagePack |
| --- | --- | --- | --- | --- |
| 可读性 | 好（DevTools 直接看） | 差（需抓包工具+proto） | 差 | 差 |
| 体积 | 大（字段名冗余） | 小（tag 编码） | 中 | 中 |
| 编解码性能 | 中 | 快（3~10x JSON.parse） | 极快（零拷贝） | 中 |
| 前后端耦合 | 无（随便加字段） | 需 .proto 契约 | 需 .fbs 契约 | 弱 |
| 兼容性 | 自描述 | 通过字段编号向前兼容 | 可选默认值兼容 | 自描述 |

### 选型经验
- **业务消息为主 + 体积 < 10KB** → JSON + permessage-deflate（开发效率最高）。
- **高频游戏帧 / 实时位置上报（QPS > 50/连接）** → Protobuf / FlatBuffer 二进制，**不开压缩**。
- **混合场景**：控制协议（鉴权、加房间）JSON；实际数据流二进制（Blob/ArrayBuffer），客户端靠 \`ws.binaryType = 'arraybuffer'\` 接收。

Protobuf 最简流程：
\`\`\`proto
// messages.proto
syntax = "proto3";
message Position {
  int64 userId = 1;
  sint32 x = 2;      // sint 有负数比 int32 省字节
  sint32 y = 3;
  uint32 ts = 4;     // unsigned 时间戳
}
\`\`\`
\`\`\`js
// 前端二进制收发
ws.binaryType = 'arraybuffer'
ws.onmessage = async e => {
  if (e.data instanceof ArrayBuffer) {
    const msg = Position.decode(new Uint8Array(e.data))
  } else {
    // 文本走别的分支
  }
}
\`\`\`

## 三、发送侧优化：合帧 + 限流 + 背压

单连接"每秒 200 条小消息"，每条都独立发会带来大量 syscall、小包拥塞。

### 1. 合帧（Nagle 风格 / Micro-batching）
把 10~50ms 内的消息收集起来打成一个"批量帧"再发，发送次数下降 20~100x：
\`\`\`js
class BatchSender {
  constructor(ws, intervalMs = 20) {
    this.ws = ws
    this.queue = []
    this.timer = setInterval(() => this.flush(), intervalMs)
  }
  send(frame) {
    if (this.ws.bufferedAmount > 4 * 1024 * 1024) return     // 背压：超过 4MB 丢（或降级）
    this.queue.push(frame)
  }
  flush() {
    if (this.queue.length && this.ws.readyState === 1) {
      // 约定：一个 JSON 数组当批量包 [cmd1, cmd2, ...]
      this.ws.send(JSON.stringify(this.queue))
      this.queue.length = 0
    }
  }
}
\`\`\`

### 2. 背压（Backpressure）
- \`ws.bufferedAmount\`：浏览器端内核缓冲区积压的字节数。大于 1~4MB 就要**停塞**（丢、排队、压缩、合并），否则内存暴涨。
- Node 服务端 \`ws\` 库有 \`drain\` 事件：可以暂停 → 等 drain 再继续。

### 3. 接收侧：单连接限速
服务端对每个连接做 **令牌桶**（\`rate-limiter-flexible\` 或 \`ioredis\` 背的限流器）：
- 每秒最多 N 条入站消息；
- 单帧最大 1MB（ws 的 \`maxPayload\` 选项）；
- 超限直接 Close(1009 MESSAGE_TOO_BIG)，防恶意大帧打爆内存。

## 四、广播风暴（Broadcast Storm）的三种解法

经典坑：一个房间 1 万人，一人发言，服务端写个 \`for (const socket of room) socket.send(msg)\`——CPU 被这 1 万次 send + 序列化打爆，再叠加"所有房间都在广播"，整个实例 OOM。

### 解法 1：扇出到各实例（Redis / Nats Adapter）
多实例部署时"广播指令"通过消息队列 Pub/Sub 下发到每台实例，实例本地再做连接级扇出：
\`\`\`
 Client ──发言──▶ 实例 A
                   │ publish "room-101: {msg}"
                   ▼
                Redis Pub/Sub
                   │
     ┌─────────────┼─────────────┐
     ▼             ▼             ▼
  实例 A          实例 B         实例 C
  遍历本机        遍历本机       遍历本机
  room-101 连接   room-101 连接  room-101 连接
\`\`\`

### 解法 2：序列化一次 + 直接复用
大 JSON 消息，对 1 万人重复 \`JSON.stringify\` 是浪费。**先序列化一次**得到字符串 / Buffer，然后用同一个 Buffer 直接 \`ws.send(buf)\` 多次。\`ws\` 库底层已经支持共享 Buffer（不拷贝）。

\`\`\`js
const buf = Buffer.from(JSON.stringify(bigPayload))   // 1 次序列化
for (const ws of roomConnections) ws.send(buf)       // N 次发送，零拷贝
\`\`\`

### 解法 3：消息丢弃（"最新值语义"）
对于"股票行情、坐标"这种**新消息覆盖旧消息**的场景，把每连接发送队列做成"同类型只保留最新"——积压 30 帧位置，只发最后一帧，带宽占用直接砍 30 倍。

## 五、服务端高并发架构建议

1. **CPU 绑定**：一个 Node 进程只能用一个核。用 **PM2 cluster / Kubernetes 多 Pod**，每实例 2k~10k 连接（根据消息频率定）。
2. **内存预算**：每个空闲 WS 连接约 2~10KB（不含缓冲区），10 万连接约几百 MB；加上业务缓冲和 zlib 字典，单机 8C32G 通常稳在 4~6 万连接。
3. **文件句柄**：Linux 每个 TCP 连接占一个 fd，默认 ulimit -n 1024 远远不够，生产改到 **65535 或 1048576**。
4. **健康检查**：不要"自己查自己"，用单独的 HTTP /health 端点，别让健康检查也走 WS 握手。
5. **负载均衡算法**：**最少连接数（Least Connections）** 比轮询更适合长连接，避免某台实例连接数膨胀。
6. **滚动发布**：先摘除（drain）新流量 → 给老连接广播 \`4002 server-shutdown please reconnect\` → 等 30s → 真正下线。配合客户端"收到 4002 立即重连"，用户几乎无感。

## 优化清单（面试加分口诀）
> 压缩（permessage-deflate）+ 二进制（Protobuf/FlatBuffer）小体积 + 合帧微批减少 syscall + 背压不塞爆 + Redis Adapter 广播 + 单帧序列化多发送 + 最新值丢帧 + ulimit 文件句柄 + LeastConn 负载均衡 + 滚动发布 drain。`
  },
  {
    id: 'network-031',
    category: 'network',
    title: 'WebSocket 与 HTTP/2、HTTP/3 的关系？HTTP/2 Server Push 和 WebSocket 该选哪个？',
    difficulty: '中等',
    tags: ['WebSocket', 'HTTP/2', 'HTTP/3', 'Server Push', '多路复用', 'SSE'],
    answer: `## HTTP/2 和 HTTP/3 **不影响 WebSocket 的协议本身**

很多人会问"有了 HTTP/2 多路复用还需要 WebSocket 吗？"——**完全是两层的东西**：

- HTTP/2、HTTP/3 优化的是 **"请求-响应模型"的传输效率**（多路复用、头部压缩、0-RTT）。
- WebSocket 是**长连接 + 双向帧协议**，目的就是突破"请求-响应"模型。

所以它们不是替代关系，而是：
- HTTP/2 → 更有效率地跑**一堆请求-响应**；
- WebSocket → **真正的双向实时**。

## 能不能"在 HTTP/2 之上跑 WebSocket"？

**RFC 8441（Bootstrapping WebSockets with HTTP/2）** 规定可以：把 HTTP/1.1 时代的 Upgrade 语义，用 HTTP/2 的 **CONNECT + :protocol = websocket** 伪首部替代。

不过实际情况要注意：
- Chrome/Edge/Firefox 现代版本都支持 WS over H2。
- Safari 历史上支持度一般。
- **Nginx 1.25 开始才原生支持 HTTP/2 WebSocket**（以前会直接 4xx）。
- H2 是单 TCP 多路复用，**WS 流与其他 HTTP 请求仍共享 TCP 层队头阻塞**——这跟 H2 的通病一致。

HTTP/3（QUIC）的 WebSocket 规范 **RFC 9220** 也有（用 H3 的 CONNECT），2024+ 逐步普及中。

> 业务结论：WS 连什么协议，**对上层应用透明**。部署 HTTPS 时直接上 H2+H3，握手会自动用最高版本。不需要改任何代码。

## 对比：HTTP/2 Server Push vs SSE vs WebSocket

有了 HTTP/2，有人试图用 "Server Push 推实时消息"，结果很糟糕——因为 **Server Push 语义不对**。

### Server Push（HTTP/2 的 PUSH_PROMISE）
服务端在客户端**没发请求之前**，**预判客户端接下来需要什么资源**（比如 HTML 连带 CSS/JS），主动推到客户端 HTTP 缓存里。

- ✅ 只适合"预取静态资源"：首屏、HTML 之后的 JS/CSS。
- ❌ 不适合"实时事件流"：**没有长连接语义、没有显式的事件结束标记、没有重连、没有 Last-Event-ID、流控粗暴**。
- Chrome 已在 2021 年**移除 Server Push 支持**（Chrome 106+），生态已弃用。

### SSE（text/event-stream over HTTP）
- 单向推送（服务端→客户端）。
- 基于 HTTP Chunked，在 HTTP/1.1 / H2 / H3 上都能直接跑。
- 浏览器内置 **自动重连 + Last-Event-ID 续传**。
- HTTP/2 下 SSE 和其他请求**共享一条 TCP 连接**（H2 多路复用），所以"开 10 个 SSE 通道"不再有"HTTP/1.1 同域 6 连接限制"。

### WebSocket
- 全双工、帧协议；升级之后就不再是 HTTP。
- 消息粒度更细、头部更小（帧头 2~10B vs HTTP 响应头几百 B）。
- 原生二进制、分片、Ping/Pong 心跳协议级支持。

## 四者能力对比

| | HTTP/1.1 | HTTP/2 | SSE（H1/H2/H3） | WebSocket |
| --- | --- | --- | --- | --- |
| 通信模型 | 请求-响应 | 请求-响应（多路复用） | 服务端单向推 | 全双工双向 |
| 连接模式 | 短/长（keep-alive） | 单长连接多路复用 | 长连接 Chunked | Upgrade 后帧长连接 |
| 双向 | ❌ | ❌（请求-响应） | ❌ | ✅ |
| 二进制 | ✅ 响应体 | ✅ 帧但应用层不感知 | ❌（纯文本，只能 Base64） | ✅ BINARY 帧 |
| 多路复用 | ❌（同域 6 连接并发） | ✅（应用层无 HoL） | ✅ 在 H2/H3 上自然复用 | ❌ 一个 WS 一个逻辑通道（多通道自己多路） |
| 自动重连 | N/A | N/A | ✅ EventSource 内置 | ❌ 自己写（或 Socket.IO） |
| 消息续传 | N/A | N/A | ✅ Last-Event-ID | ❌ 自己实现消息 ID |
| 心跳 | N/A | HTTP/2 PING | 发注释行 : keepalive | Ping/Pong 控制帧 |
| 典型用途 | 常规 REST | 常规 REST + 静态资源 | 行情、通知、流式输出 | IM、协作、游戏、信令 |

## 选型经验（面试速记）

1. **服务端单向事件流**（股票/AI 流式返回/通知）→ **SSE**，开发最简单。
2. **双向高频**（聊天/游戏/协作/信令）→ **WebSocket**。
3. **不要用 HTTP/2 Server Push 做实时性**——生态已弃用（Chrome 已移除）。
4. **不要为了 HTTP/2 优化而刻意换掉 WS**：部署端直接启 H2/H3，浏览器 WS 握手会自动走 RFC 8441，不用你改代码。
5. **Socket.IO 客户端在 H2 下的注意点**：如果同时开了 6 条轮询 + 升级，可能跟同域其他请求竞争 H2 流窗口，监控下 stream concurrency。

## WS 多路复用 vs HTTP/2 多路复用（容易被问）

HTTP/2 是**一个 TCP 上多个 Stream（请求/响应）**，不用浏览器开 6 条 TCP。
WebSocket 是**一个 TCP 上承载一种"帧协议"**，如果业务要多路（聊天、行情、通知分开），就自己在帧里加 channel 字段，比如：
\`\`\`json
{ "channel": "chat", "room": 101, "data": {…} }
{ "channel": "ticker", "sym": "AAPL", "data": 193.2 }
\`\`\`
也可以用 Socket.IO 的 Namespace/Room——本质就是这个思路。所以说两者解决的"复用层级不同"，不冲突。

一句话收尾：**HTTP/2/3 优化了"请求-响应"的高速路，SSE 是"单向送货车"，WebSocket 是真正的"双向双向六车道城市主干道"——各自解决不同的交通问题。**`
  },
  {
    id: 'network-032',
    category: 'network',
    title: '从实战角度讲：WebSocket 的线上常见故障与排查手段（抓包、状态码、日志、监控埋点）？',
    difficulty: '中等',
    tags: ['WebSocket', '故障排查', '抓包', '监控', 'DevTools', 'Wireshark', '问题诊断'],
    answer: `## 一、线上最常见的 6 类 WS 故障

| 症状 | 根因分类 | 典型根因 | 快速定位 |
| --- | --- | --- | --- |
| 能连但几秒必断，code=1006 | 代理/超时 | Nginx \`proxy_read_timeout 60s\` 默认 | 看连接存活时长是否刚好 60s |
| 客户端能握手但马上 close(1002/1008) | 服务端校验 | Origin 白名单、子协议回写、鉴权错 | 抓握手响应码 401/403；Sec-WebSocket-Accept 有没有 |
| 频繁自动重连，页面一卡一卡 | 心跳缺失 + 代理空闲超时 | 30min 中间盒断会话 | 服务端 access log 看"短连比例" |
| 消息丢失或半天才收到 | 代理缓冲 / Backpressure | Nginx 没关 \`proxy_buffering\`；客户端 bufferedAmount 高水位 | 看 Response Header 里有没有 X-Accel-Buffering: no |
| 偶发"400 Bad Request" | 协议/传输错 | Socket.IO 客户端用原生 WS 连；或 sid 对不上 | 看请求路径 /sid 参数是否一致 |
| 服务端 OOM 重启 | 广播/大帧 | 没开 maxPayload；一个房间 1w 人遍历 + 大 JSON | Node \`--inspect\` 抓 heap snapshot |

## 二、浏览器侧快速排查（第一现场）

### 1. Chrome DevTools 看 WS 帧
DevTools → Network → 找到 \`101 Switching Protocols\` 那条请求 → 切到 **Frames / Messages** 标签：
- 左边是**帧列表**，每一行是一个帧，方向用 ↑↓ 标记，大小、时间戳都能看。
- 文本帧直接看内容；二进制帧显示十六进制。
- **有没有 Ping/Pong**？完全没 Ping，基本就是代理超时问题。

### 2. 控制台观察 readyState
\`\`\`js
// 在页面控制台执行，观察生命周期
window.__ws = ws  // 先把 ws 对象挂出来
console.table([
  ['CONNECTING', 0, __ws.readyState === WebSocket.CONNECTING],
  ['OPEN',       1, __ws.readyState === WebSocket.OPEN],
  ['CLOSING',    2, __ws.readyState === WebSocket.CLOSING],
  ['CLOSED',     3, __ws.readyState === WebSocket.CLOSED],
])
console.log('bufferedAmount =', __ws.bufferedAmount)
\`\`\`

### 3. 抓握手响应头
DevTools → 该请求 → Headers，重点对照：
\`\`\`
Request:
  GET /ws?token=xxx
  Upgrade: websocket
  Connection: Upgrade
  Sec-WebSocket-Version: 13
  Sec-WebSocket-Key: ...
  Origin: https://...
Response:
  101 Switching Protocols        ← 不是 101？401/403/426/5xx 直接查原因
  Upgrade: websocket
  Connection: Upgrade
  Sec-WebSocket-Accept: ...      ← 缺失/算错？浏览器马上 close
  Sec-WebSocket-Protocol: ...    ← 如果请求里带了，响应里必须有
\`\`\`

### 4. 强制走 wss / 忽略证书
本地调试自签服务：Chrome 里先开一次 HTTPS 页面信任证书。或者用参数启动：
\`\`\`
chrome --ignore-certificate-errors --unsafely-treat-insecure-origin-as-secure=https://local.test:8443
\`\`\`

## 三、服务端 Node 侧日志

### 统一给每个连接一个 requestId，所有日志都带它
\`\`\`js
wss.on('connection', (ws, req) => {
  ws.id = crypto.randomUUID()
  ws.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  ws.user = req.auth?.userId ?? null
  const L = (...a) => console.log(\`[ws \$\{ws.id} u=\$\{ws.user} ip=\$\{ws.ip}]\`, ...a)

  L('connected, total=', wss.clients.size)
  ws.on('message', (data, isBinary) => {
    L('recv', isBinary ? 'bin=' + data.length + 'B' : data.slice(0,200))
  })
  ws.on('close', (code, reason) => L(\`closed code=\$\{code} reason=\$\{reason.toString()}\`))
  ws.on('error', (e) => L('error', e))
})
\`\`\`

### 关键告警埋点（Prometheus / StatsD）
指标项：
- \`ws_connections_total\`（Gauge）：总连接数 → 配合实例数做容量。
- \`ws_msg_in_bytes\` / \`ws_msg_out_bytes\`（Counter）：进出流量。
- \`ws_close_code_total{code="1006|1008|4000"}\`（Counter）：按关闭码计数；**1006 突增 = 代理/网络问题；1008 突增 = 鉴权/Origin 策略上线误杀**。
- \`ws_handshake_duration_ms\`（Histogram）：握手处理耗时。
- \`ws_broadcast_latency_ms\`（Histogram）：从 Redis Pub 收到 → 最后一个连接 send 完成的耗时。

## 四、TCP / 抓包层（疑难杂症）

### 1. 浏览器端无法看到 Ping/Pong 控制帧？
DevTools **不会显示 Ping/Pong 帧**（故意隐藏）。要看就用抓包工具。

### 2. Wireshark 过滤
\`\`\`
# 按端口
tcp.port == 8080

# WS 明文（ws://）可直接解码，
# Wireshark 2.5+ 自动识别 Upgrade: websocket 后切换为 WS 协议。
# 看 OpCode: Text=1 / Binary=2 / Close=8 / Ping=9 / Pong=A
#
# wss://（TLS 加密）需要 SSLKEYLOGFILE 才能解密：
#   macOS/Linux: export SSLKEYLOGFILE=~/tmp/ssl.log
#   Windows:     set SSLKEYLOGFILE=C:\\tmp\\ssl.log
# 然后启动 Chrome，Wireshark 里 Edit→Preferences→TLS→(Pre)-Master-Secret log filename
\`\`\`

### 3. 服务端用 tcpdump 应急抓包
\`\`\`bash
# 抓 TCP 8080 1000 个包存文件，拿回本地 Wireshark 分析
sudo tcpdump -i any -nn -s 0 -w ws.pcap 'tcp port 8080' -c 1000
\`\`\`

## 五、典型 Case 案例复盘话术（面试会问）

> **Case A："整点活动开始，WS 连接数从 2k 升到 10k，新连接全超时。"**
> - 排查：\`ulimit -n\` 单机 65535，实例 8 个，单实例 8192（默认从父进程继承），满了。
> - 解决：systemd 的 \`LimitNOFILE=1048576\`，重启 Node 进程。
>
> **Case B："移动端用户反馈'后台切回来几分钟，WS 显示连着但收不到消息'。"**
> - 排查：App/iOS 后台把 TCP 挂起，心跳虽然客户端以为在发其实没出。代理那边空闲超时 5min 早已 RST，服务端没收到 Close 也不知道。
> - 解决：**服务端也启心跳**（服务端 → 客户端 Ping，30s 一次，连续 2 次没 Pong 踢），半开连接及时释放。
>
> **Case C："Nginx 后面的 WS，'偶发 1006 断连，刚好 60 秒'。"**
> - 排查：\`proxy_read_timeout 60s\` 默认值，心跳周期 60s，**还没来得及发就被 Nginx 先切了**。
> - 解决：心跳 30s，\`proxy_read_timeout 3600s\` 双保险。
>
> **Case D："用户 A 和用户 B 聊天，A 能发但 B 收不到。"**
> - 排查：服务端 2 实例部署，用了 Redis Adapter；但 B 的连接在实例 1，A 的消息到了实例 2；Adapter 连接 Redis 网络抖动导致订阅丢失。
> - 解决：Adapter 端监控 **订阅连通性**，Redis Pub/Sub 中断时自动重连并告警。

排查口诀：
> **101 先看握手头，401/403 鉴权/Origin；1006 多半是超时，检查 Nginx 代理头；1008/1002 是协议错，掩码/子协议/版本号；消息丢/延迟看缓冲，bufferedAmount 与 proxy_buffering。**`
  }
]
