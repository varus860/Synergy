package com.synod.medihub.controllers;

import com.synod.medihub.services.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin/images")
@CrossOrigin
@RequiredArgsConstructor
public class AdminImageController {

    private final ImageService imageService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        String imageUrl = imageService.uploadImage(file);
        return ResponseEntity.ok(imageUrl);
    }
}
