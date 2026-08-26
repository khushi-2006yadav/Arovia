package com.arovia.arovia_backend.Entity;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "medicines")
public class Medicine {

    private String medicineName;
    private String activeSalts;
    private String uses;
    private String sideEffects;
}
