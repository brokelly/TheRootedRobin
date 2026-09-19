/*
  The Rooted Robin
  Main JavaScript File

  Controls:
  1. Mobile navigation
  2. Automatic copyright year
  3. Scroll animations
  4. Gallery filtering
  5. Commission request form
*/

document.addEventListener("DOMContentLoaded", function () {

  /* =========================================
     MOBILE NAVIGATION
  ========================================= */

  const menuButton =
    document.querySelector(".menu-button");

  const navigation =
    document.querySelector(".main-nav");


  if (menuButton && navigation) {

    menuButton.addEventListener("click", function () {

      const isOpen =
        navigation.classList.toggle("open");

      menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

    });


    const navigationLinks =
      navigation.querySelectorAll("a");


    navigationLinks.forEach(function (link) {

      link.addEventListener("click", function () {

        navigation.classList.remove("open");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });

  }


  /* =========================================
     AUTOMATIC COPYRIGHT YEAR
  ========================================= */

  const yearItems =
    document.querySelectorAll("[data-year]");

  const currentYear =
    new Date().getFullYear();


  yearItems.forEach(function (item) {

    item.textContent = currentYear;

  });


  /* =========================================
     SCROLL REVEAL ANIMATIONS
  ========================================= */

  const revealItems =
    document.querySelectorAll(".reveal");


  if ("IntersectionObserver" in window) {

    const revealObserver =
      new IntersectionObserver(

        function (entries) {

          entries.forEach(function (entry) {

            if (entry.isIntersecting) {

              entry.target.classList.add("visible");

              revealObserver.unobserve(
                entry.target
              );

            }

          });

        },

        {
          threshold: 0.12
        }

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
  ========================================= */

  const filterButtons =
    document.querySelectorAll(".filter");


  const galleryItems =
    document.querySelectorAll(
      ".gallery-item[data-category]"
    );


  filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      const selectedCategory =
        button.dataset.filter;


      filterButtons.forEach(function (item) {

        item.classList.remove("active");

      });


      button.classList.add("active");


      galleryItems.forEach(function (item) {

        const itemCategory =
          item.dataset.category;


        if (
          selectedCategory === "all" ||
          itemCategory === selectedCategory
        ) {

          item.hidden = false;

        } else {

          item.hidden = true;

        }

      });

    });

  });


  /* =========================================
     COMMISSION REQUEST FORM
  ========================================= */

  const commissionForm =
    document.querySelector("#commission-form");


  if (commissionForm) {

    commissionForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();


        const formData =
          new FormData(commissionForm);


        const customerName =
          formData.get("name");

        const contactInformation =
          formData.get("contact");

        const requestType =
          formData.get("requestType");

        const desiredDate =
          formData.get("date");

        const rateRange =
          formData.get("rate");

        const projectDescription =
          formData.get("description");


        const emailSubject =
          "Commission request from " +
          customerName;


        const emailBody = [

          "Name: " + customerName,

          "Contact information: " +
            contactInformation,

          "Request type: " +
            requestType,

          "Date desired: " +
            (desiredDate || "Flexible"),

          "Budget / rate range: " +
            (rateRange || "Not specified"),

          "",

          "Project description:",

          projectDescription

        ].join("\n");


        const emailAddress =
          "contactmiha@proton.me";


        const emailLink =

          "mailto:" +
          emailAddress +

          "?subject=" +
          encodeURIComponent(emailSubject) +

          "&body=" +
          encodeURIComponent(emailBody);


        window.location.href = emailLink;


        const formMessage =
          document.querySelector(
            ".form-message"
          );


        if (formMessage) {

          formMessage.textContent =
            "Your email app should open with your request. " +
            "Please review the message and press Send.";

        }

      }
    );

  }

});
