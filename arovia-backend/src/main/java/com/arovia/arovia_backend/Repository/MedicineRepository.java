package com.arovia.arovia_backend.Repository;

import com.arovia.arovia_backend.Entity.Medicine;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MedicineRepository extends MongoRepository<Medicine, String> {
    Optional<Medicine> findByMedicineNameIgnoreCase(String name);
}
