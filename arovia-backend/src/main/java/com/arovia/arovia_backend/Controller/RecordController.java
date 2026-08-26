package com.arovia.arovia_backend.Controller;

import com.arovia.arovia_backend.Dto.MedicalRecordDto;
import com.arovia.arovia_backend.Entity.MedicalRecord;
import com.arovia.arovia_backend.Service.RecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/record")
public class RecordController {

    @Autowired
    private RecordService recordService;

    @PostMapping("/{userId}/addRecords")
    public String addRecord(@PathVariable String userId,@RequestBody MedicalRecordDto medicalRecordDto) {

        String recordId = recordService.addRecord(userId, medicalRecordDto);

        return recordId;
    }

    @GetMapping("/fetchRecord/{recordId}")
    public MedicalRecord fetchRecord(@PathVariable String recordId)           // A particular record of a user
    {
        return recordService.fetchRecord(recordId);
    }

    @GetMapping("/fetchRecords/{userId}")
    public List<MedicalRecord> fetchRecords(@PathVariable String userId)      //ALL records of a user
    {
        return recordService.fetchRecords(userId);
    }
}
