package com.liferpg.service;

import com.liferpg.dto.AuthResponse;
import com.liferpg.dto.LoginRequest;
import com.liferpg.dto.RegisterRequest;
import com.liferpg.entity.CharacterProfile;
import com.liferpg.entity.User;
import com.liferpg.entity.WorldRegion;
import com.liferpg.entity.UserWorldProgress;
import com.liferpg.exception.BadRequestException;
import com.liferpg.repository.CharacterProfileRepository;
import com.liferpg.repository.UserRepository;
import com.liferpg.repository.WorldRegionRepository;
import com.liferpg.repository.UserWorldProgressRepository;
import com.liferpg.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CharacterProfileRepository characterProfileRepository;

    @Autowired
    private WorldRegionRepository worldRegionRepository;

    @Autowired
    private UserWorldProgressRepository userWorldProgressRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username '" + request.getUsername() + "' is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address '" + request.getEmail() + "' is already registered!");
        }

        if (request.getConfirmPassword() != null && !request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and confirm password do not match!");
        }

        User user = new User(request.getUsername(), request.getEmail(), passwordEncoder.encode(request.getPassword()));
        User savedUser = userRepository.save(user);

        // Create initial RPG Character Profile
        CharacterProfile character = new CharacterProfile(savedUser);
        characterProfileRepository.save(character);

        // Unlock Starting World Region (Your Base)
        List<WorldRegion> regions = worldRegionRepository.findAll();
        for (WorldRegion region : regions) {
            boolean isBase = region.getRegionName().equalsIgnoreCase("Your Base") || region.getMinLevel() <= 1;
            UserWorldProgress progress = new UserWorldProgress(savedUser, region, isBase);
            userWorldProgressRepository.save(progress);
        }

        String jwt = tokenProvider.generateTokenFromUsername(savedUser.getUsername());
        return new AuthResponse(jwt, savedUser.getId(), savedUser.getUsername(), savedUser.getEmail());
    }

    public AuthResponse loginUser(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsernameOrEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsernameOrEmail())
                .orElseGet(() -> userRepository.findByEmail(request.getUsernameOrEmail())
                        .orElseThrow(() -> new BadRequestException("Invalid credentials")));

        String jwt = tokenProvider.generateToken(authentication);
        return new AuthResponse(jwt, user.getId(), user.getUsername(), user.getEmail());
    }
}
