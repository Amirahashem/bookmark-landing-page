document.addEventListener("DOMContentLoaded", () => {
  initMobileNavigation();
  initHeaderScrollEffect();
  initNewsletterValidation();
  initInteractiveModals();
  initExtensionInstallToasts();
});

function initMobileNavigation() {
  const navbarCollapse = document.getElementById("navbarNav");
  const menuIcon = document.getElementById("menuIcon");
  const closeIcon = document.getElementById("closeIcon");
  const siteHeader = document.querySelector(".site-header");
  const navItems = document.querySelectorAll("#navbarNav .nav-link, #navbarNav .login-btn");

  if (!navbarCollapse || !menuIcon || !closeIcon || !siteHeader) return;

  const setMenuState = (isOpen) => {
    menuIcon.classList.toggle("d-none", isOpen);
    closeIcon.classList.toggle("d-none", !isOpen);
    siteHeader.classList.toggle("menu-open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  navbarCollapse.addEventListener("show.bs.collapse", () => setMenuState(true));
  navbarCollapse.addEventListener("hide.bs.collapse", () => setMenuState(false));


  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth < 992 && navbarCollapse.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
      }
    });
  });


  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navbarCollapse.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
    }
  });


  window.addEventListener("resize", () => {
    if (window.innerWidth >= 992 && siteHeader.classList.contains("menu-open")) {
      bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
      setMenuState(false);
    }
  });
}

function initHeaderScrollEffect() {
  const siteHeader = document.querySelector(".site-header");
  if (!siteHeader) return;

  const toggleShadow = () => {
    if (window.scrollY > 20 && !siteHeader.classList.contains("menu-open")) {
      siteHeader.classList.add("shadow-sm");
    } else {
      siteHeader.classList.remove("shadow-sm");
    }
  };

  window.addEventListener("scroll", toggleShadow, { passive: true });
  toggleShadow();
}


function initNewsletterValidation() {
  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("newsletterEmail");
  const errorIcon = document.getElementById("emailErrorIcon");
  const errorText = document.getElementById("emailErrorText");
  const successText = document.getElementById("emailSuccessText");

  if (!form || !emailInput) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const showError = (message) => {
    emailInput.classList.add("is-invalid-custom");
    errorIcon?.classList.remove("d-none");
    if (errorText) {
      errorText.textContent = message;
      errorText.classList.remove("d-none");
    }
    successText?.classList.add("d-none");
  };

  const clearFeedback = () => {
    emailInput.classList.remove("is-invalid-custom");
    errorIcon?.classList.add("d-none");
    errorText?.classList.add("d-none");
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = emailInput.value.trim();

    if (!value) {
      showError("Please enter your email address");
      emailInput.focus();
      return;
    }

    if (!emailRegex.test(value)) {
      showError("Whoops, make sure it’s an email");
      emailInput.focus();
      return;
    }

    clearFeedback();
    successText?.classList.remove("d-none");
    form.reset();

    setTimeout(() => {
      successText?.classList.add("d-none");
    }, 4000);
  });

  emailInput.addEventListener("input", () => {
    clearFeedback();
    successText?.classList.add("d-none");
  });
}


function initInteractiveModals() {
  const modalEl = document.getElementById("actionModal");
  const modalTitle = document.getElementById("actionModalLabel");
  const modalBody = document.getElementById("actionModalBody");

  if (!modalEl || !modalTitle || !modalBody) return;

  const modalInstance = new bootstrap.Modal(modalEl);


  document.querySelectorAll(".login-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      modalTitle.textContent = "Welcome Back";
      modalBody.innerHTML = `
        <p class="text-muted small mb-3">Sign in to sync your bookmarks across all devices.</p>
        <form id="loginModalForm">
          <div class="mb-3">
            <label class="form-label small fw-medium">Email address</label>
            <input type="email" class="form-control" placeholder="name@example.com" required />
          </div>
          <div class="mb-3">
            <label class="form-label small fw-medium">Password</label>
            <input type="password" class="form-control" placeholder="••••••••" required />
          </div>
          <button type="submit" class="btn btn-chrome w-100 py-2 fw-medium">Login</button>
        </form>
      `;

      modalInstance.show();

      const loginForm = document.getElementById("loginModalForm");
      loginForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        modalInstance.hide();
        showToast("Signed in successfully!");
      });
    });
  });


  document.querySelectorAll(".btn-more-info").forEach((btn) => {
    btn.addEventListener("click", () => {
      const parentSection = btn.closest(".tab-pane, .faq");
      const heading = parentSection?.querySelector("h3, h2")?.textContent?.trim() || "Bookmark Details";

      modalTitle.textContent = heading;
      modalBody.innerHTML = `
        <p class="text-muted mb-3" style="line-height: 1.7;">
          Bookmark gives you instant cloud synchronization, smart tagging, and encrypted sharing links across Chrome, Firefox, and Opera with zero setup.
        </p>
        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-chrome px-4" data-bs-dismiss="modal">Got it</button>
        </div>
      `;

      modalInstance.show();
    });
  });
}


function initExtensionInstallToasts() {
  const installButtons = document.querySelectorAll(".btn-install, .btn-chrome, .btn-firefox");

  installButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cardTitle = btn.closest(".extension-card")?.querySelector("h3")?.textContent?.trim();
      const label = cardTitle || btn.textContent.trim();
      showToast(`Preparing download for: ${label}`);
    });
  });
}


function showToast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toastEl = document.createElement("div");
  toastEl.className = "toast align-items-center text-bg-dark border-0 shadow";
  toastEl.setAttribute("role", "status");
  toastEl.setAttribute("aria-live", "polite");
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  container.appendChild(toastEl);
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();

  toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}