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
        header.classList.add("header-scrolled");
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
    spaceBetween: 30,
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

  // --- Mobile Menu (REVISED & FIXED) ---
  const mobileMenuButton = document.querySelector("#mobileMenuButton");
  const mobileMenu = document.querySelector("#mobileMenu");
  const closeMenuButton = document.querySelector("#closeMenuButton");

  if (mobileMenuButton && mobileMenu && closeMenuButton) {
    // Fungsi untuk membuka menu
    const openMenu = () => {
      mobileMenu.classList.add("open");
    };
    // Fungsi untuk menutup menu
    const closeMenu = () => {
      mobileMenu.classList.remove("open");
    };

    mobileMenuButton.addEventListener("click", openMenu);
    closeMenuButton.addEventListener("click", closeMenu);

    // Menutup menu saat link di dalam menu di-klik
    document.querySelectorAll("#mobileMenu a").forEach((link) => {
      link.addEventListener("click", closeMenu);
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
              if (element.dataset.animated === "true") return;
              const target = parseInt(element.dataset.target, 10);
              element.textContent = "0";
              element.dataset.animated = "true";
              let current = 0;
              const duration = 2000;
              const increment =
                target > 100 ? Math.ceil(target / (duration / 20)) : 1;
              const stepTime = Math.max(
                1,
                Math.floor(duration / (target / increment))
              );
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
      },
      {
        threshold: 0.5,
      }
    );
    statsObserver.observe(statsSection);
  }

  // --- Scroll to Top Button ---
  const scrollToTopBtn = document.querySelector("#scrollToTopBtn");
  if (scrollToTopBtn) {
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

});
