(function () {
  var supported = ["en-US", "en-AU", "es-ES", "es-MX", "de-DE", "fr-FR", "it", "ja", "ko", "pt-BR", "ru", "tr"];
  function normalize(value) {
    value = (value || "").toLowerCase();
    if (value === "en-au") return "en-AU";
    if (value.indexOf("en") === 0) return "en-US";
    if (value === "es-mx") return "es-MX";
    if (value.indexOf("es") === 0) return "es-ES";
    if (value.indexOf("de") === 0) return "de-DE";
    if (value.indexOf("fr") === 0) return "fr-FR";
    if (value.indexOf("it") === 0) return "it";
    if (value.indexOf("ja") === 0) return "ja";
    if (value.indexOf("ko") === 0) return "ko";
    if (value.indexOf("pt") === 0) return "pt-BR";
    if (value.indexOf("ru") === 0) return "ru";
    if (value.indexOf("tr") === 0) return "tr";
    return "en-US";
  }
  function pageKind(pathname) {
    if (pathname.indexOf("/privacy/") !== -1) return "privacy";
    if (pathname.indexOf("/support/") !== -1) return "support";
    if (pathname.indexOf("/terms/") !== -1) return "terms";
    return "index";
  }
  function pathFor(language, kind) {
    var prefix = "/jamphotos/" + language;
    if (kind === "privacy") return prefix + "/privacy/";
    if (kind === "support") return prefix + "/support/";
    if (kind === "terms") return prefix + "/terms/";
    return prefix + "/";
  }
  function setLanguage(language) {
    if (supported.indexOf(language) !== -1) {
      try { localStorage.setItem("jamphotos-language", language); } catch (error) {}
    }
  }
  var params = new URLSearchParams(window.location.search);
  var requestedLanguage = params.get("lang");
  if (requestedLanguage) setLanguage(normalize(requestedLanguage));
  document.querySelectorAll("[data-language]").forEach(function (link) {
    link.addEventListener("click", function () { setLanguage(normalize(link.getAttribute("data-language"))); });
  });
  document.querySelectorAll("[data-language-switch]").forEach(function (select) {
    select.addEventListener("change", function () {
      var language = normalize(select.value);
      setLanguage(language);
      window.location.href = pathFor(language, pageKind(window.location.pathname));
    });
  });
})();
