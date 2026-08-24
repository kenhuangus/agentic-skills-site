# OWASP Agentic Skills Top 10 (AST01–AST10) · Interactive Presentation Deck

> **The Definitive Threat Modeling & Security Framework for Agentic AI Skills, Memory & Tools (2026 Edition)**  
> Presented by **Ken Huang, CISSP** · OWASP AIVSS & Agentic Skills Top 10 Project Leader · Fellow & Co-Chair, CSA AI Safety Working Groups · CEO, DistributedApps.ai

---

## 🌐 Live Presentation Site
- **Live URL**: [https://kenhuangus.github.io/agentic-skills-site/#1](https://kenhuangus.github.io/agentic-skills-site/#1)
- **OWASP Official Repository**: [https://github.com/OWASP/www-project-agentic-skills-top-10](https://github.com/OWASP/www-project-agentic-skills-top-10)
- **Video Walkthrough Tutorial**: [https://www.youtube.com/@KenHuang-h2n](https://www.youtube.com/@KenHuang-h2n)

---

## 🎯 20 Masterclass Slides Overview
1. **Title Hero**: OWASP Agentic Skills Top 10 (AST01–AST10) 2026 Edition
2. **About Speaker & Publications**: Ken Huang, CISSP bio, 7 Springer/Cambridge/Wiley book covers & contact card
3. **The Paradigm Shift**: Why Agentic Skills Require Dedicated Threat Modeling vs Traditional Packages
4. **Executive Risk Map**: 4 Security Quadrants (Sourcing & Trust, Execution Boundaries, Lifecycle Governance, Cross-Platform)
5. **Decision Tree & Triage**: 5-step deterministic finding triage flowchart
6. **AST01: Malicious Skills**: ClawHavoc (1,184 trojans), AMOS stealer, SOUL.md persistence & QSAF cognitive degradation
7. **AST02: Supply Chain Compromise**: Claude Code CVE-2025-59536 / CVE-2026-21852, nested dependency confusion & sha256 hash pinning
8. **AST03: Over-Privileged Skills**: Logic-layer Prompt Control Injection (LPCI), DROP TABLE wipe & Strict Instruction Hierarchy
9. **AST04: Insecure Metadata**: Brand impersonation, YAML deserialization RCE, ASCII smuggling & safe parsers
10. **AST05: Untrusted External Instructions**: Author rug-pull, reviewer bait-and-switch, relay-node amplification & content pinning
11. **AST06: Weak Isolation**: Host escape, 135k internet-facing OpenClaw instances, ClawJacked CVE-2026-32025 & Docker sandboxes
12. **AST07: Update Drift**: 35.4% patch lag RCE, silent malicious v2.0 auto-updates, rollback attacks & Freeze Mode
13. **AST08: Poor Scanning**: Natural language evasion, 100k newline truncation, .pyc bytecode poisoning & NVIDIA SkillSpector multi-tier scanning
14. **AST09: No Governance & Shadow AI**: 83% enterprise adoption vs 29% security readiness, Bilateral Receipts & EU AI Act Article 12
15. **AST10: Cross-Platform Reuse**: OpenAI autonomous sandbox escape, manifest stripping across OpenClaw/Claude/Cursor & USF standard
16. **Universal Agentic Skill Format v1.0**: Standardized YAML security specification with cryptographic content hash binding
17. **Bilateral Receipt Pattern & EU AI Act**: Admission Receipt (Gate) + Outcome Receipt (Execution Record) immutable audit architecture
18. **CSA MAESTRO 7-Layer Framework Mapping Matrix**: Layer 1–7 cross-walk table & hand-drawn architecture mindmap
19. **Project Leadership & Acknowledgements**: Ken Huang, Co-leaders, Reviewers, and Framework Mappings
20. **Connect & Next Steps**: QR contact card, GitHub repository, YouTube walkthrough & community links

---

## 🎨 Interactive Features
- **Bilingual Support (EN / 中文)**: Instant one-click toggle with persisted language preferences in `localStorage`.
- **Hand-Drawn Vector Diagrams**: High-contrast, Excalidraw-style diagrams rendered dynamically via `rough.js`.
- **Keyboard Navigation**:
  - `→` / `Space` / `PageDown`: Next slide
  - `←` / `PageUp`: Previous slide
  - `Home`: First slide
  - `End`: Last slide
  - `F`: Toggle Fullscreen
- **Touch & Mouse Support**: Mobile touch swipe gestures and debounced trackpad/mouse wheel scrolling.
- **Deep-linking & Hash Routing**: `#1` to `#20` persistent URL navigation.

---

## 💻 Local Preview
To preview locally:
```bash
cd C:\Users\kenhu\agentic-skills-site
python -m http.server 8080
```
Then visit `http://localhost:8080/#1` in your browser.

---

## 📜 License
Distributed under the **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)** and **MIT License**.
