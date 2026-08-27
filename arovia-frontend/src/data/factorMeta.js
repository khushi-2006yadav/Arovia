import { Droplet, Zap, HeartPulse, Scale, Flame } from "lucide-react";

// Single source of truth for how each health factor is displayed
// (icon, color, card tint) across HealthAnalysis and Comparison.
export const factorMeta = {
  Hemoglobin: { icon: Droplet, color: "#e11d48", tint: "coral" },
  "Blood Sugar (Fasting)": { icon: Zap, color: "#d97706", tint: "amber" },
  "Blood Pressure (Systolic)": {
    icon: HeartPulse,
    color: "#7c3aed",
    tint: "purple",
  },
  BMI: { icon: Scale, color: "#0d9488", tint: "teal" },
  Cholesterol: { icon: Flame, color: "#db2777", tint: "pink" },
};

export const factors = Object.keys(factorMeta);
