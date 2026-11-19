/*
  Builds the page from two data files:
    content/site.json      home page text, photo, CV, skills, experience, contact
    content/projects.json  the projects (cards + project pages)
  Edit those files in Pages CMS. This script normally needs no changes.
*/
(function () {
  "use strict";

  var root = document.documentElement;
  var host = location.hostname;
  // On your own computer, empty image frames show which file is missing.
  var isDev = location.protocol === "file:" || host === "localhost" || host === "127.0.0.1" || host === "";
  if (isDev) root.classList.add("is-dev");

  /* ---------- helpers ---------- */

  function $(id) { return document.getElementById(id); }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function arr(value) { return Array.isArray(value) ? value : []; }
  function filled(list) { return arr(list).filter(function (x) { return x !== "" && x != null; }); }

  // Links typed by hand: allow web, mail and phone links only.
  function safeUrl(url) {
    url = String(url || "").trim();
    if (!url) return "";
    if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return /^(https?|mailto|tel):/i.test(url) ? url : "";
    return url;
  }

  // Files uploaded through the CMS are saved as "/assets/...". Make them
  // relative so the site also works from a sub-folder.
  function asset(path) {
    path = String(path || "").trim();
    if (!path) return "";
    if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return safeUrl(path);
    return path.replace(/^\/+/, "");
  }

  function digits(phone) { return String(phone || "").replace(/[^\d]/g, ""); }

  function tagClass(tag) {
    var t = String(tag).toLowerCase();
    if (/hvac|chilled|\bdx\b|vrf|vrv|duct|ventilation|air/.test(t)) return "tag--hvac";
    if (/fire|sprinkler|\bff\b/.test(t)) return "tag--fire";
    if (/plumb|drain|sanitary|water supply/.test(t)) return "tag--plumb";
    if (/revit|bim|coordination|navisworks|clash|dynamo/.test(t)) return "tag--bim";
    return "";
  }

  function tagsHtml(tags) {
    return filled(tags).map(function (t) {
      return '<span class="tag ' + tagClass(t) + '">' + esc(t) + "</span>";
    }).join("");
  }

  function factsHtml(facts) {
    return arr(facts).filter(function (f) { return f && (f.label || f.value); }).map(function (f) {
      return "<div><dt>" + esc(f.label) + "</dt><dd>" + esc(f.value) + "</dd></div>";
    }).join("");
  }

  function paragraphs(text) {
    return String(text || "").split(/\n\s*\n/).filter(function (p) { return p.trim(); }).map(function (p) {
      return "<p>" + esc(p.trim()).replace(/\n/g, "<br>") + "</p>";
    }).join("");
  }

  function mediaHtml(path, alt, opts) {
    opts = opts || {};
    var src = asset(path);
    var cls = "media" + (opts.contain ? " media--contain" : "") + (src ? "" : " is-empty");
    return '<div class="' + cls + '" data-file="' + esc(src || "(no image yet)") + '"' +
      ' data-placeholder="' + esc(opts.placeholder || "Image coming soon") + '"' +
      (opts.optional ? " data-optional" : "") + ">" +
      (opts.badge ? '<span class="badge">' + esc(opts.badge) + "</span>" : "") +
      (src ? '<img src="' + esc(src) + '" alt="' + esc(alt || "") + '"' + (opts.lazy ? ' loading="lazy"' : "") + ">" : "") +
      "</div>";
  }

  function setHtml(id, html) { var el = $(id); if (el) el.innerHTML = html; return el; }

  var ICON_WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.1.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3Z"/></svg>';
  var ICON_CALL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>';

  /* ---------- home page ---------- */

  function renderSite(site) {
    var cv = asset(site.cv);
    document.querySelectorAll("[data-cv]").forEach(function (a) {
      if (cv) a.setAttribute("href", cv); else a.hidden = true;
    });

    var h = site.hero || {};
    var facts = factsHtml(h.facts);
    setHtml("hero-copy",
      (h.status ? '<p class="status-pill"><span class="dot" aria-hidden="true"></span>' + esc(h.status) + "</p>" : "") +
      "<h1>" + esc(h.name) + "</h1>" +
      '<p class="role"><span class="r1">' + esc(h.role) + "</span>" +
        (h.role2 ? ' <span class="sep" aria-hidden="true">|</span> <span class="r2">' + esc(h.role2) + "</span>" : "") + "</p>" +
      (h.lead ? '<p class="lead">' + esc(h.lead) + "</p>" : "") +
      '<div class="actions">' +
        '<a class="btn btn-primary" href="#projects">View projects</a>' +
        (cv ? '<a class="btn btn-outline" href="' + esc(cv) + '" download>Download CV</a>' : "") +
        '<a class="btn btn-ghost" href="#contact">Contact me</a>' +
      "</div>" +
      (facts ? '<dl class="tblock">' + facts + "</dl>" : ""));

    var a = site.about || {};
    var photo = asset(a.photo);
    var photoBox = $("about-photo");
    if (photoBox) {
      photoBox.setAttribute("data-file", photo || "(no photo yet)");
      photoBox.innerHTML = photo ? '<img src="' + esc(photo) + '" alt="Portrait of ' + esc(h.name || "") + '">' : "";
    }
    var glance = factsHtml(a.glance);
    setHtml("about-body",
      (a.heading ? "<h2>" + esc(a.heading) + "</h2>" : "") +
      filled(a.paragraphs).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
      (glance ? '<dl class="glance">' + glance + "</dl>" : ""));

    var s = site.skills || {};
    setHtml("skills-intro", esc(s.intro));
    var sys = { bim: "sys-bim", hvac: "sys-hvac", fire: "sys-fire", plumbing: "sys-plumb", office: "sys-office", cad: "sys-cad" };
    setHtml("skills-grid", arr(s.cards).map(function (c) {
      var items = filled(c.items).map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("");
      return '<article class="skill ' + (sys[c.color] || "sys-bim") + '">' +
        (c.label ? '<span class="skill-code">' + esc(c.label) + "</span>" : "") +
        "<h3>" + esc(c.title) + "</h3>" +
        (items ? "<ul>" + items + "</ul>" : "") +
        (c.tools ? '<p class="tools">' + esc(c.tools) + "</p>" : "") +
        "</article>";
    }).join(""));
    var software = filled(s.software);
    setHtml("software", software.length ? '<span class="label">Software</span>' + tagsHtml(software) : "");

    var e = site.experience || {};
    setHtml("work-list", arr(e.work).map(function (w) {
      var bullets = filled(w.bullets).map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("");
      return "<li>" +
        (w.when ? '<span class="when">' + esc(w.when) + "</span>" : "") +
        "<h4>" + esc(w.title) + "</h4>" +
        (w.org ? '<p class="org">' + esc(w.org) + "</p>" : "") +
        (w.context ? '<p class="context">' + esc(w.context) + "</p>" : "") +
        (bullets ? '<ul class="bullets">' + bullets + "</ul>" : "") +
        "</li>";
    }).join(""));
    setHtml("edu-list", arr(e.education).map(function (d) {
      var cert = asset(d.certificateFile) || safeUrl(d.certificateLink);
      var org = [d.org ? esc(d.org) : "", cert ? '<a href="' + esc(cert) + '" target="_blank" rel="noopener">Certificate</a>' : ""].filter(Boolean).join(" · ");
      return "<li>" +
        (d.when ? '<span class="when">' + esc(d.when) + "</span>" : "") +
        "<h4>" + esc(d.title) + (d.grade ? ' <span class="grade">' + esc(d.grade) + "</span>" : "") + "</h4>" +
        (org ? '<p class="org">' + org + "</p>" : "") +
        (d.note ? '<p class="note">' + esc(d.note) + "</p>" : "") +
        "</li>";
    }).join(""));
    var langs = $("languages");
    if (langs && e.languages) { langs.innerHTML = "<strong>Languages:</strong> " + esc(e.languages); langs.hidden = false; }

    var c = site.contact || {};
    var wa = digits(c.whatsapp) ? "https://wa.me/" + digits(c.whatsapp) + (c.whatsappMessage ? "?text=" + encodeURIComponent(c.whatsappMessage) : "") : "";
    var tel = digits(c.phone) ? "tel:+" + digits(c.phone) : "";
    var mail = c.email ? "mailto:" + c.email : "";
    var linkedin = safeUrl(c.linkedin);
    setHtml("contact-copy",
      '<p class="section-label">05 / Contact</p>' +
      (c.heading ? "<h2>" + esc(c.heading) + "</h2>" : "") +
      (c.text ? "<p>" + esc(c.text) + "</p>" : "") +
      '<div class="actions">' +
        (wa ? '<a class="btn btn-whatsapp" href="' + esc(wa) + '" target="_blank" rel="noopener">' + ICON_WA + "WhatsApp</a>" : "") +
        (tel ? '<a class="btn btn-outline" href="' + esc(tel) + '">' + ICON_CALL + "Call</a>" : "") +
        (mail ? '<a class="btn btn-ghost" href="' + esc(mail) + '">Email</a>' : "") +
      "</div>");
    var rows = [
      wa && ["WhatsApp", '<a href="' + esc(wa) + '" target="_blank" rel="noopener">' + esc(c.whatsapp) + "</a>"],
      tel && ["Phone", '<a href="' + esc(tel) + '">' + esc(c.phone) + "</a>"],
      mail && ["Email", '<a href="' + esc(mail) + '">' + esc(c.email) + "</a>"],
      linkedin && ["LinkedIn", '<a href="' + esc(linkedin) + '" target="_blank" rel="noopener">' + esc(linkedin.replace(/^https?:\/\/(www\.)?/, "")) + "</a>"],
      c.location && ["Location", '<span class="v">' + esc(c.location) + "</span>"]
    ].filter(Boolean);
    setHtml("contact-list", rows.map(function (r) {
      return '<li><span class="k">' + r[0] + "</span>" + r[1] + "</li>";
    }).join(""));
  }

  /* ---------- project cards ---------- */

  function cardHtml(p) {
    var upcoming = p.status === "in-progress";
    var media = mediaHtml(p.cover, "", {
      lazy: true,
      placeholder: upcoming ? "Model in progress" : "Image coming soon",
      badge: upcoming ? "In progress" : ""
    });
    var body = '<div class="card-body">' +
      '<div class="tags">' + tagsHtml(p.tags) + "</div>" +
      "<h3>" + esc(p.title) + "</h3>" +
      (p.meta ? '<p class="card-meta">' + esc(p.meta) + "</p>" : "") +
      (p.summary ? "<p>" + esc(p.summary) + "</p>" : "") +
      '<span class="card-link">' + (upcoming ? "Coming soon" : "View project →") + "</span>" +
      "</div>";
    return upcoming
      ? '<article class="project-card is-upcoming">' + media + body + "</article>"
      : '<a class="project-card" href="project.html?id=' + encodeURIComponent(p.id) + '">' + media + body + "</a>";
  }

  /* ---------- project page ---------- */

  function renderProject(el, list) {
    var id = new URLSearchParams(location.search).get("id");
    var p = list.filter(function (x) { return x.id === id; })[0];

    if (!p) {
      document.title = "Project not found · Mohamed Shaltoot";
      el.innerHTML = '<section class="page-hero blueprint"><div class="container">' +
        '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html#projects">Projects</a></nav>' +
        "<h1>Project not found</h1>" +
        '<p class="lead">This project doesn\'t exist or isn\'t published yet.</p>' +
        '<p style="margin-top:24px"><a class="btn btn-primary" href="index.html#projects">See all projects</a></p>' +
        "</div></section>";
      return;
    }

    document.title = p.title + " · Mohamed Shaltoot";
    var desc = document.querySelector('meta[name="description"]');
    if (desc && p.summary) desc.setAttribute("content", p.summary);

    var facts = factsHtml(p.facts);

    var sections = arr(p.sections).map(function (s) {
      var points = filled(s.points).map(function (li) { return "<li>" + esc(li) + "</li>"; }).join("");
      if (!s.title && !s.text && !points) return "";
      return '<div class="project-section">' +
        (s.title ? "<h2>" + esc(s.title) + "</h2>" : "") +
        paragraphs(s.text) +
        (points ? '<ul class="checklist">' + points + "</ul>" : "") +
        "</div>";
    }).join("");

    var docs = arr(p.documents).filter(function (d) { return d && asset(d.file); });
    var documents = docs.length
      ? '<div class="project-section"><h2>Documents</h2><div class="doc-list">' + docs.map(function (d) {
          var file = asset(d.file);
          var ext = (file.split(".").pop() || "file").toUpperCase().slice(0, 4);
          var name = d.label || file.split("/").pop();
          return '<a class="doc-link" href="' + esc(file) + '" target="_blank" rel="noopener">' +
            '<span class="doc-badge">' + esc(ext) + "</span>" +
            '<span class="doc-name">' + esc(name) + "</span>" +
            '<span class="doc-open" aria-hidden="true">Open ↗</span></a>';
        }).join("") + "</div></div>"
      : "";

    var linkList = arr(p.links).filter(function (l) { return l && safeUrl(l.url); });
    var links = linkList.length
      ? '<div class="project-links">' + linkList.map(function (l) {
          return '<a class="btn btn-outline btn-sm" href="' + esc(safeUrl(l.url)) + '" target="_blank" rel="noopener">' + esc(l.label || "Link") + " ↗</a>";
        }).join("") + "</div>"
      : "";

    var cover = asset(p.cover)
      ? '<figure class="shot shot--wide">' +
          mediaHtml(p.cover, p.coverCaption || p.title, { optional: true, contain: !!p.coverContain }) +
          (p.coverCaption ? "<figcaption>" + esc(p.coverCaption) + "</figcaption>" : "") +
        "</figure>"
      : "";

    var shots = arr(p.gallery).filter(function (g) { return g && asset(g.image); });
    var gallery = shots.length
      ? '<div class="project-section" data-gallery>' +
          "<h2>Drawings and model views</h2>" +
          '<div class="gallery">' + shots.map(function (g) {
            return '<figure class="shot' + (g.wide ? " span-2" : "") + '">' +
              mediaHtml(g.image, g.caption, { contain: true, optional: true }) +
              (g.caption ? "<figcaption>" + esc(g.caption) + "</figcaption>" : "") +
              "</figure>";
          }).join("") + "</div>" +
        "</div>"
      : "";

    var i = list.indexOf(p);
    var prev = list[i - 1];
    var next = list[i + 1];
    var pager = '<nav class="pager" aria-label="More projects">' +
      (prev
        ? '<a href="project.html?id=' + encodeURIComponent(prev.id) + '"><span class="pager-k">← Previous project</span><span class="pager-title">' + esc(prev.shortTitle || prev.title) + "</span></a>"
        : '<a href="index.html#projects"><span class="pager-k">← Back</span><span class="pager-title">All projects</span></a>') +
      (next
        ? '<a class="next" href="project.html?id=' + encodeURIComponent(next.id) + '"><span class="pager-k">Next project →</span><span class="pager-title">' + esc(next.shortTitle || next.title) + "</span></a>"
        : '<a class="next" href="index.html#projects"><span class="pager-k">Back →</span><span class="pager-title">All projects</span></a>') +
      "</nav>";

    el.innerHTML =
      '<section class="page-hero blueprint"><div class="container">' +
        '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html#projects">Projects</a><span class="slash" aria-hidden="true">/</span><span aria-current="page">' + esc(p.shortTitle || p.title) + "</span></nav>" +
        '<div class="tags">' + tagsHtml(p.tags) + "</div>" +
        "<h1>" + esc(p.title) + "</h1>" +
        (p.lead ? '<p class="lead">' + esc(p.lead) + "</p>" : "") +
        (facts ? '<dl class="tblock tblock--3">' + facts + "</dl>" : "") +
      "</div></section>" +
      '<section class="project-body"><div class="container">' +
        cover + sections + links + documents + gallery + pager +
      "</div></section>";
  }

  /* ---------- after rendering ---------- */

  // Missing image: show a clean placeholder frame. On the live site,
  // optional images (project page) are hidden instead.
  function bindMedia() {
    document.querySelectorAll(".media").forEach(function (box) {
      if (box.dataset.bound) return;
      box.dataset.bound = "1";
      var img = box.querySelector("img");
      function markEmpty() {
        box.classList.add("is-empty");
        if (isDev || !box.hasAttribute("data-optional")) return;
        var fig = box.closest("figure");
        if (fig) fig.hidden = true;
        var section = box.closest("[data-gallery]");
        if (section && !section.querySelector("figure:not([hidden])")) section.hidden = true;
      }
      if (!img) { markEmpty(); return; }
      if (img.complete && img.naturalWidth === 0) markEmpty();
      else img.addEventListener("error", markEmpty);
    });
  }

  // The content changes the page height, so jump again to a #section link.
  function jumpToHash() {
    if (location.hash.length < 2) return;
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
  }

  function showLoadError(err) {
    var main = $("main");
    if (!main) return;
    var box = document.createElement("div");
    box.className = "container load-error";
    box.setAttribute("role", "alert");
    box.innerHTML = "<strong>The page content couldn't load.</strong> " +
      (location.protocol === "file:"
        ? "This site reads its content from data files, so open it from its web address (or a local preview server), not by double-clicking the file."
        : "Please refresh the page. If it keeps happening, check content/site.json and content/projects.json.") +
      '<span class="load-error-detail">' + esc(err && err.message) + "</span>";
    main.insertBefore(box, main.firstChild);
  }

  function getJSON(url) {
    return fetch(url, { cache: "no-cache" }).then(function (res) {
      if (!res.ok) throw new Error(url + " (" + res.status + ")");
      return res.json();
    });
  }

  Promise.all([getJSON("content/site.json"), getJSON("content/projects.json")])
    .then(function (data) {
      var site = data[0] || {};
      var projects = arr((data[1] || {}).projects).filter(function (p) { return p && p.id && p.title; });

      if ($("hero-copy")) renderSite(site);
      else {
        var cv = asset(site.cv);
        document.querySelectorAll("[data-cv]").forEach(function (a) { if (cv) a.setAttribute("href", cv); });
      }

      var grid = $("projects-grid");
      if (grid) grid.innerHTML = projects.map(cardHtml).join("");

      var page = $("project-page");
      if (page) renderProject(page, projects.filter(function (p) { return p.status !== "in-progress"; }));

      bindMedia();
      jumpToHash();
    })
    .catch(function (err) {
      showLoadError(err);
      if (window.console) console.error(err);
    });

  /* ---------- mobile menu ---------- */

  var toggle = document.querySelector(".nav-toggle");
  var nav = $("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () { setOpen(!nav.classList.contains("is-open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
  }

  /* ---------- footer year ---------- */

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- highlight the section on screen ---------- */

  var links = document.querySelectorAll('.nav a[href^="#"]');
  if ("IntersectionObserver" in window && links.length) {
    var byId = {};
    links.forEach(function (link) { byId[link.getAttribute("href").slice(1)] = link; });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove("is-active"); });
        var active = byId[entry.target.id];
        if (active) active.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach(function (id) {
      var section = $(id);
      if (section) observer.observe(section);
    });
  }
})();
