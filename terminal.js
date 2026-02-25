const screen = document.getElementById("screen");
const replayBtn = document.getElementById("replay");
const chapterLabel = document.getElementById("chapterLabel");
const progressPct = document.getElementById("progressPct");
const progressFill = document.getElementById("progressFill");

let running = false;
let abort = false;

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typeText(node, text, speed = 18, animated = true) {
  node.textContent = "";
  for (let i = 0; i < text.length; i++) {
    if (abort) return;
    node.textContent += text[i];
    if (animated) {
      await sleep(speed);
    }
  }
}

function scrollBottom() {
  screen.scrollTop = screen.scrollHeight;
}

function linePS1() {
  const row = el("div", "line");
  row.appendChild(el("span", "ps1", "$"));
  const cmdEl = el("span", "cmd");
  row.appendChild(cmdEl);
  screen.appendChild(row);
  return { cmdEl };
}

function out(text, cls = "out") {
  const node = el("div", cls, text);
  screen.appendChild(node);
  node.style.opacity = "0";
  node.style.transform = "translateY(4px)";
  requestAnimationFrame(() => {
    node.style.transition = "opacity .18s ease, transform .18s ease";
    node.style.opacity = "1";
    node.style.transform = "translateY(0)";
  });
  scrollBottom();
  return node;
}

function setProgress(pct, label) {
  const clamped = Math.max(0, Math.min(100, pct));
  progressPct.textContent = `${clamped}%`;
  progressFill.style.width = `${clamped}%`;
  if (label) chapterLabel.textContent = label;
}

async function showDiffBlockCompact(animated) {
  const box = el("div", "diff");
  const lines = [
    { t: "- fear → dishonesty", cls: "del" },
    { t: "- lack of clarity/vulnerability", cls: "del" },
    { t: "- doubting/controlling the love you give me", cls: "del" },
    { t: "+ fear → call it out early, stay honest", cls: "add" },
    { t: "+ direct + transparent communication", cls: "add" },
    { t: "+ trust your love", cls: "add" }
  ];

  screen.appendChild(box);
  scrollBottom();
  await sleep(animated ? 120 : 0);

  for (const entry of lines) {
    if (abort) return;
    const row = el("div", entry.cls, "");
    box.appendChild(row);
    await typeText(row, entry.t, 20, animated);
    await sleep(animated ? 80 : 0);
  }

  const ok = out("", "out");
  ok.innerHTML = `<span class="hl-purple">✓ build</span> looks better already <span class="hl-pink">💗</span>`;
  await sleep(animated ? 100 : 0);
}

async function run() {
  const animated = !sessionStorage.getItem("terminal_seen");
  if (running) return;
  running = true;
  abort = false;
  screen.innerHTML = "";

  const chapters = [
    {
      label: "prep",
      pct: 18,
      steps: [
        { cmd: "git checkout baseline/me"}
      ]
    },
    {
      label: "branch",
      pct: 32,
      steps: [
        { cmd: "git checkout -b fix/recursive-overthinking"}
      ]
    },
    {
      label: "fixes",
      pct: 62,
      steps: [
        {
          cmd: "git commit -m \"fix: reacting from fear instead of honesty\"",
          outs: ["✓ root cause identified + talked through (complete)"]
        },
        {
          cmd: "git commit -m \"feat: trust the love I’m given\"",
          outs: ["✓ building faith that you're here to stay (complete)"]
        },
        {
          cmd: "git commit -m \"refactor: clear + honest communication\"",
          outs: ["→ practicing direct, honest communication (in progress)"]
        }
      ]
    },
    {
      label: "diff",
      pct: 78,
      steps: [
        { cmd: "git diff baseline/me...fix/recursive-overthinking", diff: true }
      ]
    },
    {
      label: "push",
      pct: 88,
      steps: [
        { cmd: "git push -u origin fix/recursive-overthinking", outs: ["pushed: fix/recursive-overthinking"] }
      ]
    },
    {
      label: "merge",
      pct: 96,
      steps: [
        { cmd: "git switch baseline/me"},
        { cmd: "git merge fix/recursive-overthinking"},
        { cmd: "git push origin baseline/me"}
      ]
    }
  ];

  for (const chapter of chapters) {
    if (abort) break;
    setProgress(chapter.pct, chapter.label);

    const header = out("", "out");
    header.innerHTML = `<span class="hl-yellow">==</span> <span class="hl-blue">${chapter.label}</span> <span class="hl-yellow">==</span>`;
    await sleep(animated ? 120 : 0);

    for (const step of chapter.steps) {
      if (abort) break;

      const line = linePS1();
      await typeText(line.cmdEl, step.cmd, 18, animated);
      await sleep(animated ? 70 : 0);

      if (step.outs) {
        for (const text of step.outs.slice(0, 2)) {
          out(text);
          await sleep(animated ? 70 : 0);
        }
      }

      if (step.diff) {
        await sleep(animated ? 120 : 0);
        await showDiffBlockCompact(animated);
      }

      await sleep(animated ? 90 : 0);
    }
  }

  if (!abort) {
    setProgress(100, "done");
    out("tap “README.md” (top right)", "out");
    if (animated) {
      sessionStorage.setItem("terminal_seen", "1");
    }
  }

  running = false;
}

replayBtn.addEventListener("click", () => {
  abort = true;
  setTimeout(() => {
    abort = false;
    sessionStorage.removeItem("terminal_seen");
    run();
  }, 40);
});

run();
