package com.liferpg;

import com.liferpg.dto.RegisterRequest;
import com.liferpg.repository.UserRepository;
import com.liferpg.service.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class LifeRpgApplication {

    public static void main(String[] args) {
        SpringApplication.run(LifeRpgApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDemoUser(UserRepository userRepository, AuthService authService) {
        return args -> {
            if (!userRepository.existsByUsername("hero")) {
                RegisterRequest request = new RegisterRequest();
                request.setUsername("hero");
                request.setEmail("hero@liferpg.local");
                request.setPassword("password123");
                request.setConfirmPassword("password123");
                try {
                    authService.registerUser(request);
                    System.out.println(">>> Demo user 'hero' created with password 'password123'");
                } catch (Exception e) {
                    System.err.println(">>> Could not create demo user: " + e.getMessage());
                }
            }
        };
    }
}
