package com.halistok.halistok.repository;

import com.halistok.halistok.entity.StokHareketi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StokHareketiRepository extends JpaRepository<StokHareketi, Long> {
    List<StokHareketi> findByUrunIdOrderByTarihDesc(Long urunId);
    List<StokHareketi> findAllByOrderByTarihDesc();
}
