package com.arovia.arovia_backend.Entity;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Stamp {
    private double value;
    private LocalDate date;
}
