package com.arovia.arovia_backend.Service;

import com.arovia.arovia_backend.Dto.MedicationInfoDto;
import com.arovia.arovia_backend.Entity.Medication;
import com.arovia.arovia_backend.Entity.MedicationHistory;
import com.arovia.arovia_backend.Entity.Medicine;
import com.arovia.arovia_backend.Enum.MedicationStatus;
import com.arovia.arovia_backend.Repository.MedicationRepository;
import com.arovia.arovia_backend.Repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class MedicationService {
    @Autowired
    private MedicationRepository medicationRepository;
    @Autowired
    private MedicineRepository medicineRepository;
    @Autowired
    private RedisTemplate<String, Medicine> medicineRedisTemplate;

    public void updateMedication(String userId,List<MedicationInfoDto> medicationDtos,LocalDate recordDate) {

        Medication medication = medicationRepository
                .findByUserId(userId)
                .orElseGet(() -> {
                    Medication newMedication = new Medication();

                    newMedication.setUserId(userId);
                    newMedication.setMedications(new HashMap<>());
                    newMedication.setCreatedAt(LocalDateTime.now());

                    return newMedication;
                });

        if (medication.getMedications() == null) {
            medication.setMedications(new HashMap<>());
        }

        for (MedicationInfoDto medicationDto : medicationDtos) {

            Medicine medicine = findMedicine(medicationDto.getMedicineName());

            MedicationHistory history = new MedicationHistory();

            history.setStatus(MedicationStatus.ACTIVE);

            history.setStartDate(recordDate.atStartOfDay());
            history.setEndDate(recordDate.atStartOfDay().plusDays(medicationDto.getDuration()));

            history.setRoute(medicationDto.getRoute());
            history.setDuration(medicationDto.getDuration());
            history.setInstructions(medicationDto.getInstructions());
            history.setFrequency(medicationDto.getFrequency());
            history.setSubstitute("");

            medication.getMedications()
                    .computeIfAbsent(medicine,key -> new ArrayList<>())
                    .add(history);
        }

        medication.setUpdatedAt(LocalDateTime.now());

        medicationRepository.save(medication);
    }

    public Medicine findMedicine(String medicineName) {

        String key = "medicine:" + medicineName.trim().toLowerCase();

        Medicine cachedMedicine = medicineRedisTemplate.opsForValue().get(key);

        if (cachedMedicine != null)
            return cachedMedicine;

        Medicine medicine = medicineRepository
                .findByMedicineNameIgnoreCase(medicineName)
                .orElseGet(() -> {

                    Medicine newMedicine = new Medicine();

                    newMedicine.setMedicineName(medicineName);
                    newMedicine.setUses("Unknown");
                    newMedicine.setSideEffects("Unknown");
                    newMedicine.setActiveSalts("Unknown");

                    return newMedicine;
                });

        medicineRedisTemplate.opsForValue().set(key, medicine, Duration.ofDays(7));

        return medicine;
    }

    public void addSubstitute( String userId, Medicine medicine, String substituteName)
    {
        Medication medication = medicationRepository
                .findByUserId(userId)
                .orElseGet(() -> {
                    Medication newMedication = new Medication();
                    newMedication.setUserId(userId);
                    newMedication.setMedications(new HashMap<>());
                    newMedication.setCreatedAt(LocalDateTime.now());
                    return newMedication;
                });  //Else ka case banega hi nahi


         List<MedicationHistory> list=medication.getMedications().get(medicine);

         MedicationHistory medicationHistory=list.get(list.size()-1);
         medicationHistory.setSubstitute(medicationHistory.getSubstitute()+" "+substituteName);
    }
}
