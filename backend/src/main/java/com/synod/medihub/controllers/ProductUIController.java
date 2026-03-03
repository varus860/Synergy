package com.synod.medihub.controllers;

import com.synod.medihub.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@Controller
public class ProductUIController {

    @Autowired
    private ProductService productService;

    @GetMapping("/bulk-upload")
    public String showBulkUploadForm() {
        return "bulk-image-upload";
    }

    @PostMapping("/bulk-upload")
    public String handleBulkUpload(@RequestParam("productIds") List<Long> productIds,
                                 @RequestParam("files") List<MultipartFile> files,
                                 Model model) {
        try {
            productService.uploadBulkProductImages(productIds, files);
            model.addAttribute("message", "Images uploaded successfully!");
        } catch (IOException e) {
            model.addAttribute("error", "Failed to upload images: " + e.getMessage());
        }
        return "bulk-image-upload";
    }
}
