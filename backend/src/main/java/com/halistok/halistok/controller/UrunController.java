package com.halistok.halistok.controller;

import com.halistok.halistok.dto.UrunDto;
import com.halistok.halistok.service.UrunService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/urunler")
@RequiredArgsConstructor
public class UrunController {

    private final UrunService urunService;

    @GetMapping
    public ResponseEntity<List<UrunDto>> tumUrunler() {
        return ResponseEntity.ok(urunService.tumUrunler());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UrunDto> getirById(@PathVariable Long id) {
        return ResponseEntity.ok(urunService.getirById(id));
    }

    @GetMapping("/kategori/{kategoriId}")
    public ResponseEntity<List<UrunDto>> kategoriyeGoreGetir(@PathVariable Long kategoriId) {
        return ResponseEntity.ok(urunService.kategoriyeGoreGetir(kategoriId));
    }

    @GetMapping("/dusuk-stok")
    public ResponseEntity<List<UrunDto>> dusukStokluUrunler() {
        return ResponseEntity.ok(urunService.dusukStokluUrunler());
    }

    @GetMapping("/ara")
    public ResponseEntity<List<UrunDto>> ara(@RequestParam String q) {
        return ResponseEntity.ok(urunService.ara(q));
    }

    @PostMapping
    public ResponseEntity<UrunDto> ekle(@Valid @RequestBody UrunDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(urunService.ekle(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UrunDto> guncelle(@PathVariable Long id, @Valid @RequestBody UrunDto dto) {
        return ResponseEntity.ok(urunService.guncelle(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> sil(@PathVariable Long id) {
        urunService.sil(id);
        return ResponseEntity.noContent().build();
    }
}
