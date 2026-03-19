// scripts/export-doc.ts
// Extracts the post content and writes a styled HTML file for pandoc / weasyprint conversion.
// After running this, build PDF and DOCX:
//   weasyprint exports/squad-operating-model.html exports/squad-operating-model.pdf
//   pandoc exports/squad-operating-model.html --reference-doc=exports/reference.docx -o exports/squad-operating-model.docx
//   .venv/bin/python scripts/style-docx.py exports/squad-operating-model.docx
import { prisma } from "../src/lib/prisma";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const post = await prisma.post.findUnique({
    where: { slug: "dt-product-engineering-squad-operating-model" },
  });

  if (!post) {
    console.error("Post not found.");
    process.exit(1);
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${post.title}</title>
<style>
  @page {
    size: A4 landscape;
    margin: 1.5cm;
  }
  *, *::before, *::after {
    box-sizing: border-box;
  }
  body {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 11pt;
    line-height: 1.7;
    color: #1c1917;
    max-width: 100%;
    margin: 0 auto;
    padding: 40px 20px;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }
  h1 {
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 22pt;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.2;
    margin-top: 0;
    margin-bottom: 6px;
    color: #1c1917;
  }
  .subtitle {
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 10pt;
    color: #78716c;
    margin-bottom: 32px;
  }
  h2 {
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 14pt;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.35;
    margin-top: 28px;
    margin-bottom: 8px;
    padding-bottom: 4px;
    border-bottom: 2px solid #e7e5e4;
    color: #b45309;
  }
  h3 {
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 12pt;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.35;
    margin-top: 22px;
    margin-bottom: 6px;
    color: #1c1917;
  }
  p {
    margin-top: 0;
    margin-bottom: 10px;
  }
  ul, ol {
    padding-left: 24px;
    margin-bottom: 10px;
  }
  li {
    margin-bottom: 5px;
    line-height: 1.65;
  }
  strong {
    font-weight: 700;
    color: #1c1917;
  }
  blockquote {
    border-left: 3px solid #b45309;
    background: #fdfcfb;
    margin: 16px 0;
    padding: 10px 16px;
    font-style: italic;
    color: #78716c;
    font-size: 10.5pt;
    line-height: 1.6;
    max-width: 100%;
  }
  blockquote p {
    margin: 0;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7pt;
    margin: 14px 0;
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    border: 1px solid #e7e5e4;
    table-layout: fixed;
    word-wrap: break-word;
  }
  th {
    background: #f1f0ef;
    font-weight: 700;
    text-align: left;
    padding: 3px 5px;
    border-bottom: 2px solid #e7e5e4;
    border-right: 1px solid #e7e5e4;
    font-size: 6pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }
  th:last-child { border-right: none; }
  td {
    padding: 3px 5px;
    border-bottom: 1px solid #e7e5e4;
    border-right: 1px solid #e7e5e4;
    vertical-align: top;
    line-height: 1.4;
    font-size: 6.5pt;
  }
  td:last-child { border-right: none; }
  .status-badge {
    display: inline-block;
    font-size: 7pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 2px 7px;
    border-radius: 999px;
    white-space: nowrap;
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
  }
  .status-green  { background: #dcfce7; color: #166534; }
  .status-yellow { background: #fef9c3; color: #854d0e; }
  .status-red    { background: #fee2e2; color: #991b1b; }
  .col-status {
    max-width: 220px;
    background: #fdfcfb;
    border-left: 2px solid #e7e5e4;
    font-style: italic;
    color: #78716c;
    font-size: 6pt;
    line-height: 1.4;
  }
  th.col-status {
    font-style: normal;
    color: #1c1917;
    background: #f1f0ef;
  }
  .cycle-flow {
    text-align: center;
    margin: 20px auto;
  }
  .cycle-flow svg {
    width: 500px;
    height: auto;
  }
  em { font-style: italic; }
  a { color: #b45309; text-decoration: underline; }

  /* ── Pagination ── */
  p, li, blockquote {
    orphans: 3;
    widows: 3;
  }
  h2, h3 {
    page-break-after: avoid;
  }
  blockquote {
    page-break-inside: avoid;
  }
  thead {
    display: table-header-group;
  }
</style>
</head>
<body>
<h1>${post.title}</h1>
${post.content}
</body>
</html>`;

  const outDir = path.join(process.cwd(), "exports");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const htmlPath = path.join(outDir, "squad-operating-model.html");
  fs.writeFileSync(htmlPath, html, "utf-8");
  console.log(`✓ HTML written: ${htmlPath}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
