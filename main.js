const buttons = {
  fa: document.getElementById("btn-fa"),
  en: document.getElementById("btn-en")
};

const DEFAULT_LANG = "fa";
let currentLang = localStorage.getItem("lang") || DEFAULT_LANG;


function renderNode(el, value) {
  // ✅ متن ساده
  if (typeof value === "string") {
    el.textContent = value;
    return;
  }

  // ✅ object (مثل achievements.fa)
  if (typeof value === "object" && !Array.isArray(value)) {
    el.querySelectorAll(":scope [data-field]").forEach(child => {
      const key = child.dataset.field;
      if (value[key] == null) return;
      renderNode(child, value[key]);
    });
    return;
  }

  // ✅ آرایه (cards, products, achievements items)
  if (Array.isArray(value)) {
    const template = el.querySelector(":scope > template");
    if (!template) return;

    // حذف عناصر قبلی غیر از template
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
          fieldEl.src = fieldValue;

        } else if (fieldEl.tagName === "A") {
          // اگر رشته بود، متن ست شود
          if (typeof fieldValue === "string") {
            fieldEl.textContent = fieldValue;

          // اگر object بود، href ست شود و متن اگر موجود بود ست شود
          } else if (typeof fieldValue === "object") {
            if (fieldValue.href) fieldEl.href = fieldValue.href;
            if (fieldValue.text) {
              // متن را بدون حذف آیکون‌ها اضافه کن
              const span = fieldEl.querySelector("span");
              if (span) span.textContent = fieldValue.text;
              else fieldEl.append(fieldValue.text);
            }
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
