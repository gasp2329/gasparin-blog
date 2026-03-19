"""
Generate a styled reference.docx template for pandoc conversion.
Theme: Georgia serif body, system-ui headers, warm amber #b45309 accents.
"""
from docx import Document
from docx.shared import Pt, Inches, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml
import copy

doc = Document()

# ── Page setup: A4 landscape ──
for section in doc.sections:
    section.orientation = 1  # landscape
    section.page_width = Cm(29.7)
    section.page_height = Cm(21.0)
    section.top_margin = Cm(1.5)
    section.bottom_margin = Cm(1.5)
    section.left_margin = Cm(1.5)
    section.right_margin = Cm(1.5)

# Colors
AMBER = RGBColor(0xB4, 0x53, 0x09)
STONE_900 = RGBColor(0x1C, 0x19, 0x17)
STONE_500 = RGBColor(0x78, 0x71, 0x6C)
STONE_200 = RGBColor(0xE7, 0xE5, 0xE4)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)

def set_font(style, name, size, color=STONE_900, bold=False, italic=False):
    font = style.font
    font.name = name
    font.size = Pt(size)
    font.color.rgb = color
    font.bold = bold
    font.italic = italic

# ── Normal (body) ──
style = doc.styles['Normal']
set_font(style, 'Georgia', 11, STONE_900)
pf = style.paragraph_format
pf.space_before = Pt(0)
pf.space_after = Pt(6)
pf.line_spacing = 1.7

# ── Title / Heading 1 ──
style = doc.styles['Title']
set_font(style, 'Calibri', 22, STONE_900, bold=True)
pf = style.paragraph_format
pf.space_before = Pt(0)
pf.space_after = Pt(4)

style = doc.styles['Heading 1']
set_font(style, 'Calibri', 22, STONE_900, bold=True)
pf = style.paragraph_format
pf.space_before = Pt(0)
pf.space_after = Pt(4)

# ── Heading 2 (amber, border-bottom via spacing) ──
style = doc.styles['Heading 2']
set_font(style, 'Calibri', 14, AMBER, bold=True)
pf = style.paragraph_format
pf.space_before = Pt(18)
pf.space_after = Pt(6)
# Add bottom border
pBdr = parse_xml(
    f'<w:pBdr {nsdecls("w")}>'
    f'  <w:bottom w:val="single" w:sz="4" w:space="2" w:color="E7E5E4"/>'
    f'</w:pBdr>'
)
style.element.find(qn('w:pPr')).append(pBdr)

# ── Heading 3 ──
style = doc.styles['Heading 3']
set_font(style, 'Calibri', 12, STONE_900, bold=True)
pf = style.paragraph_format
pf.space_before = Pt(14)
pf.space_after = Pt(4)

# ── Heading 4 ──
style = doc.styles['Heading 4']
set_font(style, 'Calibri', 11, AMBER, bold=True)
pf = style.paragraph_format
pf.space_before = Pt(10)
pf.space_after = Pt(4)

# ── Block Quote ──
if 'Block Text' in [s.name for s in doc.styles]:
    style = doc.styles['Block Text']
else:
    style = doc.styles.add_style('Block Text', 1)  # paragraph
set_font(style, 'Georgia', 10.5, STONE_500, italic=True)
pf = style.paragraph_format
pf.left_indent = Inches(0.4)
pf.space_before = Pt(8)
pf.space_after = Pt(8)
pf.line_spacing = 1.6

# ── List styles ──
for name in ['List Bullet', 'List Number', 'List Paragraph']:
    if name in [s.name for s in doc.styles]:
        style = doc.styles[name]
        set_font(style, 'Georgia', 11, STONE_900)
        pf = style.paragraph_format
        pf.space_after = Pt(3)
        pf.line_spacing = 1.65

# ── Table style (basic) ──
# Pandoc uses 'Table' or default table style. We'll set defaults.
# The reference doc mainly controls paragraph/character styles.

# ── Subtitle ──
if 'Subtitle' in [s.name for s in doc.styles]:
    style = doc.styles['Subtitle']
    set_font(style, 'Calibri', 10, STONE_500)
    pf = style.paragraph_format
    pf.space_after = Pt(20)

# Save as a minimal doc (pandoc uses styles from reference, not content)
doc.add_paragraph('', style='Title')
doc.save('exports/reference.docx')
print('✓ reference.docx created')
