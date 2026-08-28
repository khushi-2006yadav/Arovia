import json
from datetime import datetime

def safe_string(value):
    """
    Convert a value to String while preserving None.
    """
    if value is None:
        return None
    return str(value)

def convert_to_backend_date(date_string):
    """
    Convert the date extracted by Gemini into the format
    expected by Java LocalDate.

    Example:

    27-Oct-2019 07:30 AM
            ↓
    2019-10-27
    """

    if not date_string:
        return None

    try:
        datetime.strptime(
            date_string,
            "%Y-%m-%d"
        )
        return date_string
    except ValueError:
        pass

    possible_formats = [
        "%d-%b-%Y %I:%M %p",
        "%d-%b-%Y",
        "%d/%m/%Y",
        "%d/%b/%Y",
        "%d-%m-%Y",
    ]


    for fmt in possible_formats:
        try:
            parsed_date = datetime.strptime(date_string,fmt)
            return parsed_date.strftime("%Y-%m-%d")
        
        except ValueError:
            continue
    print(f"WARNING: Could not convert date: {date_string}")
    return None

def map_test_result(test):
    """
    Convert one Gemini TestResult into the backend
    TestResult structure.

    IMPORTANT:
    value is now String in the backend.
    """
    return {
        "category": safe_string(test.get("category")),
        "testName": safe_string(test.get("testName")),
        "value": safe_string(test.get("value")),
        "unit": safe_string(test.get("unit")),
        "referenceRange": safe_string(test.get("referenceRange")),
        "status": test.get("status"),
        "ageGroup": safe_string(test.get("ageGroup")),
        "method": safe_string(test.get("method")),
        "timepoint": safe_string(test.get("timepoint")),
    }

def map_diagnoses(diagnoses):
    """
    Python/Gemini:
        diagnoses = [
            "Anemia"
        ]
    Backend:
        diagnoses = [
            {
                "name": "Anemia",
                "confidence": null
            }
        ]
    We never invent confidence.
    """
    result = []
    for diagnosis in diagnoses or []:
        if isinstance(diagnosis,dict):
            result.append(
                {
                    "name": diagnosis.get("name"),
                    "confidence": diagnosis.get("confidence")
                }
            )
        else:
            result.append(
                {
                    "name": safe_string(diagnosis),
                    "confidence": None
                }
            )
    return result

def map_medications(medications):
    """
    Convert Gemini medication objects into backend
    MedicationInfo objects.

    This assumes the backend MedicationInfo uses the
    same basic fields as the extraction schema.

    If your backend MedicationInfo has different fields,
    only this function needs to be adjusted.
    """
    result = []
    for medication in medications or []:
        if not isinstance(medication,dict):
            continue
        result.append(
            {
                "name": medication.get("name"),
                "dose": medication.get("dose"),
                "route": medication.get("route"),
                "frequency": medication.get("frequency"),
                "duration": medication.get("duration"),
                "instructions": medication.get("instructions")
            }
        )
    return result

def map_doctor(report):
    """
    Backend MedicalRecord has one Doctor.

    Gemini extraction has:

        referringDoctor
        reportingDoctors

    Prefer a reporting doctor if available.
    Otherwise use referringDoctor.
    """

    reporting_doctors = report.get("reportingDoctors",[])
    referring_doctor = report.get("referringDoctor")

    if reporting_doctors:
        doctor = reporting_doctors[0]
        return {
            "name": doctor.get("name"),
            "specialization": doctor.get("specialization")
        }
    if referring_doctor:
        return {
            "name": referring_doctor.get("name"),
            "specialization": referring_doctor.get("specialization")
        }


    return None

def build_observations(report):
    """
    Backend:
        String observations
    Gemini:
        List[Observation]
    Therefore convert the list into a JSON string.
    """
    observations = report.get("observations",[])
    if not observations:
        return None
    
    return json.dumps(observations,ensure_ascii=False)

def build_additional_details(report):
    """
    Backend:
        String additionalDetails
    Gemini:
        Dict additionalData
    Convert additionalData into JSON text so that
    no information is lost.
    """
    additional_data = report.get("additionalData",{})
    if not additional_data:
        return None

    return json.dumps(additional_data,ensure_ascii=False)

def medical_report_to_backend_payload(report,user_id):
    """
    Convert the complete Gemini MedicalReport dictionary
    into the JSON structure expected by the backend.
    """
    document = report.get("document",{})
    test_results = []
    for test in report.get("testResults",[]):
        test_results.append(map_test_result(test))
    payload = {
        "userId": user_id,
        "recordType": "LAB_REPORT",
        "recordDate": convert_to_backend_date(document.get("date")),
        "title": document.get("title"),
        "diagnoses": map_diagnoses(report.get("diagnoses",[])),
        "testResults": test_results,
        "medications": map_medications(report.get("medications",[])),
        "doctor": map_doctor(report),
        "observations": build_observations(report),
        "additionalDetails": build_additional_details(report)
    }
    return payload