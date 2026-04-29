package com.halistok.halistok.controller;

import com.halistok.halistok.dto.StokHareketiDto;
import com.halistok.halistok.service.StokHareketiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stok-hareketleri")
@RequiredArgsConstructor
public class StokHareketiController {

    private final StokHareketiService stokHareketiService;

    @GetMapping
    public ResponseEntity<List<StokHareketiDto>> tumHareketler() {
        return ResponseEntity.ok(stokHareketiService.tumHareketler());
    }

    @GetMapping("/urun/{urunId}")
    public ResponseEntity<List<StokHareketiDto>> urunHareketleri(@PathVariable Long urunId) {
        return ResponseEntity.ok(stokHareketiService.urunHareketleri(urunId));
    }

    @PostMapping
    public ResponseEntity<StokHareketiDto> hareketiKaydet(@Valid @RequestBody StokHareketiDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(stokHareketiService.hareketiKaydet(dto));
    }
}
