
const root = document.documentElement;
const themeBtn = document.getElementById("themeToggle");

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  try { localStorage.setItem("theme", theme); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
setTheme(saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
themeBtn.addEventListener("click", () => {
  setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

// ---------- Mobile menu ----------
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
navLinks.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

// ---------- Typing effect ----------
const roles = ["B.Tech CSE Student", "Web Developer", "Cloud & AI Enthusiast"];
const typingEl = document.getElementById("typing");
let r = 0, c = 0, deleting = false;

function type() {
  const word = roles[r];
  typingEl.textContent = word.substring(0, c);
  if (!deleting && c < word.length) { c++; setTimeout(type, 100); }
  else if (!deleting) { deleting = true; setTimeout(type, 1200); }
  else if (c > 0) { c--; setTimeout(type, 50); }
  else { deleting = false; r = (r + 1) % roles.length; setTimeout(type, 300); }
}
type();

// ---------- Scroll reveal + skill bars ----------
document.querySelectorAll(".section .container > *").forEach(el => el.classList.add("reveal"));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    entry.target.querySelectorAll(".fill").forEach(f => (f.style.width = f.dataset.level + "%"));
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// ---------- Active nav link on scroll ----------
const sections = document.querySelectorAll("main section[id]");
const links = document.querySelectorAll(".nav-links a");
const toTop = document.getElementById("toTop");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
  toTop.classList.toggle("show", window.scrollY > 500);
});
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ---------- Project filter ----------
const filterBtns = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".card");
filterBtns.forEach(btn =>
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    cards.forEach(card => card.classList.toggle("hide", f !== "all" && card.dataset.cat !== f));
  })
);

// ---------- Contact form validation ----------
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

function setError(id, msg) { document.getElementById(id).textContent = msg; return !msg; }

form.addEventListener("submit", e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const ok = [
    setError("nameErr", name.length < 2 ? "Please enter your name." : ""),
    setError("emailErr", emailOk ? "" : "Please enter a valid email."),
    setError("msgErr", message.length < 10 ? "Message must be at least 10 characters." : "")
  ].every(Boolean);

  if (ok) {
    status.textContent = "Thanks, " + name + "! Your message has been sent.";
    form.reset();
    setTimeout(() => (status.textContent = ""), 5000);
  } else {
    status.textContent = "";
  }
});

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
