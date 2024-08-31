from PIL import Image
import numpy as np

def blue_to_green(r, g, b):
    """
    Precisely map shades of blue to green using floating-point calculations.
    """
    # Convert the RGB values to a normalized range [0, 1]
    r_normalized = r / 255.0
    g_normalized = g / 255.0
    b_normalized = b / 255.0
    
    # Calculate the relative contribution of blue to the pixel's color
    total = r_normalized + g_normalized + b_normalized
    if total == 0:
        # Avoid division by zero; return original color if all components are zero
        return r, g, b

    blue_ratio = b_normalized / total
    green_ratio = 1.0 - blue_ratio

    # Transform blue intensity to green
    new_r = int(r_normalized * green_ratio * 255)
    new_g = int(255 * blue_ratio + g_normalized * green_ratio * 255)
    new_b = int(b_normalized * green_ratio * 255)
    
    # Ensure RGB values are within bounds
    new_r = min(255, max(0, new_r))
    new_g = min(255, max(0, new_g))
    new_b = min(255, max(0, new_b))
    
    return new_r, new_g, new_b

def replace_blue_gradient_with_green(image_path, output_path):
    # Open the original image with transparency (RGBA mode)
    img = Image.open(image_path).convert('RGBA')
    pixels = img.load()

    # Convert the image to a NumPy array for efficient processing
    img_array = np.array(img)

    # Get image dimensions
    height, width, _ = img_array.shape

    # Process each pixel with floating-point precision
    for y in range(height):
        for x in range(width):
            r, g, b, a = img_array[y, x]
            
            if a > 0:  # Only process non-transparent pixels
                new_r, new_g, new_b = blue_to_green(r, g, b)
                img_array[y, x] = (new_r, new_g, new_b, a)

    # Convert the NumPy array back to an image
    new_img = Image.fromarray(img_array, 'RGBA')
    new_img.save(output_path, format='PNG')
    print(f'Image saved as {output_path}')

if __name__ == "__main__":
    replace_blue_gradient_with_green('original.png', 'altered.png')
