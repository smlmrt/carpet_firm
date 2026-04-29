package com.halistok.halistok.dto;

import com.halistok.halistok.entity.StokHareketi;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StokHareketiDto {
    private Long id;

    @NotNull(message = "Ürün ID boş olamaz")
    private Long urunId;

    private String urunAd;
    private String stokKodu;

    @NotNull(message = "Hareket tipi boş olamaz")
    private StokHareketi.HareketTipi tip;

    @Min(value = 1, message = "Miktar en az 1 olmalıdır")
    @NotNull(message = "Miktar boş olamaz")
    private Integer miktar;

    private String aciklama;
    private LocalDateTime tarih;
}
