package com.arovia.arovia_backend.Entity;

import lombok.Data;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "Medicine")
public class Medicine {

    @Indexed
    private String medicineName;
    private String activeSalts;
    private String uses;
    private String sideEffects;
}
