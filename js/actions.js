window.addEventListener('load', () => {
  if (addthis) {
    window.addthis_config = {
      ui_disable: true,
    };
    addthis.init();
  }
});
