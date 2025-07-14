document.addEventListener("DOMContentLoaded", function () {
  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isActive = question.classList.contains("active");

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
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
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
  const gallerySlider = new Swiper(".gallery-slider", {
    loop: true,
    speed: 800,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
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

  // --- Preloader ---
  const preloader = document.querySelector("#preloader");
  window.addEventListener("load", () => {
    preloader.style.opacity = "0";
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  });

  // --- Mobile Menu ---
  const mobileMenuButton = document.querySelector("#mobileMenuButton");
  const mobileMenu = document.querySelector("#mobileMenu");
  const closeMenuButton = document.querySelector("#closeMenuButton");

  const toggleMenu = () => mobileMenu.classList.toggle("translate-x-full");

  mobileMenuButton.addEventListener("click", toggleMenu);
  closeMenuButton.addEventListener("click", toggleMenu);

  document.querySelectorAll('#mobileMenu a[href^="#"]').forEach((link) => {
    link.addEventListener("click", toggleMenu);
  });

  // --- Stats Counter Animation (Re-animates on scroll) ---
  const statsSection = document.querySelector("#stats-section");

  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Jika section masuk ke layar (terlihat)
          if (entry.isIntersecting) {
            // Cek apakah sudah dianimasikan. Jika sudah, hentikan.
            if (statsSection.dataset.animated === "true") return;

            // Mulai animasi angka
            const statNumbers = statsSection.querySelectorAll(".stat-number");
            statNumbers.forEach((element) => {
              const target = parseInt(element.dataset.target);
              let current = 0;
              const duration = 2000; // Durasi animasi dalam milidetik
              // Kalkulasi penambahan angka agar animasi terasa halus
              const increment =
                target > 100 ? Math.ceil(target / (duration / 20)) : 1;
              const stepTime = Math.max(1, duration / (target / increment));

              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  current = target;
                  clearInterval(timer);
                }
                element.textContent = current;
              }, stepTime);
            });

            // Tandai bahwa animasi sudah berjalan untuk sesi tampilan ini
            statsSection.dataset.animated = "true";
          } else {
            // Jika section keluar dari layar, reset angka ke 0 dan hapus penanda animasi
            const statNumbers = statsSection.querySelectorAll(".stat-number");
            statNumbers.forEach((element) => {
              element.textContent = "0";
            });
            statsSection.dataset.animated = "false";
          }
        });
      },
      {
        threshold: 0.5, // Animasi terpicu saat 50% section terlihat
      }
    );

    statsObserver.observe(statsSection);
  }

  // --- Scroll to Top Button ---
  const scrollToTopBtn = document.querySelector("#scrollToTopBtn");
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

  // --- Auto-update Copyright Year ---
  const currentYearSpan = document.getElementById("currentYear");
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --- Live News Slider ---
  async function fetchAndDisplayNews() {
    // PENTING: Ganti dengan API Key yang Anda dapatkan dari NewsAPI.org
    const API_KEY = "1387344606a845939c327c3d23d7e48b";
    const query =
      '("tenaga kerja indonesia" OR "pekerja migran indonesia" OR "lowongan kerja luar negeri" OR "indonesian migrant worker")';
    const url = `https://newsapi.org/v2/everything?q=${query}&language=id&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`;

    const newsWrapper = document.getElementById("news-slider-wrapper");

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Gagal mengambil berita: ${response.statusText}`);
      }
      const data = await response.json();
      const articles = data.articles;

      // Bersihkan penanda loading
      newsWrapper.innerHTML = "";

      // Fungsi untuk memformat tanggal
      const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      };

      articles.forEach((article) => {
        // Jangan tampilkan artikel tanpa gambar atau judul
        if (!article.urlToImage || !article.title) return;

        const newsCardHTML = `
        <div class="swiper-slide">
          <div class="news-card">
            <img src="${
              article.urlToImage
            }" alt="Gambar Berita" class="news-card-image" onerror="this.onerror=null;this.src='/assets/a2.jpg';">
            <div class="news-card-content">
              <p class="news-card-meta">
                <span class="source">${
                  article.source.name
                }</span> &bull; ${formatDate(article.publishedAt)}
              </p>
              <h3 class="news-card-title">${article.title}</h3>
              <p class="news-card-description">${
                article.description || "Tidak ada deskripsi."
              }</p>
              <a href="${
                article.url
              }" target="_blank" rel="noopener noreferrer" class="news-card-link">Baca Selengkapnya &rarr;</a>
            </div>
          </div>
        </div>
      `;
        newsWrapper.innerHTML += newsCardHTML;
      });

      // Inisialisasi Swiper SETELAH berita dimuat
      new Swiper("#news-slider", {
        loop: true,
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
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        },
      });
    } catch (error) {
      console.error("Error:", error);
      newsWrapper.innerHTML = `<p class="text-center w-full text-red-500">Gagal memuat berita. ${error.message}. Pastikan API Key Anda valid.</p>`;
    }
  }

  // Panggil fungsi untuk mengambil berita saat halaman dimuat
  fetchAndDisplayNews();

  // --- Testimonials Swiper Slider ---
  const testimonialsSlider = new Swiper("#testimonials-slider", {
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
      // Tampilan untuk layar tablet
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      // Tampilan untuk layar desktop
      1024: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
    },
  });


});
