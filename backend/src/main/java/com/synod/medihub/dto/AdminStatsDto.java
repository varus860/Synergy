package com.synod.medihub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsDto {
    private long totalProducts;
    private long totalOrders;
    private long totalCustomers;
    private BigDecimal totalRevenue;
}
