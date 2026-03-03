package com.synod.medihub.services;

import com.synod.medihub.auth.entities.User;
import com.synod.medihub.auth.repositories.UserDetailRepository;
import com.synod.medihub.dto.OrderItemRequest;
import com.synod.medihub.dto.OrderRequest;
import com.synod.medihub.entities.Product;
import com.synod.medihub.entities.Order;
import com.synod.medihub.entities.OrderItem;
import com.synod.medihub.repositories.OrderItemRepository;
import com.synod.medihub.repositories.OrderRepository;
import com.synod.medihub.repositories.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.synod.medihub.repositories.OrderSpecification;
import com.synod.medihub.exceptions.UsernameNotFoundException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserDetailRepository userDetailRepository;

    @Transactional
    public Order placeOrder(String userEmail, OrderRequest request) {
        User user = userDetailRepository.findByEmail(userEmail);
        try {
            if (user == null) {
                throw new UsernameNotFoundException("User not found");
            }
        } catch (Exception e) {
            log.error("Error finding user for placing order: {}", e.getMessage());
            return null;
        }

        Order order = new Order();
        order.setUserId(user.getId());
        order.setShippingAddress(request.getShippingAddress());
        order.setStatus("PENDING");
        order.setDate(LocalDateTime.now());
        
        // Calculate total and validate stock while creating items
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        // Save order first to get ID (or we can save after, but we need order reference for items)
        // Since we are using JPA, we can persist order first or cascade. 
        // Let's calculate total first to set it on order.
        
        // We need to iterate twice or do it in a way we can set the total on the order.
        // Let's iterate to validate and calculate total.
        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemRequest.getProductId()));
            
            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
            
            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
        }
        
        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        for (OrderItemRequest itemRequest : request.getItems()) {
             Product product = productRepository.findById(itemRequest.getProductId()) // Fetch again or cache it, fetching is safe inside transaction
                    .orElseThrow();
             
             // Deduct stock
             product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
             productRepository.save(product);
             
             OrderItem orderItem = new OrderItem();
             orderItem.setOrder(savedOrder);
             orderItem.setProductId(product.getProductId());
             orderItem.setQuantity(itemRequest.getQuantity());
             orderItem.setPriceAtPurchase(product.getPrice());
             
             orderItemRepository.save(orderItem);
        }
        
        return savedOrder;
    }

    public List<Order> getUserOrders(String userEmail){
        User user = userDetailRepository.findByEmail(userEmail);
        if (user == null) {
            log.debug("User not found in customer repository for email: {}. Returning empty order list.", userEmail);
            return List.of();
        }

        return orderRepository.findByUserId(user.getId());
    }

    public Page<Order> getOrdersForAdmin(String search, String status, Pageable pageable) {
        Specification<Order> spec = Specification.where(OrderSpecification.searchById(search))
                .and(OrderSpecification.hasStatus(status));
        return orderRepository.findAll(spec, pageable);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status.toUpperCase());
        return orderRepository.save(order);
    }
}
