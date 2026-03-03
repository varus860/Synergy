package com.synod.medihub.services;

import com.synod.medihub.entities.Image;
import com.synod.medihub.repositories.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ImageService {

    @Autowired
    private ImageRepository imageRepository;

    @Value("${image.upload.dir}")
    private String uploadDir;

    @jakarta.annotation.PostConstruct
    public void init() {
        Path path = Paths.get(uploadDir);
        if (!Files.exists(path)) {
            try {
                Files.createDirectories(path);
                System.out.println("CREATED IMAGE UPLOAD DIRECTORY AT: " + uploadDir);
            } catch (IOException e) {
                System.err.println("CRITICAL ERROR: Could not create image upload directory: " + uploadDir);
                // We don't shut down here, but we log it clearly.
            }
        } else if (!Files.isWritable(path)) {
            System.err.println("CRITICAL ERROR: Image upload directory is not writable: " + uploadDir);
        }
    }

    public String uploadImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        // Save file to disk
        Path path = Paths.get(uploadDir, file.getOriginalFilename());
        Files.write(path, file.getBytes());

        // Save image information to the database
        Image image = new Image();
        image.setFilename(file.getOriginalFilename());
        image.setUrl("/images/" + file.getOriginalFilename()); // Example URL
        imageRepository.save(image);

        return image.getUrl();
    }
}

