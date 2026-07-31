document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll reveal
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));

    // 2. Skill bar animation
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const bar = e.target.querySelector('.skill-bar');
                if (bar) bar.style.width = bar.dataset.width;
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skill-card').forEach(el => barObserver.observe(el));

    // 3. LOGIKA VALIDASI & PERINGATAN 
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            // Cek satu satu inputnya
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ff5f56'; 
                    input.placeholder = ""; 
                } else {
                    input.style.borderColor = 'var(--border)'; 
                }
            });

            // format email
            const emailInput = contactForm.querySelector('input[type="email"]');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value && !emailRegex.test(emailInput.value)) {
                isValid = false;
                emailInput.style.borderColor = '#ff5f56';
                showPopup('Format Salah!', 'Silahkan pariksa lagi email anda!', 'error');
                return;
            }

            if (!isValid) {
                showPopup('Ada yang Kosong!', 'Harap isi kolom yang masih kosong.', 'error');
                return;
            }


            showPopup('Trimakasih!', 'Pesen anda sudah terkirim. ✅', 'success');
            contactForm.reset();

            inputs.forEach(input => input.style.borderColor = 'var(--border)');
        });
    }

    // Fungsi Popup Peringatan & Sukses
    function showPopup(title, text, type) {
        const popup = document.createElement('div');
        const bgColor = type === 'error' ? '#ff5f56' : 'var(--accent2)'; 
        
        popup.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            background: ${bgColor}; color: white;
            padding: 1.2rem 2rem; border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000; animation: slideIn 0.5s ease forwards;
            font-family: 'DM Sans', sans-serif; min-width: 250px;
        `;
        popup.innerHTML = `<strong>${title}</strong><p style="font-size: 0.85rem; margin-top: 5px;">${text}</p>`;
        
        document.body.appendChild(popup);

        setTimeout(() => {
            popup.style.animation = 'slideOut 0.5s ease forwards';
            setTimeout(() => popup.remove(), 500);
        }, 3500);
    }
});

// ======= LIGHTBOX =======
    const lightbox   = document.getElementById('lightbox');
    const lbImg      = document.getElementById('lbImg');
    const lbClose    = document.getElementById('lbClose');
    const lbPrev     = document.getElementById('lbPrev');
    const lbNext     = document.getElementById('lbNext');
    const lbCounter  = document.getElementById('lbCounter');

    // semua gambar galeri
    const galleryImgs = [...document.querySelectorAll('.gallery-item')];
    let currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      const src = galleryImgs[currentIndex].src;
      lbImg.src = src;
      lbImg.style.animation = 'none';
      requestAnimationFrame(() => { lbImg.style.animation = 'lbZoomIn 0.3s cubic-bezier(0.22,1,0.36,1)'; });
      lbCounter.textContent = (currentIndex + 1) + ' / ' + galleryImgs.length;
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + galleryImgs.length) % galleryImgs.length;
      openLightbox(currentIndex);
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % galleryImgs.length;
      openLightbox(currentIndex);
    }

    // Klik gambar atau tombol zoom → buka lightbox
    galleryImgs.forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => openLightbox(i));
    });

    document.querySelectorAll('.gallery-btn-zoom').forEach((btn, i) => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(i); });
    });

    // Kontrol lightbox
    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', showPrev);
    lbNext.addEventListener('click', showNext);

    // Klik di luar gambar → tutup
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    // Keyboard: Esc tutup, panah navigasi
    document.addEventListener('keydown', (e) => {
      if (lightbox.style.display !== 'flex') return;
      if (e.key === 'Escape')    closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });

