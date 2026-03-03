package com.synod.medihub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductListDto {
    private Long productId;
    private String name;
    private String shortDescription;
    private BigDecimal price;
    private Integer stockQuantity;
    private Boolean isActive;
    private Long categoryId;
    private String categoryName;
    private String thumbnail_url;
    private Date createdAt;
    private Date updatedAt;
}
