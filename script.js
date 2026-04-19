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

// 端末モック内の画像を自然なフェードで切り替える。
(() => {
  const rotators = document.querySelectorAll(".device-rotator");
  if (!rotators.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  rotators.forEach((img) => {
    const frames = (img.dataset.frames || "")
      .split(",")
      .map((src) => src.trim())
      .filter(Boolean);
    if (frames.length < 2) return;

    // 先読みして切り替え時のチラつきを抑える。
    frames.forEach((src) => {
      const preload = new Image();
      preload.src = src;
    });

    let index = 0;
    let isAnimating = false;

    if (!reducedMotion) {
      img.style.transition = "opacity 380ms ease";
      img.style.opacity = "1";
    }

    window.setInterval(() => {
      if (isAnimating) return;
      const nextIndex = (index + 1) % frames.length;

      if (reducedMotion) {
        index = nextIndex;
        img.src = frames[index];
        return;
      }

      isAnimating = true;
      img.style.willChange = "opacity";
      img.style.opacity = "0";

      window.setTimeout(() => {
        index = nextIndex;
        img.src = frames[index];
        img.style.opacity = "1";

        window.setTimeout(() => {
          img.style.willChange = "";
          isAnimating = false;
        }, 400);
      }, 220);
    }, 3000);
  });
})();

// 背景の写真帯を「フィルムが手前→奥→手前に巡る」見え方にする。
(() => {
  const images = Array.from(document.querySelectorAll(".showcase-rotating-track img"));
  if (!images.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const updateRibbonDepth = () => {
    const centerX = window.innerWidth / 2;
    const radius = Math.max(centerX, 1);

    images.forEach((img) => {
      const rect = img.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const normalized = Math.min(1, Math.abs(x - centerX) / radius); // 0:center, 1:edge
      const edgeFactor = Math.pow(normalized, 0.72); // smooth arc
      const centerFactor = 1 - edgeFactor;

      // 半円の奥行き: 中心が奥(小)、左右が手前(大)
      const scale = 0.56 + edgeFactor * 0.46;
      const curveY = centerFactor * 34;
      const opacity = 0.56 + edgeFactor * 0.44;
      const brightness = 0.72 + edgeFactor * 0.32;
      const saturate = 0.84 + edgeFactor * 0.2;

      img.style.transform = `translateY(${-curveY.toFixed(1)}px) scale(${scale.toFixed(3)})`;
      img.style.opacity = opacity.toFixed(3);
      img.style.filter = `brightness(${brightness.toFixed(3)}) saturate(${saturate.toFixed(3)})`;
      img.style.zIndex = String(Math.round(edgeFactor * 100));
    });

    window.requestAnimationFrame(updateRibbonDepth);
  };

  window.requestAnimationFrame(updateRibbonDepth);
})();

// スマホ用ハンバーガーメニューの開閉。
(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-header .nav");
  if (!header || !toggle || !nav) return;

  const closeMenu = () => {
    header.classList.remove("is-menu-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    header.classList.add("is-menu-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", () => {
    if (header.classList.contains("is-menu-open")) {
      closeMenu();
      return;
    }
    openMenu();
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 767) closeMenu();
  });
})();
