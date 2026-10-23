(function () {
  "use strict";

  var cfg = window.DM_CONFIG || {};
  var dict = window.DM_I18N || {};
  var root = document.documentElement;
  var STORAGE_KEY = "dm-lang";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- i18n ---------- */

  var textNodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  var attrNodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n-attr]"));
  var metaDescription = document.querySelector('meta[name="description"]');

  // Italian is authored in the HTML; capture it so switching back is lossless.
  textNodes.forEach(function (el) { el._it = el.innerHTML; });
  attrNodes.forEach(function (el) {
    el._itAttrs = {};
    el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
      var attr = pair.split(":")[0].trim();
      el._itAttrs[attr] = el.getAttribute(attr);
    });
  });
  var itMeta = { title: document.title, description: metaDescription ? metaDescription.content : "" };

  function t(lang, key) {
    var table = dict[lang];
    return table && Object.prototype.hasOwnProperty.call(table, key) ? table[key] : null;
  }

  function applyLang(lang) {
    var isIt = lang === "it";

    textNodes.forEach(function (el) {
      var value = isIt ? el._it : t(lang, el.getAttribute("data-i18n"));
      if (value != null) el.innerHTML = value;
    });
    attrNodes.forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var parts = pair.split(":");
        var attr = parts[0].trim();
        var value = isIt ? el._itAttrs[attr] : t(lang, parts[1].trim());
        if (value != null) el.setAttribute(attr, value);
      });
    });

    var meta = isIt ? itMeta : (dict[lang] && dict[lang].meta) || itMeta;
    document.title = meta.title;
    if (metaDescription) metaDescription.content = meta.description;

    root.lang = lang;
    document.querySelectorAll(".lang [data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === lang));
    });

    wireWhatsApp(lang);
    renderHours(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode */ }
  }

  function initialLang() {
    var param = new URLSearchParams(window.location.search).get("lang");
    if (param === "it" || param === "en") return param;
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "it" || stored === "en") return stored;
    } catch (e) { /* private mode */ }
    return "it";
  }

  document.querySelectorAll(".lang [data-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () { applyLang(btn.getAttribute("data-lang")); });
  });

  /* ---------- Contacts from config ---------- */

  function setHref(selector, href) {
    if (!href) return;
    document.querySelectorAll(selector).forEach(function (a) { a.href = href; });
  }

  function wireWhatsApp(lang) {
    var number = String(cfg.whatsappNumber || "").replace(/\D/g, "");
    var message = (cfg.whatsappMessage && cfg.whatsappMessage[lang]) || "";
    setHref(".js-whatsapp", "https://wa.me/" + number + (message ? "?text=" + encodeURIComponent(message) : ""));
  }

  setHref(".js-phone", cfg.phoneHref);
  setHref(".js-email", cfg.email && "mailto:" + cfg.email);
  setHref(".js-instagram", cfg.instagramUrl);
  setHref(".js-instagram-dm", cfg.instagramDm);
  setHref(".js-maps", cfg.mapsUrl);

  if (!String(cfg.whatsappNumber || "").replace(/\D/g, "")) {
    console.info("[de molfetta] TODO: set whatsappNumber in js/config.js");
  }

  /* ---------- Hours ---------- */

  function renderHours(lang) {
    var list = document.querySelector(".js-hours");
    if (list && Array.isArray(cfg.hours)) {
      list.innerHTML = "";
      cfg.hours.forEach(function (row) {
        var wrap = document.createElement("div");
        var dt = document.createElement("dt");
        var dd = document.createElement("dd");
        dt.textContent = row[lang] || row.it;
        dd.textContent = (row.time && (row.time[lang] || row.time.it)) || "";
        wrap.appendChild(dt);
        wrap.appendChild(dd);
        list.appendChild(wrap);
      });
    }
    var notice = document.querySelector(".js-hours-notice");
    if (notice) notice.hidden = !!cfg.hoursConfirmed;
  }

  /* ---------- Scroll: floating button, parallax ---------- */

  var parallax = reduceMotion ? [] : Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var ticking = false;

  function onScroll() {
    var vh = window.innerHeight;
    root.classList.toggle("past-hero", window.scrollY > vh * 0.6);

    parallax.forEach(function (frame) {
      var r = frame.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      // -1 when the frame enters at the bottom, +1 when it leaves at the top
      var progress = (vh - r.top) / (vh + r.height) * 2 - 1;
      frame.style.setProperty("--py", (progress * r.height * 0.05).toFixed(1) + "px");
    });
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener("resize", onScroll);

  /* ---------- Reveals ---------- */

  var reveals = document.querySelectorAll(".reveal, .reveal-mask");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });

    reveals.forEach(function (el) {
      var group = el.parentElement ? el.parentElement.querySelectorAll(":scope > .reveal") : [];
      var index = Array.prototype.indexOf.call(group, el);
      if (index > 0) el.style.setProperty("--reveal-delay", Math.min(index, 5) * 110 + "ms");
      io.observe(el);
    });
  }

  /* ---------- Misc ---------- */

  document.querySelectorAll(".js-year").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  applyLang(initialLang());
  onScroll();
})();
