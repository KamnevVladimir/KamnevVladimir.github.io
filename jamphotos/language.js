(function () {
  var supported = ["en", "es", "ru", "pt-BR", "de", "fr", "it", "tr"];
  function normalize(value) { value = (value || "").toLowerCase(); if (value.indexOf("pt") === 0) return "pt-BR"; if (value.indexOf("de") === 0) return "de"; if (value.indexOf("fr") === 0) return "fr"; if (value.indexOf("it") === 0) return "it"; if (value.indexOf("tr") === 0) return "tr"; if (value.indexOf("ru") === 0) return "ru"; if (value.indexOf("es") === 0) return "es"; return "en"; }
  function pageKind(pathname) { if (pathname.indexOf("/privacy/") !== -1) return "privacy"; if (pathname.indexOf("/support/") !== -1) return "support"; if (pathname.indexOf("/terms/") !== -1) return "terms"; return "index"; }
  function pathFor(language, kind) { var prefix = language === "en" ? "/jamphotos" : "/jamphotos/" + language; if (kind === "privacy") return prefix + "/privacy/index.html"; if (kind === "support") return prefix + "/support/index.html"; if (kind === "terms") return prefix + "/terms/index.html"; return prefix + "/index.html"; }
  function setLanguage(language) { if (supported.indexOf(language) !== -1) { try { localStorage.setItem("jamphotos-language", language); } catch (error) {} } }
  var params = new URLSearchParams(window.location.search); var requestedLanguage = params.get("lang"); if (requestedLanguage) setLanguage(normalize(requestedLanguage));
  document.querySelectorAll("[data-language]").forEach(function (link) { link.addEventListener("click", function () { setLanguage(link.getAttribute("data-language")); }); });
  document.querySelectorAll("[data-language-switch]").forEach(function (select) { select.addEventListener("change", function () { var language = normalize(select.value); setLanguage(language); window.location.href = pathFor(language, pageKind(window.location.pathname)); }); });
})();
