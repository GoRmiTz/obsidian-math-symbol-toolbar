# Math Symbol Toolbar

<p align="center">
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg"></a>
  <img alt="Obsidian" src="https://img.shields.io/badge/Obsidian-≥0.15.0-7c3aed">
  <img alt="Platform" src="https://img.shields.io/badge/platform-Desktop%20%7C%20Mobile-lightgrey">
  <img alt="Symbols" src="https://img.shields.io/badge/symbols-298%20%2F%2014%20cats-blue">
</p>

**An embedded, Editing-Toolbar-style math symbol toolbar for Obsidian. Click a button, insert the LaTeX code. No floating pop-ups, nothing blocked.**

**一个嵌入式的 Obsidian 数学符号工具栏**(参考 Editing Toolbar 的形态)。点击按钮即插入对应 LaTeX 符号代码,面板嵌入编辑区顶部文档流,不遮挡笔记内容与其他 UI。

> 简体中文说明见下方。

---

## ✨ Features / 特性

- **Embedded layout / 嵌入式布局** — The toolbar lives inside the editor pane (between the view header and the note), occupying real layout space instead of floating above your notes. Nothing gets covered.
  工具栏插入在笔记标签页内部,占据布局空间把内容下推——不遮挡任何笔记内容与其他 UI(区别于常见的侧边栏 / 浮窗方案)。
- **Toolbox core / 工具箱架构** — The plugin core is a toolbox; math symbols is just its first tool. More tools can be registered side by side later (a switcher row appears automatically when there is more than one).
  插件核心是一个「工具箱」, 数学符号是其中的第一个工具; 以后新增的功能会并列注册, 多于一个工具时自动出现切换行。
- **298 symbols in 14 categories / 298 个符号 · 14 分类** — Favorites, sub/superscripts & accents, brackets, fractions & roots, sums/integrals/limits, functions, binary operators, relations, arrows, sets, logic, Greek letters, misc symbols & spacing, matrices & environments.
  常用 / 上下标 / 括号 / 分根 / 积限 / 函数 / 运算 / 关系 / 箭头 / 集合 / 逻辑 / 希腊字母 / 其他 / 矩阵。
- **Custom categories & symbols / 自定义分栏与符号导入** — Create your own tabs in Settings → Toolbox and add symbols collected from the web: a display character (the button icon) + insert content (LaTeX with `|` placeholders, or a plain special character) + a comment (hover tooltip). LaTeX is validated on save; invalid symbols show up struck-through in red, and clicking them only pops an `$Error$` notice instead of inserting broken code.
  在 设置 → 工具箱 中自建分栏, 添加网上搜集的符号: 显示字符(按钮图标) + 插入内容(LaTeX,`|` 为占位符; 也可直接填特殊字符) + 注释(悬停提示)。保存时校验 LaTeX, 不合格的符号标红划线, 点击只弹 `$Error$` 提示、不会插入错误代码。
- **Disable without deleting / 卸下不删除** — Too many symbols? Uncheck the ones you don't need in Settings → Toolbox → 内置符号管理. They disappear from the toolbar but the data stays — check them back any time, or use the per-category "restore all" button.
  觉得符号太多?在 设置 → 工具箱 → 内置符号管理 里取消勾选即可「卸下」: 工具栏立即隐藏但数据保留, 随时勾回, 也支持一键「本栏全部勾回」。
- **Smart insertion / 智能插入** — Auto-wraps in `$...$` (or `$$...$$` for block structures like matrices) when the cursor is outside math mode; selected text becomes the numerator/first argument; remaining placeholders render as `□` (`\square`) and the cursor lands on the first one, ready to type.
  光标不在数学环境时自动包 `$...$`(矩阵等块级结构包 `$$...$$`);选中文本自动成为第一个参数,其余占位渲染为 □,光标自动定位到待填处。
- **Recent tab / 最近使用** — The first tab 「最近」 automatically collects the symbols you click, newest first, no duplicates, up to 18 (older ones drop off and need one more click to return). Persisted across restarts.
  第一个「最近」Tab 自动按点击时间收集你点过的符号(最新在前、不重复、最多 18 个,超出后最早的移出,需重新点击才会再次出现),重启后保留;设置里可一键清空。
- **Repeat last insert / 重复插入** — A command `Repeat last symbol` re-inserts the symbol you inserted last, default hotkey `Ctrl/Cmd+Shift+M`; change it any time in Settings → Hotkeys.
  「重复插入上一个符号」命令把最近一次插入的符号在光标处再插一次,默认快捷键 `Ctrl+Shift+M`,可在 设置 → 快捷键 中搜索命令名自由更换。
- **Collapsible / 可折叠** — Click the `∑ 数学符号` title to collapse the panel to a single row when you don't need it. The state is remembered.
  点击标题行折叠/展开,不用时只占一行,状态自动记忆。
- **Follow system light/dark theme / 跟随系统亮暗** — Optionally switches the whole Obsidian theme when your OS switches between light and dark mode.
  可选跟随 Windows/macOS 系统深色模式,自动切换 Obsidian 明暗主题(可关闭并还原)。
- **Zero build / 零构建** — Hand-written CommonJS, no TypeScript toolchain needed.
  纯手写 CommonJS,无编译步骤,克隆即用。

## 🚀 Installation / 安装

### Method A · Download the zip (recommended) / 下载 zip 包(推荐)

**Step 1 · Download / 下载**

Go to the [Releases page](https://github.com/GoRmiTz/obsidian-math-symbol-toolbar/releases) → find the latest version (e.g. `v1.4.0`) → under **Assets**, download **`math-symbol-toolbar-v1.4.0.zip`**.

进入 [Releases 页面](https://github.com/GoRmiTz/obsidian-math-symbol-toolbar/releases) → 找到最新版本(如 `v1.4.0`)→ 在下方 **Assets** 里下载 **`math-symbol-toolbar-v1.4.0.zip`**。

> ⚠️ Do **not** download `Source code (zip)` — it is for developers.
> ⚠️ 不要下载 `Source code (zip/tar.gz)`,那是给开发者的源码包。

**Step 2 · Unzip & move / 解压并移动**

Unzip it — you get a folder `math-symbol-toolbar/` containing the three plugin files. Move the **whole folder** into your vault's plugins directory:

解压后得到 `math-symbol-toolbar/` 文件夹(内含三个插件文件)。把这个**文件夹整体**移入你笔记库的插件目录:

```text
<你的笔记库>/.obsidian/plugins/math-symbol-toolbar/
├── main.js
├── manifest.json
└── styles.css
```

> Tip: `.obsidian` is a hidden folder at the root of your vault. In Obsidian you can open it via **Settings → About → Advanced → Open config folder**.
> 提示:`.obsidian` 是笔记库根目录下的隐藏文件夹。也可以在 Obsidian 里通过 **设置 → 关于 → 高级 → 打开配置文件夹** 直达。

**Step 3 · Enable the plugin / 启用插件**

1. Restart Obsidian (or press `Ctrl+P` → run **"Reload app without saving"**).
   重启 Obsidian(或 `Ctrl+P` 运行 **"重新加载应用(不保存)"**)。
2. **Settings → Community plugins**(设置 → 第三方插件)。
3. If Restricted mode / Safe mode is on, turn it off first.
   如果开了「安全模式/受限模式」,先关闭。
4. Click the **refresh icon** 🔄 on the installed-plugins list, find **Math Symbol Toolbar**, toggle it **on**.
   在已安装插件列表点击 **刷新图标** 🔄,找到 **Math Symbol Toolbar**,打开开关。

### Method B · Download 3 files / 手动下载三个文件(备选)

If you prefer not to unzip, download `main.js`, `manifest.json`, `styles.css` individually from the [Releases page](https://github.com/GoRmiTz/obsidian-math-symbol-toolbar/releases) and place them into `<你的笔记库>/.obsidian/plugins/math-symbol-toolbar/` yourself (**keep the file names unchanged**), then enable as in Method A Step 3.

如果不想解压,也可以在 [Releases 页面](https://github.com/GoRmiTz/obsidian-math-symbol-toolbar/releases) 分别下载三个文件,自己放进 `<你的笔记库>/.obsidian/plugins/math-symbol-toolbar/`(**文件名保持原样**),然后按方式 A 的第 3 步启用。

### Method C · BRAT

```
https://github.com/GoRmiTz/obsidian-math-symbol-toolbar
```

Install [BRAT](https://github.com/TfTHacker/obsidian42-brat), then use the command `BRAT: Add a beta plugin for testing`.

安装 [BRAT](https://github.com/TfTHacker/obsidian42-brat) 插件后,执行命令 `BRAT: Add a beta plugin for testing` 并粘贴上面的地址。

> Once accepted into the official community plugin store, you can install it directly from Obsidian's plugin browser.
> 官方社区插件市场审核通过后,可直接在 Obsidian 插件市场搜索安装。

### Troubleshooting / 看不到工具栏?

| Symptom / 现象 | Fix / 解决 |
| --- | --- |
| Enabled but no toolbar / 启用了但没看到 | The toolbar only shows in **editing mode**. Make sure the note is in edit (source / live preview) mode, not reading mode. 工具栏只在**编辑模式**显示,请确认笔记处于编辑而非阅读模式。 |
| Still missing / 还是没有 | You may have collapsed it earlier — click the `∑ 数学符号` title row to expand. 可能之前折叠了——点击 `∑ 数学符号` 标题行展开。 |
| Hidden entirely / 完全隐藏了 | Click the `∑` icon in the left ribbon, or run the command **"显示/隐藏 数学符号工具栏"**. 点击左侧边栏 `∑` 图标,或运行命令重新打开。 |
| Plugin not in the list / 列表里没有 | Check the folder name is exactly `math-symbol-toolbar` and all 3 files are inside; then restart Obsidian. 确认文件夹名是 `math-symbol-toolbar` 且三个文件都在里面,再重启 Obsidian。 |
| Auto-disable plugins at startup / 启动时插件被禁用 | If you use **lazy-plugins** or similar, set Math Symbol Toolbar to "enabled at startup" there too. 若安装了 lazy-plugins 等启动管理插件,需在其中把本插件设为启用。 |

## 📖 Usage / 使用

1. Open any note in editing (source / live preview) mode — the toolbar appears at the top of the pane.
2. Switch categories with the tabs; click a symbol to insert its LaTeX code at the cursor.
3. The **「最近」(Recent)** tab keeps your most-used symbols — click a symbol once and it stays there for quick reuse.
4. Press `Ctrl/Cmd+Shift+M` (customizable in Settings → Hotkeys) to **repeat** the symbol you inserted last.
5. Hover a button to see its name and LaTeX code.
6. Click the title row to collapse / expand the panel; click `×` to hide the toolbar entirely (ribbon ∑ icon or command palette to bring it back).

打开任意笔记进入编辑模式,工具栏出现在编辑区顶部;Tab 切换分类,点击符号即插入;「最近」Tab 自动收集你点过的符号方便复用;`Ctrl+Shift+M` 重复插入上一个符号(快捷键可在 设置 → 快捷键 修改);悬停可查看名称与代码;点击标题行折叠,点击 × 隐藏(左侧边栏 ∑ 图标可再次打开)。

## 📌 Changelog / 更新日志

- **v1.4.0** — Toolbox refactor: the plugin core becomes a toolbox with math symbols as its first tool (more tools can register side by side). Added **custom categories & symbol import** (create your own tabs in Settings; display character + LaTeX/special character + comment; LaTeX validated on save — invalid symbols are struck-through in red and clicking them only pops an `$Error$` notice) and **disable-without-delete** (uncheck built-in symbols to hide them; data stays, check back any time). / 工具箱重构: 插件核心变为工具箱, 数学符号是第一个工具(未来功能并列注册)。新增**自定义分栏与符号导入**(设置中自建分栏; 显示字符 + LaTeX/特殊字符 + 注释; 保存时校验 LaTeX, 不合格符号标红划线、点击只弹 `$Error$`)与**卸下不删除**(取消勾选即隐藏, 数据保留, 随时勾回)。
- **v1.3.0** — Added a **「最近」(Recent) tab**: automatically collects clicked symbols in click order (newest first, deduplicated, max 18, persisted; clear it in plugin settings) and a **Repeat last symbol** command with a customizable hotkey (`Ctrl/Cmd+Shift+M` by default). / 新增「最近」使用栏(按点击时间自动收集、去重、上限 18、持久化,设置里可清空)与「重复插入上一个符号」命令(默认 Ctrl+Shift+M,快捷键可自定义)。
- **v1.2.1** — Removed the native browser `title` tooltip that duplicated the styled Obsidian tooltip. / 移除与样式化提示重复的系统原生注释框。
- **v1.2.0** — Collapsible panel: click the title row to fold the toolbar into a single line; state is persisted. / 标题行点击折叠/展开,收起时只占一行,状态持久化。
- **v1.1.0** — Rebuilt the floating pop-up as an **embedded** toolbar occupying real layout space (nothing blocked anymore); added optional **follow-system light/dark theme**. / 由悬浮弹窗重构为嵌入式布局,新增跟随系统亮暗模式。
- **v1.0.0** — Initial release: 298 LaTeX symbols in 14 categories, click-to-insert with smart `$...$` wrapping and placeholder navigation. / 首个版本:14 分类 298 个符号,点击插入、智能包裹与占位导航。

## 🛠️ Development / 开发

No build step. The plugin is a single hand-written CommonJS file:

- `main.js` — symbol data (`CATS`) + plugin logic
- `styles.css` — uses Obsidian CSS variables (auto light/dark)
- `manifest.json`

Symbols are organized in the `CATS` array as `[display, latex, name, flag]` tuples; add your own rows to extend the library. `|` inside `latex` marks a cursor placeholder.

符号数据集中在 `main.js` 的 `CATS` 数组中,格式为 `[显示字符, LaTeX代码, 名称, 块级标记]`,直接增删行即可扩展;代码里的 `|` 表示光标占位符。

Symbol categories are organized after the popular Chinese reference [Markdown 符号公式大全](https://www.cnblogs.com/izcat/p/14264850.html).

## 📄 License / 许可

[MIT](LICENSE)
