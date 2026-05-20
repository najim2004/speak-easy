window.initDashboardShell?.();

const searchInput = document.querySelector("[data-recording-search]");
const chapterCards = document.querySelectorAll("[data-chapter-card]");
const chapterList = document.querySelector("[data-chapter-list]");
const lessonView = document.querySelector("[data-lesson-view]");
const backButton = document.querySelector("[data-back-to-chapters]");
const lessonTitle = document.querySelector("[data-lesson-title]");
const toast = document.querySelector("[data-recording-toast]");
const toastText = document.querySelector("[data-recording-toast-text]");

searchInput?.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  chapterCards.forEach((card) => {
    const title = card.dataset.chapterTitle?.toLowerCase() || "";
    card.classList.toggle("hidden", query.length > 0 && !title.includes(query));
  });
});

chapterCards.forEach((card) => {
  card.addEventListener("click", () => {
    chapterList?.classList.add("hidden");
    lessonView?.classList.remove("hidden");
    if (lessonTitle) {
      lessonTitle.textContent = card.dataset.chapterTitle || "Chapter Lessons";
    }
  });
});

backButton?.addEventListener("click", () => {
  lessonView?.classList.add("hidden");
  chapterList?.classList.remove("hidden");
});

document.querySelectorAll("[data-worksheet-button]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!toast || !toastText) return;
    toastText.textContent =
      button.dataset.hasWorksheet === "true"
        ? "Downloading worksheet..."
        : "No worksheet for this lesson";
    toast.classList.remove("hidden");
    toast.classList.add("flex");
    window.setTimeout(() => {
      toast.classList.add("hidden");
      toast.classList.remove("flex");
    }, 2200);
  });
});
