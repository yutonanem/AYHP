// スクロール時に要素を浮き出るように表示する。
(() => {
  const targets = document.querySelectorAll(".reveal-on-scroll");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  targets.forEach((el) => observer.observe(el));
})();

// 端末モック内の画像を3秒ごとに切り替える。
(() => {
  const rotators = document.querySelectorAll(".device-rotator");
  if (!rotators.length) return;

  rotators.forEach((img) => {
    const frames = (img.dataset.frames || "")
      .split(",")
      .map((src) => src.trim())
      .filter(Boolean);
    if (frames.length < 2) return;

    let index = 0;
    window.setInterval(() => {
      index = (index + 1) % frames.length;
      img.src = frames[index];
    }, 3000);
  });
})();
