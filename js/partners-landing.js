document.addEventListener("DOMContentLoaded", () => {
    const gridFilters = document.querySelector('.grid-filters');

    const categorySelection = gridFilters.querySelector('.grid-filters__category');

    // Categories selection
    const grid = document.querySelector('.grid-toc');
    let selectedCategory = 'view-all';

    function updateCat(selectedCategory) {
        const categorySections = grid.querySelectorAll('.grid-toc__service-category');
        const categoryClass = `grid-toc__service-category__${selectedCategory}`
        Array.prototype.forEach.call(categorySections, el => {
            if (el.classList.contains(categoryClass) || selectedCategory === 'view-all') {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });
        checkSectionsEmpty();
    }

    // Enterprise and beta and community checkboxes
    const enterpriseCheckbox = gridFilters.querySelector('.grid-filters__enterprise');
    enterpriseCheckbox.checked = true;
    const betaCheckbox = gridFilters.querySelector('.grid-filters__beta');
    betaCheckbox.checked = true;
    const communityCheckbox = gridFilters.querySelector('.grid-filters__community');
    communityCheckbox.checked = true;
    let showEnterprise = true;
    let showBeta = true;
    let showCommunity = true;

    function checkSectionsEmpty() {
        const categorySections = grid.querySelectorAll('.grid-toc__service-category');
        Array.prototype.forEach.call(categorySections, section => {
            let allHidden = true;
            Array.prototype.forEach.call(section.querySelectorAll('.grid-toc__service-item'), el => {
                if (!el.classList.contains('hidden')) {
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
        console.log(e.target);
        const type = e.target.name;
        if (type == 'beta') {
            showBeta = e.target.checked;
        }
        if (type == 'enterprise') {
            showEnterprise = e.target.checked;
        }
        if (type == 'community') {
            showCommunity = e.target.checked;
        }
        updateLabels();
    }

    function updateLabels() {
        const services = grid.querySelectorAll('.grid-toc__service-item');

        Array.prototype.forEach.call(services, el => {
            const isBeta = el.classList.contains(`grid-toc__beta`);
            const isEnterprise = el.classList.contains(`grid-toc__enterprise`);
            const isCommunity = el.classList.contains('grid-toc__community');

            if (isBeta && isEnterprise && isCommunity) {
                if (showEnterprise && showBeta && showCommunity) {
                    el.classList.remove('hidden');
                } else {
                    el.classList.add('hidden');
                }
            } else if (isCommunity && isEnterprise) {
                if (showCommunity && showEnterprise) {
                    el.classList.remove('hidden');
                } else {
                    el.classList.add('hidden');
                }
            } else if (isCommunity && isBeta) {
                if (showCommunity && showBeta) {
                    el.classList.remove('hidden');
                } else {
                    el.classList.add('hidden');
                }
            } else if (isBeta && isEnterprise) {
                if (showEnterprise && showBeta) {
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
            } else if (isCommunity) {
                if (showCommunity) {
                    el.classList.remove('hidden');
                } else {
                    el.classList.add('hidden');
                }
            }
        });
        checkSectionsEmpty();
    }

    /* Begin selectbox override code */
    var customSelect, i, j, selElmnt, selBox, selDropdownDiv, optionsDiv;
    var selBoxText, selBoxArrow;
    /* Look for any elements with the class "custom-select": */
    customSelect = document.getElementsByClassName("custom-select");
    for (i = 0; i < customSelect.length; i++) {
        selElmnt = customSelect[i].getElementsByTagName("select")[0];
        /* For each element, create a new DIV that will act as the selected item: */
        selBox = document.createElement("DIV");
        selBox.setAttribute("class", "select-selected");

        // selBox.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        selBoxText = document.createElement("DIV");
        selBoxText.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;

        selBoxArrow = document.createElement("DIV");
        selBoxArrow.setAttribute("width", "30px");
        selBoxArrow.setAttribute("height", "30px");
        selBoxArrow.setAttribute("class", "select-arrow");

        selBox.appendChild(selBoxText);
        selBox.appendChild(selBoxArrow);
        //console.log(selBox);
        customSelect[i].appendChild(selBox);
        /* For each element, create a new DIV that will contain the option list: */
        selDropdownDiv = document.createElement("DIV");
        selDropdownDiv.setAttribute("class", "select-items select-hide");
        for (j = 1; j < selElmnt.length; j++) {
            /* For each option in the original select element,
            create a new DIV that will act as an option item: */
            optionsDiv = document.createElement("DIV");
            optionsDiv.innerHTML = selElmnt.options[j].innerHTML;
            const optionVal = selElmnt.options[j].value;
            // console.log(optionVal);
            optionsDiv.setAttribute("value", optionVal);
            optionsDiv.addEventListener("click", function(e) {
                /* When an item is clicked, update the original select box,
                and the selected item: */
                var y, i, k, selEmt, selB;
                selEmt = this.parentNode.parentNode.getElementsByTagName("select")[0];
                selB = this.parentNode.previousSibling;
                for (i = 0; i < selEmt.length; i++) {
                    if (selEmt.options[i].innerHTML == this.innerHTML) {
                        selEmt.selectedIndex = i;
                        selB.firstChild.innerHTML = this.innerHTML;
                        selectedCategory = selElmnt.options[i].value;
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        for (k = 0; k < y.length; k++) {
                            /* this is why we can never toggle classes :/  */
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        break;
                    }
                }
                selB.click();
                // console.log(selB.value);
                updateCat(selectedCategory);
            });
            selDropdownDiv.appendChild(optionsDiv);
        }
        customSelect[i].appendChild(selDropdownDiv);
        selBox.addEventListener("click", function(e) {
            /* When the select box is clicked, close any other select boxes,
            and open/close the current select box: */
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    }

    function closeAllSelect(elmnt) {
        /* A function that will close all select boxes in the document,
        except the current select box: */
        var x, y, i, arrNo = [];
        x = document.getElementsByClassName("select-items");
        y = document.getElementsByClassName("select-selected");
        for (i = 0; i < y.length; i++) {
            if (elmnt == y[i]) {
                arrNo.push(i)
            } else {
                y[i].classList.remove("select-arrow-active");
            }
        }
        for (i = 0; i < x.length; i++) {
            if (arrNo.indexOf(i)) {
                x[i].classList.add("select-hide");
            }
        }
    }

    /* If the user clicks anywhere outside the select box,
    then close all select boxes: */
    document.addEventListener("click", closeAllSelect);

    enterpriseCheckbox.addEventListener('click', toggleLabel);
    betaCheckbox.addEventListener('click', toggleLabel);
    communityCheckbox.addEventListener('click', toggleLabel);

    checkSectionsEmpty();
    updateLabels();
    categorySelection.selectedIndex = 0;
});