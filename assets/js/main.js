const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a[href^='#']");
const eventTriggers = document.querySelectorAll(".event-trigger");
const eventModal = document.querySelector(".event-modal");
const eventModalImage = document.querySelector("[data-event-modal-image]");
const eventModalTitle = document.querySelector("[data-event-modal-title]");
const eventModalDate = document.querySelector("[data-event-modal-date]");
const eventModalDescription = document.querySelector("[data-event-modal-description]");
const eventModalCloseButtons = document.querySelectorAll("[data-event-modal-close]");
const heroImage = document.querySelector(".hero-media img");
let lastEventTrigger = null;

const backgroundImages = [
  "assets/images/5BAC26DD-0B5B-4CE4-8FFF-66D4CD539FB1.png",
  "assets/images/0A52CE7F-0C8B-4C3D-947C-A8755B47CF1D.png",
  "assets/images/41E7BD85-51A6-47CA-8743-9803CADCC462.png",
  "assets/images/A1302C6D-5813-44A3-976D-C2C35DA7F03C.png",
];

const drinksMenuData = [
  {
    id: "yuzu-gin-fizz",
    nameZh: "柚子金酒菲士",
    nameEn: "Yuzu Gin Fizz",
    image: "assets/images/drink-1.JPG",
    ingredients: [
      { zh: "柚子", en: "Yuzu" },
      { zh: "金酒", en: "Gin" },
      { zh: "气泡", en: "Sparkling" },
    ],
    price: "68",
    descriptionZh: "明亮清爽，适合作为夜晚第一首歌。",
    descriptionEn: "Bright, lifted, and easy as the opening track.",
    tags: ["金酒 Gin", "气泡 Sparkling"],
  },
  {
    id: "house-highball",
    nameZh: "招牌海波",
    nameEn: "House Highball",
    image: "assets/images/drink-2.JPG",
    ingredients: [
      { zh: "威士忌", en: "Whisky" },
      { zh: "苏打", en: "Soda" },
      { zh: "柑橘", en: "Citrus" },
    ],
    price: "58",
    descriptionZh: "清爽、微甜，适合第一杯。",
    descriptionEn: "Crisp, lightly sweet, and easy as a first drink.",
    tags: ["威士忌 Whisky", "清爽 Light"],
  },
  {
    id: "rabbit-cola-zero",
    nameZh: "白兔零度可乐",
    nameEn: "Rabbit Cola Zero",
    image: "assets/images/drink-1.JPG",
    ingredients: [
      { zh: "零度可乐", en: "Cola Zero" },
      { zh: "香草", en: "Vanilla" },
      { zh: "柠檬", en: "Lemon" },
    ],
    price: "42",
    descriptionZh: "无酒精，但有完整节奏。",
    descriptionEn: "Alcohol-free, cola-bright, and still fully in the groove.",
    tags: ["无酒精 Zero Proof", "可乐 Cola"],
  },
];

const coffeeMenuData = [
  {
    id: "dirty",
    nameZh: "脏咖啡",
    nameEn: "Dirty",
    image: "assets/images/coffee-1.jpg",
    ingredients: [
      { zh: "浓缩咖啡", en: "Espresso" },
      { zh: "冰牛奶", en: "Cold milk" },
    ],
    price: "36",
    descriptionZh: "浓缩咖啡落入冰牛奶。",
    descriptionEn: "Espresso poured into cold milk.",
    tags: ["冰饮 Iced", "浓缩 Espresso"],
  },
  {
    id: "brown-sugar-latte",
    nameZh: "黑糖拿铁",
    nameEn: "Brown Sugar Latte",
    image: "assets/images/coffee-2.jpg",
    ingredients: [
      { zh: "浓缩咖啡", en: "Espresso" },
      { zh: "牛奶", en: "Milk" },
      { zh: "黑糖", en: "Brown sugar" },
    ],
    price: "38",
    descriptionZh: "柔和甜感，适合慢慢喝。",
    descriptionEn: "Soft sweetness, made for slow sipping.",
    tags: ["拿铁 Latte", "黑糖 Brown Sugar"],
  },
  {
    id: "hand-brew",
    nameZh: "手冲咖啡",
    nameEn: "Hand Brew",
    image: "assets/images/coffee-1.jpg",
    ingredients: [
      { zh: "每日豆单", en: "Daily beans" },
      { zh: "手冲", en: "Filter brew" },
    ],
    price: "48",
    descriptionZh: "每日豆单，吧台推荐。",
    descriptionEn: "Daily beans, recommended at the bar.",
    tags: ["手冲 Filter", "吧台推荐 Bar Pick"],
  },
];

if (heroImage) {
  const lastBackground = localStorage.getItem("backtoInnHeroBackground");
  const availableImages = backgroundImages.filter((image) => image !== lastBackground);
  const imagePool = availableImages.length ? availableImages : backgroundImages;
  const nextBackground = imagePool[Math.floor(Math.random() * imagePool.length)];

  heroImage.src = nextBackground;
  heroImage.alt = "白兔町空间氛围背景 / BACKTO INN lounge background";
  localStorage.setItem("backtoInnHeroBackground", nextBackground);
}

const closeMobileMenu = () => {
  if (!navToggle || !siteNav) {
    return;
  }

  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
  siteNav.classList.remove("is-open");
};

const openMobileMenu = () => {
  if (!navToggle || !siteNav) {
    return;
  }

  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close navigation menu");
  siteNav.classList.add("is-open");
};

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMobileMenu();
      return;
    }

    openMobileMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });
}

if (navLinks.length) {
  const sectionLinks = [...navLinks].map((link) => ({
    link,
    section: document.querySelector(link.getAttribute("href")),
  })).filter((item) => item.section);

  const setActiveLink = (activeLink) => {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link === activeLink);
    });
  };

  const currentHashLink = [...navLinks].find((link) => link.getAttribute("href") === window.location.hash);
  setActiveLink(currentHashLink);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setActiveLink(link);
      closeMobileMenu();
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) {
        return;
      }

      const activeItem = sectionLinks.find((item) => item.section === visibleEntry.target);

      if (activeItem) {
        setActiveLink(activeItem.link);
      }
    }, {
      rootMargin: "-34% 0px -52%",
      threshold: [0.2, 0.45, 0.7],
    });

    sectionLinks.forEach((item) => observer.observe(item.section));
  }
}

const getModalFocusableItems = () => eventModal
  ? [...eventModal.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")]
    .filter((item) => !item.disabled && item.offsetParent !== null)
  : [];

const closeEventModal = () => {
  if (!eventModal || eventModal.hidden) {
    return;
  }

  eventModal.hidden = true;
  document.body.classList.remove("modal-open");

  if (lastEventTrigger) {
    lastEventTrigger.focus();
  }
};

const openEventModal = (trigger) => {
  if (!eventModal) {
    return;
  }

  lastEventTrigger = trigger;

  if (eventModalImage && trigger.dataset.image) {
    eventModalImage.src = trigger.dataset.image;
    eventModalImage.alt = `${trigger.dataset.title} 完整活动海报 / Full event poster`;
  }

  if (eventModalTitle && trigger.dataset.title) {
    eventModalTitle.textContent = trigger.dataset.title;
  }

  if (eventModalDate && trigger.dataset.date) {
    eventModalDate.textContent = trigger.dataset.date;
  }

  if (eventModalDescription && trigger.dataset.description) {
    eventModalDescription.textContent = trigger.dataset.description;
  }

  eventModal.hidden = false;
  document.body.classList.add("modal-open");

  const focusableItems = getModalFocusableItems();

  if (focusableItems[0]) {
    focusableItems[0].focus();
  }
};

eventTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openEventModal(trigger));
});

eventModalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeEventModal);
});

document.addEventListener("keydown", (event) => {
  if (!eventModal || eventModal.hidden) {
    return;
  }

  if (event.key === "Escape") {
    closeEventModal();
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusableItems = getModalFocusableItems();

  if (!focusableItems.length) {
    return;
  }

  const firstItem = focusableItems[0];
  const lastItem = focusableItems[focusableItems.length - 1];

  if (event.shiftKey && document.activeElement === firstItem) {
    event.preventDefault();
    lastItem.focus();
  } else if (!event.shiftKey && document.activeElement === lastItem) {
    event.preventDefault();
    firstItem.focus();
  }
});

const escapeHTML = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const padPageNumber = (number) => String(number).padStart(2, "0");

const renderMenuTags = (tags = []) => tags
  .map((tag) => `<span>${escapeHTML(tag)}</span>`)
  .join("");

const getItemName = (item) => `${item.nameZh}${item.nameEn ? ` ${item.nameEn}` : ""}`;

const renderBilingualName = (item) => `
  <span class="zh">${escapeHTML(item.nameZh)}</span>
  ${item.nameEn ? `<span class="en">${escapeHTML(item.nameEn)}</span>` : ""}
`;

const renderBilingualText = (zh, en) => `
  <span class="zh">${escapeHTML(zh)}</span>
  ${en ? `<span class="en">${escapeHTML(en)}</span>` : ""}
`;

const renderIngredients = (ingredients = []) => ingredients
  .map((ingredient) => `
    <li>
      <span class="zh">${escapeHTML(ingredient.zh || ingredient)}</span>
      ${ingredient.en ? `<span class="en">${escapeHTML(ingredient.en)}</span>` : ""}
    </li>
  `)
  .join("");

class FlipBookMenu {
  constructor(root, options) {
    this.root = root;
    this.type = options.type;
    this.titleZh = options.zhTitle;
    this.titleEn = options.enTitle;
    this.subtitleZh = options.subtitleZh;
    this.subtitleEn = options.subtitleEn;
    this.kicker = options.kicker;
    this.catalog = options.catalog;
    this.discCatalog = options.discCatalog || options.catalog;
    this.coverImage = options.coverImage;
    this.coverAlt = options.coverAlt || `${options.zhTitle} ${options.enTitle} cover`;
    this.items = options.items;
    this.currentPage = -1;
    this.paddedItemPages = this.items.length + (this.items.length % 2);
    this.animationTimer = null;
    this.isAnimating = false;
    this.animationDuration = 780;
    this.mobileQuery = window.matchMedia
      ? window.matchMedia("(max-width: 820px)")
      : { matches: false };
    this.reducedMotionQuery = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : { matches: false };
    this.handleViewportChange = () => {
      this.currentPage = this.normalizeTargetPage(this.currentPage);
      this.renderPage();
    };

    this.renderShell();
    this.bindEvents();
    this.bindMediaQuery();
    this.renderPage();
  }

  renderShell() {
    const totalPages = this.paddedItemPages;

    this.root.innerHTML = `
      <div class="flipbook-component flipbook-${escapeHTML(this.type)}" data-flipbook-component>
        <div class="menu-jewel-case">
          ${this.renderMenuCDDisc()}
          <div class="menu-booklet-stage">
            <div class="flipbook-stage-toolbar" aria-label="${escapeHTML(this.titleZh)} / ${escapeHTML(this.titleEn)} 小册控制 / booklet controls">
              <p class="flipbook-catalog">${escapeHTML(this.catalog)}</p>
              <div class="flipbook-stage-actions">
                <button class="flipbook-contents-button" type="button" data-flip-action="contents" aria-label="返回目录 / Back to Contents">
                  <span aria-hidden="true">≡</span>
                  <span>返回目录 / Back to Contents</span>
                </button>
                <button class="flipbook-close-button" type="button" data-flip-action="close" aria-label="关闭小册 / Close Booklet">
                  <span aria-hidden="true">×</span>
                  <span>关闭小册 / Close Booklet</span>
                </button>
              </div>
            </div>
            <div class="flipbook-book" data-flipbook-book tabindex="0" role="group" aria-label="${escapeHTML(this.titleZh)} / ${escapeHTML(this.titleEn)} 翻页册 / booklet, ${totalPages} 页 / menu pages">
              <div class="flipbook-spine" aria-hidden="true"></div>
              <div class="flipbook-pages" data-flipbook-pages></div>
              <button class="flipbook-edge-nav flipbook-edge-prev" type="button" data-flip-action="prev" aria-label="上一页 / Previous page">
                <span class="flipbook-edge-arrow" aria-hidden="true">←</span>
                <span class="flipbook-edge-label">上一页<br><small>Previous</small></span>
              </button>
              <button class="flipbook-edge-nav flipbook-edge-next" type="button" data-flip-action="next" aria-label="下一页 / Next page">
                <span class="flipbook-edge-arrow" aria-hidden="true">→</span>
                <span class="flipbook-edge-label">下一页<br><small>Next</small></span>
              </button>
            </div>
            <footer class="flipbook-controls" aria-label="${escapeHTML(this.titleZh)} / ${escapeHTML(this.titleEn)} 页码状态 / page status">
              <p class="flipbook-page-indicator" data-page-indicator aria-live="polite">封面 / Cover</p>
            </footer>
          </div>
        </div>
      </div>
    `;

    this.component = this.root.querySelector("[data-flipbook-component]");
    this.book = this.root.querySelector("[data-flipbook-book]");
    this.pages = this.root.querySelector("[data-flipbook-pages]");
    this.indicator = this.root.querySelector("[data-page-indicator]");
    this.previousButton = this.root.querySelector("[data-flip-action='prev']");
    this.nextButton = this.root.querySelector("[data-flip-action='next']");
    this.contentsButtons = this.root.querySelectorAll("[data-flip-action='contents']");
    this.closeButtons = this.root.querySelectorAll("[data-flip-action='close']");
  }

  renderMenuCDDisc() {
    return `
      <div class="menu-disc-tray" aria-label="${escapeHTML(this.titleZh)} / ${escapeHTML(this.titleEn)} CD">
        <div class="menu-cd-disc" aria-hidden="true">
          <span class="menu-cd-shine"></span>
          <span class="menu-cd-center"></span>
          <span class="menu-cd-label">
            <span class="zh">${escapeHTML(this.titleZh)}</span>
            <span class="en">${escapeHTML(this.titleEn)}</span>
          </span>
          <span class="menu-cd-catalog">${escapeHTML(this.discCatalog)}</span>
        </div>
      </div>
    `;
  }

  bindMediaQuery() {
    if (this.mobileQuery.addEventListener) {
      this.mobileQuery.addEventListener("change", this.handleViewportChange);
    } else if (this.mobileQuery.addListener) {
      this.mobileQuery.addListener(this.handleViewportChange);
    }
  }

  bindEvents() {
    this.root.addEventListener("click", (event) => {
      const clickedElement = event.target instanceof Element ? event.target : event.target.parentElement;
      const targetButton = clickedElement?.closest("[data-flip-target]");
      const actionButton = clickedElement?.closest("[data-flip-action]");

      if (targetButton && this.root.contains(targetButton)) {
        this.goTo(Number(targetButton.dataset.flipTarget));
        return;
      }

      if (!actionButton || !this.root.contains(actionButton)) {
        return;
      }

      const action = actionButton.dataset.flipAction;

      if (action === "prev") {
        this.goPrevious();
      } else if (action === "next") {
        this.goNext();
      } else if (action === "open") {
        this.goTo(0, "open");
      } else if (action === "contents") {
        this.goTo(0, "prev");
      } else if (action === "close") {
        this.goTo(-1, "close");
      }
    });

    this.root.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
        return;
      }

      event.preventDefault();

      if (event.key === "ArrowRight") {
        this.goNext();
      } else {
        this.goPrevious();
      }
    });
  }

  isMobileView() {
    return this.mobileQuery.matches;
  }

  getSpreadStart(pageNumber = this.currentPage) {
    if (pageNumber <= 0) {
      return 0;
    }

    return pageNumber % 2 === 0 ? pageNumber - 1 : pageNumber;
  }

  normalizeTargetPage(targetPage) {
    const clampedPage = Math.max(-1, Math.min(targetPage, this.paddedItemPages));

    if (clampedPage <= 0 || this.isMobileView()) {
      return clampedPage;
    }

    return this.getSpreadStart(clampedPage);
  }

  goNext() {
    if (this.currentPage < 0) {
      this.goTo(0, "open");
      return;
    }

    if (this.isMobileView()) {
      this.goTo(this.currentPage + 1, "next");
      return;
    }

    if (this.currentPage === 0) {
      this.goTo(1, "next");
      return;
    }

    this.goTo(this.getSpreadStart() + 2, "next");
  }

  goPrevious() {
    if (this.currentPage < 0) {
      return;
    }

    if (this.currentPage === 0) {
      this.goTo(-1, "close");
      return;
    }

    if (this.isMobileView()) {
      this.goTo(this.currentPage - 1, "prev");
      return;
    }

    if (this.currentPage <= 1) {
      this.goTo(0, "prev");
      return;
    }

    this.goTo(this.getSpreadStart() - 2, "prev");
  }

  goTo(targetIndex, explicitDirection) {
    if (this.isAnimating && !this.reducedMotionQuery.matches) {
      return;
    }

    const nextIndex = this.normalizeTargetPage(targetIndex);

    if (nextIndex === this.currentPage) {
      return;
    }

    const direction = explicitDirection || (nextIndex > this.currentPage ? "next" : "prev");
    const turnPageClone = this.reducedMotionQuery.matches
      ? null
      : this.getTurnPageClone(direction);

    this.currentPage = nextIndex;
    this.renderPage();
    this.playPageAnimation(direction, turnPageClone);
  }

  getTurnPageClone(direction) {
    const selectors = direction === "open" || direction === "close"
      ? [".flipbook-closed-cover", ".flipbook-toc", ".flipbook-page-right", ".flipbook-page-left", ".flipbook-page"]
      : this.isMobileView()
      ? [".flipbook-page-single", ".flipbook-toc", ".flipbook-page-right", ".flipbook-page-left", ".flipbook-page"]
      : [direction === "prev" ? ".flipbook-page-left" : ".flipbook-page-right", ".flipbook-page"];
    const page = selectors
      .map((selector) => this.pages.querySelector(selector))
      .find(Boolean);

    if (!page) {
      return null;
    }

    const clone = page.cloneNode(true);
    clone.classList.add("flipbook-turn-page");
    clone.querySelectorAll("button, a").forEach((control) => {
      control.setAttribute("tabindex", "-1");
      control.setAttribute("aria-hidden", "true");

      if ("disabled" in control) {
        control.disabled = true;
      }
    });

    return clone;
  }

  playPageAnimation(direction, turnPageClone) {
    this.book.classList.remove("is-flipping-next", "is-flipping-prev", "is-opening-booklet", "is-closing-booklet");
    window.clearTimeout(this.animationTimer);
    this.book.querySelectorAll(".flipbook-turn-sheet").forEach((sheet) => sheet.remove());

    if (this.reducedMotionQuery.matches) {
      return;
    }

    this.isAnimating = true;
    this.updateControlStates();

    void this.book.offsetWidth;
    const animationClass = direction === "open"
      ? "is-opening-booklet"
      : direction === "close"
        ? "is-closing-booklet"
        : direction === "prev"
          ? "is-flipping-prev"
          : "is-flipping-next";
    this.book.classList.add(animationClass);

    const turnSheet = document.createElement("div");
    turnSheet.className = `flipbook-turn-sheet flipbook-turn-${direction}`;
    turnSheet.setAttribute("aria-hidden", "true");

    if (turnPageClone) {
      turnSheet.append(turnPageClone);
    }

    this.book.append(turnSheet);

    this.animationTimer = window.setTimeout(() => {
      this.book.classList.remove("is-flipping-next", "is-flipping-prev", "is-opening-booklet", "is-closing-booklet");
      turnSheet.remove();
      this.isAnimating = false;
      this.updateControlStates();
    }, this.animationDuration);
  }

  renderPage() {
    this.pages.innerHTML = this.currentPage < 0
      ? this.renderMenuBookletCover()
      : this.currentPage === 0
        ? this.renderMenuTrackList()
        : this.renderMenuPages();

    this.component.classList.toggle("is-closed", this.currentPage < 0);
    this.component.classList.toggle("is-toc", this.currentPage === 0);
    this.component.classList.toggle("is-item-page", this.currentPage > 0);
    this.book.classList.toggle("is-closed", this.currentPage < 0);
    this.book.classList.toggle("is-cover", this.currentPage === 0);
    this.book.classList.toggle("is-item-page", this.currentPage > 0);
    this.book.classList.toggle("is-mobile-page", this.isMobileView());
    this.indicator.textContent = this.getPageIndicator();
    this.updateControlStates();
  }

  updateControlStates() {
    this.previousButton.disabled = this.currentPage < 0 || this.isAnimating;
    this.nextButton.disabled = !this.hasNextPage() || this.isAnimating;
    this.contentsButtons.forEach((button) => {
      button.disabled = this.currentPage <= 0 || this.isAnimating;
    });
    this.closeButtons.forEach((button) => {
      button.disabled = this.currentPage !== 0 || this.isAnimating;
    });
  }

  renderMenuBookletCover() {
    return `
      <div class="flipbook-spread flipbook-closed-spread">
        <section class="flipbook-page flipbook-closed-cover" aria-label="${escapeHTML(this.titleZh)} / ${escapeHTML(this.titleEn)} 小册封面 / booklet cover">
          <button class="flipbook-closed-cover-button" type="button" data-flip-action="open" aria-label="打开 ${escapeHTML(this.titleZh)} / ${escapeHTML(this.titleEn)} 小册 / Open booklet">
            <span class="closed-cover-placeholder">
              ${this.coverImage ? `<img class="closed-cover-image" src="${escapeHTML(this.coverImage)}" alt="${escapeHTML(this.coverAlt)}">` : ""}
            </span>
            <span class="closed-cover-open-label">点击打开 / TAP TO OPEN</span>
          </button>
        </section>
      </div>
    `;
  }

  renderMenuTrackList() {
    const midpoint = Math.ceil(this.items.length / 2);
    const leftTracks = this.renderTrackItems(this.items.slice(0, midpoint), 0);
    const rightTracks = this.renderTrackItems(this.items.slice(midpoint), midpoint);

    if (this.isMobileView()) {
      return `
        <div class="flipbook-spread flipbook-track-spread flipbook-single-page">
          <section class="flipbook-page flipbook-page-single flipbook-toc flipbook-track-page" aria-label="${escapeHTML(this.titleZh)} / ${escapeHTML(this.titleEn)} 目录 / table of contents">
            ${this.renderTrackListHeader("目录", "Table of Contents", "曲目", "Tracks")}
            <ol class="flipbook-toc-list">
              ${this.renderTrackItems(this.items, 0)}
            </ol>
          </section>
        </div>
      `;
    }

    return `
      <div class="flipbook-spread flipbook-track-spread">
        <section class="flipbook-page flipbook-page-left flipbook-toc flipbook-track-page" aria-label="${escapeHTML(this.titleZh)} / ${escapeHTML(this.titleEn)} 目录左页 / table of contents left page">
          ${this.renderTrackListHeader("目录", "Table of Contents", "曲目", "Tracks")}
          <ol class="flipbook-toc-list">
            ${leftTracks}
          </ol>
        </section>
        <section class="flipbook-page flipbook-page-right flipbook-toc flipbook-track-page" aria-label="${escapeHTML(this.titleZh)} / ${escapeHTML(this.titleEn)} 目录右页 / table of contents right page">
          ${this.renderTrackListHeader("曲目续", "Tracks Continued", this.titleZh, this.titleEn)}
          <ol class="flipbook-toc-list">
            ${rightTracks}
          </ol>
        </section>
      </div>
    `;
  }

  renderTrackListHeader(labelZh, labelEn, headingZh, headingEn) {
    return `
      <p class="booklet-label">${escapeHTML(labelZh)} / ${escapeHTML(labelEn)}</p>
      <h4 class="flipbook-toc-heading">${escapeHTML(headingZh)} <span>${escapeHTML(headingEn)}</span></h4>
      <p class="flipbook-toc-album">${renderBilingualText(this.titleZh, this.titleEn)}</p>
      <p class="flipbook-toc-hint">点击查看 / Tap to view</p>
    `;
  }

  renderTrackItems(items, offset) {
    return items.map((item, index) => {
      const itemIndex = offset + index;

      return `
        <li>
          <button class="flipbook-toc-item" type="button" data-flip-target="${itemIndex + 1}" aria-label="打开 ${escapeHTML(getItemName(item))} 页面 / Open page">
            <span class="flipbook-toc-number">${padPageNumber(itemIndex + 1)}</span>
            <span class="flipbook-toc-name">${renderBilingualName(item)}</span>
            ${item.price ? `<span class="flipbook-toc-price">¥${escapeHTML(item.price)}</span>` : ""}
          </button>
        </li>
      `;
    }).join("");
  }

  renderMenuPages() {
    if (this.isMobileView()) {
      return `
        <div class="flipbook-spread flipbook-item-spread flipbook-single-page">
          ${this.renderBookletPage(this.currentPage, "single")}
        </div>
      `;
    }

    const spreadStart = this.getSpreadStart();

    return `
      <div class="flipbook-spread flipbook-item-spread">
        ${this.renderBookletPage(spreadStart, "left")}
        ${this.renderBookletPage(spreadStart + 1, "right")}
      </div>
    `;
  }

  renderBookletPage(pageNumber, position) {
    const item = this.items[pageNumber - 1];
    const positionClass = position === "right"
      ? "flipbook-page-right"
      : position === "left"
        ? "flipbook-page-left"
        : "flipbook-page-single";

    if (!item) {
      return this.renderClosingPage(pageNumber, positionClass);
    }

    return `
      <section class="flipbook-page ${positionClass} flipbook-menu-item-page" aria-label="${escapeHTML(getItemName(item))} 详情 / details">
        <p class="booklet-label">酒水第 ${padPageNumber(pageNumber)} 页 / Drinks Page ${padPageNumber(pageNumber)}</p>
        <figure class="menu-page-photo">
          <img src="${escapeHTML(item.image)}" alt="${escapeHTML(getItemName(item))} 照片 / photo">
        </figure>
        <div class="menu-page-copy">
          <div class="menu-page-title-row">
            <h4>${renderBilingualName(item)}</h4>
            <p class="flipbook-price"><span>价格 / Price</span><strong>¥${escapeHTML(item.price)}</strong></p>
          </div>
          <p class="menu-page-section-label">配料 / Ingredients</p>
          <ul class="menu-page-ingredients" aria-label="配料 / Ingredients">
            ${renderIngredients(item.ingredients)}
          </ul>
          ${item.descriptionZh ? `<p class="flipbook-description">${renderBilingualText(item.descriptionZh, item.descriptionEn)}</p>` : ""}
          ${item.tags?.length ? `<div class="flipbook-tags" aria-label="标签 / Tags">${renderMenuTags(item.tags)}</div>` : ""}
        </div>
      </section>
    `;
  }

  renderClosingPage(pageNumber, positionClass) {
    return `
      <section class="flipbook-page ${positionClass} flipbook-closing-page" aria-label="内页结束 / End of booklet">
        <p class="booklet-label">酒水第 ${padPageNumber(pageNumber)} 页 / Drinks Page ${padPageNumber(pageNumber)}</p>
        <div>
          <h4>${renderBilingualText("内页结束", "End of Booklet")}</h4>
          <img class="booklet-brand-logo" src="assets/images/big-logo-dark-premium.png" width="1672" height="941" alt="白兔町 BACKTO INN logo">
          <button class="flipbook-closing-button" type="button" data-flip-action="contents" aria-label="返回目录 / Back to Contents">
            返回目录 / Back to Contents
          </button>
        </div>
      </section>
    `;
  }

  getPageIndicator() {
    if (this.currentPage < 0) {
      return `封面 / Cover · ${this.catalog}`;
    }

    if (this.currentPage === 0) {
      return `目录 / Table of Contents · ${padPageNumber(this.paddedItemPages)} 曲 / Tracks`;
    }

    if (this.isMobileView()) {
      return `第 ${padPageNumber(this.currentPage)} 页 / Page ${padPageNumber(this.currentPage)} of ${padPageNumber(this.paddedItemPages)}`;
    }

    const spreadStart = this.getSpreadStart();
    const spreadEnd = Math.min(spreadStart + 1, this.paddedItemPages);

    return `第 ${padPageNumber(spreadStart)}-${padPageNumber(spreadEnd)} 页 / Pages ${padPageNumber(spreadStart)}-${padPageNumber(spreadEnd)} of ${padPageNumber(this.paddedItemPages)}`;
  }

  hasNextPage() {
    if (this.currentPage < 0) {
      return true;
    }

    if (this.isMobileView()) {
      return this.currentPage < this.paddedItemPages;
    }

    if (this.currentPage === 0) {
      return this.paddedItemPages > 0;
    }

    return this.getSpreadStart() + 2 <= this.paddedItemPages;
  }
}

function DrinksFlipBook(root, menuData) {
  return new FlipBookMenu(root, {
    type: "drinks",
    zhTitle: "酒单",
    enTitle: "Drinking Menu",
    subtitleZh: "微光、唱片与第二杯的内页酒单。",
    subtitleEn: "A liner-note pour list for low lights, warm records, and a second round.",
    kicker: "酒单 / Drinking Menu",
    catalog: "BTI-D-01",
    coverImage: "assets/images/cocktail-cover.png",
    coverAlt: "酒单 Drinking Menu cover",
    items: menuData,
  });
}

function CoffeeFlipBook(root, menuData) {
  return new FlipBookMenu(root, {
    type: "coffee",
    zhTitle: "咖啡单",
    enTitle: "Coffee Menu",
    subtitleZh: "浓缩、牛奶与慢下午的咖啡内页。",
    subtitleEn: "Espresso, milk, and slow afternoon notes pressed into a small paper booklet.",
    kicker: "咖啡单 / Coffee Menu",
    catalog: "BTI-C-01",
    coverImage: "assets/images/coffee-cover.png",
    coverAlt: "咖啡单 Coffee Menu cover",
    items: menuData,
  });
}

const drinksFlipBookRoot = document.querySelector("[data-flipbook='drinks']");
const coffeeFlipBookRoot = document.querySelector("[data-flipbook='coffee']");

if (drinksFlipBookRoot) {
  DrinksFlipBook(drinksFlipBookRoot, drinksMenuData);
}

if (coffeeFlipBookRoot) {
  CoffeeFlipBook(coffeeFlipBookRoot, coffeeMenuData);
}
