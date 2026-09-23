'use strict';

/*
 * Math Symbol Toolbar — 数学符号工具栏(嵌入式)
 * 点击按钮即可将对应 LaTeX 符号代码插入到 md 文档光标处。
 * 分类与符号参考: https://www.cnblogs.com/izcat/p/14264850.html
 * 布局参考: Editing Toolbar — 工具栏嵌入编辑区顶部文档流,
 *          占据布局空间, 不遮挡笔记内容与其他 UI。
 * 主题: 可选跟随系统深/浅色模式自动切换(覆盖 Obsidian 的固定主题选择)。
 *
 * 符号数据格式: [显示字符, LaTeX代码, 名称, 标记]
 *   - LaTeX 代码中的 '|' 是光标占位符:
 *     若编辑器中有选中文本, 第一个 '|' 会被选中文本替换,
 *     其余 '|' 会被替换为 \square(渲染为 □)作为待填占位,
 *     插入后光标自动选中第一个待填位置。
 *   - 标记 'b' 表示块级结构(矩阵/分支等), 在数学环境外时自动用 $$...$$ 包裹。
 */

const obsidian = require('obsidian');
const { Plugin, MarkdownView, Notice, PluginSettingTab, Setting } = obsidian;

/* ---------------------------- 符号分类数据 ---------------------------- */

const CATS = [
  {
    id: 'fav', name: '常用',
    items: [
      ['x²', '^{2}', '上标平方'],
      ['x^', '^{|}', '上标'],
      ['xᵢ', '_{|}', '下标'],
      ['⁄', '\\frac{|}{|}', '分数'],
      ['√', '\\sqrt{|}', '平方根'],
      ['ⁿ√', '\\sqrt[|]{|}', 'n次方根'],
      ['∑', '\\sum_{|}^{|}', '求和'],
      ['∏', '\\prod_{|}^{|}', '累乘'],
      ['∫', '\\int_{|}^{|}', '积分'],
      ['lim', '\\lim_{|}', '极限'],
      ['∞', '\\infty', '无穷'],
      ['∂', '\\partial', '偏导'],
      ['∇', '\\nabla', '梯度'],
      ['±', '\\pm', '正负号'],
      ['×', '\\times', '乘号'],
      ['÷', '\\div', '除号'],
      ['≤', '\\leq', '小于等于'],
      ['≥', '\\geq', '大于等于'],
      ['≠', '\\neq', '不等于'],
      ['≈', '\\approx', '约等于'],
      ['≡', '\\equiv', '恒等于'],
      ['→', '\\rightarrow', '右箭头'],
      ['⇒', '\\Rightarrow', '右双箭头'],
      ['∈', '\\in', '属于'],
      ['α', '\\alpha', '希腊字母 alpha'],
      ['π', '\\pi', '希腊字母 pi'],
      ['θ', '\\theta', '希腊字母 theta'],
      ['μ', '\\mu', '希腊字母 mu'],
      ['°', '^\\circ', '度数符号'],
    ]
  },
  {
    id: 'supsub', name: '上下标',
    items: [
      ['x^', '^{|}', '上标'],
      ['x_', '_{|}', '下标'],
      ['x̄', '\\bar{|}', '上横线'],
      ['x́', '\\acute{|}', '锐音符'],
      ['x̆', '\\breve{|}', '短音符'],
      ['x̀', '\\grave{|}', '重音符'],
      ['ẋ', '\\dot{|}', '单点'],
      ['ẍ', '\\ddot{|}', '双点'],
      ['x̂', '\\hat{|}', '尖帽'],
      ['x̌', '\\check{|}', '对勾'],
      ['x̃', '\\tilde{|}', '波浪'],
      ['x⃗', '\\vec{|}', '向量箭头'],
      ['x‾', '\\overline{|}', '上划线'],
      ['x̲', '\\underline{|}', '下划线'],
      ['⏞', '\\overbrace{|}^{…}', '上方大括号'],
      ['⏟', '\\underbrace{|}_{…}', '下方大括号'],
    ]
  },
  {
    id: 'bracket', name: '括号',
    items: [
      ['( )', '(|)', '圆括号'],
      ['[ ]', '[|]', '方括号'],
      ['{ }', '\\{|\\}', '花括号'],
      ['⟨ ⟩', '\\langle|\\rangle', '尖括号'],
      ['⌊ ⌋', '\\lfloor|\\rfloor', '向下取整'],
      ['⌈ ⌉', '\\lceil|\\rceil', '向上取整'],
      ['| |', '\\lvert|\\rvert', '绝对值'],
      ['‖ ‖', '\\lVert|\\rVert', '范数'],
      ['big()', '\\big(|\\big)', '大一号括号'],
      ['Big()', '\\Big(|\\Big)', '大两号括号'],
      ['bigg()', '\\bigg(|\\bigg)', '大三号括号'],
      ['Bigg()', '\\Bigg(|\\Bigg)', '大四号括号'],
    ]
  },
  {
    id: 'frac', name: '分根',
    items: [
      ['⁄', '\\frac{|}{|}', '分数'],
      ['dfrac', '\\dfrac{|}{|}', '显示型分数'],
      ['tfrac', '\\tfrac{|}{|}', '文本型分数'],
      ['√', '\\sqrt{|}', '平方根'],
      ['ⁿ√', '\\sqrt[|]{|}', 'n次方根'],
    ]
  },
  {
    id: 'sumint', name: '积限',
    items: [
      ['∑', '\\sum_{|}^{|}', '求和'],
      ['∑₋', '\\sum_{|}', '带下限求和'],
      ['∏', '\\prod_{|}^{|}', '累乘'],
      ['∫', '\\int', '积分号'],
      ['∫', '\\int_{|}^{|}', '定积分'],
      ['∬', '\\iint', '双重积分'],
      ['∭', '\\iiint', '三重积分'],
      ['∮', '\\oint', '曲线积分'],
      ['lim', '\\lim_{|}', '极限'],
      ['lim∞', '\\lim_{n\\to+\\infty}', 'n趋于正无穷'],
      ['∂', '\\partial', '偏微分'],
      ['∇', '\\nabla', '梯度'],
      ['′', '\\prime', '求导撇'],
      ['d', '\\mathrm{d}|', '正体微分 d'],
    ]
  },
  {
    id: 'func', name: '函数',
    items: [
      ['sin', '\\sin', '正弦'],
      ['cos', '\\cos', '余弦'],
      ['tan', '\\tan', '正切'],
      ['cot', '\\cot', '余切'],
      ['sec', '\\sec', '正割'],
      ['csc', '\\csc', '余割'],
      ['arcsin', '\\arcsin', '反正弦'],
      ['arccos', '\\arccos', '反余弦'],
      ['arctan', '\\arctan', '反正切'],
      ['ln', '\\ln', '自然对数'],
      ['lg', '\\lg', '常用对数'],
      ['log', '\\log', '对数'],
      ['logₐ', '\\log_{|}', '以a为底对数'],
      ['⊥', '\\bot', '垂直'],
      ['∠', '\\angle', '角'],
      ['°', '^\\circ', '度'],
    ]
  },
  {
    id: 'op', name: '运算',
    items: [
      ['±', '\\pm', '正负号'],
      ['∓', '\\mp', '负正号'],
      ['×', '\\times', '乘号'],
      ['÷', '\\div', '除号'],
      ['∗', '\\ast', '星号'],
      ['⋆', '\\star', '五角星'],
      ['∣', '\\mid', '竖线'],
      ['∤', '\\nmid', '不整除'],
      ['∘', '\\circ', '小圆圈'],
      ['∙', '\\bullet', '实心点'],
      ['⋅', '\\cdot', '点乘'],
      ['≀', '\\wr', '波浪卷积'],
      ['⋄', '\\diamond', '小菱形'],
      ['◊', '\\Diamond', '菱形'],
      ['△', '\\triangle', '三角形'],
      ['△', '\\bigtriangleup', '大三角朝上'],
      ['▽', '\\bigtriangledown', '大三角朝下'],
      ['◃', '\\triangleleft', '左三角'],
      ['▹', '\\triangleright', '右三角'],
      ['⊲', '\\lhd', '左三角符号'],
      ['⊳', '\\rhd', '右三角符号'],
      ['⊴', '\\unlhd', '左正规子群'],
      ['⊵', '\\unrhd', '右正规子群'],
      ['◯', '\\bigcirc', '大圆'],
      ['⊙', '\\odot', '圆点'],
      ['⨀', '\\bigodot', '大圆点(点积)'],
      ['⊘', '\\oslash', '圆斜线'],
      ['⊖', '\\ominus', '圆减号'],
      ['⊗', '\\otimes', '圆叉号'],
      ['⨂', '\\bigotimes', '克罗内克积'],
      ['⊕', '\\oplus', '圆加号(异或)'],
      ['⨁', '\\bigoplus', '大圆加'],
      ['†', '\\dagger', '剑号'],
      ['‡', '\\ddagger', '双剑号'],
      ['⨿', '\\amalg', 'amalg 合并'],
    ]
  },
  {
    id: 'rel', name: '关系',
    items: [
      ['≤', '\\leq', '小于等于'],
      ['≥', '\\geq', '大于等于'],
      ['≡', '\\equiv', '恒等于'],
      ['(mod n)', '\\pmod{|}', '同余 mod n'],
      ['mod', '\\bmod', '取模'],
      ['⊨', '\\models', '逻辑满足'],
      ['≺', '\\prec', '先于'],
      ['≻', '\\succ', '后于'],
      ['∼', '\\sim', '相似'],
      ['⊥', '\\perp', '垂直'],
      ['⪯', '\\preceq', '先于等于'],
      ['⪰', '\\succeq', '后于等于'],
      ['≃', '\\simeq', '相似等价'],
      ['≪', '\\ll', '远小于'],
      ['≫', '\\gg', '远大于'],
      ['≍', '\\asymp', '渐近等于'],
      ['∥', '\\parallel', '平行'],
      ['≈', '\\approx', '约等于'],
      ['≅', '\\cong', '全等'],
      ['≠', '\\neq', '不等于'],
      ['≐', '\\doteq', '点等于'],
      ['∝', '\\propto', '成正比'],
      ['⋈', '\\bowtie', '蝴蝶结连接'],
      ['⋈', '\\Join', '连接'],
      ['⌣', '\\smile', '微笑弧'],
      ['⌢', '\\frown', '皱眉弧'],
      ['⊢', '\\vdash', '断言'],
      ['⊣', '\\dashv', '反向断言'],
    ]
  },
  {
    id: 'arrow', name: '箭头',
    items: [
      ['↑', '\\uparrow', '上箭头'],
      ['↓', '\\downarrow', '下箭头'],
      ['↕', '\\updownarrow', '上下箭头'],
      ['⇑', '\\Uparrow', '上双箭头'],
      ['⇓', '\\Downarrow', '下双箭头'],
      ['⇕', '\\Updownarrow', '上下双箭头'],
      ['→', '\\rightarrow', '右箭头'],
      ['←', '\\leftarrow', '左箭头'],
      ['↔', '\\leftrightarrow', '左右箭头'],
      ['⇒', '\\Rightarrow', '右双箭头'],
      ['⇐', '\\Leftarrow', '左双箭头'],
      ['⇔', '\\Leftrightarrow', '左右双箭头'],
      ['⟶', '\\longrightarrow', '长右箭头'],
      ['⟵', '\\longleftarrow', '长左箭头'],
      ['⟷', '\\longleftrightarrow', '长左右箭头'],
      ['⟹', '\\Longrightarrow', '长右双箭头'],
      ['⟸', '\\Longleftarrow', '长左双箭头'],
      ['⟺', '\\Longleftrightarrow', '长左右双箭头'],
      ['↦', '\\mapsto', '映射'],
      ['⟼', '\\longmapsto', '长映射'],
      ['↩', '\\hookleftarrow', '左钩箭头'],
      ['↪', '\\hookrightarrow', '右钩箭头'],
      ['⇀', '\\rightharpoonup', '右半箭头朝上'],
      ['↽', '\\leftharpoondown', '左半箭头朝下'],
      ['⇌', '\\rightleftharpoons', '化学平衡箭头'],
      ['↼', '\\leftharpoonup', '左半箭头朝上'],
      ['⇁', '\\rightharpoondown', '右半箭头朝下'],
      ['⇝', '\\leadsto', '波浪箭头'],
      ['↗', '\\nearrow', '右上箭头'],
      ['↘', '\\searrow', '右下箭头'],
      ['↙', '\\swarrow', '左下箭头'],
      ['↖', '\\nwarrow', '左上箭头'],
    ]
  },
  {
    id: 'set', name: '集合',
    items: [
      ['∅', '\\emptyset', '空集'],
      ['∈', '\\in', '属于'],
      ['∋', '\\ni', '包含'],
      ['∉', '\\notin', '不属于'],
      ['⊂', '\\subset', '子集'],
      ['⊃', '\\supset', '超集'],
      ['⊄', '\\not\\subset', '非子集'],
      ['⊆', '\\subseteq', '子集或相等'],
      ['⊇', '\\supseteq', '超集或相等'],
      ['∪', '\\cup', '并集'],
      ['⋃', '\\bigcup', '大并集'],
      ['∩', '\\cap', '交集'],
      ['⋂', '\\bigcap', '大交集'],
      ['⊎', '\\uplus', '多重集并'],
      ['⨄', '\\biguplus', '大多重集并'],
      ['⊏', '\\sqsubset', '方形子集'],
      ['⊐', '\\sqsupset', '方形超集'],
      ['⊓', '\\sqcap', '方形交'],
      ['⊑', '\\sqsubseteq', '方形子集等'],
      ['⊒', '\\sqsupseteq', '方形超集等'],
      ['∨', '\\vee', '逻辑或'],
      ['∧', '\\wedge', '逻辑与'],
      ['∖', '\\setminus', '集合减法'],
    ]
  },
  {
    id: 'logic', name: '逻辑',
    items: [
      ['∵', '\\because', '因为'],
      ['∴', '\\therefore', '所以'],
      ['∀', '\\forall', '任意/全称量词'],
      ['∃', '\\exist', '存在量词'],
      ['∨', '\\vee', '逻辑或'],
      ['∧', '\\wedge', '逻辑与'],
      ['⋁', '\\bigvee', '大或'],
      ['⋀', '\\bigwedge', '大与'],
      ['¬', '\\neg', '非'],
    ]
  },
  {
    id: 'greek', name: '希腊',
    items: [
      ['α', '\\alpha', '希腊字母 alpha'],
      ['β', '\\beta', '希腊字母 beta'],
      ['γ', '\\gamma', '希腊字母 gamma'],
      ['δ', '\\delta', '希腊字母 delta'],
      ['ϵ', '\\epsilon', '希腊字母 epsilon'],
      ['ε', '\\varepsilon', '希腊字母 varepsilon'],
      ['ζ', '\\zeta', '希腊字母 zeta'],
      ['η', '\\eta', '希腊字母 eta'],
      ['θ', '\\theta', '希腊字母 theta'],
      ['ι', '\\iota', '希腊字母 iota'],
      ['κ', '\\kappa', '希腊字母 kappa'],
      ['λ', '\\lambda', '希腊字母 lambda'],
      ['μ', '\\mu', '希腊字母 mu'],
      ['ν', '\\nu', '希腊字母 nu'],
      ['ξ', '\\xi', '希腊字母 xi'],
      ['ο', '\\omicron', '希腊字母 omicron'],
      ['π', '\\pi', '希腊字母 pi'],
      ['ρ', '\\rho', '希腊字母 rho'],
      ['σ', '\\sigma', '希腊字母 sigma'],
      ['τ', '\\tau', '希腊字母 tau'],
      ['υ', '\\upsilon', '希腊字母 upsilon'],
      ['ϕ', '\\phi', '希腊字母 phi'],
      ['φ', '\\varphi', '希腊字母 varphi'],
      ['χ', '\\chi', '希腊字母 chi'],
      ['ψ', '\\psi', '希腊字母 psi'],
      ['ω', '\\omega', '希腊字母 omega'],
      ['Γ', '\\Gamma', 'Gamma 大写'],
      ['Δ', '\\Delta', 'Delta 大写'],
      ['Θ', '\\Theta', 'Theta 大写'],
      ['Λ', '\\Lambda', 'Lambda 大写'],
      ['Ξ', '\\Xi', 'Xi 大写'],
      ['Π', '\\Pi', 'Pi 大写'],
      ['Σ', '\\Sigma', 'Sigma 大写'],
      ['Υ', '\\Upsilon', 'Upsilon 大写'],
      ['Φ', '\\Phi', 'Phi 大写'],
      ['Ψ', '\\Psi', 'Psi 大写'],
      ['Ω', '\\Omega', 'Omega 大写'],
    ]
  },
  {
    id: 'misc', name: '其他',
    items: [
      ['ℵ', '\\aleph', '希伯来字母'],
      ['ℏ', '\\hbar', '普朗克常数'],
      ['ı', '\\imath', '无点 i'],
      ['ȷ', '\\jmath', '无点 j'],
      ['ℓ', '\\ell', '手写 l'],
      ['℘', '\\wp', '魏尔斯特拉斯P'],
      ['ℜ', '\\Re', '实部'],
      ['ℑ', '\\Im', '虚部'],
      ['℧', '\\mho', '倒欧米茄'],
      ['√', '\\surd', '根号'],
      ['⊤', '\\top', '顶真'],
      ['⊥', '\\bot', '底假'],
      ['♭', '\\flat', '降记号'],
      ['♮', '\\natural', '还原记号'],
      ['♯', '\\sharp', '升记号'],
      ['\\', '\\backslash', '反斜线'],
      ['∂', '\\partial', '偏导'],
      ['□', '\\Box', '方框'],
      ['♣', '\\clubsuit', '梅花'],
      ['♢', '\\diamondsuit', '方片'],
      ['♡', '\\heartsuit', '红桃'],
      ['♠', '\\spadesuit', '黑桃'],
      ['…', '\\dots', '省略号'],
      ['…', '\\ldots', '底部省略号'],
      ['⋯', '\\cdots', '中部省略号'],
      ['⋮', '\\vdots', '竖省略号'],
      ['⋱', '\\ddots', '斜省略号'],
      ['␣', '\\!', '负空格 -3/18em'],
      ['␣', '\\,', '小空格 3/18em'],
      ['␣', '\\:', '中空格 4/18em'],
      ['␣', '\\;', '中空格 5/18em'],
      ['␣', '\\quad', '1em 空格'],
      ['␣', '\\qquad', '2em 空格'],
    ]
  },
  {
    id: 'matrix', name: '矩阵',
    items: [
      ['matrix', '\\begin{matrix}\n| & | \\\\\n| & |\n\\end{matrix}', '无括号矩阵', 'b'],
      ['(m)', '\\begin{pmatrix}\n| & | \\\\\n| & |\n\\end{pmatrix}', '小括号矩阵', 'b'],
      ['[m]', '\\begin{bmatrix}\n| & | \\\\\n| & |\n\\end{bmatrix}', '中括号矩阵', 'b'],
      ['{m}', '\\begin{Bmatrix}\n| & | \\\\\n| & |\n\\end{Bmatrix}', '大括号矩阵', 'b'],
      ['|m|', '\\begin{vmatrix}\n| & | \\\\\n| & |\n\\end{vmatrix}', '单竖线矩阵(行列式)', 'b'],
      ['‖m‖', '\\begin{Vmatrix}\n| & | \\\\\n| & |\n\\end{Vmatrix}', '双竖线矩阵', 'b'],
      ['cases', 'y=\\begin{cases}\n|, & x\\leq 0 \\\\\n, & x>0\n\\end{cases}', '分支函数', 'b'],
      ['array', '\\begin{array}{c|cc}\n| & & \\\\\n & & \n\\end{array}', '带分割线数组', 'b'],
      ['⒧⒭', '\\left(\n|\n\\right)', '自适应大小括号'],
    ]
  },
];

/* ---------------------------- 插件主体 ---------------------------- */

const DEFAULT_SETTINGS = {
  enabled: true,             // 是否显示工具栏
  followSystemTheme: true,   // 跟随系统深/浅色模式
  collapsed: false,          // 折叠面板(只显示标题行)
  lastCategory: 'fav',       // 记忆上次的分类
};

class MathSymbolToolbarPlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    this.buildToolbar();
    this.setupSystemTheme();

    this.addRibbonIcon('sigma', '数学符号工具栏 (点击显示/隐藏)', () => this.toggleToolbar());
    this.addCommand({
      id: 'toggle-toolbar',
      name: '显示/隐藏 数学符号工具栏',
      callback: () => this.toggleToolbar(),
    });
    this.addSettingTab(new MathToolbarSettingTab(this.app, this));

    // active leaf 切换 / 布局变化(分屏、编辑-阅读模式切换)时重新挂载工具栏
    this.registerEvent(this.app.workspace.on('active-leaf-change', () => this.syncToolbar()));
    this.registerEvent(this.app.workspace.on('layout-change', () => this.syncToolbar()));
    this.app.workspace.onLayoutReady(() => this.syncToolbar());
  }

  onunload() {
    if (this.barEl) {
      this.barEl.detach();
      this.barEl = null;
    }
    this.restoreTheme();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  toggleToolbar() {
    this.settings.enabled = !this.settings.enabled;
    this.saveSettings();
    this.syncToolbar();
  }

  /* ---------- 折叠/展开(点击标题行) ---------- */

  toggleCollapsed() {
    this.settings.collapsed = !this.settings.collapsed;
    this.saveSettings();
    this.applyCollapsed();
  }

  applyCollapsed() {
    if (this.barEl) this.barEl.toggleClass('is-collapsed', !!this.settings.collapsed);
  }

  /* ---------- 嵌入式挂载: 移动到当前活跃 markdown 视图的文档流中 ---------- */

  syncToolbar() {
    if (!this.barEl) return;
    const hide = () => this.barEl.addClass('mst-hidden');

    if (!this.settings.enabled) { hide(); return; }
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    // 仅编辑(source)模式显示; 阅读模式/其他视图自动隐藏
    if (!view || view.getMode() !== 'source') { hide(); return; }

    const contentEl = view.contentEl;                          // .view-content
    const leafContent = contentEl && contentEl.parentElement;  // .workspace-leaf-content
    if (!leafContent || !leafContent.hasClass('workspace-leaf-content')) { hide(); return; }

    // 移动工具栏到 view-header 与 view-content 之间(占据布局空间, 不遮挡)
    if (this.barEl.parentElement !== leafContent || this.barEl.nextElementSibling !== contentEl) {
      leafContent.insertBefore(this.barEl, contentEl);
    }
    this.barEl.removeClass('mst-hidden');
  }

  /* ---------- 跟随系统亮暗 ---------- */

  setupSystemTheme() {
    this.mediaDark = window.matchMedia('(prefers-color-scheme: dark)');
    // 记录 Obsidian 原生主题类, 供关闭功能/卸载时还原
    this.originalTheme = null;
    this.registerDomEvent(this.mediaDark, 'change', () => this.applySystemTheme());
    if (this.settings.followSystemTheme) this.applySystemTheme();
  }

  applySystemTheme() {
    if (!this.settings.followSystemTheme || !this.mediaDark) return;
    const body = document.body;
    if (this.originalTheme === null) {
      this.originalTheme = body.hasClass('theme-dark') ? 'theme-dark' : 'theme-light';
    }
    const dark = this.mediaDark.matches;
    body.toggleClass('theme-dark', dark);
    body.toggleClass('theme-light', !dark);
  }

  restoreTheme() {
    if (this.originalTheme === null) return;
    const body = document.body;
    const dark = this.originalTheme === 'theme-dark';
    body.toggleClass('theme-dark', dark);
    body.toggleClass('theme-light', !dark);
    this.originalTheme = null;
  }

  /* ---------- UI ---------- */

  buildToolbar() {
    const bar = document.createElement('div');
    bar.addClass('mst-toolbar');
    bar.addClass('mst-hidden'); // 挂载前先隐藏, 由 syncToolbar 决定显示

    // 标题行(点击可折叠/展开符号面板, 不用时只占一行)
    const head = bar.createDiv('mst-head');
    head.addClass('mst-head-toggle');
    head.setAttribute('aria-label', '点击折叠/展开符号面板');
    head.createSpan({ text: '▾', cls: 'mst-chevron' });
    head.createSpan({ text: '∑ 数学符号', cls: 'mst-title' });
    const closeBtn = head.createEl('button', { text: '×', cls: 'mst-close' });
    closeBtn.setAttribute('aria-label', '隐藏工具栏');
    closeBtn.addEventListener('click', (evt) => {
      evt.stopPropagation(); // 仅隐藏工具栏, 不触发折叠
      this.toggleToolbar();
    });
    head.addEventListener('click', () => this.toggleCollapsed());

    // 分类 Tab 行
    this.tabsEl = bar.createDiv('mst-tabs');
    // 符号网格
    this.gridEl = bar.createDiv('mst-grid');

    // 事件委托: 点击 tab / 符号按钮
    bar.addEventListener('click', (evt) => {
      const tab = evt.target.closest('.mst-tab');
      if (tab && tab.dataset.cat) {
        this.settings.lastCategory = tab.dataset.cat;
        this.saveSettings();
        this.renderTabs();
        this.renderGrid();
        return;
      }
      const btn = evt.target.closest('.mst-btn');
      if (btn) {
        const catId = btn.dataset.cat;
        const idx = parseInt(btn.dataset.idx, 10);
        const cat = CATS.find((c) => c.id === catId);
        if (cat && cat.items[idx]) this.insertToken(cat.items[idx]);
      }
    });

    this.barEl = bar;
    this.renderTabs();
    this.renderGrid();
    this.applyCollapsed(); // 恢复上次折叠状态
    // 挂载由 syncToolbar 在 layout ready / leaf change 时完成
  }

  renderTabs() {
    const tabs = this.tabsEl;
    tabs.empty();
    for (const cat of CATS) {
      const t = tabs.createEl('button', { text: cat.name, cls: 'mst-tab' });
      t.dataset.cat = cat.id;
      if (cat.id === this.settings.lastCategory) t.addClass('is-active');
    }
  }

  renderGrid() {
    const grid = this.gridEl;
    grid.empty();
    const cat = CATS.find((c) => c.id === this.settings.lastCategory) || CATS[0];
    cat.items.forEach((item, idx) => {
      const [display, code, name, flag] = item;
      const btn = grid.createEl('button', { text: display, cls: 'mst-btn' });
      btn.dataset.cat = cat.id;
      btn.dataset.idx = String(idx);
      btn.setAttribute('aria-label', name + '：' + code);
      // 注意: 不设置 title 属性, 否则会同时出现系统原生注释框, 与 aria-label 的样式化提示重合
      if (/^[a-zA-Z]+$/.test(display)) btn.addClass('mst-text');
      if (flag === 'b') btn.addClass('mst-block');
    });
  }

  /* ---------- 插入逻辑 ---------- */

  insertToken(item) {
    const [display, code, name, flag] = item;
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) {
      new Notice('请先打开一个笔记再插入数学符号');
      return;
    }
    const editor = view.editor;
    if (!editor) return;

    const from = editor.getCursor('from');
    const to = editor.getCursor('to');
    const selText = editor.getSelection();

    // 选中文本替换第一个占位符
    let text = code;
    if (selText && code.indexOf('|') >= 0) {
      text = code.replace('|', selText);
    }
    // 剩余占位符转为 \square (渲染为 □, 直观标记待填位置)
    text = text.replace(/\|/g, '\\square');

    const block = flag === 'b';
    let finalText = text;
    if (!this.detectMath(editor, from)) {
      // 不在数学环境里, 自动包一层
      finalText = block ? '$$\n' + text + '\n$$' : '$' + text + '$';
    }

    editor.replaceRange(finalText, from, to);

    // 光标定位: 选中第一个 \square 待填处; 没有则移到插入文本末尾
    const sqIdx = finalText.indexOf('\\square');
    if (sqIdx >= 0) {
      const start = this.advancePos(from, finalText.slice(0, sqIdx));
      const end = this.advancePos(start, '\\square');
      editor.setSelection(start, end);
    } else {
      editor.setCursor(this.advancePos(from, finalText));
    }
    editor.focus();
  }

  /**
   * 检测光标位置是否处于数学环境中。
   * 扫描文档开头到光标的文本, 统计 $$ 与 $ 的配对状态, 以及 \( \) \[ \]。
   * 返回 'block' | 'inline' | null
   */
  detectMath(editor, cursor) {
    const doc = editor.getValue();
    let off = editor.posToOffset(cursor);
    if (off > doc.length) off = doc.length;
    const s = doc.slice(0, off);

    let i = 0;
    let dd = 0;        // $$ 计数
    let inline = false; // 单 $ 配对状态
    while (i < s.length) {
      const c = s[i];
      if (c === '\\') { i += 2; continue; } // 跳过转义, 如 \$
      if (c === '$') {
        if (s[i + 1] === '$') { dd++; i += 2; continue; }
        inline = !inline;
        i++;
        continue;
      }
      i++;
    }
    if (dd % 2 === 1) return 'block';
    if (inline) return 'inline';
    // \( \) \[ \] 形式
    const opens = (s.match(/\\\(|\\\[/g) || []).length;
    const closes = (s.match(/\\\)|\\\]/g) || []).length;
    if (opens > closes) return 'inline';
    return null;
  }

  /** 从 start 位置前进 text 长度, 返回新的光标位置 */
  advancePos(start, text) {
    const lines = text.split('\n');
    if (lines.length === 1) {
      return { line: start.line, ch: start.ch + lines[0].length };
    }
    return { line: start.line + lines.length - 1, ch: lines[lines.length - 1].length };
  }
}

/* ---------------------------- 设置面板 ---------------------------- */

class MathToolbarSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: '数学符号工具栏 设置' });

    new Setting(containerEl)
      .setName('启动时显示工具栏')
      .setDesc('关闭后可通过左侧边栏的 ∑ 图标或命令面板重新打开。工具栏嵌入在编辑区顶部文档流中, 不会遮挡笔记内容。')
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.enabled).onChange(async (value) => {
          this.plugin.settings.enabled = value;
          await this.plugin.saveSettings();
          this.plugin.syncToolbar();
        })
      );

    new Setting(containerEl)
      .setName('跟随系统亮暗模式')
      .setDesc('开启后监听 Windows 系统深色模式, 自动切换 Obsidian 明暗主题(晚上系统变暗, Obsidian 跟着变暗); 关闭时恢复 Obsidian 自身的主题设置。')
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.followSystemTheme).onChange(async (value) => {
          this.plugin.settings.followSystemTheme = value;
          await this.plugin.saveSettings();
          if (value) this.plugin.applySystemTheme();
          else this.plugin.restoreTheme();
        })
      );
  }
}

module.exports = MathSymbolToolbarPlugin;
