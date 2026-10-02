package com.techstock.auth;

import java.util.List;
import org.springframework.context.annotation.*;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.*;
import org.springframework.security.web.csrf.*;
import org.springframework.security.web.authentication.session.*;
import org.springframework.web.cors.*;

@Configuration
public class SecurityConfig {
    @Bean
    PasswordEncoder passwordEncoder() {
        return Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_8();
    }

    @Bean
    AuthenticationManager authenticationManager(UserDetailsService usuarios, PasswordEncoder encoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(usuarios);
        provider.setPasswordEncoder(encoder);
        return new ProviderManager(provider);
    }

    @Bean
    SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    CsrfTokenRepository csrfTokenRepository() {
        return new HttpSessionCsrfTokenRepository();
    }

    @Bean
    SessionAuthenticationStrategy sessionAuthenticationStrategy(CsrfTokenRepository csrf) {
        return new CompositeSessionAuthenticationStrategy(List.of(
            new ChangeSessionIdAuthenticationStrategy(), new CsrfAuthenticationStrategy(csrf)));
    }

    @Bean @Order(1)
    SecurityFilterChain authSecurity(HttpSecurity http, SecurityContextRepository context, CsrfTokenRepository csrf) throws Exception {
        return http.securityMatcher("/api/**")
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(config -> config.csrfTokenRepository(csrf))
            .securityContext(config -> config.securityContextRepository(context))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/admin").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.GET, "/api/auth/csrf").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/cadastro", "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/produtos", "/api/produtos/**").permitAll()
                // Cadastro, edição e exclusão são autorizados pelo servidor apenas para administradores.
                .requestMatchers(HttpMethod.POST, "/api/produtos").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.PUT, "/api/produtos/**").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.DELETE, "/api/produtos/**").hasRole("ADMINISTRADOR")
                .requestMatchers("/api/auth/me").authenticated()
                .anyRequest().denyAll())
            .exceptionHandling(errors -> errors
                .authenticationEntryPoint((request, response, error) -> response.sendError(401))
                .accessDeniedHandler((request, response, error) -> response.sendError(403)))
            .logout(logout -> logout.logoutUrl("/api/auth/sair")
                .invalidateHttpSession(true).deleteCookies("JSESSIONID")
                .logoutSuccessHandler((request, response, auth) -> response.setStatus(204)))
            .build();
    }

    // A página de erro do Spring não contém operações da API.
    @Bean @Order(2)
    SecurityFilterChain rotasExistentes(HttpSecurity http) throws Exception {
        return http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth.requestMatchers("/error").permitAll().anyRequest().denyAll()).build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Portas usadas pelo Vite no desenvolvimento local.
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Content-Type", "X-CSRF-TOKEN"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}
