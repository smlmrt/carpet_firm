import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { urunAPI, kategoriAPI } from '../services/api';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import shared from '../components/shared.module.css';

function UrunForm({ initial, kategoriler, onSave, onCancel, loading }) {
  const [form, setForm] = useState({
    ad: initial?.ad || '',
    stokKodu: initial?.stokKodu || '',
    renk: initial?.renk || '',
    materyal: initial?.materyal || '',
    boyut: initial?.boyut || '',
    birimFiyat: initial?.birimFiyat ?? '',
    stokMiktari: initial?.stokMiktari ?? 0,
    minimumStok: initial?.minimumStok ?? 0,
    aciklama: initial?.aciklama || '',
    kategoriId: initial?.kategoriId ?? '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.ad.trim()) e.ad = 'Ürün adı zorunludur';
    if (form.stokMiktari < 0) e.stokMiktari = '0 veya daha büyük olmalı';
    if (form.minimumStok < 0) e.minimumStok = '0 veya daha büyük olmalı';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    const payload = {
      ...form,
      birimFiyat: form.birimFiyat === '' ? null : Number(form.birimFiyat),
      stokMiktari: Number(form.stokMiktari),
      minimumStok: Number(form.minimumStok),
      kategoriId: form.kategoriId === '' ? null : Number(form.kategoriId),
    };
    onSave(payload);
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <form onSubmit={handleSubmit}>
      <div className={shared.formGrid}>
        <FormField label="Ürün Adı *" error={errors.ad}>
          <input className={shared.input} value={form.ad} onChange={set('ad')} placeholder="Örn: Isparta El Dokuma" />
        </FormField>
        <FormField label="Stok Kodu">
          <input className={shared.input} value={form.stokKodu} onChange={set('stokKodu')} placeholder="Örn: HAL-001" />
        </FormField>
        <FormField label="Renk">
          <input className={shared.input} value={form.renk} onChange={set('renk')} placeholder="Örn: Kırmızı-Lacivert" />
        </FormField>
        <FormField label="Materyal">
          <input className={shared.input} value={form.materyal} onChange={set('materyal')} placeholder="Örn: %100 Yün" />
        </FormField>
        <FormField label="Boyut">
          <input className={shared.input} value={form.boyut} onChange={set('boyut')} placeholder="Örn: 200x300 cm" />
        </FormField>
        <FormField label="Birim Fiyat (₺)">
          <input className={shared.input} type="number" step="0.01" min="0" value={form.birimFiyat} onChange={set('birimFiyat')} placeholder="0.00" />
        </FormField>
        <FormField label="Stok Miktarı" error={errors.stokMiktari}>
          <input className={shared.input} type="number" min="0" value={form.stokMiktari} onChange={set('stokMiktari')} />
        </FormField>
        <FormField label="Minimum Stok" error={errors.minimumStok}>
          <input className={shared.input} type="number" min="0" value={form.minimumStok} onChange={set('minimumStok')} />
        </FormField>
      </div>
      <FormField label="Kategori">
        <select className={shared.select} value={form.kategoriId} onChange={set('kategoriId')}>
          <option value="">— Seçiniz —</option>
          {kategoriler.map(k => <option key={k.id} value={k.id}>{k.ad}</option>)}
        </select>
      </FormField>
      <FormField label="Açıklama">
        <textarea className={shared.textarea} rows={2} value={form.aciklama} onChange={set('aciklama')} placeholder="İsteğe bağlı" />
      </FormField>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button type="button" className={`${shared.btn} ${shared.btnSecondary}`} onClick={onCancel}>İptal</button>
        <button type="submit" className={`${shared.btn} ${shared.btnPrimary}`} disabled={loading}>
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
}

export default function Urunler() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [aramaMetni, setAramaMetni] = useState('');

  const { data: urunler = [], isLoading } = useQuery({ queryKey: ['urunler'], queryFn: urunAPI.getAll });
  const { data: kategoriler = [] } = useQuery({ queryKey: ['kategoriler'], queryFn: kategoriAPI.getAll });

  const ekle = useMutation({
    mutationFn: urunAPI.create,
    onSuccess: () => { qc.invalidateQueries(['urunler']); qc.invalidateQueries(['dusukStok']); toast.success('Ürün eklendi'); setModal(null); },
    onError: (err) => toast.error(err.message),
  });

  const guncelle = useMutation({
    mutationFn: ({ id, data }) => urunAPI.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['urunler']); qc.invalidateQueries(['dusukStok']); toast.success('Ürün güncellendi'); setModal(null); },
    onError: (err) => toast.error(err.message),
  });

  const sil = useMutation({
    mutationFn: urunAPI.delete,
    onSuccess: () => { qc.invalidateQueries(['urunler']); qc.invalidateQueries(['dusukStok']); toast.success('Ürün silindi'); },
    onError: (err) => toast.error(err.message),
  });

  const handleSave = (form) => {
    if (modal?.mode === 'ekle') ekle.mutate(form);
    else guncelle.mutate({ id: modal.data.id, data: form });
  };

  const handleSil = (u) => {
    if (window.confirm(`"${u.ad}" ürününü silmek istediğinize emin misiniz?`)) sil.mutate(u.id);
  };

  const filtered = urunler.filter(u =>
    u.ad.toLowerCase().includes(aramaMetni.toLowerCase()) ||
    (u.stokKodu || '').toLowerCase().includes(aramaMetni.toLowerCase())
  );

  return (
    <div>
      <div className={shared.pageHeader}>
        <h1 className={shared.pageTitle}>Ürünler</h1>
        <button className={`${shared.btn} ${shared.btnPrimary}`} onClick={() => setModal({ mode: 'ekle' })}>
          + Ürün Ekle
        </button>
      </div>

      <div className={shared.searchBar}>
        <input
          className={shared.input}
          style={{ maxWidth: 320 }}
          placeholder="Ürün adı veya stok kodu ile ara..."
          value={aramaMetni}
          onChange={e => setAramaMetni(e.target.value)}
        />
      </div>

      <div className={shared.card}>
        {isLoading ? (
          <div className={shared.emptyState}>Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div className={shared.emptyState}>Ürün bulunamadı.</div>
        ) : (
          <table className={shared.table}>
            <thead>
              <tr>
                <th>Stok Kodu</th>
                <th>Ürün Adı</th>
                <th>Kategori</th>
                <th>Renk / Boyut</th>
                <th>Fiyat</th>
                <th>Stok</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const dusuk = u.stokMiktari <= u.minimumStok;
                return (
                  <tr key={u.id}>
                    <td><span className={`${shared.badge} ${shared.badgeGray}`}>{u.stokKodu || '-'}</span></td>
                    <td><strong>{u.ad}</strong></td>
                    <td>{u.kategoriAd || <span style={{ color: '#9ca3af' }}>-</span>}</td>
                    <td>{[u.renk, u.boyut].filter(Boolean).join(' / ') || '-'}</td>
                    <td>{u.birimFiyat != null ? `₺${Number(u.birimFiyat).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` : '-'}</td>
                    <td>
                      <span className={`${shared.badge} ${dusuk ? shared.badgeRed : shared.badgeGreen}`}>
                        {u.stokMiktari}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className={`${shared.btn} ${shared.btnSecondary}`} onClick={() => setModal({ mode: 'duzenle', data: u })}>Düzenle</button>
                        <button className={`${shared.btn} ${shared.btnDanger}`} onClick={() => handleSil(u)}>Sil</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal
          title={modal.mode === 'ekle' ? 'Ürün Ekle' : 'Ürün Düzenle'}
          onClose={() => setModal(null)}
        >
          <UrunForm
            initial={modal.data}
            kategoriler={kategoriler}
            onSave={handleSave}
            onCancel={() => setModal(null)}
            loading={ekle.isPending || guncelle.isPending}
          />
        </Modal>
      )}
    </div>
  );
}
