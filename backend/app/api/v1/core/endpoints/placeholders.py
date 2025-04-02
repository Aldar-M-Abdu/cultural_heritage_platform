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
    
    # Draw the text in the center of the image
    w, h = draw.textsize(text)
    draw.text(((width-w)/2, (height-h)/2), text, fill=(80, 80, 80))
    
    # Save the image to a bytes buffer
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    
    # Return the image as a response
    return Response(content=buffer.getvalue(), media_type="image/png")
