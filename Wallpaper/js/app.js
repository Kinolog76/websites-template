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
                    goHash: false
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
    /*! Magnific Popup - v1.1.0 - 2016-02-20
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2016 Dmitry Semenov; */
    !function(a) {
        "function" == typeof define && define.amd ? define([ "jquery" ], a) : a("object" == typeof exports ? require("jquery") : window.jQuery || window.Zepto);
    }((function(a) {
        var b, c, d, e, f, g, h = "Close", i = "BeforeClose", j = "AfterClose", k = "BeforeAppend", l = "MarkupParse", m = "Open", n = "Change", o = "mfp", p = "." + o, q = "mfp-ready", r = "mfp-removing", s = "mfp-prevent-close", t = function() {}, u = !!window.jQuery, v = a(window), w = function(a, c) {
            b.ev.on(o + a + p, c);
        }, x = function(b, c, d, e) {
            var f = document.createElement("div");
            return f.className = "mfp-" + b, d && (f.innerHTML = d), e ? c && c.appendChild(f) : (f = a(f), 
            c && f.appendTo(c)), f;
        }, y = function(c, d) {
            b.ev.triggerHandler(o + c, d), b.st.callbacks && (c = c.charAt(0).toLowerCase() + c.slice(1), 
            b.st.callbacks[c] && b.st.callbacks[c].apply(b, a.isArray(d) ? d : [ d ]));
        }, z = function(c) {
            return c === g && b.currTemplate.closeBtn || (b.currTemplate.closeBtn = a(b.st.closeMarkup.replace("%title%", b.st.tClose)), 
            g = c), b.currTemplate.closeBtn;
        }, A = function() {
            a.magnificPopup.instance || (b = new t, b.init(), a.magnificPopup.instance = b);
        }, B = function() {
            var a = document.createElement("p").style, b = [ "ms", "O", "Moz", "Webkit" ];
            if (void 0 !== a.transition) return !0;
            for (;b.length; ) if (b.pop() + "Transition" in a) return !0;
            return !1;
        };
        t.prototype = {
            constructor: t,
            init: function() {
                var c = navigator.appVersion;
                b.isLowIE = b.isIE8 = document.all && !document.addEventListener, b.isAndroid = /android/gi.test(c), 
                b.isIOS = /iphone|ipad|ipod/gi.test(c), b.supportsTransition = B(), b.probablyMobile = b.isAndroid || b.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), 
                d = a(document), b.popupsCache = {};
            },
            open: function(c) {
                var e;
                if (c.isObj === !1) {
                    b.items = c.items.toArray(), b.index = 0;
                    var g, h = c.items;
                    for (e = 0; e < h.length; e++) if (g = h[e], g.parsed && (g = g.el[0]), g === c.el[0]) {
                        b.index = e;
                        break;
                    }
                } else b.items = a.isArray(c.items) ? c.items : [ c.items ], b.index = c.index || 0;
                if (b.isOpen) return void b.updateItemHTML();
                b.types = [], f = "", c.mainEl && c.mainEl.length ? b.ev = c.mainEl.eq(0) : b.ev = d, 
                c.key ? (b.popupsCache[c.key] || (b.popupsCache[c.key] = {}), b.currTemplate = b.popupsCache[c.key]) : b.currTemplate = {}, 
                b.st = a.extend(!0, {}, a.magnificPopup.defaults, c), b.fixedContentPos = "auto" === b.st.fixedContentPos ? !b.probablyMobile : b.st.fixedContentPos, 
                b.st.modal && (b.st.closeOnContentClick = !1, b.st.closeOnBgClick = !1, b.st.showCloseBtn = !1, 
                b.st.enableEscapeKey = !1), b.bgOverlay || (b.bgOverlay = x("bg").on("click" + p, (function() {
                    b.close();
                })), b.wrap = x("wrap").attr("tabindex", -1).on("click" + p, (function(a) {
                    b._checkIfClose(a.target) && b.close();
                })), b.container = x("container", b.wrap)), b.contentContainer = x("content"), b.st.preloader && (b.preloader = x("preloader", b.container, b.st.tLoading));
                var i = a.magnificPopup.modules;
                for (e = 0; e < i.length; e++) {
                    var j = i[e];
                    j = j.charAt(0).toUpperCase() + j.slice(1), b["init" + j].call(b);
                }
                y("BeforeOpen"), b.st.showCloseBtn && (b.st.closeBtnInside ? (w(l, (function(a, b, c, d) {
                    c.close_replaceWith = z(d.type);
                })), f += " mfp-close-btn-in") : b.wrap.append(z())), b.st.alignTop && (f += " mfp-align-top"), 
                b.fixedContentPos ? b.wrap.css({
                    overflow: b.st.overflowY,
                    overflowX: "hidden",
                    overflowY: b.st.overflowY
                }) : b.wrap.css({
                    top: v.scrollTop(),
                    position: "absolute"
                }), (b.st.fixedBgPos === !1 || "auto" === b.st.fixedBgPos && !b.fixedContentPos) && b.bgOverlay.css({
                    height: d.height(),
                    position: "absolute"
                }), b.st.enableEscapeKey && d.on("keyup" + p, (function(a) {
                    27 === a.keyCode && b.close();
                })), v.on("resize" + p, (function() {
                    b.updateSize();
                })), b.st.closeOnContentClick || (f += " mfp-auto-cursor"), f && b.wrap.addClass(f);
                var k = b.wH = v.height(), n = {};
                if (b.fixedContentPos && b._hasScrollBar(k)) {
                    var o = b._getScrollbarSize();
                    o && (n.marginRight = o);
                }
                b.fixedContentPos && (b.isIE7 ? a("body, html").css("overflow", "hidden") : n.overflow = "hidden");
                var r = b.st.mainClass;
                return b.isIE7 && (r += " mfp-ie7"), r && b._addClassToMFP(r), b.updateItemHTML(), 
                y("BuildControls"), a("html").css(n), b.bgOverlay.add(b.wrap).prependTo(b.st.prependTo || a(document.body)), 
                b._lastFocusedEl = document.activeElement, setTimeout((function() {
                    b.content ? (b._addClassToMFP(q), b._setFocus()) : b.bgOverlay.addClass(q), d.on("focusin" + p, b._onFocusIn);
                }), 16), b.isOpen = !0, b.updateSize(k), y(m), c;
            },
            close: function() {
                b.isOpen && (y(i), b.isOpen = !1, b.st.removalDelay && !b.isLowIE && b.supportsTransition ? (b._addClassToMFP(r), 
                setTimeout((function() {
                    b._close();
                }), b.st.removalDelay)) : b._close());
            },
            _close: function() {
                y(h);
                var c = r + " " + q + " ";
                if (b.bgOverlay.detach(), b.wrap.detach(), b.container.empty(), b.st.mainClass && (c += b.st.mainClass + " "), 
                b._removeClassFromMFP(c), b.fixedContentPos) {
                    var e = {
                        marginRight: ""
                    };
                    b.isIE7 ? a("body, html").css("overflow", "") : e.overflow = "", a("html").css(e);
                }
                d.off("keyup" + p + " focusin" + p), b.ev.off(p), b.wrap.attr("class", "mfp-wrap").removeAttr("style"), 
                b.bgOverlay.attr("class", "mfp-bg"), b.container.attr("class", "mfp-container"), 
                !b.st.showCloseBtn || b.st.closeBtnInside && b.currTemplate[b.currItem.type] !== !0 || b.currTemplate.closeBtn && b.currTemplate.closeBtn.detach(), 
                b.st.autoFocusLast && b._lastFocusedEl && a(b._lastFocusedEl).focus(), b.currItem = null, 
                b.content = null, b.currTemplate = null, b.prevHeight = 0, y(j);
            },
            updateSize: function(a) {
                if (b.isIOS) {
                    var c = document.documentElement.clientWidth / window.innerWidth, d = window.innerHeight * c;
                    b.wrap.css("height", d), b.wH = d;
                } else b.wH = a || v.height();
                b.fixedContentPos || b.wrap.css("height", b.wH), y("Resize");
            },
            updateItemHTML: function() {
                var c = b.items[b.index];
                b.contentContainer.detach(), b.content && b.content.detach(), c.parsed || (c = b.parseEl(b.index));
                var d = c.type;
                if (y("BeforeChange", [ b.currItem ? b.currItem.type : "", d ]), b.currItem = c, 
                !b.currTemplate[d]) {
                    var f = b.st[d] ? b.st[d].markup : !1;
                    y("FirstMarkupParse", f), f ? b.currTemplate[d] = a(f) : b.currTemplate[d] = !0;
                }
                e && e !== c.type && b.container.removeClass("mfp-" + e + "-holder");
                var g = b["get" + d.charAt(0).toUpperCase() + d.slice(1)](c, b.currTemplate[d]);
                b.appendContent(g, d), c.preloaded = !0, y(n, c), e = c.type, b.container.prepend(b.contentContainer), 
                y("AfterChange");
            },
            appendContent: function(a, c) {
                b.content = a, a ? b.st.showCloseBtn && b.st.closeBtnInside && b.currTemplate[c] === !0 ? b.content.find(".mfp-close").length || b.content.append(z()) : b.content = a : b.content = "", 
                y(k), b.container.addClass("mfp-" + c + "-holder"), b.contentContainer.append(b.content);
            },
            parseEl: function(c) {
                var d, e = b.items[c];
                if (e.tagName ? e = {
                    el: a(e)
                } : (d = e.type, e = {
                    data: e,
                    src: e.src
                }), e.el) {
                    for (var f = b.types, g = 0; g < f.length; g++) if (e.el.hasClass("mfp-" + f[g])) {
                        d = f[g];
                        break;
                    }
                    e.src = e.el.attr("data-mfp-src"), e.src || (e.src = e.el.attr("href"));
                }
                return e.type = d || b.st.type || "inline", e.index = c, e.parsed = !0, b.items[c] = e, 
                y("ElementParse", e), b.items[c];
            },
            addGroup: function(a, c) {
                var d = function(d) {
                    d.mfpEl = this, b._openClick(d, a, c);
                };
                c || (c = {});
                var e = "click.magnificPopup";
                c.mainEl = a, c.items ? (c.isObj = !0, a.off(e).on(e, d)) : (c.isObj = !1, c.delegate ? a.off(e).on(e, c.delegate, d) : (c.items = a, 
                a.off(e).on(e, d)));
            },
            _openClick: function(c, d, e) {
                var f = void 0 !== e.midClick ? e.midClick : a.magnificPopup.defaults.midClick;
                if (f || !(2 === c.which || c.ctrlKey || c.metaKey || c.altKey || c.shiftKey)) {
                    var g = void 0 !== e.disableOn ? e.disableOn : a.magnificPopup.defaults.disableOn;
                    if (g) if (a.isFunction(g)) {
                        if (!g.call(b)) return !0;
                    } else if (v.width() < g) return !0;
                    c.type && (c.preventDefault(), b.isOpen && c.stopPropagation()), e.el = a(c.mfpEl), 
                    e.delegate && (e.items = d.find(e.delegate)), b.open(e);
                }
            },
            updateStatus: function(a, d) {
                if (b.preloader) {
                    c !== a && b.container.removeClass("mfp-s-" + c), d || "loading" !== a || (d = b.st.tLoading);
                    var e = {
                        status: a,
                        text: d
                    };
                    y("UpdateStatus", e), a = e.status, d = e.text, b.preloader.html(d), b.preloader.find("a").on("click", (function(a) {
                        a.stopImmediatePropagation();
                    })), b.container.addClass("mfp-s-" + a), c = a;
                }
            },
            _checkIfClose: function(c) {
                if (!a(c).hasClass(s)) {
                    var d = b.st.closeOnContentClick, e = b.st.closeOnBgClick;
                    if (d && e) return !0;
                    if (!b.content || a(c).hasClass("mfp-close") || b.preloader && c === b.preloader[0]) return !0;
                    if (c === b.content[0] || a.contains(b.content[0], c)) {
                        if (d) return !0;
                    } else if (e && a.contains(document, c)) return !0;
                    return !1;
                }
            },
            _addClassToMFP: function(a) {
                b.bgOverlay.addClass(a), b.wrap.addClass(a);
            },
            _removeClassFromMFP: function(a) {
                this.bgOverlay.removeClass(a), b.wrap.removeClass(a);
            },
            _hasScrollBar: function(a) {
                return (b.isIE7 ? d.height() : document.body.scrollHeight) > (a || v.height());
            },
            _setFocus: function() {
                (b.st.focus ? b.content.find(b.st.focus).eq(0) : b.wrap).focus();
            },
            _onFocusIn: function(c) {
                return c.target === b.wrap[0] || a.contains(b.wrap[0], c.target) ? void 0 : (b._setFocus(), 
                !1);
            },
            _parseMarkup: function(b, c, d) {
                var e;
                d.data && (c = a.extend(d.data, c)), y(l, [ b, c, d ]), a.each(c, (function(c, d) {
                    if (void 0 === d || d === !1) return !0;
                    if (e = c.split("_"), e.length > 1) {
                        var f = b.find(p + "-" + e[0]);
                        if (f.length > 0) {
                            var g = e[1];
                            "replaceWith" === g ? f[0] !== d[0] && f.replaceWith(d) : "img" === g ? f.is("img") ? f.attr("src", d) : f.replaceWith(a("<img>").attr("src", d).attr("class", f.attr("class"))) : f.attr(e[1], d);
                        }
                    } else b.find(p + "-" + c).html(d);
                }));
            },
            _getScrollbarSize: function() {
                if (void 0 === b.scrollbarSize) {
                    var a = document.createElement("div");
                    a.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", 
                    document.body.appendChild(a), b.scrollbarSize = a.offsetWidth - a.clientWidth, document.body.removeChild(a);
                }
                return b.scrollbarSize;
            }
        }, a.magnificPopup = {
            instance: null,
            proto: t.prototype,
            modules: [],
            open: function(b, c) {
                return A(), b = b ? a.extend(!0, {}, b) : {}, b.isObj = !0, b.index = c || 0, this.instance.open(b);
            },
            close: function() {
                return a.magnificPopup.instance && a.magnificPopup.instance.close();
            },
            registerModule: function(b, c) {
                c.options && (a.magnificPopup.defaults[b] = c.options), a.extend(this.proto, c.proto), 
                this.modules.push(b);
            },
            defaults: {
                disableOn: 0,
                key: null,
                midClick: !1,
                mainClass: "",
                preloader: !0,
                focus: "",
                closeOnContentClick: !1,
                closeOnBgClick: !0,
                closeBtnInside: !0,
                showCloseBtn: !0,
                enableEscapeKey: !0,
                modal: !1,
                alignTop: !1,
                removalDelay: 0,
                prependTo: null,
                fixedContentPos: "auto",
                fixedBgPos: "auto",
                overflowY: "auto",
                closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',
                tClose: "Close (Esc)",
                tLoading: "Loading...",
                autoFocusLast: !0
            }
        }, a.fn.magnificPopup = function(c) {
            A();
            var d = a(this);
            if ("string" == typeof c) if ("open" === c) {
                var e, f = u ? d.data("magnificPopup") : d[0].magnificPopup, g = parseInt(arguments[1], 10) || 0;
                f.items ? e = f.items[g] : (e = d, f.delegate && (e = e.find(f.delegate)), e = e.eq(g)), 
                b._openClick({
                    mfpEl: e
                }, d, f);
            } else b.isOpen && b[c].apply(b, Array.prototype.slice.call(arguments, 1)); else c = a.extend(!0, {}, c), 
            u ? d.data("magnificPopup", c) : d[0].magnificPopup = c, b.addGroup(d, c);
            return d;
        };
        var C, D, E, F = "inline", G = function() {
            E && (D.after(E.addClass(C)).detach(), E = null);
        };
        a.magnificPopup.registerModule(F, {
            options: {
                hiddenClass: "hide",
                markup: "",
                tNotFound: "Content not found"
            },
            proto: {
                initInline: function() {
                    b.types.push(F), w(h + "." + F, (function() {
                        G();
                    }));
                },
                getInline: function(c, d) {
                    if (G(), c.src) {
                        var e = b.st.inline, f = a(c.src);
                        if (f.length) {
                            var g = f[0].parentNode;
                            g && g.tagName && (D || (C = e.hiddenClass, D = x(C), C = "mfp-" + C), E = f.after(D).detach().removeClass(C)), 
                            b.updateStatus("ready");
                        } else b.updateStatus("error", e.tNotFound), f = a("<div>");
                        return c.inlineElement = f, f;
                    }
                    return b.updateStatus("ready"), b._parseMarkup(d, {}, c), d;
                }
            }
        });
        var H, I = "ajax", J = function() {
            H && a(document.body).removeClass(H);
        }, K = function() {
            J(), b.req && b.req.abort();
        };
        a.magnificPopup.registerModule(I, {
            options: {
                settings: null,
                cursor: "mfp-ajax-cur",
                tError: '<a href="%url%">The content</a> could not be loaded.'
            },
            proto: {
                initAjax: function() {
                    b.types.push(I), H = b.st.ajax.cursor, w(h + "." + I, K), w("BeforeChange." + I, K);
                },
                getAjax: function(c) {
                    H && a(document.body).addClass(H), b.updateStatus("loading");
                    var d = a.extend({
                        url: c.src,
                        success: function(d, e, f) {
                            var g = {
                                data: d,
                                xhr: f
                            };
                            y("ParseAjax", g), b.appendContent(a(g.data), I), c.finished = !0, J(), b._setFocus(), 
                            setTimeout((function() {
                                b.wrap.addClass(q);
                            }), 16), b.updateStatus("ready"), y("AjaxContentAdded");
                        },
                        error: function() {
                            J(), c.finished = c.loadError = !0, b.updateStatus("error", b.st.ajax.tError.replace("%url%", c.src));
                        }
                    }, b.st.ajax.settings);
                    return b.req = a.ajax(d), "";
                }
            }
        });
        var L, M = function(c) {
            if (c.data && void 0 !== c.data.title) return c.data.title;
            var d = b.st.image.titleSrc;
            if (d) {
                if (a.isFunction(d)) return d.call(b, c);
                if (c.el) return c.el.attr(d) || "";
            }
            return "";
        };
        a.magnificPopup.registerModule("image", {
            options: {
                markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
                cursor: "mfp-zoom-out-cur",
                titleSrc: "title",
                verticalFit: !0,
                tError: '<a href="%url%">The image</a> could not be loaded.'
            },
            proto: {
                initImage: function() {
                    var c = b.st.image, d = ".image";
                    b.types.push("image"), w(m + d, (function() {
                        "image" === b.currItem.type && c.cursor && a(document.body).addClass(c.cursor);
                    })), w(h + d, (function() {
                        c.cursor && a(document.body).removeClass(c.cursor), v.off("resize" + p);
                    })), w("Resize" + d, b.resizeImage), b.isLowIE && w("AfterChange", b.resizeImage);
                },
                resizeImage: function() {
                    var a = b.currItem;
                    if (a && a.img && b.st.image.verticalFit) {
                        var c = 0;
                        b.isLowIE && (c = parseInt(a.img.css("padding-top"), 10) + parseInt(a.img.css("padding-bottom"), 10)), 
                        a.img.css("max-height", b.wH - c);
                    }
                },
                _onImageHasSize: function(a) {
                    a.img && (a.hasSize = !0, L && clearInterval(L), a.isCheckingImgSize = !1, y("ImageHasSize", a), 
                    a.imgHidden && (b.content && b.content.removeClass("mfp-loading"), a.imgHidden = !1));
                },
                findImageSize: function(a) {
                    var c = 0, d = a.img[0], e = function(f) {
                        L && clearInterval(L), L = setInterval((function() {
                            return d.naturalWidth > 0 ? void b._onImageHasSize(a) : (c > 200 && clearInterval(L), 
                            c++, void (3 === c ? e(10) : 40 === c ? e(50) : 100 === c && e(500)));
                        }), f);
                    };
                    e(1);
                },
                getImage: function(c, d) {
                    var e = 0, f = function() {
                        c && (c.img[0].complete ? (c.img.off(".mfploader"), c === b.currItem && (b._onImageHasSize(c), 
                        b.updateStatus("ready")), c.hasSize = !0, c.loaded = !0, y("ImageLoadComplete")) : (e++, 
                        200 > e ? setTimeout(f, 100) : g()));
                    }, g = function() {
                        c && (c.img.off(".mfploader"), c === b.currItem && (b._onImageHasSize(c), b.updateStatus("error", h.tError.replace("%url%", c.src))), 
                        c.hasSize = !0, c.loaded = !0, c.loadError = !0);
                    }, h = b.st.image, i = d.find(".mfp-img");
                    if (i.length) {
                        var j = document.createElement("img");
                        j.className = "mfp-img", c.el && c.el.find("img").length && (j.alt = c.el.find("img").attr("alt")), 
                        c.img = a(j).on("load.mfploader", f).on("error.mfploader", g), j.src = c.src, i.is("img") && (c.img = c.img.clone()), 
                        j = c.img[0], j.naturalWidth > 0 ? c.hasSize = !0 : j.width || (c.hasSize = !1);
                    }
                    return b._parseMarkup(d, {
                        title: M(c),
                        img_replaceWith: c.img
                    }, c), b.resizeImage(), c.hasSize ? (L && clearInterval(L), c.loadError ? (d.addClass("mfp-loading"), 
                    b.updateStatus("error", h.tError.replace("%url%", c.src))) : (d.removeClass("mfp-loading"), 
                    b.updateStatus("ready")), d) : (b.updateStatus("loading"), c.loading = !0, c.hasSize || (c.imgHidden = !0, 
                    d.addClass("mfp-loading"), b.findImageSize(c)), d);
                }
            }
        });
        var N, O = function() {
            return void 0 === N && (N = void 0 !== document.createElement("p").style.MozTransform), 
            N;
        };
        a.magnificPopup.registerModule("zoom", {
            options: {
                enabled: !1,
                easing: "ease-in-out",
                duration: 300,
                opener: function(a) {
                    return a.is("img") ? a : a.find("img");
                }
            },
            proto: {
                initZoom: function() {
                    var a, c = b.st.zoom, d = ".zoom";
                    if (c.enabled && b.supportsTransition) {
                        var e, f, g = c.duration, j = function(a) {
                            var b = a.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"), d = "all " + c.duration / 1e3 + "s " + c.easing, e = {
                                position: "fixed",
                                zIndex: 9999,
                                left: 0,
                                top: 0,
                                "-webkit-backface-visibility": "hidden"
                            }, f = "transition";
                            return e["-webkit-" + f] = e["-moz-" + f] = e["-o-" + f] = e[f] = d, b.css(e), b;
                        }, k = function() {
                            b.content.css("visibility", "visible");
                        };
                        w("BuildControls" + d, (function() {
                            if (b._allowZoom()) {
                                if (clearTimeout(e), b.content.css("visibility", "hidden"), a = b._getItemToZoom(), 
                                !a) return void k();
                                f = j(a), f.css(b._getOffset()), b.wrap.append(f), e = setTimeout((function() {
                                    f.css(b._getOffset(!0)), e = setTimeout((function() {
                                        k(), setTimeout((function() {
                                            f.remove(), a = f = null, y("ZoomAnimationEnded");
                                        }), 16);
                                    }), g);
                                }), 16);
                            }
                        })), w(i + d, (function() {
                            if (b._allowZoom()) {
                                if (clearTimeout(e), b.st.removalDelay = g, !a) {
                                    if (a = b._getItemToZoom(), !a) return;
                                    f = j(a);
                                }
                                f.css(b._getOffset(!0)), b.wrap.append(f), b.content.css("visibility", "hidden"), 
                                setTimeout((function() {
                                    f.css(b._getOffset());
                                }), 16);
                            }
                        })), w(h + d, (function() {
                            b._allowZoom() && (k(), f && f.remove(), a = null);
                        }));
                    }
                },
                _allowZoom: function() {
                    return "image" === b.currItem.type;
                },
                _getItemToZoom: function() {
                    return b.currItem.hasSize ? b.currItem.img : !1;
                },
                _getOffset: function(c) {
                    var d;
                    d = c ? b.currItem.img : b.st.zoom.opener(b.currItem.el || b.currItem);
                    var e = d.offset(), f = parseInt(d.css("padding-top"), 10), g = parseInt(d.css("padding-bottom"), 10);
                    e.top -= a(window).scrollTop() - f;
                    var h = {
                        width: d.width(),
                        height: (u ? d.innerHeight() : d[0].offsetHeight) - g - f
                    };
                    return O() ? h["-moz-transform"] = h.transform = "translate(" + e.left + "px," + e.top + "px)" : (h.left = e.left, 
                    h.top = e.top), h;
                }
            }
        });
        var P = "iframe", Q = "//about:blank", R = function(a) {
            if (b.currTemplate[P]) {
                var c = b.currTemplate[P].find("iframe");
                c.length && (a || (c[0].src = Q), b.isIE8 && c.css("display", a ? "block" : "none"));
            }
        };
        a.magnificPopup.registerModule(P, {
            options: {
                markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
                srcAction: "iframe_src",
                patterns: {
                    youtube: {
                        index: "youtube.com",
                        id: "v=",
                        src: "//www.youtube.com/embed/%id%?autoplay=1"
                    },
                    vimeo: {
                        index: "vimeo.com/",
                        id: "/",
                        src: "//player.vimeo.com/video/%id%?autoplay=1"
                    },
                    gmaps: {
                        index: "//maps.google.",
                        src: "%id%&output=embed"
                    }
                }
            },
            proto: {
                initIframe: function() {
                    b.types.push(P), w("BeforeChange", (function(a, b, c) {
                        b !== c && (b === P ? R() : c === P && R(!0));
                    })), w(h + "." + P, (function() {
                        R();
                    }));
                },
                getIframe: function(c, d) {
                    var e = c.src, f = b.st.iframe;
                    a.each(f.patterns, (function() {
                        return e.indexOf(this.index) > -1 ? (this.id && (e = "string" == typeof this.id ? e.substr(e.lastIndexOf(this.id) + this.id.length, e.length) : this.id.call(this, e)), 
                        e = this.src.replace("%id%", e), !1) : void 0;
                    }));
                    var g = {};
                    return f.srcAction && (g[f.srcAction] = e), b._parseMarkup(d, g, c), b.updateStatus("ready"), 
                    d;
                }
            }
        });
        var S = function(a) {
            var c = b.items.length;
            return a > c - 1 ? a - c : 0 > a ? c + a : a;
        }, T = function(a, b, c) {
            return a.replace(/%curr%/gi, b + 1).replace(/%total%/gi, c);
        };
        a.magnificPopup.registerModule("gallery", {
            options: {
                enabled: !1,
                arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
                preload: [ 0, 2 ],
                navigateByImgClick: !0,
                arrows: !0,
                tPrev: "Previous (Left arrow key)",
                tNext: "Next (Right arrow key)",
                tCounter: "%curr% of %total%"
            },
            proto: {
                initGallery: function() {
                    var c = b.st.gallery, e = ".mfp-gallery";
                    return b.direction = !0, c && c.enabled ? (f += " mfp-gallery", w(m + e, (function() {
                        c.navigateByImgClick && b.wrap.on("click" + e, ".mfp-img", (function() {
                            return b.items.length > 1 ? (b.next(), !1) : void 0;
                        })), d.on("keydown" + e, (function(a) {
                            37 === a.keyCode ? b.prev() : 39 === a.keyCode && b.next();
                        }));
                    })), w("UpdateStatus" + e, (function(a, c) {
                        c.text && (c.text = T(c.text, b.currItem.index, b.items.length));
                    })), w(l + e, (function(a, d, e, f) {
                        var g = b.items.length;
                        e.counter = g > 1 ? T(c.tCounter, f.index, g) : "";
                    })), w("BuildControls" + e, (function() {
                        if (b.items.length > 1 && c.arrows && !b.arrowLeft) {
                            var d = c.arrowMarkup, e = b.arrowLeft = a(d.replace(/%title%/gi, c.tPrev).replace(/%dir%/gi, "left")).addClass(s), f = b.arrowRight = a(d.replace(/%title%/gi, c.tNext).replace(/%dir%/gi, "right")).addClass(s);
                            e.click((function() {
                                b.prev();
                            })), f.click((function() {
                                b.next();
                            })), b.container.append(e.add(f));
                        }
                    })), w(n + e, (function() {
                        b._preloadTimeout && clearTimeout(b._preloadTimeout), b._preloadTimeout = setTimeout((function() {
                            b.preloadNearbyImages(), b._preloadTimeout = null;
                        }), 16);
                    })), void w(h + e, (function() {
                        d.off(e), b.wrap.off("click" + e), b.arrowRight = b.arrowLeft = null;
                    }))) : !1;
                },
                next: function() {
                    b.direction = !0, b.index = S(b.index + 1), b.updateItemHTML();
                },
                prev: function() {
                    b.direction = !1, b.index = S(b.index - 1), b.updateItemHTML();
                },
                goTo: function(a) {
                    b.direction = a >= b.index, b.index = a, b.updateItemHTML();
                },
                preloadNearbyImages: function() {
                    var a, c = b.st.gallery.preload, d = Math.min(c[0], b.items.length), e = Math.min(c[1], b.items.length);
                    for (a = 1; a <= (b.direction ? e : d); a++) b._preloadItem(b.index + a);
                    for (a = 1; a <= (b.direction ? d : e); a++) b._preloadItem(b.index - a);
                },
                _preloadItem: function(c) {
                    if (c = S(c), !b.items[c].preloaded) {
                        var d = b.items[c];
                        d.parsed || (d = b.parseEl(c)), y("LazyLoad", d), "image" === d.type && (d.img = a('<img class="mfp-img" />').on("load.mfploader", (function() {
                            d.hasSize = !0;
                        })).on("error.mfploader", (function() {
                            d.hasSize = !0, d.loadError = !0, y("LazyLoadError", d);
                        })).attr("src", d.src)), d.preloaded = !0;
                    }
                }
            }
        });
        var U = "retina";
        a.magnificPopup.registerModule(U, {
            options: {
                replaceSrc: function(a) {
                    return a.src.replace(/\.\w+$/, (function(a) {
                        return "@2x" + a;
                    }));
                },
                ratio: 1
            },
            proto: {
                initRetina: function() {
                    if (window.devicePixelRatio > 1) {
                        var a = b.st.retina, c = a.ratio;
                        c = isNaN(c) ? c() : c, c > 1 && (w("ImageHasSize." + U, (function(a, b) {
                            b.img.css({
                                "max-width": b.img[0].naturalWidth / c,
                                width: "100%"
                            });
                        })), w("ElementParse." + U, (function(b, d) {
                            d.src = a.replaceSrc(d, c);
                        })));
                    }
                }
            }
        }), A();
    }));
    !function(i) {
        "use strict";
        "function" == typeof define && define.amd ? define([ "jquery" ], i) : "undefined" != typeof exports ? module.exports = i(require("jquery")) : i(jQuery);
    }((function(i) {
        "use strict";
        var e = window.Slick || {};
        (e = function() {
            var e = 0;
            return function(t, o) {
                var s, n = this;
                n.defaults = {
                    accessibility: !0,
                    adaptiveHeight: !1,
                    appendArrows: i(t),
                    appendDots: i(t),
                    arrows: !0,
                    asNavFor: null,
                    prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                    nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                    autoplay: !1,
                    autoplaySpeed: 3e3,
                    centerMode: !1,
                    centerPadding: "50px",
                    cssEase: "ease",
                    customPaging: function(e, t) {
                        return i('<button type="button" />').text(t + 1);
                    },
                    dots: !1,
                    dotsClass: "slick-dots",
                    draggable: !0,
                    easing: "linear",
                    edgeFriction: .35,
                    fade: !1,
                    focusOnSelect: !1,
                    focusOnChange: !1,
                    infinite: !0,
                    initialSlide: 0,
                    lazyLoad: "ondemand",
                    mobileFirst: !1,
                    pauseOnHover: !0,
                    pauseOnFocus: !0,
                    pauseOnDotsHover: !1,
                    respondTo: "window",
                    responsive: null,
                    rows: 1,
                    rtl: !1,
                    slide: "",
                    slidesPerRow: 1,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    speed: 500,
                    swipe: !0,
                    swipeToSlide: !1,
                    touchMove: !0,
                    touchThreshold: 5,
                    useCSS: !0,
                    useTransform: !0,
                    variableWidth: !1,
                    vertical: !1,
                    verticalSwiping: !1,
                    waitForAnimate: !0,
                    zIndex: 1e3
                }, n.initials = {
                    animating: !1,
                    dragging: !1,
                    autoPlayTimer: null,
                    currentDirection: 0,
                    currentLeft: null,
                    currentSlide: 0,
                    direction: 1,
                    $dots: null,
                    listWidth: null,
                    listHeight: null,
                    loadIndex: 0,
                    $nextArrow: null,
                    $prevArrow: null,
                    scrolling: !1,
                    slideCount: null,
                    slideWidth: null,
                    $slideTrack: null,
                    $slides: null,
                    sliding: !1,
                    slideOffset: 0,
                    swipeLeft: null,
                    swiping: !1,
                    $list: null,
                    touchObject: {},
                    transformsEnabled: !1,
                    unslicked: !1
                }, i.extend(n, n.initials), n.activeBreakpoint = null, n.animType = null, n.animProp = null, 
                n.breakpoints = [], n.breakpointSettings = [], n.cssTransitions = !1, n.focussed = !1, 
                n.interrupted = !1, n.hidden = "hidden", n.paused = !0, n.positionProp = null, n.respondTo = null, 
                n.rowCount = 1, n.shouldClick = !0, n.$slider = i(t), n.$slidesCache = null, n.transformType = null, 
                n.transitionType = null, n.visibilityChange = "visibilitychange", n.windowWidth = 0, 
                n.windowTimer = null, s = i(t).data("slick") || {}, n.options = i.extend({}, n.defaults, o, s), 
                n.currentSlide = n.options.initialSlide, n.originalSettings = n.options, void 0 !== document.mozHidden ? (n.hidden = "mozHidden", 
                n.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (n.hidden = "webkitHidden", 
                n.visibilityChange = "webkitvisibilitychange"), n.autoPlay = i.proxy(n.autoPlay, n), 
                n.autoPlayClear = i.proxy(n.autoPlayClear, n), n.autoPlayIterator = i.proxy(n.autoPlayIterator, n), 
                n.changeSlide = i.proxy(n.changeSlide, n), n.clickHandler = i.proxy(n.clickHandler, n), 
                n.selectHandler = i.proxy(n.selectHandler, n), n.setPosition = i.proxy(n.setPosition, n), 
                n.swipeHandler = i.proxy(n.swipeHandler, n), n.dragHandler = i.proxy(n.dragHandler, n), 
                n.keyHandler = i.proxy(n.keyHandler, n), n.instanceUid = e++, n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, 
                n.registerBreakpoints(), n.init(!0);
            };
        }()).prototype.activateADA = function() {
            this.$slideTrack.find(".slick-active").attr({
                "aria-hidden": "false"
            }).find("a, input, button, select").attr({
                tabindex: "0"
            });
        }, e.prototype.addSlide = e.prototype.slickAdd = function(e, t, o) {
            var s = this;
            if ("boolean" == typeof t) o = t, t = null; else if (t < 0 || t >= s.slideCount) return !1;
            s.unload(), "number" == typeof t ? 0 === t && 0 === s.$slides.length ? i(e).appendTo(s.$slideTrack) : o ? i(e).insertBefore(s.$slides.eq(t)) : i(e).insertAfter(s.$slides.eq(t)) : !0 === o ? i(e).prependTo(s.$slideTrack) : i(e).appendTo(s.$slideTrack), 
            s.$slides = s.$slideTrack.children(this.options.slide), s.$slideTrack.children(this.options.slide).detach(), 
            s.$slideTrack.append(s.$slides), s.$slides.each((function(e, t) {
                i(t).attr("data-slick-index", e);
            })), s.$slidesCache = s.$slides, s.reinit();
        }, e.prototype.animateHeight = function() {
            var i = this;
            if (1 === i.options.slidesToShow && !0 === i.options.adaptiveHeight && !1 === i.options.vertical) {
                var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
                i.$list.animate({
                    height: e
                }, i.options.speed);
            }
        }, e.prototype.animateSlide = function(e, t) {
            var o = {}, s = this;
            s.animateHeight(), !0 === s.options.rtl && !1 === s.options.vertical && (e = -e), 
            !1 === s.transformsEnabled ? !1 === s.options.vertical ? s.$slideTrack.animate({
                left: e
            }, s.options.speed, s.options.easing, t) : s.$slideTrack.animate({
                top: e
            }, s.options.speed, s.options.easing, t) : !1 === s.cssTransitions ? (!0 === s.options.rtl && (s.currentLeft = -s.currentLeft), 
            i({
                animStart: s.currentLeft
            }).animate({
                animStart: e
            }, {
                duration: s.options.speed,
                easing: s.options.easing,
                step: function(i) {
                    i = Math.ceil(i), !1 === s.options.vertical ? (o[s.animType] = "translate(" + i + "px, 0px)", 
                    s.$slideTrack.css(o)) : (o[s.animType] = "translate(0px," + i + "px)", s.$slideTrack.css(o));
                },
                complete: function() {
                    t && t.call();
                }
            })) : (s.applyTransition(), e = Math.ceil(e), !1 === s.options.vertical ? o[s.animType] = "translate3d(" + e + "px, 0px, 0px)" : o[s.animType] = "translate3d(0px," + e + "px, 0px)", 
            s.$slideTrack.css(o), t && setTimeout((function() {
                s.disableTransition(), t.call();
            }), s.options.speed));
        }, e.prototype.getNavTarget = function() {
            var e = this, t = e.options.asNavFor;
            return t && null !== t && (t = i(t).not(e.$slider)), t;
        }, e.prototype.asNavFor = function(e) {
            var t = this.getNavTarget();
            null !== t && "object" == typeof t && t.each((function() {
                var t = i(this).slick("getSlick");
                t.unslicked || t.slideHandler(e, !0);
            }));
        }, e.prototype.applyTransition = function(i) {
            var e = this, t = {};
            !1 === e.options.fade ? t[e.transitionType] = e.transformType + " " + e.options.speed + "ms " + e.options.cssEase : t[e.transitionType] = "opacity " + e.options.speed + "ms " + e.options.cssEase, 
            !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
        }, e.prototype.autoPlay = function() {
            var i = this;
            i.autoPlayClear(), i.slideCount > i.options.slidesToShow && (i.autoPlayTimer = setInterval(i.autoPlayIterator, i.options.autoplaySpeed));
        }, e.prototype.autoPlayClear = function() {
            var i = this;
            i.autoPlayTimer && clearInterval(i.autoPlayTimer);
        }, e.prototype.autoPlayIterator = function() {
            var i = this, e = i.currentSlide + i.options.slidesToScroll;
            i.paused || i.interrupted || i.focussed || (!1 === i.options.infinite && (1 === i.direction && i.currentSlide + 1 === i.slideCount - 1 ? i.direction = 0 : 0 === i.direction && (e = i.currentSlide - i.options.slidesToScroll, 
            i.currentSlide - 1 == 0 && (i.direction = 1))), i.slideHandler(e));
        }, e.prototype.buildArrows = function() {
            var e = this;
            !0 === e.options.arrows && (e.$prevArrow = i(e.options.prevArrow).addClass("slick-arrow"), 
            e.$nextArrow = i(e.options.nextArrow).addClass("slick-arrow"), e.slideCount > e.options.slidesToShow ? (e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), 
            e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.prependTo(e.options.appendArrows), 
            e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.appendTo(e.options.appendArrows), 
            !0 !== e.options.infinite && e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
                "aria-disabled": "true",
                tabindex: "-1"
            }));
        }, e.prototype.buildDots = function() {
            var e, t, o = this;
            if (!0 === o.options.dots) {
                for (o.$slider.addClass("slick-dotted"), t = i("<ul />").addClass(o.options.dotsClass), 
                e = 0; e <= o.getDotCount(); e += 1) t.append(i("<li />").append(o.options.customPaging.call(this, o, e)));
                o.$dots = t.appendTo(o.options.appendDots), o.$dots.find("li").first().addClass("slick-active");
            }
        }, e.prototype.buildOut = function() {
            var e = this;
            e.$slides = e.$slider.children(e.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), 
            e.slideCount = e.$slides.length, e.$slides.each((function(e, t) {
                i(t).attr("data-slick-index", e).data("originalStyling", i(t).attr("style") || "");
            })), e.$slider.addClass("slick-slider"), e.$slideTrack = 0 === e.slideCount ? i('<div class="slick-track"/>').appendTo(e.$slider) : e.$slides.wrapAll('<div class="slick-track"/>').parent(), 
            e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent(), e.$slideTrack.css("opacity", 0), 
            !0 !== e.options.centerMode && !0 !== e.options.swipeToSlide || (e.options.slidesToScroll = 1), 
            i("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"), e.setupInfinite(), 
            e.buildArrows(), e.buildDots(), e.updateDots(), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), 
            !0 === e.options.draggable && e.$list.addClass("draggable");
        }, e.prototype.buildRows = function() {
            var i, e, t, o, s, n, r, l = this;
            if (o = document.createDocumentFragment(), n = l.$slider.children(), l.options.rows > 1) {
                for (r = l.options.slidesPerRow * l.options.rows, s = Math.ceil(n.length / r), i = 0; i < s; i++) {
                    var d = document.createElement("div");
                    for (e = 0; e < l.options.rows; e++) {
                        var a = document.createElement("div");
                        for (t = 0; t < l.options.slidesPerRow; t++) {
                            var c = i * r + (e * l.options.slidesPerRow + t);
                            n.get(c) && a.appendChild(n.get(c));
                        }
                        d.appendChild(a);
                    }
                    o.appendChild(d);
                }
                l.$slider.empty().append(o), l.$slider.children().children().children().css({
                    width: 100 / l.options.slidesPerRow + "%",
                    display: "inline-block"
                });
            }
        }, e.prototype.checkResponsive = function(e, t) {
            var o, s, n, r = this, l = !1, d = r.$slider.width(), a = window.innerWidth || i(window).width();
            if ("window" === r.respondTo ? n = a : "slider" === r.respondTo ? n = d : "min" === r.respondTo && (n = Math.min(a, d)), 
            r.options.responsive && r.options.responsive.length && null !== r.options.responsive) {
                s = null;
                for (o in r.breakpoints) r.breakpoints.hasOwnProperty(o) && (!1 === r.originalSettings.mobileFirst ? n < r.breakpoints[o] && (s = r.breakpoints[o]) : n > r.breakpoints[o] && (s = r.breakpoints[o]));
                null !== s ? null !== r.activeBreakpoint ? (s !== r.activeBreakpoint || t) && (r.activeBreakpoint = s, 
                "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]), 
                !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e)), l = s) : (r.activeBreakpoint = s, 
                "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]), 
                !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e)), l = s) : null !== r.activeBreakpoint && (r.activeBreakpoint = null, 
                r.options = r.originalSettings, !0 === e && (r.currentSlide = r.options.initialSlide), 
                r.refresh(e), l = s), e || !1 === l || r.$slider.trigger("breakpoint", [ r, l ]);
            }
        }, e.prototype.changeSlide = function(e, t) {
            var o, s, n, r = this, l = i(e.currentTarget);
            switch (l.is("a") && e.preventDefault(), l.is("li") || (l = l.closest("li")), n = r.slideCount % r.options.slidesToScroll != 0, 
            o = n ? 0 : (r.slideCount - r.currentSlide) % r.options.slidesToScroll, e.data.message) {
              case "previous":
                s = 0 === o ? r.options.slidesToScroll : r.options.slidesToShow - o, r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide - s, !1, t);
                break;

              case "next":
                s = 0 === o ? r.options.slidesToScroll : o, r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide + s, !1, t);
                break;

              case "index":
                var d = 0 === e.data.index ? 0 : e.data.index || l.index() * r.options.slidesToScroll;
                r.slideHandler(r.checkNavigable(d), !1, t), l.children().trigger("focus");
                break;

              default:
                return;
            }
        }, e.prototype.checkNavigable = function(i) {
            var e, t;
            if (e = this.getNavigableIndexes(), t = 0, i > e[e.length - 1]) i = e[e.length - 1]; else for (var o in e) {
                if (i < e[o]) {
                    i = t;
                    break;
                }
                t = e[o];
            }
            return i;
        }, e.prototype.cleanUpEvents = function() {
            var e = this;
            e.options.dots && null !== e.$dots && (i("li", e.$dots).off("click.slick", e.changeSlide).off("mouseenter.slick", i.proxy(e.interrupt, e, !0)).off("mouseleave.slick", i.proxy(e.interrupt, e, !1)), 
            !0 === e.options.accessibility && e.$dots.off("keydown.slick", e.keyHandler)), e.$slider.off("focus.slick blur.slick"), 
            !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide), 
            e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide), !0 === e.options.accessibility && (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler), 
            e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))), e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler), 
            e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler), e.$list.off("touchend.slick mouseup.slick", e.swipeHandler), 
            e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler), e.$list.off("click.slick", e.clickHandler), 
            i(document).off(e.visibilityChange, e.visibility), e.cleanUpSlideEvents(), !0 === e.options.accessibility && e.$list.off("keydown.slick", e.keyHandler), 
            !0 === e.options.focusOnSelect && i(e.$slideTrack).children().off("click.slick", e.selectHandler), 
            i(window).off("orientationchange.slick.slick-" + e.instanceUid, e.orientationChange), 
            i(window).off("resize.slick.slick-" + e.instanceUid, e.resize), i("[draggable!=true]", e.$slideTrack).off("dragstart", e.preventDefault), 
            i(window).off("load.slick.slick-" + e.instanceUid, e.setPosition);
        }, e.prototype.cleanUpSlideEvents = function() {
            var e = this;
            e.$list.off("mouseenter.slick", i.proxy(e.interrupt, e, !0)), e.$list.off("mouseleave.slick", i.proxy(e.interrupt, e, !1));
        }, e.prototype.cleanUpRows = function() {
            var i, e = this;
            e.options.rows > 1 && ((i = e.$slides.children().children()).removeAttr("style"), 
            e.$slider.empty().append(i));
        }, e.prototype.clickHandler = function(i) {
            !1 === this.shouldClick && (i.stopImmediatePropagation(), i.stopPropagation(), i.preventDefault());
        }, e.prototype.destroy = function(e) {
            var t = this;
            t.autoPlayClear(), t.touchObject = {}, t.cleanUpEvents(), i(".slick-cloned", t.$slider).detach(), 
            t.$dots && t.$dots.remove(), t.$prevArrow && t.$prevArrow.length && (t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), 
            t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()), t.$nextArrow && t.$nextArrow.length && (t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), 
            t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()), t.$slides && (t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each((function() {
                i(this).attr("style", i(this).data("originalStyling"));
            })), t.$slideTrack.children(this.options.slide).detach(), t.$slideTrack.detach(), 
            t.$list.detach(), t.$slider.append(t.$slides)), t.cleanUpRows(), t.$slider.removeClass("slick-slider"), 
            t.$slider.removeClass("slick-initialized"), t.$slider.removeClass("slick-dotted"), 
            t.unslicked = !0, e || t.$slider.trigger("destroy", [ t ]);
        }, e.prototype.disableTransition = function(i) {
            var e = this, t = {};
            t[e.transitionType] = "", !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
        }, e.prototype.fadeSlide = function(i, e) {
            var t = this;
            !1 === t.cssTransitions ? (t.$slides.eq(i).css({
                zIndex: t.options.zIndex
            }), t.$slides.eq(i).animate({
                opacity: 1
            }, t.options.speed, t.options.easing, e)) : (t.applyTransition(i), t.$slides.eq(i).css({
                opacity: 1,
                zIndex: t.options.zIndex
            }), e && setTimeout((function() {
                t.disableTransition(i), e.call();
            }), t.options.speed));
        }, e.prototype.fadeSlideOut = function(i) {
            var e = this;
            !1 === e.cssTransitions ? e.$slides.eq(i).animate({
                opacity: 0,
                zIndex: e.options.zIndex - 2
            }, e.options.speed, e.options.easing) : (e.applyTransition(i), e.$slides.eq(i).css({
                opacity: 0,
                zIndex: e.options.zIndex - 2
            }));
        }, e.prototype.filterSlides = e.prototype.slickFilter = function(i) {
            var e = this;
            null !== i && (e.$slidesCache = e.$slides, e.unload(), e.$slideTrack.children(this.options.slide).detach(), 
            e.$slidesCache.filter(i).appendTo(e.$slideTrack), e.reinit());
        }, e.prototype.focusHandler = function() {
            var e = this;
            e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*", (function(t) {
                t.stopImmediatePropagation();
                var o = i(this);
                setTimeout((function() {
                    e.options.pauseOnFocus && (e.focussed = o.is(":focus"), e.autoPlay());
                }), 0);
            }));
        }, e.prototype.getCurrent = e.prototype.slickCurrentSlide = function() {
            return this.currentSlide;
        }, e.prototype.getDotCount = function() {
            var i = this, e = 0, t = 0, o = 0;
            if (!0 === i.options.infinite) if (i.slideCount <= i.options.slidesToShow) ++o; else for (;e < i.slideCount; ) ++o, 
            e = t + i.options.slidesToScroll, t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow; else if (!0 === i.options.centerMode) o = i.slideCount; else if (i.options.asNavFor) for (;e < i.slideCount; ) ++o, 
            e = t + i.options.slidesToScroll, t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow; else o = 1 + Math.ceil((i.slideCount - i.options.slidesToShow) / i.options.slidesToScroll);
            return o - 1;
        }, e.prototype.getLeft = function(i) {
            var e, t, o, s, n = this, r = 0;
            return n.slideOffset = 0, t = n.$slides.first().outerHeight(!0), !0 === n.options.infinite ? (n.slideCount > n.options.slidesToShow && (n.slideOffset = n.slideWidth * n.options.slidesToShow * -1, 
            s = -1, !0 === n.options.vertical && !0 === n.options.centerMode && (2 === n.options.slidesToShow ? s = -1.5 : 1 === n.options.slidesToShow && (s = -2)), 
            r = t * n.options.slidesToShow * s), n.slideCount % n.options.slidesToScroll != 0 && i + n.options.slidesToScroll > n.slideCount && n.slideCount > n.options.slidesToShow && (i > n.slideCount ? (n.slideOffset = (n.options.slidesToShow - (i - n.slideCount)) * n.slideWidth * -1, 
            r = (n.options.slidesToShow - (i - n.slideCount)) * t * -1) : (n.slideOffset = n.slideCount % n.options.slidesToScroll * n.slideWidth * -1, 
            r = n.slideCount % n.options.slidesToScroll * t * -1))) : i + n.options.slidesToShow > n.slideCount && (n.slideOffset = (i + n.options.slidesToShow - n.slideCount) * n.slideWidth, 
            r = (i + n.options.slidesToShow - n.slideCount) * t), n.slideCount <= n.options.slidesToShow && (n.slideOffset = 0, 
            r = 0), !0 === n.options.centerMode && n.slideCount <= n.options.slidesToShow ? n.slideOffset = n.slideWidth * Math.floor(n.options.slidesToShow) / 2 - n.slideWidth * n.slideCount / 2 : !0 === n.options.centerMode && !0 === n.options.infinite ? n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2) - n.slideWidth : !0 === n.options.centerMode && (n.slideOffset = 0, 
            n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2)), e = !1 === n.options.vertical ? i * n.slideWidth * -1 + n.slideOffset : i * t * -1 + r, 
            !0 === n.options.variableWidth && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow), 
            e = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0, 
            !0 === n.options.centerMode && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow + 1), 
            e = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0, 
            e += (n.$list.width() - o.outerWidth()) / 2)), e;
        }, e.prototype.getOption = e.prototype.slickGetOption = function(i) {
            return this.options[i];
        }, e.prototype.getNavigableIndexes = function() {
            var i, e = this, t = 0, o = 0, s = [];
            for (!1 === e.options.infinite ? i = e.slideCount : (t = -1 * e.options.slidesToScroll, 
            o = -1 * e.options.slidesToScroll, i = 2 * e.slideCount); t < i; ) s.push(t), t = o + e.options.slidesToScroll, 
            o += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
            return s;
        }, e.prototype.getSlick = function() {
            return this;
        }, e.prototype.getSlideCount = function() {
            var e, t, o = this;
            return t = !0 === o.options.centerMode ? o.slideWidth * Math.floor(o.options.slidesToShow / 2) : 0, 
            !0 === o.options.swipeToSlide ? (o.$slideTrack.find(".slick-slide").each((function(s, n) {
                if (n.offsetLeft - t + i(n).outerWidth() / 2 > -1 * o.swipeLeft) return e = n, !1;
            })), Math.abs(i(e).attr("data-slick-index") - o.currentSlide) || 1) : o.options.slidesToScroll;
        }, e.prototype.goTo = e.prototype.slickGoTo = function(i, e) {
            this.changeSlide({
                data: {
                    message: "index",
                    index: parseInt(i)
                }
            }, e);
        }, e.prototype.init = function(e) {
            var t = this;
            i(t.$slider).hasClass("slick-initialized") || (i(t.$slider).addClass("slick-initialized"), 
            t.buildRows(), t.buildOut(), t.setProps(), t.startLoad(), t.loadSlider(), t.initializeEvents(), 
            t.updateArrows(), t.updateDots(), t.checkResponsive(!0), t.focusHandler()), e && t.$slider.trigger("init", [ t ]), 
            !0 === t.options.accessibility && t.initADA(), t.options.autoplay && (t.paused = !1, 
            t.autoPlay());
        }, e.prototype.initADA = function() {
            var e = this, t = Math.ceil(e.slideCount / e.options.slidesToShow), o = e.getNavigableIndexes().filter((function(i) {
                return i >= 0 && i < e.slideCount;
            }));
            e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({
                "aria-hidden": "true",
                tabindex: "-1"
            }).find("a, input, button, select").attr({
                tabindex: "-1"
            }), null !== e.$dots && (e.$slides.not(e.$slideTrack.find(".slick-cloned")).each((function(t) {
                var s = o.indexOf(t);
                i(this).attr({
                    role: "tabpanel",
                    id: "slick-slide" + e.instanceUid + t,
                    tabindex: -1
                }), -1 !== s && i(this).attr({
                    "aria-describedby": "slick-slide-control" + e.instanceUid + s
                });
            })), e.$dots.attr("role", "tablist").find("li").each((function(s) {
                var n = o[s];
                i(this).attr({
                    role: "presentation"
                }), i(this).find("button").first().attr({
                    role: "tab",
                    id: "slick-slide-control" + e.instanceUid + s,
                    "aria-controls": "slick-slide" + e.instanceUid + n,
                    "aria-label": s + 1 + " of " + t,
                    "aria-selected": null,
                    tabindex: "-1"
                });
            })).eq(e.currentSlide).find("button").attr({
                "aria-selected": "true",
                tabindex: "0"
            }).end());
            for (var s = e.currentSlide, n = s + e.options.slidesToShow; s < n; s++) e.$slides.eq(s).attr("tabindex", 0);
            e.activateADA();
        }, e.prototype.initArrowEvents = function() {
            var i = this;
            !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.off("click.slick").on("click.slick", {
                message: "previous"
            }, i.changeSlide), i.$nextArrow.off("click.slick").on("click.slick", {
                message: "next"
            }, i.changeSlide), !0 === i.options.accessibility && (i.$prevArrow.on("keydown.slick", i.keyHandler), 
            i.$nextArrow.on("keydown.slick", i.keyHandler)));
        }, e.prototype.initDotEvents = function() {
            var e = this;
            !0 === e.options.dots && (i("li", e.$dots).on("click.slick", {
                message: "index"
            }, e.changeSlide), !0 === e.options.accessibility && e.$dots.on("keydown.slick", e.keyHandler)), 
            !0 === e.options.dots && !0 === e.options.pauseOnDotsHover && i("li", e.$dots).on("mouseenter.slick", i.proxy(e.interrupt, e, !0)).on("mouseleave.slick", i.proxy(e.interrupt, e, !1));
        }, e.prototype.initSlideEvents = function() {
            var e = this;
            e.options.pauseOnHover && (e.$list.on("mouseenter.slick", i.proxy(e.interrupt, e, !0)), 
            e.$list.on("mouseleave.slick", i.proxy(e.interrupt, e, !1)));
        }, e.prototype.initializeEvents = function() {
            var e = this;
            e.initArrowEvents(), e.initDotEvents(), e.initSlideEvents(), e.$list.on("touchstart.slick mousedown.slick", {
                action: "start"
            }, e.swipeHandler), e.$list.on("touchmove.slick mousemove.slick", {
                action: "move"
            }, e.swipeHandler), e.$list.on("touchend.slick mouseup.slick", {
                action: "end"
            }, e.swipeHandler), e.$list.on("touchcancel.slick mouseleave.slick", {
                action: "end"
            }, e.swipeHandler), e.$list.on("click.slick", e.clickHandler), i(document).on(e.visibilityChange, i.proxy(e.visibility, e)), 
            !0 === e.options.accessibility && e.$list.on("keydown.slick", e.keyHandler), !0 === e.options.focusOnSelect && i(e.$slideTrack).children().on("click.slick", e.selectHandler), 
            i(window).on("orientationchange.slick.slick-" + e.instanceUid, i.proxy(e.orientationChange, e)), 
            i(window).on("resize.slick.slick-" + e.instanceUid, i.proxy(e.resize, e)), i("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault), 
            i(window).on("load.slick.slick-" + e.instanceUid, e.setPosition), i(e.setPosition);
        }, e.prototype.initUI = function() {
            var i = this;
            !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.show(), 
            i.$nextArrow.show()), !0 === i.options.dots && i.slideCount > i.options.slidesToShow && i.$dots.show();
        }, e.prototype.keyHandler = function(i) {
            var e = this;
            i.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === i.keyCode && !0 === e.options.accessibility ? e.changeSlide({
                data: {
                    message: !0 === e.options.rtl ? "next" : "previous"
                }
            }) : 39 === i.keyCode && !0 === e.options.accessibility && e.changeSlide({
                data: {
                    message: !0 === e.options.rtl ? "previous" : "next"
                }
            }));
        }, e.prototype.lazyLoad = function() {
            function e(e) {
                i("img[data-lazy]", e).each((function() {
                    var e = i(this), t = i(this).attr("data-lazy"), o = i(this).attr("data-srcset"), s = i(this).attr("data-sizes") || n.$slider.attr("data-sizes"), r = document.createElement("img");
                    r.onload = function() {
                        e.animate({
                            opacity: 0
                        }, 100, (function() {
                            o && (e.attr("srcset", o), s && e.attr("sizes", s)), e.attr("src", t).animate({
                                opacity: 1
                            }, 200, (function() {
                                e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading");
                            })), n.$slider.trigger("lazyLoaded", [ n, e, t ]);
                        }));
                    }, r.onerror = function() {
                        e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), 
                        n.$slider.trigger("lazyLoadError", [ n, e, t ]);
                    }, r.src = t;
                }));
            }
            var t, o, s, n = this;
            if (!0 === n.options.centerMode ? !0 === n.options.infinite ? s = (o = n.currentSlide + (n.options.slidesToShow / 2 + 1)) + n.options.slidesToShow + 2 : (o = Math.max(0, n.currentSlide - (n.options.slidesToShow / 2 + 1)), 
            s = n.options.slidesToShow / 2 + 1 + 2 + n.currentSlide) : (o = n.options.infinite ? n.options.slidesToShow + n.currentSlide : n.currentSlide, 
            s = Math.ceil(o + n.options.slidesToShow), !0 === n.options.fade && (o > 0 && o--, 
            s <= n.slideCount && s++)), t = n.$slider.find(".slick-slide").slice(o, s), "anticipated" === n.options.lazyLoad) for (var r = o - 1, l = s, d = n.$slider.find(".slick-slide"), a = 0; a < n.options.slidesToScroll; a++) r < 0 && (r = n.slideCount - 1), 
            t = (t = t.add(d.eq(r))).add(d.eq(l)), r--, l++;
            e(t), n.slideCount <= n.options.slidesToShow ? e(n.$slider.find(".slick-slide")) : n.currentSlide >= n.slideCount - n.options.slidesToShow ? e(n.$slider.find(".slick-cloned").slice(0, n.options.slidesToShow)) : 0 === n.currentSlide && e(n.$slider.find(".slick-cloned").slice(-1 * n.options.slidesToShow));
        }, e.prototype.loadSlider = function() {
            var i = this;
            i.setPosition(), i.$slideTrack.css({
                opacity: 1
            }), i.$slider.removeClass("slick-loading"), i.initUI(), "progressive" === i.options.lazyLoad && i.progressiveLazyLoad();
        }, e.prototype.next = e.prototype.slickNext = function() {
            this.changeSlide({
                data: {
                    message: "next"
                }
            });
        }, e.prototype.orientationChange = function() {
            var i = this;
            i.checkResponsive(), i.setPosition();
        }, e.prototype.pause = e.prototype.slickPause = function() {
            var i = this;
            i.autoPlayClear(), i.paused = !0;
        }, e.prototype.play = e.prototype.slickPlay = function() {
            var i = this;
            i.autoPlay(), i.options.autoplay = !0, i.paused = !1, i.focussed = !1, i.interrupted = !1;
        }, e.prototype.postSlide = function(e) {
            var t = this;
            t.unslicked || (t.$slider.trigger("afterChange", [ t, e ]), t.animating = !1, t.slideCount > t.options.slidesToShow && t.setPosition(), 
            t.swipeLeft = null, t.options.autoplay && t.autoPlay(), !0 === t.options.accessibility && (t.initADA(), 
            t.options.focusOnChange && i(t.$slides.get(t.currentSlide)).attr("tabindex", 0).focus()));
        }, e.prototype.prev = e.prototype.slickPrev = function() {
            this.changeSlide({
                data: {
                    message: "previous"
                }
            });
        }, e.prototype.preventDefault = function(i) {
            i.preventDefault();
        }, e.prototype.progressiveLazyLoad = function(e) {
            e = e || 1;
            var t, o, s, n, r, l = this, d = i("img[data-lazy]", l.$slider);
            d.length ? (t = d.first(), o = t.attr("data-lazy"), s = t.attr("data-srcset"), n = t.attr("data-sizes") || l.$slider.attr("data-sizes"), 
            (r = document.createElement("img")).onload = function() {
                s && (t.attr("srcset", s), n && t.attr("sizes", n)), t.attr("src", o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"), 
                !0 === l.options.adaptiveHeight && l.setPosition(), l.$slider.trigger("lazyLoaded", [ l, t, o ]), 
                l.progressiveLazyLoad();
            }, r.onerror = function() {
                e < 3 ? setTimeout((function() {
                    l.progressiveLazyLoad(e + 1);
                }), 500) : (t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), 
                l.$slider.trigger("lazyLoadError", [ l, t, o ]), l.progressiveLazyLoad());
            }, r.src = o) : l.$slider.trigger("allImagesLoaded", [ l ]);
        }, e.prototype.refresh = function(e) {
            var t, o, s = this;
            o = s.slideCount - s.options.slidesToShow, !s.options.infinite && s.currentSlide > o && (s.currentSlide = o), 
            s.slideCount <= s.options.slidesToShow && (s.currentSlide = 0), t = s.currentSlide, 
            s.destroy(!0), i.extend(s, s.initials, {
                currentSlide: t
            }), s.init(), e || s.changeSlide({
                data: {
                    message: "index",
                    index: t
                }
            }, !1);
        }, e.prototype.registerBreakpoints = function() {
            var e, t, o, s = this, n = s.options.responsive || null;
            if ("array" === i.type(n) && n.length) {
                s.respondTo = s.options.respondTo || "window";
                for (e in n) if (o = s.breakpoints.length - 1, n.hasOwnProperty(e)) {
                    for (t = n[e].breakpoint; o >= 0; ) s.breakpoints[o] && s.breakpoints[o] === t && s.breakpoints.splice(o, 1), 
                    o--;
                    s.breakpoints.push(t), s.breakpointSettings[t] = n[e].settings;
                }
                s.breakpoints.sort((function(i, e) {
                    return s.options.mobileFirst ? i - e : e - i;
                }));
            }
        }, e.prototype.reinit = function() {
            var e = this;
            e.$slides = e.$slideTrack.children(e.options.slide).addClass("slick-slide"), e.slideCount = e.$slides.length, 
            e.currentSlide >= e.slideCount && 0 !== e.currentSlide && (e.currentSlide = e.currentSlide - e.options.slidesToScroll), 
            e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0), e.registerBreakpoints(), 
            e.setProps(), e.setupInfinite(), e.buildArrows(), e.updateArrows(), e.initArrowEvents(), 
            e.buildDots(), e.updateDots(), e.initDotEvents(), e.cleanUpSlideEvents(), e.initSlideEvents(), 
            e.checkResponsive(!1, !0), !0 === e.options.focusOnSelect && i(e.$slideTrack).children().on("click.slick", e.selectHandler), 
            e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), e.setPosition(), 
            e.focusHandler(), e.paused = !e.options.autoplay, e.autoPlay(), e.$slider.trigger("reInit", [ e ]);
        }, e.prototype.resize = function() {
            var e = this;
            i(window).width() !== e.windowWidth && (clearTimeout(e.windowDelay), e.windowDelay = window.setTimeout((function() {
                e.windowWidth = i(window).width(), e.checkResponsive(), e.unslicked || e.setPosition();
            }), 50));
        }, e.prototype.removeSlide = e.prototype.slickRemove = function(i, e, t) {
            var o = this;
            if (i = "boolean" == typeof i ? !0 === (e = i) ? 0 : o.slideCount - 1 : !0 === e ? --i : i, 
            o.slideCount < 1 || i < 0 || i > o.slideCount - 1) return !1;
            o.unload(), !0 === t ? o.$slideTrack.children().remove() : o.$slideTrack.children(this.options.slide).eq(i).remove(), 
            o.$slides = o.$slideTrack.children(this.options.slide), o.$slideTrack.children(this.options.slide).detach(), 
            o.$slideTrack.append(o.$slides), o.$slidesCache = o.$slides, o.reinit();
        }, e.prototype.setCSS = function(i) {
            var e, t, o = this, s = {};
            !0 === o.options.rtl && (i = -i), e = "left" == o.positionProp ? Math.ceil(i) + "px" : "0px", 
            t = "top" == o.positionProp ? Math.ceil(i) + "px" : "0px", s[o.positionProp] = i, 
            !1 === o.transformsEnabled ? o.$slideTrack.css(s) : (s = {}, !1 === o.cssTransitions ? (s[o.animType] = "translate(" + e + ", " + t + ")", 
            o.$slideTrack.css(s)) : (s[o.animType] = "translate3d(" + e + ", " + t + ", 0px)", 
            o.$slideTrack.css(s)));
        }, e.prototype.setDimensions = function() {
            var i = this;
            !1 === i.options.vertical ? !0 === i.options.centerMode && i.$list.css({
                padding: "0px " + i.options.centerPadding
            }) : (i.$list.height(i.$slides.first().outerHeight(!0) * i.options.slidesToShow), 
            !0 === i.options.centerMode && i.$list.css({
                padding: i.options.centerPadding + " 0px"
            })), i.listWidth = i.$list.width(), i.listHeight = i.$list.height(), !1 === i.options.vertical && !1 === i.options.variableWidth ? (i.slideWidth = Math.ceil(i.listWidth / i.options.slidesToShow), 
            i.$slideTrack.width(Math.ceil(i.slideWidth * i.$slideTrack.children(".slick-slide").length))) : !0 === i.options.variableWidth ? i.$slideTrack.width(5e3 * i.slideCount) : (i.slideWidth = Math.ceil(i.listWidth), 
            i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0) * i.$slideTrack.children(".slick-slide").length)));
            var e = i.$slides.first().outerWidth(!0) - i.$slides.first().width();
            !1 === i.options.variableWidth && i.$slideTrack.children(".slick-slide").width(i.slideWidth - e);
        }, e.prototype.setFade = function() {
            var e, t = this;
            t.$slides.each((function(o, s) {
                e = t.slideWidth * o * -1, !0 === t.options.rtl ? i(s).css({
                    position: "relative",
                    right: e,
                    top: 0,
                    zIndex: t.options.zIndex - 2,
                    opacity: 0
                }) : i(s).css({
                    position: "relative",
                    left: e,
                    top: 0,
                    zIndex: t.options.zIndex - 2,
                    opacity: 0
                });
            })), t.$slides.eq(t.currentSlide).css({
                zIndex: t.options.zIndex - 1,
                opacity: 1
            });
        }, e.prototype.setHeight = function() {
            var i = this;
            if (1 === i.options.slidesToShow && !0 === i.options.adaptiveHeight && !1 === i.options.vertical) {
                var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
                i.$list.css("height", e);
            }
        }, e.prototype.setOption = e.prototype.slickSetOption = function() {
            var e, t, o, s, n, r = this, l = !1;
            if ("object" === i.type(arguments[0]) ? (o = arguments[0], l = arguments[1], n = "multiple") : "string" === i.type(arguments[0]) && (o = arguments[0], 
            s = arguments[1], l = arguments[2], "responsive" === arguments[0] && "array" === i.type(arguments[1]) ? n = "responsive" : void 0 !== arguments[1] && (n = "single")), 
            "single" === n) r.options[o] = s; else if ("multiple" === n) i.each(o, (function(i, e) {
                r.options[i] = e;
            })); else if ("responsive" === n) for (t in s) if ("array" !== i.type(r.options.responsive)) r.options.responsive = [ s[t] ]; else {
                for (e = r.options.responsive.length - 1; e >= 0; ) r.options.responsive[e].breakpoint === s[t].breakpoint && r.options.responsive.splice(e, 1), 
                e--;
                r.options.responsive.push(s[t]);
            }
            l && (r.unload(), r.reinit());
        }, e.prototype.setPosition = function() {
            var i = this;
            i.setDimensions(), i.setHeight(), !1 === i.options.fade ? i.setCSS(i.getLeft(i.currentSlide)) : i.setFade(), 
            i.$slider.trigger("setPosition", [ i ]);
        }, e.prototype.setProps = function() {
            var i = this, e = document.body.style;
            i.positionProp = !0 === i.options.vertical ? "top" : "left", "top" === i.positionProp ? i.$slider.addClass("slick-vertical") : i.$slider.removeClass("slick-vertical"), 
            void 0 === e.WebkitTransition && void 0 === e.MozTransition && void 0 === e.msTransition || !0 === i.options.useCSS && (i.cssTransitions = !0), 
            i.options.fade && ("number" == typeof i.options.zIndex ? i.options.zIndex < 3 && (i.options.zIndex = 3) : i.options.zIndex = i.defaults.zIndex), 
            void 0 !== e.OTransform && (i.animType = "OTransform", i.transformType = "-o-transform", 
            i.transitionType = "OTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)), 
            void 0 !== e.MozTransform && (i.animType = "MozTransform", i.transformType = "-moz-transform", 
            i.transitionType = "MozTransition", void 0 === e.perspectiveProperty && void 0 === e.MozPerspective && (i.animType = !1)), 
            void 0 !== e.webkitTransform && (i.animType = "webkitTransform", i.transformType = "-webkit-transform", 
            i.transitionType = "webkitTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)), 
            void 0 !== e.msTransform && (i.animType = "msTransform", i.transformType = "-ms-transform", 
            i.transitionType = "msTransition", void 0 === e.msTransform && (i.animType = !1)), 
            void 0 !== e.transform && !1 !== i.animType && (i.animType = "transform", i.transformType = "transform", 
            i.transitionType = "transition"), i.transformsEnabled = i.options.useTransform && null !== i.animType && !1 !== i.animType;
        }, e.prototype.setSlideClasses = function(i) {
            var e, t, o, s, n = this;
            if (t = n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), 
            n.$slides.eq(i).addClass("slick-current"), !0 === n.options.centerMode) {
                var r = n.options.slidesToShow % 2 == 0 ? 1 : 0;
                e = Math.floor(n.options.slidesToShow / 2), !0 === n.options.infinite && (i >= e && i <= n.slideCount - 1 - e ? n.$slides.slice(i - e + r, i + e + 1).addClass("slick-active").attr("aria-hidden", "false") : (o = n.options.slidesToShow + i, 
                t.slice(o - e + 1 + r, o + e + 2).addClass("slick-active").attr("aria-hidden", "false")), 
                0 === i ? t.eq(t.length - 1 - n.options.slidesToShow).addClass("slick-center") : i === n.slideCount - 1 && t.eq(n.options.slidesToShow).addClass("slick-center")), 
                n.$slides.eq(i).addClass("slick-center");
            } else i >= 0 && i <= n.slideCount - n.options.slidesToShow ? n.$slides.slice(i, i + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : t.length <= n.options.slidesToShow ? t.addClass("slick-active").attr("aria-hidden", "false") : (s = n.slideCount % n.options.slidesToShow, 
            o = !0 === n.options.infinite ? n.options.slidesToShow + i : i, n.options.slidesToShow == n.options.slidesToScroll && n.slideCount - i < n.options.slidesToShow ? t.slice(o - (n.options.slidesToShow - s), o + s).addClass("slick-active").attr("aria-hidden", "false") : t.slice(o, o + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));
            "ondemand" !== n.options.lazyLoad && "anticipated" !== n.options.lazyLoad || n.lazyLoad();
        }, e.prototype.setupInfinite = function() {
            var e, t, o, s = this;
            if (!0 === s.options.fade && (s.options.centerMode = !1), !0 === s.options.infinite && !1 === s.options.fade && (t = null, 
            s.slideCount > s.options.slidesToShow)) {
                for (o = !0 === s.options.centerMode ? s.options.slidesToShow + 1 : s.options.slidesToShow, 
                e = s.slideCount; e > s.slideCount - o; e -= 1) t = e - 1, i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t - s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");
                for (e = 0; e < o + s.slideCount; e += 1) t = e, i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t + s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");
                s.$slideTrack.find(".slick-cloned").find("[id]").each((function() {
                    i(this).attr("id", "");
                }));
            }
        }, e.prototype.interrupt = function(i) {
            var e = this;
            i || e.autoPlay(), e.interrupted = i;
        }, e.prototype.selectHandler = function(e) {
            var t = this, o = i(e.target).is(".slick-slide") ? i(e.target) : i(e.target).parents(".slick-slide"), s = parseInt(o.attr("data-slick-index"));
            s || (s = 0), t.slideCount <= t.options.slidesToShow ? t.slideHandler(s, !1, !0) : t.slideHandler(s);
        }, e.prototype.slideHandler = function(i, e, t) {
            var o, s, n, r, l, d = null, a = this;
            if (e = e || !1, !(!0 === a.animating && !0 === a.options.waitForAnimate || !0 === a.options.fade && a.currentSlide === i)) if (!1 === e && a.asNavFor(i), 
            o = i, d = a.getLeft(o), r = a.getLeft(a.currentSlide), a.currentLeft = null === a.swipeLeft ? r : a.swipeLeft, 
            !1 === a.options.infinite && !1 === a.options.centerMode && (i < 0 || i > a.getDotCount() * a.options.slidesToScroll)) !1 === a.options.fade && (o = a.currentSlide, 
            !0 !== t ? a.animateSlide(r, (function() {
                a.postSlide(o);
            })) : a.postSlide(o)); else if (!1 === a.options.infinite && !0 === a.options.centerMode && (i < 0 || i > a.slideCount - a.options.slidesToScroll)) !1 === a.options.fade && (o = a.currentSlide, 
            !0 !== t ? a.animateSlide(r, (function() {
                a.postSlide(o);
            })) : a.postSlide(o)); else {
                if (a.options.autoplay && clearInterval(a.autoPlayTimer), s = o < 0 ? a.slideCount % a.options.slidesToScroll != 0 ? a.slideCount - a.slideCount % a.options.slidesToScroll : a.slideCount + o : o >= a.slideCount ? a.slideCount % a.options.slidesToScroll != 0 ? 0 : o - a.slideCount : o, 
                a.animating = !0, a.$slider.trigger("beforeChange", [ a, a.currentSlide, s ]), n = a.currentSlide, 
                a.currentSlide = s, a.setSlideClasses(a.currentSlide), a.options.asNavFor && (l = (l = a.getNavTarget()).slick("getSlick")).slideCount <= l.options.slidesToShow && l.setSlideClasses(a.currentSlide), 
                a.updateDots(), a.updateArrows(), !0 === a.options.fade) return !0 !== t ? (a.fadeSlideOut(n), 
                a.fadeSlide(s, (function() {
                    a.postSlide(s);
                }))) : a.postSlide(s), void a.animateHeight();
                !0 !== t ? a.animateSlide(d, (function() {
                    a.postSlide(s);
                })) : a.postSlide(s);
            }
        }, e.prototype.startLoad = function() {
            var i = this;
            !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.hide(), 
            i.$nextArrow.hide()), !0 === i.options.dots && i.slideCount > i.options.slidesToShow && i.$dots.hide(), 
            i.$slider.addClass("slick-loading");
        }, e.prototype.swipeDirection = function() {
            var i, e, t, o, s = this;
            return i = s.touchObject.startX - s.touchObject.curX, e = s.touchObject.startY - s.touchObject.curY, 
            t = Math.atan2(e, i), (o = Math.round(180 * t / Math.PI)) < 0 && (o = 360 - Math.abs(o)), 
            o <= 45 && o >= 0 ? !1 === s.options.rtl ? "left" : "right" : o <= 360 && o >= 315 ? !1 === s.options.rtl ? "left" : "right" : o >= 135 && o <= 225 ? !1 === s.options.rtl ? "right" : "left" : !0 === s.options.verticalSwiping ? o >= 35 && o <= 135 ? "down" : "up" : "vertical";
        }, e.prototype.swipeEnd = function(i) {
            var e, t, o = this;
            if (o.dragging = !1, o.swiping = !1, o.scrolling) return o.scrolling = !1, !1;
            if (o.interrupted = !1, o.shouldClick = !(o.touchObject.swipeLength > 10), void 0 === o.touchObject.curX) return !1;
            if (!0 === o.touchObject.edgeHit && o.$slider.trigger("edge", [ o, o.swipeDirection() ]), 
            o.touchObject.swipeLength >= o.touchObject.minSwipe) {
                switch (t = o.swipeDirection()) {
                  case "left":
                  case "down":
                    e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide + o.getSlideCount()) : o.currentSlide + o.getSlideCount(), 
                    o.currentDirection = 0;
                    break;

                  case "right":
                  case "up":
                    e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide - o.getSlideCount()) : o.currentSlide - o.getSlideCount(), 
                    o.currentDirection = 1;
                }
                "vertical" != t && (o.slideHandler(e), o.touchObject = {}, o.$slider.trigger("swipe", [ o, t ]));
            } else o.touchObject.startX !== o.touchObject.curX && (o.slideHandler(o.currentSlide), 
            o.touchObject = {});
        }, e.prototype.swipeHandler = function(i) {
            var e = this;
            if (!(!1 === e.options.swipe || "ontouchend" in document && !1 === e.options.swipe || !1 === e.options.draggable && -1 !== i.type.indexOf("mouse"))) switch (e.touchObject.fingerCount = i.originalEvent && void 0 !== i.originalEvent.touches ? i.originalEvent.touches.length : 1, 
            e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold, !0 === e.options.verticalSwiping && (e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold), 
            i.data.action) {
              case "start":
                e.swipeStart(i);
                break;

              case "move":
                e.swipeMove(i);
                break;

              case "end":
                e.swipeEnd(i);
            }
        }, e.prototype.swipeMove = function(i) {
            var e, t, o, s, n, r, l = this;
            return n = void 0 !== i.originalEvent ? i.originalEvent.touches : null, !(!l.dragging || l.scrolling || n && 1 !== n.length) && (e = l.getLeft(l.currentSlide), 
            l.touchObject.curX = void 0 !== n ? n[0].pageX : i.clientX, l.touchObject.curY = void 0 !== n ? n[0].pageY : i.clientY, 
            l.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(l.touchObject.curX - l.touchObject.startX, 2))), 
            r = Math.round(Math.sqrt(Math.pow(l.touchObject.curY - l.touchObject.startY, 2))), 
            !l.options.verticalSwiping && !l.swiping && r > 4 ? (l.scrolling = !0, !1) : (!0 === l.options.verticalSwiping && (l.touchObject.swipeLength = r), 
            t = l.swipeDirection(), void 0 !== i.originalEvent && l.touchObject.swipeLength > 4 && (l.swiping = !0, 
            i.preventDefault()), s = (!1 === l.options.rtl ? 1 : -1) * (l.touchObject.curX > l.touchObject.startX ? 1 : -1), 
            !0 === l.options.verticalSwiping && (s = l.touchObject.curY > l.touchObject.startY ? 1 : -1), 
            o = l.touchObject.swipeLength, l.touchObject.edgeHit = !1, !1 === l.options.infinite && (0 === l.currentSlide && "right" === t || l.currentSlide >= l.getDotCount() && "left" === t) && (o = l.touchObject.swipeLength * l.options.edgeFriction, 
            l.touchObject.edgeHit = !0), !1 === l.options.vertical ? l.swipeLeft = e + o * s : l.swipeLeft = e + o * (l.$list.height() / l.listWidth) * s, 
            !0 === l.options.verticalSwiping && (l.swipeLeft = e + o * s), !0 !== l.options.fade && !1 !== l.options.touchMove && (!0 === l.animating ? (l.swipeLeft = null, 
            !1) : void l.setCSS(l.swipeLeft))));
        }, e.prototype.swipeStart = function(i) {
            var e, t = this;
            if (t.interrupted = !0, 1 !== t.touchObject.fingerCount || t.slideCount <= t.options.slidesToShow) return t.touchObject = {}, 
            !1;
            void 0 !== i.originalEvent && void 0 !== i.originalEvent.touches && (e = i.originalEvent.touches[0]), 
            t.touchObject.startX = t.touchObject.curX = void 0 !== e ? e.pageX : i.clientX, 
            t.touchObject.startY = t.touchObject.curY = void 0 !== e ? e.pageY : i.clientY, 
            t.dragging = !0;
        }, e.prototype.unfilterSlides = e.prototype.slickUnfilter = function() {
            var i = this;
            null !== i.$slidesCache && (i.unload(), i.$slideTrack.children(this.options.slide).detach(), 
            i.$slidesCache.appendTo(i.$slideTrack), i.reinit());
        }, e.prototype.unload = function() {
            var e = this;
            i(".slick-cloned", e.$slider).remove(), e.$dots && e.$dots.remove(), e.$prevArrow && e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.remove(), 
            e.$nextArrow && e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.remove(), e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "");
        }, e.prototype.unslick = function(i) {
            var e = this;
            e.$slider.trigger("unslick", [ e, i ]), e.destroy();
        }, e.prototype.updateArrows = function() {
            var i = this;
            Math.floor(i.options.slidesToShow / 2), !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && !i.options.infinite && (i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 
            i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === i.currentSlide ? (i.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), 
            i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : i.currentSlide >= i.slideCount - i.options.slidesToShow && !1 === i.options.centerMode ? (i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), 
            i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : i.currentSlide >= i.slideCount - 1 && !0 === i.options.centerMode && (i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), 
            i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")));
        }, e.prototype.updateDots = function() {
            var i = this;
            null !== i.$dots && (i.$dots.find("li").removeClass("slick-active").end(), i.$dots.find("li").eq(Math.floor(i.currentSlide / i.options.slidesToScroll)).addClass("slick-active"));
        }, e.prototype.visibility = function() {
            var i = this;
            i.options.autoplay && (document[i.hidden] ? i.interrupted = !0 : i.interrupted = !1);
        }, i.fn.slick = function() {
            var i, t, o = this, s = arguments[0], n = Array.prototype.slice.call(arguments, 1), r = o.length;
            for (i = 0; i < r; i++) if ("object" == typeof s || void 0 === s ? o[i].slick = new e(o[i], s) : t = o[i].slick[s].apply(o[i].slick, n), 
            void 0 !== t) return t;
            return o;
        };
    }));
    document.getElementById("email");
    document.getElementById("passwordEntry");
    document.querySelector(".entry__login-button");
    if (document.getElementById("email") && document.getElementById("passwordEntry") && document.querySelector(".entry__login-button")) {
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("passwordEntry");
        const loginButton = document.querySelector(".entry__login-button");
        function checkFields() {
            const emailValue = emailInput.value.trim();
            const passwordValue = passwordInput.value.trim();
            if (emailValue !== "" && passwordValue !== "" && isValidEmail(emailValue)) loginButton.classList.add("_active"); else loginButton.classList.remove("_active");
        }
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        emailInput.addEventListener("input", checkFields);
        passwordInput.addEventListener("input", checkFields);
    }
    const favoriteButtons = document.querySelectorAll(".card__favorite");
    function handleFavoriteClick(event) {
        const parentSpan = event.target.closest(".card__favorite");
        parentSpan.classList.toggle("_in-favorite");
    }
    favoriteButtons.forEach((button => {
        button.addEventListener("click", handleFavoriteClick);
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        const nameItems = document.querySelectorAll(".return__name");
        const textItems = document.querySelectorAll(".return__text");
        if (nameItems.length === 0 || textItems.length === 0) return;
        nameItems.forEach(((item, index) => {
            item.addEventListener("click", (() => {
                nameItems.forEach((nameItem => {
                    nameItem.classList.remove("_return__name-active");
                }));
                textItems.forEach((textItem => {
                    textItem.classList.remove("_return__text-active");
                }));
                item.classList.add("_return__name-active");
                textItems[index].classList.add("_return__text-active");
            }));
        }));
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        const nameItems = document.querySelectorAll(".favorite__filter-item");
        const textItems = document.querySelectorAll(".favorite__content-wrapper");
        if (nameItems.length === 0 || textItems.length === 0) return;
        nameItems.forEach(((item, index) => {
            item.addEventListener("click", (() => {
                nameItems.forEach((nameItem => {
                    nameItem.classList.remove("_favorite__filter-active");
                }));
                textItems.forEach((textItem => {
                    textItem.classList.remove("_favorite__content-active");
                }));
                item.classList.add("_favorite__filter-active");
                textItems[index].classList.add("_favorite__content-active");
            }));
        }));
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        const nameItems = document.querySelectorAll(".faq__name");
        const textItems = document.querySelectorAll(".faq__elements");
        if (nameItems.length === 0 || textItems.length === 0) return;
        nameItems.forEach(((item, index) => {
            item.addEventListener("click", (() => {
                nameItems.forEach((nameItem => {
                    nameItem.classList.remove("_faq__name-active");
                }));
                textItems.forEach((textItem => {
                    textItem.classList.remove("_faq__elements-active");
                }));
                item.classList.add("_faq__name-active");
                textItems[index].classList.add("_faq__elements-active");
            }));
        }));
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        const nameItems = document.querySelectorAll(".acc__btn");
        const textItems = document.querySelectorAll(".acc__wishes-box");
        if (nameItems.length === 0 || textItems.length === 0) return;
        nameItems.forEach(((item, index) => {
            item.addEventListener("click", (() => {
                nameItems.forEach((nameItem => {
                    nameItem.classList.remove("account__wishes-link_activate");
                }));
                textItems.forEach((textItem => {
                    textItem.classList.remove("account__wishes-box_activate");
                }));
                item.classList.add("account__wishes-link_activate");
                textItems[index].classList.add("account__wishes-box_activate");
            }));
        }));
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        const nameItems = document.querySelectorAll(".blog__filter-button");
        const textItems = document.querySelectorAll(".blog-cards__wrapper");
        if (nameItems.length === 0 || textItems.length === 0) return;
        nameItems.forEach(((item, index) => {
            item.addEventListener("click", (() => {
                nameItems.forEach((nameItem => {
                    nameItem.classList.remove("_blog-btn__active");
                }));
                textItems.forEach((textItem => {
                    textItem.classList.remove("_blog-cards__active");
                }));
                item.classList.add("_blog-btn__active");
                textItems[index].classList.add("_blog-cards__active");
            }));
        }));
    }));
    jQuery(document).ready((function() {
        jQuery("#showPass3").click((function() {
            var passwordInput = jQuery("#passwordEntry");
            var passwordIcon = jQuery("#showPass3 i");
            if (passwordInput.attr("type") == "password") {
                passwordInput.attr("type", "text");
                passwordIcon.toggle();
            } else {
                passwordInput.attr("type", "password");
                passwordIcon.toggle();
            }
        }));
    }));
    if (document.getElementById("regTelephone") && document.getElementById("email") && document.getElementById("RegUserName") && document.getElementById("regPassword") && document.getElementById("regPasswordRepeat") && document.getElementById("regCheckbox") && document.querySelector(".reg__login-button")) {
        const telephoneInput = document.getElementById("regTelephone");
        const emailInput = document.getElementById("email");
        const userNameInput = document.getElementById("RegUserName");
        const passwordInput = document.getElementById("regPassword");
        const passwordRepeatInput = document.getElementById("regPasswordRepeat");
        const checkboxInput = document.getElementById("regCheckbox");
        const registerButton = document.querySelector(".reg__login-button");
        function checkFields() {
            const telephoneValue = telephoneInput.value.trim();
            const emailValue = emailInput.value.trim();
            const userNameValue = userNameInput.value.trim();
            const passwordValue = passwordInput.value.trim();
            const passwordRepeatValue = passwordRepeatInput.value.trim();
            const checkboxChecked = checkboxInput.checked;
            if (telephoneValue !== "" && emailValue !== "" && userNameValue !== "" && passwordValue !== "" && passwordRepeatValue !== "" && checkboxChecked && isValidEmail(emailValue)) registerButton.classList.add("_active"); else registerButton.classList.remove("_active");
        }
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        telephoneInput.addEventListener("input", checkFields);
        emailInput.addEventListener("input", checkFields);
        userNameInput.addEventListener("input", checkFields);
        passwordInput.addEventListener("input", checkFields);
        passwordRepeatInput.addEventListener("input", checkFields);
        checkboxInput.addEventListener("change", checkFields);
    }
    let sidebarIcon = document.querySelector(".sidebarIcon");
    let sidebar = document.querySelector(".sidebar");
    let wrapper = document.querySelector(".wrapper");
    let windowWidth = window.innerWidth;
    sidebarIcon.addEventListener("click", (() => {
        sidebar.classList.add("sidebar-activate");
        disableScroll();
    }));
    let sidebar__exit = document.querySelector(".sidebar__exit");
    sidebar__exit.addEventListener("click", (() => {
        sidebar.classList.remove("sidebar-activate");
        enableScroll();
    }));
    if (windowWidth > 768) sidebar.classList.remove("sidebar-activate");
    window.addEventListener("resize", (() => {
        windowWidth = window.innerWidth;
        if (windowWidth > 768) {
            sidebar.classList.remove("sidebar-activate");
            enableScroll();
        }
    }));
    function disableScroll() {
        document.body.style.overflow = "auto";
        wrapper.style.position = "fixed";
    }
    function enableScroll() {
        document.body.style.overflow = "auto";
        wrapper.style.position = "static";
    }
    let sidebar__catalog = document.querySelector(".sidebar__catalog");
    let mega__menu = document.querySelector(".mega-menu__wrap");
    sidebar__catalog.addEventListener("click", (() => {
        sidebar.classList.add("z-index-hidden");
        mega__menu.classList.add("mega-menu__active");
    }));
    let menu__exit = document.querySelector(".mega-menu__exit");
    menu__exit.addEventListener("click", (() => {
        sidebar.classList.remove("z-index-hidden");
        mega__menu.classList.remove("mega-menu__active");
    }));
    if (document.getElementById("regPassword") && document.getElementById("regPasswordRepeat") && document.getElementById("regEye1") && document.getElementById("regEye2")) {
        const passwordInput = document.getElementById("regPassword");
        const passwordRepeatInput = document.getElementById("regPasswordRepeat");
        const showPass1 = document.getElementById("regEye1");
        const showPass2 = document.getElementById("regEye2");
        showPass1.addEventListener("click", (function() {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                showPass1.style.display = "none";
            } else passwordInput.type = "password";
        }));
        showPass2.addEventListener("click", (function() {
            if (passwordRepeatInput.type === "password") {
                passwordRepeatInput.type = "text";
                showPass2.style.display = "none";
            } else passwordRepeatInput.type = "password";
        }));
    }
    jQuery(".home-bunner__slider").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2e3,
        dots: true,
        prevArrow: '<button type="button" class="slick-prev"><img src="./img/arrow-prev.svg"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="./img/arrow-next.svg"></button>'
    });
    const script_button = document.querySelector("#off");
    const content = document.querySelector("#content");
    script_button.addEventListener("click", (function() {
        content.classList.toggle("header__ticker-hidden");
    }));
    jQuery(".pops-categori__slider").slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2e3,
        arrows: true,
        dots: false,
        prevArrow: '<button type="button" class="slick-prev pops-prev__btn"><img src="./img/arrow-prev.svg"></button>',
        nextArrow: '<button type="button" class="slick-next pops-next__btn"><img src="./img/arrow-next.svg"></button>',
        responsive: [ {
            breakpoint: 1024,
            settings: {
                slidesToShow: 4
            }
        }, {
            breakpoint: 750,
            settings: {
                slidesToShow: 3
            }
        }, {
            breakpoint: 550,
            settings: {
                slidesToShow: 1.8
            }
        }, {
            breakpoint: 450,
            settings: {
                slidesToShow: 1.8
            }
        } ]
    });
    jQuery(".popular-categori__slider").slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2e3,
        arrow: true,
        dots: false,
        prevArrow: '<button type="button" class="slick-prev"><img src="./img/arrow-prev.svg"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="./img/arrow-next.svg"></button>',
        responsive: [ {
            breakpoint: 1200,
            settings: {
                slidesToShow: 6
            }
        }, {
            breakpoint: 992,
            settings: {
                slidesToShow: 4.5
            }
        }, {
            breakpoint: 769,
            settings: {
                slidesToShow: 4
            }
        }, {
            breakpoint: 600,
            settings: {
                slidesToShow: 3
            }
        }, {
            breakpoint: 550,
            settings: {
                slidesToShow: 2.5
            }
        }, {
            breakpoint: 450,
            settings: {
                slidesToShow: 2
            }
        } ]
    });
    jQuery(".brends__slider").slick({
        slidesToShow: 8,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2e3,
        arrow: true,
        dots: false,
        prevArrow: '<button type="button" class="slick-prev"><img src="./img/arrow-prev.svg"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="./img/arrow-next.svg"></button>',
        responsive: [ {
            breakpoint: 1200,
            settings: {
                slidesToShow: 8
            }
        }, {
            breakpoint: 992,
            settings: {
                slidesToShow: 7
            }
        }, {
            breakpoint: 769,
            settings: {
                slidesToShow: 6
            }
        }, {
            breakpoint: 600,
            settings: {
                slidesToShow: 4
            }
        }, {
            breakpoint: 450,
            settings: {
                slidesToShow: 2.4
            }
        } ]
    });
    jQuery(".recently__slider").slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2e3,
        arrow: true,
        dots: false,
        prevArrow: '<button type="button" class="slick-prev"><img src="./img/arrow-prev.svg"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="./img/arrow-next.svg"></button>',
        responsive: [ {
            breakpoint: 1200,
            settings: {
                slidesToShow: 4
            }
        }, {
            breakpoint: 992,
            settings: {
                slidesToShow: 3
            }
        }, {
            breakpoint: 769,
            settings: {
                slidesToShow: 3
            }
        }, {
            breakpoint: 600,
            settings: {
                slidesToShow: 2.5
            }
        }, {
            breakpoint: 550,
            settings: {
                slidesToShow: 2
            }
        }, {
            breakpoint: 450,
            settings: {
                slidesToShow: 2
            }
        } ]
    });
    jQuery(".wallpaper_slider-home").slick({
        slidesToShow: 8,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2e3,
        arrow: true,
        dots: false,
        prevArrow: '<button type="button" class="slick-prev"><img src="./img/arrow-prev.svg"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="./img/arrow-next.svg"></button>',
        responsive: [ {
            breakpoint: 990,
            settings: {
                slidesToShow: 4
            }
        }, {
            breakpoint: 890,
            settings: {
                slidesToShow: 3
            }
        }, {
            breakpoint: 670,
            settings: {
                slidesToShow: 2.5
            }
        }, {
            breakpoint: 560,
            settings: {
                slidesToShow: 2.3
            }
        }, {
            breakpoint: 530,
            settings: {
                slidesToShow: 2.1
            }
        }, {
            breakpoint: 450,
            settings: {
                slidesToShow: 1.8
            }
        } ]
    });
    jQuery(".laminate_slider-home").slick({
        slidesToShow: 8,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2e3,
        arrow: true,
        dots: false,
        prevArrow: '<button type="button" class="slick-prev"><img src="./img/arrow-prev.svg"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="./img/arrow-next.svg"></button>',
        responsive: [ {
            breakpoint: 990,
            settings: {
                slidesToShow: 4
            }
        }, {
            breakpoint: 890,
            settings: {
                slidesToShow: 3
            }
        }, {
            breakpoint: 670,
            settings: {
                slidesToShow: 2.5
            }
        }, {
            breakpoint: 560,
            settings: {
                slidesToShow: 2.3
            }
        }, {
            breakpoint: 530,
            settings: {
                slidesToShow: 2.1
            }
        }, {
            breakpoint: 450,
            settings: {
                slidesToShow: 1.8
            }
        } ]
    });
    jQuery(".vinyl_slider-home").slick({
        slidesToShow: 8,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2e3,
        arrow: true,
        dots: false,
        prevArrow: '<button type="button" class="slick-prev"><img src="./img/arrow-prev.svg"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="./img/arrow-next.svg"></button>',
        responsive: [ {
            breakpoint: 990,
            settings: {
                slidesToShow: 4
            }
        }, {
            breakpoint: 890,
            settings: {
                slidesToShow: 3
            }
        }, {
            breakpoint: 670,
            settings: {
                slidesToShow: 2.5
            }
        }, {
            breakpoint: 560,
            settings: {
                slidesToShow: 2.3
            }
        }, {
            breakpoint: 530,
            settings: {
                slidesToShow: 2.1
            }
        }, {
            breakpoint: 450,
            settings: {
                slidesToShow: 1.8
            }
        } ]
    });
    jQuery(".plinth_slider-home").slick({
        slidesToShow: 8,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2e3,
        arrow: true,
        dots: false,
        prevArrow: '<button type="button" class="slick-prev"><img src="./img/arrow-prev.svg"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="./img/arrow-next.svg"></button>',
        responsive: [ {
            breakpoint: 990,
            settings: {
                slidesToShow: 4
            }
        }, {
            breakpoint: 890,
            settings: {
                slidesToShow: 3
            }
        }, {
            breakpoint: 670,
            settings: {
                slidesToShow: 2.5
            }
        }, {
            breakpoint: 560,
            settings: {
                slidesToShow: 2.3
            }
        }, {
            breakpoint: 530,
            settings: {
                slidesToShow: 2.1
            }
        }, {
            breakpoint: 450,
            settings: {
                slidesToShow: 1.8
            }
        } ]
    });
    jQuery(".calc");
    jQuery("body").click((function(event) {
        jQuery(event.target);
        if (event.target.className == "button-calc") {
            let sign = event.target.value;
            let jQuerywrapper = jQuery(event.target).closest(".calc"), jQueryamount = jQuerywrapper.find(".amount"), amountInit = parseInt(jQuerywrapper.find(".amount-init").html()), finalAmount = parseInt(jQueryamount.html()), jQueryqty = jQuerywrapper.find(".qty"), qty = parseInt(jQueryqty.html());
            if (sign == "-") {
                finalAmount = parseInt(jQueryamount.html()) - amountInit;
                qty--;
            } else {
                finalAmount = parseInt(jQueryamount.html()) + amountInit;
                qty++;
            }
            jQueryamount.html(finalAmount < amountInit ? amountInit : finalAmount);
            jQueryqty.html(qty < 1 ? 1 : qty);
        }
    }));
    function megaMenu(selector) {
        let menu = jQuery(selector);
        let button = jQuery(".catalog__btn");
        let links = jQuery(".menu__hidden-link");
        let overlay = jQuery(".overlay");
        button.on("click", (e => {
            e.preventDefault();
            toggleMenu();
        }));
        links.on("click", (() => toggleMenu()));
        overlay.on("click", (() => toggleMenu()));
        function toggleMenu() {
            overlay.toggleClass("overlay__active");
            menu.toggleClass("mega-menu__active");
        }
    }
    megaMenu(".mega-menu__wrap");
    function searchMenu(selector) {
        let menu = jQuery(selector);
        let button = jQuery(".search");
        let links = jQuery(".search__list-link");
        let overlaySearch = jQuery(".overlay__search");
        button.on("click", (e => {
            e.preventDefault();
            toggleMenu();
        }));
        links.on("click", (() => toggleMenu()));
        overlaySearch.on("click", (() => toggleMenu()));
        function toggleMenu() {
            overlaySearch.toggleClass("overlay__search-active");
            menu.toggleClass("search__active");
        }
    }
    searchMenu(".search__list-wrap");
    jQuery(".select-interer__slider").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: ".interier__slider-nav"
    });
    jQuery(".interier__slider-nav").slick({
        slidesToShow: 5,
        slidesToScroll: 2,
        asNavFor: ".select-interer__slider",
        dots: false,
        centerMode: false,
        focusOnSelect: true,
        fade: false,
        arrows: true,
        prevArrow: '<button type="button" class="slick-prev"><img src="./img/arrow-prev.svg"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="./img/arrow-next.svg"></button>',
        responsive: [ {
            breakpoint: 560,
            settings: {
                slidesToShow: 5
            }
        } ]
    });
    jQuery(document).ready((function() {
        jQuery(".show-more__btn").click((function() {
            jQuery(".cards__block-hidden").slideToggle(900, (function() {
                if (jQuery(this).is(":hidden")) jQuery(".show-more__btn").removeClass("show-more__btn-active"); else jQuery(".show-more__btn").addClass("show-more__btn-active");
            }));
            return false;
        }));
    }));
    jQuery(document).ready((function() {
        function togglePasswordInput(passwordInput, passwordIcon) {
            if (passwordInput.attr("type") == "password") {
                passwordInput.attr("type", "text");
                passwordIcon.toggle();
            } else {
                passwordInput.attr("type", "password");
                passwordIcon.toggle();
            }
        }
        if (jQuery("#password").length > 0 && jQuery("#showPass1").length > 0) jQuery("#showPass1").click((function() {
            var passwordInput = jQuery("#password");
            var passwordIcon = jQuery("#showPass1 i");
            togglePasswordInput(passwordInput, passwordIcon);
        }));
        if (jQuery("#passwordRepeat").length > 0 && jQuery("#showPass2").length > 0) jQuery("#showPass2").click((function() {
            var passwordRepeatInput = jQuery("#passwordRepeat");
            var passwordRepeatIcon = jQuery("#showPass2 #eye2");
            togglePasswordInput(passwordRepeatInput, passwordRepeatIcon);
        }));
    }));
    document.addEventListener("click", (event => {
        if (document.querySelector(".menu__1lvl").contains(event.target) && event.target.className != "submenu-mobile__exit" && !event.target.closest(".submenu-mobile")) if (event.target.closest(".subsection")) event.target.parentNode.parentNode.parentNode.querySelector(".submenu-mobile").classList.add("submenu-mobile__active"); else event.target.parentNode.querySelector(".submenu-mobile").classList.add("submenu-mobile__active");
    }));
    document.addEventListener("click", (event => {
        if (event.target.classList.contains("submenu-mobile__exit")) {
            let submenu__active = document.querySelector(".submenu-mobile__active");
            submenu__active.classList.remove("submenu-mobile__active");
        }
    }));
    document.addEventListener("click", (event => {
        if (event.target.closest(".submenu-mobile__link")) event.target.closest(".submenu-mobile__link").querySelector(".submenu-mobileSection").classList.add("submenu-mobileSection__active");
    }));
    document.addEventListener("click", (event => {
        if (event.target.classList.contains("submenu-mobileSection__exit")) event.target.closest(".submenu-mobileSection__active").classList.remove("submenu-mobileSection__active");
    }));
    $(document).ready((function() {
        function checkElements() {
            if ($(".pc__check_box-1").length > 0) {
                var pc__check_box = 5;
                var hidepc__check_box = "Скрыть";
                var showpc__check_box = "Показать ещё";
                $(".archive").html(showpc__check_box);
                $(".pc__check_box-1:not(:lt(" + pc__check_box + "))").hide();
                if ($(".pc__check_box-1").length > 5) $(".archive").show(); else $(".archive").hide();
                $(".archive").click((function(e) {
                    e.preventDefault();
                    if ($(".pc__check_box-1:eq(" + pc__check_box + ")").is(":hidden")) {
                        $(".pc__check_box-1:hidden").show();
                        $(".archive").html(hidepc__check_box);
                    } else {
                        $(".pc__check_box-1:not(:lt(" + pc__check_box + "))").hide();
                        $(".archive").html(showpc__check_box);
                    }
                }));
            }
            if ($(".pc__check_box-2").length > 0) {
                var pc__check_box_2 = 5;
                var hidepc__check_box_2 = "Скрыть";
                var showpc__check_box_2 = "Показать ещё";
                $(".archive_1").html(showpc__check_box_2);
                $(".pc__check_box-2:not(:lt(" + pc__check_box_2 + "))").hide();
                if ($(".pc__check_box-2").length > 5) $(".archive_1").show(); else $(".archive_1").hide();
                $(".archive_1").click((function(e) {
                    e.preventDefault();
                    if ($(".pc__check_box-2:eq(" + pc__check_box_2 + ")").is(":hidden")) {
                        $(".pc__check_box-2:hidden").show();
                        $(".archive_1").html(hidepc__check_box_2);
                    } else {
                        $(".pc__check_box-2:not(:lt(" + pc__check_box_2 + "))").hide();
                        $(".archive_1").html(showpc__check_box_2);
                    }
                }));
            }
            if ($(".pc__check_box-3").length > 0) {
                $(".archive_2").html(showpc__check_box);
                $(".pc__check_box-3:not(:lt(" + pc__check_box + "))").hide();
                if ($(".pc__check_box-3").length > 5) $(".archive_2").show(); else $(".archive_2").hide();
                $(".archive_2").click((function(e) {
                    e.preventDefault();
                    if ($(".pc__check_box-3:eq(" + pc__check_box + ")").is(":hidden")) {
                        $(".pc__check_box-3:hidden").show();
                        $(".archive_2").html(hidepc__check_box);
                    } else {
                        $(".pc__check_box-3:not(:lt(" + pc__check_box + "))").hide();
                        $(".archive_2").html(showpc__check_box);
                    }
                }));
            }
            if ($(".pc__check_box-4").length > 0) {
                $(".archive_3").html(showpc__check_box);
                $(".pc__check_box-4:not(:lt(" + pc__check_box + "))").hide();
                if ($(".pc__check_box-4").length > 5) $(".archive_3").show(); else $(".archive_3").hide();
                $(".archive_3").click((function(e) {
                    e.preventDefault();
                    if ($(".pc__check_box-4:eq(" + pc__check_box + ")").is(":hidden")) {
                        $(".pc__check_box-4:hidden").show();
                        $(".archive_3").html(hidepc__check_box);
                    } else {
                        $(".pc__check_box-4:not(:lt(" + pc__check_box + "))").hide();
                        $(".archive_3").html(showpc__check_box);
                    }
                }));
            }
            if ($(".pc__check_box-5").length > 0) {
                $(".archive_4").html(showpc__check_box);
                $(".pc__check_box-5:not(:lt(" + pc__check_box + "))").hide();
                if ($(".pc__check_box-5").length > 5) $(".archive_4").show(); else $(".archive_4").hide();
                $(".archive_4").click((function(e) {
                    e.preventDefault();
                    if ($(".pc__check_box-5:eq(" + pc__check_box + ")").is(":hidden")) {
                        $(".pc__check_box-5:hidden").show();
                        $(".archive_4").html(hidepc__check_box);
                    } else {
                        $(".pc__check_box-5:not(:lt(" + pc__check_box + "))").hide();
                        $(".archive_4").html(showpc__check_box);
                    }
                }));
            }
        }
        checkElements();
    }));
    $(document).ready((function() {
        function checkElements() {
            let buttonBaseOrder = document.querySelector(".ordering__link_base");
            let ContainerBaseOrder = document.querySelector(".ordering__base-order");
            if (buttonBaseOrder && ContainerBaseOrder) buttonBaseOrder.addEventListener("click", (event => {
                event.preventDefault();
                let buttonQuickOrder = document.querySelector(".ordering__link_quick");
                let ContainerQuickOrder = document.querySelector(".ordering__quick-order");
                buttonQuickOrder.classList.remove("ordering__link_selected");
                buttonBaseOrder.classList.add("ordering__link_selected");
                ContainerBaseOrder.removeAttribute("hidden");
                ContainerQuickOrder.setAttribute("hidden", "true");
            }));
            let buttonQuickOrder = document.querySelector(".ordering__link_quick");
            let ContainerQuickOrder = document.querySelector(".ordering__quick-order");
            if (buttonQuickOrder && ContainerQuickOrder) buttonQuickOrder.addEventListener("click", (event => {
                event.preventDefault();
                let buttonBaseOrder = document.querySelector(".ordering__link_base");
                let ContainerBaseOrder = document.querySelector(".ordering__base-order");
                buttonBaseOrder.classList.remove("ordering__link_selected");
                buttonQuickOrder.classList.add("ordering__link_selected");
                ContainerQuickOrder.removeAttribute("hidden");
                ContainerBaseOrder.setAttribute("hidden", "true");
            }));
        }
        checkElements();
    }));
    function initializeSlider() {
        const rangeInput = document.querySelectorAll(".range-input input"), priceInput = document.querySelectorAll(".price-input input"), range = document.querySelector(".pc__slider .progress");
        let priceGap = 100;
        priceInput.forEach((input => {
            input.addEventListener("input", (e => {
                let minPrice = parseInt(priceInput[0].value), maxPrice = parseInt(priceInput[1].value);
                if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) if (e.target.className === "input-min") {
                    rangeInput[0].value = minPrice;
                    range.style.left = minPrice / rangeInput[0].max * 100 + "%";
                } else {
                    rangeInput[1].value = maxPrice;
                    range.style.right = 100 - maxPrice / rangeInput[1].max * 100 + "%";
                }
            }));
        }));
        rangeInput.forEach((input => {
            input.addEventListener("input", (e => {
                let minVal = parseInt(rangeInput[0].value), maxVal = parseInt(rangeInput[1].value);
                if (maxVal - minVal < priceGap) if (e.target.className === "range-min") rangeInput[0].value = maxVal - priceGap; else rangeInput[1].value = minVal + priceGap; else {
                    priceInput[0].value = minVal;
                    priceInput[1].value = maxVal;
                    range.style.left = minVal / rangeInput[0].max * 100 + "%";
                    range.style.right = 100 - maxVal / rangeInput[1].max * 100 + "%";
                }
            }));
        }));
    }
    document.addEventListener("DOMContentLoaded", (() => {
        const rangeInputExists = document.querySelector(".range-input input");
        const priceInputExists = document.querySelector(".price-input input");
        const rangeExists = document.querySelector(".pc__slider .progress");
        if (rangeInputExists && priceInputExists && rangeExists) initializeSlider();
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        const dd = document.querySelector("#dropdown-wrapper");
        const links = document.querySelectorAll(".dropdown-list a");
        const span = document.querySelector(".dropdown-span");
        if (dd && links.length > 0 && span) {
            dd.addEventListener("click", (function() {
                this.classList.toggle("is-active");
            }));
            links.forEach((element => {
                element.addEventListener("click", (function(evt) {
                    evt.preventDefault();
                    span.innerHTML = evt.currentTarget.textContent;
                }));
            }));
        }
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        const dd = document.querySelector("#dropdown-wrapper1");
        const links = document.querySelectorAll(".dropdown-list1 a");
        const span = document.querySelector(".dropdown-span1");
        if (dd && links.length > 0 && span) {
            dd.addEventListener("click", (function() {
                this.classList.toggle("is-activee");
            }));
            links.forEach((element => {
                element.addEventListener("click", (function(evt) {
                    evt.preventDefault();
                    span.innerHTML = evt.currentTarget.textContent;
                }));
            }));
        }
    }));
    const showFilterButton = document.querySelector(".pc__cards-showFilter");
    const filterWrapper = document.querySelector(".wrapper");
    const filterCloseButton = document.querySelector(".pc__filter-close");
    const filterPcFilt = document.querySelector(".pc__filt");
    const filterShowResultsButton = document.querySelector(".pc__filt-showResults");
    if (showFilterButton && filterWrapper && filterCloseButton && filterPcFilt && filterShowResultsButton) {
        function addClass(element, className) {
            if (!element.classList.contains(className)) element.classList.add(className);
        }
        function removeClass(element, className) {
            if (element.classList.contains(className)) element.classList.remove(className);
        }
        function showFilter() {
            addClass(filterWrapper, "pc__filt-openW");
            addClass(filterPcFilt, "pc__filt-open");
        }
        function closeFilter() {
            removeClass(filterWrapper, "pc__filt-openW");
            removeClass(filterPcFilt, "pc__filt-open");
        }
        function closeFilterShowResults() {
            closeFilter();
        }
        showFilterButton.addEventListener("click", showFilter);
        filterCloseButton.addEventListener("click", closeFilter);
        filterShowResultsButton.addEventListener("click", closeFilterShowResults);
    } else console.error("One or more elements are missing.");
    $(".slider__main-image").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        fade: false,
        asNavFor: ".slider__sub-image",
        prevArrow: '<button type="button" class="slick-prev"><img src="./img/arrow-prev.svg"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="./img/arrow-next.svg"></button>'
    });
    $(".slider__sub-image").slick({
        slidesToShow: 6,
        slidesToScroll: 6,
        asNavFor: ".slider__main-image",
        dots: false,
        centerMode: false,
        focusOnSelect: true
    });
    function executeCodeIfElementsExist() {
        if (document.querySelector(".account__link")) {
            let initialOverlayZindex = getComputedStyle(document.querySelector(".ac_overlay"))["zIndex"];
            document.addEventListener("click", (event => {
                let currentLink = event.target.closest(".account__link");
                if (currentLink) {
                    let activeLink = document.querySelector(".account__link_active");
                    if (activeLink) activeLink.classList.remove("account__link_active");
                    currentLink.classList.add("account__link_active");
                    if (currentLink.getAttribute("value") == "quit") {
                        let quitPopUp = document.querySelector(".account__quit");
                        quitPopUp.removeAttribute("hidden");
                        document.querySelector(".ac_overlay").style.zIndex = Number(getComputedStyle(quitPopUp)["zIndex"]) - 1;
                        document.querySelector(".ac_overlay").classList.add("overlay_activate");
                    } else {
                        for (let page of document.querySelector(".account__pages").children) page.setAttribute("hidden", "true");
                        document.querySelector(`.account__${currentLink.getAttribute("value")}`).removeAttribute("hidden");
                        closeNavigation();
                    }
                }
            }));
            let quitPopUpClosing = () => {
                let quitPopUp = document.querySelector(".account__quit");
                if (quitPopUp) quitPopUp.setAttribute("hidden", "true");
                document.querySelector(".account__link_active").classList.remove("account__link_active");
                document.querySelector(".ac_overlay").style.zIndex = initialOverlayZindex;
            };
            let closeNavigation = () => {
                let navigationMobile = document.querySelector(".account__navigation_mobile");
                navigationMobile.classList.remove("account__navigation_mobile_activate");
                document.querySelector(".ac_overlay").classList.remove("overlay_activate");
            };
            let navButton = document.querySelector(".account__nav-button");
            navButton.addEventListener("click", (() => {
                let navigationMobile = document.querySelector(".account__navigation_mobile");
                navigationMobile.classList.add("account__navigation_mobile_activate");
                document.querySelector(".ac_overlay").classList.add("overlay_activate");
            }));
            let overlay = document.querySelector(".ac_overlay");
            overlay.addEventListener("click", (() => {
                closeNavigation();
                quitPopUpClosing();
            }));
            let backButton = document.querySelector(".account__back");
            backButton.addEventListener("click", (() => {
                closeNavigation();
                quitPopUpClosing();
            }));
            $(".calc");
            $("body").click((function(event) {
                $(event.target);
                if (event.target.className == "button-calc") {
                    let sign = event.target.value;
                    let $wrapper = $(event.target).closest(".calc"), $amount = $wrapper.find(".amount"), amountInit = parseInt($wrapper.find(".amount-init").html()), finalAmount = parseInt($amount.html()), $qty = $wrapper.find(".qty"), qty = parseInt($qty.html());
                    if (sign == "-") {
                        finalAmount = parseInt($amount.html()) - amountInit;
                        qty--;
                    } else {
                        finalAmount = parseInt($amount.html()) + amountInit;
                        qty++;
                    }
                    $amount.html(finalAmount < amountInit ? amountInit : finalAmount);
                    $qty.html(qty < 1 ? 1 : qty);
                }
            }));
        }
    }
    function domReady(callback) {
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", callback); else callback();
    }
    domReady(executeCodeIfElementsExist);
    function changeTimezone(date, ianatz) {
        var invdate = new Date(date.toLocaleString("en-US", {
            timeZone: ianatz
        }));
        var diff = invdate.getTime() - date.getTime();
        return new Date(date.getTime() - diff);
    }
    function runCountdown() {
        const secondsElement = document.querySelector(".seconds");
        const minutesElement = document.querySelector(".minutes");
        const hoursElement = document.querySelector(".hours");
        if (!secondsElement || !minutesElement || !hoursElement) {
            console.error("Required elements not found on the page.");
            return;
        }
        const newDate = changeTimezone(new Date("sep 12 23 12:12:12"), "Europe/Kiev").getTime();
        setInterval((() => {
            const date = changeTimezone(new Date, "Europe/Kiev").getTime();
            const diff = newDate - date;
            const hours = Math.floor(diff % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60));
            const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
            const seconds = Math.floor(diff % (1e3 * 60) / 1e3);
            secondsElement.innerHTML = seconds < 10 ? "0" + seconds : seconds;
            minutesElement.innerHTML = minutes < 10 ? "0" + minutes : minutes;
            hoursElement.innerHTML = hours < 10 ? "0" + hours : hours;
        }), 1e3);
    }
    runCountdown();
    document.addEventListener("click", (event => {
        let currentElement = event.target.closest(".comparison__filter button");
        if (currentElement) {
            currentElement.parentNode.querySelector(".comparison__filter-button_activate").classList.remove("comparison__filter-button_activate");
            currentElement.classList.add("comparison__filter-button_activate");
            for (let wrapper of document.querySelectorAll(".comparison__content-wrapper")) wrapper.setAttribute("hidden", "true");
            document.querySelector(`.comparison__content-wrapper_${currentElement.getAttribute("value")}`).removeAttribute("hidden");
        }
    }));
    document.addEventListener("click", (event => {
        let switchElement = event.target.closest(".comparison__switch");
        if (switchElement) switchElement.classList.toggle("comparison__switch_on");
    }));
    function initializeArrowLogic() {
        let arrowLeft = document.querySelectorAll(".comparison__arrows button")[0];
        let arrowRight = document.querySelectorAll(".comparison__arrows button")[1];
        function getCurrentContentWrapper() {
            let contentWrapper = "";
            for (let wrapper of document.querySelectorAll(".comparison__content-wrapper")) if (!wrapper.hidden) contentWrapper = wrapper;
            return contentWrapper;
        }
        function getTotalCardWidth() {
            let comparisonCard = getCurrentContentWrapper().querySelector(".comparison__card");
            return comparisonCard.offsetWidth + parseInt(getComputedStyle(comparisonCard)["marginLeft"]) + parseInt(getComputedStyle(comparisonCard)["marginRight"]);
        }
        arrowLeft.addEventListener("click", (() => {
            getCurrentContentWrapper().scrollBy(-getTotalCardWidth(), 0);
        }));
        arrowRight.addEventListener("click", (() => {
            getCurrentContentWrapper().scrollBy(getTotalCardWidth(), 0);
        }));
    }
    function checkAndInitialize() {
        if (document.querySelector(".comparison__arrows") && document.querySelector(".comparison__content-wrapper")) initializeArrowLogic(); else console.error("Ошибка: Один или несколько элементов не найдены на странице.");
    }
    document.addEventListener("DOMContentLoaded", checkAndInitialize);
    window["FLS"] = true;
    isWebp();
})();