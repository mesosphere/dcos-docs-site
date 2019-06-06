window.addEventListener('load', () => {
  if (window.addthis) {
    window.addthis_config = {
      ui_disable: true,
    };
    addthis.init();
  }
});
