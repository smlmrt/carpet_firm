package com.halistok.halistok.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "kategoriler")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Kategori {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String ad;

    @Column(length = 255)
    private String aciklama;

    @OneToMany(mappedBy = "kategori", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Urun> urunler = new ArrayList<>();
}
