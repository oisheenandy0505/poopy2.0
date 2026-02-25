const openBtn = document.getElementById("openEnvelope");
const modal = document.getElementById("modal");
const modalCard = document.getElementById("modalCard");
const closeBtn = document.getElementById("closeModal");

const carousel = document.getElementById("carousel");
const dots = document.getElementById("dots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const SLIDES = [
  // Set `src` to any GIF URL (Tenor, GIPHY, local file, etc.)
  { src: "https://media.tenor.com/aN5uzT92EMcAAAAi/milk-and-mocha.gif", label: "milk+mocha" },
  { src: "https://media.tenor.com/owSXAc8yVpAAAAAi/milk-and-mocha-kiss-cheek.gif", label: "love" },
  { src: "https://media1.tenor.com/m/Rb2vC8Cs9O0AAAAC/silvia-emoji-cute-bear.gif", label: "kiss" },
];

let idx = 0;

// --- Modal open/close ---
function openModal() {
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
  setTimeout(() => modalCard.classList.add("pop"), 0);
}

function closeModal() {
  modalCard.classList.remove("pop");
  modal.classList.remove("show");
  document.body.style.overflow = "";
}

openBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);

// click outside card closes
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// escape closes
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
});

// --- Carousel rendering ---
function renderSlides() {
  carousel.innerHTML = "";
  dots.innerHTML = "";

  SLIDES.forEach((s, i) => {
    const slide = document.createElement("div");
    slide.className = "slide";

    const hasSrc = !!s.src;
    slide.innerHTML = `
      <div class="slideFrame${hasSrc ? "" : " missing"}">
        ${
          hasSrc
            ? `<img src="${s.src}" alt="${s.label || ""}">`
            : `<div class="missingMsg"><div class="missingFace">🙂</div><div>add GIF URL for “${s.label || ""}” in readme.js</div></div>`
        }
      </div>
    `;
    carousel.appendChild(slide);

    const d = document.createElement("button");
    d.className = "dotBtn";
    d.type = "button";
    d.setAttribute("aria-label", `go to slide ${i + 1}`);
    d.addEventListener("click", () => goTo(i));
    dots.appendChild(d);
  });

  update();
}

function update() {
  carousel.style.transform = `translateX(${-idx * 100}%)`;
  Array.from(dots.children).forEach((d, i) => {
    d.classList.toggle("active", i === idx);
  });

}

function goTo(i) {
  idx = Math.max(0, Math.min(SLIDES.length - 1, i));
  update();
}

prevBtn.addEventListener("click", () => goTo(idx - 1));
nextBtn.addEventListener("click", () => goTo(idx + 1));

// --- Swipe support (mobile) ---
let startX = 0;
let currentX = 0;
let dragging = false;

function onTouchStart(e) {
  if (!modal.classList.contains("show")) return;
  dragging = true;
  startX = e.touches[0].clientX;
  currentX = startX;
}

function onTouchMove(e) {
  if (!dragging) return;
  currentX = e.touches[0].clientX;
}

function onTouchEnd() {
  if (!dragging) return;
  dragging = false;

  const dx = currentX - startX;
  const threshold = 40;

  if (Math.abs(dx) > threshold) {
    hasSwiped = true;
    if (dx < 0) goTo(idx + 1);
    else goTo(idx - 1);
  }
}

modalCard.addEventListener("touchstart", onTouchStart, { passive: true });
modalCard.addEventListener("touchmove", onTouchMove, { passive: true });
modalCard.addEventListener("touchend", onTouchEnd);

// init
renderSlides();
