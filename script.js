/* =========================================================================
   SAM DIGITAL MARKETING & CREATIVE RESOURCES HUB — Global Script
   Theme toggle, mobile nav, scroll reveal, filtering, search, forms, bookmarks.
   ========================================================================= */
(function () {
  "use strict";

  /* ---------- Theme (dark/light) ---------- */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem("sdm-theme"); } catch (e) {}
  if (stored) {
    root.setAttribute("data-theme", stored);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.setAttribute("data-theme", "dark");
  }

  function currentTheme() { return root.getAttribute("data-theme") === "dark" ? "dark" : "light"; }
  function paintToggleIcon() {
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.innerHTML = currentTheme() === "dark" ? "☀️" : "🌙";
    });
  }
  paintToggleIcon();

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".theme-toggle");
    if (!btn) return;
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("sdm-theme", next); } catch (err) {}
    paintToggleIcon();
  });

  /* ---------- Mobile nav ---------- */
  document.addEventListener("click", function (e) {
    var burger = e.target.closest(".nav-burger");
    var navLinks = document.querySelector(".nav-links");
    if (burger && navLinks) {
      navLinks.classList.toggle("open");
      burger.innerHTML = navLinks.classList.contains("open") ? "✕" : "☰";
      return;
    }
    if (navLinks && navLinks.classList.contains("open") && e.target.closest(".nav-links a")) {
      navLinks.classList.remove("open");
      var b = document.querySelector(".nav-burger");
      if (b) b.innerHTML = "☰";
    }
  });

  /* ---------- Active nav link ---------- */
  (function highlightActive() {
    var path = (location.pathname.split("/").pop() || "index.html");
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) a.classList.add("active");
    });
  })();

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Back to top ---------- */
  var backBtn = document.querySelector(".back-to-top");
  if (backBtn) {
    window.addEventListener("scroll", function () {
      backBtn.classList.toggle("show", window.scrollY > 480);
    });
    backBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Filter chips (data-filter-group / data-filter-target) ---------- */
  document.querySelectorAll("[data-filter-group]").forEach(function (group) {
    var targetSelector = group.getAttribute("data-filter-target");
    group.addEventListener("click", function (e) {
      var chip = e.target.closest(".filter-chip");
      if (!chip) return;
      group.querySelectorAll(".filter-chip").forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      var value = chip.getAttribute("data-filter");
      document.querySelectorAll(targetSelector).forEach(function (card) {
        var tags = (card.getAttribute("data-tags") || "").toLowerCase();
        card.style.display = (value === "all" || tags.indexOf(value.toLowerCase()) > -1) ? "" : "none";
      });
    });
  });

  /* ---------- Live search (data-search-input / data-search-target) ---------- */
  document.querySelectorAll("[data-search-input]").forEach(function (input) {
    var targetSelector = input.getAttribute("data-search-input");
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      document.querySelectorAll(targetSelector).forEach(function (card) {
        var text = card.textContent.toLowerCase();
        card.style.display = text.indexOf(q) > -1 ? "" : "none";
      });
    });
  });

  /* ---------- Bookmarks (localStorage, per-page) ---------- */
  var BOOKMARK_KEY = "sdm-bookmarks";
  function getBookmarks() {
    try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY) || "[]"); } catch (e) { return []; }
  }
  function setBookmarks(arr) {
    try { localStorage.setItem(BOOKMARK_KEY, JSON.stringify(arr)); } catch (e) {}
  }
  function paintBookmarks() {
    var saved = getBookmarks();
    document.querySelectorAll(".bookmark-btn").forEach(function (btn) {
      var id = btn.getAttribute("data-id");
      btn.classList.toggle("active", saved.indexOf(id) > -1);
      btn.innerHTML = saved.indexOf(id) > -1 ? "♥" : "♡";
    });
  }
  paintBookmarks();
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".bookmark-btn");
    if (!btn) return;
    var id = btn.getAttribute("data-id");
    var saved = getBookmarks();
    var idx = saved.indexOf(id);
    if (idx > -1) saved.splice(idx, 1); else saved.push(id);
    setBookmarks(saved);
    paintBookmarks();
  });

  /* ---------- Tier tabs (Learning Center) ---------- */
  document.querySelectorAll("[data-tier-group]").forEach(function (group) {
    var targetSelector = group.getAttribute("data-tier-target");
    group.addEventListener("click", function (e) {
      var tab = e.target.closest(".tier-tab");
      if (!tab) return;
      group.querySelectorAll(".tier-tab").forEach(function (t) { t.style.opacity = .55; });
      tab.style.opacity = 1;
      var tier = tab.getAttribute("data-tier");
      document.querySelectorAll(targetSelector).forEach(function (block) {
        block.style.display = block.getAttribute("data-tier") === tier ? "" : "none";
      });
    });
  });

  /* ---------- Forms: newsletter + contact (static site — no backend) ---------- */
  document.querySelectorAll("form[data-fake-submit]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var successEl = form.querySelector(".form-success") || form.parentElement.querySelector(".form-success");
      if (successEl) {
        successEl.style.display = "block";
        setTimeout(function () { successEl.style.display = "none"; }, 6000);
      }
      form.reset();
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
