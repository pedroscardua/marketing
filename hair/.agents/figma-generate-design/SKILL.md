---
name: figma-generate-design
description: "Use this skill alongside figma-use when the task involves translating an application page, view, or multi-section layout into Figma. Triggers: 'write to Figma', 'create in Figma from code', 'push page to Figma', 'take this app/page and build it in Figma', 'create a screen', 'build a landing page in Figma', 'update the Figma screen to match code'. This is the preferred workflow skill whenever the user wants to build or update a full page, screen, or view in Figma from code or a description. Discovers design system components, variables, and styles via search_design_system, imports them, and assembles screens incrementally section-by-section using design system tokens instead of hardcoded values."
disable-model-invocation: false
---

# Build / Update Screens from Design System

Use this skill to create or update full-page screens in Figma by **reusing the published design system** — components, variables, and styles — rather than drawing primitives with hardcoded values. The key insight: the Figma file likely has a published design system with components, color/spacing variables, and text/effect styles that correspond to the codebase's UI components and tokens. Find and use those instead of drawing boxes with hex colors.

**MANDATORY**: You MUST also load [figma-use](../figma-use/SKILL.md) before any `use_figma` call. That skill contains critical rules (color ranges, font loading, etc.) that apply to every script you write.

**Always pass `skillNames: "figma-generate-design"` when calling `use_figma` as part of this skill.** This is a logging parameter — it does not affect execution.

## Skill Boundaries

- Use this skill when the deliverable is a **Figma screen** (new or updated) composed of design system component instances.
- If the user wants to generate **code from a Figma design**, switch to [figma-implement-design](../figma-implement-design/SKILL.md).
- If the user wants to create **new reusable components or variants**, use [figma-use](../figma-use/SKILL.md) directly.

## Prerequisites

- Figma MCP server must be connected
- The target Figma file must have a published design system with components (or access to a team library)
- User should provide either:
  - A Figma file URL / file key to work in
  - Or context about which file to target (the agent can discover pages)
- Source code or description of the screen to build/update

## Parallel Workflow with generate_figma_design (Web Apps Only)

When building a screen from a **web app** that can be rendered in a browser, the best results come from running both approaches in parallel:

1. **In parallel:**
   - Start building the screen using this skill's workflow (use_figma + design system components)
   - Run `generate_figma_design` to capture a pixel-perfect screenshot of the running web app
2. **Once both complete:** Update the use_figma output to match the pixel-perfect layout from the `generate_figma_design` capture.
3. **Once confirmed looking good:** Delete the `generate_figma_design` output — it was only used as a visual reference.

**This parallel workflow is MANDATORY when the source contains images.** The `use_figma` Plugin API cannot fetch external image URLs — it can only set image fills by copying `imageHash` values from nodes already in the file.

## Required Workflow

**Follow these steps in order. Do not skip steps.**

### Step 1: Understand the Screen

Before touching Figma, understand what you're building:

1. If building from code, read the relevant source files to understand the page structure, sections, and which components are used.
2. Identify the major sections of the screen (e.g., Header, Hero, Content Panels, Pricing Grid, FAQ Accordion, Footer).
3. For each section, list the UI components involved (buttons, inputs, cards, navigation pills, accordions, etc.).
4. **Check whether the screen contains any images**. If it does and this is a web app, you **must** run the parallel `generate_figma_design` capture workflow.

### Step 2: Discover Design System — Components, Variables, and Styles

You need three things from the design system: **components** (buttons, cards, etc.), **variables** (colors, spacing, radii), and **styles** (text styles, effect styles like shadows). Don't hardcode hex colors or pixel values when design system tokens exist.

#### 2a: Discover components

Use `search_design_system` to find components by name or keyword. Search for each component type you identified in Step 1:

```
search_design_system(query="button primary")
search_design_system(query="card")
search_design_system(query="navigation")
```

For each result, note the component key — you'll use `figma.importComponentByKeyAsync(key)` to import instances.

#### 2b: Discover variables (colors and spacing)

In a `use_figma` call, list all variable collections and inspect their variables:

```js
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const result = {};
for (const col of collections) {
  result[col.name] = { modes: col.modes.map(m => m.name), varCount: col.variableIds.length };
}
return result;
```

Then inspect specific collections for the variables you need (background colors, text colors, spacing scale, border radii).

#### 2c: Discover text styles and effect styles

```js
const textStyles = await figma.getLocalTextStylesAsync();
const effectStyles = await figma.getLocalEffectStylesAsync();
return {
  textStyles: textStyles.map(s => ({ name: s.name, id: s.id })),
  effectStyles: effectStyles.map(s => ({ name: s.name, id: s.id }))
};
```

Match style names to what you see in the source code (e.g., `heading-xl`, `body-md`, `shadow-card`).

### Step 3: Create Page Wrapper

Create a single containing frame positioned away from existing content. Return its ID — all subsequent calls build inside this wrapper.

```js
// Find a clear position first
const existing = figma.currentPage.children;
const rightmost = existing.reduce((max, n) => Math.max(max, n.x + n.width), 0);
const wrapper = figma.createFrame();
wrapper.name = "Screen Name";
wrapper.resize(1440, 900); // or appropriate breakpoint
wrapper.x = rightmost + 100;
wrapper.y = 0;
return { createdNodeIds: [wrapper.id], wrapperId: wrapper.id };
```

### Step 4: Build Sections Incrementally

Build one section per `use_figma` call inside the wrapper. For each section:

1. Import component instances: `const comp = await figma.importComponentByKeyAsync(key); const inst = comp.createInstance();`
2. Bind variables for spacing/colors — never hardcode hex or pixel values:
   - `node.setBoundVariable('fills', variable)` for colors
   - `node.setBoundVariable('paddingLeft', variable)` for spacing
3. Apply text styles: `node.textStyleId = textStyle.id`
4. Apply effect styles: `node.effectStyleId = effectStyle.id`
5. Override instance text: `instance.setProperties({ 'label': 'Click me' })`

### Step 5: Validate and Transfer Images

After building each section:
- Screenshot the section: `get_screenshot(nodeId=sectionId)`
- Check for text truncation, overlapping elements, placeholder text
- If images were captured via `generate_figma_design`, copy `imageHash` values to the corresponding image fills

### Step 6: Update Existing Screens

When updating rather than creating:
- Identify the existing screen node by name or ID
- Swap component instances with new versions: find instances by `mainComponent.key`, replace with new version
- Modify text overrides, variant properties
- Remove deprecated sections
- Validate incrementally after each change

## Key Principles

- **Never hardcode hex colors or pixel spacing** when a design system variable exists.
- Use `setBoundVariable` for spacing/radii and `setBoundVariableForPaint` for colors.
- Always apply text styles via `node.textStyleId` and effect styles via `node.effectStyleId`.
- Work section-by-section; never build multiple major sections in a single call.
- Return node IDs from every operation for composition and error recovery.
