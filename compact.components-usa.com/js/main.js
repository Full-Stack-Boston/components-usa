/*---------------------------------------------------------------------------------
/*
/* CUSA Main JS (compact layout)
/* Product modules: site-behavior.js, firebase-config.js, firebase.js
/*
-----------------------------------------------------------------------------------*/

import {
  contactErrorMessage,
  isContactSendSuccess,
  shouldHeaderBeOpaque,
  shouldUseMobileNav,
} from "./site-behavior.js";

(function ($) {
  "use strict";

  $(window).on("load", function () {
    $("#loader").fadeOut("slow", function () {
      $("#preloader").delay(300).fadeOut("slow");
    });
  });

  $(window).on("load", function () {
    $("#hero-slider").flexslider({
      namespace: "flex-",
      controlsContainer: ".hero-container",
      animation: "fade",
      controlNav: true,
      directionNav: false,
      smoothHeight: true,
      slideshowSpeed: 7000,
      animationSpeed: 600,
      randomize: false,
      before(slider) {
        $(slider)
          .find(".animated")
          .each(function () {
            $(this).removeAttr("class");
          });
      },
      start(slider) {
        $(slider)
          .find(".flex-active-slide")
          .find("h1")
          .addClass("animated fadeInDown show")
          .next()
          .addClass("animated fadeInUp show");
        $(window).trigger("resize");
      },
      after(slider) {
        $(slider)
          .find(".flex-active-slide")
          .find("h1")
          .addClass("animated fadeInDown show")
          .next()
          .addClass("animated fadeInUp show");
      },
    });

    $("#testimonial-slider").flexslider({
      namespace: "flex-",
      controlsContainer: "",
      animation: "slide",
      controlNav: true,
      directionNav: false,
      smoothHeight: true,
      slideshowSpeed: 7000,
      animationSpeed: 600,
      randomize: false,
    });
  });

  $(window).on("scroll", function () {
    const headerEl = $("header");
    const header = $("#main-header");
    const opaque = shouldHeaderBeOpaque(
      $(window).scrollTop(),
      headerEl.height(),
      $(window).outerWidth(),
    );
    header.toggleClass("opaque", opaque);
  });

  const sections = $("section");
  const navigation_links = $("#nav-wrap a");

  sections.waypoint({
    handler(direction) {
      let active_section = $("section#" + this.element.id);
      if (direction === "up") active_section = active_section.prev();
      const active_link = $(
        '#nav-wrap a[href="#' + active_section.attr("id") + '"]',
      );
      navigation_links.parent().removeClass("current");
      active_link.parent().addClass("current");
    },
    offset: "25%",
  });

  setTimeout(function () {
    $("#hero-slider h1").fitText(1, {
      minFontSize: "30px",
      maxFontSize: "49px",
    });
  }, 100);

  const menu_icon = $("<span class='menu-icon'>Menu</span>");
  const toggle_button = $("<a>", {
    id: "toggle-btn",
    html: "",
    title: "Menu",
    href: "#",
  });
  const nav_wrap = $("nav#nav-wrap");
  const nav = $("ul#nav");

  nav_wrap.find("a.mobile-btn").remove();
  toggle_button.append(menu_icon);
  nav_wrap.prepend(toggle_button);

  toggle_button.on("click", function (e) {
    e.preventDefault();
    nav.slideToggle("fast");
  });

  if (shouldUseMobileNav(toggle_button.is(":visible"))) nav.addClass("mobile");
  $(window).on("resize", function () {
    if (shouldUseMobileNav(toggle_button.is(":visible"))) nav.addClass("mobile");
    else nav.removeClass("mobile");
  });

  $("ul#nav li a").on("click", function () {
    if (nav.hasClass("mobile")) nav.fadeOut("fast");
  });

  $(".smoothscroll").on("click", function (e) {
    e.preventDefault();
    const target = this.hash;
    const $target = $(target);
    $("html, body")
      .stop()
      .animate(
        { scrollTop: $target.offset().top },
        800,
        "swing",
        function () {
          window.location.hash = target;
        },
      );
  });

  $(".item-wrap a").magnificPopup({
    type: "inline",
    fixedContentPos: false,
    removalDelay: 300,
    showCloseBtn: false,
    mainClass: "mfp-fade",
  });

  $(document).on("click", ".popup-modal-dismiss", function (e) {
    e.preventDefault();
    $.magnificPopup.close();
  });

  $("input, textarea").placeholder();

  $("#contactForm").validate({
    submitHandler(form) {
      const sLoader = $("#submit-loader");
      $.ajax({
        type: "POST",
        url: "inc/sendEmail.php",
        data: $(form).serialize(),
        beforeSend() {
          sLoader.fadeIn();
        },
        success(msg) {
          sLoader.fadeOut();
          if (isContactSendSuccess(msg)) {
            $("#message-warning").hide();
            $("#contactForm").fadeOut();
            $("#message-success").fadeIn();
          } else {
            $("#message-warning").html(contactErrorMessage(msg));
            $("#message-warning").fadeIn();
          }
        },
        error() {
          sLoader.fadeOut();
          $("#message-warning").html(contactErrorMessage(""));
          $("#message-warning").fadeIn();
        },
      });
    },
  });
})(globalThis.jQuery);
