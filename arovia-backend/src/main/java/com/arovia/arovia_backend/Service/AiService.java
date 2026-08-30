package com.arovia.arovia_backend.Service;

import com.arovia.arovia_backend.Entity.AiInsight;
import com.arovia.arovia_backend.Entity.HealthSnapshot;
import com.arovia.arovia_backend.Entity.MedicalRecord;
import com.arovia.arovia_backend.Repository.AiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;
import java.io.IOException;

@Service
public class AiService {

    @Autowired
    private RecordService recordService;
    @Autowired
    private AiRepository aiRepository;

    @Autowired
    private HealthSnapshotService healthSnapshotService;

    private final RestClient restClient;

    @Value("${ai.service.url}")                // OCR ka
    private String aiServiceUrl;

    @Value("${ai.analyzer.service.url}")       // Report analyzer ka
    private String aiAnalyzerServiceUrl;

    @Value("${ai.snapshot.service.url}")
    private String aiSnapshotServiceUrl;

    public AiService(RestClient.Builder builder) {
        this.restClient = builder.build();
    }

    public String receiveImage(MultipartFile image) throws IOException {

        MultiValueMap<String, Object> body =new LinkedMultiValueMap<>();

        body.add("file",new ByteArrayResource(image.getBytes()) {

                    @Override
                    public String getFilename() {
                        return image.getOriginalFilename();
                    }
                }
        );

        return restClient.post()
                .uri(aiServiceUrl + "/extract-medical-report")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .body(String.class);
    }

    public AiInsight fetchRecordAnalysis(String recordId)
    {
        AiInsight aiInsight=aiRepository.findByRecordId(recordId);
        if(aiInsight!=null) return aiInsight;

        MedicalRecord medicalRecord=recordService.fetchRecord(recordId);
        if (medicalRecord == null) {
            throw new RuntimeException("Medical record not found for id: " + recordId);
        }

        String summary = restClient.post()
                .uri(aiAnalyzerServiceUrl + "/analyze-report")
                .contentType(MediaType.APPLICATION_JSON)
                .body(medicalRecord)
                .retrieve()
                .body(String.class);

        AiInsight newInsight = new AiInsight();
        newInsight.setRecordId(recordId);
        newInsight.setUserId(medicalRecord.getUserId());
        newInsight.setAiAnalysis(summary);

        aiRepository.save(newInsight);
        return newInsight;
    }

    public String fetchHealthSuggestions(String userId)
    {
        HealthSnapshot healthSnapshot=healthSnapshotService.fetchHealthsnapshot(userId);

        String summary = restClient.post()
                .uri(aiSnapshotServiceUrl + "/analyze-health-snapshot")
                .contentType(MediaType.APPLICATION_JSON)
                .body(healthSnapshot)
                .retrieve()
                .body(String.class);
        return summary;
    }


}
