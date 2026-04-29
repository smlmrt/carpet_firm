package com.halistok.halistok.repository;

import com.halistok.halistok.entity.Urun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrunRepository extends JpaRepository<Urun, Long> {
    Optional<Urun> findByStokKodu(String stokKodu);
    boolean existsByStokKodu(String stokKodu);
    List<Urun> findByKategoriId(Long kategoriId);

    @Query("SELECT u FROM Urun u WHERE u.stokMiktari <= u.minimumStok")
    List<Urun> findDusukStokluUrunler();

    List<Urun> findByAdContainingIgnoreCase(String ad);
}
