package com.synod.medihub.services;

import com.synod.medihub.auth.repositories.UserDetailRepository;
import com.synod.medihub.dto.AdminStatsDto;
import com.synod.medihub.repositories.OrderRepository;
import com.synod.medihub.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserDetailRepository userDetailRepository;

    public AdminStatsDto getDashboardStats() {
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long totalCustomers = userDetailRepository.count();
        
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        BigDecimal totalRevenue = orderRepository.sumTotalAmountSince(thirtyDaysAgo);
        
        // Handle null revenue if no orders exist in the last 30 days
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        return AdminStatsDto.builder()
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalCustomers(totalCustomers)
                .totalRevenue(totalRevenue)
                .build();
    }
}
