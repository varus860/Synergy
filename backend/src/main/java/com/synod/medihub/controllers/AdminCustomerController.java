package com.synod.medihub.controllers;

import com.synod.medihub.auth.entities.User;
import com.synod.medihub.auth.repositories.UserDetailRepository;
import com.synod.medihub.auth.repositories.UserSpecification;
import com.synod.medihub.dto.AdminCustomerResponse;
import com.synod.medihub.repositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/admin/customers")
@CrossOrigin
@RequiredArgsConstructor
public class AdminCustomerController {

    private final UserDetailRepository userDetailRepository;
    private final OrderRepository orderRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AdminCustomerResponse>> getAdminCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "id,desc") String sort) {

        String[] sortParams = sort.split(",");
        Sort sortOrder = Sort.by(sortParams[0]);
        if (sortParams.length > 1 && sortParams[1].equalsIgnoreCase("desc")) {
            sortOrder = sortOrder.descending();
        } else {
            sortOrder = sortOrder.ascending();
        }

        Pageable pageable = PageRequest.of(page, size, sortOrder);
        Specification<User> spec = UserSpecification.search(search);
        
        Page<User> users = userDetailRepository.findAll(spec, pageable);
        Page<AdminCustomerResponse> response = users.map(this::convertToAdminCustomerResponse);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminCustomerResponse> getAdminCustomerById(@PathVariable Long id) {
        User user = userDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        
        return ResponseEntity.ok(convertToAdminCustomerResponse(user));
    }

    private AdminCustomerResponse convertToAdminCustomerResponse(User user) {
        long orderCount = orderRepository.countByUserId(user.getId());
        BigDecimal totalSpentArr = orderRepository.sumTotalAmountByUserId(user.getId());
        BigDecimal totalSpent = totalSpentArr != null ? totalSpentArr : BigDecimal.ZERO;

        return AdminCustomerResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .physicalAddress(user.getPhysicalAddress())
                .registeredOn(user.getCreatedOn())
                .totalOrders(orderCount)
                .totalSpent(totalSpent)
                .build();
    }
}
