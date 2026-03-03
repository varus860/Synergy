package com.synod.medihub.controllers;

import com.synod.medihub.auth.entities.User;
import com.synod.medihub.auth.repositories.UserDetailRepository;
import com.synod.medihub.dto.AdminOrderResponse;
import com.synod.medihub.entities.Order;
import com.synod.medihub.entities.Product;
import com.synod.medihub.repositories.ProductRepository;
import com.synod.medihub.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;
    private final UserDetailRepository userDetailRepository;
    private final ProductRepository productRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AdminOrderResponse>> getAdminOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "id,desc") String sort) {

        String[] sortParams = sort.split(",");
        Sort sortOrder = Sort.by(sortParams[0]);
        if (sortParams.length > 1 && sortParams[1].equalsIgnoreCase("desc")) {
            sortOrder = sortOrder.descending();
        } else {
            sortOrder = sortOrder.ascending();
        }

        Pageable pageable = PageRequest.of(page, size, sortOrder);
        Page<Order> orders = orderService.getOrdersForAdmin(search, status, pageable);
        
        Page<AdminOrderResponse> response = orders.map(this::convertToAdminOrderResponse);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminOrderResponse> getAdminOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(convertToAdminOrderResponse(order));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminOrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        
        String status = body.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().build();
        }
        
        Order updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(convertToAdminOrderResponse(updatedOrder));
    }

    private AdminOrderResponse convertToAdminOrderResponse(Order order) {
        User user = userDetailRepository.findById(order.getUserId()).orElse(null);
        
        List<AdminOrderResponse.OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> {
                    Product product = productRepository.findById(item.getProductId()).orElse(null);
                    return AdminOrderResponse.OrderItemResponse.builder()
                            .productId(item.getProductId())
                            .productName(product != null ? product.getName() : "Unknown Product")
                            .quantity(item.getQuantity())
                            .priceAtPurchase(item.getPriceAtPurchase())
                            .build();
                })
                .collect(Collectors.toList());

        return AdminOrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .customerName(user != null ? user.getFirstName() + " " + user.getLastName() : "Unknown Customer")
                .customerEmail(user != null ? user.getEmail() : "Unknown Email")
                .shippingAddress(order.getShippingAddress())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .date(order.getDate())
                .items(itemResponses)
                .build();
    }
}
