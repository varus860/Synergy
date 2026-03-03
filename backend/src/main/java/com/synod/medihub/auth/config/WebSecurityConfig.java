package com.synod.medihub.auth.config;

import com.synod.medihub.auth.services.AdminDetailsService;
import com.synod.medihub.auth.services.CustomerDetailsService;
import com.synod.medihub.auth.services.UnifiedUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
public class WebSecurityConfig {

    private static final String[] publicApis= {
            "/api/auth/**",
            "/api/admin/login",
            "/api/admin/register",
            "/bulk-upload/**",
    };

    @Autowired
    private CustomerDetailsService customerDetailsService;

    @Autowired
    private AdminDetailsService adminDetailsService;

    @Autowired
    private UnifiedUserDetailsService unifiedUserDetailsService;

    @Autowired
    private JWTTokenHelper jwtTokenHelper;

    @Value("${security.enabled:true}")
    private boolean securityEnabled;

    @Bean
    @org.springframework.core.annotation.Order(1)
    public SecurityFilterChain adminSecurityFilterChain(HttpSecurity http) throws Exception {
        if (securityEnabled) {
            http.securityMatcher("/api/admin/**")
                    .csrf(AbstractHttpConfigurer::disable)
                    .cors(org.springframework.security.config.Customizer.withDefaults())
                    .authorizeHttpRequests((authorize) -> authorize
                            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                            .requestMatchers("/api/admin/login", "/api/admin/register").permitAll()
                            .anyRequest().hasRole("ADMIN"))
                    .authenticationProvider(adminAuthenticationProvider())
                    .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    .addFilterBefore(new JWTAuthenticationFilter(jwtTokenHelper, unifiedUserDetailsService), UsernamePasswordAuthenticationFilter.class);
        } else {
            http.securityMatcher("/api/admin/**").authorizeHttpRequests(auth -> auth.anyRequest().permitAll()).csrf(AbstractHttpConfigurer::disable);
        }
        return http.build();
    }

    @Bean
    @org.springframework.core.annotation.Order(2)
    public SecurityFilterChain customerSecurityFilterChain(HttpSecurity http) throws Exception {
        if (securityEnabled) {
            http.csrf(AbstractHttpConfigurer::disable)
                    .cors(org.springframework.security.config.Customizer.withDefaults())
                    .authorizeHttpRequests((authorize) -> authorize
                            .requestMatchers("/", "/index.html", "/favicon.ico", "/*.png", "/*.jpg", "/assets/**").permitAll()
                            .requestMatchers("/products", "/details/**", "/cart", "/checkout", "/account", "/admin/**", "/v1/**").permitAll()
                            .requestMatchers("/privacy-policy", "/terms-of-service", "/compliance", "/contact", "/about").permitAll()
                            .requestMatchers("/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**").permitAll()
                            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                            .requestMatchers("/api/auth/**", "/api/config").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/products/**", "/api/category/**", "/api/reviews/**").permitAll()
                            .requestMatchers(HttpMethod.POST, "/api/reviews/**").authenticated()
                            .requestMatchers("/oauth2/success", "/error").permitAll()
                            .anyRequest().authenticated())
                    .authenticationProvider(customerAuthenticationProvider())
                    .exceptionHandling(exception -> exception
                            .authenticationEntryPoint(new org.springframework.security.web.authentication.HttpStatusEntryPoint(org.springframework.http.HttpStatus.UNAUTHORIZED)))
                    .oauth2Login((oauth2login) -> oauth2login.defaultSuccessUrl("/oauth2/success"))
                    .sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                    .addFilterBefore(new JWTAuthenticationFilter(jwtTokenHelper, unifiedUserDetailsService), UsernamePasswordAuthenticationFilter.class);
        } else {
            http.authorizeHttpRequests((authorize) -> authorize
                    .anyRequest().permitAll()
            ).csrf(AbstractHttpConfigurer::disable);
        }
        return http.build();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer(){
        return (web) -> web.ignoring().requestMatchers(publicApis);
    }

    @Bean
    public DaoAuthenticationProvider adminAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider((org.springframework.security.core.userdetails.UserDetailsService) adminDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public DaoAuthenticationProvider customerAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider((org.springframework.security.core.userdetails.UserDetailsService) customerDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(adminAuthenticationProvider(), customerAuthenticationProvider());
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(java.util.List.of("http://localhost:5173"));
        configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(java.util.List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
