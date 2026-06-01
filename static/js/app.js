const themeStorageKey = "speakEasyTheme";

const getStoredTheme = () => {
  try {
    return localStorage.getItem(themeStorageKey);
  } catch {
    return null;
  }
};

const storeTheme = (theme) => {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Local storage can be unavailable in private or restricted browser modes.
  }
};

const initCustomDropdowns = () => {
  const selects = document.querySelectorAll(
    "select.site-select, #course-filters select, select[data-custom-select]",
  );

  selects.forEach((select) => {
    if (select.dataset.customDropdownInit === "true") return;

    const wrap =
      select.closest(".site-select-wrap") ||
      select.closest("label") ||
      select.parentElement;
    if (!wrap) return;

    select.dataset.customDropdownInit = "true";
    wrap.classList.add("is-custom");

    const variant = select.classList.contains("site-select--hero")
      ? "hero"
      : select.classList.contains("site-select--brand") ||
          select.closest("#course-filters")
        ? "brand"
        : "brand";

    const dropdown = document.createElement("div");
    dropdown.className = `custom-dropdown custom-dropdown--${variant}`;

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "custom-dropdown__trigger";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");

    const labelSpan = document.createElement("span");
    labelSpan.className = "custom-dropdown__label min-w-0 truncate";

    const chevron = document.createElement("i");
    chevron.className = "fa-solid fa-chevron-down";
    chevron.setAttribute("aria-hidden", "true");

    trigger.append(labelSpan, chevron);

    const menu = document.createElement("ul");
    menu.className = "custom-dropdown__menu";
    menu.setAttribute("role", "listbox");
    menu.hidden = true;

    const syncLabel = () => {
      const selected = select.options[select.selectedIndex];
      labelSpan.textContent = selected?.textContent?.trim() || "";
      menu.querySelectorAll(".custom-dropdown__option").forEach((btn) => {
        const isSelected = btn.dataset.value === select.value;
        btn.classList.toggle("is-selected", isSelected);
        btn.setAttribute("aria-selected", String(isSelected));
      });
    };

    Array.from(select.options).forEach((option) => {
      if (option.disabled && !option.selected) return;

      const item = document.createElement("li");
      item.setAttribute("role", "none");

      const optionBtn = document.createElement("button");
      optionBtn.type = "button";
      optionBtn.className = "custom-dropdown__option";
      optionBtn.setAttribute("role", "option");
      optionBtn.dataset.value = option.value;
      optionBtn.textContent = option.textContent?.trim() || "";

      optionBtn.addEventListener("click", () => {
        select.value = option.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        syncLabel();
        menu.hidden = true;
        dropdown.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      });

      item.appendChild(optionBtn);
      menu.appendChild(item);
    });

    const closeMenu = () => {
      menu.hidden = true;
      dropdown.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    };

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = menu.hidden;
      document.querySelectorAll(".custom-dropdown.is-open").forEach((open) => {
        if (open === dropdown) return;
        open.classList.remove("is-open");
        const openMenu = open.querySelector(".custom-dropdown__menu");
        if (openMenu) openMenu.hidden = true;
        open
          .querySelector(".custom-dropdown__trigger")
          ?.setAttribute("aria-expanded", "false");
      });
      menu.hidden = !willOpen;
      dropdown.classList.toggle("is-open", willOpen);
      trigger.setAttribute("aria-expanded", String(willOpen));
    });

    select.addEventListener("change", syncLabel);
    syncLabel();

    dropdown.append(trigger, menu);
    wrap.appendChild(dropdown);
  });
};

const applyTheme = (theme) => {
  const activeTheme = theme === "light" || theme === "dark" ? theme : "dark";
  document.body.classList.toggle("light", activeTheme === "light");
  document.body.classList.toggle("dark", activeTheme === "dark");

  document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
    const isDark = activeTheme === "dark";
    toggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode",
    );
    toggle.setAttribute(
      "title",
      isDark ? "Switch to light mode" : "Switch to dark mode",
    );

    const darkIcon = toggle.querySelector("[data-theme-dark-icon]");
    const lightIcon = toggle.querySelector("[data-theme-light-icon]");

    if (darkIcon) {
      darkIcon.hidden = isDark;
    }

    if (lightIcon) {
      lightIcon.hidden = !isDark;
    }
  });
};

const initialTheme =
  getStoredTheme() ||
  (document.body.classList.contains("light") ? "light" : "") ||
  (document.body.classList.contains("dark") ? "dark" : "") ||
  "dark";
applyTheme(initialTheme);
initCustomDropdowns();

document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark")
      ? "light"
      : "dark";
    applyTheme(nextTheme);
    storeTheme(nextTheme);
  });
});

document.querySelectorAll("[data-site-header]").forEach((header) => {
  const toggle = header.querySelector("[data-nav-toggle]");
  const menu = header.querySelector("[data-mobile-nav]");

  if (!toggle || !menu) {
    return;
  }

  const setMenuOpen = (isOpen) => {
    menu.classList.toggle("hidden", !isOpen);
    const openIcon = toggle.querySelector("[data-nav-open-icon]");
    const closeIcon = toggle.querySelector("[data-nav-close-icon]");

    if (openIcon) {
      openIcon.hidden = isOpen;
    }

    if (closeIcon) {
      closeIcon.hidden = !isOpen;
    }

    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );
  };

  setMenuOpen(false);

  toggle.addEventListener("click", () => {
    setMenuOpen(menu.classList.contains("hidden"));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.querySelectorAll("details[open]").forEach((details) => {
        details.removeAttribute("open");
      });
      setMenuOpen(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      setMenuOpen(false);
    }
  });
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".custom-dropdown")) return;
  document.querySelectorAll(".custom-dropdown.is-open").forEach((dropdown) => {
    dropdown.classList.remove("is-open");
    const menu = dropdown.querySelector(".custom-dropdown__menu");
    if (menu) menu.hidden = true;
    dropdown
      .querySelector(".custom-dropdown__trigger")
      ?.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  document.querySelectorAll(".custom-dropdown.is-open").forEach((dropdown) => {
    dropdown.classList.remove("is-open");
    const menu = dropdown.querySelector(".custom-dropdown__menu");
    if (menu) menu.hidden = true;
    dropdown
      .querySelector(".custom-dropdown__trigger")
      ?.setAttribute("aria-expanded", "false");
  });
});
