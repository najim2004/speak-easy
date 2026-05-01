const courseViewStorageKey = "speakEasyCourseView";

const getStoredCourseView = () => {
  try {
    return localStorage.getItem(courseViewStorageKey);
  } catch {
    return null;
  }
};

const storeCourseView = (view) => {
  try {
    localStorage.setItem(courseViewStorageKey, view);
  } catch {
    // Local storage can be unavailable in private or restricted browser modes.
  }
};

document.querySelectorAll("[data-course-list]").forEach((courseList) => {
  const toggle = document.querySelector("[data-course-view-toggle]");
  const cards = courseList.querySelectorAll("[data-course-card]");

  if (!toggle || !cards.length) {
    return;
  }

  const listClasses = {
    list: "mb-16 grid w-full grid-cols-1 gap-6 md:mb-[123px] md:gap-[50px]",
    item: "bg-[#f3f3f3] px-4 py-8 dark:bg-[#1A1A1A] sm:px-6 md:py-[55px]",
    card: "mx-auto flex w-full max-w-section flex-col gap-6 rounded-[15px] border border-black/10 bg-white/80 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.08)] dark:border-white/20 dark:bg-[rgba(56,239,8,0.2)] dark:shadow-none sm:p-6 lg:flex-row lg:items-center lg:gap-[50px] lg:p-[40px]",
    image:
      "aspect-[16/10] h-auto w-full rounded-[15px] object-cover lg:h-[382px] lg:w-[551px]",
    body: "flex-1",
    title:
      "font-inter text-3xl font-bold leading-tight text-[#0d0d0d] dark:text-white sm:text-4xl lg:line-clamp-1 lg:text-[47px] lg:leading-[57px]",
    description:
      "mt-4 font-inter text-base font-medium leading-6 text-[#595959] dark:text-[#C1C1C1] sm:text-xl sm:leading-7 lg:mt-[25px] lg:text-[25px] lg:leading-[30px]",
    meta: "mt-5 grid gap-3 font-inter text-base font-medium leading-6 text-[#0d0d0d] dark:text-white sm:text-xl sm:leading-7 lg:mt-[21px] lg:gap-4 lg:text-[28px] lg:leading-[34px]",
    icon: "mt-0.5 size-5 shrink-0 brightness-0 dark:brightness-100 sm:mt-0 sm:size-7",
    action:
      "mt-6 flex w-full items-center justify-center rounded-[15px] bg-brand-accent px-6 py-3 font-inter text-xl font-semibold leading-7 text-[#262626] sm:text-2xl sm:leading-[29px] lg:mt-7 lg:px-8 lg:py-2.5",
  };

  const gridClasses = {
    list: "mx-auto mb-16 grid w-full max-w-section grid-cols-1 gap-5 px-4 sm:grid-cols-2 sm:px-6 md:mb-[123px] lg:grid-cols-3 xl:px-0",
    item: "min-w-0",
    card: "mx-auto flex h-full w-full max-w-[383px] flex-col overflow-hidden rounded-[15px] border border-black/10 bg-[#f3f3f3] shadow-[0_18px_45px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-[rgba(217,217,217,0.2)] dark:shadow-none",
    image: "aspect-[383/242] h-auto w-full rounded-t-[15px] object-cover",
    body: "flex flex-1 flex-col px-4 pb-6 pt-5 sm:px-[21px] sm:pb-8 sm:pt-[25px]",
    title: "font-inter text-[22px] font-bold leading-7 text-[#0d0d0d] dark:text-white sm:text-2xl sm:leading-[29px]",
    description:
      "mt-2 font-inter text-sm font-medium leading-5 text-[#595959] dark:text-white sm:text-base sm:leading-[19px]",
    meta: "mb-2 mt-5 grid gap-3 font-inter text-base font-medium leading-6 text-[#0d0d0d] dark:text-white sm:mt-[22px] sm:text-lg sm:leading-[22px]",
    icon: "mt-0.5 size-5 shrink-0 brightness-0 dark:brightness-100 sm:mt-0 sm:size-[22px]",
    action:
      "mt-auto flex w-full items-center justify-center rounded-[15px] bg-brand-accent px-5 py-3 font-inter text-xl font-semibold leading-7 text-black sm:px-6 sm:text-2xl sm:leading-[29px]",
  };

  const setView = (view) => {
    const activeClasses = view === "grid" ? gridClasses : listClasses;
    const isGrid = view === "grid";
    courseList.className = activeClasses.list;

    cards.forEach((card) => {
      const item = card.closest("[data-course-item]");
      const image = card.querySelector("[data-course-image]");
      const body = card.querySelector("[data-course-body]");
      const title = card.querySelector("[data-course-title]");
      const description = card.querySelector("[data-course-description]");
      const meta = card.querySelector("[data-course-meta]");
      const action = card.querySelector("[data-course-action]");

      if (item) item.className = activeClasses.item;
      card.className = activeClasses.card;
      if (image) image.className = activeClasses.image;
      if (body) body.className = activeClasses.body;
      if (title) title.className = activeClasses.title;
      if (description) description.className = activeClasses.description;
      if (meta) meta.className = activeClasses.meta;
      if (action) action.className = activeClasses.action;

      card.querySelectorAll("[data-course-meta-icon]").forEach((icon) => {
        icon.className = activeClasses.icon;
      });
    });

    const listIcon = toggle.querySelector("[data-course-list-icon]");
    const gridIcon = toggle.querySelector("[data-course-grid-icon]");

    if (listIcon) {
      listIcon.hidden = !isGrid;
    }

    if (gridIcon) {
      gridIcon.hidden = isGrid;
    }

    toggle.dataset.courseView = view;
    toggle.setAttribute("aria-pressed", String(isGrid));
    toggle.setAttribute(
      "aria-label",
      isGrid ? "Show courses as list" : "Show courses as grid",
    );
  };

  toggle.addEventListener("click", () => {
    const nextView = toggle.dataset.courseView === "grid" ? "list" : "grid";
    setView(nextView);
    storeCourseView(nextView);
  });

  const initialCourseView = getStoredCourseView() === "grid" ? "grid" : "list";
  setView(initialCourseView);
});
