function styleFluidImages() {
  const fluidImages = document.getElementsByClassName('img--fluid');
  for (let i=0; i < fluidImages.length; i++) {
    fluidImages[i].setAttribute('style', `min-width:${fluidImages[i].naturalWidth}px;`);
  }
}

function styleInlineImages() {
  const inlineImages = document.getElementsByClassName('img--inline');
  for (let i=0; i < inlineImages.length; i++) {
    inlineImages[i].setAttribute('style', `min-width:${inlineImages[i].naturalWidth}px;`);
  }
}

styleFluidImages();
styleInlineImages();
