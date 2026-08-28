package com.arovia.arovia_backend.Controller;

import com.arovia.arovia_backend.Entity.AiInsight;
import com.arovia.arovia_backend.Entity.HealthSnapshot;
import com.arovia.arovia_backend.Service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.awt.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

//    @GetMapping("/fetchRecordAnalysis/{recordId}")
//    public AiInsight fetchRecordAnalysis(@PathVariable String reccordId)
//    {
//
//    }

    @PostMapping("/uploadRecord")
    public String uploadRecord(@RequestBody Image image)
    {
        return aiService.receiveImage(image);
    }

    @PostMapping("/fetchHealthSuggestion")
    public String fetchHealthSuggestion(HealthSnapshot healthSnapshot)
    {
       return aiService.fetchHealthSuggestions(healthSnapshot);
    }
}
