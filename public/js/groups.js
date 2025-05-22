// groups.js
export function renderGroups() {
  const el = document.createElement('section');
  el.id = 'groups';
  el.className = 'section';
  el.innerHTML = `
    <h2>بخش گروه‌ها</h2>
    <!-- اینجا بعداً لیست گروه‌ها بارگذاری می‌شود -->
  `;
  return el;
}
