document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const modal = document.getElementById('modal');
  const okButton = document.getElementById('okModalBtn');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    modal.style.display = 'flex';
  });

  okButton.addEventListener('click', function () {
    const redirectUrl = form.getAttribute('data-url');
    window.location.href = redirectUrl;
  });
});

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
}