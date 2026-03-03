package com.synod.medihub.mapper;

import com.synod.medihub.dto.ProductDto;
import com.synod.medihub.dto.ProductListDto;
import com.synod.medihub.entities.Category;
import com.synod.medihub.entities.Product;
import com.synod.medihub.repositories.CategoryRepository;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    /**
     * Convert Product entity to ProductDto
     * Handles the Many-to-One relationship by extracting categoryId
     */
    public ProductDto toDto(Product product) {
        if (product == null) {
            return null;
        }

        return ProductDto.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .shortDescription(product.getShortDescription())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .isActive(product.isActive())
                // Extract categoryId from Category relationship
                .categoryId(product.getCategory() != null ?
                        product.getCategory().getCategoryId() : null)
                .thumbnail_url(product.getThumbnail_url())
                .build();
    }

    /**
     * Convert ProductDto to Product entity
     * NOTE: Category is NOT set here - must be set in service layer
     */
    public Product toEntity(ProductDto productDto) {
        if (productDto == null) {
            return null;
        }

        return Product.builder()
                .productId(productDto.getProductId())
                .name(productDto.getName())
                .shortDescription(productDto.getShortDescription())
                .description(productDto.getDescription())
                .price(productDto.getPrice())
                .stockQuantity(productDto.getStockQuantity())
                .isActive(productDto.getIsActive() != null ? productDto.getIsActive() : false)
                // Category is set separately in service layer using categoryId
                .category(null) // Will be set in service
                .thumbnail_url(productDto.getThumbnail_url())
                .build();
    }

    /**
     * Update existing Product entity with ProductDto values
     * Does NOT update category - handle separately
     */
    public void updateProductFromDto(ProductDto productDto, Product product) {
        if (productDto == null || product == null) {
            return;
        }

        if (productDto.getName() != null) {
            product.setName(productDto.getName());
        }

        if (productDto.getShortDescription() != null) {
            product.setShortDescription(productDto.getShortDescription());
        }

        if (productDto.getDescription() != null) {
            product.setDescription(productDto.getDescription());
        }

        if (productDto.getPrice() != null) {
            product.setPrice(productDto.getPrice());
        }

        if (productDto.getStockQuantity() != null) {
            product.setStockQuantity(productDto.getStockQuantity());
        }

        if (productDto.getIsActive() != null) {
            product.setActive(productDto.getIsActive());
        }
        // Note: We don't update categoryId here - handle in service

        if (productDto.getThumbnail_url() != null) {
            product.setThumbnail_url(productDto.getThumbnail_url());
        }
    }

    /**
     * Convert Product entity to ProductListDto
     */
    public ProductListDto toListDto(Product product) {
        if (product == null) {
            return null;
        }

        return ProductListDto.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .shortDescription(product.getShortDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .isActive(product.isActive())
                .categoryId(product.getCategory() != null ? product.getCategory().getCategoryId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .thumbnail_url(product.getThumbnail_url())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    /**
     * Convert list of Products to list of ProductDtos
     */
    public List<ProductDto> toDtoList(List<Product> products) {
        if (products == null || products.isEmpty()) {
            return Collections.emptyList();
        }

        return products.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Convert list of Products to list of ProductListDtos
     */
    public List<ProductListDto> toListDtoList(List<Product> products) {
        if (products == null || products.isEmpty()) {
            return Collections.emptyList();
        }

        return products.stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    /**
     * Convert list of ProductDtos to list of Products (without categories)
     */
    public List<Product> toEntityList(List<ProductDto> productDtos) {
        if (productDtos == null || productDtos.isEmpty()) {
            return Collections.emptyList();
        }

        return productDtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}
