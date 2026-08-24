/* ============================================================
   OWASP Agentic Skills Top 10 — Hand-Drawn Diagrams (rough.js)
   High-Contrast Excalidraw-Style Threat Architecture Visuals
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
    t.setAttribute("font-size", o.size || 15);
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
    const lines = label.split("\\n");
    const cy = y + h / 2 - (lines.length - 1) * 9 + 5;
    lines.forEach((ln, i) => txt(s, x + w / 2, cy + i * 18, ln,
      { size: o.size || 14, anchor: "middle", col: o.col || COL.ink, weight: 700 }));
  }

  /* 1. Executive Risk Map (4 Quadrants) */
  function drawRiskMap(host) {
    const s = scene(host, 880, 520);
    const zh = isZh();

    chip(s, 290, 20, 300, 48, zh ? "OWASP Agentic Skills Top 10\n核心风险全景架构" : "OWASP Agentic Skills Top 10\nExecutive Risk Taxonomy", COL.accent, { size: 15, fill: hex(COL.accent, 0.15) });

    // Q1: Sourcing & Registry Trust (Top-Left)
    rect(s, 30, 90, 390, 185, { fill: hex(COL.blue, 0.06), stroke: COL.blue, strokeWidth: 2 });
    txt(s, 50, 118, zh ? "1. 技能来源与注册表信任 (Sourcing & Trust)" : "1. Skill Sourcing & Registry Trust", { size: 16, weight: 700, col: COL.blue });
    chip(s, 50, 135, 170, 60, zh ? "AST01 恶意技能\n(窃密木马 / 记忆后门)" : "AST01 Malicious Skills\n(AMOS Stealer / SOUL.md)", COL.blue, { size: 12 });
    chip(s, 235, 135, 170, 60, zh ? "AST02 供应链妥协\n(依赖混淆 / 钩子RCE)" : "AST02 Supply Chain\n(Dependency Confusion / RCE)", COL.teal, { size: 12 });
    chip(s, 140, 205, 170, 55, zh ? "AST04 不安全元数据\n(品牌仿冒 / YAML反序列化)" : "AST04 Insecure Metadata\n(Spoofing / YAML RCE)", COL.grape, { size: 12 });

    // Q2: Execution Boundaries & Privilege (Top-Right)
    rect(s, 460, 90, 390, 185, { fill: hex(COL.orange, 0.06), stroke: COL.orange, strokeWidth: 2 });
    txt(s, 480, 118, zh ? "2. 执行边界与特权隔离 (Execution Boundaries)" : "2. Execution Boundaries & Privilege", { size: 16, weight: 700, col: COL.orange });
    chip(s, 480, 135, 170, 60, zh ? "AST03 特权过大技能\n(LPCI逻辑注入 / 删库)" : "AST03 Over-Privileged\n(LPCI Injection / DB Wipe)", COL.orange, { size: 12 });
    chip(s, 665, 135, 170, 60, zh ? "AST05 不受信任外部指令\n(作者跑路 / 中继放大)" : "AST05 External Instructions\n(Rug-Pull / Relay Drift)", COL.red, { size: 12 });
    chip(s, 570, 205, 170, 55, zh ? "AST06 弱隔离机制\n(宿主逃逸 / Localhost跨域)" : "AST06 Weak Isolation\n(Host Escape / Loopback)", COL.cyan, { size: 12 });

    // Q3: Lifecycle Governance & Defense (Bottom-Left)
    rect(s, 30, 295, 390, 195, { fill: hex(COL.yellow, 0.06), stroke: COL.yellow, strokeWidth: 2 });
    txt(s, 50, 323, zh ? "3. 全生命周期治理与防御 (Lifecycle Governance)" : "3. Lifecycle Governance & Defense", { size: 16, weight: 700, col: COL.yellow });
    chip(s, 50, 340, 170, 60, zh ? "AST07 更新漂移\n(静默带毒升级 / 热重载)" : "AST07 Update Drift\n(Silent Auto-Update / Drift)", COL.yellow, { size: 12 });
    chip(s, 235, 340, 170, 60, zh ? "AST08 扫描能力不足\n(自然语言免杀 / 截断失明)" : "AST08 Poor Scanning\n(NL Evasion / Truncation)", COL.pink, { size: 12 });
    chip(s, 140, 415, 170, 60, zh ? "AST09 治理缺失\n(影子AI / 缺乏双向审计)" : "AST09 No Governance\n(Shadow AI / Audit Gaps)", COL.indigo, { size: 12 });

    // Q4: Cross-Platform Interoperability (Bottom-Right)
    rect(s, 460, 295, 390, 195, { fill: hex(COL.green, 0.06), stroke: COL.green, strokeWidth: 2 });
    txt(s, 480, 323, zh ? "4. 跨平台重用与标准 (Cross-Platform)" : "4. Cross-Platform Interoperability", { size: 16, weight: 700, col: COL.green });
    chip(s, 480, 340, 355, 60, zh ? "AST10 跨平台重用\n(清单剥离 / 隐式提权 / 跨市场套利)" : "AST10 Cross-Platform Reuse\n(Manifest Stripping / Privilege Loss / Arbitrage)", COL.green, { size: 13 });
    chip(s, 480, 415, 355, 60, zh ? "★ 核心解法：通用技能格式 (USF v1.0)\n密码学绑定 + 默认保护 SOUL.md / MEMORY.md" : "★ Core Solution: Universal Skill Format (USF v1.0)\nCryptographic Hashes + Default-Deny Identity Protection", COL.accent, { size: 12, fill: hex(COL.accent, 0.18) });

    arrow(s, 440, 70, 225, 90, { stroke: COL.blue });
    arrow(s, 440, 70, 655, 90, { stroke: COL.orange });
    arrow(s, 440, 70, 225, 295, { stroke: COL.yellow });
    arrow(s, 440, 70, 655, 295, { stroke: COL.green });
  }

  /* 2. Decision Tree Flowchart */
  function drawDecisionTree(host) {
    const s = scene(host, 880, 500);
    const zh = isZh();

    chip(s, 310, 15, 260, 44, zh ? "发现安全隐患？进入分诊判定" : "Security Finding Triage Flow", COL.ink, { size: 15, weight: 700 });

    arrow(s, 440, 60, 440, 85);
    chip(s, 270, 85, 340, 45, zh ? "1. 技能本身是否在发布时就带毒？\n(后门、窃密Payload、反弹Shell)" : "1. Is the skill itself malicious at publish time?\n(Hidden backdoor, AMOS stealer, trojan)", COL.blue, { size: 13 });
    arrow(s, 610, 107, 720, 107, { stroke: COL.red });
    txt(s, 635, 100, zh ? "是 (YES)" : "YES", { size: 13, col: COL.red, weight: 700 });
    chip(s, 720, 85, 140, 45, zh ? "➔ AST01\n恶意技能" : "➔ AST01\nMalicious Skills", COL.red, { size: 13, fill: hex(COL.red, 0.15) });

    arrow(s, 440, 130, 440, 160);
    txt(s, 450, 150, zh ? "否 (NO)" : "NO", { size: 13, col: COL.slate, weight: 700 });
    chip(s, 270, 160, 340, 45, zh ? "2. 隐患是否来自进入管道的途径？\n(抢注错拼名、依赖混淆、账户被盗)" : "2. Is it about how it reached the registry/pipeline?\n(Typosquatting, dependency confusion, account ATO)", COL.teal, { size: 13 });
    arrow(s, 610, 182, 720, 182, { stroke: COL.red });
    txt(s, 635, 175, zh ? "是 (YES)" : "YES", { size: 13, col: COL.red, weight: 700 });
    chip(s, 720, 160, 140, 45, zh ? "➔ AST02\n供应链妥协" : "➔ AST02\nSupply Chain", COL.teal, { size: 13, fill: hex(COL.teal, 0.15) });

    arrow(s, 440, 205, 440, 235);
    txt(s, 450, 225, zh ? "否 (NO)" : "NO", { size: 13, col: COL.slate, weight: 700 });
    chip(s, 270, 235, 340, 45, zh ? "3. 隐患是否在元数据/清单本身？\n(品牌仿冒、权限瞒报、YAML危险标签)" : "3. Is it in SKILL.md/manifest metadata?\n(Brand spoofing, understated perms, YAML RCE)", COL.grape, { size: 13 });
    arrow(s, 610, 257, 720, 257, { stroke: COL.red });
    txt(s, 635, 250, zh ? "是 (YES)" : "YES", { size: 13, col: COL.red, weight: 700 });
    chip(s, 720, 235, 140, 45, zh ? "➔ AST04\n不安全元数据" : "➔ AST04\nInsecure Metadata", COL.grape, { size: 13, fill: hex(COL.grape, 0.15) });

    arrow(s, 440, 280, 440, 310);
    txt(s, 450, 300, zh ? "否 (NO)" : "NO", { size: 13, col: COL.slate, weight: 700 });
    chip(s, 270, 310, 340, 45, zh ? "4. 扫描器/人工审查是否发生漏报失明？\n(自然语言免杀、10万换行截断、pyc隐藏)" : "4. Did a scanner/reviewer miss a threat?\n(NL bypass, 100k newline truncation, pyc evasion)", COL.pink, { size: 13 });
    arrow(s, 610, 332, 720, 332, { stroke: COL.red });
    txt(s, 635, 325, zh ? "是 (YES)" : "YES", { size: 13, col: COL.red, weight: 700 });
    chip(s, 720, 310, 140, 45, zh ? "➔ AST08\n扫描能力不足" : "➔ AST08\nPoor Scanning", COL.pink, { size: 13, fill: hex(COL.pink, 0.15) });

    arrow(s, 440, 355, 440, 385);
    txt(s, 450, 375, zh ? "否 (NO)" : "NO", { size: 13, col: COL.slate, weight: 700 });
    chip(s, 160, 385, 560, 40, zh ? "5. 依据运行态执行机理进行细分归类" : "5. Classify by Runtime Execution Mechanism", COL.orange, { size: 14 });

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
      arrow(s, 440, 425, x + 65, 445, { stroke: item.col });
      chip(s, x, 445, 130, 45, item.code + "\n" + item.label, item.col, { size: 11 });
    });
  }

  /* 3. AST01 */
  function drawAST01(host) {
    const s = scene(host, 420, 380);
    const zh = isZh();
    chip(s, 30, 20, 360, 45, zh ? "ClawHavoc 攻击链 (1,184 个恶意技能)" : "ClawHavoc Attack Path (1,184 Skills)", COL.red, { size: 14 });
    arrow(s, 210, 65, 210, 95, { stroke: COL.red });
    rect(s, 30, 95, 360, 115, { fill: hex(COL.red, 0.08), stroke: COL.red });
    txt(s, 45, 120, zh ? "【载荷植入】AMOS 窃密木马 / 反弹 Shell" : "[Payload] AMOS Stealer / Reverse Shell", { size: 13, weight: 700, col: COL.red });
    txt(s, 45, 145, zh ? "▸ 窃取 SSH 密钥、加密货币钱包与浏览器 Cookie" : "▸ Steals SSH keys, crypto wallets & cookies", { size: 12 });
    txt(s, 45, 170, zh ? "▸ 污染 SOUL.md / MEMORY.md 植入持久化后门" : "▸ Injects persistent backdoors into SOUL.md", { size: 12 });
    txt(s, 45, 195, zh ? "▸ 诱发 QSAF 认知退化与规划器失明" : "▸ Causes QSAF 6-stage cognitive degradation", { size: 12 });
    arrow(s, 210, 210, 210, 240, { stroke: COL.green });
    chip(s, 30, 240, 360, 115, zh ? "【核心防护】密码学准入与容器沙箱\n\n1. Ed25519 签名强校验绑定发布者身份\n2. Docker --network=none 沙箱运行脚本\n3. 记忆隔离区校验所有 MEMORY.md 写入" : "【Defense】Cryptographic Gate & Sandbox\n\n1. Ed25519 signatures tied to publisher IDs\n2. Docker --network=none isolated sandbox\n3. Quarantine & validate all MEMORY.md writes", COL.green, { size: 12, fill: hex(COL.green, 0.12) });
  }

  /* 4. AST02 */
  function drawAST02(host) {
    const s = scene(host, 420, 380);
    const zh = isZh();
    chip(s, 30, 20, 360, 45, zh ? "供应链攻击面与隐蔽执行路径" : "Supply Chain Execution Surface", COL.teal, { size: 14 });
    rect(s, 30, 80, 170, 95, { fill: hex(COL.teal, 0.08), stroke: COL.teal });
    txt(s, 40, 105, zh ? "嵌套依赖混淆" : "Nested Dependency", { size: 13, weight: 700, col: COL.teal });
    txt(s, 40, 130, zh ? "SKILL.md 干净" : "SKILL.md is clean", { size: 12 });
    txt(s, 40, 155, zh ? "pull yutube-dl-core" : "pulls typosquatted pkg", { size: 11, col: COL.red });
    rect(s, 220, 80, 170, 95, { fill: hex(COL.red, 0.08), stroke: COL.red });
    txt(s, 230, 105, zh ? "配置钩子劫持" : "Config Hook RCE", { size: 13, weight: 700, col: COL.red });
    txt(s, 230, 130, zh ? "CVE-2025-59536" : "Claude Code CVE", { size: 12 });
    txt(s, 230, 155, zh ? ".claude/settings.json" : "settings.json hooks RCE", { size: 11, col: COL.red });
    arrow(s, 115, 175, 115, 210);
    arrow(s, 305, 175, 305, 210);
    chip(s, 30, 210, 360, 145, zh ? "【供应链防御体系】\n\n1. 不可变哈希锁定：pip-compile --generate-hashes\n2. 注册表 Merkle 树透明度日志包含证明\n3. 递归依赖树扫描，杜绝仅做表层审计\n4. 将 hooks / settings.json 视作可执行代码准入" : "【Supply Chain Defenses】\n\n1. Immutable hash pinning (pip-compile hashes)\n2. Merkle transparency inclusion proofs\n3. Recursive dependency scanning (not just surface)\n4. Treat config hooks / settings as executable code", COL.blue, { size: 12 });
  }

  /* 5. AST03 */
  function drawAST03(host) {
    const s = scene(host, 420, 380);
    const zh = isZh();
    chip(s, 30, 20, 360, 45, zh ? "特权爆炸与 LPCI 逻辑层提示控制注入" : "Privilege Explosion & LPCI Injection", COL.orange, { size: 13 });
    rect(s, 30, 80, 360, 120, { fill: hex(COL.orange, 0.08), stroke: COL.orange });
    txt(s, 45, 105, zh ? "【LPCI 漏洞机理】(arXiv:2507.10457 / 2603.17239)" : "【LPCI Mechanism】(arXiv:2507.10457)", { size: 12, weight: 700, col: COL.orange });
    txt(s, 45, 130, zh ? "低特权输入 ➔ 嵌入延迟/条件触发 Payload ➔" : "Low-privilege Input ➔ Delayed/Conditional Payload ➔", { size: 11 });
    txt(s, 45, 155, zh ? "模型将工具输出误判为【操作员指令】➔" : "Model treats tool output as Operator Command ➔", { size: 11, col: COL.red });
    txt(s, 45, 180, zh ? "自主调用 manage_database 清空库 / 读 ~/.env" : "Autonomously executes DROP TABLE / reads ~/.env", { size: 11, col: COL.red, weight: 700 });
    arrow(s, 210, 200, 210, 230);
    chip(s, 30, 230, 360, 130, zh ? "【特权收敛防御】\n\n1. 严格指令分层：系统 > 操作员 > 用户 > 工具数据\n2. 细粒度域名网络白名单 (deny: \"*\")\n3. 显式保护 SOUL.md / MEMORY.md 拒绝写\n4. 破坏性操作强制人工二次确认 (HITL)" : "【Least Privilege Defenses】\n\n1. Strict Instruction Hierarchy (System > Operator > Tool)\n2. Scoped network domain allowlists (deny: \"*\")\n3. Explicit deny_write on SOUL.md / MEMORY.md\n4. Mandatory human confirmation for destructive ops", COL.green, { size: 12 });
  }

  /* 6. AST04 */
  function drawAST04(host) {
    const s = scene(host, 420, 380);
    const zh = isZh();
    chip(s, 30, 20, 360, 45, zh ? "不安全元数据与反序列化 RCE 风险" : "Insecure Metadata & Deserialization RCE", COL.grape, { size: 13 });
    rect(s, 30, 80, 360, 115, { fill: hex(COL.grape, 0.08), stroke: COL.grape });
    txt(s, 45, 105, zh ? "【元数据双重攻击面】" : "【Dual Metadata Attack Surface】", { size: 13, weight: 700, col: COL.grape });
    txt(s, 45, 130, zh ? "1. 语义欺骗：仿冒 Google Calendar、瞒报权限" : "1. Semantic: Brand impersonation, understated perms", { size: 12 });
    txt(s, 45, 155, zh ? "2. 反序列化RCE：YAML !!python/object 执行代码" : "2. Parser: YAML !!python/object executes os.system()", { size: 12, col: COL.red });
    txt(s, 45, 180, zh ? "3. 字符走私：ASCII 走私 / 零宽字符绕过人工审查" : "3. Smuggling: Zero-width Unicode hides instructions", { size: 12 });
    arrow(s, 210, 195, 210, 225);
    chip(s, 30, 225, 360, 135, zh ? "【元数据防御准则】\n\n1. 强制使用 yaml.safe_load 禁用构造执行\n2. 基于 JSON Schema / Pydantic 强类型白名单验证\n3. 在独立低权限子进程中解析清单\n4. 规范化 Unicode (NFKC) 剔除所有不可见走私字符" : "【Metadata Defenses】\n\n1. Enforce yaml.safe_load (disable constructor tags)\n2. Strict JSON Schema / Pydantic model validation\n3. Parse manifests in least-privilege subprocess\n4. Normalize Unicode (NFKC) & strip zero-width chars", COL.teal, { size: 12 });
  }

  /* 7. AST05 */
  function drawAST05(host) {
    const s = scene(host, 420, 380);
    const zh = isZh();
    chip(s, 30, 20, 360, 45, zh ? "外部指令可变性与多模型中继放大" : "External Doc Rug-Pull & Relay Amplification", COL.red, { size: 13 });
    rect(s, 30, 80, 360, 115, { fill: hex(COL.red, 0.08), stroke: COL.red });
    txt(s, 45, 105, zh ? "【指令漂移与中继攻击】" : "【Instruction Drift & Relay Attacks】", { size: 13, weight: 700, col: COL.red });
    txt(s, 45, 130, zh ? "▸ 作者跑路 (Rug-Pull)：审核通过后修改远端文档" : "▸ Author Rug-Pull: Editing remote docs post-audit", { size: 12 });
    txt(s, 45, 155, zh ? "▸ 审查诱饵 (Bait-and-Switch)：对扫描器与Agent返回不同内容" : "▸ Bait-and-Switch: Clean to scanner, toxic to agent", { size: 12 });
    txt(s, 45, 180, zh ? "▸ 中继放大：链式调用中较弱模型将数据误当指令" : "▸ Relay Amplification: Weak backbone model runs payload", { size: 12, col: COL.red });
    arrow(s, 210, 195, 210, 225);
    chip(s, 30, 225, 360, 135, zh ? "【外部内容约束防御】\n\n1. 哈希锁定：校验外部文档 sha256 摘要防篡改\n2. 文档内联：发布时将参考文档快照嵌入签名包\n3. 限制抓取域名白名单 (Universal Skill Format)\n4. 严格隔离：外部检索数据仅作参考，严禁覆盖指令" : "【External Reference Defenses】\n\n1. Content hash pinning for referenced URLs\n2. Snapshot inlining into signed skill packages\n3. Restrict fetches to vetted domain allowlists\n4. Isolate retrieved content as untrusted reference data", COL.blue, { size: 12 });
  }

  /* 8. AST06 */
  function drawAST06(host) {
    const s = scene(host, 420, 380);
    const zh = isZh();
    chip(s, 30, 20, 360, 45, zh ? "弱隔离宿主逃逸 vs 默认容器沙箱" : "Weak Isolation Escape vs Container Sandbox", COL.cyan, { size: 13 });
    rect(s, 30, 80, 170, 105, { fill: hex(COL.red, 0.08), stroke: COL.red });
    txt(s, 40, 105, zh ? "【默认宿主模式】" : "【Default Host Mode】", { size: 12, weight: 700, col: COL.red });
    txt(s, 40, 130, zh ? "13.5万公网暴露" : "135k Exposed instances", { size: 11 });
    txt(s, 40, 150, zh ? "Localhost WebSocket" : "Loopback bypass (7.5)", { size: 11 });
    txt(s, 40, 170, zh ? "写 Cron 逃逸宿主" : "Plants host cron jobs", { size: 11, col: COL.red });
    rect(s, 220, 80, 170, 105, { fill: hex(COL.green, 0.08), stroke: COL.green });
    txt(s, 230, 105, zh ? "【强制容器隔离】" : "【Mandatory Sandbox】", { size: 12, weight: 700, col: COL.green });
    txt(s, 230, 130, zh ? "Docker microVM" : "Docker microVM container", { size: 11 });
    txt(s, 230, 150, zh ? "--network=none" : "--network=none, read-only", { size: 11 });
    txt(s, 230, 170, zh ? "seccomp 削减特权" : "seccomp syscall filter", { size: 11, col: COL.green });
    arrow(s, 115, 185, 115, 215);
    arrow(s, 305, 185, 305, 215);
    chip(s, 30, 215, 360, 145, zh ? "【隔离加固三要素】\n\n1. 默认容器化执行，主机运行需显式高危确认\n2. 应用严格 seccomp 配置文件与 --cap-drop=ALL\n3. Localhost 控制接口实施密钥握手与速率限制\n4. 限制热重载覆盖，禁止工作区无感遮蔽内置技能" : "【Isolation Hardening Pillars】\n\n1. Container isolation by default; host-mode requires opt-in\n2. Strict seccomp profiles & --cap-drop=ALL\n3. Authenticate & rate-limit localhost WebSocket clients\n4. Restrict workspace precedence & hot-reload shadowing", COL.indigo, { size: 12 });
  }

  /* 9. AST07 */
  function drawAST07(host) {
    const s = scene(host, 420, 380);
    const zh = isZh();
    chip(s, 30, 20, 360, 45, zh ? "更新漂移陷阱 vs 不可变版本锁定" : "Update Drift Traps vs Immutable Pinning", COL.yellow, { size: 13 });
    rect(s, 30, 80, 360, 115, { fill: hex(COL.yellow, 0.08), stroke: COL.yellow });
    txt(s, 45, 105, zh ? "【漂移风险模型】" : "【Drift Threat Model】", { size: 13, weight: 700, col: COL.yellow });
    txt(s, 45, 130, zh ? "▸ 补丁滞后：35.4% 部署因未修补长期处于 RCE 险境" : "▸ Patch Lag: 35.4% instances vulnerable to RCE", { size: 12 });
    txt(s, 45, 155, zh ? "▸ 恶意自动更新：作者被黑推送带毒 v2.0 静默上线" : "▸ Malicious Auto-Update: Hijacked author pushes toxic v2.0", { size: 12 });
    txt(s, 45, 180, zh ? "▸ 热重载滥用：本地文件被篡改 mid-session 立即生效" : "▸ Hot-Reload Abuse: Modifying SKILL.md mid-session", { size: 12, col: COL.red });
    arrow(s, 210, 195, 210, 225);
    chip(s, 30, 225, 360, 135, zh ? "【不可变更新策略】\n\n1. 强制 sha256 唯一哈希锁定，拒绝模糊版本范围\n2. 每次升级强校验密码学数字签名\n3. 生产环境开启【冻结模式】(Freeze Mode)\n4. 建立安装技能版本、哈希与校验时间的全量清单" : "【Immutable Update Policies】\n\n1. Pin installed skills to sha256 hashes (no loose ranges)\n2. Cryptographic signature verification on every update\n3. Enable production Freeze Mode (disable hot-reload)\n4. Maintain fleet inventory of versions, hashes & scan timestamps", COL.green, { size: 12 });
  }

  /* 10. AST08 */
  function drawAST08(host) {
    const s = scene(host, 420, 380);
    const zh = isZh();
    chip(s, 30, 20, 360, 45, zh ? "传统扫描盲区 vs NVIDIA SkillSpector 多层扫描" : "Traditional Scanning Gaps vs NVIDIA SkillSpector", COL.pink, { size: 13 });
    rect(s, 30, 80, 170, 105, { fill: hex(COL.red, 0.08), stroke: COL.red });
    txt(s, 40, 105, zh ? "【传统扫描破防】" : "【Traditional Scanner Gaps】", { size: 12, weight: 700, col: COL.red });
    txt(s, 40, 130, zh ? "自然语言免杀" : "Pure Natural-Language", { size: 11 });
    txt(s, 40, 150, zh ? "10万换行截断" : "100k Newline truncation", { size: 11 });
    txt(s, 40, 170, zh ? ".pyc 字节码投毒" : ".pyc bytecode hidden logic", { size: 11, col: COL.red });
    rect(s, 220, 80, 170, 105, { fill: hex(COL.green, 0.08), stroke: COL.green });
    txt(s, 230, 105, zh ? "【多层立体检测】" : "【SkillSpector Multi-Tier】", { size: 12, weight: 700, col: COL.green });
    txt(s, 230, 130, zh ? "AST 语法污点分析" : "AST Taint Tracking", { size: 11 });
    txt(s, 230, 150, zh ? "YARA 规则匹配" : "YARA Pattern Rules", { size: 11 });
    txt(s, 230, 170, zh ? "LLM 语义意图裁判" : "LLM Semantic Evaluation", { size: 11, col: COL.green });
    arrow(s, 115, 185, 115, 215);
    arrow(s, 305, 185, 305, 215);
    chip(s, 30, 215, 360, 145, zh ? "【全覆盖扫描防护准则】\n\n1. 语法级 Shell 解析：解析参数展开防 c\'\'url 绕过\n2. Unicode 规范化 (NFKC) 剥离零宽与双向控制字符\n3. 完整目录穿透：扫描 .pyc / .docx，超限判 INCOMPLETE\n4. 结合 Agent Threat Rules (ATR) 共享威胁特征" : "【Full Coverage Scanning Principles】\n\n1. Shell grammar parsing (resolves parameter expansion)\n2. Unicode NFKC normalization & zero-width stripping\n3. Exhaustive directory scan (.pyc / .docx), flag INCOMPLETE\n4. Integrate Agent Threat Rules (ATR) open indicators", COL.grape, { size: 12 });
  }

  /* 11. AST09 */
  function drawAST09(host) {
    const s = scene(host, 420, 380);
    const zh = isZh();
    chip(s, 30, 20, 360, 45, zh ? "企业影子 AI 风险 vs 双向凭证审计模式" : "Shadow AI Gaps vs Bilateral Receipt Pattern", COL.indigo, { size: 13 });
    rect(s, 30, 80, 170, 100, { fill: hex(COL.indigo, 0.08), stroke: COL.indigo });
    txt(s, 40, 105, zh ? "【准入凭证 Admission】" : "【Admission Receipt】", { size: 12, weight: 700, col: COL.indigo });
    txt(s, 40, 128, zh ? "▸ attempt_id & agent_id" : "▸ attempt_id & agent_id", { size: 11 });
    txt(s, 40, 148, zh ? "▸ 作用域与决策 (ALLOW)" : "▸ scope & decision (ALLOW)", { size: 11 });
    txt(s, 40, 168, zh ? "▸ 数字签名 over 规范字段" : "▸ Signature over payload", { size: 11 });
    rect(s, 220, 80, 170, 100, { fill: hex(COL.teal, 0.08), stroke: COL.teal });
    txt(s, 230, 105, zh ? "【结果凭证 Outcome】" : "【Outcome Receipt】", { size: 12, weight: 700, col: COL.teal });
    txt(s, 230, 128, zh ? "▸ attempt_id 关联键" : "▸ attempt_id join key", { size: 11 });
    txt(s, 230, 148, zh ? "▸ action_ref 内容哈希" : "▸ action_ref content hash", { size: 11 });
    txt(s, 230, 168, zh ? "▸ 状态 COMMITTED" : "▸ state: COMMITTED / FAIL", { size: 11 });
    arrow(s, 200, 130, 220, 130, { stroke: COL.accent });
    arrow(s, 115, 180, 115, 210);
    arrow(s, 305, 180, 305, 210);
    chip(s, 30, 210, 360, 150, zh ? "【治理与 EU AI Act 合规价值】\n\n1. 集中资产清单：纳管所有技能至企业 CMDB/CASB\n2. 双向关联防篡改：准入与结果凭据由密码学签名绑定\n3. 因果链回溯：支持 parent_action_ref 追踪多 Agent 调用\n4. 满足欧盟《AI 法案》第 12 条高风险 AI 自动日志要求" : "【Governance & EU AI Act Value】\n\n1. Centralized Inventory in enterprise CMDB/CASB\n2. Bilateral tamper-evident cryptographic receipts\n3. Causal chain tracking via parent_action_ref\n4. Supports EU AI Act Article 12 automatic logging rules", COL.blue, { size: 12 });
  }

  /* 12. AST10 */
  function drawAST10(host) {
    const s = scene(host, 420, 380);
    const zh = isZh();
    chip(s, 30, 20, 360, 45, zh ? "跨平台清单剥离 vs 通用技能格式 (USF v1.0)" : "Manifest Stripping vs Universal Skill Format", COL.green, { size: 13 });
    rect(s, 30, 80, 360, 115, { fill: hex(COL.green, 0.08), stroke: COL.green });
    txt(s, 45, 105, zh ? "【跨生态迁移失控痛点】" : "【Cross-Platform Security Loss】", { size: 13, weight: 700, col: COL.green });
    txt(s, 45, 130, zh ? "OpenClaw ➔ Claude Code ➔ Cursor ➔ VS Code" : "OpenClaw ➔ Claude Code ➔ Cursor ➔ VS Code", { size: 12, weight: 700 });
    txt(s, 45, 155, zh ? "▸ 迁移导致安全元数据被剥离，目标端默认继承全权限" : "▸ Porting drops manifests, inheriting wide default access", { size: 11, col: COL.red });
    txt(s, 45, 180, zh ? "▸ 跨市场套利：低门槛市场刷虚假信誉转战高信任平台" : "▸ Cross-registry arbitrage creates false trust signals", { size: 11 });
    arrow(s, 210, 195, 210, 225);
    chip(s, 30, 225, 360, 135, zh ? "【通用技能格式 (USF v1.0) 核心规范】\n\n1. did:web 发布者去中心化身份锚点与签名\n2. 默认写保护：deny_write: [SOUL.md, MEMORY.md]\n3. 域名级出站白名单：network.allow + deny: \"*\"\n4. 独立 risk_tier 评估与 canonical content_hash 绑定" : "【Universal Skill Format (USF v1.0) Pillars】\n\n1. did:web decentralized identity & Ed25519 signatures\n2. Default deny_write on SOUL.md & MEMORY.md\n3. Domain allowlists (network.allow) with default deny: \"*\"\n4. Independent risk_tier validation & canonical content_hash", COL.accent, { size: 12, fill: hex(COL.accent, 0.15) });
  }

  /* 13. MAESTRO Matrix Mindmap */
  function drawMaestroMatrix(host) {
    const s = scene(host, 880, 520);
    const zh = isZh();
    chip(s, 280, 15, 320, 45, zh ? "CSA MAESTRO 7 层架构与 AST Top 10 全景映射" : "CSA MAESTRO 7 Layers vs OWASP AST Top 10", COL.grape, { size: 15, weight: 700 });
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
      const y = 75 + idx * 60;
      rect(s, 50, y, 780, 50, { fill: hex(l.col, 0.08), stroke: l.col, strokeWidth: 1.8 });
      chip(s, 60, y + 6, 50, 38, l.id, l.col, { size: 14, weight: 700 });
      txt(s, 125, y + 30, l.name, { size: 14, weight: 700, col: l.col });
      txt(s, 480, y + 30, l.asts, { size: 13, weight: 600, col: COL.ink });
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

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(renderAll, 100);
  });

  document.addEventListener("ast:lang", () => {
    setTimeout(renderAll, 50);
  });
})();
