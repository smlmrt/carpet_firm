package com.halistok.halistok.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KategoriDto {
    private Long id;

    @NotBlank(message = "Kategori adı boş olamaz")
    private String ad;

    private String aciklama;
    private int urunSayisi;
}
