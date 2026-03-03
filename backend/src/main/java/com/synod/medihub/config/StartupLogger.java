package com.synod.medihub.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.net.UnknownHostException;

@Component
@Slf4j
public class StartupLogger {

    private final Environment environment;

    public StartupLogger(Environment environment) {
        this.environment = environment;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void logStartupInfo() {
        String protocol = "http";
        if (environment.getProperty("server.ssl.key-store") != null) {
            protocol = "https";
        }
        String serverPort = environment.getProperty("local.server.port");
        String contextPath = environment.getProperty("server.servlet.context-path");
        if (contextPath == null || contextPath.isEmpty()) {
            contextPath = "/";
        }

        String hostAddress = "localhost";
        try {
            java.util.Enumeration<java.net.NetworkInterface> interfaces = java.net.NetworkInterface.getNetworkInterfaces();
            while (interfaces.hasMoreElements()) {
                java.net.NetworkInterface iface = interfaces.nextElement();
                if (iface.isLoopback() || !iface.isUp()) continue;

                java.util.Enumeration<java.net.InetAddress> addresses = iface.getInetAddresses();
                while (addresses.hasMoreElements()) {
                    java.net.InetAddress addr = addresses.nextElement();
                    if (addr instanceof java.net.Inet4Address && addr.isSiteLocalAddress()) {
                        hostAddress = addr.getHostAddress();
                        break;
                    }
                }
            }
        } catch (java.net.SocketException e) {
            log.warn("Could not determine network address: {}", e.getMessage());
        }

        log.info("\n----------------------------------------------------------\n\t" +
                "Application is running! Access URLs:\n\t" +
                "Local: \t\t{}://localhost:{}{}\n\t" +
                "Network: \t{}://{}:{}{}\n\t" +
                "App Name: \t{}\n\t" +
                "CWD: \t\t{}\n" +
                "----------------------------------------------------------",
                protocol, serverPort, contextPath,
                protocol, hostAddress, serverPort, contextPath,
                environment.getProperty("spring.application.name"), System.getProperty("user.dir"));
    }
}
