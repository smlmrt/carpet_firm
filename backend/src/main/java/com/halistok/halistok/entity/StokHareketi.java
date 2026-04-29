package com.halistok.halistok.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "stok_hareketleri")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StokHareketi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "urun_id", nullable = false)
    private Urun urun;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private HareketTipi tip;

    @Column(nullable = false)
    private Integer miktar;

    @Column(length = 255)
    private String aciklama;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime tarih = LocalDateTime.now();

    public enum HareketTipi {
        GIRIS, CIKIS
    }
}
