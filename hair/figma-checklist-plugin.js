// ============================================================
// FIGMA PLUGIN — Checklist Kit Hair
// Como usar:
//   1. Abra o arquivo Figma no Desktop App
//   2. Menu → Plugins → Development → New Plugin...
//   3. Cole este código no campo "Code" e clique em "Run"
//   OU:
//   Abra o Console (Ctrl+Alt+I) e cole o código
// ============================================================

(async () => {
  const PAGE_NAME = "Hair";
  const FRAME_NAME = "Checklist — Kit Hair";

  // ---- Cores ----
  const WHITE    = { r: 1, g: 1, b: 1 };
  const BLACK    = { r: 0.08, g: 0.08, b: 0.08 };
  const GRAY     = { r: 0.55, g: 0.55, b: 0.55 };
  const LGRAY    = { r: 0.90, g: 0.90, b: 0.90 };
  const SECTION_BG = { r: 0.96, g: 0.96, b: 0.96 };

  // ---- Dados ----
  const sections = [
    {
      title: "CÂMERA & GRAVAÇÃO",
      items: [
        ["1", "SSD"],
        ["1", "Adaptador USB-C One Cable"],
        ["2", "SD Card Extreme"],
        ["1", "Camera Sony A7III"],
        ["1", "Lente Zeiss Sony E-mount FE 4/16-35 OSS"],
        ["1", "Carregador Batmax para 2 baterias Sony NP-FZ100"],
        ["2", "Baterias Sony NP-FZ100"],
        ["1", "Gimbal Scorp-C"],
        ["1", "Powerbank BJ76 10.000mAh"],
        ["1", "Kit microfone DJI — 2 mics, 1 receiver, 1 case carregador"],
        ["1", "Fone de Ouvido com cabo ZNS-PRO"],
        ["1", "Tripé Alumínio Marrom Tomate MTG-3018A"],
        ["3", "Tripés Alumínio Pretos"],
      ]
    },
    {
      title: "CABOS & CARREGADORES",
      items: [
        ["1", "Carregador Preto 1 USB-A 1 USB-C"],
        ["1", "Extensão 20A"],
        ["1", "Carregador Apple USB-A"],
        ["1", "Cabo 2M USB-C Branco"],
        ["2", "Cabos 1.5M USB-C para Lightning Apple"],
        ["1", "Cabo USB-A para Lightning Apple"],
        ["1", "Cabo USB-A → USB-C Branco Trançado com USB-C 90°"],
        ["1", "Base USB-A com 4 portas 3.0"],
        ["4", "Cabos USB-A para USB-C Pretos 3.0"],
        ["1", "Cabo P2 P2 30cm"],
      ]
    },
    {
      title: "DISPOSITIVOS",
      items: [
        ["1", "Power Bank MagSafe White"],
        ["1", "Mini Ring Light para telefone"],
        ["1", "Ring Light para tripé"],
        ["1", "iPhone 14 Pro Max"],
        ["1", "iPhone X"],
        ["1", "Apple Watch Series 4 Azul"],
        ["1", "Rayban Meta Glasses"],
        ["1", "Macbook M1 Pro — 16GB RAM / 512GB"],
        ["1", "Carregador Macbook M1 Pro"],
        ["1", "iPad Pro com Apple Pencil (carga por indução)"],
      ]
    },
    {
      title: "ILUMINAÇÃO",
      items: [
        ["2", "Bastões de LED"],
        ["1", "Luz Amaram 200x"],
      ]
    },
  ];

  // ---- Helpers ----
  function solidPaint(color, opacity = 1) {
    return [{ type: "SOLID", color, opacity }];
  }

  async function loadFonts() {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  }

  function makeText(str, size, weight, color, parent) {
    const t = figma.createText();
    t.characters = str;
    t.fontSize = size;
    t.fontName = { family: "Inter", style: weight };
    t.fills = solidPaint(color);
    parent.appendChild(t);
    return t;
  }

  function makeRect(w, h, color, parent) {
    const r = figma.createRectangle();
    r.resize(w, h);
    r.fills = solidPaint(color);
    parent.appendChild(r);
    return r;
  }

  function makeCheckbox(size, parent) {
    const r = figma.createRectangle();
    r.resize(size, size);
    r.fills = [{ type: "SOLID", color: WHITE, opacity: 1 }];
    r.strokes = solidPaint(LGRAY);
    r.strokeWeight = 1;
    r.cornerRadius = 2;
    parent.appendChild(r);
    return r;
  }

  // ---- Find or switch to Hair page ----
  const hairPage = figma.root.children.find(p => p.name === PAGE_NAME);
  if (!hairPage) {
    figma.notify(`Página "${PAGE_NAME}" não encontrada.`);
    return { error: `Page "${PAGE_NAME}" not found` };
  }
  await figma.setCurrentPageAsync(hairPage);

  // ---- Find position: to the right of last A4 frame ----
  const existingFrames = hairPage.children.filter(n => n.type === "FRAME");
  const rightmostX = existingFrames.reduce((max, f) => Math.max(max, f.x + f.width), 0);
  const startX = existingFrames.length > 0 ? rightmostX + 80 : 0;

  // ---- Load fonts ----
  await loadFonts();

  // ---- A4 dimensions (px at 72dpi Figma) ----
  const A4_W = 595;
  const A4_H = 842;
  const MARGIN = 36;
  const COL_GAP = 16;

  // Estimate height needed
  // Title: 48px, divider: 12px, then sections
  // Each section: header 28px + items * 20px + gap 14px
  let totalH = 60 + 12; // title + divider
  for (const s of sections) {
    totalH += 28 + s.items.length * 20 + 14;
  }
  const frameH = Math.max(A4_H, totalH + 40);

  // ---- Main frame ----
  const frame = figma.createFrame();
  frame.name = FRAME_NAME;
  frame.resize(A4_W, frameH);
  frame.x = startX;
  frame.y = 0;
  frame.fills = solidPaint(WHITE);
  frame.clipsContent = true;
  hairPage.appendChild(frame);

  // ---- Auto-layout vertical ----
  frame.layoutMode = "VERTICAL";
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "FIXED";
  frame.paddingTop = MARGIN;
  frame.paddingBottom = MARGIN;
  frame.paddingLeft = MARGIN;
  frame.paddingRight = MARGIN;
  frame.itemSpacing = 0;

  // ---- Title ----
  const titleText = makeText("CHECKLIST  —  KIT HAIR", 18, "Bold", BLACK, frame);
  titleText.layoutSizingHorizontal = "FILL";
  titleText.textAlignHorizontal = "CENTER";
  titleText.layoutSizingVertical = "HUG";

  // divider
  const divider = makeRect(A4_W - MARGIN * 2, 1, { r: 0.15, g: 0.15, b: 0.15 }, frame);
  divider.layoutSizingHorizontal = "FILL";
  divider.layoutSizingVertical = "FIXED";

  // spacer
  const spacerTop = makeRect(A4_W - MARGIN * 2, 12, WHITE, frame);
  spacerTop.layoutSizingHorizontal = "FILL";

  // ---- Sections ----
  for (const section of sections) {
    // Section container (vertical auto-layout)
    const secContainer = figma.createFrame();
    secContainer.name = section.title;
    secContainer.layoutMode = "VERTICAL";
    secContainer.primaryAxisSizingMode = "HUG";
    secContainer.counterAxisSizingMode = "FILL";
    secContainer.fills = [{ type: "SOLID", color: WHITE, opacity: 0 }];
    secContainer.itemSpacing = 0;
    frame.appendChild(secContainer);
    secContainer.layoutSizingHorizontal = "FILL";

    // Section header background
    const secHeaderBg = figma.createFrame();
    secHeaderBg.name = "sec-header";
    secHeaderBg.layoutMode = "HORIZONTAL";
    secHeaderBg.primaryAxisSizingMode = "FILL";
    secHeaderBg.counterAxisSizingMode = "HUG";
    secHeaderBg.fills = solidPaint(SECTION_BG);
    secHeaderBg.paddingLeft = 8;
    secHeaderBg.paddingRight = 8;
    secHeaderBg.paddingTop = 5;
    secHeaderBg.paddingBottom = 5;
    secHeaderBg.cornerRadius = 3;
    secContainer.appendChild(secHeaderBg);
    secHeaderBg.layoutSizingHorizontal = "FILL";

    const secTitle = makeText(section.title, 9, "Bold", GRAY, secHeaderBg);
    secTitle.letterSpacing = { unit: "PERCENT", value: 8 };
    secTitle.layoutSizingHorizontal = "FILL";
    secTitle.layoutSizingVertical = "HUG";

    // Items
    for (const [qty, name] of section.items) {
      const row = figma.createFrame();
      row.name = `${qty}× ${name}`;
      row.layoutMode = "HORIZONTAL";
      row.primaryAxisSizingMode = "FILL";
      row.counterAxisSizingMode = "HUG";
      row.fills = [{ type: "SOLID", color: WHITE, opacity: 0 }];
      row.paddingTop = 4;
      row.paddingBottom = 4;
      row.paddingLeft = 4;
      row.itemSpacing = 6;
      row.primaryAxisAlignItems = "CENTER";
      secContainer.appendChild(row);
      row.layoutSizingHorizontal = "FILL";

      // Checkbox
      const cb = makeCheckbox(11, row);
      cb.layoutSizingVertical = "FIXED";

      // Qty
      const qtyText = makeText(`×${qty}`, 9, "Medium", GRAY, row);
      qtyText.layoutSizingVertical = "HUG";

      // Name
      const nameText = makeText(name, 10, "Regular", BLACK, row);
      nameText.layoutSizingHorizontal = "FILL";
      nameText.layoutSizingVertical = "HUG";
    }

    // Bottom spacer between sections
    const secSpacer = makeRect(A4_W - MARGIN * 2, 10, WHITE, frame);
    secSpacer.layoutSizingHorizontal = "FILL";
  }

  // ---- Resize frame to content ----
  frame.primaryAxisSizingMode = "HUG";
  frame.primaryAxisSizingMode = "FIXED";
  frame.resize(A4_W, Math.max(A4_H, frame.height));

  figma.viewport.scrollAndZoomIntoView([frame]);
  figma.notify("✅ Checklist criado!");

  return { createdNodeIds: [frame.id], name: FRAME_NAME };
})();
