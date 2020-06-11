import { TweenMax } from "gsap";

const radius = 20;

const transform = (r) => ({
  transform: `rotate(${r}) translate(${radius},0) rotate(${-r})`,
});

const staggerFromTo = (selector, duration) => {
  TweenMax.staggerFromTo(
    selector,
    duration,
    { cycle: { attr: (i) => transform(i * 90) } },
    {
      cycle: { attr: (i) => transform(i * 90 - 360) },
      ease: "linear",
      repeat: -1,
    }
  );
};

document.addEventListener("DOMContentLoaded", (event) => {
  staggerFromTo(".icon1", 14);
  staggerFromTo(".icon2", 10);
  staggerFromTo(".icon3", 15);

  let activeFilter = null;
  $("[data-spherefilter]").on("click", (e) => {
    const f = e.currentTarget.dataset.spherefilter;
    activeFilter = activeFilter === f ? null : f;
    $("[data-spherefilter]").addClass("disabling");
    $("[data-sphere]").addClass("disabling");
    $(
      activeFilter
        ? `[data-spherefilter=${activeFilter}],[data-sphere=${activeFilter}]`
        : "[data-spherefilter],[data-sphere]"
    ).removeClass("disabling");
  });
});
