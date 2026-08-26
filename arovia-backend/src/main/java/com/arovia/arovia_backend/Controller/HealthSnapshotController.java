package com.arovia.arovia_backend.Controller;

import com.arovia.arovia_backend.Service.HealthSnapshotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/snapshot")
public class HealthSnapshotController {

    @Autowired
    private HealthSnapshotService healthSnapshotService;

    @PostMapping("/cured/{userId}")
    public void curedDisease(@PathVariable String userId, @RequestBody String diseaseName)
    {
           healthSnapshotService.removeDiseases(userId, diseaseName);
    }

}
