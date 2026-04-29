import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { urunAPI, stokHareketiAPI, kategoriAPI } from '../services/api';
import styles from './Dashboard.module.css';
import shared from '../components/shared.module.css';

function StatCard({ label, value, sub, color }) {
  return (
    <div className={styles.statCard} style={{ borderTopColor: color }}>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { data: urunler = [] } = useQuery({ queryKey: ['urunler'], queryFn: urunAPI.getAll });
  const { data: kategoriler = [] } = useQuery({ queryKey: ['kategoriler'], queryFn: kategoriAPI.getAll });
  const { data: hareketler = [] } = useQuery({ queryKey: ['hareketler'], queryFn: stokHareketiAPI.getAll });
  const { data: dusukStok = [] } = useQuery({ queryKey: ['dusukStok'], queryFn: urunAPI.getDusukStok });

  const sonHareketler = hareketler.slice(0, 8);

  return (
    <div>
      <div className={shared.pageHeader}>
        <h1 className={shared.pageTitle}>Genel Özet</h1>
      </div>

      <div className={styles.stats}>
        <StatCard label="Toplam Ürün" value={urunler.length} color="#1e3a5f" />
        <StatCard label="Kategoriler" value={kategoriler.length} color="#7c3aed" />
        <StatCard label="Stok Hareketleri" value={hareketler.length} color="#0891b2" />
        <StatCard
          label="Düşük Stok Uyarısı"
          value={dusukStok.length}
          sub={dusukStok.length > 0 ? 'Dikkat gerekiyor' : 'Sorun yok'}
          color={dusukStok.length > 0 ? '#dc2626' : '#16a34a'}
        />
      </div>

      {dusukStok.length > 0 && (
        <div className={`${shared.card} ${styles.alertCard}`}>
          <h2 className={styles.sectionTitle}>⚠️ Düşük Stok Uyarısı</h2>
          <table className={shared.table}>
            <thead>
              <tr>
                <th>Ürün</th>
                <th>Stok Kodu</th>
                <th>Mevcut Stok</th>
                <th>Min. Stok</th>
              </tr>
            </thead>
            <tbody>
              {dusukStok.map(u => (
                <tr key={u.id}>
                  <td>{u.ad}</td>
                  <td><span className={`${shared.badge} ${shared.badgeGray}`}>{u.stokKodu || '-'}</span></td>
                  <td><span className={`${shared.badge} ${shared.badgeRed}`}>{u.stokMiktari}</span></td>
                  <td>{u.minimumStok}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={shared.card} style={{ marginTop: 24 }}>
        <h2 className={styles.sectionTitle}>Son Stok Hareketleri</h2>
        {sonHareketler.length === 0 ? (
          <div className={shared.emptyState}>Henüz hareket kaydı yok.</div>
        ) : (
          <table className={shared.table}>
            <thead>
              <tr>
                <th>Ürün</th>
                <th>Tip</th>
                <th>Miktar</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {sonHareketler.map(h => (
                <tr key={h.id}>
                  <td>{h.urunAd}</td>
                  <td>
                    <span className={`${shared.badge} ${h.tip === 'GIRIS' ? shared.badgeGreen : shared.badgeRed}`}>
                      {h.tip === 'GIRIS' ? '▲ Giriş' : '▼ Çıkış'}
                    </span>
                  </td>
                  <td>{h.miktar}</td>
                  <td>{new Date(h.tarih).toLocaleString('tr-TR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
