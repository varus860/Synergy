package com.synod.medihub.mapper;

import com.synod.medihub.dto.CategoryDto;
import com.synod.medihub.dto.ProductDto;
import com.synod.medihub.entities.Category;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CategoryMapper {

    private final ProductMapper productMapper;

    public CategoryMapper(ProductMapper productMapper) {
        this.productMapper = productMapper;
    }

    /**
     * Convert Category entity to CategoryDto WITHOUT products
     * Use this when you don't need the product list
     */
    public CategoryDto toDto(Category category) {
        if (category == null) {
            return null;
        }

        return CategoryDto.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .code(category.getCode())
                .description(category.getDescription())
                // Don't include products by default to avoid performance issues
                .productDtoList(null)
                .build();
    }

    /**
     * Convert Category entity to CategoryDto WITH products
     * Use this when you need the complete category with all products
     */
    public CategoryDto toDtoWithProducts(Category category) {
        if (category == null) {
            return null;
        }

        CategoryDto dto = toDto(category);

        // Handle the One-to-Many relationship: map products
        if (category.getProductList() != null && !category.getProductList().isEmpty()) {
            dto.setProductDtoList(productMapper.toDtoList(category.getProductList()));
        } else {
            dto.setProductDtoList(Collections.emptyList());
        }

        return dto;
    }

    /**
     * Convert CategoryDto to Category entity
     * Note: productList is not set here - handle in service
     */
    public Category toEntity(CategoryDto categoryDto) {
        if (categoryDto == null) {
            return null;
        }

        return Category.builder()
                .categoryId(categoryDto.getCategoryId())
                .name(categoryDto.getName())
                .code(categoryDto.getCode())
                .description(categoryDto.getDescription())
                // Don't set productList from DTO to avoid circular issues
                .productList(new ArrayList<>()) // Empty list, will be populated if needed
                .build();
    }

    /**
     * Update existing Category entity with CategoryDto values
     * Does NOT update products
     */
    public void updateCategoryFromDto(CategoryDto categoryDto, Category category) {
        if (categoryDto == null || category == null) {
            return;
        }

        if (categoryDto.getName() != null) {
            category.setName(categoryDto.getName());
        }

        if (categoryDto.getCode() != null) {
            category.setCode(categoryDto.getCode());
        }

        if (categoryDto.getDescription() != null) {
            category.setDescription(categoryDto.getDescription());
        }

        // Note: We don't update productList here
    }

    /**
     * Convert list of Categories to list of CategoryDtos (without products)
     */
    public List<CategoryDto> toDtoList(List<Category> categories) {
        if (categories == null || categories.isEmpty()) {
            return Collections.emptyList();
        }

        return categories.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Convert list of Categories to list of CategoryDtos with products
     * Use with caution - can cause performance issues with large datasets
     */
    public List<CategoryDto> toDtoListWithProducts(List<Category> categories) {
        if (categories == null || categories.isEmpty()) {
            return Collections.emptyList();
        }

        return categories.stream()
                .map(this::toDtoWithProducts)
                .collect(Collectors.toList());
    }
}
