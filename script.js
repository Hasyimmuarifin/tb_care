let currentSlide = 0;

const track = document.getElementById("carouselTrack");
const dots = document.querySelectorAll(".dot");
const title = document.getElementById("info-title");
const subtitle = document.getElementById("info-subtitle");
const faders = document.querySelectorAll(".fade-in");
const navbar = document.getElementById("navbar");
const hero = document.getElementById("home");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-menu li a");
const music = document.getElementById("bg-music");
const btn = document.getElementById("music-btn");
const img = btn.querySelector("img");
const cards = document.querySelectorAll('.developer-card');

let isPlaying = false;
music.muted = false;

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120; // offset navbar
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
  
  navLinks.forEach(link => {
    link.addEventListener("click", function () {
      navLinks.forEach(l => l.classList.remove("active"));
      this.classList.add("active");
    });
  });
});


window.addEventListener("scroll", () => {
  const trigger = hero.offsetHeight - 100;

  if (window.scrollY > trigger) {
    navbar.classList.add("dark");
  } else {
    navbar.classList.remove("dark");
  }
});

const data = [
  {
    title: "Edukasi TBC",
    subtitle: "Kenali perbedaan TBC Aktif dan TBC Laten",
  },
  {
    title: "Pencegahan TBC",
    subtitle: "Langkah sederhana untuk mencegah penyebaran TBC",
  },
];

function updateSlide() {
  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  dots.forEach((dot) => dot.classList.remove("active"));
  dots[currentSlide].classList.add("active");

  title.innerText = data[currentSlide].title;
  subtitle.innerText = data[currentSlide].subtitle;
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % 2;
  updateSlide();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + 2) % 2;
  updateSlide();
}

function goToSlide(index) {
  currentSlide = index;
  updateSlide();
}

function showOnScroll() {
  const triggerBottom = window.innerHeight * 0.85;

  faders.forEach((el) => {
    const top = el.getBoundingClientRect().top;

    if (top < triggerBottom) {
      el.classList.add("show");
    }
  });
}

function toggleHighlight() {
  const highlight = document.querySelector(".about-highlight");
  highlight.classList.toggle("active");
}

function fixCenter() {
  const flipbook = $('.flipbook');
  const currentPage = flipbook.turn('page');
  const totalPages = flipbook.turn('pages');

  if (currentPage === 1) {
    // Halaman cover (kiri kosong)
    flipbook.css('transform', 'translateX(25%)');
  } 
  else if (currentPage === totalPages) {
    // Halaman terakhir (kanan kosong)
    flipbook.css('transform', 'translateX(25%)');
  } 
  else {
    // Tengah (2 halaman normal)
    flipbook.css('transform', 'translateX(25%)');
  }
}

btn.addEventListener("click", () => {
  if (isPlaying) {
    music.pause();
    img.classList.remove("rotate");
  } else {
    music.play();
    img.classList.add("rotate");
  }
  isPlaying = !isPlaying;
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0)";
    }
  });
}, {
  threshold: 0.2
});

cards.forEach(card => {
  card.style.opacity = 0;
  card.style.transform = "translateY(50px)";
  card.style.transition = "all 0.6s ease";
  observer.observe(card);
});

window.addEventListener("scroll", showOnScroll);
window.addEventListener("load", showOnScroll);

setInterval(nextSlide, 10000);