/* ===================================================================
 * CUSA - Main JS (prominent layout)
 * Product modules: site-behavior.js, firebase-config.js, firebase.js
 * ------------------------------------------------------------------- */

import {
  applyMailChimpStatus,
  buildMailChimpJsonUrl,
  easeFunctions,
  getFieldValidationError,
  shouldMenuBeOpaque,
  shouldShowBackToTop,
  siteConfig,
  toggleMenuOpen,
} from "./site-behavior.js";

(function (html) {
  "use strict";

  const anime = globalThis.anime;
  const Rellax = globalThis.Rellax;
  const Masonry = globalThis.Masonry;
  const imagesLoaded = globalThis.imagesLoaded;
  const Swiper = globalThis.Swiper;
  const PhotoSwipe = globalThis.PhotoSwipe;
  const PhotoSwipeUI_Default = globalThis.PhotoSwipeUI_Default;
  const MoveTo = globalThis.MoveTo;

  const tl = anime
    .timeline({
      easing: "easeInOutCubic",
      duration: 800,
      autoplay: false,
    })
    .add({
      targets: "#loader",
      opacity: 0,
      duration: 1000,
      begin() {
        window.scrollTo(0, 0);
      },
    })
    .add({
      targets: "#preloader",
      opacity: 0,
      complete() {
        document.querySelector("#preloader").style.visibility = "hidden";
        document.querySelector("#preloader").style.display = "none";
      },
    })
    .add(
      {
        targets: [".s-header__logo", ".s-header__menu-toggle"],
        opacity: [0, 1],
      },
      "-=200",
    )
    .add(
      {
        targets: [".s-intro__pretitle", ".s-intro__title", ".s-intro__more"],
        translateY: [100, 0],
        opacity: [0, 1],
        delay: anime.stagger(200),
      },
      "-=400",
    )
    .add(
      {
        targets: [".s-intro__social", ".s-intro__scroll"],
        opacity: [0, 1],
        delay: anime.stagger(200),
      },
      "-=200",
    );

  const ssPreloader = function () {
    const preloader = document.querySelector("#preloader");
    if (!preloader) return;

    html.classList.add("ss-preload");

    window.addEventListener("load", function () {
      html.classList.remove("ss-preload");
      html.classList.add("ss-loaded");
      tl.play();
    });
  };

  const ssParallax = function () {
    new Rellax(".rellax");
  };

  const ssMenuOnScrolldown = function () {
    const menuToggle = document.querySelector(".s-header__menu-toggle");
    if (!menuToggle) return;

    window.addEventListener("scroll", function () {
      if (shouldMenuBeOpaque(window.scrollY, siteConfig.menuOpaqueAfterPx)) {
        menuToggle.classList.add("opaque");
      } else {
        menuToggle.classList.remove("opaque");
      }
    });
  };

  const ssOffCanvas = function () {
    const menuToggle = document.querySelector(".s-header__menu-toggle");
    const nav = document.querySelector(".s-header__nav");
    const closeButton = document.querySelector(".s-header__nav-close-btn");
    const siteBody = document.querySelector("body");

    if (!(menuToggle && nav && closeButton)) return;

    menuToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMenuOpen(siteBody, true);
    });

    closeButton.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMenuOpen(siteBody, false);
    });

    siteBody.addEventListener("click", function (e) {
      if (!e.target.matches(".s-header__nav, .smoothscroll")) {
        closeButton.dispatchEvent(new Event("click"));
      }
    });
  };

  const ssMasonry = function () {
    const containerBricks = document.querySelector(".bricks");
    if (!containerBricks) return;

    imagesLoaded(containerBricks, function () {
      new Masonry(containerBricks, {
        itemSelector: ".brick",
        columnWidth: ".brick",
        percentPosition: true,
        resize: true,
      });
    });
  };

  const ssAnimateOnScroll = function () {
    const blocks = document.querySelectorAll("[data-animate-block]");
    if (!blocks.length) return;

    window.addEventListener("scroll", animateOnScroll);

    function animateOnScroll() {
      const scrollY = window.pageYOffset;

      blocks.forEach(function (current) {
        const viewportHeight = window.innerHeight;
        const triggerTop =
          current.getBoundingClientRect().top +
          window.scrollY +
          viewportHeight * 0.2 -
          viewportHeight;
        const blockHeight = current.offsetHeight;
        const blockSpace = triggerTop + blockHeight;
        const inView = scrollY > triggerTop && scrollY <= blockSpace;
        const isAnimated = current.classList.contains("ss-animated");

        if (inView && !isAnimated) {
          anime({
            targets: current.querySelectorAll("[data-animate-el]"),
            opacity: [0, 1],
            translateY: [100, 0],
            delay: anime.stagger(200, { start: 200 }),
            duration: 800,
            easing: "easeInOutCubic",
            begin() {
              current.classList.add("ss-animated");
            },
          });
        }
      });
    }
  };

  const ssSwiper = function () {
    new Swiper(".clients", {
      slidesPerView: 3,
      spaceBetween: 6,
      slideClass: "clients__slide",
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        501: { slidesPerView: 4, spaceBetween: 16 },
        901: { slidesPerView: 5, spaceBetween: 32 },
        1201: { slidesPerView: 6, spaceBetween: 40 },
      },
    });

    new Swiper(".testimonial-slider", {
      slidesPerView: 1,
      effect: "slide",
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  };

  const ssPhotoswipe = function () {
    const items = [];
    const pswp = document.querySelectorAll(".pswp")[0];
    const folioItems = document.querySelectorAll(".folio-item");

    if (!(pswp && folioItems.length)) return;

    folioItems.forEach(function (folioItem) {
      const thumbLink = folioItem.querySelector(".folio-item__thumb-link");
      const title = folioItem.querySelector(".folio-item__title");
      const caption = folioItem.querySelector(".folio-item__caption");
      const titleText = "<h4>" + title.innerHTML + "</h4>";
      const captionText = caption ? caption.innerHTML : "";
      const href = thumbLink.getAttribute("href");
      const size = thumbLink.dataset.size.split("x");

      const item = {
        src: href,
        w: size[0],
        h: size[1],
      };

      if (caption) {
        item.title = titleText.trim() + captionText.trim();
      }

      items.push(item);
    });

    folioItems.forEach(function (folioItem, i) {
      const thumbLink = folioItem.querySelector(".folio-item__thumb-link");
      thumbLink.addEventListener("click", function (event) {
        event.preventDefault();
        const lightBox = new PhotoSwipe(pswp, PhotoSwipeUI_Default, items, {
          index: i,
          showHideOpacity: true,
        });
        lightBox.init();
      });
    });
  };

  const ssMailChimpForm = function () {
    const mcForm = document.querySelector("#mc-form");
    if (!mcForm) return;

    mcForm.setAttribute("novalidate", true);

    function showError(field, error) {
      const id = field.id || field.name;
      if (!id) return;
      const errorMessage = field.form.querySelector(".mc-status");
      errorMessage.classList.remove("success-message");
      errorMessage.classList.add("error-message");
      errorMessage.innerHTML = error;
    }

    window.displayMailChimpStatus = function (data) {
      applyMailChimpStatus(window.mcStatus, data);
    };

    function submitMailChimpForm(form) {
      const emailField = form.querySelector("#mce-EMAIL");
      const url = buildMailChimpJsonUrl(
        siteConfig.mailChimpURL,
        emailField.name,
        emailField.value,
      );
      if (!url) return;

      const ref = window.document.getElementsByTagName("script")[0];
      const script = window.document.createElement("script");
      script.src = url;

      window.mcStatus = form.querySelector(".mc-status");
      window.mcStatus.classList.remove("error-message", "success-message");
      window.mcStatus.innerText = "Submitting...";

      ref.parentNode.insertBefore(script, ref);
      script.onload = function () {
        this.remove();
      };
    }

    mcForm.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();
        const emailField = event.target.querySelector("#mce-EMAIL");
        const error = getFieldValidationError(emailField);
        if (error) {
          showError(emailField, error);
          emailField.focus();
          return;
        }
        submitMailChimpForm(this);
      },
      false,
    );
  };

  const ssAlertBoxes = function () {
    document.querySelectorAll(".alert-box").forEach(function (box) {
      box.addEventListener("click", function (event) {
        if (event.target.matches(".alert-box__close")) {
          event.stopPropagation();
          event.target.parentElement.classList.add("hideit");
          setTimeout(function () {
            box.style.display = "none";
          }, 500);
        }
      });
    });
  };

  const ssBackToTop = function () {
    const goTopButton = document.querySelector(".ss-go-top");
    if (!goTopButton) return;

    if (shouldShowBackToTop(window.scrollY)) {
      goTopButton.classList.add("link-is-visible");
    }

    window.addEventListener("scroll", function () {
      if (shouldShowBackToTop(window.scrollY)) {
        goTopButton.classList.add("link-is-visible");
      } else {
        goTopButton.classList.remove("link-is-visible");
      }
    });
  };

  const ssMoveTo = function () {
    const siteBody = document.querySelector("body");
    const triggers = document.querySelectorAll(".smoothscroll");
    const moveTo = new MoveTo(
      {
        tolerance: 0,
        duration: 1200,
        easing: "easeInOutCubic",
        container: window,
        callback() {
          if (siteBody.classList.contains("menu-is-open")) {
            toggleMenuOpen(siteBody, false);
          }
        },
      },
      easeFunctions,
    );

    triggers.forEach(function (trigger) {
      moveTo.registerTrigger(trigger);
    });
  };

  (function ssInit() {
    ssPreloader();
    ssParallax();
    ssMenuOnScrolldown();
    ssAnimateOnScroll();
    ssOffCanvas();
    ssMasonry();
    ssSwiper();
    ssPhotoswipe();
    ssMailChimpForm();
    ssAlertBoxes();
    ssBackToTop();
    ssMoveTo();
  })();
})(document.documentElement);
