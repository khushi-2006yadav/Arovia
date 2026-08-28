package com.arovia.arovia_backend.Service;

import com.arovia.arovia_backend.Entity.AiInsight;
import com.arovia.arovia_backend.Entity.HealthSnapshot;
import com.arovia.arovia_backend.Entity.MedicalRecord;
import com.arovia.arovia_backend.Repository.AiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;

@Service
public class AiService {

    @Autowired
    private RecordService recordService;
    @Autowired
    private AiRepository aiRepository;

    public AiInsight fetchRecordAnalysis(String recordId)
    {
        AiInsight aiInsight=aiRepository.findByRecordId(recordId);
        if(aiInsight!=null) return aiInsight;

        MedicalRecord medicalRecord=recordService.fetchRecord(recordId);

        // aiInsight=  Call the Ai service to get Ai Insight
        aiRepository.save(aiInsight);
        return aiInsight;
    }

    public String receiveImage(Image image)
    {
        String response="";
        // Call Ai service and provide it the image and return the response as string which is parsed as JSON on frontend to
        return response;
    }

    public String fetchHealthSuggestions(HealthSnapshot healthSnapshot)
    {
        String response="";
        // Call Ai service and provide it the healthSnapshot to analyse the details and provide suggestions
        return response;
    }


}
