import cv2

def read_image(image_path):
    image=cv2.imread(image_path)
    if(image is None):
        raise FileNotFoundError(
            f"could not read image from path : {image_path}"
        )
    return image