document.addEventListener('DOMContentLoaded', function () {
  const mainItems = document.querySelectorAll('.main-item');
  const subItems = document.querySelectorAll('.sub-items');
  const parentTitle = document.querySelector('.parent-title span');

  function showSubItems(section) {
    subItems.forEach(list => {
      if (list.getAttribute('data-section') === section) {
        list.classList.add('active');
        list.style.display = 'block';
      } else {
        list.classList.remove('active');
        list.style.display = 'none';
      }
    });
  }

  mainItems.forEach(item => {
    item.addEventListener('click', function () {
      // Remove active from all main items
      mainItems.forEach(i => i.classList.remove('active'));
      // Add active to clicked
      this.classList.add('active');
      // Hide all sub-items
      subItems.forEach(sub => sub.style.display = 'none');
      // Show corresponding sub-items
      const section = this.getAttribute('data-section');
      const targetSubItems = document.querySelector(`.sub-items[data-section="${section}"]`);
      if (targetSubItems) {
        targetSubItems.style.display = 'block';
        // Update parent title
        parentTitle.textContent = this.querySelector('span').textContent;
      }
    });
  });

  // Optionally, set the first main item as active on load
  if (mainItems.length > 0) {
    mainItems[0].classList.add('active');
    const initialSection = mainItems[0].getAttribute('data-section');
    const initialSubItems = document.querySelector(`.sub-items[data-section="${initialSection}"]`);
    if (initialSubItems) {
      initialSubItems.style.display = 'block';
      parentTitle.textContent = mainItems[0].querySelector('span').textContent;
    }
  }

  // Sub-item active state
  document.querySelector('.sub-nav').addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      document.querySelectorAll('.sub-items a').forEach(a => a.classList.remove('active'));
      e.target.classList.add('active');
    }
  });
}); 