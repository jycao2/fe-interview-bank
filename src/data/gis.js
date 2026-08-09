export const gisQuestions = [
  {
    id: 'gis-001',
    category: 'gis',
    title: '前端 GIS 开发常见技术栈与选型？',
    difficulty: '简单',
    tags: ['GIS', '技术栈', 'Leaflet', 'Mapbox', 'OpenLayers', 'ArcGIS'],
    answer: `## 前端 GIS 三大主流库

| 库 | 体积 | 许可 | 适用场景 | 特点 |
| --- | --- | --- | --- | --- |
| **Leaflet** | ~40KB | BSD-2 | 轻量地图展示、移动端 H5 | API 极简、插件生态丰富、上手快 |
| **Mapbox GL JS** | ~600KB | 收费/Mapbox TOS | 3D、矢量切片、高度自定义样式 | WebGL 渲染、支持自定义 style spec、3D 地形/建筑 |
| **OpenLayers** | ~200KB+（按模块） | BSD-2 | 企业级 GIS、复杂业务 | WMS/WFS/WMTS 全协议支持、功能最全面 |
| **ArcGIS Maps SDK for JS** | 较大 | 商业/Esri | 政企、与 ArcGIS Server 深度集成 | 完整 GIS 分析能力、3D SceneView |
| **Deck.gl** | ~300KB | MIT | 大规模地理可视化、大数据可视化 | WebGL 图层（百万级点/线/面）、常与 Mapbox/Leaflet 叠加 |

## 基础概念栈

- **数据格式**：GeoJSON（前端最常用）、TopoJSON、Shapefile（shp）、KML、GPX、CSV（经纬度列）。
- **瓦片坐标系**：XYZ 瓦片（Google/OSM 方案）、TMS、WMS/WMTS。
- **投影坐标系**：WGS84 (EPSG:4326) 经纬度；Web Mercator (EPSG:3857) 地图渲染投影；国测局 GCJ-02、百度 BD-09 加密偏移。
- **空间分析**：Turf.js（布尔运算、缓冲、质心、距离、面积、点在面内等 100+ 方法）。

## 典型选型

### 1. 政府/企业内部 GIS 系统
→ **OpenLayers + Turf.js**，或直接用 ArcGIS SDK（已有 ArcGIS Server/Portal 时）。
- 需对接 WMS/WFS、矢量图层叠加、与业务系统深度集成。

### 2. C 端 / 移动端 H5 轻量应用（轨迹、LBS）
→ **Leaflet + 高德/腾讯瓦片**。
- 资源受限但功能明确，Leaflet 插件生态刚好够用。

### 3. 酷炫 3D、自定义样式、面向海外
→ **Mapbox GL JS**（或基于它的 MapLibre GL JS，开源分支无需 Mapbox token）。
- 3D 地形、挤压建筑、动画 camera、自定义 style.json。

### 4. 百万级点/热图/OD 飞线大数据可视化
→ **Deck.gl** 叠加在 Mapbox 或 Leaflet 之上。
- WebGL 驱动，ScatterplotLayer / HeatmapLayer / ArcLayer。

### 5. 纯 Cesium 数字孪生 / 三维地球
→ **CesiumJS**，或国内 **Mars3D / ThingJS**。
- 倾斜摄影、BIM、粒子特效、时间轴动画。

## 国内地图合规注意

中国地区的地图必须使用**有资质的地图供应商**：
- 高德（AMap JS API）：文档中文全、LBS POI 强。
- 百度地图 JS API：城市 POI 较全。
- 腾讯地图 JS API。
- 天地图（国家地理信息公共服务平台）：政务合规、免费 key 可商用。

> 注意：用 OSM/谷歌瓦片叠加国内业务数据时，需要做**坐标偏移纠偏**（WGS84 → GCJ-02），否则数据会"飘"几百米。

## 必备工具库

\`\`\`bash
npm i @turf/turf proj4  # 空间分析 + 坐标转换
# 国内偏移
npm i gcoord            # WGS84 / GCJ-02 / BD-09 互转
\`\`\`

\`\`\`js
import * as turf from '@turf/turf'
import gcoord from 'gcoord'

// 点是否在面内
const pt = turf.point([116.397, 39.908])
const poly = turf.polygon([[[116,39],[117,39],[117,40],[116,40],[116,39]]])
console.log(turf.booleanPointInPolygon(pt, poly)) // true/false

// WGS84 → 高德 GCJ-02
const [lng, lat] = gcoord.transform([116.397, 39.908], gcoord.WGS84, gcoord.GCJ02)
\`\`\`

## 小结

- **轻量、移动端优先** → Leaflet。
- **功能全、协议全（WMS/WFS）** → OpenLayers。
- **3D/自定义样式** → Mapbox GL / MapLibre。
- **三维地球/数字孪生** → Cesium。
- **大数据可视化** → Deck.gl / L7（蚂蚁开源，封装友好）。
- **空间分析一定加 Turf.js**，别自己写几何算法。`
  },
  {
    id: 'gis-002',
    category: 'gis',
    title: 'GeoJSON 格式规范与常用几何类型？',
    difficulty: '中等',
    tags: ['GeoJSON', '数据格式', '几何类型', 'FeatureCollection'],
    answer: `## 什么是 GeoJSON

基于 JSON 的地理空间数据编码格式（RFC 7946），是前端 GIS 库最通用的"母语"：Leaflet、Mapbox、OpenLayers、Turf、Deck.gl 都原生吃 GeoJSON。

核心规则：
- 坐标顺序**永远是 [经度 lng, 纬度 lat, 可选高度 alt]**（注意和日常 "lat-lng" 反着来）。
- 坐标参考默认 WGS84 (EPSG:4326)。
- 数值类型用 number（不要字符串）。

## 基本结构

### 1. FeatureCollection（最常用）

一组要素的集合，带一个数组 features。

\`\`\`json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [116.397, 39.908] },
      "properties": { "name": "天安门", "level": 5 }
    },
    {
      "type": "Feature",
      "geometry": { "type": "LineString", "coordinates": [[116.3, 39.9], [116.4, 39.9], [116.5, 40.0]] },
      "properties": { "routeId": "R001" }
    }
  ]
}
\`\`\`

- 每个 Feature 必有：\`geometry\`（可 null）+ \`properties\`（任意 JSON 对象，存业务属性）。
- 前端批量渲染基本都用 FeatureCollection。

### 2. 几何类型一览

| 类型 | 含义 | coordinates 结构 |
| --- | --- | --- |
| **Point** | 单点 | \`[lng, lat]\` |
| **MultiPoint** | 多点 | \`[[lng,lat], [lng,lat]]\` |
| **LineString** | 单条线（2+ 点） | \`[[p1],[p2],[p3]]\` |
| **MultiLineString** | 多条线 | \`[ 线1坐标, 线2坐标 ]\` |
| **Polygon** | 单个面（可含内环洞） | \`[外环, 内环1, 内环2]\`，每个环首尾坐标相同 |
| **MultiPolygon** | 多个面 | \`[ 面1坐标, 面2坐标 ]\` |
| **GeometryCollection** | 混合几何 | \`geometries: [ {type:'Point',...}, {type:'LineString',...} ]\` |

### Polygon 的坑：外环方向 + 闭合

- **外环逆时针、内环顺时针**（RFC 推荐，但大多数库会兼容，校验用可忽略）。
- **必须闭合**：最后一个点 = 第一个点（数组里显式写相同坐标）。
- **有"洞"**：多个数组，第一个外环，后面都是洞。

\`\`\`json
{
  "type": "Polygon",
  "coordinates": [
    [[0,0],[10,0],[10,10],[0,10],[0,0]],
    [[2,2],[2,4],[4,4],[4,2],[2,2]]
  ]
}
\`\`\`

## 常见前端操作

### 解析 / 校验

\`\`\`bash
npm i @turf/helpers @turf/boolean-valid geojson-validation
\`\`\`

### 构造 GeoJSON

\`\`\`js
import { featureCollection, point, lineString, polygon } from '@turf/helpers'

const fc = featureCollection([
  point([116.397, 39.908], { name: '天安门' }),
  lineString([[116.3, 39.9], [116.4, 39.9]], { id: 'L1' }),
  polygon([[[116, 39], [117, 39], [117, 40], [116, 40], [116, 39]]], { type: 'A' })
])
\`\`\`

### 读取 CSV/普通数组 → GeoJSON

\`\`\`js
const rows = [
  { name: 'BJ', lng: 116.397, lat: 39.908, value: 100 },
  { name: 'SH', lng: 121.473, lat: 31.230, value: 120 }
]
const fc = {
  type: 'FeatureCollection',
  features: rows.map(r => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [Number(r.lng), Number(r.lat)] },
    properties: { name: r.name, value: r.value }
  }))
}
\`\`\`

## 优化：大数据场景

1. **抽稀（简化）**：线/面节点过多时，用 \`@turf/simplify\` 简化。
2. **切片化**：点超 1w+ 时，考虑转成矢量瓦片 (PMTiles / MVT)。
3. **TopoJSON**：共享边界（省界、街道）存储更省，加载后转 GeoJSON 再渲染。
4. **压缩**：网络传输 gzip 或 Protocol Buffer（Geobuf）。

## 常见坑

1. **经纬度反了**：GeoJSON 是 [lng, lat]，不少后端返回 [lat, lng]，加载后数据跑到几内亚湾（0,0）附近就是这个原因。
2. **多边形未闭合**：首尾不一致导致渲染失败或"面变线"。
3. **字符串坐标**：后端返回字符串形式数字，需要 map 成 Number。
4. **自相交多边形**：布尔运算和 union 会出错，用 Turf 先 cleanCoords / simplify。
5. **国内坐标偏移**：高德/百度底图下的业务数据要从 WGS84 转到对应坐标系。

## 校验工具

- https://geojsonlint.com ：在线校验、可视化。
- https://mapshaper.org ：shp/GeoJSON 互转、简化、合并、裁剪。
- QGIS / ArcGIS Pro：可视化 + 修复拓扑。`
  },
  {
    id: 'gis-003',
    category: 'gis',
    title: '瓦片地图原理与 XYZ / WMTS / WMS 协议？',
    difficulty: '中等',
    tags: ['瓦片', 'XYZ', 'WMTS', 'WMS', '切片', '分辨率'],
    answer: `## 为什么用"瓦片"

世界地图（缩放 0~18）如果一张整图：一张是 262144×262144 像素（约 1.4GB PNG），浏览器根本扛不住。

**解决思路：金字塔切片**。每个缩放级别（zoom，z）把整张地图切成 256×256（或 512×512）像素的小方块（tile），前端根据当前视口只请求可视范围内的瓦片。

## XYZ 瓦片（最常用，OSM/谷歌/高德/Mapbox 方案）

### 编号规则

- **z**：缩放级别（0 = 全球一张；1 = 2×2；... 最大一般 18~22）。
- **x**：横向瓦片编号，从 0 到 2^z - 1（从西往东）。
- **y**：纵向瓦片编号，从 0 到 2^z - 1（从上往下，**左上角原点**）。

URL 模板：
\`\`\`
https://tile.openstreetmap.org/{z}/{x}/{y}.png
https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}
\`\`\`

加载顺序：低 z 先出（模糊），高 z 后补（清晰）。前端四叉树按视口范围算 x/y 范围再并发请求。

### 分辨率与层级换算

在 256×256 瓦片、Web Mercator (EPSG:3857) 下：

| z | 约地图精度 | 每像素代表距离（赤道） |
| --- | --- | --- |
| 0 | 世界 | 156 km |
| 4 | 国家 | ~10 km |
| 10 | 城市 | ~150 m |
| 16 | 街区 | ~2.4 m |
| 19 | 建筑 | ~0.3 m |

### TMS：Y 轴反着来（OSGeo 标准）

Y 轴从**下往上**（左下角原点），使用较少。转换：\`y_tms = (2^z - 1) - y_xyz\`。

## WMS（Web Map Service，OGC 标准）

服务端**动态渲染**一张图片，不是切片。URL 参数：

\`\`\`
?SERVICE=WMS
&VERSION=1.1.1
&REQUEST=GetMap
&LAYERS=roads,water          要渲染的图层名
&SRS=EPSG:4326               坐标系
&BBOX=minx,miny,maxx,maxy    要渲染的地理范围（四至）
&WIDTH=1024&HEIGHT=768       出图像素
&FORMAT=image/png            出图格式
&TRANSPARENT=TRUE
\`\`\`

- 优点：**矢量后端动态出图**，能按用户权限/时间/属性实时过滤、样式灵活。
- 缺点：**服务端压力大**，不能像瓦片那样缓存；前端移动/缩放时每次都要重请求，体验差。
- 适用：政务内网、小范围专题图、实时叠加业务数据。

## WMTS（Web Map Tile Service，OGC 标准）

WMS 的"预切瓦片版"。服务端事先把所有 z/x/y 切好，前端按瓦片拿（本质和 XYZ 一样，只是元数据 / URL schema 更标准，支持多种 TileMatrixSet）。

两种请求方式：
- **KVP**：KEY=VALUE。
- **RESTful**：\`layer/{style}/{tileMatrixSet}/{tileMatrix}/{tileRow}/{tileCol}\`。

- 优点：兼容 GIS Server（GeoServer、MapServer、ArcGIS）。
- 前端使用：OpenLayers 有 \`ol/source/WMTS\` 原生支持；Leaflet 用插件。

## 矢量瓦片 (Vector Tiles) = MVT / PMTiles

XYZ 的现代升级：瓦片里传的是**压缩的几何数据 (protobuf)**，不是图片。**前端拿到后用 WebGL 按 style.json 绘制**。

\`\`\`
https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=xxx
\`\`\`

优点：
1. **一张瓦片多种样式**：白天/夜间模式、用户自定义配色，不用换瓦片。
2. **体积更小**：PBF + gzip，通常 < 50KB/张。
3. **可交互查询**：矢量几何保留，鼠标悬浮/点击可拿到要素属性。
4. **3D 挤压建筑、符号化**：完全客户端决定。

缺点：
- 前端渲染压力大（低配置机器卡顿）。
- 切片成本比栅格高（Mapbox/OpenMapTiles 工具链）。

## 前端加载瓦片的代码

### Leaflet（XYZ）

\`\`\`js
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map)
\`\`\`

### OpenLayers（WMS + WMTS）

\`\`\`js
import TileLayer from 'ol/layer/Tile'
import WMS from 'ol/source/TileWMS'
import WMTS from 'ol/source/WMTS'

// 动态 WMS
new TileLayer({
  source: new WMS({
    url: 'https://example.com/geoserver/ows',
    params: { LAYERS: 'topp:states', TILED: true }
  })
})
\`\`\`

### Mapbox GL（矢量瓦片样式）

\`\`\`js
map.on('load', () => {
  map.addSource('buildings', {
    type: 'vector',
    url: 'pmtiles://.../buildings.json'   // TileJSON
  })
  map.addLayer({
    id: 'buildings-fill',
    type: 'fill-extrusion',
    source: 'buildings',
    'source-layer': 'buildings',
    paint: {
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-color': '#aaa'
    }
  })
})
\`\`\`

## 选型建议

| 需求 | 方案 |
| --- | --- |
| 在线展示、C 端地图 | XYZ 栅格（高德/OSM）或 MVT 矢量 |
| 政务对接 GeoServer/ArcGIS Server | WMS（动态）+ WMTS（静态底图） |
| 需要离线包 | XYZ 打包 mbtiles / PMTiles |
| 3D、多皮肤样式、百万级 POI | 矢量瓦片 + Mapbox GL / MapLibre |
| 高性能栅格（卫星影像） | 云端 COG + TiTiler（按需切） |

## 关键坑

1. **跨域**：瓦片域名通配，要给瓦片源加 CORS，或用 Nginx 反向代理。
2. **缓存**：瓦片是天然静态资源，CDN 缓存 + HTTP Cache 拉满。
3. **层级越界**：请求超出 maxZoom 会 404，要正确设置地图 min/maxZoom。
4. **分辨率单位混淆**：前端不要直接用"每像素多少米"做业务换算，统一用 Turf 的 distance/area 经纬度计算。`
  },
  {
    id: 'gis-004',
    category: 'gis',
    title: '国内坐标系（WGS84、GCJ-02、BD-09）偏移与纠偏？',
    difficulty: '中等',
    tags: ['坐标系', 'GCJ-02', 'BD-09', 'WGS84', '纠偏', '国测局'],
    answer: `## 国内为什么有三套坐标

国家安全要求：地图服务必须对真实地理坐标（WGS84）做**非线性加密偏移**。不同厂商偏移算法不同 → 同一份经纬度在不同底图上位置不一样。

## 三种核心坐标系

| 缩写 | 名称 | 使用方 | 特点 |
| --- | --- | --- | --- |
| **WGS84** (EPSG:4326) | 世界大地坐标系 1984 | GPS 芯片、Google Earth、国际通用底图 | 真实坐标，国际标准 |
| **GCJ-02** | 国测局 02（火星坐标） | 高德（AMap）、腾讯地图、阿里云 DataV、Google Maps CN | 国家强制偏移加密，所有境内公开出版地图必须使用 |
| **BD-09** | 百度坐标系 | 百度地图 | 在 GCJ-02 基础上**再偏一次**（百度自有的 BD-09ll；BD-09mc 是 Web Mercator 米制） |

经验数据：偏移大概在 **300~500 米**量级，城市里肉眼可见错位。

## 你会碰到的坑

### 坑 1：GPS 点飘在海里 / 马路外面

真实场景：后端从 GPS 拿到 WGS84 点，前端直接叠到高德地图上 → 点整体向西南方向偏了几百米。

**解决**：业务数据坐标一定要和**底图坐标**一致。

| 底图 | 前端业务数据应使用 |
| --- | --- |
| 高德地图 | GCJ-02 |
| 腾讯地图 | GCJ-02 |
| 百度地图 | BD-09（或把底图切 GCJ-02，不太推荐） |
| OpenStreetMap / Mapbox 国际版 | WGS84 |
| 天地图（官方） | CGCS2000 ≈ WGS84（差异厘米级，前端忽略） |

### 坑 2：用户上传 KML/SHP/CSV 坐标到底是哪套？

**无法从数值本身判断**，只能结合来源：
- 手持 GPS / RTK / 航迹文件 → 通常 WGS84。
- 高德 Web 服务 API 返回 → GCJ-02。
- 百度地图 API 返回 → BD-09。
- 来自某省/市政务 GIS → 通常 CGCS2000（和 WGS84 差异可忽略）。

拿不准就用可视化工具对比（QGIS 加载三份底图叠加看哪个最贴合）。

## 前端转换工具

### 推荐：gcoord（纯 JS，无外部依赖）

\`\`\`bash
npm i gcoord
\`\`\`

\`\`\`js
import gcoord from 'gcoord'

// 单点转换：输入 [lng, lat]，源 → 目标
const gcj = gcoord.transform(
  [116.397428, 39.90923],   // WGS84 坐标（天安门）
  gcoord.WGS84,
  gcoord.GCJ02
)
// GCJ-02 输出，约偏移 300~500m

const bd = gcoord.transform(gcj, gcoord.GCJ02, gcoord.BD09)
\`\`\`

支持的常量：\`WGS84 / GCJ02 / BD09 / BD09MC / EPSG3857 / CGCS2000\`。

### 批量转 GeoJSON

\`\`\`js
function transformFC(fc, from, to) {
  function walkCoords(geom, fn) {
    if (!geom) return geom
    switch (geom.type) {
      case 'Point':
        return { ...geom, coordinates: fn(geom.coordinates) }
      case 'LineString': case 'MultiPoint':
        return { ...geom, coordinates: geom.coordinates.map(fn) }
      case 'Polygon': case 'MultiLineString':
        return { ...geom, coordinates: geom.coordinates.map(ring => ring.map(fn)) }
      case 'MultiPolygon':
        return { ...geom, coordinates: geom.coordinates.map(poly => poly.map(ring => ring.map(fn))) }
      default: return geom
    }
  }
  return {
    ...fc,
    features: fc.features.map(f => ({
      ...f,
      geometry: walkCoords(f.geometry, c => gcoord.transform(c, from, to))
    }))
  }
}

const gcjFC = transformFC(wgsFC, gcoord.WGS84, gcoord.GCJ02)
\`\`\`

## 不同平台 API 注意

### 1. 高德地图 Web JS API

- \`AMap.convertFrom(lnglat, type, cb)\`：官方提供批量转换（type=3：GPS → 高德，type=5：百度 → 高德）。
- **优先用高德 SDK 自带转换**，比前端自己算更准（包含最新保密参数）。

\`\`\`js
AMap.convertFrom([[116.3, 39.9]], 'gps', (status, result) => {
  if (status === 'complete') console.log(result.locations)
})
\`\`\`

### 2. 百度地图 JS API

- 有 \`BMap.Convertor.translate(points, 2, 0, cb)\`（2 表示从 WGS-84 转到 BD-09）。
- 也支持 GCJ → BD。

### 3. 后端预转换（推荐）

前端纠偏是"兜底"，**最好后端入库/出接口时统一成目标坐标系**，前端直接渲染，避免首屏抖动和交互不一致。

## 逆向转换（火星 → 真坐标）注意

- GCJ-02 → WGS84 **不存在官方算法**，只有第三方的近似迭代反解（gcoord 里已经实现了近似反解）。
- 精度大概 1~5 米，绝大多数业务够用但不能当测绘用。
- 法律合规：公开场景不要大规模做火星→真实坐标反解。

## 合规提示

- 国内公开地图应用：必须选择**有甲级互联网地图服务资质**的供应商（高德、百度、腾讯、天地图等）做底图，**不能直接用 Google Maps / OSM 叠加境内业务**并公开上线。
- 业务数据应在服务端统一存 GCJ-02，输出给对应前端即可。
- 涉及高精度测绘数据必须脱密后才能上线。

## 工程化建议

1. **建一个 coord 模块**封装所有转换，业务代码禁止直接调用 gcoord，方便未来统一切算法。
2. **后端接口声明坐标系**：接口文档必须写清楚返回是哪套，避免前端瞎猜。
3. **可视化自查工具**：在开发模式叠加同坐标 POI 到三张底图上，看哪个"贴合实际道路"。
4. **Web Mercator (EPSG:3857)**：是"投影坐标"，单位米；前端地图库内部一般自动帮你转，写业务代码统一用经纬度即可。`
  },
  {
    id: 'gis-005',
    category: 'gis',
    framework: 'turf',
    title: 'Turf.js 空间分析常用方法与实战？',
    difficulty: '中等',
    tags: ['Turf.js', '空间分析', '点在面内', '距离', '缓冲区'],
    answer: `## Turf.js 是什么

浏览器 / Node 通用的 **JavaScript 空间分析库**，相当于 GIS 领域的 Lodash。100+ 纯函数，输入输出都是 GeoJSON。

\`\`\`bash
npm i @turf/turf              # 全量
npm i @turf/helpers @turf/distance @turf/boolean-point-in-polygon   # 按需装单包，体积更小
\`\`\`

## 必备：Helper 构造

\`\`\`js
import { point, lineString, polygon, featureCollection, feature } from '@turf/helpers'

const pt = point([116.397, 39.908], { name: '天安门' })
const line = lineString([[116.3,39.9],[116.4,39.95],[116.5,39.9]])
const poly = polygon([
  [[116,39],[117,39],[117,40],[116,40],[116,39]]  // 外环必须闭合
])
const fc = featureCollection([pt, point([116.4, 39.92])])
\`\`\`

## Top 10 高频方法

### 1. 两点距离 distance / bearing

\`\`\`js
import distance from '@turf/distance'
import bearing from '@turf/bearing'

// 返回单位：默认 kilometers，也能 miles/degrees
const d = distance(point([116.3, 39.9]), point([116.5, 39.95]), { units: 'km' })
console.log(d)  // ~ 23 km

// 方位角（0 = 北，90 = 东）
const brng = bearing(point([116.3, 39.9]), point([116.5, 39.95]))
\`\`\`

### 2. 点是否在面内 booleanPointInPolygon（地理围栏核心）

\`\`\`js
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import booleanPointInLineString from '@turf/boolean-point-on-line'

const pt = point([116.4, 39.5])
const poly = polygon([[[116,39],[117,39],[117,40],[116,40],[116,39]]])

console.log(booleanPointInPolygon(pt, poly))     // true
console.log(booleanPointInPolygon(pt, poly, { ignoreBoundary: true }))  // 边界上是否算 false
\`\`\`

业务用：判断用户 GPS 是否在电子围栏/配送范围/禁行区内。

### 3. 缓冲区 buffer（点/线/面扩张 n 米）

\`\`\`js
import buffer from '@turf/buffer'

const station = point([116.397, 39.908])
const range500m = buffer(station, 500, { units: 'meters' })  // 500 米范围（圆形多边形）

// 配送范围：道路 2 公里沿线
const road = lineString([[116.3,39.9],[116.4,39.9],[116.5,39.95]])
const delivery = buffer(road, 2, { units: 'kilometers' })
\`\`\`

业务：站点辐射、POI 搜索半径、洪水/火灾扩散、噪声范围。

### 4. 面面积 area / 线长度 length

\`\`\`js
import area from '@turf/area'
import length from '@turf/length'

console.log(area(poly))           // 平方米，约 111km×111km ≈ 1.23e10
console.log(length(line))         // 度，需要 {units:'kilometers'} 转
console.log(length(line, { units: 'kilometers' }))
\`\`\`

### 5. 质心 centroid / 内点 pointOnFeature

\`\`\`js
import centroid from '@turf/centroid'
import pointOnFeature from '@turf/point-on-feature'

const labelPt = centroid(poly)    // 数学质心（可能在凹多边形外面）
const labelOn = pointOnFeature(poly)  // 保证在要素内部（贴标签必用）
\`\`\`

### 6. 交集/并集/差集：intersect / union / difference / xor

\`\`\`js
import intersect from '@turf/intersect'
import union from '@turf/union'
import difference from '@turf/difference'

const polyA = polygon([[[0,0],[10,0],[10,10],[0,10],[0,0]]])
const polyB = polygon([[[5,5],[15,5],[15,15],[5,15],[5,5]]])

const and = intersect(polyA, polyB)     // 重叠区 5~10,5~10
const or  = union(polyA, polyB)         // 合并
const sub = difference(polyA, polyB)    // A 去掉 B
\`\`\`

业务：多个商圈合并、两个地块求重叠、禁行区从配送范围里扣掉。

### 7. 最近点 nearestPoint / 点到线距离 pointToLineDistance

\`\`\`js
import nearestPoint from '@turf/nearest-point'
import pointToLineDistance from '@turf/point-to-line-distance'

const candidates = featureCollection([
  point([116.3, 39.9], { id: 'A' }),
  point([116.5, 39.95], { id: 'B' })
])
console.log(nearestPoint(point([116.4, 39.92]), candidates))  // 返回最接近的 feature

// 用户到地铁线路的垂直距离
const distM = pointToLineDistance(
  point([116.401, 39.91]),
  lineString([[116.39,39.90],[116.41,39.92]]),
  { units: 'meters' }
)
\`\`\`

### 8. 沿线插值 along / 线切分 lineSlice

\`\`\`js
import along from '@turf/along'
import lineSlice from '@turf/line-slice'

// 从起点走 5 公里到的点
const pos = along(line, 5, { units: 'kilometers' })

// 切下起止两点间的线段
const start = point([116.3, 39.9])
const stop  = point([116.4, 39.95])
const subLine = lineSlice(start, stop, line)
\`\`\`

业务：轨迹回放取某一时刻位置、路径分段展示。

### 9. 抽稀 simplify（大数据减点）

\`\`\`js
import simplify from '@turf/simplify'

// tolerance 越大越简
const lightLine = simplify(line, { tolerance: 0.001, highQuality: true, mutate: false })
\`\`\`

10 万节点的省界线 simplify 后变 300 节点，渲染性能显著提升。

### 10. 外包框 bbox / bboxPolygon / 裁剪 bboxClip

\`\`\`js
import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'
import bboxClip from '@turf/bbox-clip'

const box = bbox(fc)  // [minX, minY, maxX, maxY]
const rect = bboxPolygon(box)
const onlyBeijing = bboxClip(bigPoly, [115.5, 39.5, 117.5, 41])
\`\`\`

## 实战：LBS 附近门店查询

\`\`\`js
import * as turf from '@turf/turf'

function findNearby(user, storesFC, radiusKm = 3, limit = 10) {
  const range = turf.circle(user, radiusKm, { units: 'kilometers', steps: 32 })
  const inRange = storesFC.features.filter(
    f => turf.booleanPointInPolygon(f, range)
  )
  return inRange
    .map(f => ({
      ...f.properties,
      dist: turf.distance(user, f, { units: 'kilometers' })
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, limit)
}
\`\`\`

## 性能注意

1. 超大数据量（> 10w 要素）：
   - 先做**空间索引**再做 booleanPointInPolygon。Turf 有 \`@turf/rbush\` 或用第三方 \`geokdbush\`。
   - 先粗筛（bbox 比较）再细算（真正几何运算）。
2. 频繁调用 buffer/intersect：放 Web Worker 中跑，避免主线程卡顿。
3. 单位陷阱：distance/length 默认 degrees，一定要传 units。
4. 非法自相交面求 union 会抛错，先 \`simplify\` 或 \`@turf/clean-coords\`。

## 生态

- 浏览器 / Node 通用。
- 与 @turf/turf-sync（同步替代，Web Worker 友好）、RBush（R 树空间索引）搭配能扛百万级数据。
- 地图前端基本都要引入 Turf，把它放公共 chunk。`
  },
  {
    id: 'gis-006',
    category: 'gis',
    title: '前端地图渲染性能优化手段（10w+ POI / 轨迹）？',
    difficulty: '困难',
    tags: ['性能优化', 'WebGL', 'Canvas', '聚合', '抽稀', '虚拟列表'],
    answer: `## 性能瓶颈在哪

前端地图主要有三种渲染路径：
1. **DOM（SVG）**：Leaflet 的 circleMarker / polyline 默认 DOM。优点交互好，**> 1000 个 DOM 就卡**。
2. **Canvas 2D**：Leaflet canvas renderer / L7 早期。~5w 点还行，超过掉帧。
3. **WebGL**：Mapbox GL / Deck.gl / L7 / MapLibre。百万级点起步，是大数据的唯一解。

优化总思路：**降数量 + 换渲染器 + 降更新频率**。

## 一、减少要素数量（最有效）

### 1. 聚合 / 抽稀 / 热力，而不是把原始数据一股脑扔上去

#### 点聚合（Cluster）

Leaflet：\`leaflet.markercluster\` 插件（DOM 聚合气泡）。
Mapbox GL / Deck.gl：内置 supercluster 算法（k-d 树）。

\`\`\`js
// Mapbox GL 内置聚合
map.addSource('pois', {
  type: 'geojson',
  data: fc,
  cluster: true,
  clusterRadius: 50,
  clusterMaxZoom: 14
})
// 聚合点显示数字、散开显示点
\`\`\`

效果：低层级全国 10w 点 → 只渲染几十个聚合圆。

#### 线/面抽稀 simplify

长轨迹 10w 个点 → Turf simplify 减到 3000 个点（视觉几乎无差异）。

\`\`\`js
import simplify from '@turf/simplify'
const light = simplify(heavyLine, { tolerance: 0.0005, highQuality: true })
\`\`\`

tolerance 按 zoom 变：z 小 tolerance 大；z 大 tolerance 小。

#### 视口内过滤

只渲染可视区 bbox 内的要素。超出范围的不渲染。

\`\`\`js
function renderInView(map, fc) {
  const [minX, minY, maxX, maxY] = map.getBounds().toArray().flat()
  const inView = fc.features.filter(f => {
    const [x, y] = f.geometry.coordinates
    return x >= minX && x <= maxX && y >= minY && y <= maxY
  })
  source.setData(featureCollection(inView))
}
map.on('moveend', () => renderInView(map, allFC))
\`\`\`

大数据场景配**空间索引**（RBush / KDBush / geokdbush）：\`O(log n)\` 查范围内点，不是线性扫。

## 二、换 WebGL 渲染器

### 选 Deck.gl 叠加 Mapbox / MapLibre

Deck.gl 按层组织：

\`\`\`js
import { MapboxOverlay } from '@deck.gl/mapbox'
import {
  ScatterplotLayer, HeatmapLayer, ArcLayer, PathLayer, PolygonLayer, TextLayer
} from '@deck.gl/layers'
import { DataFilterExtension } from '@deck.gl/extensions'

const overlay = new MapboxOverlay({
  layers: [
    new ScatterplotLayer({
      id: 'poi',
      data: pois,      // 数组（百万级）
      getPosition: d => [d.lng, d.lat],
      getRadius: 3,
      getFillColor: d => d.type === 'A' ? [255, 0, 0] : [0, 200, 0],
      pickable: true,
      radiusMinPixels: 2,
      radiusMaxPixels: 12
    }),
    new HeatmapLayer({
      id: 'heat',
      data: pois,
      getPosition: d => [d.lng, d.lat],
      getWeight: d => d.value,
      radiusPixels: 40
    })
  ]
})
map.addControl(overlay)
\`\`\`

常用 Layer：
- 点：ScatterplotLayer / IconLayer（带图标的点，用 Sprite Atlas）。
- 线：PathLayer / LineLayer / ArcLayer（飞线/OD，自动弯曲）。
- 面：PolygonLayer / FillExtrusionLayer（3D 挤压）。
- 文本：TextLayer（SDF 字体）。
- 轨迹动画：TripsLayer（按时间维度运动的线）。

扩展：
- \`DataFilterExtension\`：前端实时滑杆筛选（时间、数值），GPU 内过滤，不重建数据。

### 备选：L7（蚂蚁开源，封装友好）

\`\`\`js
import { Scene, PointLayer } from '@antv/l7'
import { GaodeMap } from '@antv/l7-maps'

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({ style: 'light', center: [116.39, 39.9], zoom: 11 })
})
new PointLayer().source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size(5)
  .color('type', ['#f00','#0f0','#00f'])
  .active(true).addTo(scene)
\`\`\`

中文生态好，新手友好。

## 三、渲染层级优化

### 1. 批量 setData，频繁小数据改成节流更新

\`\`\`js
import throttle from 'lodash.throttle'
const update = throttle(() => source.setData(newFC), 200)
\`\`\`

### 2. 避免重绘全量数据

- Mapbox GL：source 里的 feature 尽量用 \`setFeatureState\` 改属性，而不是整个 setData。
- 选中高亮：两个 Layer（正常层 + 高亮层，数据只有被选中 ID），不要重画整个层。

### 3. 资源复用

- 图标：用 sprite atlas 合成一张大图，避免千个 icon 千个 img。
- 文字：Mapbox 用 SDF glyphs，大小自适应、清晰、体积小。

## 四、数据与网络

### 1. 分级加载

z ≤ 6 → 省界聚合；z 7~10 → 市界 + 聚合；z ≥ 11 → 真实点数据。

### 2. 矢量瓦片 (MVT / PMTiles)

把 GeoJSON 预切成瓦片，按需加载。当前视口一次只拿 20~50 张 pbf。

- 后端切图工具：tippecanoe（GeoJSON → mbtiles）、PMTiles 工具链。
- 前端用 maplibre-gl 直接加载 PMTiles，无需服务器，S3/OSS 直读。

### 3. 传输压缩

- 响应体 gzip/brotli。
- 大数组转 Float32Array → Binary + protobuf（deck.gl Binary Data Access 快 2~5x）。

## 五、交互与主线程不阻塞

### 1. 计算移到 Worker

Turf 布尔运算、simplify、聚类、坐标转换、按时间回放插值都放 Worker。

\`\`\`js
// worker.js
import * as turf from '@turf/turf'
self.onmessage = ({ data }) => {
  const result = turf.simplify(data.line, { tolerance: data.t })
  self.postMessage(result)  // Transferable 对象更快
}
\`\`\`

### 2. 鼠标 hover 用 gpu-picking

WebGL 库（Deck、Mapbox、L7）都支持 \`pickable: true\`，GPU 颜色编码点拣，O(1)。**不要自己遍历要素数组找最近点**（O(n) 10w 次直接卡）。

### 3. 动画 60fps 秘籍

- 轨迹回放用 TripsLayer / 改 shader uniform，而不是每秒改整个 GeoJSON。
- camera.animateTo / flyTo 用 easing，避免频繁 moveend。
- 频繁动画使用 \`requestAnimationFrame\` 不要 setInterval。

## 六、常见优化 Checklist

1. **层级越低 → 展示越少**：聚合 / 抽样 / 省界，不要在 z=3 放 10 万个点。
2. **DOM 渲染器换 Canvas / WebGL**：Leaflet 默认 DOM，3000 点以上必换。
3. **大数据用 Deck.gl / L7，不用手写 Canvas**：你写的 Canvas 挑不过 WebGL。
4. **moveend 回调节流 + 空间索引粗筛**：避免每次拖动全量过滤。
5. **复杂计算 Worker 化**：Turf/simplify/buffer/cluster 别占主线程。
6. **渲染属性按层级动**：小 zoom 大半径少细节，大 zoom 才精绘。
7. **观察 Chrome Performance / WebGL Inspector**：看是 CPU（坐标转换）还是 GPU（绘制）瓶颈，对症下药。

## 典型配置推荐

| 数据量 | 地图库 | 渲染方案 | 关键优化 |
| --- | --- | --- | --- |
| < 1k 点 | 任意 | 随便写 | - |
| 1k~1w | Leaflet / OpenLayers | Canvas renderer + markercluster | 聚合、抽稀 |
| 1w~50w | Mapbox GL / L7 | GeoJSON source + cluster | 聚合、分级加载、FeatureState |
| 50w~500w | Deck.gl / L7 | WebGL 二进制数组 DataFilterExt | Worker 预处理、Binary、飞线用 ArcLayer |
| 百万级 + 全国分发 | 矢量瓦片 | PMTiles / MVT + Deck.gl TileLayer | 切片、CDN、按需加载 |

一句话心法：**不要让浏览器渲染你看不到的数据**（视口、聚合、抽稀、分级），剩下的交给 WebGL。`
  },
  {
    id: 'gis-007',
    category: 'gis',
    framework: 'mapbox',
    title: 'Mapbox GL JS 的矢量瓦片与 style spec 原理？',
    difficulty: '中等',
    tags: ['Mapbox', '矢量瓦片', 'style spec', 'WebGL', 'MVT'],
    answer: `## 为什么 Mapbox 能又快又好看

Mapbox GL JS 的核心是**矢量瓦片（Vector Tile, MVT）+ WebGL 渲染 + style spec**三位一体：
1. **数据端**：服务端把 GeoJSON/Shapefile 预切成 MVT 矢量瓦片（PBF 编码），按 \`z/x/y\` 分级存储在 CDN。
2. **渲染端**：浏览器用 WebGL 拉取瓦片 → 解码成几何 → **在 GPU 上实时绘制**（不是贴图片）。
3. **样式端**：一份 JSON（style spec）描述"每个图层怎么画"。

## 和栅格瓦片的根本区别

| 维度 | 栅格瓦片（XYZ PNG） | 矢量瓦片（MVT） |
| --- | --- | --- |
| 服务端做什么 | 切成图片 | 切成几何数据 |
| 样式 | 写死在图片里 | 浏览器实时渲染，可动态切换 |
| 旋转/倾斜 | 图片会模糊 | 矢量重投影，无失真 |
| 文字标注 | 易重叠 | 可碰撞检测、避让 |
| 体积 | 较大（PNG） | 较小（PBF 压缩） |
| 交互 | 只能命中像素 | 可查询要素属性 |

## style spec 核心结构

\`\`\`json
{
  "version": 8,
  "sources": {
    "osm": {
      "type": "vector",
      "tiles": ["https://cdn.example.com/{z}/{x}/{y}.pbf"],
      "minzoom": 0,
      "maxzoom": 14
    }
  },
  "layers": [
    {
      "id": "water",
      "type": "fill",
      "source": "osm",
      "source-layer": "water",
      "paint": { "fill-color": "#0ff" }
    },
    {
      "id": "road-label",
      "type": "symbol",
      "source": "osm",
      "source-layer": "road",
      "layout": {
        "text-field": "{name}",
        "text-size": 12
      }
    }
  ]
}
\`\`\`

关键字段：
- **sources**：数据源（vector / raster / geojson / image / video）。geojson source 用于前端临时数据，不走瓦片。
- **layers**：渲染图层。每层有 type（fill / line / symbol / circle / fill-extrusion / heatmap / hillshade / raster / background）。
- **paint** vs **layout**：paint 可平滑插值动画（如 fill-color），layout 改变布局需重排（如 text-field）。
- **表达式**：\`["match", ["get", "class"], "motorway", "#f00", "#ccc"]\` 实现"按属性动态着色"。

## 数据驱动画画（Data-Driven Styling）

\`\`\`js
// 按人口密度给区块上色
map.setPaintProperty('population', 'fill-color', [
  'interpolate',
  ['linear'],
  ['get', 'density'],
  0, '#fff',
  1000, '#f00',
  5000, '#800'
])
\`\`\`

这是矢量瓦片最大的威力：**数据不重新拉取，样式实时改**。

## 前端代码骨架

\`\`\`js
import mapboxgl from 'mapbox-gl'
mapboxgl.accessToken = 'pk.xxxx'

const map = new mapboxgl.Map({
  container: 'map',
  style: './style.json',     // 可托管自己的 style JSON
  center: [116.39, 39.91],
  zoom: 10,
  hash: true
})

map.on('load', () => {
  // 动态加一个 GeoJSON 图层
  map.addSource('route', { type: 'geojson', data: geojson })
  map.addLayer({
    id: 'route-line',
    type: 'line',
    source: 'route',
    paint: { 'line-color': '#38f', 'line-width': 4 }
  })
})
\`\`\`

## 离线 / 自建瓦片

- **MapLibre GL JS**：Mapbox GL JS 的开源 fork（Mapbox v2 改协议后社区分叉），完全开源免费，style spec 兼容。
- 自建瓦片：Tippecanoe（命令行切 MVT）、Martin（Rust server）、postgis + pg_tileserv。
- 瓦片存储：MBTiles（SQLite 单文件）/ PMTiles（云原生平铺文件，无需 server）。

## 易错点

- **source-layer 写错**：MVT 内部按 source-layer 分组，写错图层空白但不报错。
- **zoom 范围**：\`minzoom/maxzoom\` 控制可见，矢量瓦片切到 z14，再放大需要 \`maxzoom\` + 内插。
- **图层顺序**：layers 数组顺序 = z-index，先画的在下面，symbol 类一般放最后。
- **raster vs vector 混用**：底图栅格 + 业务矢量是常见组合，注意 source 类型别混。`
  },
  {
    id: 'gis-008',
    category: 'gis',
    framework: 'leaflet',
    title: 'Leaflet 的图层体系与常用插件？',
    difficulty: '中等',
    tags: ['Leaflet', '图层', '插件', 'L.LayerGroup', 'Marker'],
    answer: `## Leaflet 图层抽象

Leaflet 把一切可视元素抽象为 \`L.Layer\`，统一通过 \`map.addLayer/removeLayer\` 管理。

\`\`\`
L.Layer（基类）
├── L.TileLayer        底图瓦片
│   └── L.TileLayer.WMS
├── L.Path             矢量图形（线/面）
│   ├── L.Polyline / L.Polygon / L.Rectangle / L.Circle
│   └── L.GeoJSON      （解析 GeoJSON 自动分发到上面）
├── L.Marker           点标记（DOM）
├── L.LayerGroup       图层组（批量操作）
│   └── L.FeatureGroup （带事件 + bindPopup 的增强组）
├── L.ImageOverlay     图片叠加
├── L.VideoOverlay     视频叠加
└── L.Popup / L.Tooltip 弹窗/提示
\`\`\`

## 常用 API

\`\`\`js
const map = L.map('map').setView([39.91, 116.39], 10)

// 1. 底图瓦片
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map)

// 2. GeoJSON 业务数据
const layer = L.geoJSON(geojson, {
  style: f => ({ color: f.properties.color || '#38f' }),
  pointToLayer: (f, latlng) => L.marker(latlng, { icon: myIcon }),
  onEachFeature: (f, lyr) => lyr.bindPopup(f.properties.name)
}).addTo(map)

// 3. 图层组：批量切换
const group = L.layerGroup([m1, m2, m3]).addTo(map)
group.clearLayers()

// 4. 控件：图层显隐
L.control.layers(null, {
  '业务图层': layer,
  '热力图': heatLayer
}).addTo(map)
\`\`\`

## 必装插件

| 插件 | 用途 | 备注 |
| --- | --- | --- |
| **leaflet.markercluster** | 海量点聚合 | 1k+ marker 必装，替代方案 Leaflet.CanvasLayer |
| **Leaflet.heat** | 热力图 | 基于 canvas，性能不错 |
| **leaflet-draw** | 绘制点/线/面 | 测距、框选、采集 |
| **Proj4Leaflet** | 自定义投影 | 国内 CGCS2000、局域投影必备 |
| **Leaflet.VectorGrid** | 矢量瓦片 | 渲染 MVT/PBF，性能接近 Mapbox |
| **Leaflet.Mask** | 区域外遮罩 | 突出某一行政区 |
| **leaflet-measure-path** | 测距测面 | 直接显示在图形上 |
| **Leaflet.Sleep** | 滚动不抢占滚轮 | 内嵌页面时防误触 |

## 渲染器选择

\`\`\`js
// 默认 SVG，1k+ 要素切 Canvas
L.Map.addInitHook(function () {
  this.options.preferCanvas = true   // 全局用 Canvas 渲染器
})
\`\`\`

- **SVG**：每个要素独立 DOM 节点，事件好绑，500 以内最佳。
- **Canvas**：所有要素画一张 canvas，性能强，事件需空间索引命中检测，1000~5w 适用。
- 超过 5w → 上 VectorGrid（MVT）或换 Mapbox/Deck.gl。

## 坑

- **\`L.geoJSON\` 坐标顺序**：GeoJSON 是 \`[lng, lat]\`，Leaflet API 是 \`[lat, lng]\`，但 \`L.geoJSON\` 内部自动转换，**直接传 GeoJSON 不要手动翻转**。
- **markercluster 性能**：\`disableClusteringAtZoom\` 防止高 zoom 仍聚合；\`removeOutsideVisibleBounds\` 必开。
- **图层 zIndex**：TileLayer 默认 200，矢量默认 400，业务数据可用 pane 提层。
- ** CRS**：默认 EPSG:3857，要做 EPSG:4326 底图需 \`L.CRS.EPSG4326\` + tile 源支持。`
  },
  {
    id: 'gis-009',
    category: 'gis',
    title: '地图交互事件体系与坐标转换（屏幕/经纬度/投影）？',
    difficulty: '中等',
    tags: ['事件', '坐标转换', 'project', 'unproject', 'epsg'],
    answer: `## 三套坐标

前端地图交互必须搞清楚三套坐标系：

| 坐标系 | 单位 | 用途 | 例子 |
| --- | --- | --- | --- |
| **地理坐标** (lng/lat) | 度 | 数据存储、API 通信 | [116.39, 39.91] |
| **投影坐标** (x/y) | 米 | 渲染、距离计算 | [12958200, 4852000] |
| **像素坐标** (px) | px | DOM 事件、交互 | [320, 240] |
| **屏幕坐标** (clientX/Y) | px | 鼠标事件 | [820, 540] |

Web Mercator (EPSG:3857) 是 Web 地图事实标准：x = lng × R × π/180，y = R × ln(tan(π/4 + lat/2))。

## 事件体系（以 Mapbox 为例）

\`\`\`js
map.on('click', e => {
  // e.point      像素坐标（相对地图容器）
  // e.lngLat     经纬度（自动 unproject）
  console.log(e.point, e.lngLat)
})

map.on('mousemove', 'route-layer', e => {
  // 命中要素：e.features
  const f = e.features[0]
  popup.setLngLat(e.lngLat).setHTML(f.properties.name).addTo(map)
})
\`\`\`

事件类型：
- **地图事件**：click / dblclick / mousemove / mouseout / contextmenu / zoom / move / rotate / pitch / load / idle。
- **图层事件**：\`map.on('click', 'layerId', fn)\`，命中检测由渲染器内部空间索引完成，性能远好于遍历要素。
- **要素状态**：\`setFeatureState\` 改 hover 态不重渲染图层。

## 坐标转换核心方法

\`\`\`js
// Mapbox / MapLibre
map.project([lng, lat])      // → {x, y} 像素坐标
map.unproject({x, y})        // → {lng, lat}
map.getBounds()              // → LngLatBounds（视口经纬度范围）
map.queryRenderedFeatures()  // 查询视口内要素

// Leaflet
map.latLngToLayerPoint(latlng)    // → Point（像素）
map.layerPointToLatLng(point)
map.project(latlng, zoom)         // → 任意 zoom 的像素
map.unproject(point, zoom)
map.getBounds().toBBoxString()    // → "west,south,east,north" 给 WMS
\`\`\`

## 投影转换：proj4

\`\`\`js
import proj4 from 'proj4'
proj4.defs('EPSG:4490', '+proj=longlat +ellps=GRS80 +no_defs')

// WGS84 → Web Mercator
const [x, y] = proj4('EPSG:4326', 'EPSG:3857', [116.39, 39.91])

// Web Mercator → 国测局 GCJ-02（需 gcoord）
import gcoord from 'gcoord'
const gcj = gcoord.transform([116.39, 39.91], gcoord.WGS84, gcoord.GCJ02)
\`\`\`

## 实战：点击地图测距

\`\`\`js
let line = []
map.on('click', e => {
  line.push([e.lngLat.lng, e.lngLat.lat])
  if (line.length >= 2) {
    const dist = turf.length(turf.lineString(line), { units: 'kilometers' })
    popup.setLngLat(e.lngLat).setHTML(\`距离: \${dist.toFixed(2)} km\`).addTo(map)
  }
})
\`\`\`

## 常见坑

- **lng/lat 顺序**：Turf、GeoJSON 是 [lng, lat]；Leaflet API、高德/百度 SDK 是 [lat, lng]，混用必出 bug。
- **投影 EPSG**：底图 EPSG:3857，业务数据 EPSG:4326，库会自动转，但 WMS 自定义投影要显式声明 CRS。
- **Web Mercator 纬度上限**：约 ±85.05°，再高拉不到极地，极地要用其他投影。
- **像素坐标 zoom 相关**：\`project(lnglat)\` 是当前 zoom 像素，换 zoom 需 \`project(lnglat, targetZoom)\`。
- **拖拽 vs 点击**：用户拖拽后会触发 click，用 \`map.on('mousedown') + mouseup + 未移动\` 判断真点击，或 \`moveend\` 设置标志位。`
  },
  {
    id: 'gis-010',
    category: 'gis',
    title: '热力图、飞线图、聚类图等可视化图层如何实现？',
    difficulty: '中等',
    tags: ['热力图', '飞线', '聚类', '可视化', 'Deck.gl', 'Turf'],
    answer: `## 1. 热力图（Heatmap）

**原理**：每个点贡献一个高斯核，叠加成密度场，按阈值映射颜色。

\`\`\`js
// Mapbox 内置 heatmap 图层
map.addLayer({
  id: 'heat',
  type: 'heatmap',
  source: 'points',
  paint: {
    'heatmap-weight': ['interpolate', ['linear'], ['get', 'value'], 0, 0, 100, 1],
    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
    'heatmap-color': [
      'interpolate', ['linear'], ['heatmap-density'],
      0, 'rgba(0,0,0,0)',
      0.2, '#00f', 0.4, '#0f0', 0.6, '#ff0', 0.8, '#f00', 1, '#fff'
    ],
    'heatmap-radius': 30,
    'heatmap-opacity': 0.7
  }
})
\`\`\`

适用：连续型密度（人口、订单、事故）。**不适合**离散型分类（用聚类图）。

## 2. 飞线图（迁徙图）

**原理**：两点之间画弧线（贝塞尔/大圆弧），沿路径动画流光。

\`\`\`js
// Deck.gl ArcLayer
new ArcLayer({
  id: 'flight',
  data: flights,   // [{from: [lng,lat], to: [lng,lat], count}]
  getSourcePosition: d => d.from,
  getTargetPosition: d => d.to,
  getSourceColor: [0, 200, 255],
  getTargetColor: [255, 60, 0],
  getWidth: d => Math.sqrt(d.count) / 10,
  greatCircle: true,             // 大圆弧
  pickable: true
})

// 流光动画：用 TripsLayer 或在 Mapbox 用 line-gradient + 实时改 paint
map.setPaintProperty('flight', 'line-gradient', [
  'interpolate', ['linear'], ['line-progress'],
  0, 'rgba(0,200,255,0)', 0.5, '#0cf', 1, 'rgba(0,200,255,0)'
])
\`\`\`

要点：
- 弧线高度 = 距离函数，太低看不清，太高喧宾夺主。
- 流光用 \`line-dasharray\` + \`dasharray-step\` 动画，或 canvas 自绘纹理。

## 3. 聚类图（Cluster）

**原理**：相邻点合并成大圆，zoom 增大再展开。

\`\`\`js
// Mapbox 内置 cluster
map.addSource('points', {
  type: 'geojson',
  data,
  cluster: true,
  clusterRadius: 50,
  clusterMaxZoom: 14
})

// 聚合圆
map.addLayer({
  id: 'cluster', type: 'circle', source: 'points', filter: ['has', 'point_count'],
  paint: {
    'circle-radius': ['step', ['get', 'point_count'], 15, 50, 20, 100, 25],
    'circle-color': ['step', ['get', 'point_count'], '#0f0', 50, '#ff0', 100, '#f00']
  }
})

// 点击展开
map.on('click', 'cluster', e => {
  const id = e.features[0].properties.cluster_id
  source.getClusterExpansionZoom(id).then(z => map.easeTo({ center: e.lngLat, zoom: z }))
})
\`\`\`

适用：1k~50w POI，能保持交互流畅。

## 4. 六边形网格（Hexbin）

把点按六边形单元聚合，比聚类的"圆形"更稳定，适合密度对比。

\`\`\`js
// Turf 生成网格
const grid = turf.hexGrid(bbox, 0.5, { units: 'kilometers' })
const counted = turf.collect(grid, points, 'value', 'sum')
\`\`\`

Deck.gl 的 \`HexagonLayer\` 直接 GPU 聚合，百万点实时。

## 5. 等值面/分级填色（Choropleth）

\`\`\`js
map.setPaintProperty('province', 'fill-color', [
  'interpolate', ['linear'], ['get', 'gdp'],
  0, '#fff', 1000, '#fdd', 5000, '#f88', 10000, '#800'
])
\`\`\`

数据驱动 + 颜色阶梯，最常见的政务地图可视化。

## 选型速查

| 场景 | 推荐方案 |
| --- | --- |
| 人口密度、热区 | Heatmap（内置） |
| 50w+ 点密度 | Hexbin / 3D 热力图（Deck.gl） |
| 迁徙、流向 | ArcLayer（Deck.gl） |
| POI 分布 | Cluster（内置） |
| 区域指标 | Choropleth |
| 时序轨迹 | TripsLayer（Deck.gl） |
| 3D 柱状 | FillExtrusionLayer（内置） / ColumnLayer |

## 性能心法

- 1w 以内用 Mapbox 原生图层 + GeoJSON source。
- 1w~50w 开 \`cluster\` 或转 MVT。
- 50w+ 必上 Deck.gl（WebGL + 二进制）或矢量瓦片。`
  },
  {
    id: 'gis-011',
    category: 'gis',
    title: '前端如何实现海量轨迹回放与轨迹纠偏？',
    difficulty: '困难',
    tags: ['轨迹回放', 'Turf', '插值', 'requestAnimationFrame', '纠偏'],
    answer: `## 轨迹回放的核心问题

1. **数据量大**：一辆车一天 1w+ 点，1k 辆车 = 千万级。
2. **流畅播放**：60fps 下每帧画 1k 条线 + 时间窗口。
3. **时间对齐**：不同车采样间隔不同，要按"虚拟时钟"对齐推进。
4. **轨迹质量**：GPS 漂移、跳点、信号丢失，要纠偏/插值。

## 单车回放（基础版）

\`\`\`js
const coords = track.map(p => [p.lng, p.lat])
const line = turf.lineString(coords)
const totalLen = turf.length(line, { units: 'kilometers' })

let progress = 0
function step() {
  progress += 0.001  // 每帧前进 1m
  if (progress > totalLen) return
  const pt = turf.along(line, progress, { units: 'kilometers' })
  marker.setLngLat(pt.geometry.coordinates)
  requestAnimationFrame(step)
}
step()
\`\`\`

要点：用 \`turf.along\` 沿线取点，**比按数组索引推进更平滑**（采样不均也能匀速）。

## 多车同步回放（关键：虚拟时钟）

\`\`\`js
const tracks = [...]  // 每条轨迹: { points: [{t, lng, lat}], id }
const startTime = Math.min(...tracks.map(t => t.points[0].t))
const endTime = Math.max(...tracks.map(t => t.points.at(-1).t))
const speed = 100   // 倍速

let virtualTime = startTime
let lastFrame = performance.now()

function frame(now) {
  const dt = (now - lastFrame) / 1000
  lastFrame = now
  virtualTime += dt * 1000 * speed

  // 每条轨迹找当前时刻的插值位置
  tracks.forEach(t => {
    const p = interpolateAtTime(t.points, virtualTime)
    if (p) updateMarker(t.id, p)
  })
  if (virtualTime < endTime) requestAnimationFrame(frame)
}
requestAnimationFrame(frame)

// 二分查找 + 线性插值
function interpolateAtTime(points, t) {
  let lo = 0, hi = points.length - 1
  if (t < points[0].t || t > points[hi].t) return null
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1
    points[mid].t <= t ? lo = mid : hi = mid
  }
  const a = points[lo], b = points[hi]
  const r = (t - a.t) / (b.t - a.t)
  return [a.lng + (b.lng - a.lng) * r, a.lat + (b.lat - a.lat) * r]
}
\`\`\`

## 性能优化（万车级）

1. **数据预处理转二进制**：\`Float32Array\` 存坐标 + 时间戳，比对象数组省 80% 内存。
2. **WebWorker 计算**：插值放 worker，主线程只画。
3. **按时间分块加载**：把轨迹按 1 分钟切块，按虚拟时钟 fetch。
4. **WebGL 渲染**：Deck.gl TripsLayer 内部就是这套，万车实时。

\`\`\`js
new TripsLayer({
  id: 'trips',
  data: trips,
  getPath: d => d.path,        // [[lng,lat,t],...]
  getTimestamps: d => d.path.map(p => p[2]),
  getColor: [0, 200, 255],
  widthMinPixels: 2,
  currentTime: virtualTime / 1000,
  trailLength: 30              // 拖尾时长
})
\`\`\`

## 轨迹纠偏与平滑

GPS 原始轨迹常有：跳点、漂移、信号丢失。

\`\`\`js
// 1. 速度过滤：超过 200km/h 的点视为跳点
const cleaned = points.filter((p, i) => {
  if (i === 0) return true
  const prev = points[i - 1]
  const dist = turf.distance([prev.lng, prev.lat], [p.lng, p.lat], { units: 'kilometers' })
  const dt = (p.t - prev.t) / 3600
  return dist / dt < 200
})

// 2. 卡尔曼滤波（npm: kalman-filter）
import { KalmanFilter } from 'kalman-filter'
const kf = new KalmanFilter({ observation: 2 })
const smoothed = cleaned.map(p => kf.filter([p.lng, p.lat]))

// 3. 路网匹配（map-matching）
// OSRM / Valhalla 提供服务端匹配 API
fetch(\`https://router.project-osrm.org/match/v1/driving/\${coords.join(';')}\`)
  .then(r => r.json())
  .then(matched => drawLine(matched.tracepoints))
\`\`\`

## 时间轴控件

\`\`\`js
// 拖动时间轴 → 跳转到对应时刻
slider.oninput = e => {
  const ratio = e.target.value / 1000
  virtualTime = startTime + (endTime - startTime) * ratio
  cancelAnimationFrame(rafId)
  renderFrame()   // 立即渲染一帧
}
playBtn.onclick = () => requestAnimationFrame(frame)
\`\`\`

## 实战坑

- **跨日期线**：lng 从 179 跳到 -179 直接画线横穿地图，需检测并拆段。
- **时区**：所有时间戳统一存 UTC，前端按用户时区显示。
- **轨迹回放卡顿**：90% 是 DOM marker 太多，改 canvas/WebGL 立竿见影。
- **暂停后再播放**：要重置 \`lastFrame = performance.now()\`，否则 dt 巨大导致瞬移。`
  },
  {
    id: 'gis-012',
    category: 'gis',
    title: '离线地图部署方案与瓦片切片流程？',
    difficulty: '中等',
    tags: ['离线地图', '瓦片切片', 'Tippecanoe', 'MBTiles', 'PMTiles'],
    answer: `## 为什么要离线

- **政务/内网项目**：数据不外泄，无法访问公网地图服务。
- **车载/船载**：弱网或无网环境。
- **降本**：Mapbox 商业瓦片按量计费，内网部署可省费用。

## 离线地图三件套

1. **底图瓦片**（栅格或矢量）
2. **瓦片服务**（HTTP server 或静态文件）
3. **前端库**（Leaflet / Mapbox / MapLibre）

## 方案 1：栅格瓦片 + 静态文件

最简单，适合中小项目。

\`\`\`bash
# 1. 下载瓦片（开源工具 download-osm-tiles / tile-downloader）
# 2. 按标准 XYZ 目录组织
tiles/
├── 5/
│   ├── 21/
│   │   ├── 13.png
│   │   └── 14.png
\`\`\`

\`\`\`js
// Leaflet 直接指向本地目录
L.tileLayer('http://内网IP/tiles/{z}/{x}/{y}.png', { maxZoom: 16 }).addTo(map)
\`\`\`

缺点：放大后模糊，样式不可改，体积大（一个城市 z5~16 约 5GB）。

## 方案 2：MBTiles + tile server

**MBTiles** 是 SQLite 单文件，存储所有瓦片，便于分发。

\`\`\`bash
# 服务端：用 tileserver-gl（开源）
docker run -p 8080:80 -v $(pwd):/data maptiler/tileserver-gl
# 自动识别 *.mbtiles 并提供 XYZ / WMTS API
\`\`\`

\`\`\`js
L.tileLayer('http://内网:8080/data/v3/{z}/{x}/{y}.png').addTo(map)
\`\`\`

## 方案 3：矢量瓦片 + MapLibre（推荐）

矢量瓦片可动态换样式、旋转无失真、体积小。

### 切片：Tippecanoe

\`\`\`bash
# GeoJSON → MVT 矢量瓦片
tippecanoe -o china.mbtiles \\
  -Z 4 -z 14 \\
  --drop-densest-as-needed \\
  --extend-zooms-if-still-dropping \\
  roads.geojson buildings.geojson

# 转 PMTiles（云原生平铺存储，无需 server）
pmtiles convert china.mbtiles china.pmtiles
\`\`\`

### 服务

- **tileserver-gl**：本地 MBTiles，提供 MVT + style。
- **PMTiles + 任意静态服务器**：前端用 \`pmtiles\` 协议直接 range 请求，**无需瓦片服务端**。

\`\`\`js
import { Protocol } from 'pmtiles'
import maplibregl from 'maplibre-gl'

const p = new Protocol()
maplibregl.addProtocol('pmtiles', p.tile)

const map = new maplibregl.Map({
  container: 'map',
  style: './style.json',
  // style.json 里 source.tiles: ["pmtiles://china.pmtiles/{z}/{x}/{y}"]
})
\`\`\`

## 切片策略要点

| 数据规模 | 切片 zoom | 工具 |
| --- | --- | --- |
| 全国路网 | 4~14 | Tippecanoe |
| 单省建筑 | 10~16 | Tippecanoe / postgis |
| 几百 POI | 不切片，前端直载 GeoJSON | — |
| 卫星影像 | 5~18 | rio-tiler / gdal2tiles |

Tippecanoe 关键参数：
- \`-Z 4 -z 14\`：起止 zoom。
- \`--drop-densest-as-needed\`：自动抽稀防瓦片超 500K。
- \`--layer=name\`：source-layer 名。
- \`--no-tile-compression\`：若 nginx 不解压，需关掉 gzip。
- \`--simplification=10\`：简化几何减体积。

## 字体与图标

矢量瓦片的文字标注需要字体 PBF：
- 字体切片工具：\`font-maker\` / \`genfont\`。
- 把 \`{fontstack}/{range}.pbf\` 放静态服务器。
- style.json 的 \`glyphs\` 指向 \`http://内网/fonts/{fontstack}/{range}.pbf\`。

图标 sprite：
\`spritezero\` 把 SVG 打包成 \`sprite.json + sprite.png\`。

## 完整离线部署清单

\`\`\`
/static
├── tiles/china.pmtiles       # 矢量瓦片
├── fonts/{fontstack}/{range}.pbf
├── sprite/sprite.json + sprite.png
├── style.json                # 引用以上资源
└── index.html                # 引入 maplibre-gl
\`\`\`

任一静态服务器（nginx / express）即可，零后端逻辑。

## 内网坐标系坑

- 内网底图常用 CGCS2000 (EPSG:4490) 或高斯投影，需 \`Proj4Leaflet\` 自定义 CRS。
- 矢量瓦片默认 EPSG:3857，其他投影需自定义切片 + 自定义 MapLibre projection（v3+ 支持）。
- 与高德/百度底图叠加：业务数据要先 WGS84 → GCJ-02/BD-09。

## 更新策略

- 瓦片按区域切片，**只重切变化区域**，用 \`tippecanoe-decode\` + diff。
- PMTiles 支持 \`pmtiles extract\` 按 bbox 抽取子集，便于增量更新。
- 缓存策略：HTTP \`Cache-Control: immutable\`（瓦片永不变化）+ 资源加 hash。`
  },
  {
    id: 'gis-013',
    category: 'gis',
    framework: 'openlayers',
    title: 'OpenLayers 的 Map / View / Layer / Source 体系？',
    difficulty: '中等',
    tags: ['OpenLayers', 'Map', 'View', 'Layer', 'Source', '架构'],
    answer: `## OpenLayers 的核心抽象

OpenLayers（OL）是功能最全的开源 GIS 库，采用严格的四层抽象：

\`\`\`
Map          容器，管理图层、控件、交互、overlay
 ├── View        视图：projection / center / zoom / rotation
 ├── Layer[]     图层：决定"怎么画"（可见性、透明度、样式）
 │    └── Source    数据源：决定"画什么"（瓦片、矢量、图片）
 ├── Control[]   控件：缩放、比例尺、全屏、图层切换（DOM）
 ├── Interaction[] 交互：拖拽、滚轮、绘制、选取、修改
 └── Overlay[]   覆盖物：弹窗、HTML 定位元素
\`\`\`

**关键理解**：Layer 和 Source 是分离的——同一个 Source 可被多个 Layer 用不同样式渲染（如一个面数据同时画填充和边界）。

## 最小示例

\`\`\`js
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import OSM from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { Style, Fill, Stroke } from 'ol/style'

const map = new Map({
  target: 'map',
  view: new View({
    projection: 'EPSG:3857',
    center: [12958200, 4852000],   // 投影坐标（米）
    zoom: 10
  }),
  layers: [
    new TileLayer({ source: new OSM() }),
    new VectorLayer({
      source: new VectorSource({
        url: './areas.geojson',
        format: new GeoJSON()
      }),
      style: new Style({
        fill: new Fill({ color: 'rgba(0,150,255,0.3)' }),
        stroke: new Stroke({ color: '#06f', width: 2 })
      })
    })
  ]
})
\`\`\`

## View：视图与投影

\`\`\`js
new View({
  projection: 'EPSG:4326',        // 用经纬度（center 直接传 [lng, lat]）
  center: [116.39, 39.91],
  zoom: 10,
  minZoom: 3,
  maxZoom: 18,
  extent: [73, 3, 136, 53]        // 限制平移范围（中国境域）
})

// 动画跳转
map.getView().animate({ center: [116.39, 39.91], zoom: 12, duration: 800 })
\`\`\`

注意：projection 决定 center 单位。EPSG:3857 用米，EPSG:4326 用度。

## Layer / Source 常用组合

| Layer 类型 | Source 类型 | 用途 |
| --- | --- | --- |
| TileLayer | OSM / XYZ / WMTS / BingMaps | 栅格底图 |
| VectorLayer | Vector / Cluster / VectorTile | 矢量数据 |
| VectorTileLayer | VectorTile | MVT 矢量瓦片 |
| ImageLayer | ImageWMS / ImageArcGISRest | 单张 WMS 图 |
| Graticule | — | 经纬网 |

## 加载矢量数据并设置样式

\`\`\`js
const vector = new VectorLayer({
  source: new VectorSource({ url: './pois.geojson', format: new GeoJSON() }),
  style: (feature, resolution) => {
    const level = feature.get('level')
    return new Style({ /* 按 level 返回不同样式 */ })
  }
})

// 动态改样式不重新加载数据
vector.setStyle(feature => new Style({ /* ... */ }))
\`\`\`

\`resolution\`（米/像素）让样式随 zoom 缩放：\`feature.get('size') / resolution\`。

## 控件与交互

\`\`\`js
import { defaults, ScaleLine, FullScreen } from 'ol/control'
import { Select, Draw, Modify, Snap } from 'ol/interaction'

map.addControl(new ScaleLine({ units: 'metric' }))
map.addInteraction(new Select({ style: selectedStyle }))

// 绘制 + 修改 + 吸附
const draw = new Draw({ source, type: 'Polygon' })
const modify = new Modify({ source })
const snap = new Snap({ source })
map.addInteraction(draw); map.addInteraction(modify); map.addInteraction(snap)
\`\`\`

## 与 Leaflet/Mapbox 的取舍

| 维度 | OpenLayers | Leaflet | Mapbox GL |
| --- | --- | --- | --- |
| 功能 | 最全（OGC 全协议、编辑、拓扑） | 中等 | 强（矢量瓦片、3D） |
| 体积 | ~200KB+（按需 import） | ~40KB | ~600KB |
| 学习曲线 | 陡（抽象多） | 平缓 | 中 |
| 投影 | 任意 EPSG（proj4 集成） | 预设几个 | 3857 为主 |
| 适合 | 政企级 GIS、复杂业务 | 轻量展示 | 高度自定义可视化 |

## 坑

- **坐标顺序**：OL 内部统一 [x, y]（即 [lng, lat] 或 [east, north]），和 GeoJSON 一致；但 \`fromLonLat([lng,lat])\` 转投影别漏。
- **proj4 注册**：用非标准 EPSG 必须 \`proj4.defs\` + \`register(OlProjection)\`。
- **样式函数性能**：每帧每个要素都调 style function，复杂样式要缓存 Style 实例。
- **图层销毁**：\`map.removeLayer(layer); layer.dispose()\` 才彻底释放。`
  },
  {
    id: 'gis-014',
    category: 'gis',
    framework: 'openlayers',
    title: 'OpenLayers 如何对接 WMS / WFS / WMTS 与矢量编辑？',
    difficulty: '困难',
    tags: ['OpenLayers', 'WMS', 'WFS', 'WMTS', 'OGC', '矢量编辑'],
    answer: `## OGC 服务三件套

| 服务 | 返回 | OL Source | 典型用途 |
| --- | --- | --- | --- |
| **WMS** | 服务端渲染的图片 | ImageWMS / TileWMS | 出图（不改样式） |
| **WFS** | 矢量数据（GML/GeoJSON） | VectorSource + format | 取要素、编辑回写 |
| **WMTS** | 预切片瓦片 | WMTS（TileImage） | 高性能底图 |

## WMS：服务端出图

\`\`\`js
import ImageLayer from 'ol/layer/Image'
import ImageWMS from 'ol/source/ImageWMS'

new ImageLayer({
  source: new ImageWMS({
    url: 'https://geo.example.com/geoserver/wms',
    params: {
      LAYERS: 'topo:roads',
      FORMAT: 'image/png',
      TRANSPARENT: true,
      CQL_FILTER: "type='highway'"   // 服务端过滤
    },
    ratio: 1,
    serverType: 'geoserver'         // 优化 GetMap 请求
  })
})
\`\`\`

WMS 适合"样式写死在服务端、前端只出图"。

## WMTS：预切片高性能底图

\`\`\`js
import WMTS from 'ol/source/WMTS'
import WMTSTileGrid from 'ol/tilegrid/WMTS'

const grid = new WMTSTileGrid({
  origin: [-20037508.34, 20037508.34],
  resolutions: [156543, 78271, 39135, /* ... */],
  matrixIds: [0, 1, 2, /* ... */]
})

new TileLayer({
  source: new WMTS({
    url: 'https://geo.example.com/geoserver/gwc/service/wmts',
    layer: 'topo:base',
    matrixSet: 'EPSG:3857',
    format: 'image/png',
    tileGrid: grid,
    style: ''
  })
})

// 也可用 ol/source/WMTS.createFromCapabilities() 自动解析 GetCapabilities
\`\`\`

## WFS：取矢量数据

\`\`\`js
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'

const vectorSource = new VectorSource({
  url: (extent) => 'https://geo.example.com/geoserver/wfs?' + new URLSearchParams({
    service: 'WFS',
    version: '1.1.0',
    request: 'GetFeature',
    typeName: 'topo:buildings',
    outputFormat: 'application/json',
    srsName: 'EPSG:3857',
    bbox: extent.join(',') + ',EPSG:3857'   // 视口过滤：只取可见范围
  }),
  format: new GeoJSON(),
  strategy: bbox                          // 滚动时按视口增量加载
})
\`\`\`

\`strategy: bbox\` 是关键：每移图自动按新视口请求，避免一次拉全量。

## WFS-T：前端编辑回写服务端

\`\`\`js
import { Draw, Modify, Snap } from 'ol/interaction'
import WFS from 'ol/format/WFS'
import GML3 from 'ol/format/GML3'

const wfst = new WFS({ featureNS: 'https://topo', featureType: 'buildings', srsName: 'EPSG:3857' })

modify.on('modifyend', e => {
  const feat = e.features.item(0)
  const txn = wfst.writeTransaction([], [feat], [], new GML3())  // update
  fetch('https://geo.example.com/geoserver/wfs', {
    method: 'POST',
    body: new XMLSerializer().serializeToString(txn),
    headers: { 'Content-Type': 'text/xml' }
  })
})
\`\`\`

WFS-T（Transactional WFS）支持 insert/update/delete，是 OL 在政企 GIS 里独有的强项。

## GetFeatureInfo：点查询 WMS 要素属性

\`\`\`js
map.on('singleclick', e => {
  const viewResolution = map.getView().getResolution()
  const url = wmsSource.getFeatureInfoUrl(e.coordinate, viewResolution, 'EPSG:3857', {
    INFO_FORMAT: 'application/json',
    FEATURE_COUNT: 10
  })
  fetch(url).then(r => r.json()).then(showPopup)
})
\`\`\`

不取整图层，只查询点击位置的要素属性。

## 常见坑

- **bbox 的 srsName**：WFS bbox 必须带 EPSG，否则服务端按默认投影解析错位。
- **CORS**：GeoServer 默认不开 CORS，需配 \`cors-allow-all\` 或同域代理。
- **GML 版本**：WFS 1.0.0 用 GML2，1.1.0 用 GML3，版本不匹配解析失败。
- **WMTS 矩阵**：\`matrixIds\` 必须和服务端 GetCapabilities 一致，否则瓦片错位。
- **strategy: all vs bbox**：小数据用 all 一次拉，大数据用 bbox 但要处理去重（feature id）。`
  },
  {
    id: 'gis-015',
    category: 'gis',
    framework: 'mapbox',
    title: 'Mapbox GL 的表达式系统与数据驱动样式？',
    difficulty: '中等',
    tags: ['Mapbox', '表达式', 'interpolate', 'match', '数据驱动'],
    answer: `## 表达式是 Mapbox 的"DSL"

Mapbox style 的 paint/layout 属性值除了字面量，还支持**表达式数组**，类似 Lisp：

\`\`\`
[operator, argument1, argument2, ...]
\`\`\`

\`\`\`json
"fill-color": ["match", ["get", "type"], "park", "#0f0", "water", "#0af", "#ccc"]
\`\`\`

等价于：\`type === 'park' ? '#0f0' : type === 'water' ? '#0af' : '#ccc'\`。

## 表达式分类

| 类别 | 代表 | 用途 |
| --- | --- | --- |
| **数据获取** | \`get\`, \`has\`, \`at\`, \`length\` | 读要素属性 |
| **类型转换** | \`to-number\`, \`to-string\`, \`to-boolean\`, \`to-color\` | 强转 |
| **数学** | \`+\`, \`*\`, \`%\`, \`round\`, \`ln2\` | 运算 |
| **字符串** | \`concat\`, \`upcase\`, \`downcase\`, \`slice\` | 字符串处理 |
| **逻辑** | \`case\`, \`match\`, \`coalesce\`, \`all\`, \`any\`, \`!\` | 条件分支 |
| **插值** | \`interpolate\`, \`step\` | 连续/阶梯映射 |
| **变量** | \`let\`, \`var\` | 复用子表达式 |
| **zoom** | \`["zoom"]\` | 当前缩放级别 |
| **feature-state** | \`["feature-state", "hover"]\` | 要素状态（hover/selected） |

## 数据驱动（Data-Driven Styling）

把 \`["get", "field"]\` 喂给 paint 属性，样式随要素属性变化：

\`\`\`js
// 按人口密度连续插值上色
'fill-color': [
  'interpolate', ['linear'], ['get', 'density'],
  0, '#fffbeb',
  100, '#fcd34d',
  500, '#f59e0b',
  2000, '#b91c1c'
]

// 按类型枚举匹配
'circle-color': [
  'match', ['get', 'category'],
  'A', '#0f0', 'B', '#00f', 'C', '#f00',
  '#999'   // default
]
\`\`\`

## zoom 驱动：随缩放变化

\`\`\`js
// 线宽随 zoom 增大
'line-width': ['interpolate', ['linear'], ['zoom'], 5, 1, 15, 4]

// zoom + 属性双驱动
'circle-radius': [
  'interpolate', ['linear'], ['zoom'],
  5, ['interpolate', ['linear'], ['get', 'mag'], 0, 2, 5, 10],
  15, ['interpolate', ['linear'], ['get', 'mag'], 0, 8, 5, 30]
]
\`\`\`

## let / var 复用

\`\`\`js
'fill-color': [
  'let', 'd', ['get', 'density'],
  ['case', ['>', ['var', 'd'], 1000], '#f00', '#0f0']
]
\`\`\`

## feature-state：无重渲染的交互态

\`\`\`js
// 设置要素状态（不触发图层重绘，性能好）
map.setFeatureState({ source: 'pois', id: featId }, { hover: true })

'circle-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#f00', '#06f']
\`\`\`

适合 hover/select 高亮，万级要素也流畅。

## 运行时改样式

\`\`\`js
map.setPaintProperty('buildings', 'fill-color', newExpr)
map.setLayoutProperty('labels', 'text-size', 14)
map.setFilter('roads', ['==', ['get', 'class'], 'motorway'])   // 过滤
\`\`\`

## 调试技巧

- Mapbox 内置表达式校验：错误会在控制台报 \`layers[N].paint.X: expression must be...\`。
- 用 \`["literal", [...]]\` 包裹数组字面量，否则被当成表达式解析。
- \`["format", ...]\` 实现多段不同样式文字标注。

## 性能边界

- 表达式越简单越快：\`match\` > \`case\`，\`interpolate\` 比 \`step\` 略慢。
- 数据驱动属性会让 GPU 每要素算一次，万级以下无感，10w+ 注意简化。
- \`feature-state\` 比直接改 paint 便宜，优先用它做交互态。`
  },
  {
    id: 'gis-016',
    category: 'gis',
    framework: 'mapbox',
    title: 'Mapbox 3D 地形、fill-extrusion 与自定义图层？',
    difficulty: '困难',
    tags: ['Mapbox', '3D', '地形', 'fill-extrusion', 'terrain', 'CustomLayer'],
    answer: `## Mapbox 3D 三大能力

1. **pitch + bearing**：相机倾斜与旋转
2. **terrain**：真实地形高程（DEM）
3. **fill-extrusion**：面拉伸成 3D 体（建筑）
4. **CustomLayer**：自定义 WebGL 图层（接 Three.js / Deck.gl）

## 相机：倾斜与旋转

\`\`\`js
map.setPitch(60)        // 0~85 度
map.setBearing(30)      // 旋转
map.easeTo({ pitch: 70, bearing: 90, duration: 1000 })

// 鼠标拖拽倾斜：TouchZoomRotateHandler / dragRotate
\`\`\`

## terrain：真实地形

\`\`\`js
map.on('load', () => {
  map.addSource('dem', {
    type: 'raster-dem',
    url: 'mapbox://mapbox.terrain-rgb',   // 或自建 DEM 瓦片
    tileSize: 512,
    maxzoom: 14
  })
  map.setTerrain({ source: 'dem', exaggeration: 1.5 })   // exaggeration 高程夸张系数

  // 天空层（远景天空）
  map.addLayer({ id: 'sky', type: 'sky', paint: { 'sky-color': '#cfd', 'sky-horizon-blend': 0.5 } })
})
\`\`\`

要点：
- \`terrain-rgb\`：每个像素 RGB 编码高程（红×256×256 + 绿×256 + 蓝 - 32768）。
- \`exaggeration\`：1 = 真实，1.5~2 视觉冲击强，地形细节弱时适当夸张。
- 开启 terrain 后所有图层自动贴合地形，无需手动算高度。

## fill-extrusion：3D 建筑

\`\`\`js
map.addLayer({
  id: 'buildings-3d',
  type: 'fill-extrusion',
  source: 'buildings',
  sourceLayer: 'building',
  minzoom: 14,
  paint: {
    'fill-extrusion-color': ['interpolate', ['linear'], ['get', 'height'], 0, '#ddd', 50, '#faa', 200, '#f55'],
    'fill-extrusion-height': ['get', 'height'],          // 楼高（米）
    'fill-extrusion-base': ['get', 'min_height'],        // 底部高（架空/裙楼）
    'fill-extrusion-opacity': 0.85
  }
})
\`\`\`

技巧：
- 无 height 属性可用 \`['interpolate', ['zoom'], 14, 0, 16, 50]\` 假高度。
- \`fill-extrusion-base\` 让架空层（地铁、连廊）悬空。
- 配合 \`terrain\` 自动贴地。

## 自定义图层（CustomLayerInterface）

直接在 Mapbox 渲染管线里插入 WebGL 代码，常用于集成 Three.js / Deck.gl：

\`\`\`js
class ThreeLayer {
  constructor() { this.id = 'three'; this.type = 'custom'; this.renderingMode = '3d' }
  onAdd(map, gl) {
    this.map = map
    this.camera = new THREE.Camera()
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer({ canvas: map.getCanvas(), context: gl })
    this.renderer.autoClear = false
    // 加模型...
  }
  render(gl, matrix) {
    const m = new THREE.Matrix4().fromArray(matrix)
    this.camera.projectionMatrix = m
    this.renderer.resetState()
    this.renderer.render(this.scene, this.camera)
    this.map.triggerRepaint()
  }
}
map.addLayer(new ThreeLayer())
\`\`\`

Mapbox 提供 \`map.transform\`（相机矩阵），可同步 Three.js 相机。社区有 \`threebox\`、\`deck.gl@mapbox\` 封装。

## 实战：3D 城市可视化

\`\`\`js
// 1. 底图 + 地形
map.setTerrain({ source: 'dem', exaggeration: 1.2 })
// 2. 建筑 fill-extrusion 按高度上色
// 3. 业务图层用 CustomLayer 接 Deck.gl ArcLayer 画飞线
// 4. 加 fog 雾化远景
map.setFog({ range: [1, 10], color: '#fff', 'high-color': '#add8e6' })
\`\`\`

## 性能与坑

- **pitch 太大卡顿**：远距离渲染像素多，限制 \`maxPitch: 70\`。
- **terrain + fill-extrusion**：开 terrain 后 fill-extrusion 高度是相对地形还是海拔？答：相对海平面，会自动加地形高程，所以楼顶 = terrain + height。
- **CustomLayer 状态泄漏**：必须 \`renderer.resetState()\` 否则污染 Mapbox WebGL 上下文。
- **相机同步**：Three.js 相机每帧从 \`map.transform\` 取，不要自己 OrbitControls。
- **terrain-rgb 数据源**：自建需用 \`rio-tiler\` 或 \`gdal2tiles\` 切 DEM，颜色编码别搞错。`
  },
  {
    id: 'gis-017',
    category: 'gis',
    framework: 'threejs',
    title: 'Three.js 如何构建 3D 城市地图与建筑白模？',
    difficulty: '困难',
    tags: ['Three.js', '3D 城市地图', '白模', 'ExtrudeGeometry', 'WebGL'],
    answer: `## 为什么用 Three.js 做地图

Mapbox/Cesium 的 3D 是"地图带高度"，Three.js 的 3D 是"完全自由的场景"：
- 完全控制光照、材质、后处理（泛光、辉光、景深）。
- 可做非真实地图（科技风、数据艺术、元宇宙城市）。
- 性能极致（百万面片 60fps）。

代价：要自己处理坐标系、相机、瓦片调度，没有现成地图交互。

## 核心：GeoJSON Polygon → 3D 建筑

\`\`\`js
import * as THREE from 'three'
import { ExtrudeGeometry } from 'three'
import { GeoJSON } from 'geojson'

function buildingToMesh(feature, height) {
  const coords = feature.geometry.coordinates[0]   // 外环 [lng,lat][]
  const shape = new THREE.Shape()
  coords.forEach(([x, y], i) => i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y))

  const geo = new ExtrudeGeometry(shape, {
    depth: height,            // 楼高
    bevelEnabled: false,
    steps: 1
  })
  geo.rotateX(-Math.PI / 2)   // 让高度沿 Y 轴向上
  return new THREE.Mesh(geo, buildingMaterial)
}

buildings.features.forEach(f => {
  const h = f.properties.height || 20
  scene.add(buildingToMesh(f, h))
})
\`\`\`

## 坐标系转换：经纬度 → 场景坐标

Three.js 是右手 Y-up 直角坐标，GeoJSON 是经纬度，必须转换：

\`\`\`js
// 以城市中心为原点，经纬度差 → 米
const CENTER = [116.39, 39.91]
const M_PER_LAT = 111320
const M_PER_LNG = 111320 * Math.cos(CENTER[1] * Math.PI / 180)

function project([lng, lat]) {
  return [
    (lng - CENTER[0]) * M_PER_LNG,
    0,
    (lat - CENTER[1]) * M_PER_LAT   // 注意 Three.js Z 对应地理纬度
  ]
}
\`\`\`

小范围（单城市）可用此线性近似；全国范围必须用 Web Mercator 投影。

## 相机：地图视角控制

\`\`\`js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
const controls = new OrbitControls(camera, renderer.domElement)
controls.maxPolarAngle = Math.PI / 2.2   // 限制不能看到地面下
controls.minDistance = 100
controls.maxDistance = 5000
controls.enablePan = true

// 初始视角：斜俯视
camera.position.set(2000, 1500, 2000)
camera.lookAt(0, 0, 0)
\`\`\`

## 地面与底图

\`\`\`js
// 纯色地面
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(10000, 10000),
  new THREE.MeshStandardMaterial({ color: 0x111827 })
)
ground.rotation.x = -Math.PI / 2
scene.add(ground)

// 或贴一张栅格底图（瓦片拼接）
const loader = new THREE.TextureLoader()
ground.material.map = loader.load('./basemap.png')
\`\`\`

## 光照与材质

\`\`\`js
// 模拟城市天光
scene.add(new THREE.HemisphereLight(0x88aaff, 0x080820, 0.6))
scene.add(new THREE.DirectionalLight(0xffffff, 1.2).translateX(1000).translateY(2000))

// 白模材质：菲涅尔边缘高亮
const buildingMat = new THREE.MeshStandardMaterial({
  color: 0x1a2a4a,
  metalness: 0.2,
  roughness: 0.6,
  emissive: 0x002244,
  emissiveIntensity: 0.3
})
\`\`\`

## 后处理：科技感泛光

\`\`\`js
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.8, 0.4, 0.85))

function animate() { composer.render(); requestAnimationFrame(animate) }
\`\`\`

## 性能优化

- **合并几何**：\`BufferGeometryUtils.mergeGeometries(buildingGeos)\` 把万栋楼合并成一个 Mesh，drawcall 从 1w 降到 1。
- **LOD**：远处用低面数，近处用高精度。
- **InstancedMesh**：相同材质的重复体素（窗户、灯柱）用实例化。
- **视锥剔除**：Three.js 自动开启，但合并后失效，需手动按区块分 Mesh。
- **WebWorker**：GeoJSON 解析 + 几何构建放 worker，主线程只渲染。

## 与 Mapbox 集成

完整自建 Three.js 地图工程量大，常见做法是 **Mapbox 做底图 + CustomLayer 嵌 Three.js**：
- Mapbox 负责底图、瓦片、相机控制、坐标系。
- Three.js 负责特殊 3D 效果（粒子、自定义建筑、数据艺术）。
- 用 \`deck.gl\` 的 \`MapboxLayer\` 是更省事的桥接方案。

## 局限

- 无内置瓦片调度，全国数据需自己写 LOD + 视口加载。
- 地理坐标系要自己维护，跨日期线、极地投影都是坑。
- 交互（点选要素、测距）需用 raycaster 自己实现。

适用场景：科技大屏、数据可视化艺术、元宇宙城市；常规地图选 Mapbox/Cesium 更省。`
  },
  {
    id: 'gis-018',
    category: 'gis',
    framework: 'threejs',
    title: 'Three.js 与 GIS 坐标系集成（threebox / deck.gl 桥接）？',
    difficulty: '困难',
    tags: ['Three.js', 'threebox', 'deck.gl', '坐标集成', 'Mapbox'],
    answer: `## 痛点：两套坐标系

Three.js：右手 Y-up，单位"无意义"（米），原点在场景中心。
地图：经纬度 / Web Mercator，原点在赤道/本初子午线，单位度或米。

要让 3D 模型"贴在地球上某个经纬度"，必须做坐标系桥接。

## 方案 1：threebox（Mapbox + Three.js）

\`threebox\` 是社区库，封装 Mapbox CustomLayer + Three.js，自动同步相机：

\`\`\`js
import Threebox from 'threebox-plugin'
import mapboxgl from 'mapbox-gl'

const tb = new Threebox(map, map.getCanvas().getContext('webgl'), { defaultLights: true })

map.addLayer({
  id: '3d-model',
  type: 'custom',
  renderingMode: '3d',
  onAdd: (map, gl) => {
    const obj = tb.loadObj({ obj: './car.obj' }, (model) => {
      model.setCoords([116.39, 39.91])   // 经纬度直接设置位置
      tb.add(model)
    })
  },
  render: () => tb.update()
})

// 沿轨迹动画
const path = [[116.39, 39.91], [116.40, 39.92]]
obj.followPath({ path, duration: 10000 })
\`\`\`

threebox 自动处理：
- 经纬度 → 世界坐标（用 Mapbox transform）。
- 模型随地图缩放/旋转/倾斜。
- 高度自动贴 terrain。

## 方案 2：deck.gl MapboxLayer（推荐）

deck.gl 原生支持作为 Mapbox 图层嵌入，坐标系完全由 Mapbox 管：

\`\`\`js
import { MapboxLayer } from '@deck.gl/mapbox'
import { ScenegraphLayer } from '@deck.gl/layers'

const carLayer = new MapboxLayer({
  id: 'cars',
  type: ScenegraphLayer,
  data: cars,
  scenegraph: './car.glb',
  getPosition: d => [d.lng, d.lat, d.alt],   // 经纬度！
  getOrientation: d => [0, d.bearing, 90],
  sizeScale: 1
})
map.addLayer(carLayer)
\`\`\`

优势：deck.gl 内部用 Mapbox 的 projection，所有图层和 Mapbox 底图严丝合缝，无需手动同步相机。

## 方案 3：纯 Three.js 手动同步相机

不依赖 threebox，自己写 CustomLayer：

\`\`\`js
class ThreeLayer {
  onAdd(map, gl) {
    this.map = map
    this.camera = new THREE.PerspectiveCamera()
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer({ canvas: map.getCanvas(), context: gl, antialias: true })
    this.renderer.autoClear = false
  }
  render(gl, matrix) {
    // 关键：用 Mapbox 给的投影矩阵
    this.camera.projectionMatrix.fromArray(matrix)
    // 同步相机位置/旋转（从 map.transform）
    const t = this.map.transform
    this.camera.position.set(...this.unproject(t.cameraPosition))
    this.camera.up.set(0, 0, -1)
    this.camera.lookAt(...this.unproject(t.center))

    this.renderer.resetState()
    this.renderer.render(this.scene, this.camera)
    this.map.triggerRepaint()
  }
  // 经纬度 → Mercator 世界坐标
  unproject([lng, lat]) {
    const x = lng / 180
    const y = Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) / Math.PI
    return [x, y, 0]
  }
}
\`\`\`

要点：
- \`matrix\` 参数是 Mapbox 算好的投影矩阵，直接用。
- \`map.transform\` 提供相机位置、朝向、缩放。
- \`renderer.resetState()\` 必须，否则 WebGL 状态污染。

## 高度处理：地形贴附

模型要贴地形（不是悬空）：

\`\`\`js
// 查询某点地形高程
const elevation = map.queryTerrainElevation([lng, lat])
model.position.y = elevation
\`\`\`

或用 deck.gl 的 \`terrainFollowingMode\` 自动贴地。

## 模型朝向：沿路径移动

\`\`\`js
// 计算两点方位角
function bearing([lng1, lat1], [lng2, lat2]) {
  const φ1 = lat1 * Math.PI / 180, φ2 = lat2 * Math.PI / 180
  const Δλ = (lng2 - lng1) * Math.PI / 180
  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  return Math.atan2(y, x) * 180 / Math.PI
}
model.setRotation([0, -bearing(from, to) * Math.PI / 180, 0])
\`\`\`

## 常见坑

- **Z 轴方向**：Three.js Y-up，地图 Z-up（Mercator），模型导入后常"躺平"，需 \`rotateX(-Math.PI/2)\`。
- **模型单位**：GLB/OBJ 默认米，地图单位度，sizeScale 要调。
- **CustomLayer 渲染顺序**：\`renderingMode: '3d'\` 会在 2D 图层之上、symbol 之下；想盖 symbol 用 \`renderingMode: '3d'\` + 调 \`beforeId\`。
- **WebGL 上下文**：Three.js 和 Mapbox 共用一个 GL context，\`autoClear=false\` + \`resetState\` 是必须的，否则画面撕裂。
- **性能**：复杂 GLB 模型用 \`DracoLoader\` 压缩，drawcall 控制在 100 以内。

## 选型建议

| 需求 | 方案 |
| --- | --- |
| 简单加几个 3D 模型 | threebox |
| 大规模 3D 数据可视化 | deck.gl + MapboxLayer |
| 完全自定义渲染管线 | 手动 CustomLayer |
| 不依赖 Mapbox 的纯 3D | 自建 Three.js 场景（见 gis-017） |`
  },
  {
    id: 'gis-019',
    category: 'gis',
    framework: 'cesium',
    title: 'Cesium 的地球、地形与影像体系？',
    difficulty: '困难',
    tags: ['Cesium', '地球', '地形', '影像', 'ImageryLayer', 'WebMapTileServiceImageryProvider'],
    answer: `## Cesium 是什么

CesiumJS 是开源的 **3D 地球引擎**，专为全球尺度、真 3D、时间动态数据设计：
- 球面渲染（不是平面 Mercator），支持全球无缝缩放。
- 内置时间轴（CZML、时间动态数据）。
- 3D Tiles 标准（倾斜摄影/BIM/点云流式加载）。

对比 Mapbox：Mapbox 是"平面地图 + 倾斜"，Cesium 是"真 3D 球体"，全球尺度更强。

## 最小示例

\`\`\`js
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

Cesium.Ion.defaultAccessToken = 'eyJ...'

const viewer = new Cesium.Viewer('cesiumContainer', {
  terrainProvider: Cesium.createWorldTerrain(),
  imageryProvider: new Cesium.UrlTemplateImageryProvider({
    url: 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}&l=6',
    subdomains: ['1', '2', '3', '4']
  }),
  baseLayerPicker: false,
  geocoder: false
})

viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(116.39, 39.91, 5000),   // 经纬度+高度
  orientation: { heading: 0, pitch: -45, roll: 0 }
})
\`\`\`

## 三大核心对象

| 对象 | 作用 | 类比 Mapbox |
| --- | --- | --- |
| **Viewer** | 容器（场景、相机、时钟、控件） | Map |
| **ImageryLayer** | 影像底图（贴在球面） | TileLayer |
| **TerrainProvider** | 地形高程 | terrain source |
| **Entity / Primitive** | 矢量要素 | GeoJSON layer |
| **3D Tiles** | 海量 3D 数据 | 无对应 |

## 影像底图（ImageryLayer）

\`\`\`js
// 1. 在线标准 XYZ
viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  maximumLevel: 19
}))

// 2. WMS
new Cesium.WebMapServiceImageryProvider({
  url: 'https://geo.example.com/geoserver/wms',
  layers: 'topo:base',
  parameters: { transparent: true, format: 'image/png' }
})

// 3. WMTS
new Cesium.WebMapTileServiceImageryProvider({
  url: 'https://.../wmts',
  layer: 'img', style: 'default', tileMatrixSetID: 'EPSG:3857',
  format: 'image/jpeg'
})

// 4. 叠加多图层
const layer = viewer.imageryLayers.addImageryProvider(wmsProvider)
layer.alpha = 0.6          // 透明度
layer.brightness = 1.2     // 亮度
\`\`\`

## 地形（TerrainProvider）

\`\`\`js
// 1. Cesium 在线地形
viewer.terrainProvider = Cesium.createWorldTerrain({ requestVertexNormals: true })

// 2. 自建地形（quantized-mesh 瓦片）
viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
  url: 'https://terrain.example.com/{z}/{x}/{y}.terrain'
})

// 3. 检测相机贴地
viewer.scene.globe.depthTestAgainstTerrain = true
\`\`\`

地形开启后，所有 Entity 自动贴地（\`clampToGround: true\`）。

## Entity：声明式矢量要素

\`\`\`js
viewer.entities.add({
  name: '天安门',
  position: Cesium.Cartesian3.fromDegrees(116.39, 39.91, 0),
  point: { pixelSize: 10, color: Cesium.Color.RED },
  label: { text: '天安门', font: '14pt sans-serif', verticalOrigin: Cesium.VerticalOrigin.BOTTOM },
  billboard: { image: './marker.png', heightReference: Cesium.HeightReference.CLAMP_TO_GROUND }
})

// 折线/面
viewer.entities.add({
  polyline: { positions: Cesium.Cartesian3.fromDegreesArray([116.39,39.91, 116.40,39.92]), width: 3, material: Cesium.Color.BLUE }
})

// 贴地线（沿地形起伏）
polyline: { positions: [...], clampToGround: true, material: new Cesium.PolylineGlowMaterialProperty(...) }
\`\`\`

Entity API 简单，适合几百个要素；上万要素用 \`Primitive\` API（性能更好但复杂）。

## 时间动态数据（Cesium 独门）

\`\`\`js
// 移动的飞机：position 随时间变
viewer.entities.add({
  position: new Cesium.SampledPositionProperty(),
  path: { resolution: 1, material: Cesium.Color.YELLOW, width: 2 }
})
const pos = entity.position
pos.addSample(Cesium.JulianDate.fromIso8601('2026-08-09T00:00:00Z'), Cesium.Cartesian3.fromDegrees(116, 39, 1000))
pos.addSample(Cesium.JulianDate.fromIso8601('2026-08-09T01:00:00Z'), Cesium.Cartesian3.fromDegrees(117, 40, 1000))

// 时间轴自动播放
viewer.clock.startTime = ...; viewer.clock.shouldAnimate = true
\`\`\`

## 坐标转换

\`\`\`js
// 经纬度 → Cartesian3（球面 XYZ）
const c3 = Cesium.Cartesian3.fromDegrees(116.39, 39.91, 100)

// Cartesian3 → 经纬度
const carto = Cesium.Cartographic.fromCartesian(c3)
const lng = Cesium.Math.toDegrees(carto.longitude)

// 屏幕坐标 → 世界坐标
const c3 = viewer.scene.pickPosition(new Cesium.Cartesian2(x, y))
\`\`\`

## 性能

- \`scene.globe.maximumScreenSpaceError\`：调大减少瓦片加载（默认 2，大场景调 4~8）。
- \`requestRenderMode: true\`：无操作时不渲染，省 CPU/GPU。
- Entity 数量 > 1w 转 Primitive 或 3D Tiles。

## 坑

- **Token**：必须配 \`Cesium.Ion.defaultAccessToken\`，否则地形/影像加载失败。
- **CORS**：自建影像/地形服务必须开 CORS。
- **坐标系**：Cesium 内部用 Cartesian3（地心 XYZ），别和经纬度混。
- **资源路径**：\`CESIUM_BASE_URL\` 要指向 static 资源目录，否则 widgets 资源 404。`
  },
  {
    id: 'gis-020',
    category: 'gis',
    framework: 'cesium',
    title: 'Cesium 3D Tiles：倾斜摄影、BIM、点云流式加载？',
    difficulty: '困难',
    tags: ['Cesium', '3D Tiles', '倾斜摄影', 'BIM', '点云', 'LOD'],
    answer: `## 3D Tiles 是什么

3D Tiles 是 OGC 标准，为**海量 3D 内容**设计：把模型按空间切分成树形瓦片，每个瓦片带 LOD（细节层次），浏览器按视口距离流式加载。

适用：倾斜摄影（城市级）、BIM（整栋楼）、点云（激光扫描）、人工模型。

## 数据格式

3D Tiles 一组文件：
- \`tileset.json\`：根文件，描述瓦片树 + boundingVolume + geometricError。
- \`*.b3dm\`：Batched 3D Model（倾斜摄影/建筑）。
- \`*.i3dm\`：Instanced 3D Model（树、灯柱等实例化）。
- \`*.pnts\`：点云。
- \`*.cmpt\`：复合瓦片。

## 加载 tileset

\`\`\`js
const tileset = await Cesium.Cesium3DTileset.fromUrl('./building/tileset.json')
viewer.scene.primitives.add(tileset)

// 初始定位到 tileset
viewer.zoomTo(tileset)
\`\`\`

## 倾斜摄影（ osgb → 3D Tiles）

倾斜摄影原始格式是 osgb（OSG 二进制），需转换：

\`\`\`bash
# 用 CesiumLab / 3dtiles 工具
3dtiles --tilesetJson tileset.json --merge osgb/ --output output/
# 或 CesiumLab GUI：osgb → 3D Tiles
\`\`\`

转换后常调：
\`\`\`js
tileset.maximumScreenSpaceError = 16   // 默认 16，调大加载更粗 LOD 省性能
tileset.dynamicScreenSpaceError = true // 动态：移动时降质量，停下提质量
\`\`\`

## BIM 模型（glTF → 3D Tiles）

BIM（Revit/IFC）→ glTF → b3dm：

\`\`\`bash
# 1. Revit 导出 FBX/glTF
# 2. 用 3dtiles 工具转 b3dm
# 3. 保留构件属性（featureTable.batchTable）
\`\`\`

构件属性查询：
\`\`\`js
const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
handler.setInputAction(e => {
  const picked = viewer.scene.pick(e.position)
  if (picked) {
    const props = picked.getProperty('name')   // 读 batchTable 属性
    console.log('点击构件:', props)
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK)
\`\`\`

## 点云（las/laz → pnts）

\`\`\`bash
# potree-converter 或 cesium-point-cloud-generator
potree-converter -i cloud.las -o output/
\`\`\`

点云渲染：
\`\`\`js
tileset.pointCloudShading.attenuation = true   // 近大远小
tileset.pointCloudShading.maximumAttenuation = 4
\`\`\`

## 样式（3D Tiles Styling）

\`\`\`js
tileset.style = new Cesium.Cesium3DTileStyle({
  color: {
    conditions: [
      ['\${height} > 100', 'color("red")'],
      ['\${height} > 50', 'color("orange")'],
      ['true', 'color("white")']
    ]
  },
  show: '\${type} !== "underground"'
})
\`\`\`

类似 Mapbox 表达式，按 batchTable 属性动态着色/过滤。

## 性能调优

| 参数 | 作用 | 调优 |
| --- | --- | --- |
| \`maximumScreenSpaceError\` | LOD 切换阈值 | 卡顿调大（24），精细调小（8） |
| \`cacheBytes\` | 缓存上限 | 内存足调大（512MB+） |
| \`dynamicScreenSpaceError\` | 移动时降质 | 默认 true，流畅性优先 |
| \`skipLevelOfDetail\` | 跳级加载 | 加载快但可能有跳变 |
| \`preloadWhenHidden\` | 隐藏时预加载 | 多 tileset 切换有用 |

\`\`\`js
tileset.cacheBytes = 536870912   // 512MB
tileset.maximumCacheOverflowBytes = 268435456
\`\`\`

## 切片与部署

\`\`\`
/tilesets
├── building/tileset.json + *.b3dm
├── photogrammetry/tileset.json + *.b3dm
└── pointcloud/tileset.json + *.pnts
\`\`\`

- 用 nginx 静态服务，开 HTTP/2 + range request。
- 大 tileset 分块发布，按区域/楼层切。
- CDN 加速，瓦片加 immutable 缓存。

## 常见坑

- **坐标系**：3D Tiles 内部用 ECEF（地心 XYZ）+ 局部变换矩阵，转换工具会处理；自建要确保 glTF 是 Y-up。
- **高度参考**：BIM 习惯相对正负零，3D Tiles 要绝对高度（贴地形），转换时设 \`transform\`。
- **batchTable 属性丢失**：转换工具不保留属性，构件查询失效，需用支持 batchTable 的工具（3dtiles tool / CesiumLab）。
- **超大 tileset 加载慢**：根瓦片几何误差太大，浏览器一次性加载根，要重新切片让根只包含低 LOD。
- **贴地**：3D Tiles 不会自动贴地形，需 \`Cesium3DTileset.clampToGround\` 或转换时采样地形。

## 与 Mapbox 对比

| 维度 | Cesium 3D Tiles | Mapbox fill-extrusion |
| --- | --- | --- |
| 数据规模 | 城市级（GB~TB） | 单城市建筑（百 MB） |
| 数据类型 | 倾斜摄影/BIM/点云 | 简单拉伸面 |
| LOD | 标准 LOD 树 | 无（靠 minzoom） |
| 全球球面 | 是 | 否（平面投影） |
| 适合 | 智慧城市、测绘 | 数据可视化、轻量 3D |`
  },
  {
    id: 'gis-021',
    category: 'gis',
    framework: 'deckgl',
    title: 'Deck.gl 的图层体系与大规模数据性能优化？',
    difficulty: '困难',
    tags: ['Deck.gl', '图层', 'WebGL', '性能优化', 'Binary', 'Worker'],
    answer: `## Deck.gl 定位

Deck.gl 是 Uber 开源的**大规模地理可视化框架**，基于 WebGL2：
- 50+ 开箱即用图层（Scatterplot / Arc / Hexagon / Trip / 3D Tiles ...）。
- 百万级数据 GPU 渲染。
- 可独立用，也可作为 Mapbox/MapLibre/Leaflet/Cesium 的图层嵌入。

## 核心抽象：Layer + View

\`\`\`js
import { Deck } from '@deck.gl/core'
import { ScatterplotLayer } from '@deck.gl/layers'

new Deck({
  canvas: 'deck',
  initialViewState: { longitude: 116.39, latitude: 39.91, zoom: 10 },
  controller: true,
  layers: [
    new ScatterplotLayer({
      id: 'points',
      data: points,
      getPosition: d => [d.lng, d.lat],
      getRadius: d => Math.sqrt(d.value) * 100,
      getFillColor: [0, 150, 255],
      radiusMinPixels: 2,
      pickable: true
    })
  ]
})
\`\`\`

每个 Layer 是声明式配置，\`data\` 支持 Array / AsyncIterable / GeoJSON / Tileset URL。

## 图层分类

| 包 | 代表图层 | 用途 |
| --- | --- | --- |
| @deck.gl/layers | Scatterplot / Line / Polygon / Icon / Text | 基础矢量 |
| @deck.gl/aggregation-layers | Hexagon / ScreenGrid / Heatmap | 密度聚合 |
| @deck.gl/geo-layers | TileLayer / MVTLayer / TripsLayer / 3DTilesLayer | 地理专用 |
| @deck.gl/mesh-layers | Scenegraph / SimpleMesh | 3D 模型 |
| @deck.gl/mapbox | MapboxLayer | 嵌入 Mapbox |

## 嵌入 Mapbox（最常用）

\`\`\`js
import { MapboxLayer } from '@deck.gl/mapbox'
import { HexagonLayer } from '@deck.gl/aggregation-layers'

map.addLayer(new MapboxLayer({
  id: 'hex',
  type: HexagonLayer,
  data: trips,
  getPosition: d => [d.lng, d.lat],
  radius: 200,
  extruded: true,
  getElevationWeight: d => d.count,
  getColorWeight: d => d.count
}))
\`\`\`

Mapbox 负责底图，Deck.gl 负责大数据可视化，坐标系自动同步。

## TileLayer：按需加载瓦片

\`\`\`js
new TileLayer({
  id: 'tiles',
  data: 'https://tiles.example.com/{z}/{x}/{y}.pbf',
  maxZoom: 14,
  renderSubLayers: props => new MVTLayer(props, {
    getFillColor: f => colorByType(f.properties.type)
  })
})
\`\`\`

视口变化自动 fetch 可见瓦片，支持百万级数据按需渲染。

## 性能优化：百万级数据

### 1. Binary 数据格式

\`\`\`js
// 普通：对象数组（GC 压力大）
data: [{lng, lat, value}, ...]

// Binary：TypedArray（GPU 直传）
data: {
  length: 1000000,
  attributes: {
    getPosition: { value: positionsFloat32, size: 2 },
    getRadius: { value: radiiFloat32, size: 1 }
  }
}
\`\`\`

Binary 模式省内存 80%，渲染快 3~5 倍。

### 2. WebWorker 预处理

\`\`\`js
import { _WorkerThread } from '@deck.gl/core'
// loaders.gl + worker 解析大 GeoJSON / CSV
\`\`\`

数据解析在 worker，主线程只渲染，不卡 UI。

### 3. 分层加载（LOD）

\`\`\`js
new TileLayer({
  minZoom: 3, maxZoom: 14,
  // 低 zoom 用聚合图层，高 zoom 用细图层
  renderSubLayers: props => props.tile.z < 8 ? new HexagonLayer(...) : new ScatterplotLayer(...)
})
\`\`\`

### 4. 视口剔除 + 聚合

- \`extensions\`：\`DataFilterExtension\` 在 GPU 上按属性过滤，不重新加载数据。
- \`updateTriggers\`：精确控制哪个属性变化才重算，避免全量重渲染。

\`\`\`js
new ScatterplotLayer({
  // ...
  extensions: [new DataFilterExtension({ filterSize: 1 })],
  getFilterValue: d => d.value > threshold ? 1 : 0,
  filterRange: [1, 1]
})
\`\`\`

### 5. 关闭不必要的开销

- \`pickable: false\`（不需要交互的图层关掉，省拾取计算）。
- \`parameters: { depthTest: false }\`（无遮挡的 2D 图层）。
- \`transitions\` 慎用，动画会触发每帧重算。

## 实战：百万轨迹热力

\`\`\`js
new HeatmapLayer({
  id: 'trip-heat',
  data: trips,           // 100w 条
  getPosition: d => [d.lng, d.lat],
  radiusPixels: 50,
  intensity: 1,
  aggregation: 'SUM',
  // Binary 模式
  // data 走 worker 解析
})
\`\`\`

百万点热力图 60fps 流畅。

## 与 Mapbox 原生图层对比

| 维度 | Deck.gl | Mapbox 原生 |
| --- | --- | --- |
| 数据规模 | 百万级 | 万级 |
| GPU 加速 | 强（Binary + 实例化） | 中 |
| 自定义图层 | 灵活（继承 Layer 写 shader） | 受限 |
| 底图 | 需配合 Mapbox/Leaflet | 自带 |
| 学习曲线 | 中 | 中 |
| 适合 | 大数据可视化 | 业务地图 + 轻量可视化 |

## 坑

- **坐标系**：Deck.gl 默认 [lng, lat]，与 Mapbox 嵌入时自动同步；独立用需设 \`coordinateSystem\`。
- **z 轴**：3D 图层高度单位是米，地图坐标系下要乘 \`sizeScale\`。
- **图层更新**：改 \`data\` 全量重渲染，改单个属性用 \`updateTriggers\` 精确触发。
- **内存**：百万数据用 Binary，否则浏览器 OOM。
- **拾取性能**：\`pickable\` 图层每帧构建拾取数据，大图层开 \`autoHighlight: false\` + 按需拾取。`
  }
]
