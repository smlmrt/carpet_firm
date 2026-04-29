package com.halistok.halistok.repository;

import com.halistok.halistok.entity.Kategori;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KategoriRepository extends JpaRepository<Kategori, Long> {
    Optional<Kategori> findByAd(String ad);
    boolean existsByAd(String ad);
}
