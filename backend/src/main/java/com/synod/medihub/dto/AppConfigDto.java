package com.synod.medihub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppConfigDto {
    private String appName;
    private String supportEmail;
    private Map<String, Object> featureFlags;
    private Boolean enableConsole;
}
