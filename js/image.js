function handleImages() {
  document.querySelectorAll('img').forEach((img) => {
    if (img.classList.contains('img--fluid')) {
      const wrapper = img.parentNode;
      wrapper.setAttribute('style', `max-width:${img.naturalWidth}px;`);
    } else if (img.classList.contains('img--inline')) {
      img.setAttribute('style', `max-width:${img.naturalWidth}px;`);
    }
  });
}

handleImages();
