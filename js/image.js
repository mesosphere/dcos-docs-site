function styleFluidImages() {
    let fluidImages = document.getElementsByClassName('img-fluid');
    for (let i=0; i < fluidImages.length; i++) {
        console.log(fluidImages[i]);
        console.log(fluidImages[i].naturalWidth);
        fluidImages[i].setAttribute("style", `min-width:${fluidImages[i].naturalWidth}px;`);
    }
}

styleFluidImages();
