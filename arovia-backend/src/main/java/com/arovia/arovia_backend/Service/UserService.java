package com.arovia.arovia_backend.Service;

import com.arovia.arovia_backend.Dto.OAuthDto;
import com.arovia.arovia_backend.Dto.SigninDto;
import com.arovia.arovia_backend.Dto.SignupDto;
import com.arovia.arovia_backend.Dto.UserResponseDto;
import com.arovia.arovia_backend.Entity.Patient;
import com.arovia.arovia_backend.Repository.PatientRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
public class UserService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JWTService jwtService;
    @Autowired
    private HealthSnapshotService healthSnapshotService;

    public void addUser(SignupDto signupDto)
    {
        if(patientRepository.existsByEmailId(signupDto.getEmailId())) {
            log.error("Account already Exists for email id : {}", signupDto.getEmailId());
            throw new BadCredentialsException("Email Id already registered");
        }

        Patient patient = new Patient();

        patient.setName(signupDto.getName());
        patient.setEmailId(signupDto.getEmailId());
        patient.setPassword(bCryptPasswordEncoder.encode(signupDto.getPassword()));

        patient.setDob(signupDto.getDob());
        patient.setBloodGroup(signupDto.getBloodGroup());
        patient.setGender(signupDto.getGender());

        patient.setWeight(signupDto.getWeight());
        patient.setHeight(signupDto.getHeight());

        patient.setLocation(signupDto.getLocation());

        patient.setPastChronicDiseases(
                signupDto.getPastChronicDiseases()
        );

        patient.setFamilyDiseases(
                signupDto.getFamilyDiseases()
        );
        patientRepository.save(patient);
        healthSnapshotService.createSnapshot(patient);
    }

    public UserResponseDto loginUser(SigninDto signinDto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signinDto.getEmailId(),
                signinDto.getPassword()));


        Patient patient=patientRepository.findByEmailId(signinDto.getEmailId());

        UserResponseDto response = new UserResponseDto();

        response.setUserId(patient.getUserId());
        response.setName(patient.getName());
        response.setAvatar(patient.getAvatar());
        response.setDob(patient.getDob());
        response.setBloodGroup(patient.getBloodGroup());
        response.setGender(patient.getGender());
        response.setEmailId(patient.getEmailId());
        response.setWeight(patient.getWeight());
        response.setHeight(patient.getHeight());
        response.setLocation(patient.getLocation());
        response.setPastChronicDiseases(patient.getPastChronicDiseases());
        response.setFamilyDiseases(patient.getFamilyDiseases());
        response.setCreatedAt(patient.getCreatedAt());
        response.setUpdatedAt(patient.getUpdatedAt());
        response.setJwt(jwtService.generateToken(signinDto.getEmailId()));

        return response;
    }

    public UserResponseDto oauthLoginUser(String  token)
    {
        String emailId=jwtService.extractUsername(token);

        Patient patient=patientRepository.findByEmailId(emailId);

        UserResponseDto response = new UserResponseDto();

        response.setUserId(patient.getUserId());
        response.setName(patient.getName());
        response.setAvatar(patient.getAvatar());
        response.setDob(patient.getDob());
        response.setBloodGroup(patient.getBloodGroup());
        response.setGender(patient.getGender());
        response.setEmailId(patient.getEmailId());
        response.setWeight(patient.getWeight());
        response.setHeight(patient.getHeight());
        response.setLocation(patient.getLocation());
        response.setPastChronicDiseases(patient.getPastChronicDiseases());
        response.setFamilyDiseases(patient.getFamilyDiseases());
        response.setCreatedAt(patient.getCreatedAt());
        response.setUpdatedAt(patient.getUpdatedAt());
        response.setJwt(token);

        return response;
    }


    public UserResponseDto oauthAddUser(OAuthDto oAuthDto) {

        String emailId=jwtService.extractUsername(oAuthDto.getToken());

        Patient patient = patientRepository.findByEmailId(emailId);

        if (patient == null) {
            log.error("Account doesn't exist for email id : {}", emailId);
            throw new BadCredentialsException("Email Id not registered");
        }

        patient.setBloodGroup(oAuthDto.getBloodGroup());
        patient.setDob(oAuthDto.getDob());
        patient.setGender(oAuthDto.getGender());
        patient.setHeight(oAuthDto.getHeight());
        patient.setFamilyDiseases(oAuthDto.getFamilyDiseases());
        patient.setWeight(oAuthDto.getWeight());
        patient.setPastChronicDiseases(oAuthDto.getPastChronicDiseases());
        patient.setLocation(oAuthDto.getLocation());
        patientRepository.save(patient);
        healthSnapshotService.createSnapshot(patient);

        UserResponseDto response = new UserResponseDto();

        response.setUserId(patient.getUserId());
        response.setName(patient.getName());
        response.setAvatar(patient.getAvatar());
        response.setDob(patient.getDob());
        response.setBloodGroup(patient.getBloodGroup());
        response.setGender(patient.getGender());
        response.setEmailId(patient.getEmailId());
        response.setWeight(patient.getWeight());
        response.setHeight(patient.getHeight());
        response.setLocation(patient.getLocation());
        response.setPastChronicDiseases(patient.getPastChronicDiseases());
        response.setFamilyDiseases(patient.getFamilyDiseases());
        response.setCreatedAt(patient.getCreatedAt());
        response.setUpdatedAt(patient.getUpdatedAt());
        response.setJwt(oAuthDto.getToken());

        return response;

    }
}
