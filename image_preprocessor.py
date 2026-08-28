import cv2

def resize_image(image,max_width=2000,max_height=2000):
    height,width=image.shape[:2]
    scale=min(max_width/width,max_height/height,1)
    new_width=int(width*scale)
    new_height=int(height*scale)
    resized_image = cv2.resize(image,(new_width, new_height),interpolation=cv2.INTER_AREA)
    return resized_image

