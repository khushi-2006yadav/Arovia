from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

from analyzer import analyze_health_snapshot


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="Arovia Health Snapshot Analyzer"
)


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():

    return {
        "status": "ok"
    }


# ============================================================
# ANALYZE HEALTH SNAPSHOT
# ============================================================

@app.post("/analyze-health-snapshot")
async def analyze_health_snapshot_api(
    health_snapshot: dict
):

    try:

        print("\n" + "=" * 80)
        print("NEW HEALTH SNAPSHOT")
        print("=" * 80)

        print(
            "Received health snapshot from frontend."
        )


        # ====================================================
        # BASIC VALIDATION
        # ====================================================

        if not health_snapshot:

            raise HTTPException(

                status_code=400,

                detail="Health snapshot cannot be empty."

            )


        # ====================================================
        # CHECK EXPECTED FIELDS
        # ====================================================

        expected_fields = {
            "heightCm",
            "weightKg",
            "bmi",
            "bloodGroup",
            "activeDiseases",
            "trends"
        }

        missing_fields = [

            field

            for field in expected_fields

            if field not in health_snapshot

        ]


        if missing_fields:

            raise HTTPException(

                status_code=400,

                detail={
                    "message": "Invalid health snapshot.",
                    "missingFields": missing_fields
                }

            )


        # ====================================================
        # ANALYZE HEALTH SNAPSHOT
        # ====================================================

        print(
            "\nAnalyzing health snapshot..."
        )

        summary = analyze_health_snapshot(
            health_snapshot
        )


        # ====================================================
        # VALIDATE ANALYZER RESPONSE
        # ====================================================

        if not isinstance(summary, str):

            summary = str(summary)


        if not summary.strip():

            raise HTTPException(

                status_code=500,

                detail="Analyzer returned an empty response."

            )


        # ====================================================
        # PRINT SUMMARY
        # ====================================================

        print("\n")

        print("=" * 80)

        print(
            "HEALTH SNAPSHOT SUMMARY"
        )

        print("=" * 80)

        print()

        print(summary)


        # ====================================================
        # RETURN SUMMARY TO FRONTEND
        # ====================================================

        return JSONResponse(

            status_code=200,

            content={

                "success": True,

                "message": (
                    "Health snapshot analyzed "
                    "successfully."
                ),

                "summary": summary

            }

        )


    except HTTPException:

        raise


    except Exception as e:

        print("\nERROR:")

        print(
            str(e)
        )

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )