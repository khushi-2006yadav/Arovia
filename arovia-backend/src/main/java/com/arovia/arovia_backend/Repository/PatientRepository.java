package com.arovia.arovia_backend.Repository;

import com.arovia.arovia_backend.Entity.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends MongoRepository<Patient, String> {
     Patient findByEmailId(String email);
     boolean existsByEmailId(String emailId);
}
