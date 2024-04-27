window.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".menu"),
    menuItem = document.querySelectorAll(".menu__item"),
    hamburger = document.querySelector(".hamburger");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("hamburger-active");
    menu.classList.toggle("menu-active");
  });

  menuItem.forEach((item) => {
    item.addEventListener("click", () => {
      hamburger.classList.toggle("hamburger-active");
      menu.classList.toggle("menu-active");
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    const isClickInsideMenu = menu.contains(target);
    const isClickInsideHamburger = hamburger.contains(target);

    if (!isClickInsideMenu && !isClickInsideHamburger) {
      menu.classList.remove("menu-active");
      hamburger.classList.remove("hamburger-active");
    }
  });
});

$(function () {
  var screenWidth = $(window).width();
  var starWidth = "29px";
  if (screenWidth <= 575) {
    starWidth = "19px";
  }
  $(".rate-star").rateYo({
    rating: 5,
    fullStar: true,
    readOnly: true,
    starWidth: starWidth,
    spacing: "7px",
  });
});


new Swiper('.swiper',{
  pagination:{
      el: '.swiper-pagination',
      clickable: true,
  },
  slidesPerView: 4,
  spaceBetween:17,
  slidesPerGroup: 4,
  loop: true,
  loopedSlides: 3,
  centeredSlides: false, 
  breakpoints: {
    320 : {
      slidesPerView: 1.3,
      slidesPerGroup: 1,
      centeredSlides: false, 
    },
    480 : {
      slidesPerView: 2,
      slidesPerGroup: 2,
      centeredSlides: false, 
    },
    550 : {
      slidesPerView: 2.3,
      slidesPerGroup: 2,
      centeredSlides: false, 
    },
    735 : {
      slidesPerView: 3,
      slidesPerGroup: 3,
      centeredSlides: false,
    },
    950 : {
      slidesPerView: 3,
      slidesPerGroup: 3,
      centeredSlides: false,
    },
    1200 : {
      slidesPerView: 4,
      slidesPerGroup: 4,
      centeredSlides: false, 
    },
  }
});
function matchHeight(selector) {
  var elements = document.querySelectorAll(selector);

  var maxHeight = 0;
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].offsetHeight > maxHeight) {
      maxHeight = elements[i].offsetHeight;
    }
  }

  for (var i = 0; i < elements.length; i++) {
    elements[i].style.height = maxHeight + 'px';
  }
}

matchHeight('.slider__info-name');
