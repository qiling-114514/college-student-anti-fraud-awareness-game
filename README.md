# 古代战局 · 王权

以古代战局为背景的卡牌抉择游戏：玩家在有限回合内管理 **兵力 / 粮草 / 民心 / 国库**
四项国力，每一次抉择都会推动战局。任一国力耗尽（≤ 0）或过于充盈（> 100），王朝覆灭。

## 技术栈

| 技术 | 用途 |
| --- | --- |
| React 19 | 组件化 UI |
| Vite 8 | 开发服务器与生产构建 |
| Framer Motion 14 | 卡牌滑动、出入场、数值条、弹窗动画 |
| Zustand 5 | 游戏状态管理 + `persist` 自动存档 |
| clsx | 条件类名拼接 |

## 目录结构

```
.
├─ index.html                # Vite 入口
├─ src
│  ├─ main.jsx               # React 挂载
│  ├─ App.jsx                # 页面编排与回合交互锁
│  ├─ data/cards.js          # 46 张事件卡（纯数据，export）
│  ├─ game
│  │  ├─ constants.js        # 国力键名、上限、存档键等常量
│  │  ├─ engine.js           # 纯函数游戏引擎（洗牌 / 抽牌 / 结算 / 崩溃判定）
│  │  └─ useGameStore.js     # Zustand store（choose / restart + 持久化）
│  ├─ components             # 每个 UI 块一个组件
│  │  ├─ Header.jsx
│  │  ├─ StatsPanel.jsx / StatBar.jsx / AnimatedNumber.jsx
│  │  ├─ GameCard.jsx        # 拖拽滑牌 + 左右提示印章
│  │  ├─ EventLog.jsx / EffectDelta.jsx
│  │  ├─ ActionBar.jsx
│  │  └─ GameOverModal.jsx
│  ├─ hooks/useKeyboardControls.js
│  └─ styles                 # base / game / modal，index.css 汇总
├─ legacy/                   # 重构前的原生 JS 单页版本，仅供对照
└─ public/favicon.svg
```

## 运行

需要 Node.js ≥ 20.19。

```bash
npm install
npm run dev        # 开发模式
npm run build      # 生产构建，输出到 dist/
npm run preview    # 预览生产构建
```

## 操作

- 左右拖动卡牌，超过阈值即做出该方向的选择
- 点击底部左右按钮
- 键盘：`←` / `A` 左选，`→` / `D` 右选，`R` 重开

## 规则与存档

- 四项国力初始均为 50，上限 100；任一数值 ≤ 0 或 > 100 即王朝覆灭。
- 牌堆抽完自动重洗，并避免与上一张重复。
- 事件纪事保留最近 50 条。
- 进度自动保存到 `localStorage`（键 `ancient-war-card-save-v2`），刷新后继续。
- 「重新开始」会清空当前进度并重开一局。

## 与旧版的关系

`legacy/` 保留了重构前的原生 JavaScript 实现（`app.js` + `style.css` +
`ancient-war-card-single.html`），逻辑与玩法一致，便于对照迁移前后的差异。
