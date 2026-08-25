package com.arovia.arovia_backend.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// BIMARI KA NAAM
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Diagnosis {

    private String name;

    private Double confidence;
}