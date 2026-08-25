package com.arovia.arovia_backend.Service;


import com.arovia.arovia_backend.Entity.Patient;
import com.arovia.arovia_backend.Repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public  class CustomUserDetailsService
        implements UserDetailsService
{
    @Autowired
    private PatientRepository patientRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException
    {

        Patient patient = patientRepository.findByEmailId(email);

        if(patient!=null)
        {
            return User.builder()
                    .username(patient.getEmailId())
                    .password(patient.getPassword())
                    .build();
        }

        throw new UsernameNotFoundException(
                "User not found"
        );
    }

}