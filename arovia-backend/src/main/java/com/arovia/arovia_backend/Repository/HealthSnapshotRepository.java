package com.arovia.arovia_backend.Repository;

import com.arovia.arovia_backend.Entity.HealthSnapshot;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HealthSnapshotRepository extends MongoRepository<HealthSnapshot, String> {
    HealthSnapshot findByUserId(String userId);
}
