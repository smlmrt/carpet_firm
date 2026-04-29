package com.halistok.halistok.service;

import com.halistok.halistok.config.JwtUtil;
import com.halistok.halistok.dto.LoginRequest;
import com.halistok.halistok.dto.LoginResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getKullaniciAdi(), request.getSifre())
        );
        String token = jwtUtil.generateToken(request.getKullaniciAdi());
        return LoginResponse.builder()
                .token(token)
                .kullaniciAdi(request.getKullaniciAdi())
                .build();
    }
}
