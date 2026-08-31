from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware

from analyzer import analyze_report


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="Medical Report Analyzer API",
    description="Analyzes backend-formatted medical reports.",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

# Allows your frontend to call this API from the browser.
# For development/testing, allow all origins.

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():

    return {
        "status": "ok",
        "service": "medical-report-analyzer"
    }


# ============================================================
# ANALYZE MEDICAL REPORT
# ============================================================

@app.post(
    "/analyze-report",
    response_class=PlainTextResponse
)
async def analyze_medical_report(request: Request):

    try:

        # ----------------------------------------------------
        # RECEIVE EXACT JSON FROM BACKEND
        # ----------------------------------------------------

        report = await request.json()

        # ----------------------------------------------------
        # VALIDATE
        # ----------------------------------------------------

        if not isinstance(report, dict):

            raise HTTPException(
                status_code=400,
                detail="Medical report must be a JSON object."
            )

        if not report:

            raise HTTPException(
                status_code=400,
                detail="Medical report is empty."
            )

        # ----------------------------------------------------
        # OPTIONAL LOGGING
        # ----------------------------------------------------

        print("\n" + "=" * 80)
        print("NEW MEDICAL REPORT RECEIVED")
        print("=" * 80)

        print("Report keys:")
        print(list(report.keys()))

        print("\nAnalyzing medical report...")

        # ----------------------------------------------------
        # SEND EXACT BACKEND JSON TO ANALYZER
        # ----------------------------------------------------

        summary = analyze_report(report)

        # ----------------------------------------------------
        # VALIDATE GEMINI RESPONSE
        # ----------------------------------------------------

        if not summary:

            raise HTTPException(
                status_code=500,
                detail="Analyzer returned an empty response."
            )

        # ----------------------------------------------------
        # PRINT SUMMARY ON SERVER
        # ----------------------------------------------------

        print("\n" + "=" * 80)
        print("MEDICAL REPORT SUMMARY")
        print("=" * 80)
        print()

        print(summary)

        print("\n" + "=" * 80)

        # ----------------------------------------------------
        # RETURN PLAIN TEXT TO FRONTEND
        # ----------------------------------------------------

        return summary

    except HTTPException:

        raise

    except Exception as e:

        print("\n" + "=" * 80)
        print("ERROR")
        print("=" * 80)

        print(str(e))

        raise HTTPException(
            status_code=500,
            detail="Failed to analyze medical report."
        )