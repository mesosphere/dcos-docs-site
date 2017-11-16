function styleFluidImages() {
  const fluidImages = document.getElementsByClassName('img--fluid');
  const fluidImageContainer = document.getElementsByClassName('img__wrapper--fluid');
  for (let i=0; i < fluidImages.length; i++) {
    fluidImageContainer[i].setAttribute('style', `max-width:${fluidImages[i].naturalWidth}px;`);
  }
}

function styleInlineImages() {
  const inlineImages = document.getElementsByClassName('img--inline');
  for (let i=0; i < inlineImages.length; i++) {
    inlineImages[i].setAttribute('style', `max-width:${inlineImages[i].naturalWidth}px;`);
  }
}

styleFluidImages();
styleInlineImages();
