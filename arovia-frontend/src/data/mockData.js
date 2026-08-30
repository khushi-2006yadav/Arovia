export const currentUser = {
  userId: "USR-20250114",
  name: "User",
  avatar: null,
  email: "user@example.com",
  phone: "+91 98765 432**",
  dob: "14 Mar 1998",
  bloodGroup: "O+",
  gender: "Female",
  weight: "58 kg",
  height: "162 cm",
  location: "Noida, Uttar Pradesh",
  pastChronicDiseases: ["Mild Anemia"],
  familyDiseases: ["Diabetes (Father)", "Hypertension (Mother)"],
  createdAt: "14 Jan 2025",
  updatedAt: "20 Aug 2026",
};

export const stats = [
  { id: "records", label: "Medical Records", value: 12, color: "blue" },
  { id: "medicines", label: "Active Medicines", value: 4, color: "green" },
  { id: "normal", label: "Normal Parameters", value: 8, color: "purple" },
  { id: "attention", label: "Need Attention", value: 2, color: "red" },
];

export const chartSeries = {
  label: "Hemoglobin",
  unit: "g/dL",
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
  points: [11.6, 12.4, 11.4, 12.8, 11.9, 12.4, 11.6, 13.0],
};

export const healthTrends = {
  Hemoglobin: {
    unit: "g/dL",
    normalRange: [12, 16],
    data: [
      { date: "Jan 2026", value: 11.2 },
      { date: "Feb 2026", value: 11.5 },
      { date: "Mar 2026", value: 10.9 },
      { date: "Apr 2026", value: 11.8 },
      { date: "May 2026", value: 12.1 },
      { date: "Jun 2026", value: 11.6 },
      { date: "Jul 2026", value: 11.9 },
      { date: "Aug 2026", value: 11.8 },
    ],
  },
  "Blood Sugar (Fasting)": {
    unit: "mg/dL",
    normalRange: [70, 100],
    data: [
      { date: "Jan 2026", value: 96 },
      { date: "Feb 2026", value: 102 },
      { date: "Mar 2026", value: 99 },
      { date: "Apr 2026", value: 108 },
      { date: "May 2026", value: 101 },
      { date: "Jun 2026", value: 94 },
      { date: "Jul 2026", value: 97 },
      { date: "Aug 2026", value: 100 },
    ],
  },
  "Blood Pressure (Systolic)": {
    unit: "mmHg",
    normalRange: [90, 120],
    data: [
      { date: "Jan 2026", value: 118 },
      { date: "Feb 2026", value: 122 },
      { date: "Mar 2026", value: 119 },
      { date: "Apr 2026", value: 126 },
      { date: "May 2026", value: 121 },
      { date: "Jun 2026", value: 117 },
      { date: "Jul 2026", value: 120 },
      { date: "Aug 2026", value: 119 },
    ],
  },
  BMI: {
    unit: "kg/m²",
    normalRange: [18.5, 24.9],
    data: [
      { date: "Jan 2026", value: 23.1 },
      { date: "Feb 2026", value: 23.4 },
      { date: "Mar 2026", value: 23.0 },
      { date: "Apr 2026", value: 22.8 },
      { date: "May 2026", value: 22.6 },
      { date: "Jun 2026", value: 22.9 },
      { date: "Jul 2026", value: 22.7 },
      { date: "Aug 2026", value: 22.5 },
    ],
  },
  Cholesterol: {
    unit: "mg/dL",
    normalRange: [125, 200],
    data: [
      { date: "Jan 2026", value: 188 },
      { date: "Feb 2026", value: 195 },
      { date: "Mar 2026", value: 202 },
      { date: "Apr 2026", value: 210 },
      { date: "May 2026", value: 198 },
      { date: "Jun 2026", value: 190 },
      { date: "Jul 2026", value: 185 },
      { date: "Aug 2026", value: 182 },
    ],
  },
};
export const healthyPerson = {
  Hemoglobin: { value: 14.0, note: "Mid-range for a healthy adult" },
  "Blood Sugar (Fasting)": {
    value: 85,
    note: "Well within normal fasting range",
  },
  "Blood Pressure (Systolic)": {
    value: 112,
    note: "Optimal, low cardiovascular risk",
  },
  BMI: { value: 21.5, note: "Middle of the healthy weight range" },
  Cholesterol: { value: 165, note: "Comfortably below the risk threshold" },
};

export const quickActions = [
  {
    id: "upload",
    label: "Upload Report",
    sub: "Add your medical documents",
    color: "blue",
  },
  {
    id: "scan",
    label: "Scan Prescription",
    sub: "Digitize with AI",
    color: "cyan",
  },
  {
    id: "alternatives",
    label: "Find Alternatives",
    sub: "Explore generic options",
    color: "green",
  },
  {
    id: "insights",
    label: "Get Insights",
    sub: "Understand your reports",
    color: "purple",
  },
];

export const recentActivity = [
  {
    id: 1,
    type: "record",
    title: "Blood Test Report",
    sub: "Added • 2 days ago",
  },
  {
    id: 2,
    type: "medicine",
    title: "Medicine Added",
    sub: "Crocin 500 mg • 3 days ago",
  },
  {
    id: 3,
    type: "consult",
    title: "Doctor Consultation",
    sub: "Notes added • 5 days ago",
  },
  { id: 4, type: "record", title: "X-Ray Report", sub: "Added • 1 week ago" },
];

export const featuredInsight = {
  text: "Your last hemoglobin level is slightly below the normal range. Consider discussing this with your healthcare professional.",
};

export const records = [
  {
    id: 1,
    title: "Complete Blood Count",
    type: "Lab Report",
    date: "21 Aug 2026",
    tag: "flagged",
  },
  {
    id: 2,
    title: "Chest X-Ray",
    type: "Imaging",
    date: "12 Jul 2026",
    tag: "normal",
  },
  {
    id: 3,
    title: "Blood Test — Hemoglobin",
    type: "Lab Report",
    date: "18 Jun 2026",
    tag: "mild",
  },
  {
    id: 4,
    title: "Doctor Consultation Notes",
    type: "Consultation",
    date: "12 Mar 2026",
    tag: "neutral",
  },
  {
    id: 5,
    title: "Blood Test — Hemoglobin",
    type: "Lab Report",
    date: "08 Jan 2026",
    tag: "normal",
  },
  {
    id: 6,
    title: "Prescription — Crocin 500mg",
    type: "Prescription",
    date: "03 Jan 2026",
    tag: "neutral",
  },
  {
    id: 7,
    title: "Lipid Profile",
    type: "Lab Report",
    date: "19 Dec 2025",
    tag: "normal",
  },
  {
    id: 8,
    title: "ECG Report",
    type: "Imaging",
    date: "02 Nov 2025",
    tag: "normal",
  },
];

export const medicines = [
  {
    id: 1,
    name: "Crocin",
    genericName: "Paracetamol",
    dose: "500 mg",
    frequency: "Twice daily, after meals",
    remainingDays: 6,
    status: "active",
    tagType: "continued",
    uses: ["Fever", "Mild pain relief"],
    sideEffects: ["Nausea", "Rash", "Liver strain (high doses)"],
    reportedSideEffects: [],
    substitute: {
      name: "Paracip 500",
      brandPrice: 35,
      genericPrice: 18,
      unit: "strip",
    },
  },
  {
    id: 2,
    name: "Metformin",
    genericName: "Metformin HCl",
    dose: "500 mg",
    frequency: "Once daily, morning",
    remainingDays: 18,
    status: "active",
    tagType: "continued",
    uses: ["Type 2 diabetes", "Blood sugar control"],
    sideEffects: ["Nausea", "Diarrhea", "Stomach upset", "Metallic taste"],
    reportedSideEffects: ["Stomach upset"],
    substitute: {
      name: "Glyciphage 500",
      brandPrice: 90,
      genericPrice: 42,
      unit: "strip",
    },
  },
  {
    id: 3,
    name: "Vitamin D3",
    genericName: "Cholecalciferol",
    dose: "60,000 IU",
    frequency: "Once weekly",
    remainingDays: 24,
    status: "active",
    tagType: "continued",
    uses: ["Vitamin D deficiency", "Bone health"],
    sideEffects: ["Headache", "Constipation"],
    reportedSideEffects: [],
    substitute: null,
  },
  {
    id: 4,
    name: "Cetirizine",
    genericName: "Cetirizine HCl",
    dose: "10 mg",
    frequency: "As needed",
    remainingDays: 2,
    status: "active",
    tagType: "new",
    uses: ["Allergies", "Hay fever", "Itching"],
    sideEffects: ["Drowsiness", "Dry mouth", "Fatigue"],
    reportedSideEffects: [],
    substitute: {
      name: "Alerid 10",
      brandPrice: 45,
      genericPrice: 22,
      unit: "strip",
    },
  },
  {
    id: 5,
    name: "Amoxicillin",
    genericName: "Amoxicillin Trihydrate",
    dose: "250 mg",
    frequency: "Thrice daily, 5 days",
    remainingDays: 0,
    status: "discontinued",
    tagType: "continued",
    uses: ["Bacterial infection"],
    sideEffects: ["Diarrhea", "Rash", "Nausea"],
    reportedSideEffects: ["Rash"],
    substitute: null,
  },
];

export const genericComparison = {
  brand: {
    name: "Brand X",
    dose: "500 mg Tablet",
    ingredient: "Paracetamol",
    price: 120,
    unit: "per strip",
    count: "10 tablets",
  },
  generic: {
    name: "Generic X",
    dose: "500 mg Tablet",
    ingredient: "Paracetamol",
    price: 35,
    unit: "per strip",
    count: "10 tablets",
  },
};

export const insightsList = [
  {
    id: 1,
    metric: "Hemoglobin",
    value: "10.2 g/dL",
    range: "12 – 16 g/dL",
    rangeLow: 12,
    rangeHigh: 16,
    markerValue: 10.2,
    flag: "Below reference range",
    flagType: "low",
    explanation:
      "Your hemoglobin level is below the reference range shown on your report. There can be several reasons for a result like this, so it should be discussed with a healthcare professional.",
    source: "Complete Blood Count Report",
    confidence: 85,
  },
  {
    id: 2,
    metric: "Fasting Glucose",
    value: "94 mg/dL",
    range: "70 – 100 mg/dL",
    rangeLow: 70,
    rangeHigh: 100,
    markerValue: 94,
    flag: "Within normal range",
    flagType: "normal",
    explanation:
      "Your fasting glucose level falls within the typical reference range on your report. Regular monitoring is still a good habit to maintain.",
    source: "Lipid & Metabolic Panel",
    confidence: 91,
  },
  {
    id: 3,
    metric: "LDL Cholesterol",
    value: "142 mg/dL",
    range: "0 – 130 mg/dL",
    rangeLow: 0,
    rangeHigh: 130,
    markerValue: 142,
    flag: "Above reference range",
    flagType: "low",
    explanation:
      "Your LDL cholesterol is above the reference range shown on your report. Diet, activity, and other factors can all contribute — a healthcare professional can help interpret this.",
    source: "Lipid Profile Report",
    confidence: 78,
  },
];

export const timelineFull = [
  {
    id: 1,
    date: "JAN 2026 · 08 · Wed",
    title: "Blood Test",
    detail: "Hemoglobin: 11.2 g/dL",
    tag: "Normal",
    tagType: "normal",
  },
  {
    id: 2,
    date: "MAR 2026 · 12 · Thu",
    title: "Doctor Consultation",
    detail: "Prescription added",
    tag: "General Physician",
    tagType: "neutral",
  },
  {
    id: 3,
    date: "JUN 2026 · 18 · Wed",
    title: "Blood Test",
    detail: "Hemoglobin: 10.8 g/dL",
    tag: "Slightly Low",
    tagType: "mild",
  },
  {
    id: 4,
    date: "AUG 2026 · 21 · Fri",
    title: "Blood Test",
    detail: "Hemoglobin: 10.2 g/dL",
    tag: "Change detected",
    tagType: "flagged",
  },
  {
    id: 5,
    date: "SEP 2025 · 30 · Tue",
    title: "Chest X-Ray",
    detail: "No abnormalities found",
    tag: "Normal",
    tagType: "normal",
  },
  {
    id: 6,
    date: "NOV 2025 · 02 · Sun",
    title: "ECG",
    detail: "Routine checkup",
    tag: "Normal",
    tagType: "normal",
  },
];

export const emergencyInfo = {
  bloodGroup: "O+",
  allergies: ["Penicillin", "Peanuts"],
  conditions: ["Mild Anemia"],
  medications: ["Metformin 500mg", "Vitamin D3"],
  emergencyContact: {
    name: "Raj Sharma",
    relation: "Spouse",
    phone: "+91 98765 12345",
  },
};
