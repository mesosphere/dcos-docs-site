function styleFluidImages() {
  const fluidImages = document.getElementsByClassName('img--fluid');
  for (let i=0; i < fluidImages.length; i++) {
    fluidImages[i].setAttribute('style', `min-width:${fluidImages[i].naturalWidth}px;`);
  }
}

styleFluidImages();
