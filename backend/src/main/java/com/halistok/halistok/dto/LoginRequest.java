package com.halistok.halistok.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Kullanıcı adı boş olamaz")
    private String kullaniciAdi;

    @NotBlank(message = "Şifre boş olamaz")
    private String sifre;
}
