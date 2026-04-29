package com.halistok.halistok.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UrunDto {
    private Long id;

    @NotBlank(message = "Ürün adı boş olamaz")
    private String ad;

    private String stokKodu;
    private String renk;
    private String materyal;
    private String boyut;

    @DecimalMin(value = "0.0", message = "Birim fiyat 0'dan küçük olamaz")
    private BigDecimal birimFiyat;

    @Min(value = 0, message = "Stok miktarı 0'dan küçük olamaz")
    private Integer stokMiktari;

    @Min(value = 0, message = "Minimum stok 0'dan küçük olamaz")
    private Integer minimumStok;

    private String aciklama;
    private Long kategoriId;
    private String kategoriAd;
    private LocalDateTime olusturmaTarihi;
    private LocalDateTime guncellemeTarihi;
}
