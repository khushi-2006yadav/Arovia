package com.arovia.arovia_backend.Entity;

import com.arovia.arovia_backend.Enum.RecordType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "medicalRecords")
public class MedicalRecord {

    @Id
    private String id;

    @Indexed
    private String userId;

    private RecordType recordType;

    private LocalDate recordDate;

    private String title;

    private List<Diagnosis> diagnoses; // diseases

    private List<TestResult> testResults;

    private List<MedicationInfo> medications;

    private Doctor doctor;

    private String observations;

    private String additionalDetails;

    private LocalDateTime createdAt;
}
