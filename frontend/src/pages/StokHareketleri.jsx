import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { stokHareketiAPI, urunAPI } from '../services/api';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import shared from '../components/shared.module.css';

function HareketiForm({ urunler, onSave, onCancel, loading }) {
  const [form, setForm] = useState({ urunId: '', tip: 'GIRIS', miktar: 1, aciklama: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.urunId) e.urunId = 'Ürün seçiniz';
    if (!form.miktar || form.miktar < 1) e.miktar = 'Miktar en az 1 olmalı';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    onSave({ ...form, urunId: Number(form.urunId), miktar: Number(form.miktar) });
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Ürün *" error={errors.urunId}>
        <select className={shared.select} value={form.urunId} onChange={set('urunId')}>
          <option value="">— Ürün Seçiniz —</option>
          {urunler.map(u => (
            <option key={u.id} value={u.id}>
              {u.ad} {u.stokKodu ? `(${u.stokKodu})` : ''} — Stok: {u.stokMiktari}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Hareket Tipi *">
        <select className={shared.select} value={form.tip} onChange={set('tip')}>
          <option value="GIRIS">▲ Stok Girişi</option>
          <option value="CIKIS">▼ Stok Çıkışı</option>
        </select>
      </FormField>
      <FormField label="Miktar *" error={errors.miktar}>
        <input className={shared.input} type="number" min="1" value={form.miktar} onChange={set('miktar')} />
      </FormField>
      <FormField label="Açıklama">
        <textarea className={shared.textarea} rows={2} value={form.aciklama} onChange={set('aciklama')} placeholder="İsteğe bağlı not" />
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

export default function StokHareketleri() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [filtre, setFiltre] = useState('');

  const { data: hareketler = [], isLoading } = useQuery({
    queryKey: ['hareketler'],
    queryFn: stokHareketiAPI.getAll,
  });
  const { data: urunler = [] } = useQuery({ queryKey: ['urunler'], queryFn: urunAPI.getAll });

  const ekle = useMutation({
    mutationFn: stokHareketiAPI.create,
    onSuccess: () => {
      qc.invalidateQueries(['hareketler']);
      qc.invalidateQueries(['urunler']);
      qc.invalidateQueries(['dusukStok']);
      toast.success('Stok hareketi kaydedildi');
      setModal(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const filtered = hareketler.filter(h =>
    h.urunAd.toLowerCase().includes(filtre.toLowerCase()) ||
    (h.stokKodu || '').toLowerCase().includes(filtre.toLowerCase())
  );

  return (
    <div>
      <div className={shared.pageHeader}>
        <h1 className={shared.pageTitle}>Stok Hareketleri</h1>
        <button className={`${shared.btn} ${shared.btnPrimary}`} onClick={() => setModal(true)}>
          + Hareket Ekle
        </button>
      </div>

      <div className={shared.searchBar}>
        <input
          className={shared.input}
          style={{ maxWidth: 320 }}
          placeholder="Ürün adı veya stok kodu ile filtrele..."
          value={filtre}
          onChange={e => setFiltre(e.target.value)}
        />
      </div>

      <div className={shared.card}>
        {isLoading ? (
          <div className={shared.emptyState}>Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div className={shared.emptyState}>Henüz hareket kaydı yok.</div>
        ) : (
          <table className={shared.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Ürün</th>
                <th>Stok Kodu</th>
                <th>Tip</th>
                <th>Miktar</th>
                <th>Açıklama</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(h => (
                <tr key={h.id}>
                  <td>{h.id}</td>
                  <td><strong>{h.urunAd}</strong></td>
                  <td><span className={`${shared.badge} ${shared.badgeGray}`}>{h.stokKodu || '-'}</span></td>
                  <td>
                    <span className={`${shared.badge} ${h.tip === 'GIRIS' ? shared.badgeGreen : shared.badgeRed}`}>
                      {h.tip === 'GIRIS' ? '▲ Giriş' : '▼ Çıkış'}
                    </span>
                  </td>
                  <td>{h.miktar}</td>
                  <td>{h.aciklama || <span style={{ color: '#9ca3af' }}>-</span>}</td>
                  <td>{new Date(h.tarih).toLocaleString('tr-TR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title="Stok Hareketi Ekle" onClose={() => setModal(false)}>
          <HareketiForm
            urunler={urunler}
            onSave={(data) => ekle.mutate(data)}
            onCancel={() => setModal(false)}
            loading={ekle.isPending}
          />
        </Modal>
      )}
    </div>
  );
}
