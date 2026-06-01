(function initDashboard() {
  if (document.documentElement.dataset.dashboardReady === "true") return;
  document.documentElement.dataset.dashboardReady = "true";

  const langStorageKey = "speakEasyLang";
  const batchStorageKey = "speakEasyBatch";
  const profileStorageKey = "speakEasyProfile";
  const notifReadKey = "speakEasyNotifRead";

  const sidebar = document.querySelector("[data-dashboard-sidebar]");
  const sidebarOverlay = document.querySelector("[data-sidebar-overlay]");
  const openSidebarBtn = document.querySelector("[data-sidebar-open]");
  const closeSidebarBtn = document.querySelector("[data-sidebar-close]");
  const courseToggle = document.querySelector("[data-course-toggle]");
  const courseMenu = document.querySelector("[data-course-menu]");

  const notificationPanel = document.querySelector("[data-notification-panel]");
  const notificationOverlay = document.querySelector("[data-notification-overlay]");
  const openNotificationBtn = document.querySelector("[data-notification-open]");
  const closeNotificationBtn = document.querySelector("[data-notification-close]");
  const notificationDot = document.querySelector("[data-notification-dot]");

  const chatWindow = document.querySelector("[data-ai-chat-window]");
  const chatToggle = document.querySelector("[data-ai-chat-toggle]");
  const chatClose = document.querySelector("[data-ai-chat-close]");
  const chatLog = document.querySelector("[data-ai-chat-log]");
  const chatInput = document.querySelector("[data-ai-chat-input]");
  const chatSend = document.querySelector("[data-ai-chat-send]");
  const typing = document.querySelector("[data-ai-typing]");

  const batches = {
    n5: { course: "Japanese N5 Beginner Course", portal: "Tokyo 2026 Student Portal" },
    n4: { course: "Japanese N4 Intermediate Course", portal: "Osaka 2026 Student Portal" },
  };

  const ensureToast = () => {
    if (document.querySelector("[data-dashboard-toast]")) return;
    const toast = document.createElement("div");
    toast.dataset.dashboardToast = "";
    toast.className =
      "fixed bottom-24 left-1/2 z-[100] hidden -translate-x-1/2 items-center gap-3 rounded-2xl border border-brand-accent/20 bg-black px-6 py-3 text-brand-accent shadow-2xl sm:bottom-28";
    toast.innerHTML =
      '<i class="fa-solid fa-circle-info"></i><span data-dashboard-toast-text class="text-xs font-black uppercase tracking-widest"></span>';
    document.body.appendChild(toast);
  };

  const showToast = (message, duration = 2400) => {
    ensureToast();
    const toast = document.querySelector("[data-dashboard-toast]");
    const toastText = document.querySelector("[data-dashboard-toast-text]");
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.remove("hidden");
    toast.classList.add("flex");
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => {
      toast.classList.add("hidden");
      toast.classList.remove("flex");
    }, duration);
  };

  const setSidebarOpen = (isOpen) => {
    if (!sidebar) return;
    sidebar.classList.toggle("-translate-x-full", !isOpen);
    sidebar.classList.toggle("translate-x-0", isOpen);
    sidebarOverlay?.classList.toggle("hidden", !isOpen);
    openSidebarBtn?.setAttribute("aria-expanded", String(isOpen));
  };

  const setNotificationOpen = (isOpen) => {
    if (!notificationPanel) return;
    notificationPanel.classList.toggle("translate-x-full", !isOpen);
    notificationPanel.classList.toggle("translate-x-0", isOpen);
    notificationPanel.setAttribute("aria-hidden", String(!isOpen));
    notificationOverlay?.classList.toggle("hidden", !isOpen);
    openNotificationBtn?.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("dashboard-notification-open", isOpen);
    if (isOpen) {
      notificationDot?.classList.add("hidden");
      try {
        localStorage.setItem(notifReadKey, "true");
      } catch {
        // ignore
      }
    }
  };

  const setChatOpen = (isOpen) => {
    if (!chatWindow) return;
    chatWindow.classList.toggle("hidden", !isOpen);
    chatWindow.classList.toggle("flex", isOpen);
    chatToggle?.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) chatInput?.focus();
  };

  const applyBatch = (batchId) => {
    const batch = batches[batchId] || batches.n5;
    document.querySelectorAll("[data-course-label]").forEach((el) => {
      el.textContent = batch.course;
    });
    document.querySelectorAll("[data-portal-label]").forEach((el) => {
      el.textContent = batch.portal;
    });
    document.querySelectorAll("[data-course-option]").forEach((btn) => {
      const isActive = btn.dataset.courseOption === batchId;
      btn.classList.toggle("border-l-4", isActive);
      btn.classList.toggle("border-brand-accent", isActive);
    });
    try {
      localStorage.setItem(batchStorageKey, batchId);
    } catch {
      // ignore
    }
  };

  const applyLang = (lang) => {
    document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
      const isActive = btn.dataset.langToggle === lang;
      btn.classList.toggle("bg-brand-accent", isActive);
      btn.classList.toggle("text-black", isActive);
      btn.classList.toggle("shadow-sm", isActive);
      btn.classList.toggle("text-gray-500", !isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
    document.documentElement.lang = lang === "bn" ? "bn" : "en";
    try {
      localStorage.setItem(langStorageKey, lang);
    } catch {
      // ignore
    }
  };

  const loadStoredState = () => {
    try {
      const storedBatch = localStorage.getItem(batchStorageKey);
      if (storedBatch && batches[storedBatch]) applyBatch(storedBatch);

      const storedLang = localStorage.getItem(langStorageKey);
      if (storedLang === "en" || storedLang === "bn") applyLang(storedLang);

      const notifRead = localStorage.getItem(notifReadKey) === "true";
      if (notifRead) notificationDot?.classList.add("hidden");

      const storedProfile = localStorage.getItem(profileStorageKey);
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        document.querySelectorAll("[data-profile-name]").forEach((el) => {
          if (profile.name) el.textContent = profile.name;
        });
        document.querySelectorAll("[data-profile-display-name]").forEach((el) => {
          if (profile.displayName) el.textContent = profile.displayName;
        });
        const form = document.querySelector("[data-settings-form]");
        if (form) {
          const nameInput = form.querySelector('[name="fullName"]');
          const emailInput = form.querySelector('[name="email"]');
          const phoneInput = form.querySelector('[name="phone"]');
          const classReminders = form.querySelector('[name="classReminders"]');
          const assignmentDeadlines = form.querySelector('[name="assignmentDeadlines"]');
          if (nameInput && profile.name) nameInput.value = profile.name;
          if (emailInput && profile.email) emailInput.value = profile.email;
          if (phoneInput && profile.phone) phoneInput.value = profile.phone;
          if (classReminders) classReminders.checked = profile.classReminders !== false;
          if (assignmentDeadlines) assignmentDeadlines.checked = profile.assignmentDeadlines !== false;
        }
      }
    } catch {
      // ignore corrupt storage
    }
  };

  openSidebarBtn?.addEventListener("click", () => setSidebarOpen(true));
  closeSidebarBtn?.addEventListener("click", () => setSidebarOpen(false));
  sidebarOverlay?.addEventListener("click", () => setSidebarOpen(false));

  openNotificationBtn?.addEventListener("click", () => setNotificationOpen(true));
  closeNotificationBtn?.addEventListener("click", () => setNotificationOpen(false));
  notificationOverlay?.addEventListener("click", () => setNotificationOpen(false));

  chatToggle?.addEventListener("click", () => {
    setChatOpen(!chatWindow?.classList.contains("flex"));
  });
  chatClose?.addEventListener("click", () => setChatOpen(false));

  courseToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    const isHidden = courseMenu?.classList.contains("hidden");
    courseMenu?.classList.toggle("hidden", !isHidden);
    courseToggle.setAttribute("aria-expanded", String(isHidden));
  });

  document.querySelectorAll("[data-course-option]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const batchId = btn.dataset.courseOption;
      if (!batchId || !batches[batchId]) return;
      applyBatch(batchId);
      courseMenu?.classList.add("hidden");
      courseToggle?.setAttribute("aria-expanded", "false");
      showToast(`Switched to ${batches[batchId].course}`);
    });
  });

  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.langToggle;
      if (lang !== "en" && lang !== "bn") return;
      applyLang(lang);
      showToast(lang === "bn" ? "ভাষা বাংলায় পরিবর্তন হয়েছে" : "Language switched to English");
    });
  });

  document.querySelector("[data-profile-link]")?.addEventListener("click", () => {
    window.location.href = "settings.html";
  });

  document.querySelector("[data-join-live]")?.addEventListener("click", () => {
    showToast("Opening live class room...");
  });

  document.querySelector("[data-join-whatsapp]")?.addEventListener("click", () => {
    showToast("Redirecting to WhatsApp group...");
    window.setTimeout(() => {
      window.open("https://wa.me/", "_blank", "noopener,noreferrer");
    }, 600);
  });

  document.querySelectorAll("[data-task-card]").forEach((card) => {
    card.addEventListener("click", () => setNotificationOpen(true));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setNotificationOpen(true);
      }
    });
  });

  document.querySelectorAll("[data-notification-item]").forEach((item) => {
    item.addEventListener("click", () => {
      const task = item.dataset.notificationItem || "Task";
      showToast(`Opening ${task}...`);
    });
  });

  document.querySelector("[data-contact-support]")?.addEventListener("click", () => {
    setChatOpen(true);
    showToast("Sensei AI is ready to help!");
  });

  document.querySelectorAll("[data-leaderboard-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.leaderboardTab;
      document.querySelectorAll("[data-leaderboard-tab]").forEach((btn) => {
        const isActive = btn.dataset.leaderboardTab === target;
        btn.classList.toggle("bg-brand-accent", isActive);
        btn.classList.toggle("text-black", isActive);
        btn.classList.toggle("shadow-sm", isActive);
        btn.classList.toggle("text-gray-500", !isActive);
      });
      document.querySelectorAll("[data-leaderboard-panel]").forEach((panel) => {
        panel.classList.toggle("hidden", panel.dataset.leaderboardPanel !== target);
      });
    });
  });

  document.querySelectorAll("[data-attendance-row]").forEach((row) => {
    if (row.dataset.status !== "missed") return;
    row.classList.add("cursor-pointer");
    row.addEventListener("click", () => {
      window.location.href = "recordings-chapter-02.html";
    });
  });

  const settingsForm = document.querySelector("[data-settings-form]");
  settingsForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = {
      name: settingsForm.querySelector('[name="fullName"]')?.value.trim() || "",
      email: settingsForm.querySelector('[name="email"]')?.value.trim() || "",
      phone: settingsForm.querySelector('[name="phone"]')?.value.trim() || "",
      displayName: (settingsForm.querySelector('[name="fullName"]')?.value.trim() || "Rafi").split(" ")[0],
      classReminders: settingsForm.querySelector('[name="classReminders"]')?.checked ?? true,
      assignmentDeadlines: settingsForm.querySelector('[name="assignmentDeadlines"]')?.checked ?? true,
    };
    try {
      localStorage.setItem(profileStorageKey, JSON.stringify(data));
    } catch {
      // ignore
    }
    document.querySelectorAll("[data-profile-name]").forEach((el) => {
      el.textContent = data.displayName;
    });
    document.querySelectorAll("[data-profile-display-name]").forEach((el) => {
      el.textContent = data.name || data.displayName;
    });
    showToast("Profile settings saved!");
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

  const appendMessage = (role, text) => {
    if (!chatLog) return;
    const row = document.createElement("div");
    row.className = role === "user" ? "flex justify-end" : "flex justify-start";
    const bubble = document.createElement("div");
    bubble.className =
      role === "user"
        ? "max-w-[85%] rounded-2xl rounded-tr-none bg-brand-accent p-3 text-sm font-bold text-black shadow-sm"
        : "max-w-[85%] rounded-2xl rounded-tl-none border border-gray-100 bg-gray-50 p-3 text-sm font-bold dark:border-white/5 dark:bg-[#2a2a2a] dark:text-white shadow-sm";
    bubble.textContent = text;
    row.appendChild(bubble);
    chatLog.appendChild(row);
    chatLog.scrollTop = chatLog.scrollHeight;
  };

  const aiReplies = [
    "Konnichiwa! I am your Japanese Sensei. I can help with vocabulary, grammar, and study planning.",
    "Try reviewing Hiragana charts for 15 minutes daily. Consistency beats cramming!",
    "For particles, remember: wa marks the topic, ga marks the subject, o marks the direct object.",
    "Your next mock test covers N5 vocabulary. Shall I suggest a study plan?",
  ];

  const sendMessage = () => {
    const text = chatInput?.value.trim();
    if (!text) return;
    appendMessage("user", text);
    chatInput.value = "";
    typing?.classList.remove("hidden");
    window.setTimeout(() => {
      typing?.classList.add("hidden");
      const reply = aiReplies[Math.floor(Math.random() * aiReplies.length)];
      appendMessage("ai", reply);
    }, 700);
  };

  chatSend?.addEventListener("click", sendMessage);
  chatInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendMessage();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    setSidebarOpen(false);
    setNotificationOpen(false);
    setChatOpen(false);
    courseMenu?.classList.add("hidden");
    courseToggle?.setAttribute("aria-expanded", "false");
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) setSidebarOpen(false);
    if (window.innerWidth >= 640 && notificationPanel?.classList.contains("translate-x-0")) {
      document.body.classList.remove("dashboard-notification-open");
    }
  });

  loadStoredState();
  window.dashboardShowToast = showToast;
})();
