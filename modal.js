// Inside your DOMContentLoaded handler
const hireMeBtn = document.getElementById('hireMeBtn');
const hireMeModal = document.getElementById('hireMeModal');
const closeBtn = hireMeModal.querySelector('.close');

hireMeBtn.addEventListener('click', function(e) {
  e.preventDefault();
  // Instead of "hireMeModal.style.display = 'block';"
  hireMeModal.classList.add('show');
});

closeBtn.addEventListener('click', function() {
  hireMeModal.classList.remove('show');
});

// Close modal by clicking outside modal-content
window.addEventListener('click', function(e) {
  if (e.target === hireMeModal) {
    hireMeModal.classList.remove('show');
  }
});

  