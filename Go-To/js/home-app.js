(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    jQuery(document).ready((function() {
        jQuery(".owl-carousel-main").owlCarousel({
            loop: true,
            margin: 10,
            responsiveClass: true,
            responsive: {
                320: {
                    items: 4,
                    nav: true,
                    loop: false,
                    navText: [ "<img class='_600-dn' src='home-img/ico/mi_slider-next.svg' alt='Prev'> <img class='_600-db' src='home-img/ico/slider_arrow-next.svg' alt='Prev'>", "<img class='_600-dn' src='home-img/ico/mi_slider-next.svg' alt='Prev'> <img class='_600-db' src='home-img/ico/slider_arrow-next.svg' alt='Prev'>" ]
                },
                480: {
                    items: 4,
                    nav: true,
                    loop: false,
                    navText: [ "<img class='_600-dn' src='home-img/ico/mi_slider-next.svg' alt='Prev'> <img class='_600-db' src='home-img/ico/slider_arrow-next.svg' alt='Prev'>", "<img class='_600-dn' src='home-img/ico/mi_slider-next.svg' alt='Prev'> <img class='_600-db' src='home-img/ico/slider_arrow-next.svg' alt='Prev'>" ]
                },
                580: {
                    items: 5,
                    nav: true,
                    loop: false,
                    navText: [ "<img class='_600-dn' src='home-img/ico/mi_slider-next.svg' alt='Prev'> <img class='_600-db' src='home-img/ico/slider_arrow-next.svg' alt='Prev'>", "<img class='_600-dn' src='home-img/ico/mi_slider-next.svg' alt='Prev'> <img class='_600-db' src='home-img/ico/slider_arrow-next.svg' alt='Prev'>" ]
                },
                768: {
                    items: 6,
                    nav: true,
                    loop: false,
                    navText: [ "<img class='_600-dn' src='home-img/ico/mi_slider-next.svg' alt='Prev'> <img class='_600-db' src='home-img/ico/slider_arrow-next.svg' alt='Prev'>", "<img class='_600-dn' src='home-img/ico/mi_slider-next.svg' alt='Prev'> <img class='_600-db' src='home-img/ico/slider_arrow-next.svg' alt='Prev'>" ]
                },
                950: {
                    items: 8,
                    nav: true,
                    loop: false,
                    navText: [ "<img class='_600-dn' src='home-img/ico/mi_slider-next.svg' alt='Prev'> <img class='_600-db' src='home-img/ico/slider_arrow-next.svg' alt='Prev'>", "<img class='_600-dn' src='home-img/ico/mi_slider-next.svg' alt='Prev'> <img class='_600-db' src='home-img/ico/slider_arrow-next.svg' alt='Prev'>" ]
                },
                1150: {
                    items: 10,
                    nav: true,
                    loop: false,
                    navText: [ "<img class='_600-dn' src='home-img/ico/mi_slider-next.svg' alt='Prev'> <img class='_600-db' src='home-img/ico/slider_arrow-next.svg' alt='Prev'>", "<img class='_600-dn' src='home-img/ico/mi_slider-next.svg' alt='Prev'> <img class='_600-db' src='home-img/ico/slider_arrow-next.svg' alt='Prev'>" ]
                }
            }
        });
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        const questionBoxes = document.querySelectorAll(".popular-question__box");
        if (questionBoxes.length > 0) questionBoxes.forEach((function(questionBox) {
            const question = questionBox.querySelector(".popular-question__question");
            const text = questionBox.querySelector(".popular-question__text");
            const img = question.querySelector(".popular-question__arrow");
            question.addEventListener("click", (function() {
                text.style.display = text.style.display === "block" ? "none" : "block";
                img.classList.toggle("_rotate");
                question.classList.toggle("question-open");
            }));
        }));
    }));
    let cardElements = document.querySelectorAll(".card__tell");
    cardElements.forEach((function(cardElement) {
        let visibleElement = cardElement.querySelector(".card__tell_visible");
        let hiddenElement = cardElement.querySelector(".card__tell_hidden");
        visibleElement.addEventListener("click", (function() {
            visibleElement.style.display = "none";
            hiddenElement.style.display = "flex";
        }));
    }));
    const cardsWrapper = document.querySelector(".mi__cards-wrapper");
    const showMoreBtn = document.getElementById("showMoreBtn");
    const cards = cardsWrapper.querySelectorAll(".card__inner");
    const maxVisibleCards = 12;
    let visibleCards = maxVisibleCards;
    hideCards();
    showMoreBtn.addEventListener("click", showMoreCards);
    function hideCards() {
        for (let i = maxVisibleCards; i < cards.length; i++) cards[i].style.display = "none";
    }
    function showMoreCards() {
        for (let i = visibleCards; i < visibleCards + maxVisibleCards; i++) if (i < cards.length) cards[i].style.display = "block";
        visibleCards += maxVisibleCards;
        if (visibleCards >= cards.length) showMoreBtn.disabled = true;
    }
    const itemButtons = document.querySelectorAll(".item");
    itemButtons.forEach((button => {
        button.addEventListener("click", (() => {
            const target = button.getAttribute("data-target");
            itemButtons.forEach((itemButton => {
                itemButton.classList.remove("_item-active");
            }));
            button.classList.add("_item-active");
            const cardWrappers = document.querySelectorAll(".mi__cards-wrapper");
            cardWrappers.forEach((cardWrapper => {
                cardWrapper.classList.remove("_cards-active");
            }));
            const targetCardWrapper = document.querySelector(`.mi__cards-wrapper[data-target="${target}"]`);
            targetCardWrapper.classList.add("_cards-active");
        }));
    }));
    jQuery(document).ready((function() {
        jQuery(".wd__owl-carousel").owlCarousel({
            loop: true,
            margin: 10,
            responsiveClass: true,
            responsive: {
                320: {
                    items: 1,
                    nav: true,
                    loop: false,
                    navText: [ "<img class='' src='home-img/ico/slider_arrow-next.svg' alt='Prev'>", "<img class='' src='home-img/ico/slider_arrow-next.svg' alt='Prev'>" ]
                },
                450: {
                    items: 2,
                    nav: true,
                    loop: false,
                    navText: [ "<img class='' src='home-img/ico/slider_arrow-next.svg' alt='Prev'>", "<img class='' src='home-img/ico/slider_arrow-next.svg' alt='Prev'>" ]
                },
                650: {
                    items: 3,
                    nav: false,
                    loop: false,
                    navText: [ "<img class='' src='home-img/ico/slider_arrow-next.svg' alt='Prev'>", "<img class='' src='home-img/ico/slider_arrow-next.svg' alt='Prev'>" ]
                }
            }
        });
    }));
    jQuery(document).ready((function() {
        jQuery(".wd-owl__title").click((function() {
            jQuery(".wd-owl__title").removeClass("_owl__title-active");
            jQuery(this).addClass("_owl__title-active");
        }));
    }));
    jQuery(document).ready((function() {
        jQuery(".wd-owl__title").click((function() {
            jQuery(".wd-owl__title").removeClass("_owl__title-active");
            jQuery(this).addClass("_owl__title-active");
            var currentIndex = $(".wd-owl__title").index(this);
            jQuery(".wd__items-box").removeClass("_wd__items-active");
            jQuery(".wd__items-box").eq(currentIndex).addClass("_wd__items-active");
        }));
    }));
    jQuery(document).ready((function() {
        jQuery(".pop__owl-carousel").owlCarousel({
            loop: true,
            margin: 10,
            responsiveClass: true,
            responsive: {
                320: {
                    items: 1,
                    loop: true,
                    dots: true
                },
                768: {
                    items: 8,
                    loop: false
                }
            }
        });
    }));
    window["FLS"] = true;
    isWebp();
})();