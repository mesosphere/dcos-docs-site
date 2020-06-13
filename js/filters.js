document.addEventListener("DOMContentLoaded", (event) => {
  let activeFilter = null;
  $("[data-spherefilter]").on("click", (e) => {
    const f = e.currentTarget.dataset.spherefilter;
    activeFilter = activeFilter === f ? null : f;
    $("[data-sphere],[data-spherefilter]").addClass("disabled");
    $(
      activeFilter
        ? `[data-spherefilter=${activeFilter}],[data-sphere=${activeFilter}]`
        : "[data-spherefilter],[data-sphere]"
    ).removeClass("disabled");
  });
});
