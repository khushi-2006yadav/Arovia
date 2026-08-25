package com.arovia.arovia_backend.Dto;

import com.arovia.arovia_backend.Enum.BloodGroup;
import com.arovia.arovia_backend.Enum.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private String userId;

    private String name;

    private String avatar;

    private LocalDate dob;

    private BloodGroup bloodGroup;

    private Gender gender;

    private String emailId;

    private Double weight;

    private Double height;

    private String location;

    private List<String> pastChronicDiseases;

    private List<String> familyDiseases;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    private String jwt;
}
