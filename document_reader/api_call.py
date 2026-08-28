import base64
import io
import os

from typing import Optional, List, Dict, Any

from dotenv import load_dotenv
from pydantic import BaseModel, Field

from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

GOOGLE_API_KEY=os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError(
        "GOOGLE_API_KEY not found in .env file"
    )

class DocumentInfo(BaseModel):
    type: Optional[str]=Field(
        default=None,
        description=(
            "Type of document, such as Lab Test Report, "
            "Urinalysis Report, Stool Examination, "
            "Biochemistry Report, Radiology Report, etc."
        )
    )

    date:Optional[str]=Field(
        default=None,
        description=(
            "Report date,collection date, "
            "reported date, or other primary report date "
            "exactly as visible."
        )
    )

    title: Optional[str]=Field(
        default=None,
        description=(
            "Title of the report or investigation."
        )
    )
    facility: Optional[str] = Field(
        default=None,
        description=(
            "Hospital, laboratory, diagnostic centre, "
            "clinic, imaging centre, or other medical facility."
        )
    )


class PatientInfo(BaseModel):

    name: Optional[str] = Field(
        default=None
    )

    age: Optional[str] = Field(
        default=None
    )

    gender: Optional[str] = Field(
        default=None
    )

    patient_id: Optional[str] = Field(
        default=None,
        description=(
            "Patient ID, UHID, registration ID, "
            "accession ID, MRN, barcode number, "
            "or equivalent primary patient identifier."
        )
    )


class ReferringDoctor(BaseModel):

    name: Optional[str] = Field(
        default=None
    )

    specialization: Optional[str] = Field(
        default=None
    )


class ReportingDoctor(BaseModel):

    name: Optional[str] = Field(
        default=None
    )

    specialization: Optional[str] = Field(
        default=None
    )

    role: Optional[str] = Field(
        default=None,
        description=(
            "Role such as Pathologist, Radiologist, "
            "Consultant, Reporting Doctor, Verified By, "
            "Prepared By, etc."
        )
    )


class TestResult(BaseModel):

    category: Optional[str] = Field(
        default=None,
        description=(
            "Section/category containing the result, "
            "such as Physical Examination, Chemical Examination, "
            "Microscopic Examination, Blood Indices, "
            "Differential WBC Count, Liver Function Test, "
            "Kidney Function Test, etc."
        )
    )

    testName: Optional[str] = Field(
        default=None,
        description=(
            "Exact name of the test or measured parameter."
        )
    )

    value: Optional[str] = Field(
        default=None,
        description=(
            "Exact patient/result value as printed. "
            "Preserve symbols such as <, >, +, -, ++, +++, "
            "Negative, Trace, etc."
        )
    )

    unit: Optional[str] = Field(
        default=None,
        description=(
            "Unit if explicitly shown."
        )
    )

    referenceRange: Optional[str] = Field(
        default=None,
        description=(
            "Reference or normal range corresponding "
            "to this particular result."
        )
    )

    status: Optional[str] = Field(
        default=None,
        description=(
            "Status only when explicitly printed by the report, "
            "such as Normal, High, Low, Positive, Negative, "
            "Abnormal. Never calculate it."
        )
    )

    timepoint: Optional[str] = Field(
        default=None,
        description=(
            "Timepoint when relevant, such as Time 0, "
            "Peak, Before, After stimulation, etc."
        )
    )

    ageGroup: Optional[str] = Field(
        default=None,
        description=(
            "Age or developmental-stage grouping when "
            "the report contains multiple age groups."
        )
    )

    method: Optional[str] = Field(
        default=None,
        description=(
            "Testing method or methodology if explicitly "
            "associated with this particular result."
        )
    )


class Medication(BaseModel):

    name: Optional[str] = None

    dose: Optional[str] = None

    route: Optional[str] = None

    frequency: Optional[str] = None

    duration: Optional[str] = None

    instructions: Optional[str] = None


class Observation(BaseModel):

    text: Optional[str] = Field(
        default=None
    )

    type: Optional[str] = Field(
        default=None,
        description=(
            "Type such as interpretation, comment, note, "
            "warning, clinical observation, report remark, "
            "disclaimer, etc."
        )
    )


class FollowUp(BaseModel):

    required: bool = False

    date: Optional[str] = None

    instructions: Optional[str] = None


class MedicalReport(BaseModel):

    document: DocumentInfo = Field(default_factory=DocumentInfo)

    patient: PatientInfo = Field(default_factory=PatientInfo)

    diagnoses: List[str] = Field(default_factory=list)

    symptoms: List[str] = Field(default_factory=list)

    testResults: List[TestResult] = Field(default_factory=list)

    medications: List[Medication] = Field(default_factory=list)

    referringDoctor: Optional[ReferringDoctor] = None

    reportingDoctors: List[ReportingDoctor] = Field(default_factory=list)

    observations: List[Observation] = Field(default_factory=list)

    followUp: FollowUp = Field(default_factory=FollowUp)

    additionalData: Dict[str, Any] = Field(
        default_factory=dict,
        description=(
            "Important information visible in the report "
            "that does not naturally fit the universal schema."
        )
    )

llm = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
    google_api_key=GOOGLE_API_KEY,
    temperature=0,
    max_output_tokens=8192,
    thinking_level="minimal",
)

structured_llm = llm.with_structured_output(
    MedicalReport
)
chain = structured_llm

def image_to_data_url(image) -> str:
    """
    Convert the preprocessed PIL RGB image into
    a PNG data URL suitable for Gemini.
    """

    buffer = io.BytesIO()

    image.save(
        buffer,
        format="PNG"
    )

    encoded = base64.b64encode(
        buffer.getvalue()
    ).decode("utf-8")

    return f"data:image/png;base64,{encoded}"

PROMPT = """
You are an expert medical-document information extraction system.

Your ONLY task is to extract information that is visibly present
in the supplied medical report image and place it into the
provided structured schema.

Do NOT diagnose the patient.

Do NOT give medical advice.

Do NOT calculate medical interpretations.

Do NOT invent missing information.

============================================================
1. GENERAL EXTRACTION RULES
============================================================

1. Extract ALL clearly visible and relevant information.

2. Medical reports can have completely different layouts,
   terminology, sections, tables, and field names.

3. Do NOT assume a fixed report format.

4. Understand information by its meaning and context.

5. Preserve the original wording whenever practical.

6. If information is not visible, use null or an empty list.

7. Never guess unreadable information.

8. Do not silently correct values.

9. Do not diagnose diseases from test values.

10. Do not calculate whether a value is medically normal or abnormal.

============================================================
2. PATIENT INFORMATION
============================================================

Extract:

- patient name
- age
- gender/sex
- patient ID
- UHID
- MRN
- registration number
- accession number
- barcode number
- other important patient identifiers

Put the primary patient identifier into patient.patient_id.

Put additional identifiers into additionalData.

============================================================
3. DOCUMENT INFORMATION
============================================================

Extract:

- report type
- document type
- report title
- investigation title
- report date
- facility name

A facility may be:

- hospital
- laboratory
- pathology laboratory
- diagnostic centre
- clinic
- imaging centre

Do not automatically call every facility a hospital.

============================================================
4. TEST RESULTS
============================================================

Every individual measurable result or explicitly reported
examination finding should normally become ONE item in
testResults.

Examples include:

CBC:

- Hemoglobin
- RBC
- WBC
- MCV
- MCH
- MCHC
- RDW
- Platelets
- Neutrophils
- Lymphocytes

Urinalysis:

- Color
- Odor
- Aspect
- Reaction
- Protein
- Sugar
- Specific Gravity
- Pus Cells
- RBCs
- Bacteria

Stool examination:

- Consistency
- Colour
- Mucus
- Blood
- Pus
- Parasite
- RBCs
- Pus Cells
- Ova
- Cyst
- Bacteria

Hormone/endocrine reports:

- FSH
- LH
- Estradiol
- TSH
- PRL
- Cortisol
- ACTH
- GH
- IGF-I

Biochemistry:

- Bilirubin
- AST
- ALT
- ALP
- Urea
- Creatinine
- Sodium
- Potassium
- Calcium
- etc.

============================================================
5. TEST RESULT FIELDS
============================================================

For each result, preserve whenever visible:

- category
- testName
- value
- unit
- referenceRange
- status
- timepoint
- ageGroup
- method

Do NOT invent missing fields.

============================================================
6. PRESERVE VALUES EXACTLY
============================================================

Preserve the value as it appears.

Examples:

"<0.5"

">10"

"++"

"+++"

"Negative"

"Positive"

"Trace"

"6 - 8"

"0.17 (2.2)"

"13.00"

must preserve their original representation.

Do not unnecessarily convert values into numbers.

============================================================
7. REFERENCE RANGE
============================================================

Attach the correct reference range to the corresponding result.

Example:

Hemoglobin:

value = "13.00"

referenceRange = "13.00 - 17.00"

Do NOT create a separate test result just for a reference range.

Do NOT mix reference ranges between neighboring rows.

============================================================
8. STATUS
============================================================

Only extract status when the report explicitly provides it.

Examples:

"Normal"

"High"

"Low"

"Positive"

"Negative"

"Abnormal"

If the report does not explicitly provide a status:

status = null

DO NOT calculate status.

For example:

value = "20000"

referenceRange = "150000 - 410000"

does NOT mean:

status = "Low"

unless the report itself explicitly says "Low".

============================================================
9. MULTIPLE TIMEPOINTS
============================================================

Some reports contain tables like:

FSH

Time 0 = 4.9

Peak = 6.8

Create:

{
    "testName": "FSH",
    "timepoint": "Time 0",
    "value": "4.9"
}

and:

{
    "testName": "FSH",
    "timepoint": "Peak",
    "value": "6.8"
}

Do NOT create:

testName = "Peak"

"Peak" is the timepoint, not the test name.

Preserve the relationship between the parent test and its
timepoint rows.

============================================================
10. MULTIPLE AGE GROUPS
============================================================

If the report contains:

2 months

4 months (euthyroid)

11.3 yr (Tanner stage B2)

12 yr (at menarche)

associate every result with the correct ageGroup.

Example:

{
    "testName": "FSH",
    "ageGroup": "11.3 yr (Tanner stage B2)",
    "timepoint": "Time 0",
    "value": "4.9"
}

Do NOT attach every result to the first age group.

============================================================
11. SECTION / CATEGORY
============================================================

Preserve meaningful report sections.

Examples:

"Physical Examination"

"Chemical Examination"

"Microscopic Examination"

"Blood Indices"

"Differential WBC Count"

"Liver Function Test"

"Kidney Function Test"

Use the category field to preserve this relationship.

============================================================
12. METHOD
============================================================

If a testing method is explicitly shown and can be associated
with a specific test, place it in method.

Examples:

"Calculated"

"Electrical Impedance, VCS"

"Immunoturbidimetry"

"IFCC(Modified)"

Do not invent methods.

============================================================
13. DOCTORS
============================================================

Distinguish between referring doctors and reporting doctors.

If the report says:

"Ref. By: Dr. Hiren Shah"

then:

referringDoctor.name = "Dr. Hiren Shah"

Do not automatically place that doctor into reportingDoctors.

If doctors are shown as:

Dr. Payal Shah
MD, Pathologist

Dr. Vimal Shah
MD, Pathologist

put them into reportingDoctors.

Preserve their roles and specializations when visible.

============================================================
14. MEDICATIONS
============================================================

Only extract medications explicitly mentioned in the report.

Do not infer medications.

If a report says:

"On 25 mg L-T4 therapy"

preserve that information.

============================================================
15. OBSERVATIONS
============================================================

Use observations for important textual information such as:

- interpretation
- comments
- warnings
- clinical observations
- report remarks
- special instructions
- disclaimers

Example:

"Further confirm for Anemia"

should be preserved as an observation.

============================================================
16. ADDITIONAL DATA
============================================================

Medical reports contain important information that may not fit
the universal schema.

DO NOT DISCARD IT.

Use additionalData for information such as:

- UHID
- registration number
- accession number
- barcode
- sample type
- specimen type
- collection location
- sample collector
- registration date/time
- collection date/time
- reported date/time
- generated date/time
- turnaround time
- laboratory address
- laboratory phone
- laboratory email
- laboratory website
- instrument
- technician
- page number
- page information
- QR verification information
- report-specific metadata
- signatures
- accreditation
- GSTIN
- other visible administrative information

============================================================
17. INFORMATION PRESERVATION
============================================================

The universal schema is NOT intended to represent every possible
field of every medical report.

Therefore:

MAIN SCHEMA
=
information that naturally fits the universal medical model.

additionalData
=
important report-specific information that does not naturally
fit the universal schema.

Never discard visible information merely because the report
uses a different field name or layout.

============================================================
18. TABLE STRUCTURE
============================================================

Pay special attention to tables.

A value must remain associated with:

- its correct test
- its correct unit
- its correct reference range
- its correct category
- its correct timepoint
- its correct age group

Do not shift values between neighboring rows.

Do not merge unrelated rows.

Do not lose parent-child relationships.

============================================================
19. EXTRACTION ONLY
============================================================

You are extracting the document.

You are NOT:

- diagnosing
- interpreting
- calculating
- recommending treatment
- recommending medication
- recommending follow-up
- judging whether a result is clinically significant

Only preserve what the document says.

============================================================
20. FINAL RULE
============================================================

Accuracy and information preservation are more important than
making the JSON look simple.

Extract the best faithful representation of everything relevant
that is actually visible in the image.
"""

def extract_medical_report(image) -> MedicalReport:
    """
    Receive a preprocessed PIL RGB image and extract
    structured medical information using Gemini.

    Parameters
    ----------
    image:
        PIL.Image.Image

    Returns
    -------
    MedicalReport
        Pydantic structured medical report.
    """
    try:
        from PIL import Image
        if not isinstance(image, Image.Image):
            raise TypeError("extract_medical_report() expects a PIL Image.")
    except ImportError:
        raise ImportError("Pillow is required.")

    image_data_url=image_to_data_url(image)

    message = [
        {
            "type": "text",
            "text": PROMPT
        },
        {
            "type": "image_url",
            "image_url": {
                "url": image_data_url
            }
        }
    ]
    print(
        "\nSending preprocessed image to Gemini..."
    )
    result = chain.invoke(
        [
            {
                "role": "user",
                "content": message
            }
        ]
    )
    print(
        "Gemini extraction complete."
    )
    return result


# def print_result(result: MedicalReport):
#     """
#     Pretty-print the extracted MedicalReport.
#     """

#     print("\n")

#     print(
#         "=" * 100
#     )

#     print(
#         "STRUCTURED MEDICAL REPORT"
#     )

#     print(
#         "=" * 100
#     )

#     print(
#         result.model_dump_json(
#             indent=2,
#             ensure_ascii=False
#         )
#     )

#     print(
#         "=" * 100
#     )