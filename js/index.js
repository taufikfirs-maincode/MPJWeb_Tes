document.addEventListener("DOMContentLoaded", function () {
  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isActive = question.classList.contains("active");

      // Menutup semua item lain sebelum membuka yang baru
      faqItems.forEach((otherItem) => {
        otherItem.querySelector(".faq-question").classList.remove("active");
        otherItem.querySelector(".faq-answer").style.maxHeight = null;
      });

      if (!isActive) {
        question.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  // --- Sticky Header & Background Change on Scroll ---
  const header = document.getElementById("header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("header-scrolled"); // Menggunakan class dari CSS
      } else {
        header.classList.remove("header-scrolled");
      }
    });
  }

  // --- Smooth Scroll Navigation ---
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // --- Gallery Swiper Slider ---
  new Swiper(".gallery-slider", {
    loop: true,
    speed: 800,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".gallery-slider .swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".gallery-slider .swiper-button-next",
      prevEl: ".gallery-slider .swiper-button-prev",
    },
  });

  // --- Services Swiper Slider (Mobile Only) ---
  let servicesSlider;
  function initServicesSlider() {
    const isMobile = window.innerWidth < 768;

    if (isMobile && !servicesSlider) {
      servicesSlider = new Swiper("#services-slider", {
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
          el: "#services-slider .swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
        },
      });
    } else if (!isMobile && servicesSlider) {
      servicesSlider.destroy(true, true);
      servicesSlider = undefined;
    }
  }

  initServicesSlider();
  window.addEventListener("resize", initServicesSlider);
  
  // --- Testimonials Swiper Slider ---
  new Swiper("#testimonials-slider", {
    loop: true,
    speed: 800,
    slidesPerView: 1,
    spaceBetween: 30, // Jarak antar slide
    pagination: {
      el: "#testimonials-slider .swiper-pagination",
      clickable: true,
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
    },
  });


  // --- Preloader ---
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    });
  }

  // --- Mobile Menu ---
  const mobileMenuButton = document.querySelector("#mobileMenuButton");
  const mobileMenu = document.querySelector("#mobileMenu");
  const closeMenuButton = document.querySelector("#closeMenuButton");

  const toggleMenu = (e) => {
    e.preventDefault();
    mobileMenu.classList.toggle("translate-x-full");
  };

  if (mobileMenuButton && mobileMenu && closeMenuButton) {
    mobileMenuButton.addEventListener("click", toggleMenu);
    closeMenuButton.addEventListener("click", toggleMenu);

    document.querySelectorAll('#mobileMenu a').forEach((link) => {
      link.addEventListener("click", () => {
        // Hanya tutup menu jika link mengarah ke section (#)
        if(link.getAttribute('href').startsWith('#')) {
            mobileMenu.classList.add("translate-x-full");
        }
      });
    });
  }

  // --- Stats Counter Animation ---
  const statsSection = document.querySelector("#stats-section");
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll(".stat-number");
            statNumbers.forEach((element) => {
              // Hanya jalankan animasi jika belum pernah dijalankan
              if (element.dataset.animated === "true") return;
              
              const target = parseInt(element.dataset.target, 10);
              element.textContent = "0"; // Reset ke 0
              element.dataset.animated = "true"; // Tandai sebagai sudah dianimasikan

              let current = 0;
              const duration = 2000;
              const increment = target > 100 ? Math.ceil(target / (duration / 20)) : 1;
              const stepTime = Math.max(1, Math.floor(duration / (target / increment)));

              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  current = target;
                  clearInterval(timer);
                }
                element.textContent = current;
              }, stepTime);
            });
          }
        });
      }, {
        threshold: 0.5,
      }
    );
    statsObserver.observe(statsSection);
  }

  // --- Scroll to Top Button ---
  const scrollToTopBtn = document.querySelector("#scrollToTopBtn");
  if(scrollToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.remove("scale-0");
      } else {
        scrollToTopBtn.classList.add("scale-0");
      }
    });
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // --- Auto-update Copyright Year ---
  const currentYearSpan = document.getElementById("currentYear");
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --- Live News Slider (Secure Version) ---
  async function fetchAndDisplayNews() {
    // URL sekarang mengarah ke serverless function kita, BUKAN NewsAPI langsung
    const url = "/.netlify/functions/getNews"; 
    const newsWrapper = document.getElementById("news-slider-wrapper");

    if (!newsWrapper) return;

    try {
      // Tidak ada lagi API Key di sini!
      const response = await fetch(url);
      if (!response.ok) {
        // Coba baca pesan error dari server jika ada
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || `Gagal mengambil berita: Status ${response.status}`;
        throw new Error(errorMessage);
      }
      const data = await response.json();
      
      // Cek jika API dari serverless function mengembalikan error
      if (data.status === 'error') {
        throw new Error(data.message || 'API Key tidak valid atau ada masalah lain.');
      }

      const articles = data.articles;

      if (!articles || articles.length === 0) {
        newsWrapper.innerHTML = `<p class="text-center w-full text-gray-500">Tidak ada berita terkini yang ditemukan.</p>`;
        return;
      }

      newsWrapper.innerHTML = ""; // Bersihkan penanda loading

      const formatDate = (isoDate) => {
        if(!isoDate) return 'Tanggal tidak diketahui';
        const date = new Date(isoDate);
        return date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      };

      articles.forEach((article) => {
        if (!article.urlToImage || !article.title) return;

        const newsCardHTML = `
        <div class="swiper-slide">
          <div class="news-card h-full">
            <img src="${article.urlToImage}" alt="Gambar Berita: ${article.title}" class="news-card-image" onerror="this.onerror=null;this.src='assets/a2.jpg';">
            <div class="news-card-content">
              <p class="news-card-meta">
                <span class="source">${article.source.name || 'Sumber tidak diketahui'}</span> &bull; ${formatDate(article.publishedAt)}
              </p>
              <h3 class="news-card-title">${article.title}</h3>
              <p class="news-card-description">${article.description || "Tidak ada deskripsi."}</p>
              <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="news-card-link">Baca Selengkapnya &rarr;</a>
            </div>
          </div>
        </div>
      `;
        newsWrapper.insertAdjacentHTML('beforeend', newsCardHTML);
      });

      // Inisialisasi Swiper SETELAH berita dimuat
      new Swiper("#news-slider", {
        loop: articles.length > 3, // Hanya loop jika berita cukup banyak
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
          el: "#news-slider .swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: "#news-slider .swiper-button-next",
          prevEl: "#news-slider .swiper-button-prev",
        },
        breakpoints: {
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        },
      });
    } catch (error) {
      console.error("Error saat fetch berita:", error);
      newsWrapper.innerHTML = `<p class="text-center w-full text-red-500">Gagal memuat berita. Silakan coba lagi nanti.</p>`;
    }
  }

  // Panggil fungsi untuk mengambil berita saat halaman dimuat
  fetchAndDisplayNews();
});