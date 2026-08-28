package com.arovia.arovia_backend.Entity;

import com.arovia.arovia_backend.Enum.BloodGroup;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import java.time.LocalDateTime;
import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthSnapshot {

    @Id
    private String id;

    private String userId;

    private Double heightCm;

    private Double weightKg;

    private Double bmi;

    private BloodGroup bloodGroup;

    private Set<String> activeDiseases= new HashSet<>();

    private Map<String, List<Stamp>> trends= new HashMap<>(); // such as haemoglobin : [stamp1, stamp2]  list contains
    // value recorded on date

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}