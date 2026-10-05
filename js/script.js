document.addEventListener("DOMContentLoaded", function () {
  /* =========================================================
                    MOBILE NAVIGATION MENU
  ========================================================= */
  const menuButton = document.querySelector(".menu-button");
  const navigation = document.querySelector(".main-nav");
  if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
      const isOpen = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
    const navigationLinks = navigation.querySelectorAll("a");
    navigationLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }
  /* =========================================================
                    AUTOMATIC COPYRIGHT YEAR
  ========================================================= */
  const yearItems = document.querySelectorAll("[data-year]");
  const currentYear = new Date().getFullYear();
  yearItems.forEach(function (item) {
    item.textContent = currentYear;
  });
  /* =========================================================
                    SCROLL REVEAL ANIMATION
  ========================================================= */
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      },
    );
    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("visible");
    });
  }
  /* =========================================================
                    GALLERY FILTER BUTTONS
  ========================================================= */
  const filterButtons = document.querySelectorAll(".filter");
  const galleryItems = document.querySelectorAll(
    ".gallery-item[data-category]",
  );
  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedCategory = button.dataset.filter;
      filterButtons.forEach(function (item) {
        item.classList.remove("active");
      });
      button.classList.add("active");
      galleryItems.forEach(function (item) {
        const itemCategory = item.dataset.category;
        if (selectedCategory === "all" || itemCategory === selectedCategory) {
          item.hidden = false;
        } else {
          item.hidden = true;
        }
      });
    });
  });
  /* =========================================================
                    PRODUCT SEARCH AND FILTERS
  ========================================================= */
  const productSearch = document.querySelector("#product-search");
  const sectionFilter = document.querySelector("#section-filter");
  const priceFilter = document.querySelector("#price-filter");
  const productCards = document.querySelectorAll(
    ".product-card[data-category][data-price]",
  );
  const productSections = document.querySelectorAll(".product-section");
  const noProductsMessage = document.querySelector("#no-products-message");
  /* =========================================================
                    PRODUCT PRICE FILTER
  ========================================================= */
  function matchesPrice(price, selectedPrice) {
    if (selectedPrice === "under-10") {
      return price < 10;
    }
    if (selectedPrice === "10-20") {
      return price >= 10 && price < 20;
    }
    if (selectedPrice === "20-30") {
      return price >= 20 && price < 30;
    }
    if (selectedPrice === "30-plus") {
      return price >= 30;
    }
    return true;
  }
  /* =========================================================
                    FILTER PRODUCTS
  ========================================================= */
  function filterProducts() {
    const searchTerm = productSearch
      ? productSearch.value.trim().toLowerCase()
      : "";
    const selectedSection = sectionFilter ? sectionFilter.value : "all";
    const selectedPrice = priceFilter ? priceFilter.value : "all";
    let visibleProductCount = 0;
    /* =========================================================
                    CHECK EACH PRODUCT CARD
    ========================================================= */
    productCards.forEach(function (card) {
      const productCategory = card.dataset.category || "";
      const productPrice = parseFloat(card.dataset.price || "0");
      const searchableText = (
        (card.dataset.name || "") +
        " " +
        productCategory +
        " " +
        card.textContent
      ).toLowerCase();
      const matchesSearch = searchableText.includes(searchTerm);
      const matchesSection =
        selectedSection === "all" || productCategory === selectedSection;
      const matchesSelectedPrice = matchesPrice(
        productPrice,
        selectedPrice,
      );
      const shouldShow =
        matchesSearch && matchesSection && matchesSelectedPrice;
      card.hidden = !shouldShow;
      if (shouldShow) {
        visibleProductCount++;
      }
    });
    /* =========================================================
                    HIDE EMPTY PRODUCT SECTIONS
    ========================================================= */
    productSections.forEach(function (section) {
      const sectionCards = section.querySelectorAll(
        ".product-card[data-category][data-price]",
      );
      let visibleCardsInSection = 0;
      sectionCards.forEach(function (card) {
        if (!card.hidden) {
          visibleCardsInSection++;
        }
      });
      section.hidden = visibleCardsInSection === 0;
    });
    /* =========================================================
                    NO PRODUCTS FOUND MESSAGE
    ========================================================= */
    if (noProductsMessage) {
      noProductsMessage.hidden = visibleProductCount !== 0;
    }
  }
  /* =========================================================
                    PRODUCT SEARCH BOX
  ========================================================= */
  if (productSearch) {
    productSearch.addEventListener("input", filterProducts);
  }
  /* =========================================================
                    PRODUCT SECTION FILTER
  ========================================================= */
  if (sectionFilter) {
    sectionFilter.addEventListener("change", filterProducts);
  }
  /* =========================================================
                    PRODUCT PRICE FILTER
  ========================================================= */
  if (priceFilter) {
    priceFilter.addEventListener("change", filterProducts);
  }
  /* =========================================================
                    LOAD PRODUCT FILTERS
  ========================================================= */
  if (productSearch || sectionFilter || priceFilter) {
    filterProducts();
  }
  /* =========================================================
                    PRODUCT IMAGE GALLERIES
  ========================================================= */
  const productGalleries = document.querySelectorAll(".product-gallery");
  productGalleries.forEach(function (gallery) {
    const mainImage = gallery.querySelector(".main-product-image");
    const thumbnails = gallery.querySelectorAll(".product-thumbnail");
    /* =========================================================
                    PRODUCT THUMBNAIL IMAGES
    ========================================================= */
    thumbnails.forEach(function (thumbnail) {
      thumbnail.addEventListener("click", function () {
        const newImage = thumbnail.dataset.image;
        if (mainImage && newImage) {
          mainImage.src = newImage;
        }
        thumbnails.forEach(function (item) {
          item.classList.remove("active");
        });
        thumbnail.classList.add("active");
      });
    });
  });
  /* =========================================================
                    COMMISSION REQUEST FORM
  ========================================================= */
  const commissionForm = document.querySelector("#commission-form");
  if (commissionForm) {
    commissionForm.addEventListener("submit", function (event) {
      event.preventDefault();
      /* =========================================================
                    GET FORM INFORMATION
      ========================================================= */
      const formData = new FormData(commissionForm);
      const customerName = formData.get("name");
      const contactInformation = formData.get("contact");
      const requestType = formData.get("requestType");
      const desiredDate = formData.get("date");
      const rateRange = formData.get("rate");
      const projectDescription = formData.get("description");
      /* =========================================================
                    CREATE EMAIL MESSAGE
      ======================================================== */
      const emailSubject = "Commission request from " + customerName;
      const emailBody = [
        "Name: " + customerName,
        "Contact information: " + contactInformation,
        "Request type: " + requestType,
        "Date desired: " + (desiredDate || "Flexible"),
        "Budget / rate range: " + (rateRange || "Not specified"),
        "",
        "Project description:",
        projectDescription,
      ].join("\n");
      /* =========================================================
                    OPEN CUSTOMER EMAIL APP
      ========================================================= */
      const emailAddress = "contactmiha@proton.me";
      const emailLink =
        "mailto:" +
        emailAddress +
        "?subject=" +
        encodeURIComponent(emailSubject) +
        "&body=" +
        encodeURIComponent(emailBody);
      window.location.href = emailLink;
      /* =========================================================
                    FORM CONFIRMATION MESSAGE
      ========================================================= */
      const formMessage = document.querySelector(".form-message");
      if (formMessage) {
        formMessage.textContent =
          "Your email app should open with your request. " +
          "Please review the message and press Send.";
      }
    });
  }
});
