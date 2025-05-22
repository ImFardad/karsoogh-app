// menu.js
const toggleBtn = document.getElementById('menu-toggle');
const sidebar   = document.getElementById('sidebar');
const overlay   = document.getElementById('overlay');
const userNameP = document.getElementById('user-name');

// نام کاربر را از سشن (یا API) بگیر
const currentUser = {
  firstName: 'علی',
  lastName: 'رضایی'
};
userNameP.textContent = `${currentUser.firstName} ${currentUser.lastName}`;

toggleBtn.addEventListener('click', () => {
  toggleBtn.classList.toggle('active');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
});

overlay.addEventListener('click', () => {
  toggleBtn.classList.remove('active');
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
});
