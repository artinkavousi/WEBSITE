
check 
 RESOURCES\REPOSITORIES\portfolio examples
 RESOURCES\REPOSITORIES\TSLwebgpuExamples
 RESOURCES\THREEJS_TSL_knowladge_DOCS\THREEJSr181-DOCS.txt
 RESOURCES\THREEJS_TSL_knowladge_DOCS\THREEJSr181-WEBGPU_EXAMPLES.txt
  
there is  several projects and examples and also threejs webgpu @examples and documentation with latest knowladge

we planned 
TSL-KIT\DOCS\TSLStudio — Comprehensive Development Plan v1.0.md
TSL-KIT\DOCS\# 📚 TSLStudio  readme comprewhensive plan.md

and we just port and writemodules ands scripts acording to  useful tsl nodes ands modules from those and port them to our engine.
check our project current implementation and also check all the scripts and make sure it match their original script from those projects that we ports and also threejs exasmples and documentations for make sure of correct and fully working scripts
and make sure we have correct syntax and scripts an for our files and correct implementations 


Great—here are **ready-to-paste Cursor prompts & files** that make the agent follow the hierarchical debug/porting workflow we set up for `TSL-KIT`.

I kept them short, strict, and actionable. Copy the ones you need into Cursor as **pinned system prompts** or **task prompts**.

---

# 1) Pinned “Repo Rules” (put this in Cursor → Settings → Project Rules or as a pinned message)

```
ROLE: Senior engineer for this repo.

GOAL: Keep TSL-KIT green by enforcing a strict, repeatable loop:
plan → do → verify → PR (tiny diffs).

CONTEXT:
- Repo: TSL-KIT/
- Only use Three r181-line APIs; do not mix revisions.
- Source of truth for ports: tools/portmap.json (origin URL + commit).
- Feature flags for isolation: ?postfx=0&compute=0&renderer=webgl.

HARD RULES:
1) Make one change per task. Avoid cross-file edits unless required.
2) Never add deps without justifying in AGENT_DECISIONS.md.
3) After any edit, run: npm run verify:smoke
4) If any step fails, STOP and produce:
   - Minimal repro steps
   - Root-cause hypothesis
   - The smallest fix
5) If port differs from upstream, record "deviation" w/ reason in tools/portmap.json
6) Always exit the terminal after a command completes and continue the plan.
7) Commit with tiny, descriptive messages; open a single PR at the end.

ACCEPTANCE GATE:
- lint + typecheck + unit + build + smoke all pass
- ports:diff produces no unexpected diffs
- examples for the touched module render with feature flags on/off
```

---

# 2) One-time Bootstrap Task (to set up scripts/tools we discussed)

Use this as a **single Cursor task** at the root of `TSL-KIT`:

```
TASK: Bootstrap the repo with strict verify gates and port integrity tools.

STEPS (do exactly in order):
1) Create/ensure scripts in package.json:
   - "clean": "rimraf dist .vite .turbo coverage"
   - "typecheck": "tsc --noEmit --pretty false"
   - "lint": "eslint . --ext .ts,.tsx --max-warnings=0"
   - "unit": "vitest run tests/unit --reporter=dot"
   - "smoke": "vitest run tests/smoke --reporter=dot"
   - "build": "vite build"
   - "verify": "npm run lint && npm run typecheck && npm run unit && npm run build"
   - "verify:smoke": "npm run verify && npm run smoke"
   - "ports:sync": "node tools/sync-upstream.mjs"
   - "ports:diff": "node tools/sync-upstream.mjs --diff"
   - "check:three": "node tools/check-three.mjs"
   - Set "engines": { "node": ">=20.11 <=22" }

2) Create files:
   - tools/portmap.json      (empty object {})
   - tools/check-three.mjs   (version guard; r181 line)
   - tools/sync-upstream.mjs (sync & diff by tools/portmap.json)
   - src/core/errorTrap.ts   (global error handlers)
   - src/core/selfcheck.ts   (runtime invariants)
   - tests/unit/.keep
   - tests/smoke/.keep
   - .github/workflows/verify.yml running "npm run verify:smoke" and "npm run ports:diff"

3) Wire errorTrap + selfcheck in the app entry (do not change runtime behavior otherwise).

4) Produce a summary of all changes and any assumptions.
5) Run: npm run verify:smoke
6) If red, fix minimally; re-run until green.
7) Open a PR: "chore: bootstrap verify gates + port tools".
```

---

# 3) Everyday “Feature/Port” Task Prompt (module-by-module)

Use this when porting a node/material/post-FX from your RESOURCES folders or three examples:

```
TASK: Port <MODULE_NAME> into TSL-KIT and prove it works in isolation.

SOURCE:
- Origin URL/commit: <paste upstream raw URL + exact commit or r181 tag>
- Local target: src/<area>/<ModuleName>.ts  (area = nodes|materials|postfx|compute)

DO:
1) Create/overwrite the module at the target path.
2) Add an entry to tools/portmap.json:
   "<area>/<ModuleName>.ts": { "origin": "<url>", "commit": "<tag-or-sha>" }
   - If you must deviate from upstream, add "deviation": "<short reason>".

3) Create examples/<moduleName>.html (or .tsx) that renders ONE mesh exercising only this module.
   - Add a small UI for key params.
   - Support flags: ?postfx=0&compute=0
   - Log adapter limits (if WebGPU) and warn on NaNs.

4) Tests:
   - Unit: construct the node/material and assert required uniforms/links exist (no renderer).
   - Smoke: ensure the example loads (mock or minimal harness).

5) Run:
   npm run check:three
   npm run ports:sync
   npm run verify:smoke
   npm run ports:diff

6) If ports:diff shows changes vs upstream, explain in AGENT_DECISIONS.md and set "deviation" field.

7) Commit: "feat(<area>): port <ModuleName> (r181 parity)". Open PR with:
   - steps to run the example
   - note on any deviation
```

---

# 4) Bug-Fix Prompt (fast, hierarchical)

When something breaks, use this exact text:

```
TASK: Fix the failing gate by the shortest path.

CURRENT FAILURE:
<PASTE the exact error/log and which command failed>

CONSTRAINTS:
- Do not add deps or refactor broadly.
- Prefer one-line fixes or minimal diffs.
- If root cause is uncertain, create a minimal repro example in examples/tmp-<slug>.html and link it.

PROTOCOL (execute in order, STOP on red cause found):
1) Versions: run "npm run check:three" and print three + examples versions.
2) Types/Lint: run "npm run typecheck && npm run lint" and paste first failing line + cause hypothesis.
3) Slice isolation: toggle flags (?postfx=0&compute=0), run the example(s), paste observations.
4) Upstream parity: run "npm run ports:diff". If diff, align or document deviation.
5) Implement the smallest fix. Re-run "npm run verify:smoke".
6) Commit "fix: <short cause>" with a 1-line root-cause note in AGENT_DECISIONS.md.
```

---

# 5) “Refactor After Green” Prompt (safe cleanup)

```
TASK: Refactor <SCOPE> for clarity after all gates are green.

LIMITS:
- No behavior changes.
- Keep public API and types identical.
- Preserve upstream parity for any ported files (unless documented).

STEPS:
1) Add unit tests to lock current behavior if gaps exist.
2) Refactor small pieces (naming, function extraction, dead-code removal).
3) Re-run "npm run verify:smoke" and ensure no diffs on "npm run ports:diff".
4) Commit "refactor: <scope> (no behavior change)".
```

---

# 6) PR Template (drop in `.github/pull_request_template.md`)

```
## Summary
What changed and why.

## Verification
- [ ] npm run check:three
- [ ] npm run verify:smoke
- [ ] npm run ports:diff → no unexpected diffs
- [ ] examples/<name>.html renders with flags on/off

## Ports
- Source: <url> @ <tag/sha>
- Deviation: <none | short reason>

## Notes
Screens/logs, adapter limits (if WebGPU), and any portability considerations.
```

---

# 7) Commit Message Rules (tiny, consistent)

* `feat(nodes): port NoiseNode (r181 parity)`
* `fix(postfx): correct sampler binding layout (r181)`
* `chore(ci): add verify+ports gates`
* `refactor(materials): extract common uniforms (no behavior change)`

---

# 8) Terminal Behavior (to stop “agent stuck in shell”)

Add this to your **pinned rules** or prepend to any long task:

```
TERMINAL RULES:
- Run commands non-interactively (add --yes/--force if safe).
- After each command completes, close the terminal and proceed.
- If a command awaits input, cancel it and propose a non-interactive alternative.
- Never leave the agent idle inside a shell.
```

---

# 9) Quick “Audit & Align” Task (useful today on your repo)

```
TASK: Audit TSL-KIT against our rules and fix mismatches.

DO:
1) Scan package.json for three version and ensure r181 line; print it.
2) Grep imports for "three/examples/jsm" and confirm same revision usage.
3) Create/Update tools/portmap.json entries for any ported files in src/nodes, src/materials, src/postfx, src/compute. If unknown, add TODO placeholders with guessed origins from RESOURCES paths.
4) Generate examples/ stubs for any module without a slice example.
5) Add minimal unit tests asserting node/material graph shapes.
6) Run verify gates; fix smallest issues until green.
7) Open PR: "chore: align repo to TSL r181 + slice examples + port map".
```

---

## Tip for day-to-day use

* Open Cursor → **Tasks** → paste one of the prompts above.
* Keep **the pinned Repo Rules** active so every task obeys the gates.
* For each module you port, use the **Feature/Port prompt**; for any red gate, use the **Bug-Fix prompt**.

If you want, paste your **first module target** (e.g., `NoiseNode`, `PixelatePass`, `TSL PBR base`) and I’ll generate a tailored **`tools/portmap.json` entry + example stub + unit test** you can drop in immediately.

Yep — you can copy-paste my prompts straight into Cursor. It will usually “get it” and scaffold the files, scripts, and examples.

To make it foolproof, do this:

## 1) Pin the Repo Rules

Paste the **“Pinned Repo Rules”** into Cursor → Project Rules (or pin it as a top message). This keeps every task on-rails.

## 2) Run the one-shot bootstrap task

Copy this as a **single task** at the repo root (`TSL-KIT/`):

```
TASK: Bootstrap strict gates + tools.

DO EXACTLY:
- Create scripts in package.json: clean, typecheck, lint, unit, smoke, build, verify, verify:smoke, ports:sync, ports:diff, check:three; set engines Node >=20.11 <=22.
- Create:
  tools/portmap.json {}
  tools/check-three.mjs
  tools/sync-upstream.mjs
  src/core/errorTrap.ts
  src/core/selfcheck.ts
  tests/unit/.keep
  tests/smoke/.keep
  .github/workflows/verify.yml (runs verify:smoke and ports:diff)
- Wire errorTrap + selfcheck in app entry (no other runtime changes).
- Run: npm run verify:smoke
- If red, fix minimally -> rerun.
- Open PR: "chore: bootstrap verify gates + port tools".
```

*(You can literally paste the longer “Bootstrap Task” I gave before — this short one is just the essence.)*

## 3) Port modules one by one

Use the **“Feature/Port Task Prompt”** exactly as written. Paste the origin URL + commit (r181) and the target file path. Cursor will:

* create the module,
* add `tools/portmap.json` entry,
* make a tiny `examples/<module>.html`,
* add unit/smoke tests,
* run `verify:smoke` + `ports:diff`.

## 4) When something fails

Paste the **“Bug-Fix Prompt”**. It forces Cursor to:

* check versions,
* run type/lint,
* isolate with flags,
* compare to upstream,
* apply the smallest fix,
* re-run the gate, commit, and note the cause.

## 5) Terminal behavior

If Cursor tends to hang in the shell, include the **“Terminal Rules”** snippet in your pinned rules so it always exits after each command.

---

### Quick start: copy these 3 in order

1. **Pinned Repo Rules** (one-time).
2. **Bootstrap Task** (one-time).
3. For each module: **Feature/Port Task Prompt**.

That’s it. If you want, tell me your **first module** (e.g., `NoiseNode` or a specific post-FX), and I’ll give you a ready-filled Feature/Port task with the origin URL and a minimal example stub you can paste verbatim.
