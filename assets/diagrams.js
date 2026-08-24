/* ============================================================
   OWASP Agentic Skills Top 10 — Hand-Drawn Diagrams (rough.js)
   High-Contrast Excalidraw-Style Threat Architecture Visuals
   Zero-Overlap / Clean Margins / Automatic Text Layout
   ============================================================ */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const COL = {
    blue: "#1971c2", red: "#e03131", green: "#2b8a3e", teal: "#0c8599",
    grape: "#7048e8", orange: "#f08c00", yellow: "#f59f00", pink: "#d6336c",
    indigo: "#3b5bdb", cyan: "#099268", ink: "#14171f", accent: "#ff6a2b",
    slate: "#4b5563", line: "#cbd5e1", lightBg: "#f8fafc", white: "#ffffff"
  };
  const FONT = "'Kalam', cursive";

  function isZh() {
    return !!(window.AST_I18N && window.AST_I18N.isZh());
  }

  function fontFace() {
    return isZh() ? "'Noto Sans SC', 'Inter', sans-serif" : FONT;
  }

  function scene(host, w, h) {
    host.innerHTML = "";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    host.appendChild(svg);
    return { svg, rc: rough.svg(svg), w, h };
  }

  function addNode(s, node) { s.svg.appendChild(node); return node; }

  function rect(s, x, y, w, h, o = {}) {
    return addNode(s, s.rc.rectangle(x, y, w, h, Object.assign(
      { roughness: 1.1, bowing: 1, stroke: COL.ink, strokeWidth: 1.6 }, o)));
  }

  function line(s, x1, y1, x2, y2, o = {}) {
    return addNode(s, s.rc.line(x1, y1, x2, y2, Object.assign(
      { roughness: 1.1, strokeWidth: 1.5, stroke: COL.ink }, o)));
  }

  function poly(s, pts, o = {}) {
    return addNode(s, s.rc.polygon(pts, Object.assign(
      { roughness: 1.1, strokeWidth: 1.6, stroke: COL.ink }, o)));
  }

  function arrow(s, x1, y1, x2, y2, o = {}) {
    const stroke = o.stroke || COL.ink;
    line(s, x1, y1, x2, y2, Object.assign({ stroke, strokeWidth: 2 }, o));
    const a = Math.atan2(y2 - y1, x2 - x1), L = 12;
    poly(s, [
      [x2, y2],
      [x2 - L * Math.cos(a - 0.4), y2 - L * Math.sin(a - 0.4)],
      [x2 - L * Math.cos(a + 0.4), y2 - L * Math.sin(a + 0.4)],
    ], { fill: stroke, fillStyle: "solid", stroke, strokeWidth: 1 });
  }

  function txt(s, x, y, str, o = {}) {
    const t = document.createElementNS(NS, "text");
    t.setAttribute("x", x); t.setAttribute("y", y);
    t.setAttribute("font-family", o.family || fontFace());
    t.setAttribute("font-size", o.size || 14);
    t.setAttribute("fill", o.col || COL.ink);
    t.setAttribute("text-anchor", o.anchor || "start");
    t.setAttribute("font-weight", o.weight || 400);
    t.textContent = str;
    return addNode(s, t);
  }

  function hex(c, a) {
    const n = c.replace("#", "");
    const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  function chip(s, x, y, w, h, label, color, o = {}) {
    rect(s, x, y, w, h, { fill: o.fill || hex(color, 0.12), fillStyle: "solid", stroke: color, strokeWidth: 2 });
    const lines = label.split("\n");
    const cy = y + h / 2 - (lines.length - 1) * 9 + 5;
    lines.forEach((ln, i) => txt(s, x + w / 2, cy + i * 18, ln,
      { size: o.size || 13, anchor: "middle", col: o.col || COL.ink, weight: 700 }));
  }

  function cardBox(s, x, y, w, h, title, items, color, o = {}) {
    rect(s, x, y, w, h, { fill: hex(color, 0.07), stroke: color, strokeWidth: 1.8 });
    txt(s, x + 15, y + 24, title, { size: 13, weight: 700, col: color });
    items.forEach((it, i) => {
      txt(s, x + 15, y + 48 + i * 22, it, { size: 11.5, col: o.itemCol || COL.ink });
    });
  }

  /* 1. Executive Risk Map (4 Quadrants) */
  function drawRiskMap(host) {
    const s = scene(host, 880, 520);
    const zh = isZh();

    chip(s, 290, 15, 300, 44, zh ? "OWASP Agentic Skills Top 10\n核心风险全景架构" : "OWASP Agentic Skills Top 10\nExecutive Risk Taxonomy", COL.accent, { size: 14, fill: hex(COL.accent, 0.15) });

    // Q1: Sourcing & Registry Trust (Top-Left)
    rect(s, 30, 80, 390, 190, { fill: hex(COL.blue, 0.06), stroke: COL.blue, strokeWidth: 2 });
    txt(s, 45, 108, zh ? "1. 技能来源与注册表信任 (Sourcing & Trust)" : "1. Skill Sourcing & Registry Trust", { size: 15, weight: 700, col: COL.blue });
    chip(s, 45, 125, 175, 60, zh ? "AST01 恶意技能\n(窃密木马 / 记忆后门)" : "AST01 Malicious Skills\n(AMOS Stealer / SOUL.md)", COL.blue, { size: 11.5 });
    chip(s, 230, 125, 175, 60, zh ? "AST02 供应链妥协\n(依赖混淆 / 钩子RCE)" : "AST02 Supply Chain\n(Dependency Confusion / RCE)", COL.teal, { size: 11.5 });
    chip(s, 135, 195, 180, 55, zh ? "AST04 不安全元数据\n(品牌仿冒 / YAML反序列化)" : "AST04 Insecure Metadata\n(Spoofing / YAML RCE)", COL.grape, { size: 11.5 });

    // Q2: Execution Boundaries & Privilege (Top-Right)
    rect(s, 460, 80, 390, 190, { fill: hex(COL.orange, 0.06), stroke: COL.orange, strokeWidth: 2 });
    txt(s, 475, 108, zh ? "2. 执行边界与特权隔离 (Execution Boundaries)" : "2. Execution Boundaries & Privilege", { size: 15, weight: 700, col: COL.orange });
    chip(s, 475, 125, 175, 60, zh ? "AST03 特权过大技能\n(LPCI逻辑注入 / 删库)" : "AST03 Over-Privileged\n(LPCI Injection / DB Wipe)", COL.orange, { size: 11.5 });
    chip(s, 660, 125, 175, 60, zh ? "AST05 不受信任外部指令\n(作者跑路 / 中继放大)" : "AST05 External Instructions\n(Rug-Pull / Relay Drift)", COL.red, { size: 11.5 });
    chip(s, 565, 195, 180, 55, zh ? "AST06 弱隔离机制\n(宿主逃逸 / Localhost跨域)" : "AST06 Weak Isolation\n(Host Escape / Loopback)", COL.cyan, { size: 11.5 });

    // Q3: Lifecycle Governance & Defense (Bottom-Left)
    rect(s, 30, 290, 390, 200, { fill: hex(COL.yellow, 0.06), stroke: COL.yellow, strokeWidth: 2 });
    txt(s, 45, 318, zh ? "3. 全生命周期治理与防御 (Lifecycle Governance)" : "3. Lifecycle Governance & Defense", { size: 15, weight: 700, col: COL.yellow });
    chip(s, 45, 335, 175, 60, zh ? "AST07 更新漂移\n(静默带毒升级 / 热重载)" : "AST07 Update Drift\n(Silent Auto-Update / Drift)", COL.yellow, { size: 11.5 });
    chip(s, 230, 335, 175, 60, zh ? "AST08 扫描能力不足\n(自然语言免杀 / 截断失明)" : "AST08 Poor Scanning\n(NL Evasion / Truncation)", COL.pink, { size: 11.5 });
    chip(s, 135, 410, 180, 60, zh ? "AST09 治理缺失\n(影子AI / 缺乏双向审计)" : "AST09 No Governance\n(Shadow AI / Audit Gaps)", COL.indigo, { size: 11.5 });

    // Q4: Cross-Platform Interoperability (Bottom-Right)
    rect(s, 460, 290, 390, 200, { fill: hex(COL.green, 0.06), stroke: COL.green, strokeWidth: 2 });
    txt(s, 475, 318, zh ? "4. 跨平台重用与标准 (Cross-Platform)" : "4. Cross-Platform Interoperability", { size: 15, weight: 700, col: COL.green });
    chip(s, 475, 335, 360, 60, zh ? "AST10 跨平台重用\n(清单剥离 / 隐式提权 / 跨市场套利)" : "AST10 Cross-Platform Reuse\n(Manifest Stripping / Privilege Loss / Arbitrage)", COL.green, { size: 12.5 });
    chip(s, 475, 410, 360, 60, zh ? "★ 核心解法：通用技能格式 (USF v1.0)\n密码学绑定 + 默认保护 SOUL.md / MEMORY.md" : "★ Core Solution: Universal Skill Format (USF v1.0)\nCryptographic Hashes + Default-Deny Identity Protection", COL.accent, { size: 12, fill: hex(COL.accent, 0.18) });

    arrow(s, 440, 65, 225, 80, { stroke: COL.blue });
    arrow(s, 440, 65, 655, 80, { stroke: COL.orange });
    arrow(s, 440, 65, 225, 290, { stroke: COL.yellow });
    arrow(s, 440, 65, 655, 290, { stroke: COL.green });
  }

  /* 2. Decision Tree Flowchart */
  function drawDecisionTree(host) {
    const s = scene(host, 880, 500);
    const zh = isZh();

    chip(s, 310, 10, 260, 40, zh ? "发现安全隐患？进入分诊判定" : "Security Finding Triage Flow", COL.ink, { size: 14, weight: 700 });

    arrow(s, 440, 52, 440, 75);
    chip(s, 260, 75, 360, 44, zh ? "1. 技能本身是否在发布时就带毒？\n(后门、窃密Payload、反弹Shell)" : "1. Is the skill itself malicious at publish time?\n(Hidden backdoor, AMOS stealer, trojan)", COL.blue, { size: 12 });
    arrow(s, 620, 97, 720, 97, { stroke: COL.red });
    txt(s, 640, 90, zh ? "是 (YES)" : "YES", { size: 12, col: COL.red, weight: 700 });
    chip(s, 720, 75, 140, 44, zh ? "➔ AST01\n恶意技能" : "➔ AST01\nMalicious Skills", COL.red, { size: 12, fill: hex(COL.red, 0.15) });

    arrow(s, 440, 120, 440, 150);
    txt(s, 450, 140, zh ? "否 (NO)" : "NO", { size: 12, col: COL.slate, weight: 700 });
    chip(s, 260, 150, 360, 44, zh ? "2. 隐患是否来自进入管道的途径？\n(抢注错拼名、依赖混淆、账户被盗)" : "2. Is it about how it reached the registry/pipeline?\n(Typosquatting, dependency confusion, account ATO)", COL.teal, { size: 12 });
    arrow(s, 620, 172, 720, 172, { stroke: COL.red });
    txt(s, 640, 165, zh ? "是 (YES)" : "YES", { size: 12, col: COL.red, weight: 700 });
    chip(s, 720, 150, 140, 44, zh ? "➔ AST02\n供应链妥协" : "➔ AST02\nSupply Chain", COL.teal, { size: 12, fill: hex(COL.teal, 0.15) });

    arrow(s, 440, 195, 440, 225);
    txt(s, 450, 215, zh ? "否 (NO)" : "NO", { size: 12, col: COL.slate, weight: 700 });
    chip(s, 260, 225, 360, 44, zh ? "3. 隐患是否在元数据/清单本身？\n(品牌仿冒、权限瞒报、YAML危险标签)" : "3. Is it in SKILL.md/manifest metadata?\n(Brand spoofing, understated perms, YAML RCE)", COL.grape, { size: 12 });
    arrow(s, 620, 247, 720, 247, { stroke: COL.red });
    txt(s, 640, 240, zh ? "是 (YES)" : "YES", { size: 12, col: COL.red, weight: 700 });
    chip(s, 720, 225, 140, 44, zh ? "➔ AST04\n不安全元数据" : "➔ AST04\nInsecure Metadata", COL.grape, { size: 12, fill: hex(COL.grape, 0.15) });

    arrow(s, 440, 270, 440, 300);
    txt(s, 450, 290, zh ? "否 (NO)" : "NO", { size: 12, col: COL.slate, weight: 700 });
    chip(s, 260, 300, 360, 44, zh ? "4. 扫描器/人工审查是否发生漏报失明？\n(自然语言免杀、10万换行截断、pyc隐藏)" : "4. Did a scanner/reviewer miss a threat?\n(NL bypass, 100k newline truncation, pyc evasion)", COL.pink, { size: 12 });
    arrow(s, 620, 322, 720, 322, { stroke: COL.red });
    txt(s, 640, 315, zh ? "是 (YES)" : "YES", { size: 12, col: COL.red, weight: 700 });
    chip(s, 720, 300, 140, 44, zh ? "➔ AST08\n扫描能力不足" : "➔ AST08\nPoor Scanning", COL.pink, { size: 12, fill: hex(COL.pink, 0.15) });

    arrow(s, 440, 345, 440, 375);
    txt(s, 450, 365, zh ? "否 (NO)" : "NO", { size: 12, col: COL.slate, weight: 700 });
    chip(s, 160, 375, 560, 38, zh ? "5. 依据运行态执行机理进行细分归类" : "5. Classify by Runtime Execution Mechanism", COL.orange, { size: 13 });

    const subs = [
      { code: "AST03", label: zh ? "特权过大/LPCI" : "Over-Privilege / LPCI", col: COL.orange },
      { code: "AST05", label: zh ? "外部引用/跑路" : "External Docs / Rug-Pull", col: COL.red },
      { code: "AST06", label: zh ? "弱隔离/逃逸" : "Weak Isolation / Escape", col: COL.cyan },
      { code: "AST07", label: zh ? "更新漂移/篡改" : "Update Drift / HotReload", col: COL.yellow },
      { code: "AST09", label: zh ? "治理缺失/影子AI" : "No Governance / Shadow", col: COL.indigo },
      { code: "AST10", label: zh ? "跨平台清单剥离" : "Cross-Platform Strip", col: COL.green }
    ];
    subs.forEach((item, idx) => {
      const x = 30 + idx * 140;
      arrow(s, 440, 415, x + 65, 435, { stroke: item.col });
      chip(s, x, 435, 130, 44, item.code + "\n" + item.label, item.col, { size: 10.5 });
    });
  }

  /* 3. AST01 */
  function drawAST01(host) {
    const s = scene(host, 420, 360);
    const zh = isZh();
    chip(s, 20, 12, 380, 40, zh ? "ClawHavoc 攻击链 (1,184 个恶意技能)" : "ClawHavoc Attack Path (1,184 Skills)", COL.red, { size: 13 });
    arrow(s, 210, 52, 210, 72, { stroke: COL.red });
    cardBox(s, 20, 72, 380, 125, zh ? "【载荷植入】AMOS 窃密木马 / 反弹 Shell" : "[Payload] AMOS Stealer / Reverse Shell", [
      zh ? "▸ 窃取 SSH 密钥、加密货币钱包与浏览器 Cookie" : "▸ Steals SSH keys, crypto wallets & cookies",
      zh ? "▸ 污染 SOUL.md / MEMORY.md 植入持久化后门" : "▸ Injects persistent backdoors into SOUL.md",
      zh ? "▸ 诱发 QSAF 认知退化与规划器失明" : "▸ Causes QSAF cognitive degradation & blind spots"
    ], COL.red);
    arrow(s, 210, 197, 210, 217, { stroke: COL.green });
    cardBox(s, 20, 217, 380, 128, zh ? "【核心防护】密码学准入与容器沙箱" : "【Defense】Cryptographic Gate & Sandbox", [
      zh ? "1. Ed25519 签名强校验绑定发布者身份" : "1. Ed25519 signatures tied to publisher IDs",
      zh ? "2. Docker --network=none 沙箱隔离运行" : "2. Docker --network=none isolated container",
      zh ? "3. 记忆隔离区校验所有 MEMORY.md 写入" : "3. Quarantine & validate all MEMORY.md writes"
    ], COL.green);
  }

  /* 4. AST02 */
  function drawAST02(host) {
    const s = scene(host, 420, 360);
    const zh = isZh();
    chip(s, 20, 12, 380, 40, zh ? "供应链攻击面与隐蔽执行路径" : "Supply Chain Execution Surface", COL.teal, { size: 13 });
    arrow(s, 210, 52, 210, 72);
    cardBox(s, 20, 72, 380, 120, zh ? "【依赖与配置劫持攻击面】" : "【Dependency & Config Attack Surface】", [
      zh ? "▸ 嵌套依赖混淆：SKILL.md 干净但拉取恶意库" : "▸ Nested Dependency: Clean SKILL.md pulls typosquat",
      zh ? "▸ 钩子劫持：CVE-2025-59536 (.claude/settings.json)" : "▸ Config Hook RCE: CVE-2025-59536 / settings.json",
      zh ? "▸ 注册表漫灌：批量克隆合法技能刷高信任度" : "▸ Registry Flooding: Poisoned clones with forged stars"
    ], COL.teal);
    arrow(s, 210, 192, 210, 212, { stroke: COL.blue });
    cardBox(s, 20, 212, 380, 135, zh ? "【供应链防御体系】" : "【Supply Chain Defenses】", [
      zh ? "1. 不可变哈希锁定：pip-compile --generate-hashes" : "1. Immutable hash pinning via pip-compile",
      zh ? "2. 注册表 Merkle 树透明度日志包含证明" : "2. Merkle transparency inclusion proofs",
      zh ? "3. 将 hooks / settings.json 视作可执行代码严格准入" : "3. Treat config hooks / settings as executable code"
    ], COL.blue);
  }

  /* 5. AST03 */
  function drawAST03(host) {
    const s = scene(host, 420, 360);
    const zh = isZh();
    chip(s, 20, 12, 380, 40, zh ? "特权爆炸与 LPCI 逻辑层提示控制注入" : "Privilege Explosion & LPCI Injection", COL.orange, { size: 13 });
    arrow(s, 210, 52, 210, 72, { stroke: COL.orange });
    cardBox(s, 20, 72, 380, 120, zh ? "【LPCI 漏洞机理】(arXiv:2507.10457)" : "【LPCI Mechanism】(arXiv:2507.10457)", [
      zh ? "▸ 低特权输入 ➔ 嵌入延迟/条件触发 Payload" : "▸ Low-privilege input ➔ delayed condition trigger",
      zh ? "▸ 模型将工具输出误判为【操作员指令】" : "▸ Model treats tool output as Operator Command",
      zh ? "▸ 自主调用高危接口清空数据库 / 读 ~/.env" : "▸ Autonomously executes DROP TABLE / exfiltrates keys"
    ], COL.orange);
    arrow(s, 210, 192, 210, 212, { stroke: COL.green });
    cardBox(s, 20, 212, 380, 135, zh ? "【特权收敛防御】" : "【Least Privilege Defenses】", [
      zh ? "1. 严格指令分层：系统 > 操作员 > 用户 > 工具数据" : "1. Strict Hierarchy: System > Operator > Tool Data",
      zh ? "2. 细粒度域名网络白名单 (deny: \"*\")" : "2. Scoped domain allowlists with default deny: \"*\"",
      zh ? "3. 显式保护 SOUL.md / MEMORY.md，高危操作强制二次确认" : "3. Protect identity memory & enforce human-in-the-loop"
    ], COL.green);
  }

  /* 6. AST04 */
  function drawAST04(host) {
    const s = scene(host, 420, 360);
    const zh = isZh();
    chip(s, 20, 12, 380, 40, zh ? "不安全元数据与反序列化 RCE 风险" : "Insecure Metadata & Deserialization RCE", COL.grape, { size: 13 });
    arrow(s, 210, 52, 210, 72, { stroke: COL.grape });
    cardBox(s, 20, 72, 380, 120, zh ? "【元数据双重攻击面】" : "【Dual Metadata Attack Surface】", [
      zh ? "▸ 语义欺骗：仿冒官方技能、隐瞒真实执行权限" : "▸ Semantic: Brand impersonation & hidden permissions",
      zh ? "▸ 反序列化RCE：YAML !!python/object 执行任意系统命令" : "▸ Parser RCE: YAML !!python/object executes code",
      zh ? "▸ 字符走私：零宽字符与 ASCII 走私绕过审查" : "▸ Smuggling: Zero-width characters bypass human review"
    ], COL.grape);
    arrow(s, 210, 192, 210, 212, { stroke: COL.teal });
    cardBox(s, 20, 212, 380, 135, zh ? "【元数据防御准则】" : "【Metadata Defenses】", [
      zh ? "1. 强制使用 yaml.safe_load 禁用构造标签" : "1. Enforce yaml.safe_load (disable constructor tags)",
      zh ? "2. 基于 JSON Schema / Pydantic 强类型白名单验证" : "2. Strict JSON Schema / Pydantic validation",
      zh ? "3. 规范化 Unicode (NFKC) 剔除所有不可见走私字符" : "3. Normalize Unicode (NFKC) & strip zero-width chars"
    ], COL.teal);
  }

  /* 7. AST05 */
  function drawAST05(host) {
    const s = scene(host, 420, 360);
    const zh = isZh();
    chip(s, 20, 12, 380, 40, zh ? "外部指令可变性与多模型中继放大" : "External Doc Rug-Pull & Relay Amplification", COL.red, { size: 13 });
    arrow(s, 210, 52, 210, 72, { stroke: COL.red });
    cardBox(s, 20, 72, 380, 120, zh ? "【指令漂移与中继攻击】" : "【Instruction Drift & Relay Attacks】", [
      zh ? "▸ 作者跑路 (Rug-Pull)：审核通过后修改远端文档内容" : "▸ Author Rug-Pull: Modifying remote docs post-audit",
      zh ? "▸ 审查诱饵：对扫描器与真实 Agent 返回两套不同内容" : "▸ Bait-and-Switch: Clean to scanner, toxic to agent",
      zh ? "▸ 中继放大：链式调用中较弱模型将外部数据误当指令" : "▸ Relay Amplification: Weak models execute payload"
    ], COL.red);
    arrow(s, 210, 192, 210, 212, { stroke: COL.blue });
    cardBox(s, 20, 212, 380, 135, zh ? "【外部内容约束防御】" : "【External Reference Defenses】", [
      zh ? "1. 哈希锁定：校验外部文档 sha256 摘要防篡改" : "1. Content hash pinning for referenced URLs",
      zh ? "2. 文档内联：发布时将参考文档快照嵌入签名包" : "2. Snapshot inlining into signed skill packages",
      zh ? "3. 严格隔离：外部检索数据仅作参考，严禁覆盖系统指令" : "3. Treat retrieved data as untrusted reference text"
    ], COL.blue);
  }

  /* 8. AST06 */
  function drawAST06(host) {
    const s = scene(host, 420, 360);
    const zh = isZh();
    chip(s, 20, 12, 380, 40, zh ? "弱隔离宿主逃逸 vs 默认容器沙箱" : "Weak Isolation Escape vs Container Sandbox", COL.cyan, { size: 13 });
    arrow(s, 210, 52, 210, 72, { stroke: COL.cyan });
    cardBox(s, 20, 72, 380, 120, zh ? "【宿主执行风险】" : "【Host Mode Risks】", [
      zh ? "▸ 13.5万公网暴露实例 (Bitdefender 数据)" : "▸ 135k Exposed instances without boundary",
      zh ? "▸ Localhost 跨域逃逸 (ClawJacked CVE-2026-32025)" : "▸ Loopback origin bypass (CVE-2026-32025)",
      zh ? "▸ 写入 Cron 后门持久化控制宿主机系统" : "▸ Plants persistent cron jobs on operator workstation"
    ], COL.red);
    arrow(s, 210, 192, 210, 212, { stroke: COL.indigo });
    cardBox(s, 20, 212, 380, 135, zh ? "【隔离加固三要素】" : "【Isolation Hardening Pillars】", [
      zh ? "1. 默认容器化隔离，主机运行需显式高危授权" : "1. Container isolation by default; host-mode requires opt-in",
      zh ? "2. 应用严格 seccomp 配置文件与 --cap-drop=ALL" : "2. Strict seccomp profiles & --cap-drop=ALL",
      zh ? "3. Localhost 控制接口强制密钥握手与速率限制" : "3. Authenticate & rate-limit localhost WebSocket clients"
    ], COL.indigo);
  }

  /* 9. AST07 */
  function drawAST07(host) {
    const s = scene(host, 420, 360);
    const zh = isZh();
    chip(s, 20, 12, 380, 40, zh ? "更新漂移陷阱 vs 不可变版本锁定" : "Update Drift Traps vs Immutable Pinning", COL.yellow, { size: 13 });
    arrow(s, 210, 52, 210, 72, { stroke: COL.yellow });
    cardBox(s, 20, 72, 380, 120, zh ? "【漂移风险模型】" : "【Drift Threat Model】", [
      zh ? "▸ 补丁滞后：35.4% 部署因未打补丁长期处于 RCE 险境" : "▸ Patch Lag: 35.4% instances vulnerable to RCE",
      zh ? "▸ 恶意自动更新：作者账号被盗推送带毒 v2.0 静默上线" : "▸ Malicious Auto-Update: Hijacked author pushes toxic v2.0",
      zh ? "▸ 热重载滥用：本地文件被篡改 mid-session 立即生效" : "▸ Hot-Reload Abuse: Modifying SKILL.md mid-session"
    ], COL.yellow);
    arrow(s, 210, 192, 210, 212, { stroke: COL.green });
    cardBox(s, 20, 212, 380, 135, zh ? "【不可变更新策略】" : "【Immutable Update Policies】", [
      zh ? "1. 强制 sha256 唯一哈希锁定，拒绝模糊版本范围" : "1. Pin installed skills to sha256 hashes (no loose ranges)",
      zh ? "2. 每次升级强校验密码学数字签名" : "2. Cryptographic signature verification on every update",
      zh ? "3. 生产环境开启【冻结模式】(Freeze Mode)" : "3. Enable production Freeze Mode (disable hot-reload)"
    ], COL.green);
  }

  /* 10. AST08 */
  function drawAST08(host) {
    const s = scene(host, 420, 360);
    const zh = isZh();
    chip(s, 20, 12, 380, 40, zh ? "传统扫描盲区 vs NVIDIA SkillSpector 多层扫描" : "Traditional Scanning Gaps vs NVIDIA SkillSpector", COL.pink, { size: 13 });
    arrow(s, 210, 52, 210, 72, { stroke: COL.pink });
    cardBox(s, 20, 72, 380, 120, zh ? "【传统扫描破防盲区】" : "【Traditional Scanner Gaps】", [
      zh ? "▸ 自然语言免杀：纯散文指令达成恶意目的" : "▸ Natural language evasion with zero regex keywords",
      zh ? "▸ 10万换行截断：换行填充迫使扫描器丢失下文" : "▸ 100k Newline padding causes scanner context truncation",
      zh ? "▸ .pyc 字节码投毒：隐匿执行恶意逻辑" : "▸ .pyc bytecode poisoning hides exploit logic"
    ], COL.red);
    arrow(s, 210, 192, 210, 212, { stroke: COL.grape });
    cardBox(s, 20, 212, 380, 135, zh ? "【多层立体检测准则】" : "【Multi-Tier Scanning Defenses】", [
      zh ? "1. AST 语法污点分析 + YARA 规则 + LLM 语义意图裁判" : "1. AST Taint Tracking + YARA + LLM Semantic Judge",
      zh ? "2. Unicode 规范化 (NFKC) 剥离零宽与双向控制字符" : "2. Unicode NFKC normalization & zero-width stripping",
      zh ? "3. 完整目录穿透：扫描 .pyc / .docx，超限判 INCOMPLETE" : "3. Exhaustive file inspection; flag INCOMPLETE on limits"
    ], COL.grape);
  }

  /* 11. AST09 */
  function drawAST09(host) {
    const s = scene(host, 420, 360);
    const zh = isZh();
    chip(s, 20, 12, 380, 40, zh ? "企业影子 AI 风险 vs 双向凭证审计模式" : "Shadow AI Gaps vs Bilateral Receipt Pattern", COL.indigo, { size: 13 });
    arrow(s, 210, 52, 210, 72, { stroke: COL.indigo });
    cardBox(s, 20, 72, 380, 120, zh ? "【治理缺失与影子 AI】" : "【Shadow AI & Governance Gaps】", [
      zh ? "▸ 83% 企业已部署 Agent，但仅 29% 具备安全防护能力" : "▸ 83% Enterprise adoption vs 29% security readiness",
      zh ? "▸ 孤儿开发者技能：员工离职后高权限技能残留" : "▸ Orphaned skills retaining stale privileged API keys",
      zh ? "▸ 缺乏审计：多 Agent 链式调用后无法追溯责任人" : "▸ Zero audit trail across multi-agent handoffs"
    ], COL.indigo);
    arrow(s, 210, 192, 210, 212, { stroke: COL.blue });
    cardBox(s, 20, 212, 380, 135, zh ? "【治理与 EU AI Act 合规价值】" : "【Governance & EU AI Act Value】", [
      zh ? "1. 集中资产清单：纳管所有技能至企业 CMDB/CASB" : "1. Centralized Inventory in enterprise CMDB/CASB",
      zh ? "2. 双向关联防篡改：准入与结果凭证由数字签名绑定" : "2. Bilateral tamper-evident cryptographic receipts",
      zh ? "3. 满足欧盟《AI 法案》第 12 条高风险 AI 自动日志要求" : "3. Supports EU AI Act Article 12 automatic logging rules"
    ], COL.blue);
  }

  /* 12. AST10 */
  function drawAST10(host) {
    const s = scene(host, 420, 360);
    const zh = isZh();
    chip(s, 20, 12, 380, 40, zh ? "跨平台清单剥离 vs 通用技能格式 (USF v1.0)" : "Manifest Stripping vs Universal Skill Format", COL.green, { size: 13 });
    arrow(s, 210, 52, 210, 72, { stroke: COL.green });
    cardBox(s, 20, 72, 380, 120, zh ? "【跨生态迁移失控痛点】" : "【Cross-Platform Security Loss】", [
      zh ? "OpenClaw ➔ Claude Code ➔ Cursor ➔ VS Code" : "OpenClaw ➔ Claude Code ➔ Cursor ➔ VS Code",
      zh ? "▸ 迁移导致安全清单被剥离，目标端默认继承全权限" : "▸ Porting drops manifests, inheriting wide default access",
      zh ? "▸ 跨市场套利：低门槛市场刷虚假信誉转战高信任平台" : "▸ Cross-registry arbitrage creates false trust signals"
    ], COL.green);
    arrow(s, 210, 192, 210, 212, { stroke: COL.accent });
    cardBox(s, 20, 212, 380, 135, zh ? "【通用技能格式 (USF v1.0) 核心规范】" : "【Universal Skill Format (USF v1.0) Pillars】", [
      zh ? "1. did:web 发布者去中心化身份锚点与签名" : "1. did:web decentralized identity & Ed25519 signatures",
      zh ? "2. 默认写保护：deny_write: [SOUL.md, MEMORY.md]" : "2. Default deny_write on SOUL.md & MEMORY.md",
      zh ? "3. 域名级出站白名单：network.allow + deny: \"*\"" : "3. Domain allowlists (network.allow) with default deny: \"*\""
    ], COL.accent);
  }

  /* 13. MAESTRO Matrix Mindmap */
  function drawMaestroMatrix(host) {
    const s = scene(host, 880, 520);
    const zh = isZh();
    chip(s, 280, 15, 320, 42, zh ? "CSA MAESTRO 7 层架构与 AST Top 10 全景映射" : "CSA MAESTRO 7 Layers vs OWASP AST Top 10", COL.grape, { size: 14, weight: 700 });
    const layers = [
      { id: "L7", name: zh ? "Layer 7 · Agent 生态系统 (Ecosystem)" : "Layer 7 · Agent Ecosystem", asts: "AST01, AST02, AST04, AST05, AST09, AST10", col: COL.grape },
      { id: "L6", name: zh ? "Layer 6 · 安全与合规 (Security & Compliance)" : "Layer 6 · Security & Compliance", asts: "AST01, AST02, AST03, AST04, AST06, AST07, AST09, AST10", col: COL.red },
      { id: "L5", name: zh ? "Layer 5 · 评测与可观测性 (Evaluation & Observability)" : "Layer 5 · Evaluation & Observability", asts: "AST01, AST08, AST09", col: COL.yellow },
      { id: "L4", name: zh ? "Layer 4 · 部署基础设施 (Deployment & Infra)" : "Layer 4 · Deployment & Infra", asts: "AST01, AST02, AST03, AST04, AST06, AST07", col: COL.orange },
      { id: "L3", name: zh ? "Layer 3 · Agent 核心框架 (Frameworks & Loaders)" : "Layer 3 · Agent Frameworks", asts: "AST01, AST02, AST03, AST04, AST05, AST06, AST08, AST10", col: COL.teal },
      { id: "L2", name: zh ? "Layer 2 · 数据管道操作 (Data Operations)" : "Layer 2 · Data Operations", asts: "AST05 (Untrusted Ingested Context)", col: COL.blue },
      { id: "L1", name: zh ? "Layer 1 · 基础大模型 (Foundation Models)" : "Layer 1 · Foundation Models", asts: "AST08 (Model-dependent injection resistance)", col: COL.indigo }
    ];
    layers.forEach((l, idx) => {
      const y = 70 + idx * 60;
      rect(s, 50, y, 780, 50, { fill: hex(l.col, 0.08), stroke: l.col, strokeWidth: 1.8 });
      chip(s, 60, y + 6, 50, 38, l.id, l.col, { size: 13, weight: 700 });
      txt(s, 125, y + 30, l.name, { size: 13.5, weight: 700, col: l.col });
      txt(s, 480, y + 30, l.asts, { size: 12.5, weight: 600, col: COL.ink });
    });
  }

  const renderers = {
    "risk-map": drawRiskMap,
    "decision-tree": drawDecisionTree,
    "ast01": drawAST01,
    "ast02": drawAST02,
    "ast03": drawAST03,
    "ast04": drawAST04,
    "ast05": drawAST05,
    "ast06": drawAST06,
    "ast07": drawAST07,
    "ast08": drawAST08,
    "ast09": drawAST09,
    "ast10": drawAST10,
    "maestro-matrix": drawMaestroMatrix
  };

  function renderSlide(slideEl) {
    if (!slideEl) return;
    slideEl.querySelectorAll("[data-fig]").forEach(el => {
      const key = el.dataset.fig;
      if (renderers[key]) {
        renderers[key](el);
      }
    });
  }

  function renderAll() {
    const active = document.querySelector(".slide.is-active");
    if (active) renderSlide(active);
  }

  window.AST_DIAGRAMS = { renderSlide, renderAll };

  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(renderAll, 100);
    });
  } else {
    setTimeout(renderAll, 50);
  }

  document.addEventListener("ast:lang", () => {
    setTimeout(renderAll, 50);
  });
})();
