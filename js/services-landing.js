document.addEventListener("DOMContentLoaded", () => {
  const gridFilters = document.querySelector('.grid-filters');

  const categorySelection = gridFilters.querySelector('.grid-filters__category');

  // Categories selection
  const grid = document.querySelector('.grid-toc');
  let category = 'view-all';

  function toggleCategory(e) {
    category = e.target.selectedOptions[0].value
    updateCategory();
  }

  function updateCategory() {
    const categorySections = grid.querySelectorAll('.grid-toc__service-category');
    const categoryClass = `grid-toc__service-category__${category}`
    Array.prototype.forEach.call(categorySections, el => {
      if(el.classList.contains(categoryClass) || category === 'view-all') {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });
    checkSectionsEmpty();
  }

  categorySelection.addEventListener('change', toggleCategory);

  // Enterprise and beta checkboxes
  const enterpriseCheckbox = gridFilters.querySelector('.grid-filters__enterprise');
  enterpriseCheckbox.checked = true;
  const betaCheckbox = gridFilters.querySelector('.grid-filters__beta');
  let showEnterprise = true;
  let showBeta = false;

  function checkSectionsEmpty() {
    const categorySections = grid.querySelectorAll('.grid-toc__service-category');
    Array.prototype.forEach.call(categorySections, section => {
      let allHidden = true;
      Array.prototype.forEach.call(section.querySelectorAll('.grid-toc__item'), el => {
        if(!el.classList.contains('hidden')) {
          allHidden = false;
        }
      });
      if (allHidden) {
        section.classList.add('empty');
      } else {
        section.classList.remove('empty');
      }
    });
  }

  function toggleLabel(e) {
    const type = e.target.name;
    if(type == 'beta') {
      showBeta = e.target.checked;
    }

    if(type == 'enterprise') {
      showEnterprise = e.target.checked;
    }
    updateLabels();
  }

  function updateLabels(e) {
    const services = grid.querySelectorAll('.grid-toc__item');

    Array.prototype.forEach.call(services, el => {
      const isBeta = el.classList.contains(`grid-toc__beta`);
      const isEnterprise = el.classList.contains(`grid-toc__enterprise`);

      if (isBeta && isEnterprise) {
        if(showEnterprise && showBeta) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      } else if (isEnterprise) {
        if (showEnterprise) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      } else if (isBeta) {
        if (showBeta) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      }
    });
    checkSectionsEmpty();
  }

  enterpriseCheckbox.addEventListener('click', toggleLabel);
  betaCheckbox.addEventListener('click', toggleLabel);

  checkSectionsEmpty();
  updateCategory();
  updateLabels();
  categorySelection.selectedIndex = 0;
  enterpriseCheckbox.checked = true;
  betaCheckbox.checked = false;
});
