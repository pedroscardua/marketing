---
name: figma-use
description: "**MANDATORY prerequisite** — you MUST invoke this skill BEFORE every `use_figma` tool call. NEVER call `use_figma` directly without loading this skill first. Skipping it causes common, hard-to-debug failures. Trigger whenever the user wants to perform a write action or a unique read action that requires JavaScript execution in the Figma file context — e.g. create/edit/delete nodes, set up variables or tokens, build components and variants, modify auto-layout or fills, bind variables to properties, or inspect file structure programmatically."
disable-model-invocation: false
---

# use_figma — Figma Plugin API Skill

Use the `use_figma` tool to execute JavaScript in Figma files via the Plugin API. All detailed reference docs live in `references/`.

**Always pass `skillNames: "figma-use"` when calling `use_figma`.** This is a logging parameter used to track skill usage — it does not affect execution.

**If the task involves building or updating a full page, screen, or multi-section layout in Figma from code**, also load [figma-generate-design](../figma-generate-design/SKILL.md). It provides the workflow for discovering design system components via `search_design_system`, importing them, and assembling screens incrementally. Both skills work together: this one for the API rules, that one for the screen-building workflow.

Before anything, load [plugin-api-standalone.index.md](references/plugin-api-standalone.index.md) to understand what is possible. When you are asked to write plugin API code, use this context to grep [plugin-api-standalone.d.ts](references/plugin-api-standalone.d.ts) for relevant types, methods, and properties. This is the definitive source of truth for the API surface. It is a large typings file, so do not load it all at once, grep for relevant sections as needed.

IMPORTANT: Whenever you work with design systems, start with [working-with-design-systems/wwds.md](references/working-with-design-systems/wwds.md) to understand the key concepts, processes, and guidelines for working with design systems in Figma. Then load the more specific references for components, variables, text styles, and effect styles as needed.

## 1. Critical Rules

1.  **Use `return` to send data back.** The return value is JSON-serialized automatically (objects, arrays, strings, numbers). Do NOT call `figma.closePlugin()` or wrap code in an async IIFE — this is handled for you.
2.  **Write plain JavaScript with top-level `await` and `return`.** Code is automatically wrapped in an async context. Do NOT wrap in `(async () => { ... })()`.
3.  `figma.notify()` **throws "not implemented"** — never use it
3a. `getPluginData()` / `setPluginData()` are **not supported** in `use_figma` — do not use them. Use `getSharedPluginData()` / `setSharedPluginData()` instead (these ARE supported), or track node IDs by returning them and passing them to subsequent calls.
4.  `console.log()` is NOT returned — use `return` for output
5.  **Work incrementally in small steps.** Break large operations into multiple `use_figma` calls. Validate after each step. This is the single most important practice for avoiding bugs.
6.  Colors are **0–1 range** (not 0–255): `{r: 1, g: 0, b: 0}` = red
7.  Fills/strokes are **read-only arrays** — clone, modify, reassign
8.  Font **MUST** be loaded before any text operation: `await figma.loadFontAsync({family, style})`. Use `await figma.listAvailableFontsAsync()` to discover all available fonts and their exact style strings — if a `loadFontAsync` call fails, call `listAvailableFontsAsync()` to find the correct style name or pick a fallback.
9.  **Pages load incrementally** — use `await figma.setCurrentPageAsync(page)` to switch pages and load their content. The sync setter `figma.currentPage = page` does **NOT** work and will throw (see Page Rules below)
10. `setBoundVariableForPaint` returns a **NEW** paint — must capture and reassign
11. `createVariable` accepts collection **object or ID string** (object preferred)
12. **`layoutSizingHorizontal/Vertical = 'FILL'` MUST be set AFTER `parent.appendChild(child)`** — setting before append throws. Same applies to `'HUG'` on non-auto-layout nodes.
13. **Position new top-level nodes away from (0,0).** Nodes appended directly to the page default to (0,0). Scan `figma.currentPage.children` to find a clear position (e.g., to the right of the rightmost node). This only applies to page-level nodes — nodes nested inside other frames or auto-layout containers are positioned by their parent.
14. **On `use_figma` error, STOP. Do NOT immediately retry.** Failed scripts are **atomic** — if a script errors, it is not executed at all and no changes are made to the file. Read the error message carefully, fix the script, then retry.
15. **MUST `return` ALL created/mutated node IDs.** Whenever a script creates new nodes or mutates existing ones on the canvas, collect every affected node ID and return them in a structured object (e.g. `return { createdNodeIds: [...], mutatedNodeIds: [...] }`). This is essential for subsequent calls to reference, validate, or clean up those nodes.
16. **Always set `variable.scopes` explicitly when creating variables.** The default `ALL_SCOPES` pollutes every property picker — almost never what you want. Use specific scopes like `["FRAME_FILL", "SHAPE_FILL"]` for backgrounds, `["TEXT_FILL"]` for text colors, `["GAP"]` for spacing, etc.
17. **`await` every Promise.** Never leave a Promise unawaited — unawaited async calls will fire-and-forget, causing silent failures or race conditions.

## 2. Page Rules (Critical)

**Page context resets between `use_figma` calls** — `figma.currentPage` starts on the first page each time.

### Switching pages

Use `await figma.setCurrentPageAsync(page)` to switch pages and load their content. The sync setter `figma.currentPage = page` does **NOT work** — it throws `"Setting figma.currentPage is not supported"` in `use_figma`. Always use the async method.

```js
// Switch to a specific page (loads its content)
const targetPage = figma.root.children.find((p) => p.name === "My Page");
await figma.setCurrentPageAsync(targetPage);
// targetPage.children is now populated

// Iterate over all pages
for (const page of figma.root.children) {
  await figma.setCurrentPageAsync(page);
  // page.children is now loaded — read or modify them here
}
```

### Across script runs

`figma.currentPage` resets to the **first page** at the start of each `use_figma` call. If your workflow spans multiple calls and targets a non-default page, call `await figma.setCurrentPageAsync(page)` at the start of each invocation.

## 3. `return` Is Your Output Channel

The agent sees **ONLY** the value you `return`. Everything else is invisible.

- **Returning IDs (CRITICAL)**: Every script that creates or mutates canvas nodes **MUST** return all affected node IDs — e.g. `return { createdNodeIds: [...], mutatedNodeIds: [...] }`. This is a hard requirement, not optional.
- **Progress reporting**: `return { createdNodeIds: [...], count: 5, errors: [] }`
- **Error info**: Thrown errors are automatically captured and returned — just let them propagate or `throw` explicitly.
- `console.log()` output is **never** returned to the agent
- Always return actionable data (IDs, counts, status) so subsequent calls can reference created objects

## 4. Editor Mode

`use_figma` works in **design mode** (editorType `"figma"`, the default). FigJam (`"figjam"`) has a different set of available node types — most design nodes are blocked there.

Available in design mode: Rectangle, Frame, Component, Text, Ellipse, Star, Line, Vector, Polygon, BooleanOperation, Slice, Page, Section, TextPath.

**Blocked** in design mode: Sticky, Connector, ShapeWithText, CodeBlock, Slide, SlideRow, Webpage.

## 5. Incremental Workflow (How to Avoid Bugs)

The most common cause of bugs is trying to do too much in a single `use_figma` call. **Work in small steps and validate after each one.**

### The pattern

1. **Inspect first.** Before creating anything, run a read-only `use_figma` to discover what already exists in the file — pages, components, variables, naming conventions. Match what's there.
2. **Do one thing per call.** Create variables in one call, create components in the next, compose layouts in another. Don't try to build an entire screen in one script.
3. **Return IDs from every call.** Always `return` created node IDs, variable IDs, collection IDs as objects (e.g. `return { createdNodeIds: [...] }`). You'll need these as inputs to subsequent calls.
4. **Validate after each step.** Use `get_metadata` to verify structure (counts, names, hierarchy, positions). Use `get_screenshot` after major milestones to catch visual issues.
5. **Fix before moving on.** If validation reveals a problem, fix it before proceeding to the next step. Don't build on a broken foundation.

### Suggested step order for complex tasks

```
Step 1: Inspect file — discover existing pages, components, variables, conventions
Step 2: Create tokens/variables (if needed)
       → validate with get_metadata
Step 3: Create individual components
       → validate with get_metadata + get_screenshot
Step 4: Compose layouts from component instances
       → validate with get_screenshot
Step 5: Final verification
```

## 6. Error Recovery & Self-Correction

**`use_figma` is atomic — failed scripts do not execute.** If a script errors, no changes are made to the file.

### When `use_figma` returns an error

1. **STOP.** Do not immediately fix the code and retry.
2. **Read the error message carefully.** Understand exactly what went wrong.
3. **If the error is unclear**, call `get_metadata` or `get_screenshot` to understand the current file state.
4. **Fix the script** based on the error message.
5. **Retry** the corrected script.

### Common self-correction patterns

| Error message | Likely cause | How to fix |
|---|---|---|
| `"not implemented"` | Used `figma.notify()` | Remove it — use `return` for output |
| `"node must be an auto-layout frame..."` | Set `FILL`/`HUG` before appending to auto-layout parent | Move `appendChild` before `layoutSizingX = 'FILL'` |
| `"Setting figma.currentPage is not supported"` | Used sync page setter | Use `await figma.setCurrentPageAsync(page)` |
| Property value out of range | Color channel > 1 (used 0–255 instead of 0–1) | Divide by 255 |
| `"Cannot read properties of null"` | Node doesn't exist (wrong ID, wrong page) | Check page context, verify ID |

## 7. Pre-Flight Checklist

Before submitting ANY `use_figma` call, verify:

- [ ] Code uses `return` to send data back (NOT `figma.closePlugin()`)
- [ ] Code is NOT wrapped in an async IIFE (auto-wrapped for you)
- [ ] `return` value includes structured data with actionable info (IDs, counts)
- [ ] NO usage of `figma.notify()` anywhere
- [ ] NO usage of `console.log()` as output (use `return` instead)
- [ ] All colors use 0–1 range (not 0–255)
- [ ] Paint `color` objects use `{r, g, b}` only — no `a` field (opacity goes at the paint level: `{ type: 'SOLID', color: {...}, opacity: 0.5 }`)
- [ ] Fills/strokes are reassigned as new arrays (not mutated in place)
- [ ] Page switches use `await figma.setCurrentPageAsync(page)` (sync setter does NOT work)
- [ ] `layoutSizingVertical/Horizontal = 'FILL'` is set AFTER `parent.appendChild(child)`
- [ ] `loadFontAsync()` called BEFORE any text property changes
- [ ] `lineHeight`/`letterSpacing` use `{unit, value}` format (not bare numbers)
- [ ] `resize()` is called BEFORE setting sizing modes (resize resets them to FIXED)
- [ ] For multi-step workflows: IDs from previous calls are passed as string literals (not variables)
- [ ] New top-level nodes are positioned away from (0,0) to avoid overlapping existing content
- [ ] ALL created/mutated node IDs are collected and included in the `return` value
- [ ] Every async call is `await`ed — no fire-and-forget Promises

## 8. Discover Conventions Before Creating

**Always inspect the Figma file before creating anything.** Different files use different naming conventions, variable structures, and component patterns.

### Quick inspection scripts

**List all pages and top-level nodes:**
```js
const pages = figma.root.children.map(p => `${p.name} id=${p.id} children=${p.children.length}`);
return pages.join('\n');
```

**List existing components across all pages:**
```js
const results = [];
for (const page of figma.root.children) {
  await figma.setCurrentPageAsync(page);
  page.findAll(n => {
    if (n.type === 'COMPONENT' || n.type === 'COMPONENT_SET')
      results.push(`[${page.name}] ${n.name} (${n.type}) id=${n.id}`);
    return false;
  });
}
return results.join('\n');
```

**List existing variable collections and their conventions:**
```js
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const results = collections.map(c => ({
  name: c.name, id: c.id,
  varCount: c.variableIds.length,
  modes: c.modes.map(m => m.name)
}));
return results;
```
