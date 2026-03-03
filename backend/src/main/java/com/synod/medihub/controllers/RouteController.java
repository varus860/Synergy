package com.synod.medihub.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RouteController {

    @GetMapping(value = {
        "/",
        "/products",
        "/details/**",
        "/cart",
        "/checkout",
        "/account",
        "/admin/**",
        "/v1/**",
        "/privacy-policy",
        "/terms-of-service",
        "/compliance",
        "/contact",
        "/about"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
