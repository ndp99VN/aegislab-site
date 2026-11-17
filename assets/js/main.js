/* AEGIS Lab website – language switch (EN / VI) and publication list */
(function () {
  var KEY = 'aegis-lang';

  function getLang() {
    try { return localStorage.getItem(KEY) || 'en'; } catch (e) { return 'en'; }
  }

  function setLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang);
    try { localStorage.setItem(KEY, lang); } catch (e) { /* storage unavailable */ }
    var buttons = document.querySelectorAll('.lang-switch button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', buttons[i].getAttribute('data-set-lang') === lang ? 'true' : 'false');
    }
  }

  setLang(getLang());

  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest ? ev.target.closest('[data-set-lang]') : null;
    if (btn) setLang(btn.getAttribute('data-set-lang'));
  });

  /* Publications: read data/publications.txt (one reference per line) */
  var list = document.getElementById('pub-list');
  if (!list) return;
  var empty = document.getElementById('pub-empty');

  fetch('data/publications.txt', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(function (text) {
      var lines = text.split(/\r?\n/).map(function (l) { return l.trim(); })
        .filter(function (l) { return l && l.charAt(0) !== '#'; });
      if (!lines.length) { empty.hidden = false; return; }
      lines.forEach(function (line) {
        var li = document.createElement('li');
        // *text* becomes italic (e.g. journal names); everything else is plain text
        line.split(/(\*[^*]+\*)/).forEach(function (part) {
          if (/^\*[^*]+\*$/.test(part)) {
            var em = document.createElement('em');
            em.textContent = part.slice(1, -1);
            li.appendChild(em);
          } else if (part) {
            li.appendChild(document.createTextNode(part));
          }
        });
        list.appendChild(li);
      });
    })
    .catch(function () { empty.hidden = false; });
})();
