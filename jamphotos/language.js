(function () {
  var supported = ["en", "es", "ru"];

  function normalize(value) {
    value = (value || "").toLowerCase();
    if (value.indexOf("ru") === 0) return "ru";
    if (value.indexOf("es") === 0) return "es";
    return "en";
  }

  function pageKind(pathname) {
    if (pathname.indexOf("/privacy/") !== -1) return "privacy";
    if (pathname.indexOf("/support/") !== -1) return "support";
    return "home";
  }

  function pathFor(language, kind) {
    var prefix = language === "en" ? "/jamphotos" : "/jamphotos/" + language;
    if (kind === "privacy") return prefix + "/privacy/index.html";
    if (kind === "support") return prefix + "/support/index.html";
    return prefix + "/index.html";
  }

  function setLanguage(language) {
    if (supported.indexOf(language) === -1) return;
    try {
      localStorage.setItem("jamphotos-language", language);
    } catch (error) {}
  }

  var params = new URLSearchParams(window.location.search);
  var requestedLanguage = params.get("lang");
  if (requestedLanguage) {
    setLanguage(normalize(requestedLanguage));
  }

  document.querySelectorAll("[data-language]").forEach(function (link) {
    link.addEventListener("click", function () {
      setLanguage(link.getAttribute("data-language"));
    });
  });

  document.querySelectorAll("[data-language-switch]").forEach(function (select) {
    select.addEventListener("change", function () {
      var language = normalize(select.value);
      setLanguage(language);
      window.location.href = pathFor(language, pageKind(window.location.pathname));
    });
  });
})();
