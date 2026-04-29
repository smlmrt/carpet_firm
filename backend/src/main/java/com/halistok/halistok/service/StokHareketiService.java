package com.halistok.halistok.service;

import com.halistok.halistok.dto.StokHareketiDto;
import com.halistok.halistok.entity.StokHareketi;
import com.halistok.halistok.entity.Urun;
import com.halistok.halistok.exception.ResourceNotFoundException;
import com.halistok.halistok.repository.StokHareketiRepository;
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
public class StokHareketiService {

    private final StokHareketiRepository stokHareketiRepository;
    private final UrunRepository urunRepository;

    @Transactional(readOnly = true)
    public List<StokHareketiDto> tumHareketler() {
        return stokHareketiRepository.findAllByOrderByTarihDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StokHareketiDto> urunHareketleri(Long urunId) {
        return stokHareketiRepository.findByUrunIdOrderByTarihDesc(urunId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public StokHareketiDto hareketiKaydet(StokHareketiDto dto) {
        Urun urun = urunRepository.findById(dto.getUrunId())
                .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı: " + dto.getUrunId()));

        if (dto.getTip() == StokHareketi.HareketTipi.CIKIS) {
            if (urun.getStokMiktari() < dto.getMiktar()) {
                throw new IllegalArgumentException(
                        "Yetersiz stok. Mevcut: " + urun.getStokMiktari() + ", İstenen: " + dto.getMiktar());
            }
            urun.setStokMiktari(urun.getStokMiktari() - dto.getMiktar());
        } else {
            urun.setStokMiktari(urun.getStokMiktari() + dto.getMiktar());
        }

        urunRepository.save(urun);

        StokHareketi hareket = StokHareketi.builder()
                .urun(urun)
                .tip(dto.getTip())
                .miktar(dto.getMiktar())
                .aciklama(dto.getAciklama())
                .tarih(LocalDateTime.now())
                .build();

        return toDto(stokHareketiRepository.save(hareket));
    }

    private StokHareketiDto toDto(StokHareketi h) {
        return StokHareketiDto.builder()
                .id(h.getId())
                .urunId(h.getUrun().getId())
                .urunAd(h.getUrun().getAd())
                .stokKodu(h.getUrun().getStokKodu())
                .tip(h.getTip())
                .miktar(h.getMiktar())
                .aciklama(h.getAciklama())
                .tarih(h.getTarih())
                .build();
    }
}
