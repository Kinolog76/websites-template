"use strict";

const faqInner = document.querySelector('._faq-inner');
const faq = document.querySelector('.faq');

if (faqInner && faq) {
    faq.appendChild(faqInner);
}

document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector("._lang-btn");
  const langSelector = document.querySelector("._lang-menu");
  if (menuButton && langSelector) {
    menuButton.addEventListener("click", function () {
      langSelector.classList.toggle("lang-open");
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector(".mobile-menu__countrySelector");
  const langSelector = document.querySelector(".mobmenu-language");

  if (menuButton && langSelector) {
    menuButton.addEventListener("click", function () {
      langSelector.classList.toggle("lang-open");
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const scrollToTop = document.querySelector(".scroll-to-top");
  if (scrollToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 400) {
        scrollToTop.classList.add("active");
      } else {
        scrollToTop.classList.remove("active");
      }
    });
    scrollToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0 });
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  let faqTitles = document.querySelectorAll(".faq__title");
  faqTitles.forEach(function (title) {
    title.addEventListener("click", function () {
      let body = this.nextElementSibling;
      if (body.style.height === "0px" || body.style.height === "") {
        body.style.height = body.scrollHeight + "px";
        this.classList.add("active");
      } else {
        body.style.height = "0px";
        this.classList.remove("active");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const timers = document.querySelectorAll(".js-timer");

  function initializeTimer(timer) {
    let startTime = localStorage.getItem("startTime");
    const durationDays = 3;
    const mobileRegisterTitle = timer.getAttribute("data-mobile-register-title");

    if (!startTime) {
      startTime = new Date().getTime();
      localStorage.setItem("startTime", startTime);
    }
    const endTime = parseInt(startTime, 10) + durationDays * 24 * 60 * 60 * 1000;

    function updateTimer() {
      const currentTime = new Date().getTime();
      let timeLeft = endTime - currentTime;

      if (timeLeft < 0) {
        localStorage.removeItem("startTime");
        timer.innerHTML = mobileRegisterTitle;
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      timer.innerHTML = `${days}d<span>${timer.getAttribute(
        "data-days-text",
      )}</span> ${hours}:${minutes}:${seconds}`;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  timers.forEach(initializeTimer);
});

document.addEventListener("DOMContentLoaded", function () {
  const mainNavUrl = window.location.href;
  const mainNavLinks = document.querySelectorAll(".navigation__link");

  mainNavLinks.forEach((link) => {
    link.classList.remove("navigation__link--active");
    if (
      mainNavUrl === link.href ||
      mainNavUrl.startsWith(link.href + "/") ||
      mainNavUrl === link.href + "/"
    ) {
      link.classList.add("navigation__link--active");
    }
  });
});
