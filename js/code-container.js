function wrapCodeBlocks() {
  $('pre').each((index, elem) => {
    $(elem).wrapAll('<div class="code-container" />');
    elem.classList.add('language-*');
  });
}

wrapCodeBlocks();
