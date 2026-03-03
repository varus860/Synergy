package com.synod.medihub.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private String shippingAddress;
    private List<OrderItemRequest> items;
}
