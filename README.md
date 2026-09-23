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
- **298 symbols in 14 categories / 298 个符号 · 14 分类** — Favorites, sub/superscripts & accents, brackets, fractions & roots, sums/integrals/limits, functions, binary operators, relations, arrows, sets, logic, Greek letters, misc symbols & spacing, matrices & environments.
  常用 / 上下标 / 括号 / 分根 / 积限 / 函数 / 运算 / 关系 / 箭头 / 集合 / 逻辑 / 希腊字母 / 其他 / 矩阵。
- **Smart insertion / 智能插入** — Auto-wraps in `$...$` (or `$$...$$` for block structures like matrices) when the cursor is outside math mode; selected text becomes the numerator/first argument; remaining placeholders render as `□` (`\square`) and the cursor lands on the first one, ready to type.
  光标不在数学环境时自动包 `$...$`(矩阵等块级结构包 `$$...$$`);选中文本自动成为第一个参数,其余占位渲染为 □,光标自动定位到待填处。
- **Collapsible / 可折叠** — Click the `∑ 数学符号` title to collapse the panel to a single row when you don't need it. The state is remembered.
  点击标题行折叠/展开,不用时只占一行,状态自动记忆。
- **Follow system light/dark theme / 跟随系统亮暗** — Optionally switches the whole Obsidian theme when your OS switches between light and dark mode.
  可选跟随 Windows/macOS 系统深色模式,自动切换 Obsidian 明暗主题(可关闭并还原)。
- **Zero build / 零构建** — Hand-written CommonJS, no TypeScript toolchain needed.
  纯手写 CommonJS,无编译步骤,克隆即用。

## 🚀 Installation / 安装

### Manual (all platforms) / 手动安装

1. Download `main.js`, `manifest.json`, `styles.css` from the [latest release](https://github.com/GoRmiTz/obsidian-math-symbol-toolbar/releases).
2. Put them into `<your-vault>/.obsidian/plugins/math-symbol-toolbar/`.
3. In Obsidian: **Settings → Community plugins → Enable "Math Symbol Toolbar"**.

### BRAT

```
https://github.com/GoRmiTz/obsidian-math-symbol-toolbar
```

Install [BRAT](https://github.com/TfTHacker/obsidian42-brat), then use the command `BRAT: Add a beta plugin for testing`.

> Once accepted into the official community plugin store, you can install it directly from Obsidian's plugin browser.

## 📖 Usage / 使用

1. Open any note in editing (source / live preview) mode — the toolbar appears at the top of the pane.
2. Switch categories with the tabs; click a symbol to insert its LaTeX code at the cursor.
3. Hover a button to see its name and LaTeX code.
4. Click the title row to collapse / expand the panel; click `×` to hide the toolbar entirely (ribbon ∑ icon or command palette to bring it back).

打开任意笔记进入编辑模式,工具栏出现在编辑区顶部;Tab 切换分类,点击符号即插入;悬停可查看名称与代码;点击标题行折叠,点击 × 隐藏(左侧边栏 ∑ 图标可再次打开)。

## 📌 Changelog / 更新日志

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
