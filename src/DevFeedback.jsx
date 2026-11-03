import React, { useEffect, useState } from 'react';
import { ArrowLeft, LockKeyhole, LogOut, MessageCircle, RefreshCw, ShieldCheck, Star } from 'lucide-react';
import { getAdminFeedback } from './feedback-service.js';
import './dev-feedback.css';

function encodeBasicCredentials(username, password) {
  const bytes = new TextEncoder().encode(`${username}:${password}`);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Tanggal tidak tersedia';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export default function DevFeedback() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [credentials, setCredentials] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadFeedback = async (token) => {
    setIsLoading(true);
    setError('');
    try {
      const result = await getAdminFeedback(token);
      setFeedback(result.feedback || []);
      setTotal(result.total || 0);
    } catch (loadError) {
      setError(loadError.message || 'Tidak dapat memuat feedback.');
      setCredentials('');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Feedback pengunjung · Pradnyasiwi Quadtech';
    const robots = document.querySelector('meta[name="robots"]') || document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow, noarchive';
    document.head.appendChild(robots);
  }, []);

  useEffect(() => {
    if (credentials) document.body.classList.add('dev-dashboard-active');
    else document.body.classList.remove('dev-dashboard-active');
    return () => document.body.classList.remove('dev-dashboard-active');
  }, [credentials]);

  useEffect(() => {
    if (credentials) loadFeedback(credentials);
  }, [credentials]);

  const signIn = (event) => {
    event.preventDefault();
    setError('');
    setCredentials(encodeBasicCredentials(username.trim(), password));
  };

  const signOut = () => {
    setCredentials('');
    setPassword('');
    setFeedback([]);
    setTotal(0);
  };

  if (!credentials) {
    return (
      <main className="dev-feedback-page">
        <section className="dev-login-card">
          <a className="dev-back-link" href="/"><ArrowLeft size={15} /> Kembali ke pameran</a>
          <div className="dev-lock"><LockKeyhole size={22} /></div>
          <p className="dev-eyebrow">PRADNYASIWI QUADTECH · INTERNAL</p>
          <h1>Ruang pengelola</h1>
          <p className="dev-login-copy">Masuk untuk melihat masukan pengunjung. Halaman ini tidak mengizinkan pengubahan atau penghapusan data.</p>
          <form onSubmit={signIn} className="dev-login-form">
            <label>Nama pengguna<input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} /></label>
            <label>Kata sandi<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            <button type="submit" disabled={isLoading}>{isLoading ? 'Memeriksa akses…' : 'Masuk dan lihat masukan'}</button>
          </form>
          {error && <p className="dev-error" role="alert">{error}</p>}
          <p className="dev-private-note"><ShieldCheck size={14} /> Akses memerlukan kredensial server. Kata sandi admin tidak disimpan di kode halaman.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="dev-feedback-page dev-dashboard">
      <header className="dev-dashboard-header">
        <a className="dev-back-link" href="/"><ArrowLeft size={15} /> Situs pameran</a>
        <button className="dev-logout" type="button" onClick={signOut}><LogOut size={15} /> Keluar</button>
      </header>
      <section className="dev-dashboard-content">
        <p className="dev-eyebrow">PRADNYASIWI QUADTECH · INTERNAL</p>
        <div className="dev-title-row"><div><h1>Masukan pengunjung</h1><p>Hanya baca · Masukan tidak ditampilkan di halaman publik.</p></div><button className="dev-refresh" type="button" onClick={() => loadFeedback(credentials)} disabled={isLoading}><RefreshCw size={15} className={isLoading ? 'is-spinning' : ''} /> Muat ulang</button></div>
        <div className="dev-stats"><span><MessageCircle size={18} /><b>{total}</b><small>total masukan</small></span><span><Star size={18} /><b>{feedback.length ? (feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length).toFixed(1) : 'Belum ada'}</b><small>rata-rata dari daftar</small></span></div>
        {error && <p className="dev-error" role="alert">{error}</p>}
        <div className="dev-feedback-list" aria-live="polite">
          {isLoading && feedback.length === 0 ? <p className="dev-empty">Memuat masukan…</p> : null}
          {!isLoading && feedback.length === 0 ? <p className="dev-empty">Belum ada masukan pengunjung.</p> : null}
          {feedback.map((item) => (
            <article className="dev-feedback-card" key={item.id}>
              <div className="dev-feedback-meta"><div><b>{item.name || 'Pengunjung'}</b><span>{item.category}</span></div><time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time></div>
              <div className="dev-rating" aria-label={`Nilai ${item.rating} dari 5`}>{[1, 2, 3, 4, 5].map((number) => <Star key={number} size={14} fill={number <= item.rating ? 'currentColor' : 'none'} />)}</div>
              <p>{item.message}</p>
            </article>
          ))}
        </div>
        <p className="dev-readonly-note"><ShieldCheck size={14} /> Panel hanya untuk melihat masukan. Data tersimpan di SQLite pada server.</p>
      </section>
    </main>
  );
}
