package com.arovia.arovia_backend.Repository;

import com.arovia.arovia_backend.Entity.Medication;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MedicationRepository extends MongoRepository<Medication, String> {
    Optional<Medication> findByUserId(String userId);
}
