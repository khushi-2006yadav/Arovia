package com.arovia.arovia_backend.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicationInfo {

    private String medicineName;

    private String dosage;

    private String frequency;

    private String route;

    private String duration;

    private String instructions;

    private Double confidence;
}