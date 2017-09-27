function wrapCodeBlocks() {
  $('pre').each(() => {
    $(this).wrapAll('<div class="code-container" />');
  });
}

wrapCodeBlocks();
