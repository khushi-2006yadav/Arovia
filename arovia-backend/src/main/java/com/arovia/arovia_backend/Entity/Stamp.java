package com.arovia.arovia_backend.Entity;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Stamp {
    private String value;
    private LocalDate date;
}
