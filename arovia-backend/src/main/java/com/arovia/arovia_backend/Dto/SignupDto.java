package com.arovia.arovia_backend.Dto;

import com.arovia.arovia_backend.Enum.BloodGroup;
import com.arovia.arovia_backend.Enum.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupDto {

    @NotBlank
    private String name;

    @NotBlank
    private String password;

    @Email
    @NotBlank
    private String emailId;

    private LocalDate dob;

    private BloodGroup bloodGroup;

    private Gender gender;

    private Double weight;

    private Double height;

    private String location;

    private List<String> pastChronicDiseases;

    private List<String> familyDiseases;
}
