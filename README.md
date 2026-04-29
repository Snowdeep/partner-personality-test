# 伴侣人格测试小程序

一款年轻化、搞怪的伴侣人格测试小程序。通过 30 道趣味问题，快速了解你的伴侣/暗恋对象的真实性格！

## ✨ 产品特色

- **4 维度人格系统**：恋爱态度、性格特质、相处方式、沟通风格
- **16 个搞怪人格标签**：粘人小甜蜜、花心小浪子、理性老狐狸等
- **30 道趣味题库**：20 道共同题 + 10 道男女专属题
- **加权计分算法**：科学且有趣的性格判定
- **详细解读文案**：包括人格概览、恋爱风格、相处建议等
- **响应式设计**：完美适配 PC 和手机端

## 🏗️ 项目结构

```
partner-personality-test/
├── frontend/                    # Vue 3 前端应用
│   ├── src/
│   │   ├── pages/              # 页面组件
│   │   │   ├── index/          # 首页
│   │   │   ├── test/           # 答题页
│   │   │   └── result/         # 结果页
│   │   ├── utils/
│   │   │   └── calculator.ts   # 计分算法
│   │   ├── App.vue
│   │   ├── main.ts
│   │   └── router.ts
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                     # Node.js 后端服务
│   ├── src/
│   │   ├── routes/             # 路由
│   │   ├── controllers/        # 业务逻辑
│   │   └── index.ts            # 主应用
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
│
├── data/                        # 数据文件
│   ├── questions.json          # 30 道题库
│   ├── labels.json             # 16 个标签定义
│   └── mappings.json           # 标签映射和维度选项
│
├── docs/
│   └── superpowers/specs/
│       └── 2026-04-29-partner-personality-design.md
│
└── README.md
```

## 🚀 快速开始

### 前置要求
- Node.js 18+
- npm 或 yarn

### 前端开发

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

前端应用会在 `http://localhost:5173` 运行

### 后端开发

```bash
cd backend

# 安装依赖
npm install

# 创建 .env 文件
cp .env.example .env

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

后端服务会在 `http://localhost:3000` 运行

## 📡 API 端点

### 提交答题结果

**POST** `/api/test/submit`

请求体：
```json
{
  "gender": "male",
  "answers": {
    "1": 0,
    "2": 1,
    ...
  }
}
```

响应：
```json
{
  "success": true,
  "data": {
    "userId": "user_xxx_yyy",
    "gender": "male",
    "scores": { ... },
    "result": { ... },
    "labelId": "1",
    "labelName": "粘人小甜蜜",
    "timestamp": "2026-04-29T..."
  }
}
```

### 获取所有标签

**GET** `/api/test/labels`

响应：
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "粘人小甜蜜",
      "combination": { ... },
      "overview": "...",
      "lovingStyle": "...",
      "advice": "...",
      "caution": "..."
    },
    ...
  ]
}
```

### 获取指定性别题库

**GET** `/api/test/questions/:gender`

响应：
```json
{
  "success": true,
  "data": {
    "gender": "male",
    "total": 30,
    "questions": [ ... ]
  }
}
```

## 📊 数据结构

### 问题结构
```typescript
interface Question {
  id: number;
  gender: 'both' | 'male' | 'female';
  category: 'attitude' | 'traits' | 'interaction' | 'communication';
  question: string;
  emoji: string;
  options: Array<{
    text: string;
    weights: Record<string, string>;
  }>;
}
```

### 标签结构
```typescript
interface PersonalityLabel {
  id: string;
  name: string;
  combination: {
    attitude: string;
    traits: string;
    interaction: string;
    communication: string;
  };
  overview: string;
  lovingStyle: string;
  advice: string;
  caution: string;
}
```

## 🎨 四维度人格系统

### 维度 1：恋爱态度
- 专一深情
- 温柔暖男/暖女
- 浪漫花心
- 理性冷静

### 维度 2：性格特质
- 甜蜜可爱
- 独立自信
- 幽默风趣
- 沉静深邃

### 维度 3：相处方式
- 粘人缠绵
- 陪伴贴心
- 自在独立
- 有点冷淡

### 维度 4：沟通风格
- 温言细语
- 直言快语
- 幽默逗趣
- 沉默寡言

## 📝 16 个人格标签

1. 粘人小甜蜜 - 专一深情 + 甜蜜可爱 + 粘人缠绵 + 温言细语
2. 体贴小天使 - 专一深情 + 甜蜜可爱 + 陪伴贴心 + 温言细语
3. 专一暖男/暖女 - 专一深情 + 独立自信 + 陪伴贴心 + 直言快语
4. 专一小狼 - 专一深情 + 独立自信 + 自在独立 + 直言快语
5. 缠人小可爱 - 温柔暖男/暖女 + 甜蜜可爱 + 粘人缠绵 + 温言细语
6. 温柔小逗比 - 温柔暖男/暖女 + 甜蜜可爱 + 陪伴贴心 + 幽默逗趣
7. 搞笑暖宝宝 - 温柔暖男/暖女 + 幽默风趣 + 陪伴贴心 + 幽默逗趣
8. 温柔独行侠 - 温柔暖男/暖女 + 独立自信 + 自在独立 + 温言细语
9. 调皮小坏蛋 - 浪漫花心 + 甜蜜可爱 + 粘人缠绘 + 幽默逗趣
10. 花心小浪子 - 浪漫花心 + 幽默风趣 + 陪伴贴心 + 幽默逗趣
11. 花心大哥哥/姐姐 - 浪漫花心 + 独立自信 + 自在独立 + 直言快语
12. 神秘大人物 - 浪漫花心 + 沉静深邃 + 有点冷淡 + 沉默寡言
13. 理性老狐狸 - 理性冷静 + 独立自信 + 自在独立 + 直言快语
14. 冷酷深邃人 - 理性冷静 + 沉静深邃 + 自在独立 + 沉默寡言
15. 理性逗比 - 理性冷静 + 幽默风趣 + 陪伴贴心 + 幽默逗趣
16. 甜蜜小理性 - 理性冷静 + 甜蜜可爱 + 陪伴贴心 + 温言细语

## 🧮 计分算法

### 加权计分方法
1. 初始化四个维度的得分（每个维度 4 个选项）
2. 遍历所有答题，跳过"不知道"选项
3. 根据选项的权重给各维度加分
4. 检查维度有效性（有效答题数 ≥ 3）
5. 为每个维度选择得分最高的选项
6. 组合四个维度的结果
7. 查表找到对应的人格标签

## 📱 用户流程

1. **首页** - 选择性别（测他/测她）
2. **答题页** - 按顺序答 30 道题（可跳过"不知道"）
3. **结果页** - 显示人格标签和详细解读

## 🛠️ 技术栈

**前端：**
- Vue 3 - 渐进式框架
- TypeScript - 类型安全
- Vue Router - 路由管理
- Vite - 现代化构建工具

**后端：**
- Node.js - 运行时环境
- Express - Web 框架
- TypeScript - 类型安全
- CORS - 跨域资源共享

**数据：**
- JSON - 数据存储

## 📈 后续扩展方向

- [ ] 数据库集成（MongoDB/PostgreSQL）
- [ ] 用户认证系统
- [ ] 测试结果历史记录
- [ ] 结果对比功能
- [ ] 社交分享增强
- [ ] 数据分析统计
- [ ] 国际化支持
- [ ] 性格匹配推荐

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！

## 📞 联系方式

如有问题或建议，欢迎提出！

---

**设计文档**：[docs/superpowers/specs/2026-04-29-partner-personality-design.md](./docs/superpowers/specs/2026-04-29-partner-personality-design.md)

**实现计划**：[.claude/plans/serene-frolicking-wreath.md](./.claude/plans/serene-frolicking-wreath.md)
