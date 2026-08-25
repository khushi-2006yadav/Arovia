package com.arovia.arovia_backend.Entity;

import com.arovia.arovia_backend.Enum.MedicationStatus;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;

// Patient ka medication details for one medicine
@Data
public class Medication {

    @Id
    private String medicationId;
    private String userId;
    private MedicationStatus status;
    private List<MedicationHistory> history;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
