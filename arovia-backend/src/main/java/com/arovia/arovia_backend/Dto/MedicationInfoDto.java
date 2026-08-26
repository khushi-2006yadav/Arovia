package com.arovia.arovia_backend.Dto;

import com.arovia.arovia_backend.Entity.Medicine;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicationInfoDto {

    private String medicineName;

    private String dosage;

    private String frequency;

    private String route;

    private int duration; // No of days

    private String instructions;

    private Double confidence;
}