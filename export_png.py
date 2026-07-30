import PIL.Image
import PIL.ImageDraw
import PIL.ImageFont
import os
import sys

def create_professional_schedule(quality="fhd"):
    # Resolutions
    resolutions = {
        "hd": (1280, 720),
        "fhd": (1920, 1080),
        "4k": (3840, 2160)
    }
    width, height = resolutions.get(quality, (1920, 1080))
    scale = width / 1280  # Base scale from the HTML layout width
    
    # Colors
    bg_color = (255, 255, 255)
    primary_red = (160, 19, 16)  # #A01310
    header_red_dark = (122, 14, 12)
    slate_900 = (15, 23, 42)
    slate_800 = (30, 41, 59)
    slate_700 = (51, 65, 85)
    slate_600 = (71, 85, 105)
    slate_500 = (100, 116, 139)
    slate_400 = (148, 163, 184)
    slate_200 = (226, 232, 240)
    slate_100 = (241, 245, 249)
    slate_50 = (248, 250, 252)
    white = (255, 255, 255)
    
    img = PIL.Image.new('RGB', (width, height), color=bg_color)
    draw = PIL.ImageDraw.Draw(img)
    
    # Fonts
    try:
        base_font_path = "/nix/store/0hdgmcjy7q8zn7h3amz8nf96l9qh7wv0-liberation-fonts-2.1.5/share/fonts/truetype/"
        font_path_bold = base_font_path + "LiberationSans-Bold.ttf"
        font_path_reg = base_font_path + "LiberationSans-Regular.ttf"
        font_path_italic = base_font_path + "LiberationSans-Italic.ttf"
        
        title_font = PIL.ImageFont.truetype(font_path_bold, int(24 * scale))
        date_font = PIL.ImageFont.truetype(font_path_reg, int(14 * scale))
        header_font = PIL.ImageFont.truetype(font_path_bold, int(10 * scale))
        cell_font_bold = PIL.ImageFont.truetype(font_path_bold, int(12 * scale))
        cell_font_reg = PIL.ImageFont.truetype(font_path_reg, int(12 * scale))
        cell_font_italic = PIL.ImageFont.truetype(font_path_italic, int(11 * scale))
        footer_font = PIL.ImageFont.truetype(font_path_bold, int(10 * scale))
    except:
        title_font = header_font = cell_font_bold = cell_font_reg = cell_font_italic = footer_font = PIL.ImageFont.load_default()

    data = [
        {
            "dept": "Plancom",
            "staff": [
                ["Marcelo", "7:30", "11:00", "12:00", "17:18", "Guilherme, Robson, Gabriel e Rafael"],
                ["Guilherme", "8:00", "11:30", "12:30", "17:48", "Gabriel, Rafael"],
                ["Robson", "7:00", "11:30", "12:30", "16:48", "Gabriel, Rafael"],
                ["Gabriel", "8:00", "12:00", "13:00", "17:48", "Marcelo, Rafael"],
                ["Rafael", "7:00", "13:00", "14:00", "16:48", "Marcelo, Guilherme, Robson e Gabriel"],
            ]
        },
        {
            "dept": "Pex",
            "staff": [
                ["Ericka", "7:00", "13:00", "14:00", "16:48", "Paulo"],
                ["Paulo", "7:00", "11:30", "12:30", "16:48", "Ericka"],
            ]
        },
        {
            "dept": "Trade",
            "staff": [
                ["Karina", "7:00", "12:00", "13:00", "16:48", "Nayara"],
                ["Nayara", "7:00", "13:00", "14:00", "16:48", "Karina"],
            ]
        },
        {
            "dept": "Marketing",
            "staff": [
                ["Gabriela", "8:00", "12:00", "13:00", "17:48", "---"],
                ["Estagiário(a)", "7:00", "13:00", "", "", "---"],
            ]
        },
        {
            "dept": "Estagiária e Menor Aprendiz",
            "staff": [
                ["Ana", "7:00", "13:00", "", "", "---"],
                ["Eishila", "", "", "13:30", "17:30", "---"],
            ]
        }
    ]

    # Draw Header Decorator
    header_h = int(64 * scale)
    draw.rectangle([0, 0, width, header_h], fill=primary_red)
    
    # Logo circle
    logo_size = int(40 * scale)
    logo_x = int(48 * scale)
    logo_y = (header_h - logo_size) // 2
    draw.ellipse([logo_x, logo_y, logo_x + logo_size, logo_y + logo_size], fill=white)
    draw.text((logo_x + int(12 * scale), logo_y + int(6 * scale)), "S", font=PIL.ImageFont.truetype(font_path_bold, int(20 * scale)), fill=primary_red)
    
    draw.text((logo_x + logo_size + int(16 * scale), logo_y + int(4 * scale)), "ESCALAS DE TRABALHO", font=title_font, fill=white)
    draw.text((width - int(150 * scale), logo_y + int(12 * scale)), "Junho 2026", font=date_font, fill=(255, 255, 255, 204))

    # Content Area
    margin = int(24 * scale)
    current_y = header_h + margin
    
    main_table_w = int(780 * scale)
    gap = int(8 * scale)
    col_widths = [int(main_table_w * f) for f in [0.26, 0.17, 0.19, 0.19, 0.19]]
    
    for section in data:
        # Headers
        h_y = current_y
        row_h = int(28 * scale)
        
        # Main Header (red, rounded)
        radius_sm = int(6 * scale)
        draw.rounded_rectangle([margin, h_y, margin + main_table_w, h_y + row_h], radius=radius_sm, fill=primary_red)
        # Dept label cell darker
        dept_w = col_widths[0]
        # use a mask to clip dark cell to rounded left side
        dept_mask = PIL.Image.new('L', (dept_w, row_h), 0)
        PIL.ImageDraw.Draw(dept_mask).rounded_rectangle([0, 0, dept_w, row_h], radius=radius_sm, fill=255)
        dept_layer = PIL.Image.new('RGB', (dept_w, row_h), header_red_dark)
        img.paste(dept_layer, (margin, h_y), dept_mask)
        # re-draw right portion as full red overlap to keep right side rounded
        draw.rectangle([margin + dept_w, h_y, margin + main_table_w - radius_sm, h_y + row_h], fill=primary_red)
        
        curr_x = margin
        headers = [section["dept"], "Entrada", "Saída Almoço", "Retorno Almoço", "Término"]
        for i, h in enumerate(headers):
            tw = draw.textlength(h.upper(), font=header_font)
            text_x = curr_x + (col_widths[i] - tw) // 2
            
            draw.text((text_x, h_y + int(8 * scale)), h.upper(), font=header_font, fill=white)
            if i < 4:
                draw.line([curr_x + col_widths[i], h_y + int(4*scale), curr_x + col_widths[i], h_y + row_h - int(4*scale)], fill=(255, 255, 255), width=1)
            curr_x += col_widths[i]
            
        # Side Header (red, rounded)
        side_x = margin + main_table_w + gap
        draw.rounded_rectangle([side_x, h_y, width - margin, h_y + row_h], radius=radius_sm, fill=primary_red)
        draw.text((side_x + int(12 * scale), h_y + int(8 * scale)), "QUEM FICA NA SALA", font=header_font, fill=white)
        
        current_y += row_h + int(2 * scale)
        
        # Rows (rounded)
        for idx, row in enumerate(section["staff"]):
            row_h = int(26 * scale)
            bg = slate_50 if idx % 2 == 0 else white
            
            # Left table - rounded
            draw.rounded_rectangle([margin, current_y, margin + main_table_w, current_y + row_h], radius=radius_sm, fill=bg, outline=slate_200)
            curr_x = margin
            for i, val in enumerate(row[:5]):
                f = cell_font_reg
                if i == 0:
                    text_x = curr_x + int(12 * scale)
                else:
                    tw = draw.textlength(val, font=f)
                    text_x = curr_x + (col_widths[i] - tw) // 2
                
                draw.text((text_x, current_y + int(6 * scale)), val, font=f, fill=slate_900 if i == 0 else slate_600)
                if i < 4:
                    draw.line([curr_x + col_widths[i], current_y + int(4*scale), curr_x + col_widths[i], current_y + row_h - int(4*scale)], fill=slate_200, width=1)
                curr_x += col_widths[i]
                
            # Right table - rounded
            draw.rounded_rectangle([side_x, current_y, width - margin, current_y + row_h], radius=radius_sm, fill=bg, outline=slate_200)
            draw.text((side_x + int(12 * scale), current_y + int(6 * scale)), row[5], font=cell_font_italic, fill=slate_500)
            
            current_y += row_h + int(2 * scale)
            
        current_y += int(14 * scale)

    # Footer
    footer_h = int(40 * scale)
    draw.rectangle([0, height - footer_h, width, height], fill=slate_50)
    draw.line([0, height - footer_h, width, height - footer_h], fill=slate_200, width=1)
    
    footer_y = height - footer_h + int(12 * scale)
    dot_size = int(6 * scale)
    draw.ellipse([int(48 * scale), footer_y + int(2 * scale), int(48 * scale) + dot_size, footer_y + int(2 * scale) + dot_size], fill=primary_red)
    draw.text((int(62 * scale), footer_y), "SISTEMA INTEGRADO DE GESTÃO", font=footer_font, fill=slate_400)
    draw.text((width - int(120 * scale), footer_y), "PÁGINA 01/01", font=footer_font, fill=slate_400)

    # Apply rounded corners to the final image
    radius = int(40 * scale)
    mask = PIL.Image.new('L', (width, height), 0)
    mask_draw = PIL.ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, width, height], radius=radius, fill=255)
    
    rounded_img = PIL.Image.new('RGBA', (width, height), (0, 0, 0, 0))
    rounded_img.paste(img, (0, 0), mask=mask)

    # Save as PNG with transparency
    output_path = f"public/escala_{quality}.png"
    rounded_img.save(output_path, optimize=True)
    print(f"Exported: {output_path}")

if __name__ == "__main__":
    for q in ["hd", "fhd", "4k"]:
        create_professional_schedule(q)
