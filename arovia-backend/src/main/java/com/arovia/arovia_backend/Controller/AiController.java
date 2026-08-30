package com.arovia.arovia_backend.Controller;

import com.arovia.arovia_backend.Entity.AiInsight;
import com.arovia.arovia_backend.Entity.HealthSnapshot;
import com.arovia.arovia_backend.Service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;
import java.io.IOException;

@RestController
@RequestMapping("/api/ai")
public class AiController {


    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/fetchRecordAnalysis/{recordId}")
    public AiInsight fetchRecordAnalysis(@PathVariable String recordId)
    {
        return aiService.fetchRecordAnalysis(recordId);
    }

    @PostMapping(value = "/uploadRecord",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String uploadRecord(@RequestParam("file") MultipartFile file) throws IOException {

        return aiService.receiveImage(file);
    }

    @GetMapping("/fetchHealthSuggestion/{userId}")
    public String fetchHealthSuggestion(@PathVariable String userId)
    {
       return aiService.fetchHealthSuggestions(userId);
    }
}
