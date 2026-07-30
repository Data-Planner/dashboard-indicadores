import PIL.Image
import PIL.ImageDraw
import PIL.ImageFont

def create_metas_image(quality="fhd"):
    resolutions = {"hd": (1280, 720), "fhd": (1920, 1080), "4k": (3840, 2160)}
    width, height = resolutions.get(quality, (1920, 1080))
    scale = width / 1280

    white = (255, 255, 255)
    primary_red = (160, 19, 16)
    slate_900 = (15, 23, 42)
    slate_600 = (71, 85, 105)
    slate_400 = (148, 163, 184)
    slate_200 = (226, 232, 240)
    slate_50 = (248, 250, 252)

    img = PIL.Image.new("RGB", (width, height), color=white)
    draw = PIL.ImageDraw.Draw(img)

    base = "/nix/store/0hdgmcjy7q8zn7h3amz8nf96l9qh7wv0-liberation-fonts-2.1.5/share/fonts/truetype/"
    font_bold = base + "LiberationSans-Bold.ttf"
    font_reg = base + "LiberationSans-Regular.ttf"
    font_italic = base + "LiberationSans-Italic.ttf"

    title_font = PIL.ImageFont.truetype(font_bold, int(24 * scale))
    date_font = PIL.ImageFont.truetype(font_reg, int(14 * scale))
    header_font = PIL.ImageFont.truetype(font_bold, int(11 * scale))
    cell_meta = PIL.ImageFont.truetype(font_reg, int(13 * scale))
    cell_num = PIL.ImageFont.truetype(font_bold, int(15 * scale))
    cell_detalhe = PIL.ImageFont.truetype(font_italic, int(12 * scale))
    footer_font = PIL.ImageFont.truetype(font_bold, int(10 * scale))
    logo_font = PIL.ImageFont.truetype(font_bold, int(20 * scale))

    data = [
        (1, "Atingir meta de gastos estabelecida para área no 1º Q26", "Realizado de despesas menor que o orçamento planejamento para o quadrimestre."),
        (2, "Reestruturar o Painel de Gestão do Comercial e MKT (Intraflex)", "Sanear / Organizar / Simplificar o painel do Intraflex Comercial + MKT"),
        (3, "Garantir o rollout do One Page + Plan Único para todos os DDDs.", "Implementar em todos os DDDs os dois relatórios."),
        (4, "RV 2026", "Apoiar e implementar o novo modelo de metas do time comercial para 2026. Garantir o acompanhamento semanal do alcance de metas do time comercial, de acordo com o novo modelo de RV 2026."),
        (5, "Atingir a Receita de Ativação prevista para o Quadrimestre", "Garantir o acompanhamento das ativações mensalmente, atuando na redução da dispersão entre o que foi ativado e o que realmente foi pago."),
        (6, "Monitor de performance - Adquirência", "Relatório publicado no Intraflex"),
    ]

    # Header
    header_h = int(64 * scale)
    draw.rectangle([0, 0, width, header_h], fill=primary_red)
    logo_size = int(40 * scale)
    logo_x = int(48 * scale)
    logo_y = (header_h - logo_size) // 2
    draw.ellipse([logo_x, logo_y, logo_x + logo_size, logo_y + logo_size], fill=white)
    draw.text((logo_x + int(13 * scale), logo_y + int(6 * scale)), "M", font=logo_font, fill=primary_red)
    draw.text((logo_x + logo_size + int(16 * scale), logo_y + int(4 * scale)), "QUADRO DE METAS", font=title_font, fill=white)
    draw.text((width - int(240 * scale), logo_y + int(12 * scale)), "1º Quadrimestre 2026", font=date_font, fill=white)

    # Content area
    margin = int(32 * scale)
    content_top = header_h + margin
    footer_h = int(40 * scale)
    content_bottom = height - footer_h - margin
    radius = int(8 * scale)
    gap = int(8 * scale)

    # Columns
    col_num_w = int(60 * scale)
    remaining = width - 2 * margin - col_num_w - 2 * gap
    col_meta_w = int(remaining * (1 / 2.6))
    col_det_w = remaining - col_meta_w

    x_num = margin
    x_meta = x_num + col_num_w + gap
    x_det = x_meta + col_meta_w + gap

    # Table header
    header_row_h = int(34 * scale)
    y = content_top
    draw.rounded_rectangle([x_num, y, x_num + col_num_w, y + header_row_h], radius=radius, fill=primary_red)
    draw.rounded_rectangle([x_meta, y, x_meta + col_meta_w, y + header_row_h], radius=radius, fill=primary_red)
    draw.rounded_rectangle([x_det, y, x_det + col_det_w, y + header_row_h], radius=radius, fill=primary_red)

    def draw_centered(text, x, w, y, font, fill):
        tw = draw.textlength(text, font=font)
        draw.text((x + (w - tw) // 2, y), text, font=font, fill=fill)

    draw_centered("#", x_num, col_num_w, y + int(10 * scale), header_font, white)
    draw.text((x_meta + int(14 * scale), y + int(10 * scale)), "META", font=header_font, fill=white)
    draw.text((x_det + int(14 * scale), y + int(10 * scale)), "DETALHE DA META", font=header_font, fill=white)

    # Row heights distributed
    y_rows_start = y + header_row_h + gap
    rows_available = content_bottom - y_rows_start
    row_gap = int(4 * scale)
    n = len(data)
    row_h = (rows_available - row_gap * (n - 1)) // n

    def wrap_text(text, font, max_w):
        words = text.split()
        lines, cur = [], ""
        for w_ in words:
            test = cur + (" " if cur else "") + w_
            if draw.textlength(test, font=font) <= max_w:
                cur = test
            else:
                if cur:
                    lines.append(cur)
                cur = w_
        if cur:
            lines.append(cur)
        return lines

    cy = y_rows_start
    for idx, (num, meta, det) in enumerate(data):
        bg = slate_50 if idx % 2 == 0 else white
        for x, w in [(x_num, col_num_w), (x_meta, col_meta_w), (x_det, col_det_w)]:
            draw.rounded_rectangle([x, cy, x + w, cy + row_h], radius=radius, fill=bg, outline=slate_200)

        # Number centered
        tw = draw.textlength(str(num), font=cell_num)
        th = int(15 * scale)
        draw.text((x_num + (col_num_w - tw) // 2, cy + (row_h - th) // 2 - int(3 * scale)), str(num), font=cell_num, fill=slate_900)

        # Meta wrapped
        meta_lines = wrap_text(meta, cell_meta, col_meta_w - int(28 * scale))
        line_h_meta = int(18 * scale)
        text_block_h = len(meta_lines) * line_h_meta
        ty = cy + (row_h - text_block_h) // 2
        for line in meta_lines:
            draw.text((x_meta + int(14 * scale), ty), line, font=cell_meta, fill=slate_900)
            ty += line_h_meta

        # Detalhe wrapped
        det_lines = wrap_text(det, cell_detalhe, col_det_w - int(28 * scale))
        line_h_det = int(17 * scale)
        text_block_h = len(det_lines) * line_h_det
        ty = cy + (row_h - text_block_h) // 2
        for line in det_lines:
            draw.text((x_det + int(14 * scale), ty), line, font=cell_detalhe, fill=slate_600)
            ty += line_h_det

        cy += row_h + row_gap

    # Footer
    draw.rectangle([0, height - footer_h, width, height], fill=slate_50)
    draw.line([0, height - footer_h, width, height - footer_h], fill=slate_200, width=1)
    footer_y = height - footer_h + int(12 * scale)
    dot = int(6 * scale)
    draw.ellipse([int(48 * scale), footer_y + int(2 * scale), int(48 * scale) + dot, footer_y + int(2 * scale) + dot], fill=primary_red)
    draw.text((int(62 * scale), footer_y), "SISTEMA INTEGRADO DE GESTÃO", font=footer_font, fill=slate_400)
    draw.text((width - int(120 * scale), footer_y), "PÁGINA 01/01", font=footer_font, fill=slate_400)

    # Rounded corners
    r = int(40 * scale)
    mask = PIL.Image.new("L", (width, height), 0)
    PIL.ImageDraw.Draw(mask).rounded_rectangle([0, 0, width, height], radius=r, fill=255)
    rounded = PIL.Image.new("RGBA", (width, height), (0, 0, 0, 0))
    rounded.paste(img, (0, 0), mask=mask)

    out = f"public/metas_{quality}.png"
    rounded.save(out, optimize=True)
    print(f"Exported: {out}")

if __name__ == "__main__":
    for q in ["hd", "fhd", "4k"]:
        create_metas_image(q)
