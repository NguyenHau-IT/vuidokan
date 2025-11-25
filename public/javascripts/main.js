// Main application entry point
document.addEventListener("DOMContentLoaded", function () {
  // Initialize theme
  initializeTheme();

  // Initialize header scroll effect
  initializeHeaderScroll();

  // Initialize loading animation
  hidePageLoader();

  // Initialize performance optimizations
  initializePerformanceOptimizations();

  const sections = Array.from(document.querySelectorAll(".snap-section"));
  if (!sections.length) return;

  let isScrolling = false;
  let currentIndex = 0;

  function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;
    isScrolling = true;
    currentIndex = index;

    sections[index].scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Khoảng thời gian khóa lại, tránh spam wheel
    setTimeout(() => {
      isScrolling = false;
    }, 800); // có thể chỉnh 600–1000ms tùy cảm giác
  }

  // Xác định section gần màn hình nhất (phòng khi user reload giữa trang)
  function updateCurrentIndexByScroll() {
    let closestIndex = 0;
    let minDistance = Infinity;

    sections.forEach((sec, i) => {
      const rect = sec.getBoundingClientRect();
      const distance = Math.abs(rect.top);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    });

    currentIndex = closestIndex;
  }

  // Bắt sự kiện cuộn chuột
  window.addEventListener(
    "wheel",
    (e) => {
      // Nếu đang auto-scroll thì bỏ qua
      if (isScrolling) return;

      e.preventDefault(); // chặn cuộn default

      // Cập nhật lại index hiện tại theo vị trí
      updateCurrentIndexByScroll();

      if (e.deltaY > 0) {
        // Cuộn xuống
        scrollToSection(currentIndex + 1);
      } else if (e.deltaY < 0) {
        // Cuộn lên
        scrollToSection(currentIndex - 1);
      }
    },
    { passive: false } // cần passive:false để dùng e.preventDefault()
  );

  // Hỗ trợ phím ↑ ↓ PgUp PgDn Space
  window.addEventListener("keydown", (e) => {
    if (isScrolling) return;

    if (["ArrowDown", "PageDown", " "].includes(e.key)) {
      e.preventDefault();
      updateCurrentIndexByScroll();
      scrollToSection(currentIndex + 1);
    } else if (["ArrowUp", "PageUp"].includes(e.key)) {
      e.preventDefault();
      updateCurrentIndexByScroll();
      scrollToSection(currentIndex - 1);
    }
  });

  // Click vào link #home, #about, #services, #contact vẫn mượt
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      const index = sections.indexOf(target);
      if (index === -1) return;

      e.preventDefault();
      scrollToSection(index);
    });
  });

  console.log("Vuidokan website initialized successfully! 🏃‍♂️⚽");
});

// Theme initialization
function initializeTheme() {
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme === "dark" || (!currentTheme && prefersDarkScheme.matches)) {
    document.body.classList.add("dark-theme");
  }
}

// Header scroll effect
function initializeHeaderScroll() {
  const header = document.querySelector(".header");
  let lastScrollTop = 0;

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add/remove scrolled class
    if (scrollTop > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Hide/show header on scroll
    if (scrollTop > lastScrollTop && scrollTop > 500) {
      header.classList.add("hidden");
    } else {
      header.classList.remove("hidden");
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });
}

// Hide page loader
function hidePageLoader() {
  const loader = document.querySelector(".page-loader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("fade-out");
      setTimeout(() => {
        loader.remove();
      }, 300);
    }, 500);
  }
}

// Performance optimizations
function initializePerformanceOptimizations() {
  // Lazy loading for images
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }

  // Debounced window resize handler
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Handle resize events
      updateViewportHeight();
    }, 250);
  });
}

// Update viewport height for mobile browsers
function updateViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

// Global utility functions
window.VuidokanUtils = {
  // Smooth scroll to element
  scrollTo: function (element) {
    if (typeof element === "string") {
      element = document.querySelector(element);
    }
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  },

  // Format phone number
  formatPhone: function (phone) {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("84")) {
      return (
        "+84 " +
        cleaned.substring(2).replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")
      );
    } else if (cleaned.startsWith("0")) {
      return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
    }
    return phone;
  },

  // Get current page section
  getCurrentSection: function () {
    const sections = document.querySelectorAll("section[id]");
    let currentSection = "";

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        currentSection = section.id;
      }
    });

    return currentSection;
  },
};
