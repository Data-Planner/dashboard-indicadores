import PIL.Image
import PIL.ImageDraw
import PIL.ImageFont
import os

def create_schedule_image():
    # 16:9 aspect ratio (e.g., 1920x1080)
    width = 1920
    height = 1080
    
    # Colors
    bg_color = (255, 255, 255)  # White
    header_bg = (192, 0, 0)     # Dark Red
    sub_header_bg = (230, 230, 230) # Light Grey
    text_white = (255, 255, 255)
    text_black = (0, 0, 0)
    line_color = (200, 200, 200)
    
    img = PIL.Image.new('RGB', (width, height), color=bg_color)
    draw = PIL.ImageDraw.Draw(img)
    
    # Try to load a font
    try:
        # Common paths for fonts in linux environments
        font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        font_reg_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
        
        title_font = PIL.ImageFont.truetype(font_path, 36)
        header_font = PIL.ImageFont.truetype(font_path, 20)
        cell_font = PIL.ImageFont.truetype(font_reg_path, 18)
    except:
        title_font = PIL.ImageFont.load_default()
        header_font = PIL.ImageFont.load_default()
        cell_font = PIL.ImageFont.load_default()

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
                ["Estagiário", "", "", "", "", ""],
            ]
        },
        {
            "dept": "Outros",
            "staff": [
                ["Ana", "7:00", "13:00", "", "", "---"],
                ["Eishila", "", "", "13:30", "17:30", "---"],
            ]
        }
    ]

    # Layout parameters
    margin_x = 50
    margin_y = 40
    table_spacing = 20
    row_height = 35
    header_height = 50
    
    col_widths = [150, 150, 150, 150, 150, 500] # Name, Start, Lunch Out, Lunch In, End, Who stays
    table_width_main = sum(col_widths[:5])
    table_width_extra = col_widths[5]
    gap = 20
    
    current_y = margin_y
    
    # Draw a title
    draw.text((margin_x, current_y), "Escalas de Trabalho", font=title_font, fill=header_bg)
    current_y += 60

    for section in data:
        # Dept Header
        draw.rectangle([margin_x, current_y, margin_x + 150, current_y + 30], fill=sub_header_bg)
        draw.text((margin_x + 10, current_y + 5), section["dept"], font=header_font, fill=text_black)
        current_y += 35
        
        # Table Headers
        # Left side
        draw.rectangle([margin_x, current_y, margin_x + table_width_main, current_y + header_height], fill=header_bg)
        headers = ["Nome", "Entrada", "Saída Almoço", "Retorno Almoço", "Término"]
        curr_x = margin_x
        for i, h in enumerate(headers):
            # Split multi-line headers if needed, but here we just draw
            w = col_widths[i]
            draw.text((curr_x + 10, current_y + 10), h, font=header_font, fill=text_white)
            curr_x += w
            
        # Right side
        draw.rectangle([margin_x + table_width_main + gap, current_y, margin_x + table_width_main + gap + table_width_extra, current_y + header_height], fill=header_bg)
        draw.text((margin_x + table_width_main + gap + 100, current_y + 10), "Quem fica na sala", font=header_font, fill=text_white)
        
        current_y += header_height
        
        # Rows
        for row in section["staff"]:
            # Left table cells
            curr_x = margin_x
            for i in range(5):
                draw.rectangle([curr_x, current_y, curr_x + col_widths[i], current_y + row_height], outline=line_color)
                draw.text((curr_x + 10, current_y + 8), row[i], font=cell_font, fill=text_black)
                curr_x += col_widths[i]
                
            # Right table cell
            rx = margin_x + table_width_main + gap
            draw.rectangle([rx, current_y, rx + table_width_extra, current_y + row_height], outline=line_color)
            draw.text((rx + 10, current_y + 8), row[5], font=cell_font, fill=text_black)
            
            current_y += row_height
            
        current_y += table_spacing
        if current_y > height - 100:
             break # Avoid overflow for this demo

    # Save
    output_path = "/mnt/documents/escala_16_9.png"
    img.save(output_path)
    print(f"Image saved to {output_path}")

if __name__ == "__main__":
    create_schedule_image()
