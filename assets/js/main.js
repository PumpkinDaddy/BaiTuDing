const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a[href^='#']");
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".menu-panel");
const trackRows = document.querySelectorAll(".playlist-track");
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

if (heroImage) {
  const lastBackground = localStorage.getItem("backtoInnHeroBackground");
  const availableImages = backgroundImages.filter((image) => image !== lastBackground);
  const imagePool = availableImages.length ? availableImages : backgroundImages;
  const nextBackground = imagePool[Math.floor(Math.random() * imagePool.length)];

  heroImage.src = nextBackground;
  heroImage.alt = "白兔町空间氛围背景 / BACKTO INN lounge background";
  localStorage.setItem("backtoInnHeroBackground", nextBackground);
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "打开导航 Open navigation");
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
    link.addEventListener("click", () => setActiveLink(link));
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

const playTrack = (track) => {
  const panel = track.closest(".menu-panel");
  const player = panel?.querySelector("[data-menu-player]");

  if (!panel || !player) {
    return;
  }

  panel.querySelectorAll(".playlist-track").forEach((row) => {
    const active = row === track;

    row.classList.toggle("is-playing", active);
    row.classList.toggle("active", active);
  });

  const photo = player.querySelector("[data-player-photo]");
  const name = player.querySelector("[data-player-name]");
  const ingredients = player.querySelector("[data-player-ingredients]");
  const price = player.querySelector("[data-player-price]");

  if (photo && track.dataset.image) {
    photo.src = track.dataset.image;
    photo.alt = `${track.dataset.name} 照片 / Featured menu photo`;
  }

  if (name && track.dataset.name) {
    name.textContent = track.dataset.name;
  }

  if (ingredients && track.dataset.ingredients) {
    ingredients.textContent = track.dataset.ingredients;
  }

  if (price && track.dataset.price) {
    price.textContent = track.dataset.price;
  }

  player.classList.remove("is-switching");
  void player.offsetWidth;
  player.classList.add("is-switching");

  window.setTimeout(() => {
    player.classList.remove("is-switching");
  }, 460);
};

trackRows.forEach((track) => {
  track.addEventListener("click", () => playTrack(track));
  track.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      playTrack(track);
    }
  });
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.menu;

    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });

    panels.forEach((panel) => {
      const active = panel.dataset.panel === target;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;

      if (active) {
        const activeTrack = panel.querySelector(".playlist-track.is-playing") || panel.querySelector(".playlist-track");

        if (activeTrack) {
          playTrack(activeTrack);
        }
      }
    });
  });
});
