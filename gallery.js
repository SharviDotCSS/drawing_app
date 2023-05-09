const savedArtwork = localStorage.getItem('saved-artwork');
if (savedArtwork) {
  const img = document.createElement('img');
  img.src = savedArtwork;
  document.body.appendChild(img);
  img.style.marginLeft = "50";
}

