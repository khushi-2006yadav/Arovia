package com.arovia.arovia_backend.Entity;

import com.arovia.arovia_backend.Enum.TestStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestResult {

    private String category;
    private String testName;

    private String value; // String bana dena hoga

    private String unit;

    private String referenceRange;

    private TestStatus status;

    private Double ageGroup;

    private String method;

    private LocalDate timepoint;
}