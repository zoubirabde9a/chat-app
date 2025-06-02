document.addEventListener('DOMContentLoaded', function () {
  const nav = document.querySelector('.vertical-navbar');
  if (!nav) return;
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      // Remove active from all
      nav.querySelectorAll('.nav-submenu a').forEach(a => a.classList.remove('active'));
      // Add active to clicked
      e.target.classList.add('active');
    }
  });
}); 