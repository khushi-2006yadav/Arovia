package com.arovia.arovia_backend.Dto;

import com.arovia.arovia_backend.Entity.Diagnosis;
import com.arovia.arovia_backend.Entity.Doctor;
import com.arovia.arovia_backend.Entity.MedicationInfo;
import com.arovia.arovia_backend.Entity.TestResult;
import com.arovia.arovia_backend.Enum.RecordType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordDto {

    private RecordType recordType;

    private LocalDate recordDate;

    private String title;

    private List<Diagnosis> diagnoses;

    private List<TestResult> testResults;

    private List<MedicationInfoDto> medications;

    private Doctor doctor;

    private String observations;

    private String additionalDetails;
}
