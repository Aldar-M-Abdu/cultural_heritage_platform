from fastapi import APIRouter, Response
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO

router = APIRouter(tags=["placeholders"])

@router.get("/{width}/{height}")
async def get_placeholder_image(width: int, height: int):
    """Generate a placeholder image with specified dimensions"""
    # Create a new image with specified dimensions
    img = Image.new('RGB', (width, height), color=(200, 200, 200))
    
    # Add text showing dimensions
    draw = ImageDraw.Draw(img)
    text = f"{width}x{height}"
    # Try to get a font size that will fit the image
    font_size = min(width, height) // 4
    
    try:
        # Try to use a default font if available
        font = ImageFont.load_default()
        text_width, text_height = draw.textbbox((0, 0), text, font=font)[2:4]
        draw.text(((width-text_width)/2, (height-text_height)/2), text, fill=(80, 80, 80), font=font)
    except Exception:
        # Fallback method if font loading fails
        draw.text((width//2, height//2), text, fill=(80, 80, 80))
    
    # Save the image to a bytes buffer
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    
    # Return the image as a response
    return Response(content=buffer.getvalue(), media_type="image/png")
