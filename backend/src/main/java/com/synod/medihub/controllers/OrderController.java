package com.synod.medihub.controllers;

import com.synod.medihub.dto.OrderRequest;
import com.synod.medihub.entities.Order;
import com.synod.medihub.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest request, Principal principal) {
        Order order = orderService.placeOrder(principal.getName(), request);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getUserOrders(Principal principal) {
        List<Order> orders = orderService.getUserOrders(principal.getName());
        return ResponseEntity.ok(orders);
    }
}
