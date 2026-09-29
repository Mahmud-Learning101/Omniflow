# OmniFlow Prompt Playbook & Non-Coder Operating Manual
### *How to Steer AI to Build and Maintain Production Software Without Writing Semicolons*

---

## 🎯 1. The Conductor's Mindset
You do not need to memorize programming syntax. **You are the Chief Product Officer / Conductor; the AI is your Senior Engineering Staff.**

Your job is to provide:
1. **Clear Context** (where the code lives, what data structures exist).
2. **Strict Guardrails** (what the AI is NOT allowed to do).
3. **Verification Criteria** (how we prove the code works).

---

## 📐 2. The Universal C-A-S-E Prompt Formula
Whenever you give an instruction to build or modify any component, use this exact 4-part structure:

* **[C] CONTEXT**: State the exact file being created/modified and what configs it imports.
* **[A] ACTION**: Describe the user interaction, visual behavior, or logic needed.
* **[S] CONSTRAINTS**: Non-negotiable limits:
  * Maximum 150 lines per file (refactor if larger).
  * Zero hardcoded text/prices (read from `src/config/site.ts`).
  * Pure TypeScript with strict typing (no `any`).
* **[E] EVALUATION**: Automated proof:
  * Run `npx tsc --noEmit` (zero errors).
  * Run `npx playwright test` (all tests pass green).

---

## 🔄 3. The 4-Step Self-Healing Debugging Protocol
When you encounter a bug or error, **never say "it's broken, fix it."** Instead, copy-paste this prompt:

```text
[CONTEXT]: An error occurred during verification.
[ERROR LOG]: 
<PASTE TERMINAL OR CONSOLE ERROR HERE>

[ACTION]:
1. Identify the exact root cause of this error.
2. Check if a null/undefined check or schema validation was missed.
3. Apply the minimal surgical fix to resolve the error.
4. Run `npx tsc --noEmit` and the relevant Playwright test to prove the fix works without regressions.
```

---

## 🛡️ 4. The 5 Non-Negotiable Rules of the Project
1. **The 150-Line Rule**: If a file exceeds 150 lines, split it into smaller atomic components in `src/components/ui/`.
2. **Zero Hardcoded Strings**: Every headline, badge, price, and color token must live in `src/config/`.
3. **Compile-Check Every Step**: Run `npx tsc --noEmit` after every single feature.
4. **Automated Test Coverage**: Every interactive feature must have a corresponding test in `tests/e2e/`.
5. **Git Branch Discipline**: Always test experimental features on a separate branch before merging.
