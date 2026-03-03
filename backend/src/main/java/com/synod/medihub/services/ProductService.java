package com.synod.medihub.services;

import com.synod.medihub.dto.ProductDto;
import com.synod.medihub.dto.ProductListDto;
import com.synod.medihub.entities.Category;
import com.synod.medihub.entities.Product;
import com.synod.medihub.exceptions.ResourceNotFoundException;
import com.synod.medihub.mapper.ProductMapper;
import com.synod.medihub.repositories.CategoryRepository;
import com.synod.medihub.repositories.ProductRepository;
import com.synod.medihub.repositories.ProductSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductMapper productMapper;

    @Value("${image.upload.dir}")
    private String uploadDir;

    @Transactional
    public void uploadBulkProductImages(List<Long> productIds, List<MultipartFile> files) throws IOException {
        for (int i = 0; i < productIds.size(); i++) {
            if (i < files.size() && !files.get(i).isEmpty()) {
                uploadProductImage(productIds.get(i), files.get(i));
            }
        }
    }

    public Product uploadProductImage(Long productId, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        // Fetch the product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if there is an existing image
        String existingImage = product.getThumbnail_url();
        if (existingImage != null) {
            // Delete the old image from disk
            Path oldImagePath = Paths.get(uploadDir).resolve(existingImage.substring(existingImage.lastIndexOf('/') + 1));
            Files.deleteIfExists(oldImagePath);
        }

        // Generate a new unique filename using UUID
        String fileExtension = getFileExtension(file.getOriginalFilename());
        String newFileName = UUID.randomUUID().toString() + fileExtension;

        // Save the new file to disk
        Path newImagePath = Paths.get(uploadDir).resolve(newFileName);
        Files.write(newImagePath, file.getBytes());

        // Update the product with the new image URL
        String thumbnailUrl = "/images/" + newFileName;
        product.setThumbnail_url(thumbnailUrl);

        productRepository.save(product);
        return product;
    }

    // Helper method to extract the file extension
    private String getFileExtension(String filename) {
        int lastIndexOfDot = filename.lastIndexOf('.');
        return (lastIndexOfDot == -1) ? "" : filename.substring(lastIndexOfDot);
    }

    // Create multiple products at once
    public List<ProductDto> createProducts(List<ProductDto> productDtos) {
        return productDtos.stream()
                .map(this::createProduct)
                .collect(java.util.stream.Collectors.toList());
    }

    public ProductDto createProduct(ProductDto productDto) {
        // Convert DTO to entity (category will be null at this point)
        Product product = productMapper.toEntity(productDto);

        // Handle the Many-to-One relationship: find and set Category
        if (productDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            // Set the Category entity on Product
            product.setCategory(category);

            // Update the bidirectional relationship
            // Ensure productList is initialized to avoid NPE
            if (category.getProductList() == null) {
                category.setProductList(new java.util.ArrayList<>());
            }
            category.addProduct(product);
        }

        // Save product (cascade may save category changes if configured)
        Product savedProduct = productRepository.save(product);

        // Convert back to DTO
        return productMapper.toDto(savedProduct);
    }

    // Get a list of all products
    public List<ProductDto> getAllProducts() {
        return productMapper.toDtoList(productRepository.findAllByOrderByProductIdAsc());
    }

    /**
     * Get product by ID with category relationship handled
     */
    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // The mapper will extract categoryId from the Category relationship
        return productMapper.toDto(product);
    }

    /**
     * Update product including category relationship
     */
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        // Find existing product
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Update basic fields from DTO
        productMapper.updateProductFromDto(productDto, existingProduct);

        // Handle category update if categoryId changed
        if (productDto.getCategoryId() != null &&
                (existingProduct.getCategory() == null ||
                        !existingProduct.getCategory().getCategoryId().equals(productDto.getCategoryId()))) {

            // Remove from old category
            if (existingProduct.getCategory() != null) {
                existingProduct.getCategory().removeProduct(existingProduct);
            }

            // Add to new category
            Category newCategory = categoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            existingProduct.setCategory(newCategory);
            newCategory.addProduct(existingProduct);
        }

        // Save updated product
        Product updatedProduct = productRepository.save(existingProduct);

        return productMapper.toDto(updatedProduct);
    }

    /**
     * DELETE PRODUCT
     * Deletes a product by ID, handling bidirectional relationships
     */
    public void deleteProduct(Long productId) {
        // 1. Find the product with category (for bidirectional cleanup)
        Product product = productRepository.findByIdWithCategory(productId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + productId));

        // 2. Handle bidirectional relationship with Category
        Category category = product.getCategory();
        if (category != null) {
            // Remove product from category's list
            category.getProductList().removeIf(p ->
                    p.getProductId().equals(productId));
            categoryRepository.save(category);
        }

    // 4. Delete the product
        productRepository.delete(product);
    }

    /**
     * Get paginated products for admin with optional search
     */
    public Page<ProductDto> getProductsForAdmin(String search, Pageable pageable) {
        Page<Product> productPage;
        if (search != null && !search.isEmpty()) {
            productPage = productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(search, search, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }
        return productPage.map(productMapper::toDto);
    }

    /**
     * Get paginated products for user with optional filters
     */
    public Page<ProductListDto> getProductsForUser(
            String search,
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean isActive,
            Pageable pageable) {

        Specification<Product> spec = ProductSpecification.filterProducts(
                search, categoryId, minPrice, maxPrice, isActive);

        Page<Product> productPage = productRepository.findAll(spec, pageable);
        return productPage.map(productMapper::toListDto);
    }
}
