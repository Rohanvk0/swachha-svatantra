// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    navList.classList.toggle('open');
  });
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (navList) navList.classList.remove('open');
    }
  });
});

// IST Clock (top bar)
function updateISTClock() {
  const el = document.getElementById('gmtClock'); // ID in your HTML
  if (!el) return;
  const now = new Date();
  const opts = { 
    weekday: 'short', 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    timeZone: 'Asia/Kolkata'   // IST
  };
  const s = now.toLocaleString('en-GB', opts).replace(',', '');
  el.textContent = `${s} IST`.toUpperCase();
}
updateISTClock();
setInterval(updateISTClock, 1000);

// "What's New" ticker autoplay
const ticker = document.getElementById('ticker');
if (ticker) {
  ticker.innerHTML = ticker.innerHTML + ticker.innerHTML; // Duplicate for loop
  requestAnimationFrame(() => ticker.classList.add('running'));
}
