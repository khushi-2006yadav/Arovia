package com.arovia.arovia_backend.Controller;

import com.arovia.arovia_backend.Entity.Medicine;
import com.arovia.arovia_backend.Service.MedicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/medication")
public class MedicineController {
    @Autowired
    private MedicationService medicationService;

    @PostMapping("/{userId}/addSubstitute")
    public void addSubstitute(@RequestBody String substituteName, @RequestBody Medicine medicine, @PathVariable String userId)
    {
        medicationService.addSubstitute(userId, medicine, substituteName);
    }

    @GetMapping("/nearest-pharmacy")
    public ResponseEntity<Void> findNearestPharmacy(@RequestParam String location) {

        String query = "nearest Jan Aushadhi Kendra " + location;

        String googleUrl = "https://www.google.com/search?q="+ URLEncoder.encode(query, StandardCharsets.UTF_8);

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(URI.create(googleUrl))
                .build();
    }


}
