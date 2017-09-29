function wrapCodeBlocks() {
  $('pre').each((index, pre) => {
    $(pre).wrapAll('<div class="code-container" />');
  });
}

wrapCodeBlocks();
