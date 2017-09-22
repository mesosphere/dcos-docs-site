let switches = document.querySelectorAll('.switch');
switches = [...switches];

switches.map((s) => {

  /**
   * Render
   *
   */

  let cases = s.querySelectorAll('.switch__case');
  cases = [...cases];
  let filterContainer = s.querySelector('.switch__filters');
  filterContainer.innerHTML = cases.map((c, i) => {
    let activeClass = (i == 0) ? 'switch__filter--active' : '';
    return `
      <div class="switch__filter ${activeClass}">${c.dataset.filter}</div>
      <div class="switch__filter-spacer"></div>
    `;
  }).join('');

  /**
   * Functionality
   *
   */

  let filters = s.querySelectorAll('.switch__filter');
  filters = [...filters];
  filters.map((f) => {
    f.addEventListener('click', (event) => { onFilterClick(event, f) });
  });
  let currentFilter = filters[0];
  function onFilterClick(event, element) {
    let filter = element.innerHTML;
    let cases = element.parentElement.parentElement.querySelectorAll('.switch__case');
    cases = [...cases];
    cases.map((c) => {
      if(c.dataset.filter === filter) {
        c.classList.add('switch__case--show');
        c.classList.remove('switch__case--hide');
      }
      else {
        c.classList.remove('switch__case--show');
        c.classList.add('switch__case--hide');
      }
    });
    currentFilter.classList.remove('switch__filter--active');
    element.classList.add('switch__filter--active');
    currentFilter = element;
  }

});


