const params = new URLSearchParams(window.location.search);

if (params.get('raw') === 'true') {
  document.getElementById('content').classList.add('raw');
  document.getElementById('header').remove();
  document.getElementById('footer').remove();
}