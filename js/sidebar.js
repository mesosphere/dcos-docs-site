const sidebarDropdown = document.querySelector(".sidebar__dropdown");
const sidebarDropdownList = document.querySelector(".sidebar__dropdown ul");

if (sidebarDropdown && sidebarDropdownList) {
  document.addEventListener("click", detectClick);
  sidebarDropdown.addEventListener("click", toggleDropdown);
}

function toggleDropdown() {
  if (!sidebarDropdown.classList.contains("sidebar__dropdown--active")) {
    sidebarDropdown.classList.add("sidebar__dropdown--active");
  } else {
    sidebarDropdown.classList.remove("sidebar__dropdown--active");
  }
}

function detectClick(event) {
  if (
    sidebarDropdown.classList.contains("sidebar__dropdown--active") &&
    !sidebarDropdown.contains(event.target)
  ) {
    sidebarDropdown.classList.remove("sidebar__dropdown--active");
  }
}
