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
  document.body.classList.toggle("light", activeTheme === "light");
  document.body.classList.toggle("dark", activeTheme === "dark");

  document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
    const isDark = activeTheme === "dark";
    toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    toggle.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");

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

document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
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
    toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
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
