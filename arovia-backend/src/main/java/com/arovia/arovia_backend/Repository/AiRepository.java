package com.arovia.arovia_backend.Repository;

import com.arovia.arovia_backend.Entity.AiInsight;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AiRepository extends MongoRepository<AiInsight, String> {
    AiInsight findByRecordId(String recordId);
}
