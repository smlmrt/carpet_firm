import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { kategoriAPI } from '../services/api';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import shared from '../components/shared.module.css';

function KategoriForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState({ ad: initial?.ad || '', aciklama: initial?.aciklama || '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.ad.trim()) e.ad = 'Kategori adı zorunludur';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Kategori Adı *" error={errors.ad}>
        <input
          className={shared.input}
          value={form.ad}
          onChange={e => setForm(f => ({ ...f, ad: e.target.value }))}
          placeholder="Örn: El Dokuma Halı"
        />
      </FormField>
      <FormField label="Açıklama">
        <textarea
          className={shared.textarea}
          rows={3}
          value={form.aciklama}
          onChange={e => setForm(f => ({ ...f, aciklama: e.target.value }))}
          placeholder="İsteğe bağlı açıklama"
        />
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

export default function Kategoriler() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null); // null | { mode: 'ekle'|'duzenle', data? }

  const { data: kategoriler = [], isLoading } = useQuery({
    queryKey: ['kategoriler'],
    queryFn: kategoriAPI.getAll,
  });

  const ekle = useMutation({
    mutationFn: kategoriAPI.create,
    onSuccess: () => { qc.invalidateQueries(['kategoriler']); toast.success('Kategori eklendi'); setModal(null); },
    onError: (err) => toast.error(err.message),
  });

  const guncelle = useMutation({
    mutationFn: ({ id, data }) => kategoriAPI.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['kategoriler']); toast.success('Kategori güncellendi'); setModal(null); },
    onError: (err) => toast.error(err.message),
  });

  const sil = useMutation({
    mutationFn: kategoriAPI.delete,
    onSuccess: () => { qc.invalidateQueries(['kategoriler']); toast.success('Kategori silindi'); },
    onError: (err) => toast.error(err.message),
  });

  const handleSave = (form) => {
    if (modal?.mode === 'ekle') ekle.mutate(form);
    else guncelle.mutate({ id: modal.data.id, data: form });
  };

  const handleSil = (k) => {
    if (window.confirm(`"${k.ad}" kategorisini silmek istediğinize emin misiniz?`)) {
      sil.mutate(k.id);
    }
  };

  return (
    <div>
      <div className={shared.pageHeader}>
        <h1 className={shared.pageTitle}>Kategoriler</h1>
        <button className={`${shared.btn} ${shared.btnPrimary}`} onClick={() => setModal({ mode: 'ekle' })}>
          + Kategori Ekle
        </button>
      </div>

      <div className={shared.card}>
        {isLoading ? (
          <div className={shared.emptyState}>Yükleniyor...</div>
        ) : kategoriler.length === 0 ? (
          <div className={shared.emptyState}>Henüz kategori eklenmemiş.</div>
        ) : (
          <table className={shared.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Kategori Adı</th>
                <th>Açıklama</th>
                <th>Ürün Sayısı</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {kategoriler.map(k => (
                <tr key={k.id}>
                  <td>{k.id}</td>
                  <td><strong>{k.ad}</strong></td>
                  <td>{k.aciklama || <span style={{ color: '#9ca3af' }}>-</span>}</td>
                  <td><span className={`${shared.badge} ${shared.badgeBlue}`}>{k.urunSayisi}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className={`${shared.btn} ${shared.btnSecondary}`}
                        onClick={() => setModal({ mode: 'duzenle', data: k })}
                      >Düzenle</button>
                      <button
                        className={`${shared.btn} ${shared.btnDanger}`}
                        onClick={() => handleSil(k)}
                        disabled={k.urunSayisi > 0}
                        title={k.urunSayisi > 0 ? 'Ürünleri olan kategori silinemez' : ''}
                      >Sil</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal
          title={modal.mode === 'ekle' ? 'Kategori Ekle' : 'Kategori Düzenle'}
          onClose={() => setModal(null)}
        >
          <KategoriForm
            initial={modal.data}
            onSave={handleSave}
            onCancel={() => setModal(null)}
            loading={ekle.isPending || guncelle.isPending}
          />
        </Modal>
      )}
    </div>
  );
}
