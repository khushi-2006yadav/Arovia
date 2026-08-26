package com.arovia.arovia_backend.Entity;

import com.arovia.arovia_backend.Enum.MedicationStatus;
import lombok.Data;

import java.time.LocalDateTime;

// history of each medication
@Data
public class MedicationHistory {
    private MedicationStatus status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String route;
    private int duration;    // No of days
    private String instructions;
    private String frequency;
    private String substitute; // Any other substitute if took
}
