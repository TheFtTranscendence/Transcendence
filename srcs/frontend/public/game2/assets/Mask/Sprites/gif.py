from PIL import Image

def split_image_to_gifs(image_path, output_gif_path, frame_duration=150):
    # Open the image
    with Image.open(image_path) as img:
        # Get the dimensions of the image
        img_width, img_height = img.size
        
        # Verify if width is a multiple of 200 and height is 200
        if img_height != 200 or img_width % 200 != 0:
            raise ValueError("The image's width must be a multiple of 200 and height must be 200 pixels.")
        
        frames = []
        
        # Split the image into 200x200 sections
        for i in range(0, img_width, 200):
            # Create a blank 200x200 image with a white background
            frame = Image.new("RGB", (200, 200), (255, 255, 255))
            
            # Define the box to crop from the original image
            box = (i, 0, i + 200, 200)
            cropped_section = img.crop(box)
            
            # Paste the cropped section onto the blank frame
            frame.paste(cropped_section, (0, 0))
            
            # Add the frame to the list
            frames.append(frame)

        # Save the frames as a GIF
        frames[0].save(output_gif_path, save_all=True, append_images=frames[1:], duration=frame_duration, loop=0)

input_image = 'normal/Idle.png'  # The image to split and create the GIF
output_gif = 'normal_preview.gif'  # The output GIF file path

split_image_to_gifs(input_image, output_gif)