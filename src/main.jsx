import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDown,
  ArrowUpRight,
  CircleHelp,
  ExternalLink,
  FileText,
  Leaf,
  MessageCircle,
  Menu,
  RotateCcw,
  Send,
  Sparkles,
  Star,
  Sun,
  X,
} from 'lucide-react';
import './styles.css';
import './intro-motion.css';
import './content-layout.css';
import './feedback.css';
import './source-references.css';
import { getFeedback, submitFeedback } from './feedback-service.js';

const asset = (filename) => `${import.meta.env.BASE_URL}assets/${filename}`;

const photos = [
  {
    src: asset('sawah-pagi.svg'),
    alt: 'Ilustrasi sawah di bawah cahaya pagi, terinspirasi dari pertanian Sleman',
    title: 'Pagi di lahan',
    note: 'Inspirasi dari pertanian Sleman',
    kind: 'illustration',
  },
  {
    src: asset('lahan-padi.svg'),
    alt: 'Ilustrasi tanaman padi menjelang masa panen',
    title: 'Menjelang panen',
    note: 'Dari alam sekitar kita',
    kind: 'illustration',
  },
  {
    src: asset('ruang-ide.svg'),
    alt: 'Ilustrasi meja kerja dan sketsa rancangan alat',
    title: 'Ruang untuk ide',
    note: 'Setiap inovasi dimulai dari bertanya',
    kind: 'illustration',
  },
];

function BrandMark({ large = false }) {
  return (
    <span className={`brand-mark${large ? ' brand-mark-large' : ''}`} aria-hidden="true">
      <span className="brand-mark-center"><Leaf size={large ? 34 : 18} strokeWidth={1.6} /></span>
    </span>
  );
}

function useReveal() {
  const nodeRef = useRef(null);
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add('is-in');
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return nodeRef;
}

function Reveal({ children, className = '', delay = 0, as: Tag = 'div', ...props }) {
  const ref = useReveal();
  return <Tag ref={ref} className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` }} {...props}>{children}</Tag>;
}

function LoadingScreen({ onComplete }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(onComplete, reducedMotion ? 120 : 650);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return <div className="blank-loading" aria-hidden="true" />;
}

function Intro({ onEnter, transitioning }) {
  const leaveStarted = useRef(false);
  const enter = () => {
    if (leaveStarted.current) return;
    leaveStarted.current = true;
    onEnter();
  };
  useEffect(() => {
    const timer = window.setTimeout(enter, 5300);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`intro brand-intro${transitioning ? ' intro--transitioning' : ''}`} aria-label="Animasi pembuka Pradnyasiwi Quadtech" aria-hidden={transitioning}>
      <div className="intro-scenery" aria-hidden="true"><span className="intro-sun" /><span className="intro-sun-glow" /><span className="intro-hill hill-back" /><span className="intro-hill hill-front" /><span className="intro-cloud cloud-one" /><span className="intro-cloud cloud-two" /><span className="intro-grass grass-one" /><span className="intro-grass grass-two" /></div>
      <div className="intro-content">
        <div className="intro-logo-stage">
          <span className="logo-orbit orbit-outer" aria-hidden="true"><i /></span>
          <span className="logo-orbit orbit-inner" aria-hidden="true"><i /></span>
          <span className="orbit-spark orbit-spark-one" aria-hidden="true"><Sparkles size={13} /></span>
          <span className="orbit-spark orbit-spark-two" aria-hidden="true"><Sun size={12} /></span>
          <div className="school-emblem" aria-label="Logo ilustrasi Pradnyasiwi Quadtech"><BrandMark large /><span className="emblem-highlight" /></div>
        </div>
        <p className="intro-kicker">SMP NEGERI 4 PAKEM MEMPERSEMBAHKAN</p>
        <h1>Pradnyasiwi <span>Quadtech</span></h1>
        <p className="intro-caption">Inovasi kecil, semangat besar untuk pertanian Sleman.</p>
        <button className="intro-enter" type="button" onClick={enter}>Masuk ke pameran <ArrowUpRight size={17} /></button>
      </div>
      <p className="intro-footnote">Sebuah cerita dari Pakem, Yogyakarta <span>·</span> <b>STEM 2026</b></p>
      <span className="transition-flare" aria-hidden="true" />
    </div>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`topbar${scrolled ? ' topbar-scrolled' : ''}`}>
      <a className="wordmark" href="#sumber" aria-label="Pradnyasiwi Quadtech, sumber proyek" onClick={closeMenu}>
        <BrandMark /><span>pradnyasiwi <b>quadtech</b></span>
      </a>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Tutup navigasi' : 'Buka navigasi'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Navigasi utama">
        <a href="#sumber" onClick={closeMenu}>Sumber</a>
        <a href="#penjelasan" onClick={closeMenu}>Proyek</a>
        <a href="#model" onClick={closeMenu}>Model 3D</a>
        <a href="#dokumentasi" onClick={closeMenu}>Dokumentasi</a>
        <a href="#tim" onClick={closeMenu}>Tim</a>
        <a className="nav-cta" href="#feedback" onClick={closeMenu}>Feedback <ArrowUpRight size={14} /></a>
      </nav>
    </header>
  );
}

function ProjectSummary() {
  return (
    <section className="project-summary section-wrap" id="penjelasan">
      <Reveal className="project-summary-copy">
        <p className="eyebrow">GAMBARAN SINGKAT · PAKEM, SLEMAN</p>
        <h1>Penjemuran padi,<br /><span>dibantu teknologi.</span></h1>
        <p>Pradnyasiwi Quadtech dari SMPN 4 Pakem mengembangkan gagasan alat penjemur padi otomatis untuk mendukung efisiensi proses dan keselamatan pekerja. Detail rancangan dan klaim kinerja akan dilengkapi mengikuti data proyek.</p>
        <a className="button button-primary" href="#model">Lihat model alat <ArrowDown size={15} /></a>
      </Reveal>
      <div className="project-summary-aside" aria-label="Informasi tim">
        <span className="summary-mark"><Leaf size={21} /></span>
        <span><b>Pradnyasiwi Quadtech</b><small>SMPN 4 Pakem · Sleman, Yogyakarta</small></span>
      </div>
    </section>
  );
}

function Model3DSection() {
  const [rotation, setRotation] = useState(-28);
  const [tilt, setTilt] = useState(8);
  const dragStart = useRef(null);
  const startDrag = (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    dragStart.current = { x: event.clientX, y: event.clientY, rotation, tilt };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const dragModel = (event) => {
    if (!dragStart.current) return;
    setRotation(dragStart.current.rotation + (event.clientX - dragStart.current.x) * .65);
    setTilt(Math.max(-12, Math.min(20, dragStart.current.tilt - (event.clientY - dragStart.current.y) * .28)));
  };
  const endDrag = () => { dragStart.current = null; };
  const resetModel = () => { setRotation(-28); setTilt(8); };

  return (
    <section className="model-section" id="model">
      <div className="section-wrap model-layout">
        <Reveal className="model-copy">
          <p className="eyebrow">MODEL INTERAKTIF · KONSEP</p>
          <h2>Lihat dari<br /><span>sudut pandangmu.</span></h2>
          <p>Seret model untuk memutar dan melihat ilustrasi konsep alat. Ini visualisasi awal, bukan gambar teknik atau model final.</p>
          <div className="model-controls">
            <button type="button" onClick={() => setRotation((value) => value - 35)} aria-label="Putar model ke kiri">Putar kiri</button>
            <button type="button" onClick={() => setRotation((value) => value + 35)} aria-label="Putar model ke kanan">Putar kanan</button>
            <button type="button" className="model-reset" onClick={resetModel} aria-label="Kembalikan sudut model"><RotateCcw size={14} /> Reset</button>
          </div>
          <p className="model-disclaimer"><CircleHelp size={14} /> Bentuk, ukuran, dan komponen masih perlu disesuaikan dengan prototipe sebenarnya.</p>
        </Reveal>
        <Reveal className="model-viewer" delay={110}>
          <div className="model-viewer-top"><span><i /> PRADNYASIWI / STUDI KONSEP</span><span>3D · 01</span></div>
          <div className="model-stage" onPointerDown={startDrag} onPointerMove={dragModel} onPointerUp={endDrag} onPointerCancel={endDrag} onPointerLeave={endDrag} role="img" aria-label="Model 3D konseptual penjemur padi otomatis, dapat diputar dengan menyeret">
            <div className="model-sun-disc"><Sun size={36} strokeWidth={1.1} /></div>
            <div className="model-cloud cloud-a" /><div className="model-cloud cloud-b" />
            <div className="model-platform" />
            <div className="model-object" style={{ '--model-yaw': `${rotation}deg`, '--model-tilt': `${tilt}deg` }}>
              <div className="model-roof"><span /><span /><span /><span /></div>
              <div className="model-chamber"><div className="model-window"><i /><i /><i /><i /></div><div className="model-side-vent"><i /><i /><i /></div><div className="model-control-panel"><i /><i /><i /></div></div>
              <div className="model-stand stand-one" /><div className="model-stand stand-two" /><div className="model-stand stand-three" /><div className="model-stand stand-four" />
              <div className="model-wheel wheel-a" /><div className="model-wheel wheel-b" /><div className="model-wheel wheel-c" /><div className="model-wheel wheel-d" />
            </div>
            <span className="model-axis axis-x">X</span><span className="model-axis axis-y">Y</span><span className="model-axis axis-z">Z</span>
            <div className="model-drag-hint"><span>↔</span> SERET UNTUK MEMUTAR</div>
          </div>
          <div className="model-viewer-foot"><span>Penjemur padi otomatis</span><span>VISUALISASI KONSEP</span></div>
        </Reveal>
      </div>
    </section>
  );
}

function GallerySection() {
  const [activePhoto, setActivePhoto] = useState(null);
  useEffect(() => {
    if (!activePhoto) return undefined;
    const closeOnEscape = (event) => { if (event.key === 'Escape') setActivePhoto(null); };
    document.addEventListener('keydown', closeOnEscape);
    document.body.classList.add('lightbox-open');
    return () => { document.removeEventListener('keydown', closeOnEscape); document.body.classList.remove('lightbox-open'); };
  }, [activePhoto]);

  return (
    <>
      <section className="gallery-section section-wrap" id="dokumentasi">
        <Reveal className="gallery-heading"><div><p className="eyebrow">DOKUMENTASI PROYEK</p><h2>Catatan proses<br /><span>dan visual alat.</span></h2></div><p>Foto prototipe dan kegiatan tim akan menggantikan ilustrasi sementara ini.</p></Reveal>
        <div className="gallery-grid">{photos.map((photo, index) => <Reveal as="button" className={`gallery-item${index === 0 ? ' gallery-large' : ''}`} delay={index * 75} key={photo.title} type="button" onClick={() => setActivePhoto(photo)} aria-label={`Perbesar: ${photo.title}`}><img src={photo.src} alt={photo.alt} loading="lazy" /><span className="gallery-caption"><b>{photo.title}</b><small>{photo.note}</small></span><span className="expand-icon"><ArrowUpRight size={15} /></span>{photo.kind === 'illustration' && <span className="illustration-badge">ILUSTRASI</span>}</Reveal>)}</div>
        <div className="gallery-note"><span className="gallery-note-icon"><CircleHelp size={17} /></span><span><b>Catatan kecil:</b> gambar di galeri ini adalah ilustrasi. Dokumentasi alat dan proses asli akan ditambahkan setelah tersedia.</span></div>
      </section>
      {activePhoto && <div className="lightbox" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActivePhoto(null); }}><div className="lightbox-card" role="dialog" aria-modal="true" aria-label={activePhoto.title}><button className="lightbox-close" type="button" aria-label="Tutup foto" onClick={() => setActivePhoto(null)}><X size={18} /></button><img src={activePhoto.src} alt={activePhoto.alt} /><p>{activePhoto.title}<span> · {activePhoto.note}</span></p></div></div>}
    </>
  );
}

function SourcesSection() {
  return (
    <section className="sources-section source-first section-wrap" id="sumber">
      <Reveal className="sources-heading">
        <p className="eyebrow">RUJUKAN PROYEK · BACAAN PILIHAN</p>
        <h1>Mulai dari <span>sumbernya.</span></h1>
        <p>Dua bacaan ini membantu memberi konteks pada keselamatan kerja dan paparan panas. Keduanya bukan uji langsung terhadap prototipe penjemur padi kami.</p>
      </Reveal>
      <div className="source-grid">
        <Reveal as="article" className="source-card" delay={60}>
          <div className="source-card-top"><span className="source-card-icon"><FileText size={18} /></span><span className="source-kind">ARTIKEL PENELITIAN · 2022</span></div>
          <h2>Risiko postur kerja dan metode REBA</h2>
          <p className="source-byline">Indah Permatasari, Mayumi Nitami, Erna Veronika, & Decy Situngkir · 2022</p>
          <p>Penelitian deskriptif pada 29 petani rumput laut di Pantai Mekar. Pada tahap penjemuran, 66,7% pekerja berada pada risiko postur tinggi dan 13,3% sangat tinggi; tahap penanaman seluruhnya berisiko sedang. Konteksnya rumput laut, bukan padi—angka ini bukan hasil uji alat kami.</p>
          <div className="source-takeaway"><b>Hubungannya dengan proyek</b><span>Menjadi bacaan pembanding untuk memperhatikan ergonomi saat merancang alat bantu pertanian.</span></div>
          <div className="source-links"><a href="https://jca.esaunggul.ac.id/index.php/jhea/article/view/136" target="_blank" rel="noreferrer">Buka laman jurnal <ExternalLink size={13} /></a><a href={`${import.meta.env.BASE_URL}files/Postur%20tubuh.pdf`} target="_blank" rel="noreferrer">Buka PDF <FileText size={13} /></a></div>
        </Reveal>
        <Reveal as="article" className="source-card" delay={130}>
          <div className="source-card-top"><span className="source-card-icon source-health-icon"><Leaf size={18} /></span><span className="source-kind">INFORMASI KESEHATAN · 2026</span></div>
          <h2>Mengenali risiko heat stroke</h2>
          <p className="source-byline">Tim Medis Siloam Hospitals · 22 Januari 2026</p>
          <p>Artikel menjelaskan heat stroke sebagai kondisi darurat akibat paparan panas, termasuk ketika aktivitas fisik berat dilakukan dalam cuaca panas. Pengenalan gejala dan pertolongan medis cepat penting; ringkasan ini bukan panduan diagnosis.</p>
          <div className="source-takeaway"><b>Hubungannya dengan proyek</b><span>Memberi konteks keselamatan saat bekerja di lingkungan panas. Alat ini belum terbukti mencegah heat stroke.</span></div>
          <div className="source-links"><a href="https://www.siloamhospitals.com/informasi-siloam/artikel/heat-stroke-adalah" target="_blank" rel="noreferrer">Baca artikel Siloam <ExternalLink size={13} /></a></div>
        </Reveal>
      </div>
      <Reveal className="sources-note" delay={180}><CircleHelp size={15} /><span>Ringkasan ini disusun untuk menjelaskan relevansi bacaan terhadap tema proyek. Silakan buka sumber aslinya untuk konteks dan informasi lengkap.</span></Reveal>
    </section>
  );
}

function TeamSection() {
  return (
    <section className="team-section" id="tim">
      <div className="section-wrap team-layout">
        <Reveal className="team-copy"><p className="eyebrow">DI BALIK GAGASAN</p><h2>Kenalkan,<br /><span>tim kami.</span></h2><p>Sebuah proyek STEM dari siswa SMPN 4 Pakem. Nama dan peran anggota dapat ditambahkan setelah daftar tim final tersedia.</p></Reveal>
        <Reveal className="team-card" delay={90}>
          <div className="team-emblem"><Leaf size={27} /></div>
          <div><p className="team-label">NAMA KELOMPOK</p><h3>Pradnyasiwi<br />Quadtech</h3></div>
          <div className="team-divider" />
          <div className="team-school"><span>SMPN 4 PAKEM</span><small>Pakem · Sleman · Yogyakarta</small></div>
          <p className="team-roster-note">Anggota & pembagian tugas: <b>menyusul dari tim.</b></p>
        </Reveal>
      </div>
    </section>
  );
}

function FeedbackSection() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Saran');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getFeedback()
      .then((items) => { if (active) setFeedbacks(Array.isArray(items) ? items : []); })
      .catch(() => { if (active) setError('Masukan belum dapat dimuat. Silakan coba lagi nanti.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice('');
    setError('');
    try {
      const saved = await submitFeedback({
        name: name.trim() || 'Pengunjung',
        category,
        rating,
        message: message.trim(),
      });
      setFeedbacks((current) => [saved, ...current]);
      setName('');
      setMessage('');
      setNotice('Terima kasih, masukanmu sudah tersimpan.');
    } catch {
      setError('Masukan belum berhasil dikirim. Coba lagi sebentar lagi.');
    } finally {
    }
  };

  return (
    <section className="feedback-section" id="feedback">
      <div className="section-wrap feedback-layout">
        <Reveal className="feedback-intro">
          <p className="eyebrow">07 · SUARA PENGUNJUNG</p>
          <h2>Ceritakan <span>pendapatmu.</span></h2>
          <p>Masukanmu membantu kami mengembangkan ide ini. Situs ini tanpa backend, jadi feedback hanya tersimpan di browser yang digunakan dan tidak terkirim ke tim.</p>
          <div className="feedback-count"><MessageCircle size={17} /><span><b>{feedbacks.length}</b> masukan terkumpul</span></div>
        </Reveal>

        <Reveal className="feedback-panel" delay={90}>
          <form className="feedback-form" onSubmit={handleSubmit}>
            <label className="feedback-label" htmlFor="feedback-name">Nama <span>opsional</span></label>
            <input id="feedback-name" name="name" type="text" maxLength={40} placeholder="Namamu atau anonim" value={name} onChange={(event) => setName(event.target.value)} />

            <div className="feedback-form-row">
              <label className="feedback-field">
                <span className="feedback-label">Jenis masukan</span>
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  <option>Saran</option>
                  <option>Pertanyaan</option>
                  <option>Apresiasi</option>
                </select>
              </label>
              <fieldset className="rating-field">
                <legend className="feedback-label">Penilaian</legend>
                <div className="rating-buttons" aria-label={`Penilaian ${rating} dari 5`}>{[1, 2, 3, 4, 5].map((value) => <button className={value <= rating ? 'is-selected' : ''} key={value} type="button" aria-label={`${value} dari 5 bintang`} aria-pressed={rating === value} onClick={() => setRating(value)}><Star size={17} fill="currentColor" /></button>)}</div>
              </fieldset>
            </div>

            <label className="feedback-label" htmlFor="feedback-message">Masukanmu</label>
            <textarea id="feedback-message" name="message" minLength={10} maxLength={500} required placeholder="Tulis saran atau pendapatmu di sini..." value={message} onChange={(event) => setMessage(event.target.value)} />
            <div className="feedback-form-footer"><small>{message.length}/500 karakter</small><button className="feedback-submit" type="submit" disabled={isSubmitting}><span>{isSubmitting ? 'Mengirim...' : 'Kirim masukan'}</span><Send size={15} /></button></div>
            {notice && <p className="feedback-notice" role="status">{notice}</p>}
            {error && <p className="feedback-error" role="alert">{error}</p>}
          </form>

          <div className="feedback-list" aria-live="polite">
            <h3>Masukan terbaru <span>{feedbacks.length}</span></h3>
            {isLoading ? <p className="feedback-empty">Memuat masukan...</p> : feedbacks.length === 0 ? <p className="feedback-empty">Belum ada masukan. Jadilah yang pertama berbagi.</p> : feedbacks.slice(0, 3).map((item) => <article className="feedback-item" key={item.id}>
              <div className="feedback-item-top"><b>{item.name || 'Pengunjung'}</b><span>{item.category || 'Saran'}</span></div>
              <div className="feedback-item-rating" aria-label={`Penilaian ${item.rating || 5} dari 5`}>{[1, 2, 3, 4, 5].map((value) => <Star key={value} size={11} fill={value <= (item.rating || 5) ? 'currentColor' : 'none'} />)}</div>
              <p>{item.message}</p>
            </article>)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return <footer className="footer"><a className="wordmark footer-brand" href="#sumber"><BrandMark /><span>pradnyasiwi <b>quadtech</b></span></a><p>Sebuah langkah kecil untuk pertanian yang lebih berdaya. <Sun size={13} /></p><span className="footer-school">SMPN 4 PAKEM · SLEMAN, YOGYAKARTA</span></footer>;
}

function App() {
  const [phase, setPhase] = useState('loading');
  const completeLoading = useCallback(() => setPhase('intro'), []);
  const startTransition = useCallback(() => setPhase('transition'), []);

  useEffect(() => {
    if (phase === 'home') {
      document.body.classList.remove('intro-pending');
      return undefined;
    }
    document.body.classList.add('intro-pending');
    return undefined;
  }, [phase]);

  useEffect(() => {
    if (phase !== 'transition') return undefined;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setPhase('home'), prefersReducedMotion ? 100 : 1200);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return <>
    {phase === 'loading' && <LoadingScreen onComplete={completeLoading} />}
    {(phase === 'intro' || phase === 'transition') && <Intro onEnter={startTransition} transitioning={phase === 'transition'} />}
    <div className={`site-shell${phase === 'transition' || phase === 'home' ? ' is-visible' : ''}${phase === 'transition' ? ' is-revealing' : ''}`} aria-hidden={phase !== 'transition' && phase !== 'home'} inert={phase !== 'home'}>
      <Header />
      <main><SourcesSection /><ProjectSummary /><Model3DSection /><GallerySection /><FeedbackSection /><TeamSection /></main>
      <Footer />
    </div>
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
