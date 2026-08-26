package com.arovia.arovia_backend.Entity;

import com.arovia.arovia_backend.Enum.BloodGroup;
import com.arovia.arovia_backend.Enum.Gender;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    private String userId;
    private String name;
    private String password;
    private String avatar;
    private LocalDate dob;
    private BloodGroup bloodGroup;
    private Gender gender;
    @Email
    @Indexed(unique = true)
    private String emailId;
    private Double weight;
    private Double height;
    private String location;
    private List<String> pastChronicDiseases;
    private List<String> familyDiseases;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}