/*
The Rooted Robin
Main JavaScript File

Controls:
1. Mobile navigation
2. Automatic copyright year
3. Scroll animations
4. Gallery filtering
5. Product search and filtering
6. Commission request form
*/

document.addEventListener("DOMContentLoaded", function () {
  /* =========================================
  MOBILE NAVIGATION
  ========================================= */

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

  /* =========================================
  AUTOMATIC COPYRIGHT YEAR
  ========================================= */

  const yearItems = document.querySelectorAll("[data-year]");

  const currentYear = new Date().getFullYear();

  yearItems.forEach(function (item) {
    item.textContent = currentYear;
  });

  /* =========================================
  SCROLL REVEAL ANIMATIONS
  ========================================= */

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

  /* =========================================
  GALLERY FILTERS

  Used on gallery.html.
  Filters gallery items by category.
  ========================================= */

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

  /* =========================================
  PRODUCT SEARCH AND FILTERS

  Used on products.html.

  Allows visitors to:
  1. Search products by name or description
  2. Filter products by section
  3. Filter products by price
  ========================================= */

  const productSearch = document.querySelector("#product-search");

  const sectionFilter = document.querySelector("#section-filter");

  const priceFilter = document.querySelector("#price-filter");

  const productCards = document.querySelectorAll(
    ".product-card[data-category][data-price]",
  );

  const productSections = document.querySelectorAll(".product-section");

  const noProductsMessage = document.querySelector("#no-products-message");

  /* =========================================
  PRODUCT PRICE FILTER FUNCTION

  Checks whether a product's price matches
  the price range selected by the visitor.
  ========================================= */

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

    /*
    If "All Prices" is selected,
    every price is accepted.
    */

    return true;
  }

  /* =========================================
  MAIN PRODUCT FILTER FUNCTION

  This function checks all three controls:
  search, section, and price.

  A product must match ALL selected filters
  to remain visible.
  ========================================= */

  function filterProducts() {
    /*
    Gets the text entered into the search box.

    trim() removes extra spaces.

    toLowerCase() makes the search
    case-insensitive.
    */

    const searchTerm = productSearch
      ? productSearch.value.trim().toLowerCase()
      : "";

    /*
  Gets the selected product section.

  If the filter does not exist on the page,
  "all" is used.
  */

    const selectedSection = sectionFilter ? sectionFilter.value : "all";

    /*
  Gets the selected price range.
  */

    const selectedPrice = priceFilter ? priceFilter.value : "all";

    /*
  Keeps track of how many products
  remain visible.
  */

    let visibleProductCount = 0;

    /* Check every product card */

    productCards.forEach(function (card) {
      /*
    Reads the data-category value
    from products.html.

    Example:
    data-category="face"
    */

      const productCategory = card.dataset.category || "";

      /*
    Reads the data-price value.

    Example:
    data-price="14"
    */

      const productPrice = parseFloat(card.dataset.price || "0");

      /*
    Creates searchable text from:
    - product name
    - category
    - description
    - other text inside the card
    */

      const searchableText = (
        (card.dataset.name || "") +
        " " +
        productCategory +
        " " +
        card.textContent
      ).toLowerCase();

      /* Does the product match the search? */

      const matchesSearch = searchableText.includes(searchTerm);

      /* Does it match the selected section? */

      const matchesSection =
        selectedSection === "all" || productCategory === selectedSection;

      /* Does it match the selected price? */

      const matchesSelectedPrice = matchesPrice(productPrice, selectedPrice);

      /*
    Product is shown only when it matches
    search + section + price.
    */

      const shouldShow =
        matchesSearch && matchesSection && matchesSelectedPrice;

      /*
    The hidden attribute works with this
    rule in style.css:

    [hidden] {
    display: none !important;
    }
    */

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleProductCount++;
      }
    });

    /* =========================================
  HIDE EMPTY PRODUCT SECTIONS

  Example:
  If the visitor chooses "Perfume",
  the Face, Bath & Body, Lipcare, and
  Apothecary sections disappear.
  ========================================= */

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

    /* =========================================
  NO PRODUCTS MESSAGE

  Displays a message if nothing matches
  the selected search and filters.
  ========================================= */

    if (noProductsMessage) {
      noProductsMessage.hidden = visibleProductCount !== 0;
    }
  }

  /* =========================================
  PRODUCT FILTER EVENT LISTENERS
  ========================================= */

  /*
  Search updates while the visitor types.
  */

  if (productSearch) {
    productSearch.addEventListener("input", filterProducts);
  }

  /*
  Section filter updates when
  a different section is selected.
  */

  if (sectionFilter) {
    sectionFilter.addEventListener("change", filterProducts);
  }

  /*
  Price filter updates when
  a different price range is selected.
  */

  if (priceFilter) {
    priceFilter.addEventListener("change", filterProducts);
  }

  /*
  Runs once when products.html loads.

  This makes sure the page starts
  in the correct filter state.
  */

  if (productSearch || sectionFilter || priceFilter) {
    filterProducts();
  }
  /* =========================================
  PRODUCT IMAGE GALLERIES

  Allows visitors to click a thumbnail
  to change the main product picture.
  ========================================= */

  const productGalleries = document.querySelectorAll(".product-gallery");

  productGalleries.forEach(function (gallery) {
    const mainImage = gallery.querySelector(".main-product-image");

    const thumbnails = gallery.querySelectorAll(".product-thumbnail");

    thumbnails.forEach(function (thumbnail) {
      thumbnail.addEventListener("click", function () {
        const newImage = thumbnail.dataset.image;

        /* Change the main product image */

        if (mainImage && newImage) {
          mainImage.src = newImage;
        }

        /* Remove active style from all thumbnails */

        thumbnails.forEach(function (item) {
          item.classList.remove("active");
        });

        /* Highlight the thumbnail that was clicked */

        thumbnail.classList.add("active");
      });
    });
  });

  /* =========================================
  COMMISSION REQUEST FORM

  Used on contact.html.
  Creates an email containing the
  information entered into the form.
  ========================================= */

  const commissionForm = document.querySelector("#commission-form");

  if (commissionForm) {
    commissionForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(commissionForm);

      const customerName = formData.get("name");

      const contactInformation = formData.get("contact");

      const requestType = formData.get("requestType");

      const desiredDate = formData.get("date");

      const rateRange = formData.get("rate");

      const projectDescription = formData.get("description");

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

      const emailAddress = "contactmiha@proton.me";

      const emailLink =
        "mailto:" +
        emailAddress +
        "?subject=" +
        encodeURIComponent(emailSubject) +
        "&body=" +
        encodeURIComponent(emailBody);

      window.location.href = emailLink;

      const formMessage = document.querySelector(".form-message");

      if (formMessage) {
        formMessage.textContent =
          "Your email app should open with your request. " +
          "Please review the message and press Send.";
      }
    });
  }
});
