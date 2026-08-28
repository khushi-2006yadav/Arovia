package com.arovia.arovia_backend.Service;

import com.arovia.arovia_backend.Entity.*;
import com.arovia.arovia_backend.Repository.HealthSnapshotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class HealthSnapshotService {
    @Autowired
    private HealthSnapshotRepository healthSnapshotRepository;

    public void createSnapshot(Patient user) {

        HealthSnapshot snapshot = new HealthSnapshot();

        snapshot.setUserId(user.getUserId());
        snapshot.setHeightCm(user.getHeight());
        snapshot.setWeightKg(user.getWeight());
        snapshot.setBloodGroup(user.getBloodGroup());

        // Calculate BMI
        if (user.getHeight() != null && user.getWeight() != null
                && user.getHeight() > 0) {

            double heightInMeters = user.getHeight() / 100.0;

            double bmi = user.getWeight()/ (heightInMeters * heightInMeters);

            snapshot.setBmi(bmi);
        }

        snapshot.setActiveDiseases(user.getPastChronicDiseases() != null ? new HashSet<>(user.getPastChronicDiseases()) : new HashSet<>());
        snapshot.setTrends(new HashMap<>());

        snapshot.setCreatedAt(LocalDateTime.now());
        snapshot.setUpdatedAt(LocalDateTime.now());

        healthSnapshotRepository.save(snapshot);
    }
    public void addDiseases(String userId, List<Diagnosis> list)
    {
        HealthSnapshot healthSnapshot=healthSnapshotRepository.findByUserId(userId);

        Set<String> activeDiseases=healthSnapshot.getActiveDiseases();

        for(Diagnosis dia: list)
        {
            activeDiseases.add(dia.getName().toLowerCase());
        }
        healthSnapshot.setActiveDiseases(activeDiseases);
        healthSnapshot.setUpdatedAt(LocalDateTime.now());
        healthSnapshotRepository.save(healthSnapshot);

    }

    public void removeDiseases(String userId, String diseaseName)
    {
        HealthSnapshot healthSnapshot=healthSnapshotRepository.findByUserId(userId);

        Set<String> activeDiseases=healthSnapshot.getActiveDiseases();

        activeDiseases.remove(diseaseName.toLowerCase());
        healthSnapshot.setActiveDiseases(activeDiseases);
        healthSnapshot.setUpdatedAt(LocalDateTime.now());
        healthSnapshotRepository.save(healthSnapshot);
    }

    public void updateTrends(String userId, List<TestResult> list)
    {
        HealthSnapshot healthSnapshot=healthSnapshotRepository.findByUserId(userId);
        Map<String, List<Stamp>> map=healthSnapshot.getTrends();

        for(TestResult test: list)
        {
            List<Stamp> ls=map.getOrDefault(test.getTestName(), new ArrayList<>());
            Stamp stamp=new Stamp();
            stamp.setValue(test.getValue());
            stamp.setDate(test.getTimepoint());
            ls.add(stamp);
            map.put(test.getTestName(), ls);
        }
        healthSnapshot.setUpdatedAt(LocalDateTime.now());
        healthSnapshotRepository.save(healthSnapshot);
    }

    public HealthSnapshot fetchHealthsnapshot(String userId)
    {
        return   healthSnapshotRepository.findByUserId(userId);
    }
}
