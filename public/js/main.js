// main.js
import { renderDashboard } from './dashboard.js';
import { renderGroups }    from './groups.js';
import { renderScan }      from './scan.js';

// المان‌های اصلی
const main           = document.getElementById('main-content');
const toggleBtn      = document.getElementById('menu-toggle');
const sidebar        = document.getElementById('sidebar');
const overlay        = document.getElementById('overlay');
const navItems       = document.querySelectorAll('#sidebar .nav-item[data-section]');
const logoutBtn      = document.getElementById('logout');
const profileNameEl  = document.getElementById('profile-name');
const userInitialsEl = document.getElementById('user-initials');

// ————————— loadUser —————————
// دریافت اطلاعات لاگین‌شده
async function loadUser() {
  try {
    const res = await fetch('/me');            // endpoint درست برای اطلاعات کاربر
    if (!res.ok) throw new Error('fetch failed');
    const user = await res.json();
    // نوشتن firstName و lastName
    const fname = user.firstName || '';
    const lname = user.lastName  || '';
    profileNameEl.textContent  = `${fname} ${lname}`.trim();
    // حروف اول برای آوتار
    userInitialsEl.textContent = (fname[0] || '').toUpperCase() + (lname[0] || '').toUpperCase();
  } catch (err) {
    console.error(err);
    profileNameEl.textContent  = 'کاربر';   // حالت پیش‌فرض
    userInitialsEl.textContent = '';
  }
}

// ————————— Sidebar Toggle & Overlay —————————
function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('open');
  toggleBtn.classList.add('active');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
  toggleBtn.classList.remove('active');
}

toggleBtn.addEventListener('click', () => {
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});

// بستن با کلیک روی اورلی
overlay.addEventListener('click', closeSidebar);
// بستن با کلیک روی هر نقطهٔ محتوای اصلی (به جز خود سایدبار)
main.addEventListener('click', e => {
  if (!sidebar.contains(e.target)) closeSidebar();
});

// ————————— Section Rendering & Navigation —————————
const sections = {
  dashboard: renderDashboard(),
  groups:    renderGroups(),
  scan:      renderScan()
};
Object.values(sections).forEach(sec => {
  sec.classList.add('section');
  main.appendChild(sec);
});

// فعال‌سازی و هایلایت یک بخش
function activateSection(key) {
  Object.values(sections).forEach(s => s.classList.remove('active'));
  navItems.forEach(i => i.classList.remove('bg-gray-700'));
  sections[key].classList.add('active');
  document
    .querySelector(`#sidebar .nav-item[data-section="${key}"]`)
    .classList.add('bg-gray-700');
  closeSidebar();
}

// انتساب رویداد کلیک به آیتم‌های منو
navItems.forEach(item => {
  item.addEventListener('click', () => activateSection(item.dataset.section));
});

// ————————— Logout Logic —————————
// با فراخوانی مستقیم روت بک‌اند که سشن را پاک می‌کند
logoutBtn.addEventListener('click', () => {
  window.location.href = '/logout';
});

// ————————— Initialization —————————
loadUser();
activateSection('dashboard');
