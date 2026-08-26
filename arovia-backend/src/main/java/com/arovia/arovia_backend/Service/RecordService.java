package com.arovia.arovia_backend.Service;

import com.arovia.arovia_backend.Dto.MedicalRecordDto;
import com.arovia.arovia_backend.Dto.MedicationInfoDto;
import com.arovia.arovia_backend.Entity.MedicalRecord;
import com.arovia.arovia_backend.Entity.Medication;
import com.arovia.arovia_backend.Entity.MedicationInfo;
import com.arovia.arovia_backend.Entity.Medicine;
import com.arovia.arovia_backend.Repository.MedicalRecordRepository;
import com.arovia.arovia_backend.Repository.MedicationRepository;
import com.arovia.arovia_backend.Repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class RecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;
    @Autowired
    private MedicineRepository medicineRepository;
    @Autowired
    private MedicationService medicationService;


    public String addRecord(String userId, MedicalRecordDto medicalRecordDto) {

        MedicalRecord medicalRecord = new MedicalRecord();

        medicalRecord.setUserId(userId);
        medicalRecord.setRecordType(medicalRecordDto.getRecordType());
        medicalRecord.setRecordDate(medicalRecordDto.getRecordDate());
        medicalRecord.setTitle(medicalRecordDto.getTitle());
        medicalRecord.setDiagnoses(medicalRecordDto.getDiagnoses());
        medicalRecord.setTestResults(medicalRecordDto.getTestResults());

        List<MedicationInfo> medications = new ArrayList<>();

        for (MedicationInfoDto medicationDto : medicalRecordDto.getMedications()) {

            Medicine medicine = medicationService.findMedicine(medicationDto.getMedicineName());

            MedicationInfo medicationInfo = new MedicationInfo();

            medicationInfo.setMedicine(medicine);
            medicationInfo.setDosage(medicationDto.getDosage());
            medicationInfo.setFrequency(medicationDto.getFrequency());
            medicationInfo.setRoute(medicationDto.getRoute());
            medicationInfo.setDuration(medicationDto.getDuration());
            medicationInfo.setInstructions(medicationDto.getInstructions());
            medicationInfo.setConfidence(medicationDto.getConfidence());

            medications.add(medicationInfo);
        }

        medicationService.updateMedication(userId, medicalRecordDto.getMedications(), medicalRecordDto.getRecordDate());
        medicalRecord.setMedications(medications);

        medicalRecord.setDoctor(medicalRecordDto.getDoctor());
        medicalRecord.setObservations(medicalRecordDto.getObservations());
        medicalRecord.setAdditionalDetails(medicalRecordDto.getAdditionalDetails());
        medicalRecord.setCreatedAt(LocalDateTime.now());

        MedicalRecord savedRecord = medicalRecordRepository.save(medicalRecord);

        return savedRecord.getId();
    }

    public MedicalRecord fetchRecord(String recordId)
    {
        MedicalRecord medicalRecord= medicalRecordRepository.findById(recordId).orElseThrow(
                ()->new RuntimeException("No record Found")
        );
        return medicalRecord;
    }
}
