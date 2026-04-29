package com.halistok.halistok.config;

import com.halistok.halistok.entity.Kullanici;
import com.halistok.halistok.repository.KullaniciRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final KullaniciRepository kullaniciRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!kullaniciRepository.existsByKullaniciAdi("admin")) {
            Kullanici admin = Kullanici.builder()
                    .kullaniciAdi("admin")
                    .sifre(passwordEncoder.encode("admin123"))
                    .aktif(true)
                    .build();
            kullaniciRepository.save(admin);
        }
    }
}
