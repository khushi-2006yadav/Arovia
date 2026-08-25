package com.arovia.arovia_backend.Entity;

import lombok.Data;

// To cache Medicine details
@Data
public class Medicine {
    private String name;
    private String dosage;
    private String genericName;
    private String sideEffects;
    private String uses;

}
