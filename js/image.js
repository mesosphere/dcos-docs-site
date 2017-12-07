function handleImages() {
  document.querySelectorAll('img').forEach((img) => {
    if (img.classList.contains('img--fluid')) {
      const wrapper = img.parentNode;
      wrapper.setAttribute('style', `max-width:${img.naturalWidth}px;`);
    } else if (img.classList.contains('img--inline')) {
      img.setAttribute('style', `max-width:${img.naturalWidth}px;`);
    } else if (img.className.length < 1) {
      const a = document.createElement('a');
      a.href = img.src;
      a.setAttribute('target', '_blank');
      img.parentElement.insertBefore(a, img);
      a.appendChild(img);
    }
  });
}

handleImages();
