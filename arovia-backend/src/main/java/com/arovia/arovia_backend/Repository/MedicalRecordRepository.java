package com.arovia.arovia_backend.Repository;

import com.arovia.arovia_backend.Entity.MedicalRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends MongoRepository<MedicalRecord, String> {
    List<MedicalRecord> findAllByUserId(String userId);
}
