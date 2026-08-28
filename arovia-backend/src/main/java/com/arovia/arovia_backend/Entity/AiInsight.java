package com.arovia.arovia_backend.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiInsight {
    @Id
    private String id;

    private String  userId;
    private String recordId;

    private String aiAnalysis;
}
