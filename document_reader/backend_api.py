import os
import requests
from dotenv import load_dotenv

load_dotenv()

BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL")
if not BACKEND_BASE_URL:
    raise ValueError(
        "BACKEND_BASE_URL not found in .env file"
    )

BACKEND_BASE_URL = (BACKEND_BASE_URL.rstrip("/"))
BACKEND_MEDICAL_RECORD_PATH = os.getenv("BACKEND_MEDICAL_RECORD_PATH")
if not BACKEND_MEDICAL_RECORD_PATH:
    raise ValueError(
        "BACKEND_MEDICAL_RECORD_PATH "
        "not found in .env file"
    )
BACKEND_MEDICAL_RECORD_PATH = (
    "/" +
    BACKEND_MEDICAL_RECORD_PATH.strip("/")
)
def save_medical_record(payload,token):
    """
    Send a medical record to the backend REST API.
    Parameters
    ----------
    payload : dict
        Backend-compatible MedicalRecord JSON.
    token : str
        JWT authentication token.
    Returns
    -------
    dict
        Backend response.
    """
    url=(BACKEND_BASE_URL+BACKEND_MEDICAL_RECORD_PATH)
    headers={
        "Authorization":f"Bearer {token}",
        "Content-Type":"application/json",
        "Accept":"application/json"
    }
    print("\nSending medical record to backend...")
    print(f"POST {url}")
    response = requests.post(
        url,
        json=payload,
        headers=headers,
        timeout=30
    )
    print(
        f"Backend status code: "
        f"{response.status_code}"
    )
    if not response.ok:
        print("\nBackend returned an error:")
        print(response.text)
        response.raise_for_status()
    print("Medical record saved successfully.")
    try:
        return response.json()
    except ValueError:
        return {
            "status_code":response.status_code,
            "response":response.text
        }