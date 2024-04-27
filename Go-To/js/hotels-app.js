(() => {
    "use strict";
    const modules_flsModules = {};
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
    let isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
        }
    };
    function addTouchClass() {
        if (isMobile.any()) document.documentElement.classList.add("touch");
    }
    function fullVHfix() {
        const fullScreens = document.querySelectorAll("[data-fullscreen]");
        if (fullScreens.length && isMobile.any()) {
            window.addEventListener("resize", fixHeight);
            function fixHeight() {
                let vh = window.innerHeight * .01;
                document.documentElement.style.setProperty("--vh", `${vh}px`);
            }
            fixHeight();
        }
    }
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: false,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Прокинувся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if (this._dataValue !== "error") {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Йой, не заповнено атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && e.which == 9 && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Відкрив попап`);
                } else this.popupLogging(`Йой, такого попапу немає. Перевірте коректність введення. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрив попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute) ? buttons.getAttribute(this.options.youtubeAttribute) : null;
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && focusedIndex === 0) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if (place === "first") {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if (this.type === "min") arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return 1;
                        if (a.place === "last" || b.place === "first") return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    jQuery((function() {
        jQuery('input[name="arrival"]').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            minYear: 1901,
            maxYear: parseInt(moment().format("YYYY"), 10),
            startDate: moment(),
            locale: {
                format: "DD MMMM",
                daysOfWeek: [ "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ],
                monthNames: [ "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень" ]
            }
        });
    }));
    jQuery((function() {
        jQuery('input[name="departure"]').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            minYear: 1901,
            maxYear: parseInt(moment().format("YYYY"), 10),
            startDate: moment(),
            locale: {
                format: "DD MMMM",
                daysOfWeek: [ "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ],
                monthNames: [ "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень" ]
            }
        });
    }));
    jQuery(document).ready((function() {
        jQuery(".owl-carousel").owlCarousel({
            dots: true,
            lazyLoad: true,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 1
                },
                1e3: {
                    items: 1
                }
            }
        });
    }));
    const listButton = document.querySelector(".sort-items__list");
    const tileButton = document.querySelector(".sort-items__tile");
    const cardsWrapper = document.querySelector(".cards__wrapper");
    listButton.addEventListener("click", (() => {
        cardsWrapper.style.flexDirection = "column";
        listButton.classList.add("sort-active");
        tileButton.classList.remove("sort-active");
    }));
    tileButton.addEventListener("click", (() => {
        cardsWrapper.style.flexDirection = "row";
        tileButton.classList.add("sort-active");
        listButton.classList.remove("sort-active");
    }));
    function checkWindowSize() {
        if (window.innerWidth < 767) {
            tileButton.classList.add("sort-active");
            listButton.classList.remove("sort-active");
            cardsWrapper.style.flexDirection = "row";
        }
    }
    checkWindowSize();
    window.addEventListener("resize", checkWindowSize);
    const cardInners = document.querySelectorAll(".card__inner");
    function updateCardInnersClass() {
        const isSortActive = listButton.classList.contains("sort-active");
        cardInners.forEach((cardInner => {
            if (isSortActive) cardInner.classList.add("_row"); else cardInner.classList.remove("_row");
        }));
    }
    listButton.addEventListener("click", (() => {
        updateCardInnersClass();
    }));
    updateCardInnersClass();
    const listObserver = new MutationObserver(updateCardInnersClass);
    listObserver.observe(listButton, {
        attributes: true
    });
    document.addEventListener("DOMContentLoaded", (function() {
        let select = document.querySelector(".custom-select");
        let selectedOption = select.querySelector(".select-selected");
        let optionsContainer = select.querySelector(".select-options");
        let options = select.querySelectorAll(".select-option");
        selectedOption.addEventListener("click", (function() {
            if (optionsContainer.style.display === "none") {
                optionsContainer.style.display = "block";
                selectedOption.classList.add("open");
            } else {
                optionsContainer.style.display = "none";
                selectedOption.classList.remove("open");
            }
        }));
        options.forEach((function(option) {
            option.addEventListener("click", (function() {
                let value = option.dataset.value;
                selectedOption.textContent = option.textContent;
                optionsContainer.style.display = "none";
                selectedOption.classList.remove("open");
                console.log("Выбрано значение:", value);
            }));
        }));
        document.addEventListener("click", (function(event) {
            let target = event.target;
            if (!select.contains(target)) {
                optionsContainer.style.display = "none";
                selectedOption.classList.remove("open");
            }
        }));
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        let backButton = document.querySelector(".nav-pages__back");
        let backEnabledImage = backButton.querySelector(".back_anabled");
        let backDisabledImage = backButton.querySelector(".back_disable");
        let backHasLastClass = backButton.classList.contains("_last");
        if (backHasLastClass) backEnabledImage.style.display = "none"; else backDisabledImage.style.display = "none";
        let nextButton = document.querySelector(".nav-pages__next");
        let nextEnabledImage = nextButton.querySelector(".next_anabled");
        let nextDisabledImage = nextButton.querySelector(".next_disable");
        let nextHasLastClass = nextButton.classList.contains("_last");
        if (nextHasLastClass) nextEnabledImage.style.display = "none"; else nextDisabledImage.style.display = "none";
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        const guestsWrapper = document.getElementById("guestsWrapper");
        const counterWrapper = document.getElementById("counterWrapper");
        const countAdultInput = document.getElementById("countAdult");
        const incrementAdultButton = document.getElementById("incrementAdult");
        const decrementAdultButton = document.getElementById("decrementAdult");
        const guestsAdult = document.querySelector(".guests-adult");
        const svgCircleAdult = document.querySelector(".counter__adult circle");
        const countChildInput = document.getElementById("countChild");
        const incrementChildButton = document.getElementById("incrementChild");
        const decrementChildButton = document.getElementById("decrementChild");
        const guestsChild = document.querySelector(".guests-child");
        const svgCircleChild = document.querySelector(".counter__child circle");
        const closeButton = document.getElementById("counterCloseButton");
        let countAdult = parseInt(countAdultInput.value) || 1;
        let countChild = 0;
        guestsWrapper.addEventListener("click", (function(event) {
            event.stopPropagation();
            counterWrapper.style.display = "block";
        }));
        incrementAdultButton.addEventListener("click", (function(event) {
            event.preventDefault();
            countAdult++;
            updateAdultCounter();
        }));
        decrementAdultButton.addEventListener("click", (function(event) {
            event.preventDefault();
            if (countAdult > 0) {
                countAdult--;
                updateAdultCounter();
            }
        }));
        incrementChildButton.addEventListener("click", (function(event) {
            event.preventDefault();
            countChild++;
            updateChildCounter();
        }));
        decrementChildButton.addEventListener("click", (function(event) {
            event.preventDefault();
            if (countChild > 0) {
                countChild--;
                updateChildCounter();
            }
        }));
        closeButton.addEventListener("click", (function(event) {
            event.preventDefault();
            closeCounter();
        }));
        function updateAdultCounter() {
            countAdultInput.value = countAdult;
            guestsAdult.textContent = countAdult === 1 ? `${countAdult} Дорослий` : `${countAdult} Дорослих`;
            decrementAdultButton.disabled = countAdult === 1;
            if (countAdult === 1) svgCircleAdult.setAttribute("fill", "#AFAFAF"); else svgCircleAdult.setAttribute("fill", "#DD6A24");
        }
        function updateChildCounter() {
            countChildInput.value = countChild;
            if (countChild === 0) guestsChild.textContent = "Без дітей"; else if (countChild === 1) guestsChild.textContent = "1 Дитина"; else if (countChild > 1 && countChild < 5) guestsChild.textContent = `jQuery{countChild} Дитини`; else guestsChild.textContent = `jQuery{countChild} Дітей`;
            decrementChildButton.disabled = countChild === 0;
            if (countChild === 0) svgCircleChild.setAttribute("fill", "#AFAFAF"); else svgCircleChild.setAttribute("fill", "#DD6A24");
        }
        function hideCounter(event) {
            if (!counterWrapper.contains(event.target) && event.target !== guestsWrapper) counterWrapper.style.display = "none";
        }
        function closeCounter() {
            counterWrapper.style.display = "none";
        }
        document.addEventListener("click", hideCounter);
        updateAdultCounter();
        updateChildCounter();
    }));
    const addBtn = document.querySelector(".rent-filter__add_btn");
    const amenitiesBlock = document.querySelector(".show-more__wrapper");
    const priceRangeBlock = document.querySelector(".rent-filter__price-range");
    const handleAddBtnClick = event => {
        event.preventDefault();
        amenitiesBlock.classList.toggle("_show");
        priceRangeBlock.classList.toggle("_show");
        addBtn.classList.toggle("add__open");
    };
    addBtn.addEventListener("click", handleAddBtnClick);
    const filterBtn = document.querySelector(".filter-btn_tablet");
    const mainFilter = document.querySelector(".main__filter");
    const mainContainer = document.querySelector(".main__container");
    const contentWrapper = document.querySelector(".content__wrapper");
    const filterBtnBack = document.querySelector(".filter__btn-back");
    const mainItems = document.querySelector(".main__items");
    const foundHotels = document.querySelector(".found-hotels");
    const breadcrumbs = document.querySelector(".breadcrumbs");
    filterBtn.addEventListener("click", (function() {
        mainFilter.classList.toggle("_filter-open");
        contentWrapper.classList.toggle("_padding-0");
        mainContainer.classList.toggle("_padding-0");
        mainItems.classList.toggle("_disp-none");
        foundHotels.classList.toggle("_disp-none");
        breadcrumbs.classList.toggle("_disp-none");
    }));
    filterBtnBack.addEventListener("click", (function() {
        mainFilter.classList.remove("_filter-open");
        contentWrapper.classList.remove("_padding-0");
        mainContainer.classList.remove("_padding-0");
        mainItems.classList.remove("_disp-none");
        foundHotels.classList.remove("_disp-none");
        breadcrumbs.classList.remove("_disp-none");
    }));
    function toggleDisplay() {
        if (window.innerWidth > 768) {
            mainFilter.classList.remove("_filter-open");
            contentWrapper.classList.remove("_padding-0");
            mainContainer.classList.remove("_padding-0");
            mainItems.classList.remove("_disp-none");
            foundHotels.classList.remove("_disp-none");
            breadcrumbs.classList.remove("_disp-none");
        }
    }
    toggleDisplay();
    window.addEventListener("resize", toggleDisplay);
    jQuery(document).ready((function() {
        if (jQuery(".main__container").hasClass("_padding-0")) jQuery(".main__items").addClass("_disp-none"); else jQuery(".main__items").removeClass("_disp-none");
    }));
    let news = 4;
    let hidenews = "Приховати";
    let shownews = "Показати більше";
    jQuery(".show-more_text").html(shownews);
    jQuery(".check-item__show:not(:lt(" + news + "))").hide();
    if (jQuery(".check-item__show").length > 4) jQuery(".show-more_text").show(); else jQuery(".show-more_text").hide();
    jQuery(".show-more_text").click((function(e) {
        e.preventDefault();
        if (jQuery(".check-item__show:eq(" + news + ")").is(":hidden")) {
            jQuery(".check-item__show:hidden").show();
            jQuery(".show-more_text").html(hidenews);
        } else {
            jQuery(".check-item__show:not(:lt(" + news + "))").hide();
            jQuery(".show-more_text").html(shownews);
        }
    }));
    jQuery(".show-more_text-bot").html(shownews);
    jQuery(".check-item__show-bot:not(:lt(" + news + "))").hide();
    if (jQuery(".check-item__show-bot").length > 4) jQuery(".show-more_text-bot").show(); else jQuery(".show-more_text-bot").hide();
    jQuery(".show-more_text-bot").click((function(e) {
        e.preventDefault();
        if (jQuery(".check-item__show-bot:eq(" + news + ")").is(":hidden")) {
            jQuery(".check-item__show-bot:hidden").show();
            jQuery(".show-more_text-bot").html(hidenews);
        } else {
            jQuery(".check-item__show-bot:not(:lt(" + news + "))").hide();
            jQuery(".show-more_text-bot").html(shownews);
        }
    }));
    jQuery(document).ready((function() {
        jQuery(".filter-bot__title").each((function() {
            let isOpen = jQuery(this).data("open");
            let wrapper = jQuery(this).next(".price-range__wrapper");
            let arrow = jQuery(this).find(".filter-arrow");
            if (isOpen) {
                wrapper.show();
                arrow.addClass("opened").css("transform", "rotate(0deg)");
            }
        }));
        jQuery(".filter-bot__title").click((function() {
            let wrapper = jQuery(this).next(".price-range__wrapper");
            let arrow = jQuery(this).find(".filter-arrow");
            if (wrapper.is(":hidden")) {
                wrapper.slideDown();
                arrow.addClass("opened").css("transform", "rotate(0deg)");
            } else {
                wrapper.slideUp();
                arrow.removeClass("opened").css("transform", "rotate(180deg)");
            }
        }));
    }));
    jQuery(document).ready((function() {
        jQuery(".filter-bot__title").each((function() {
            let isOpen = jQuery(this).data("open");
            let wrapper = jQuery(this).next(".filter-content__wrapper");
            let arrow = jQuery(this).find(".filter-arrow");
            if (isOpen) {
                wrapper.show();
                arrow.addClass("opened").css("transform", "rotate(0deg)");
            } else {
                wrapper.hide();
                arrow.addClass("opened").css("transform", "rotate(180deg)");
            }
        }));
        jQuery(".filter-bot__title").click((function() {
            let wrapper = jQuery(this).next(".filter-content__wrapper");
            let arrow = jQuery(this).find(".filter-arrow");
            if (wrapper.is(":hidden")) {
                wrapper.slideDown();
                arrow.addClass("opened").css("transform", "rotate(0deg)");
            } else {
                wrapper.slideUp();
                arrow.removeClass("opened").css("transform", "rotate(180deg)");
            }
        }));
    }));
    jQuery(document).ready((function() {
        jQuery(".popular-question__question").click((function() {
            let question = jQuery(this);
            let text = question.next(".popular-question__text");
            let img = question.find(".popular-question__img");
            text.slideToggle();
            img.toggleClass("_rotate");
            question.toggleClass("question-open");
        }));
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        let breadcrumbs = document.querySelector(".breadcrumbs");
        let isDragging = false;
        let startX;
        let scrollLeft;
        breadcrumbs.addEventListener("mousedown", (function(e) {
            isDragging = true;
            startX = e.pageX - breadcrumbs.offsetLeft;
            scrollLeft = breadcrumbs.scrollLeft;
        }));
        breadcrumbs.addEventListener("mouseleave", (function() {
            isDragging = false;
        }));
        breadcrumbs.addEventListener("mouseup", (function() {
            isDragging = false;
        }));
        breadcrumbs.addEventListener("mousemove", (function(e) {
            if (!isDragging) return;
            e.preventDefault();
            var x = e.pageX - breadcrumbs.offsetLeft;
            var walk = (x - startX) * 1.5;
            breadcrumbs.scrollLeft = scrollLeft - walk;
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
    jQuery(".select").each((function() {
        const _this = jQuery(this), selectOption = _this.find("option"), selectOptionLength = selectOption.length, duration = (selectOption.filter(":selected"), 
        450);
        _this.hide();
        _this.wrap('<div class="select"></div>');
        jQuery("<div>", {
            class: "new-select",
            text: _this.children("option:disabled").text()
        }).insertAfter(_this);
        const selectHead = _this.next(".new-select");
        jQuery("<div>", {
            class: "new-select__list"
        }).insertAfter(selectHead);
        const selectList = selectHead.next(".new-select__list");
        for (let i = 1; i < selectOptionLength; i++) jQuery("<div>", {
            class: "new-select__item",
            html: jQuery("<span>", {
                text: selectOption.eq(i).text()
            })
        }).attr("data-value", selectOption.eq(i).val()).appendTo(selectList);
        const selectItem = selectList.find(".new-select__item");
        selectList.slideUp(0);
        selectHead.on("click", (function() {
            if (!jQuery(this).hasClass("on")) {
                jQuery(this).addClass("on");
                selectList.slideDown(duration);
                selectItem.on("click", (function() {
                    let chooseItem = jQuery(this).data("value");
                    jQuery("select").val(chooseItem).attr("selected", "selected");
                    selectHead.text(jQuery(this).find("span").text());
                    selectList.slideUp(duration);
                    selectHead.removeClass("on");
                }));
            } else {
                jQuery(this).removeClass("on");
                selectList.slideUp(duration);
            }
        }));
    }));
    // function checkElementsAndAddEvent() {
    //     const selectItems = document.querySelectorAll(".new-select__item");
    //     if (selectItems.length === 0) {
    //         console.warn("На странице нет элементов с классом 'new-select__item'.");
    //         return;
    //     }
    //     selectItems.forEach((item => {
    //         item.addEventListener("click", (() => {
    //             const link = item.getAttribute("data-value");
    //             window.location.href = link;
    //         }));
    //     }));
    // }
    window.addEventListener("load", checkElementsAndAddEvent);
    window["FLS"] = true;
    isWebp();
    addTouchClass();
    fullVHfix();
})();