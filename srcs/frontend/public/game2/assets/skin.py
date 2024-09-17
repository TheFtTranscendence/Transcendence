from PIL import Image

def hex_to_rgb(hex_color):
    # Strip the leading '#' if present
    hex_color = hex_color.lstrip('#')
    # Convert the hex string to an integer tuple (R, G, B)
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def replace_color(image_path, target_hex_color, replacement_hex_color, output_path):
    # Convert HTML color notation to RGB
    target_color = hex_to_rgb(target_hex_color)
    replacement_color = hex_to_rgb(replacement_hex_color)
    
    # Open an image file
    with Image.open(image_path) as img:
        # Convert the image to RGBA (if it isn't already in this mode)
        img = img.convert("RGBA")
        datas = img.getdata()

        new_data = []
        for item in datas:
            # Replace the target color with the replacement color
            if item[:3] == target_color:
                new_data.append((*replacement_color, item[3]))
            else:
                new_data.append(item)

        # Update image data
        img.putdata(new_data)

        # Save the new image
        img.save(output_path)

target_hex_color = [  "333892", "232774", "323243", "1d1d39", "1f0d60" ]
replacement_hex_color = [  "923333", "742323", "433232", "ff9999", "600d0d" ]

# # Call the function
n = 0
while n < 5:
	replace_color('normal/Attack1.png', target_hex_color[n], replacement_hex_color[n], 'normal/Attack1.png')
	replace_color('normal/Attack2.png', target_hex_color[n], replacement_hex_color[n], 'normal/Attack2.png')
	replace_color('normal/Death.png', target_hex_color[n], replacement_hex_color[n], 'normal/Death.png')
	replace_color('normal/Fall.png', target_hex_color[n], replacement_hex_color[n], 'normal/Fall.png')
	replace_color('normal/Idle.png', target_hex_color[n], replacement_hex_color[n], 'normal/Idle.png')
	replace_color('normal/Jump.png', target_hex_color[n], replacement_hex_color[n], 'normal/Jump.png')
	replace_color('normal/Run.png', target_hex_color[n], replacement_hex_color[n], 'normal/Run.png')
	replace_color('normal/TakeHit-silhouette.png', target_hex_color[n], replacement_hex_color[n], 'normal/TakeHit-silhouette.png')

	replace_color('inverted/Attack1.png', target_hex_color[n], replacement_hex_color[n], 'inverted/Attack1.png')
	replace_color('inverted/Attack2.png', target_hex_color[n], replacement_hex_color[n], 'inverted/Attack2.png')
	replace_color('inverted/Death.png', target_hex_color[n], replacement_hex_color[n], 'inverted/Death.png')
	replace_color('inverted/Fall.png', target_hex_color[n], replacement_hex_color[n], 'inverted/Fall.png')
	replace_color('inverted/Idle.png', target_hex_color[n], replacement_hex_color[n], 'inverted/Idle.png')
	replace_color('inverted/Jump.png', target_hex_color[n], replacement_hex_color[n], 'inverted/Jump.png')
	replace_color('inverted/Run.png', target_hex_color[n], replacement_hex_color[n], 'inverted/Run.png')
	n += 1