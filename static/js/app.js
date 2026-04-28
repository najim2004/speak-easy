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

const applyTheme = (theme) => {
  const activeTheme = theme === "light" || theme === "dark" ? theme : "dark";
  document.body.dataset.theme = activeTheme;

  document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
    const isDark = activeTheme === "dark";
    toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    toggle.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
  });
};

const initialTheme = getStoredTheme() || document.body.dataset.theme || "dark";
applyTheme(initialTheme);

document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
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
    menu.classList.toggle("is-open", isOpen);
    header.classList.toggle("is-nav-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  };

  toggle.addEventListener("click", () => {
    setMenuOpen(!menu.classList.contains("is-open"));
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
