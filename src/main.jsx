import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Compass,
  Leaf,
  Menu,
  MoveUpRight,
  ShieldCheck,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import './styles.css';

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

const benefits = [
  {
    number: '01',
    icon: Clock3,
    title: 'Waktu lebih efisien',
    text: 'Mendukung proses pengeringan agar lebih praktis dan mengurangi kerepotan yang berulang.',
    tone: 'sunny',
  },
  {
    number: '02',
    icon: ShieldCheck,
    title: 'Keselamatan ikut dipikirkan',
    text: 'Berangkat dari kepedulian pada kenyamanan dan keselamatan pekerja di sekitar hasil panen.',
    tone: 'blue',
  },
  {
    number: '03',
    icon: Leaf,
    title: 'Potensi lokal bertumbuh',
    text: 'Ikut merawat perhatian pada pertanian padi dan semangat Sleman Berdaya.',
    tone: 'green',
  },
];

const facts = [
  { icon: Sun, title: 'Fokus pada pengeringan', note: 'Mendukung proses penjemuran padi' },
  { icon: ShieldCheck, title: 'Mengutamakan keselamatan', note: 'Dirancang dengan kebutuhan pekerja dalam pikiran' },
  { icon: Compass, title: 'Berangkat dari potensi lokal', note: 'Pertanian padi di Sleman, Yogyakarta' },
];

function BrandMark({ large = false }) {
  return (
    <span className={`brand-mark${large ? ' brand-mark-large' : ''}`} aria-hidden="true">
      <span className="brand-mark-orbit" />
      <span className="brand-mark-center"><Leaf size={large ? 34 : 18} strokeWidth={1.6} /></span>
      <span className="brand-mark-glint" />
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

function Intro({ onEnter }) {
  const [leaving, setLeaving] = useState(false);
  const enter = () => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(onEnter, 700);
  };
  useEffect(() => {
    const timer = window.setTimeout(enter, 4200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`intro${leaving ? ' is-leaving' : ''}`} aria-label="Animasi pembuka Pradnyasiwi Quadtech">
      <div className="intro-field intro-field-back" />
      <div className="intro-field intro-field-front" />
      <div className="intro-orbit orbit-one" /><div className="intro-orbit orbit-two" />
      <div className="intro-sun"><span /></div>
      <div className="intro-cloud cloud-one" /><div className="intro-cloud cloud-two" />
      <div className="intro-content">
        <div className="intro-logo"><BrandMark large /></div>
        <p className="intro-kicker">SMP NEGERI 4 PAKEM MEMPERSEMBAHKAN</p>
        <h1>Pradnyasiwi <span>Quadtech</span></h1>
        <p className="intro-caption">Inovasi kecil, semangat besar untuk pertanian Sleman.</p>
        <button className="intro-enter" type="button" onClick={enter}>Masuk ke pameran <ArrowUpRight size={17} /></button>
      </div>
      <p className="intro-footnote">Sebuah cerita dari Pakem, Yogyakarta <span>·</span> <b>STEM 2026</b></p>
      <button className="intro-skip" type="button" onClick={enter}>Lewati intro <ArrowRight size={13} /></button>
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
      <a className="wordmark" href="#beranda" aria-label="Pradnyasiwi Quadtech, beranda" onClick={closeMenu}>
        <BrandMark /><span>pradnyasiwi <b>quadtech</b></span>
      </a>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Tutup navigasi' : 'Buka navigasi'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Navigasi utama">
        <a href="#tentang" onClick={closeMenu}>Cerita kami</a>
        <a href="#manfaat" onClick={closeMenu}>Manfaat</a>
        <a href="#galeri" onClick={closeMenu}>Galeri</a>
        <a className="nav-cta" href="#alat" onClick={closeMenu}>Jelajahi alat <ArrowUpRight size={14} /></a>
      </nav>
    </header>
  );
}

function Hero() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const handlePointer = (event) => {
    if (event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({ x: ((event.clientX - rect.left) / rect.width - 0.5) * 7, y: ((event.clientY - rect.top) / rect.height - 0.5) * -7 });
  };

  return (
    <section className="hero section-wrap" id="beranda">
      <Reveal className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-mark"><Sun size={13} /></span> Teknologi tepat guna dari Pakem, Sleman</div>
        <h1>Panen cerah,<br /><span>kerja lebih aman.</span></h1>
        <p className="hero-description">Kenalan dengan alat penjemur padi otomatis yang membantu proses pengeringan terasa lebih praktis—supaya petani punya satu hal lebih sedikit untuk dikhawatirkan.</p>
        <div className="hero-actions"><a className="button button-primary" href="#alat">Lihat cara kerjanya <ArrowDown size={15} /></a><a className="text-link" href="#tentang">Kenapa kami membuatnya? <ArrowUpRight size={14} /></a></div>
        <div className="hero-note"><span className="note-icon"><Leaf size={18} /></span><span>Dibuat dengan rasa ingin tahu<br /><b>oleh siswa SMPN 4 Pakem</b></span></div>
      </Reveal>
      <Reveal className="hero-art-wrap" delay={100}>
        <div className="hero-art" onPointerMove={handlePointer} onPointerLeave={() => setPointer({ x: 0, y: 0 })} style={{ '--tilt-x': `${pointer.x}deg`, '--tilt-y': `${pointer.y}deg` }}>
          <img src={asset('sawah-pagi.svg')} alt="Ilustrasi sawah di bawah cahaya pagi, terinspirasi dari pertanian Sleman" fetchPriority="high" />
          <div className="sun-stamp"><span><Sun size={20} /></span><small>CUACA CERAH<br />IDE MAKIN CERAH</small></div>
          <div className="hero-art-label"><span className="live-dot" /> Ide lokal, dampak nyata <b><ArrowUpRight size={15} /></b></div>
          <span className="hero-art-index">01 <i /> PAKEM, DIY</span>
          <div className="floating-grain grain-a"><Sparkles size={30} /></div><div className="floating-grain grain-b"><span>✳</span></div>
        </div>
      </Reveal>
      <a className="scroll-cue" href="#alat"><span className="scroll-cue-line" /> Gulir untuk menjelajah <ChevronDown size={13} /></a>
    </section>
  );
}

function MachineIllustration() {
  return (
    <div className="machine-scene" aria-label="Ilustrasi konsep alat penjemur padi otomatis" role="img">
      <div className="machine-sun"><Sun size={58} strokeWidth={1.1} /></div>
      <div className="machine-cloud cloud-left" /><div className="machine-cloud cloud-right" />
      <div className="machine-ground"><span /><span /><span /></div>
      <div className="machine">
        <div className="machine-glow" />
        <div className="machine-top"><span className="machine-panel"><i /><i /><i /><i /></span><span className="machine-cap" /></div>
        <div className="machine-window"><span className="rice-line" /><span className="rice-line" /><span className="rice-line" /><span className="rice-line" /><span className="rice-line" /></div>
        <div className="machine-controls"><span /><span /><span /><b>QUADTECH</b></div>
        <div className="machine-leg leg-one" /><div className="machine-leg leg-two" />
        <div className="machine-wheel wheel-one" /><div className="machine-wheel wheel-two" />
      </div>
      <div className="machine-label"><span className="machine-label-dot" /> KONSEP ALAT · ILUSTRASI</div>
      <div className="visual-caption"><Sun size={14} /> Matahari bantu kerja, teknologi bantu jaga.</div>
    </div>
  );
}

function DeviceSection() {
  return (
    <section className="device-section section-wrap" id="alat">
      <Reveal className="section-heading"><p className="eyebrow">01 — KENALAN DULU, YUK!</p><h2>Ini bukan jemuran biasa.<br /><span>Ini teman baik petani.</span></h2><p>Alat penunjang pertanian yang dirancang untuk membantu pengeringan padi dengan lebih efisien dan mendukung keselamatan pekerja.</p></Reveal>
      <Reveal className="device-card" delay={80}>
        <MachineIllustration />
        <div className="device-info"><span className="tag tag-blue">INOVASI PERTANIAN</span><h3>Penjemur padi<br />otomatis</h3><p>Solusi yang berangkat dari kebutuhan nyata: proses pengeringan yang lebih terbantu, efisien, dan memperhatikan keselamatan pekerja.</p>
          <div className="device-facts">{facts.map(({ icon: Icon, title, note }) => <div className="device-fact" key={title}><span className="fact-icon"><Icon size={16} /></span><span><b>{title}</b><small>{note}</small></span></div>)}</div>
          <a className="text-link" href="#manfaat">Kenali manfaatnya <ArrowDown size={14} /></a>
        </div>
      </Reveal>
    </section>
  );
}

function StorySection() {
  return (
    <section className="story-section" id="tentang"><div className="section-wrap story-grid">
      <Reveal className="story-copy"><p className="eyebrow">02 — CERITA DI BALIK IDE</p><h2>Dari sawah sekitar,<br />lahir <span>ide yang berarti.</span></h2>
        <p>Pertanian padi punya peran penting bagi kehidupan kita. Namun, proses pengeringan hasil panen bisa menuntut waktu, tenaga, dan perhatian terhadap perubahan cuaca.</p>
        <p>Berangkat dari semangat Sleman Berdaya dan potensi lokal, tim Pradnyasiwi Quadtech dari SMPN 4 Pakem ingin mengeksplorasi teknologi yang mendukung proses penjemuran agar lebih efisien serta memperhatikan keselamatan pekerja.</p>
        <div className="quote-card"><span>“</span><p>Teknologi terbaik dimulai dari kepedulian pada kebutuhan di sekitar kita.</p><b>— Semangat Pradnyasiwi Quadtech</b></div>
      </Reveal>
      <Reveal className="story-image" delay={120}><img src={asset('lahan-padi.svg')} alt="Ilustrasi tanaman padi dan lanskap pertanian" loading="lazy" /><div className="image-sticker"><span>🌱</span><b>Tumbuh dari<br />potensi lokal</b></div><span className="image-caption">Sleman, tempat ide baik bertumbuh.</span></Reveal>
    </div></section>
  );
}

function BenefitsSection() {
  return (
    <section className="benefits-section section-wrap" id="manfaat">
      <Reveal className="section-heading center-heading"><p className="eyebrow">03 — KENAPA INI PENTING?</p><h2>Lebih dari sekadar<br /><span>mengeringkan padi.</span></h2><p>Inovasi ini membawa tiga harapan sederhana untuk pertanian yang makin berdaya.</p></Reveal>
      <div className="benefit-grid">{benefits.map(({ number, icon: Icon, title, text, tone }, index) => <Reveal as="article" className={`benefit-card tone-${tone}`} delay={index * 85} key={number}><div className="benefit-card-top"><span className="benefit-icon"><Icon size={21} strokeWidth={1.7} /></span><span className="card-number">{number}</span></div><h3>{title}</h3><p>{text}</p><span className="card-doodle"><Sparkles size={25} /></span></Reveal>)}</div>
    </section>
  );
}

function StepsSection() {
  const steps = [
    { icon: '🌾', title: 'Siapkan hasil panen', text: 'Padi disiapkan untuk memasuki proses pengeringan.' },
    { icon: '☀️', title: 'Proses pengeringan terbantu', text: 'Alat dirancang mendukung proses dengan lebih praktis.' },
    { icon: '✨', title: 'Petani punya lebih banyak waktu', text: 'Harapannya, pekerjaan terasa lebih efisien dan aman.' },
  ];
  return <section className="steps-section"><div className="section-wrap steps-inner"><Reveal className="steps-title"><p className="eyebrow">04 — IDE KERJANYA</p><h2>Alur sederhana,<br /><span>manfaat bermakna.</span></h2><p>Gambaran umum bagaimana alat ini dirancang untuk mendukung proses penjemuran.</p></Reveal><div className="steps-list">{steps.map((step, index) => <Reveal className="step-item" delay={index * 90} key={step.title}><span className="step-index">0{index + 1}</span><div className="step-emoji">{step.icon}</div><div><h3>{step.title}</h3><p>{step.text}</p></div><span className="step-arrow">{index === steps.length - 1 ? <Check size={16} /> : <ArrowDownRight size={16} />}</span></Reveal>)}</div></div></section>;
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
      <section className="gallery-section section-wrap" id="galeri">
        <Reveal className="gallery-heading"><div><p className="eyebrow">05 — POTRET PERJALANAN</p><h2>Dari ide sampai jadi,<br /><span>semua ada ceritanya.</span></h2></div><p>Geser, lihat-lihat, dan intip dunia kecil di balik ide ini.</p></Reveal>
        <div className="gallery-grid">{photos.map((photo, index) => <Reveal as="button" className={`gallery-item${index === 0 ? ' gallery-large' : ''}`} delay={index * 75} key={photo.title} type="button" onClick={() => setActivePhoto(photo)} aria-label={`Perbesar: ${photo.title}`}><img src={photo.src} alt={photo.alt} loading="lazy" /><span className="gallery-caption"><b>{photo.title}</b><small>{photo.note}</small></span><span className="expand-icon"><ArrowUpRight size={15} /></span>{photo.kind === 'illustration' && <span className="illustration-badge">ILUSTRASI</span>}</Reveal>)}</div>
        <div className="gallery-note"><span className="gallery-note-icon"><CircleHelp size={17} /></span><span><b>Catatan kecil:</b> gambar di galeri ini adalah ilustrasi. Dokumentasi alat dan proses asli akan ditambahkan setelah tersedia.</span></div>
      </section>
      {activePhoto && <div className="lightbox" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActivePhoto(null); }}><div className="lightbox-card" role="dialog" aria-modal="true" aria-label={activePhoto.title}><button className="lightbox-close" type="button" aria-label="Tutup foto" onClick={() => setActivePhoto(null)}><X size={18} /></button><img src={activePhoto.src} alt={activePhoto.alt} /><p>{activePhoto.title}<span> · {activePhoto.note}</span></p></div></div>}
    </>
  );
}

function SourcesSection() {
  return <section className="sources-section section-wrap"><Reveal className="sources-card"><div className="sources-icon"><span>📚</span></div><div><p className="eyebrow">REFERENSI & SUMBER</p><h2>Ide baik juga perlu <span>dasar kuat.</span></h2><p>Daftar sumber dan referensi resmi akan ditambahkan setelah materi proyek tersedia. Informasi yang tercantum di halaman ini masih berupa gambaran umum.</p></div><div className="source-placeholder"><span className="source-dot" /> Sumber proyek segera hadir</div></Reveal></section>;
}

function BehindScenes() {
  return <section className="bts-section"><div className="section-wrap bts-wrap"><Reveal className="bts-copy"><p className="eyebrow">06 — DI BALIK LAYAR</p><h2>Banyak ide, sedikit<br /><span>drama kabel.</span> (Katanya.)</h2><p>Di balik sebuah alat ada proses mencoba, berdiskusi, merakit, dan kadang berkata, “loh, tadi nyala kan?” Inilah perjalanan kecil tim kami.</p><a className="button button-light" href="#galeri">Lihat ilustrasi perjalanan <ArrowUpRight size={15} /></a><div className="bts-signoff">Semangat, tim! <Sparkles size={14} /></div></Reveal><Reveal className="bts-collage" delay={100}>
      <div className="bts-photo bts-main-photo"><div className="placeholder-art"><span className="placeholder-gear">⚙</span><b>PROSES PERAKITAN</b><small>Foto prototipe akan hadir di sini</small></div><span>Ruang dokumentasi · prototipe</span></div>
      <div className="bts-photo bts-small-photo"><div className="placeholder-art"><span className="placeholder-team">✳</span><b>PRADNYASIWI</b><small>Tim di balik ide ini</small></div><span>Ruang dokumentasi · tim</span></div>
      <span className="bts-sparkle sparkle-a">✳</span><span className="bts-sparkle sparkle-b">✦</span><div className="bts-note">dibuat bareng,<br />belajarnya bareng 💙</div>
    </Reveal></div></section>;
}

function Footer() {
  return <footer className="footer"><a className="wordmark footer-brand" href="#beranda"><BrandMark /><span>pradnyasiwi <b>quadtech</b></span></a><p>Sebuah langkah kecil untuk pertanian yang lebih berdaya. <Sun size={13} /></p><span className="footer-school">SMPN 4 PAKEM · SLEMAN, YOGYAKARTA</span></footer>;
}

function App() {
  const [introDone, setIntroDone] = useState(false);
  useEffect(() => {
    if (!introDone) return undefined;
    document.body.classList.remove('intro-pending');
    return undefined;
  }, [introDone]);

  return <>
    {!introDone && <Intro onEnter={() => setIntroDone(true)} />}
    <div className={`site-shell${introDone ? ' is-visible' : ''}`} aria-hidden={!introDone}>
      <Header />
      <main><Hero /><DeviceSection /><StorySection /><BenefitsSection /><StepsSection /><GallerySection /><SourcesSection /><BehindScenes /></main>
      <Footer />
    </div>
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
