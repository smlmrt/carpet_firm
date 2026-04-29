import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('kullaniciAdi');
      window.location.href = '/login';
    }
    const msg = err.response?.data?.mesaj || err.response?.data?.message || 'Bir hata oluştu';
    return Promise.reject(new Error(msg));
  }
);

// Kategoriler
export const kategoriAPI = {
  getAll: () => api.get('/kategoriler').then(r => r.data),
  getById: (id) => api.get(`/kategoriler/${id}`).then(r => r.data),
  create: (data) => api.post('/kategoriler', data).then(r => r.data),
  update: (id, data) => api.put(`/kategoriler/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/kategoriler/${id}`),
};

// Ürünler
export const urunAPI = {
  getAll: () => api.get('/urunler').then(r => r.data),
  getById: (id) => api.get(`/urunler/${id}`).then(r => r.data),
  getByKategori: (id) => api.get(`/urunler/kategori/${id}`).then(r => r.data),
  getDusukStok: () => api.get('/urunler/dusuk-stok').then(r => r.data),
  ara: (q) => api.get(`/urunler/ara?q=${encodeURIComponent(q)}`).then(r => r.data),
  create: (data) => api.post('/urunler', data).then(r => r.data),
  update: (id, data) => api.put(`/urunler/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/urunler/${id}`),
};

// Stok Hareketleri
export const stokHareketiAPI = {
  getAll: () => api.get('/stok-hareketleri').then(r => r.data),
  getByUrun: (id) => api.get(`/stok-hareketleri/urun/${id}`).then(r => r.data),
  create: (data) => api.post('/stok-hareketleri', data).then(r => r.data),
};

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data).then(r => r.data),
};
