document.addEventListener("DOMContentLoaded", () => {
  setupMobileNavigation();
  setCurrentYear();
  setupRegistrationForm();
  preselectCourse();
  setupScrollReveal();
  setupPaymentPlaceholder();
});


/* ==========================================
   MOBILE NAVIGATION
========================================== */

function setupMobileNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );

    toggle.textContent = isOpen ? "×" : "☰";
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      toggle.textContent = "☰";
    });
  });

  document.addEventListener("click", (event) => {
    if (
      nav.classList.contains("open") &&
      !nav.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      toggle.textContent = "☰";
    }
  });
}


/* ==========================================
   CURRENT YEAR
========================================== */

function setCurrentYear() {
  const yearElements = document.querySelectorAll(".current-year");
  const year = new Date().getFullYear();

  yearElements.forEach((element) => {
    element.textContent = year;
  });
}


/* ==========================================
   IMAGE FALLBACK
========================================== */

function handleImageError(image) {
  const parent = image.parentElement;

  image.style.display = "none";

  if (parent) {
    parent.classList.add("image-missing");
  } else {
    image.classList.add("image-missing");
  }
}


/* ==========================================
   COURSE QUERY PARAMETER
========================================== */

function preselectCourse() {
  const courseSelect = document.getElementById("course");

  if (!courseSelect) return;

  const params = new URLSearchParams(window.location.search);
  const requestedCourse = params.get("course");

  if (!requestedCourse) return;

  const matchingOption = Array.from(courseSelect.options).find(
    (option) => option.value === requestedCourse
  );

  if (matchingOption) {
    courseSelect.value = requestedCourse;
  }
}


/* ==========================================
   REGISTRATION VALIDATION
========================================== */

function setupRegistrationForm() {
  const form = document.getElementById("registrationForm");

  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const courseSelect = document.getElementById("course");
  const scheduleSelect = document.getElementById("schedule");

  const fields = [
    nameInput,
    emailInput,
    phoneInput,
    courseSelect,
    scheduleSelect
  ];

  fields.forEach((field) => {
    if (!field) return;

    field.addEventListener("input", () => {
      validateField(field);
    });

    field.addEventListener("change", () => {
      validateField(field);
    });

    field.addEventListener("blur", () => {
      validateField(field);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let isValid = true;

    fields.forEach((field) => {
      if (field && !validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      const firstInvalid = form.querySelector(
        ".form-group.invalid input, .form-group.invalid select"
      );

      if (firstInvalid) {
        firstInvalid.focus();
      }

      return;
    }

    /*
      Front-end demonstration flow:
      once all required fields are valid,
      continue to the existing success page.
    */
    window.location.href = "success.html";
  });
}


function validateField(field) {
  if (!field) return true;

  const value = field.value.trim();

  if (field.id === "name") {
    if (!value) {
      showError(field, "Please enter your full name.");
      return false;
    }

    if (value.length < 2) {
      showError(field, "Please enter a valid name.");
      return false;
    }
  }


  if (field.id === "email") {
    if (!value) {
      showError(field, "Please enter your email address.");
      return false;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(value)) {
      showError(field, "Please enter a valid email address.");
      return false;
    }
  }


  if (field.id === "phone") {
    if (!value) {
      showError(field, "Please enter your phone number.");
      return false;
    }

    const digits = value.replace(/\D/g, "");

    if (digits.length < 7 || digits.length > 15) {
      showError(field, "Please enter a valid phone number.");
      return false;
    }
  }


  if (field.id === "course") {
    if (!value) {
      showError(field, "Please select a pastry course.");
      return false;
    }
  }


  if (field.id === "schedule") {
    if (!value) {
      showError(field, "Please select your preferred schedule.");
      return false;
    }
  }

  clearError(field);
  return true;
}


function showError(field, message) {
  const group = field.closest(".form-group");

  if (!group) return;

  group.classList.add("invalid");

  const error = group.querySelector(".error-message");

  if (error) {
    error.textContent = message;
  }

  field.setAttribute("aria-invalid", "true");
}


function clearError(field) {
  const group = field.closest(".form-group");

  if (!group) return;

  group.classList.remove("invalid");

  const error = group.querySelector(".error-message");

  if (error) {
    error.textContent = "";
  }

  field.removeAttribute("aria-invalid");
}


/* ==========================================
   PAYMENT PLACEHOLDER
========================================== */

function setupPaymentPlaceholder() {
  const paymentButton = document.getElementById("payTuitionButton");

  if (!paymentButton) return;

  paymentButton.addEventListener("click", (event) => {
    const href = paymentButton.getAttribute("href");

    if (!href || href === "#") {
      event.preventDefault();

      alert(
        "Online tuition payment is not connected yet. Please complete your registration first."
      );
    }
  });
}


/* ==========================================
   SCROLL REVEAL
========================================== */

function setupScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!revealElements.length) return;

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !("IntersectionObserver" in window)
  ) {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
}