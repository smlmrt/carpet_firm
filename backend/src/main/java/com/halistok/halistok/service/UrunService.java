package com.halistok.halistok.service;

import com.halistok.halistok.dto.UrunDto;
import com.halistok.halistok.entity.Kategori;
import com.halistok.halistok.entity.Urun;
import com.halistok.halistok.exception.ResourceNotFoundException;
import com.halistok.halistok.repository.KategoriRepository;
import com.halistok.halistok.repository.UrunRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UrunService {

    private final UrunRepository urunRepository;
    private final KategoriRepository kategoriRepository;

    @Transactional(readOnly = true)
    public List<UrunDto> tumUrunler() {
        return urunRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UrunDto getirById(Long id) {
        return toDto(bulamazsaHataFirlat(id));
    }

    @Transactional(readOnly = true)
    public List<UrunDto> kategoriyeGoreGetir(Long kategoriId) {
        return urunRepository.findByKategoriId(kategoriId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UrunDto> dusukStokluUrunler() {
        return urunRepository.findDusukStokluUrunler().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UrunDto> ara(String ad) {
        return urunRepository.findByAdContainingIgnoreCase(ad).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public UrunDto ekle(UrunDto dto) {
        if (dto.getStokKodu() != null && !dto.getStokKodu().isBlank()
                && urunRepository.existsByStokKodu(dto.getStokKodu())) {
            throw new IllegalArgumentException("Bu stok kodu zaten kullanımda: " + dto.getStokKodu());
        }

        Urun urun = Urun.builder()
                .ad(dto.getAd())
                .stokKodu(dto.getStokKodu())
                .renk(dto.getRenk())
                .materyal(dto.getMateryal())
                .boyut(dto.getBoyut())
                .birimFiyat(dto.getBirimFiyat())
                .stokMiktari(dto.getStokMiktari() != null ? dto.getStokMiktari() : 0)
                .minimumStok(dto.getMinimumStok() != null ? dto.getMinimumStok() : 0)
                .aciklama(dto.getAciklama())
                .olusturmaTarihi(LocalDateTime.now())
                .guncellemeTarihi(LocalDateTime.now())
                .build();

        if (dto.getKategoriId() != null) {
            Kategori kategori = kategoriRepository.findById(dto.getKategoriId())
                    .orElseThrow(() -> new ResourceNotFoundException("Kategori bulunamadı: " + dto.getKategoriId()));
            urun.setKategori(kategori);
        }

        return toDto(urunRepository.save(urun));
    }

    public UrunDto guncelle(Long id, UrunDto dto) {
        Urun urun = bulamazsaHataFirlat(id);

        if (dto.getStokKodu() != null && !dto.getStokKodu().isBlank()
                && !dto.getStokKodu().equals(urun.getStokKodu())
                && urunRepository.existsByStokKodu(dto.getStokKodu())) {
            throw new IllegalArgumentException("Bu stok kodu zaten kullanımda: " + dto.getStokKodu());
        }

        urun.setAd(dto.getAd());
        urun.setStokKodu(dto.getStokKodu());
        urun.setRenk(dto.getRenk());
        urun.setMateryal(dto.getMateryal());
        urun.setBoyut(dto.getBoyut());
        urun.setBirimFiyat(dto.getBirimFiyat());
        urun.setMinimumStok(dto.getMinimumStok() != null ? dto.getMinimumStok() : 0);
        urun.setAciklama(dto.getAciklama());

        if (dto.getKategoriId() != null) {
            Kategori kategori = kategoriRepository.findById(dto.getKategoriId())
                    .orElseThrow(() -> new ResourceNotFoundException("Kategori bulunamadı: " + dto.getKategoriId()));
            urun.setKategori(kategori);
        } else {
            urun.setKategori(null);
        }

        return toDto(urunRepository.save(urun));
    }

    public void sil(Long id) {
        Urun urun = bulamazsaHataFirlat(id);
        urunRepository.delete(urun);
    }

    private Urun bulamazsaHataFirlat(Long id) {
        return urunRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı: " + id));
    }

    private UrunDto toDto(Urun u) {
        return UrunDto.builder()
                .id(u.getId())
                .ad(u.getAd())
                .stokKodu(u.getStokKodu())
                .renk(u.getRenk())
                .materyal(u.getMateryal())
                .boyut(u.getBoyut())
                .birimFiyat(u.getBirimFiyat())
                .stokMiktari(u.getStokMiktari())
                .minimumStok(u.getMinimumStok())
                .aciklama(u.getAciklama())
                .kategoriId(u.getKategori() != null ? u.getKategori().getId() : null)
                .kategoriAd(u.getKategori() != null ? u.getKategori().getAd() : null)
                .olusturmaTarihi(u.getOlusturmaTarihi())
                .guncellemeTarihi(u.getGuncellemeTarihi())
                .build();
    }
}
