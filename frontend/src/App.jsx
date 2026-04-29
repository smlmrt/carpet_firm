import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Urunler from './pages/Urunler';
import Kategoriler from './pages/Kategoriler';
import StokHareketleri from './pages/StokHareketleri';
import styles from './App.module.css';

function Layout() {
  const { auth, logout } = useAuth();

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🏠</span>
          <span>Halı Stok</span>
        </div>
        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
            Özet
          </NavLink>
          <NavLink to="/urunler" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
            Ürünler
          </NavLink>
          <NavLink to="/kategoriler" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
            Kategoriler
          </NavLink>
          <NavLink to="/hareketler" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
            Stok Hareketleri
          </NavLink>
        </nav>
        <div className={styles.userArea}>
          <span className={styles.userName}>{auth?.kullaniciAdi}</span>
          <button className={styles.logoutBtn} onClick={logout}>Çıkış</button>
        </div>
      </aside>
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/urunler" element={<Urunler />} />
          <Route path="/kategoriler" element={<Kategoriler />} />
          <Route path="/hareketler" element={<StokHareketleri />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/*"
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}
