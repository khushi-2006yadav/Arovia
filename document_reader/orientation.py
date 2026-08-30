import os
import base64
from io import BytesIO
from typing import Literal

import numpy as np
from PIL import Image

from dotenv import load_dotenv

from pydantic import BaseModel, Field

from langchain_google_genai import ChatGoogleGenerativeAI

from langchain_core.prompts import ChatPromptTemplate

from langchain_core.output_parsers import PydanticOutputParser

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in .env file")

class OrientationResult(BaseModel):
    orientation:Literal[0,90,180,270]=Field(
        description=(
            "Clockwise rotation required to make "
            "the document upright."
        )
    )

model=ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
    google_api_key=GOOGLE_API_KEY,
    temperature=0,
    max_output_tokens=50,
    thinking_level="minimal",
)

parser = PydanticOutputParser(pydantic_object=OrientationResult)

template=ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
You are a document orientation detection system.

Look at the supplied medical document image.

Determine how much the image needs to be rotated CLOCKWISE
to make the document upright.

Allowed values:

0   = already upright
90  = rotate clockwise 90 degrees
180 = rotate clockwise 180 degrees
270 = rotate clockwise 270 degrees

Return ONLY the requested structured output.

Do not explain your answer.

{format_instructions}
"""
        ),
        (
            "human",
            [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "{image}"
                    }
                }
            ]
        )

    ]
)

prompt=template.partial(format_instructions=(parser.get_format_instructions()))

chain = prompt | model | parser

def to_pil_image(image):
    if isinstance(image, Image.Image):
        return image.convert("RGB")
    
    if isinstance(image, np.ndarray):
        if len(image.shape) == 3:
            image = image[:, :, ::-1]
        return Image.fromarray(image).convert("RGB")
    raise TypeError(
        f"Unsupported image type: {type(image)}"
    )

def pil_to_data_url(image):
    buffer = BytesIO()
    image.save(
        buffer,
        format="JPEG",
        quality=90
    )

    encoded=base64.b64encode(buffer.getvalue()).decode("utf-8")

    return ("data:image/jpeg;base64,"+ encoded)

def detect_orientation(image):
    image = to_pil_image(image)

    image_data_url=pil_to_data_url(image)

    print("Sending image to Gemini for orientation detection...")
    result=chain.invoke({"image": image_data_url})

    print(
        f"Detected orientation: "
        f"{result.orientation}°"
    )
    return result.orientation

def correct_orientation(image):
    image = to_pil_image(image)
    orientation=detect_orientation(image)
    if orientation==0:
        corrected=image
    elif orientation==90:
        corrected=image.rotate(-90,expand=True)
    elif orientation==180:
        corrected=image.rotate(180,expand=True)
    elif orientation==270:
        corrected=image.rotate(-270,expand=True)
    else:
        raise ValueError(
            f"Invalid orientation: {orientation}"
        )
    print(
        "Image orientation corrected."
    )
    return corrected