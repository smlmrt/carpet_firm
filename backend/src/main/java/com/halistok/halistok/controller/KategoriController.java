package com.halistok.halistok.controller;

import com.halistok.halistok.dto.KategoriDto;
import com.halistok.halistok.service.KategoriService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kategoriler")
@RequiredArgsConstructor
public class KategoriController {

    private final KategoriService kategoriService;

    @GetMapping
    public ResponseEntity<List<KategoriDto>> tumKategoriler() {
        return ResponseEntity.ok(kategoriService.tumKategoriler());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KategoriDto> getirById(@PathVariable Long id) {
        return ResponseEntity.ok(kategoriService.getirById(id));
    }

    @PostMapping
    public ResponseEntity<KategoriDto> ekle(@Valid @RequestBody KategoriDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(kategoriService.ekle(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<KategoriDto> guncelle(@PathVariable Long id, @Valid @RequestBody KategoriDto dto) {
        return ResponseEntity.ok(kategoriService.guncelle(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> sil(@PathVariable Long id) {
        kategoriService.sil(id);
        return ResponseEntity.noContent().build();
    }
}
