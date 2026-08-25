package com.arovia.arovia_backend.Entity;

import lombok.Data;

import java.time.LocalDateTime;

// history of each medication
@Data
public class MedicationHistory {
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private int frequency;
}
