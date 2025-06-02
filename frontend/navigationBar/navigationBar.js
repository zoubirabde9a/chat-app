document.addEventListener('DOMContentLoaded', function () {
  const mainItems = document.querySelectorAll('.main-item');
  const subItemsLists = document.querySelectorAll('.sub-items');

  function showSubItems(section) {
    subItemsLists.forEach(list => {
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
      // Show corresponding sub-items
      showSubItems(this.getAttribute('data-section'));
    });
  });

  // Optionally, set the first main item as active on load
  if (mainItems.length > 0) {
    mainItems[0].classList.add('active');
    showSubItems(mainItems[0].getAttribute('data-section'));
  }

  // Sub-item active state
  document.querySelector('.sub-nav').addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      document.querySelectorAll('.sub-items a').forEach(a => a.classList.remove('active'));
      e.target.classList.add('active');
    }
  });
}); 