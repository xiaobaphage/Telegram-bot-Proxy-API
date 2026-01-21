# Telegram Bot API Proxy

<div align="center">

![CloudFlare Workers](https://img.shields.io/badge/CloudFlare-Workers-F38020?style=flat&logo=cloudflare)
![License](https://img.shields.io/badge/License-MIT-green.svg)

**基于 CloudFlare Workers 的 Telegram Bot API 反向代理**

解决国内无法直接访问 Telegram Bot API 的问题

</div>

---

## 📋 项目简介

本项目提供一个轻量级的 Telegram Bot API 反向代理，部署在 CloudFlare Workers 上，完全免费且无需服务器。

### ✨ 特性

- 🚀 **零成本** - CloudFlare Workers 免费额度足够使用
- ⚡ **低延迟** - 全球 CDN 节点，就近访问
- 🔒 **安全可靠** - HTTPS 加密传输
- 📦 **即开即用** - 无需配置，一键部署
- 🌍 **全球可用** - 支持所有 Telegram Bot API 方法

## 🚀 快速开始

### 前置要求

- CloudFlare 账号
- Node.js 16+ (本地开发)
- Wrangler CLI (CloudFlare Workers 部署工具)

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://git.specialz.org/Specialz/telegram-bot-api-proxy.git
cd telegram-bot-api-proxy

# 2. 安装依赖
npm install

# 3. 登录 CloudFlare
npx wrangler login

# 4. 部署到 CloudFlare Workers
npm run deploy
```

### 本地开发

```bash
# 启动本地开发服务器
npm run dev

# 访问 http://localhost:8787 测试
```

## 📖 使用方法

### 方式一：使用 Workers 域名

部署后，CloudFlare 会提供一个 `*.workers.dev` 域名，例如：

```
https://telegram-bot-api-proxy.your-subdomain.workers.dev
```

在你的 Bot 代码中，将 API 地址替换为：

```go
// 原始地址
https://api.telegram.org/bot<TOKEN>/METHOD

// 替换为
https://telegram-bot-api-proxy.your-subdomain.workers.dev/bot<TOKEN>/METHOD
```

### 方式二：使用自定义域名（推荐）

1. 在 CloudFlare 添加你的域名
2. 修改 `wrangler.toml` 中的路由配置：

```toml
[env.production]
name = "telegram-bot-api-proxy"
route = { pattern = "api.yourdomain.com/*", zone_name = "yourdomain.com" }
```

3. 重新部署：

```bash
npm run deploy
```

4. 在 Bot 代码中使用自定义域名：

```go
https://api.yourdomain.com/bot<TOKEN>/METHOD
```

## 🔧 配置说明

### wrangler.toml

```toml
name = "telegram-bot-api-proxy"          # Worker 名称
main = "src/index.js"                    # 入口文件
compatibility_date = "2024-01-01"        # 兼容性日期

[env.production]
name = "telegram-bot-api-proxy"
route = { pattern = "api.yourdomain.com/*", zone_name = "yourdomain.com" }
```

### 环境变量（可选）

如需添加环境变量，在 CloudFlare Workers 控制台配置，或使用 `.dev.vars` 文件（本地开发）。

## 📝 示例代码

### Go (使用自定义 API 地址)

```go
package main

import (
    tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func main() {
    bot, err := tgbotapi.NewBotAPIWithClient(
        "YOUR_BOT_TOKEN",
        "https://api.yourdomain.com",
        &http.Client{},
    )
    if err != nil {
        panic(err)
    }
    
    // 正常使用
    updates := bot.GetUpdatesChan(tgbotapi.NewUpdate(0))
    for update := range updates {
        // 处理消息
    }
}
```

### Python

```python
from telegram import Bot

bot = Bot(
    token="YOUR_BOT_TOKEN",
    base_url="https://api.yourdomain.com/bot"
)

# 正常使用
bot.send_message(chat_id=123456, text="Hello!")
```

### Node.js

```javascript
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot('YOUR_BOT_TOKEN', {
  baseApiUrl: 'https://api.yourdomain.com'
});

bot.on('message', (msg) => {
  bot.sendMessage(msg.chat.id, 'Hello!');
});
```

## 🔍 工作原理

```
┌─────────┐      ┌──────────────────┐      ┌─────────────────┐
│ Your Bot│─────▶│ CloudFlare Worker│─────▶│ Telegram Bot API│
└─────────┘      └──────────────────┘      └─────────────────┘
                         (代理)                  (官方 API)
```

1. Bot 发送请求到 CloudFlare Workers
2. Worker 转发请求到 Telegram 官方 API
3. 返回响应给 Bot

## ⚠️ 注意事项

1. **免费额度**：CloudFlare Workers 免费版每天 100,000 次请求，足够个人使用
2. **速率限制**：遵守 Telegram Bot API 的速率限制（每秒 30 条消息）
3. **安全性**：不要在代码中硬编码 Bot Token，使用环境变量
4. **域名**：建议使用自定义域名，避免 `workers.dev` 被墙

## 🛠️ 故障排查

### 部署失败

```bash
# 检查 Wrangler 版本
npx wrangler --version

# 重新登录
npx wrangler logout
npx wrangler login
```

### 请求失败

1. 检查 Worker 日志：CloudFlare Dashboard → Workers → 你的 Worker → Logs
2. 确认 API 地址格式正确
3. 测试 Worker 是否正常：访问 `https://your-worker.workers.dev/`

### 性能优化

如果遇到性能问题，可以考虑：
- 使用 CloudFlare Workers KV 缓存频繁请求
- 启用 CloudFlare CDN 缓存
- 升级到 Workers Paid 计划（更高配额）

## 📊 监控

在 CloudFlare Dashboard 查看：
- 请求数量
- 错误率
- 响应时间
- CPU 使用率

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📜 开源协议

MIT License

Copyright (c) 2025 Specialz (1921703654@qq.com)

## 📞 联系方式

- **作者**：Specialz
- **邮箱**：1921703654@qq.com
- **仓库**：https://git.specialz.org/Specialz/telegram-bot-api-proxy

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！**

Made with ❤️ by Specialz

</div>
