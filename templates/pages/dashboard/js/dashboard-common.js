window.initDashboardShell = function initDashboardShell() {
  if (document.documentElement.dataset.dashboardShellReady === "true") {
    return;
  }

  document.documentElement.dataset.dashboardShellReady = "true";

  const sidebar = document.querySelector("[data-dashboard-sidebar]");
  const sidebarOverlay = document.querySelector("[data-sidebar-overlay]");
  const openSidebar = document.querySelector("[data-sidebar-open]");
  const closeSidebar = document.querySelector("[data-sidebar-close]");
  const courseToggle = document.querySelector("[data-course-toggle]");
  const courseMenu = document.querySelector("[data-course-menu]");

  const setSidebarOpen = (isOpen) => {
    if (!sidebar) return;
    sidebar.classList.toggle("-translate-x-full", !isOpen);
    sidebar.classList.toggle("translate-x-0", isOpen);
    sidebarOverlay?.classList.toggle("hidden", !isOpen);
    openSidebar?.setAttribute("aria-expanded", String(isOpen));
  };

  openSidebar?.addEventListener("click", () => setSidebarOpen(true));
  closeSidebar?.addEventListener("click", () => setSidebarOpen(false));
  sidebarOverlay?.addEventListener("click", () => setSidebarOpen(false));

  courseToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    const isHidden = courseMenu?.classList.contains("hidden");
    courseMenu?.classList.toggle("hidden", !isHidden);
    courseToggle.setAttribute("aria-expanded", String(isHidden));
  });

  document.addEventListener("click", (event) => {
    if (!courseMenu || !courseToggle) return;
    if (
      !courseMenu.classList.contains("hidden") &&
      !courseMenu.contains(event.target) &&
      !courseToggle.contains(event.target)
    ) {
      courseMenu.classList.add("hidden");
      courseToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    setSidebarOpen(false);
    courseMenu?.classList.add("hidden");
    courseToggle?.setAttribute("aria-expanded", "false");
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(false);
    }
  });
};
