package com.synod.medihub.controllers;

import com.synod.medihub.dto.ProductDto;
import com.synod.medihub.dto.ProductListDto;
import com.synod.medihub.entities.Product;
import com.synod.medihub.services.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
@Slf4j
public class ProductController {

    @Value("${image.upload.dir}")
    private String uploadDir;

    private ProductService productService;

    @Autowired
    public ProductController(ProductService productService){
        this.productService = productService;
    }

    // Paginated products with filters (User Side)
    @GetMapping
    public ResponseEntity<Page<ProductListDto>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "updatedAt,desc") String sort) {

        // Default to active only if not specified
        if (isActive == null) {
            isActive = true;
        }

        log.info("Request products - Page: {}, Size: {}, Search: {}, Category: {}", page, size, search, categoryId);

        if (page < 0) {
            return ResponseEntity.badRequest().build();
        }
        if (size <= 0 || size > 100) {
            size = 20;
        }

        Sort sortOrder = parseSort(sort);
        Pageable pageable = PageRequest.of(page, size, sortOrder);

        Page<ProductListDto> products = productService.getProductsForUser(
                search, categoryId, minPrice, maxPrice, isActive, pageable);

        return ResponseEntity.ok(products);
    }

    private Sort parseSort(String sort) {
        try {
            String[] sortParams = sort.split(",");
            String property = sortParams[0];
            Sort.Direction direction = Sort.Direction.DESC;

            if (sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc")) {
                direction = Sort.Direction.ASC;
            }

            return Sort.by(direction, property);
        } catch (Exception e) {
            return Sort.by(Sort.Direction.DESC, "updatedAt");
        }
    }

    // Get the image
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<org.springframework.core.io.Resource> serveImage(@PathVariable String filename) {
        try {
            java.nio.file.Path filePath = java.nio.file.Paths.get(uploadDir).resolve(filename);
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                // Change from "attachment" to "inline" for preview
                return ResponseEntity.ok()
                        .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, java.nio.file.Files.probeContentType(filePath)) // Add content type
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (java.net.MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        } catch (java.io.IOException e) {
            throw new RuntimeException("Could not determine file type.");
        }
    }

    // Get product by id
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductByID(@PathVariable Long id) {
        ProductDto product = productService.getProductById(id);
        
        // Enforce active check for public endpoint
        if (!Boolean.TRUE.equals(product.getIsActive())) {
             return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(product);
    }
}
