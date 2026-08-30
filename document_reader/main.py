from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse

import tempfile
import os
import json

from image_reader import read_image
from image_preprocessor import resize_image
from orientation import correct_orientation

from api_call import extract_medical_report

from backend_mapper import medical_report_to_backend_payload

from backend_api import save_medical_record

app = FastAPI(title="Arovia Medical Document Reader")

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/extract-medical-report")
async def extract_medical_report_api(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    token: str = Form(...)
):

    try:

        print("\n" + "=" * 80)
        print("NEW MEDICAL REPORT")
        print("=" * 80)
        print(f"Filename: {file.filename}")
        print(f"Content type: {file.content_type}")
        print(f"User ID: {user_id}")
        allowed_types = {
            "image/jpeg",
            "image/png",
            "image/webp"
        }
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Only JPEG, PNG and WEBP images are supported."
            )
        image_bytes = await file.read()
        if not image_bytes:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty."
            )
        suffix=os.path.splitext(file.filename or "")[1]
        with tempfile.NamedTemporaryFile(delete=False,suffix=suffix) as temp_file:
            temp_file.write(image_bytes)
            temp_image_path = temp_file.name
        try:
            print("\nReading image...")
            image=read_image(temp_image_path)
            print("Resizing image...")
            image = resize_image(image)
            print("Checking image orientation...")
            image = correct_orientation(image)
            print("\nExtracting medical information...")
            result = extract_medical_report(image)
            report_dict = result.model_dump()
            backend_payload = (medical_report_to_backend_payload(report_dict,user_id))
            print("\n")
            print("=" * 80)
            print("EXTRACTED MEDICAL REPORT")
            print("=" * 80)
            print(
                json.dumps(
                    report_dict,
                    indent=2,
                    ensure_ascii=False
                )
            )
            print("\n")
            print("=" * 80)
            print("BACKEND PAYLOAD")
            print("=" * 80)
            print(
                json.dumps(
                    backend_payload,
                    indent=2,
                    ensure_ascii=False
                )
            )
            print("\nSending data to backend...")
            backend_response = save_medical_record(backend_payload,token)
            return JSONResponse(
                status_code=200,
                content={
                    "success": True,
                    "message": "Medical report processed successfully.",
                    "extracted_report": report_dict,
                    "backend_response": backend_response
                }
            )
        finally:
            if os.path.exists(temp_image_path):
                os.remove(temp_image_path)

    except HTTPException:
        raise
    except Exception as e:
        print("\nERROR:")
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )