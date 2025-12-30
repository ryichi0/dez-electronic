const buttons = {
  fa: document.getElementById("btn-fa"),
  en: document.getElementById("btn-en")
};

const DEFAULT_LANG = "fa";
let currentLang = localStorage.getItem("lang") || DEFAULT_LANG;


function renderNode(el, value) {
  if (typeof value === "string") {
    el.textContent = value;
    return;
  }

  if (Array.isArray(value)) {
    const template = el.querySelector(":scope > template");
    if (!template) return;

    // پاک کردن محتوای قبلی غیر از template
    el.querySelectorAll(":scope > :not(template)").forEach(n => n.remove());

    value.forEach(item => {
      const clone = template.content.cloneNode(true);

      clone.querySelectorAll("[data-field]").forEach(fieldEl => {
        const key = fieldEl.dataset.field;
        const fieldValue = item[key];

        if (fieldValue == null) return;


        if (Array.isArray(fieldValue)) {
          renderNode(fieldEl, fieldValue);
        } else if (fieldEl.tagName === "IMG") {
           if (fieldValue) {
            fieldEl.src = fieldValue;
          }
        } else if (fieldEl.tagName === "A") {
          if (typeof fieldValue === "object") {
            fieldEl.textContent = fieldValue.text || "";
            if (fieldValue.href) fieldEl.href = fieldValue.href;
          } else {
            fieldEl.textContent = fieldValue;
            fieldEl.href = fieldValue; 
          }
        } else {
          fieldEl.textContent = fieldValue;
        }
      });

      el.appendChild(clone);
    });
  }
}

// Load language
function loadLanguage(lang) {
  fetch("./lang/lang.json")
    .then(res => {
      if (!res.ok) throw new Error("Language file not found");
      return res.json();
    })
    .then(data => {
      
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const path = el.dataset.i18n.split(".");
        let value = data;
        path.forEach(k => value = value?.[k]);
        if (!value) return;

        renderNode(el, value[lang]);
      });

      
      document.body.classList.remove("lang-fa", "lang-en");
      document.body.classList.add(`lang-${lang}`);

      
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";

      localStorage.setItem("lang", lang);
    })
    .catch(console.error);
}


buttons.fa.onclick = () => loadLanguage("fa");
buttons.en.onclick = () => loadLanguage("en");


loadLanguage(currentLang);
