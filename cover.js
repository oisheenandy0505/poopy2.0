// Page 1: cover interactions
// A) Rotating one-line messages (single-line only)
// B) Clickable gif easter egg (cute toast)
// C) Prompt-style open button gets a tiny "keypress" animation

const rotatingLine = document.getElementById("rotatingLine");
const coverGif = document.getElementById("coverGif");
const toast = document.getElementById("toast");
const openRepo = document.getElementById("openRepo");

const LINES = [
  "I’m sorry. I love you. I’m trying to show you change.",
  "No spirals. No tests. Just honesty and consistency.",
];

// typewriter for ONE line
let idx = 0;
let typing = false;
let stop = false;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function typeOneLine(text) {
  typing = true;
  rotatingLine.textContent = "";
  for (let i = 0; i < text.length; i++) {
    if (stop) return;
    rotatingLine.textContent += text[i];
    await sleep(50);
  }
  typing = false;
}

async function eraseLine() {
  const t = rotatingLine.textContent;
  for (let i = t.length; i >= 0; i--) {
    if (stop) return;
    rotatingLine.textContent = t.slice(0, i);
    await sleep(10);
  }
}

async function loopLines() {
  while (!stop) {
    const line = LINES[idx % LINES.length];
    await typeOneLine(line);
    await sleep(1400);
    await eraseLine();
    await sleep(220);
    idx++;
  }
}

// toast helper (used for keyboard enter)
let toastTimer = null;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// C) Make the prompt button feel “press enter”
openRepo.addEventListener("mouseenter", () => {
  openRepo.classList.add("armed");
});
openRepo.addEventListener("mouseleave", () => {
  openRepo.classList.remove("armed");
});

// Optional: allow Enter key to open the repo
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    showToast("Entering repo… hi love 🐻‍❄️");
    setTimeout(() => window.location.assign("terminal.html"), 220);
  }
});

// start loop after first paint
requestAnimationFrame(loopLines);
