import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import styles from './Login.module.css';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ kullaniciAdi: '', sifre: '' });
  const [hata, setHata] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata('');
    setYukleniyor(true);
    try {
      const res = await authAPI.login(form);
      login(res.token, res.kullaniciAdi);
    } catch (err) {
      setHata(err.message || 'Giriş başarısız');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>🏠</div>
        <h1 className={styles.title}>Halı Stok Yönetimi</h1>
        <p className={styles.subtitle}>Devam etmek için giriş yapın</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Kullanıcı Adı</label>
            <input
              className={styles.input}
              type="text"
              value={form.kullaniciAdi}
              onChange={e => setForm(f => ({ ...f, kullaniciAdi: e.target.value }))}
              placeholder="admin"
              autoComplete="username"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Şifre</label>
            <input
              className={styles.input}
              type="password"
              value={form.sifre}
              onChange={e => setForm(f => ({ ...f, sifre: e.target.value }))}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {hata && <div className={styles.hata}>{hata}</div>}

          <button
            type="submit"
            className={styles.btn}
            disabled={yukleniyor}
          >
            {yukleniyor ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}
