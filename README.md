# 悉尼港海鲜二恶英计算器 (Sydney Harbour Dioxin Calculator)

一个简洁、实用的Web应用，旨在帮助用户追踪和管理因食用悉尼港海鲜（海港大桥以东）而产生的二恶英摄入量。所有计算均基于 [NSW Food Authority 官方指南](https://www.foodauthority.nsw.gov.au/consumer/special-care-foods/sydney-harbour-seafood)。

## ✨ 功能亮点

- **可视化仪表盘**: 直观地展示本月二恶英摄入百分比，状态一目了然。
- **摄入记录**: 轻松添加、编辑和删除您的海鲜食用记录。
- **智能预测**: 根据当前剩余额度，自动计算各类海鲜的安全食用量。
- **数据持久化**: 所有记录自动保存在浏览器本地 (`localStorage`)，刷新不丢失。
- **自动过期**: 超过30天的记录会自动清除，确保计算的是当月额度。
- **灵活排序**: 支持按时间、百分比、风险等级等多种方式对记录和预测进行排序。
- **双语支持**: 提供中文和英文两种语言界面，并可轻松切换。
- **响应式设计**: 在桌面和移动设备上均有良好体验。

## 🛠️ 技术栈

- **HTML5**
- **Tailwind CSS (via CDN)**: 用于快速构建现代化UI。
- **JavaScript (ES6+)**: 核心应用逻辑。
- **Chart.js**: 用于渲染仪表盘图表。
- **Font Awesome**: 提供图标。

## 🚀 部署到 Cloudflare Pages

本项目是一个纯前端应用，不含后端和构建步骤，因此非常适合通过 Cloudflare Pages 进行零成本、高性能的部署。

### 部署步骤

1.  **准备您的代码仓库**:
    *   将本项目的代码（`SydneyHarbourFishCalculator.html`, `SydneyHarbourFishCalculator.js`, `README.md` 等）上传到一个 GitHub 或 GitLab 仓库。

2.  **登录 Cloudflare**:
    *   登录您的 Cloudflare 账户。

3.  **进入 Pages**:
    *   在左侧导航栏中，找到并点击 **Workers & Pages**。

4.  **创建新应用**:
    *   点击 **Create application** 按钮。
    *   选择 **Pages** 标签页，然后点击 **Connect to Git**。

5.  **连接您的 Git 仓库**:
    *   选择您在第一步中创建的 GitHub / GitLab 仓库，然后点击 **Begin setup**。

6.  **配置构建设置**:
    *   **项目名称 (Project name)**: 可以保持默认或自定义一个您喜欢的名称。
    *   **生产分支 (Production branch)**: 选择您的主分支（通常是 `main` 或 `master`）。
    *   **构建设置 (Build settings)**:
        *   **框架预设 (Framework preset)**: 选择 **None**。
        *   **构建命令 (Build command)**: **留空** (因为我们没有构建步骤)。
        *   **构建输出目录 (Build output directory)**: **留空** (Cloudflare 会自动服务仓库的根目录)。

7.  **部署**:
    *   点击 **Save and Deploy**。

Cloudflare 将会自动从您的仓库拉取文件并将其部署到全球CDN网络。几分钟后，您的二恶英计算器就会拥有一个 `*.pages.dev` 的公开访问网址了！

---

*这个 README 文件由 Gemini Code Assist 生成。*