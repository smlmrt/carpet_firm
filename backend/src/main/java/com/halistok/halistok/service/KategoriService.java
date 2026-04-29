package com.halistok.halistok.service;

import com.halistok.halistok.dto.KategoriDto;
import com.halistok.halistok.entity.Kategori;
import com.halistok.halistok.exception.ResourceNotFoundException;
import com.halistok.halistok.repository.KategoriRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class KategoriService {

    private final KategoriRepository kategoriRepository;

    @Transactional(readOnly = true)
    public List<KategoriDto> tumKategoriler() {
        return kategoriRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public KategoriDto getirById(Long id) {
        Kategori kategori = kategoriRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kategori bulunamadı: " + id));
        return toDto(kategori);
    }

    public KategoriDto ekle(KategoriDto dto) {
        if (kategoriRepository.existsByAd(dto.getAd())) {
            throw new IllegalArgumentException("Bu isimde kategori zaten mevcut: " + dto.getAd());
        }
        Kategori kategori = Kategori.builder()
                .ad(dto.getAd())
                .aciklama(dto.getAciklama())
                .build();
        return toDto(kategoriRepository.save(kategori));
    }

    public KategoriDto guncelle(Long id, KategoriDto dto) {
        Kategori kategori = kategoriRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kategori bulunamadı: " + id));

        if (!kategori.getAd().equals(dto.getAd()) && kategoriRepository.existsByAd(dto.getAd())) {
            throw new IllegalArgumentException("Bu isimde kategori zaten mevcut: " + dto.getAd());
        }

        kategori.setAd(dto.getAd());
        kategori.setAciklama(dto.getAciklama());
        return toDto(kategoriRepository.save(kategori));
    }

    public void sil(Long id) {
        Kategori kategori = kategoriRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kategori bulunamadı: " + id));
        if (!kategori.getUrunler().isEmpty()) {
            throw new IllegalArgumentException("Bu kategoriye ait ürünler mevcut, silinemez.");
        }
        kategoriRepository.delete(kategori);
    }

    private KategoriDto toDto(Kategori k) {
        return KategoriDto.builder()
                .id(k.getId())
                .ad(k.getAd())
                .aciklama(k.getAciklama())
                .urunSayisi(k.getUrunler().size())
                .build();
    }
}
