// main.js
import { renderDashboard } from './dashboard.js';
import { renderGroups }    from './groups.js';
import { renderScan }      from './scan.js';

const main           = document.getElementById('main-content');
const toggleBtn      = document.getElementById('menu-toggle');
const sidebar        = document.getElementById('sidebar');
const overlay        = document.getElementById('overlay');
const navItems       = document.querySelectorAll('#sidebar .nav-item[data-section]');
const logoutBtn      = document.getElementById('logout');
const profileNameEl  = document.getElementById('profile-name');
const userInitialsEl = document.getElementById('user-initials');

// بارگذاری اطلاعات کاربر
async function loadUser() {
  try {
    const res = await fetch('/me');
    if (!res.ok) throw new Error();
    const user = await res.json();
    profileNameEl.textContent  = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    userInitialsEl.textContent = `${user.firstName?.[0]||''}${user.lastName?.[0]||''}`.toUpperCase();
  } catch {
    profileNameEl.textContent  = 'کاربر';
    userInitialsEl.textContent = '';
  }
}

// باز/بسته کردن سایدبار و اورلی
function toggleSidebar() {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
  toggleBtn.classList.toggle('active');
}

// بستن سایدبار
function closeSidebar() {
  if (!sidebar.classList.contains('open')) return;
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
  toggleBtn.classList.remove('active');
}

// ایونت‌ها
toggleBtn.addEventListener('click', toggleSidebar);
overlay.addEventListener('click', closeSidebar);
main.addEventListener('click', (e) => {
  // اگر کلیک دقیقاً روی main بود (نه داخل سایدبار)، سایدبار ببند
  if (!sidebar.contains(e.target)) closeSidebar();
});

// رندر بخش‌ها
const sections = {
  dashboard: renderDashboard(),
  groups:    renderGroups(),
  scan:      renderScan()
};
Object.values(sections).forEach(sec => {
  sec.classList.add('section');
  main.appendChild(sec);
});

// سویچ بین بخش‌ها
function activateSection(key) {
  Object.values(sections).forEach(sec => sec.classList.remove('active'));
  navItems.forEach(item => item.classList.remove('bg-gray-700'));
  sections[key].classList.add('active');
  document
    .querySelector(`#sidebar .nav-item[data-section="${key}"]`)
    .classList.add('bg-gray-700');
  closeSidebar();
}
navItems.forEach(item => {
  item.addEventListener('click', () => activateSection(item.dataset.section));
});

// خروج
logoutBtn.addEventListener('click', async () => {
  await fetch('/logout', { method: 'POST' });
  window.location.href = '/login';
});

// مقداردهی اولیه
loadUser();
activateSection('dashboard');
