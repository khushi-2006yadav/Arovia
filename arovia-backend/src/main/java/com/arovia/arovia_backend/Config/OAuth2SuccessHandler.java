package com.arovia.arovia_backend.Config;

import com.arovia.arovia_backend.Entity.Patient;
import com.arovia.arovia_backend.Repository.PatientRepository;
import com.arovia.arovia_backend.Service.JWTService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private JWTService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String avatar = oAuth2User.getAttribute("picture");

        Patient patient = patientRepository.findByEmailId(email);

        if (patient == null) {

            patient = new Patient();
            patient.setEmailId(email);
            patient.setName(name);
            patient.setAvatar(avatar);
            patient.setCreatedAt(LocalDateTime.now());

            patientRepository.save(patient);
        }

        String token = jwtService.generateToken(email);

        String targetUrl = "https://khushi-2006yadav.github.io/Arovia/oauth-success?token=" + token; // Yaha se frontend me token ko extract karns hoga
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}