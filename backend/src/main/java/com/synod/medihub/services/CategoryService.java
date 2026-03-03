package com.synod.medihub.services;

import com.synod.medihub.dto.CategoryDto;
import com.synod.medihub.dto.ProductDto;
import com.synod.medihub.entities.Category;
import com.synod.medihub.entities.Product;
import com.synod.medihub.exceptions.DuplicateResourceException;
import com.synod.medihub.exceptions.ResourceNotFoundException;
import com.synod.medihub.exceptions.CannotDeleteException;
import com.synod.medihub.mapper.CategoryMapper;
import com.synod.medihub.mapper.ProductMapper;
import com.synod.medihub.repositories.CategoryRepository;
import com.synod.medihub.repositories.ProductRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private ProductMapper productMapper;

    /**
     * CREATE CATEGORY
     * Creates a new category
     */
    public CategoryDto createCategory(CategoryDto categoryDto) {
        // 1. Validate that category code is unique
        if (categoryRepository.existsByCode(categoryDto.getCode())) {
            throw new DuplicateResourceException(
                    "Category with code '" + categoryDto.getCode() + "' already exists");
        }

        // 2. Validate category name is unique (optional)
        if (categoryRepository.existsByName(categoryDto.getName())) {
            throw new DuplicateResourceException(
                    "Category with name '" + categoryDto.getName() + "' already exists");
        }

        // 3. Convert DTO to entity
        Category category = categoryMapper.toEntity(categoryDto);

        // 4. Initialize product list if null
        if (category.getProductList() == null) {
            category.setProductList(new ArrayList<>());
        }

        // 5. Save the category
        Category savedCategory = categoryRepository.save(category);

        // 6. Return DTO without products for performance
        return categoryMapper.toDto(savedCategory);
    }

    /**
     * CREATE CATEGORY WITH PRODUCTS
     * Creates a category and adds products to it
     */
    public CategoryDto createCategoryWithProducts(CategoryDto categoryDto) {
        // 1. Validate code uniqueness
        if (categoryRepository.existsByCode(categoryDto.getCode())) {
            throw new DuplicateResourceException(
                    "Category code '" + categoryDto.getCode() + "' already exists");
        }

        // 2. Create category entity
        Category category = categoryMapper.toEntity(categoryDto);

        // 3. Handle products if provided in DTO
        if (categoryDto.getProductDtoList() != null &&
                !categoryDto.getProductDtoList().isEmpty()) {

            List<Product> products = new ArrayList<>();

            for (ProductDto productDto : categoryDto.getProductDtoList()) {
                // Create or find existing products
                Product product;
                if (productDto.getProductId() != null) {
                    // Existing product - find and update
                    product = productRepository.findById(productDto.getProductId())
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Product not found with id: " + productDto.getProductId()));
                } else {
                    // New product - create from DTO
                    product = productMapper.toEntity(productDto);
                }

                // Set bidirectional relationship
                product.setCategory(category);
                products.add(product);
            }

            category.setProductList(products);
        }

        // 4. Save category (products will be saved due to cascade if configured)
        Category savedCategory = categoryRepository.save(category);

        // 5. Return DTO with products
        return categoryMapper.toDtoWithProducts(savedCategory);
    }



    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        return categoryMapper.toDto(category);
    }

    /**
     * GET ALL CATEGORIES (without products)
     * Returns list of categories without product details for performance
     */
    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        // Get all categories from repository
        List<Category> categories = categoryRepository.findAll();

        // Convert to DTOs without products
        return categoryMapper.toDtoList(categories);
    }

    /**
     * GET CATEGORY WITH PRODUCTS
     * Returns a category with all its products
     */
    @Transactional(readOnly = true)
    public CategoryDto getCategoryWithProducts(Long categoryId) {
        // Find category with products eagerly loaded
        Category category = categoryRepository.findByIdWithProducts(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + categoryId));

        // Convert to DTO with products
        return categoryMapper.toDtoWithProducts(category);
    }

    /**
     * UPDATE CATEGORY
     * Updates an existing category
     */
    public CategoryDto updateCategory(Long categoryId, CategoryDto categoryDto) {
        // 1. Find existing category
        Category existingCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + categoryId));

        // 2. Check if code is being changed and if new code is unique
        if (!existingCategory.getCode().equals(categoryDto.getCode()) &&
                categoryRepository.existsByCode(categoryDto.getCode())) {
            throw new DuplicateResourceException(
                    "Category code '" + categoryDto.getCode() + "' already exists");
        }

        // 3. Check if name is being changed and if new name is unique
        if (!existingCategory.getName().equals(categoryDto.getName()) &&
                categoryRepository.existsByName(categoryDto.getName())) {
            throw new DuplicateResourceException(
                    "Category name '" + categoryDto.getName() + "' already exists");
        }

        // 4. Update category fields
        existingCategory.setName(categoryDto.getName());
        existingCategory.setCode(categoryDto.getCode());
        existingCategory.setDescription(categoryDto.getDescription());

        // 5. Save updated category
        Category updatedCategory = categoryRepository.save(existingCategory);

        // 6. Return DTO without products for performance
        return categoryMapper.toDto(updatedCategory);
    }

    /**
     * DELETE CATEGORY
     * Deletes a category after checking if it's empty
     */
    public void deleteCategory(Long categoryId) {
        // 1. Find category with products
        Category category = categoryRepository.findByIdWithProducts(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + categoryId));

        // 2. Check if category has products
        if (category.getProductList() != null && !category.getProductList().isEmpty()) {
            throw new CannotDeleteException(
                    "Cannot delete category with id " + categoryId +
                            " because it contains " + category.getProductList().size() +
                            " products. Remove all products first or reassign them to another category.");
        }

        // 3. Delete the category
        categoryRepository.delete(category);
    }
}
