package com.halistok.halistok.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "urunler")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Urun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String ad;

    @Column(unique = true, length = 50)
    private String stokKodu;

    @Column(length = 100)
    private String renk;

    @Column(length = 100)
    private String materyal;

    @Column(length = 50)
    private String boyut;

    @Column(precision = 10, scale = 2)
    private BigDecimal birimFiyat;

    @Column(nullable = false)
    @Builder.Default
    private Integer stokMiktari = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer minimumStok = 0;

    @Column(length = 255)
    private String aciklama;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "kategori_id")
    private Kategori kategori;

    @OneToMany(mappedBy = "urun", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<StokHareketi> stokHareketleri = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime olusturmaTarihi = LocalDateTime.now();

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime guncellemeTarihi = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.guncellemeTarihi = LocalDateTime.now();
    }
}
