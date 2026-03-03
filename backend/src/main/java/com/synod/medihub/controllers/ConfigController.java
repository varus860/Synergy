package com.synod.medihub.controllers;

import com.synod.medihub.dto.AppConfigDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

    @Value("${spring.application.name:Medihub}")
    private String appName;

    @Value("${app.support.email:support@medihub.com}")
    private String supportEmail;

    @Value("${app.registration.test-mode:false}")
    private boolean testMode;

    @Value("${app.debug.enable-console:false}")
    private boolean enableConsole;

    @GetMapping
    public ResponseEntity<AppConfigDto> getConfig() {
        Map<String, Object> featureFlags = new HashMap<>();
        featureFlags.put("testMode", testMode);

        AppConfigDto config = AppConfigDto.builder()
                .appName(appName)
                .supportEmail(supportEmail)
                .featureFlags(featureFlags)
                .enableConsole(enableConsole)
                .build();

        return ResponseEntity.ok(config);
    }
}
