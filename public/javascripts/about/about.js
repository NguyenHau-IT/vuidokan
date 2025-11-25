document.addEventListener("DOMContentLoaded", function () {
  const yearItems = document.querySelectorAll(".year-item");
  const yearContents = document.querySelectorAll(".year-content");

  yearItems.forEach((item) => {
    item.addEventListener("click", function () {
      const targetYear = this.getAttribute("data-year");

      // Remove active class from all items
      yearItems.forEach((yearItem) => {
        yearItem.classList.remove("active");
      });
      yearContents.forEach((content) => {
        content.classList.remove("active");
      });

      // Add active class to clicked item and corresponding content
      this.classList.add("active");
      const targetContent = document.getElementById("content-" + targetYear);
      if (targetContent) {
        setTimeout(() => {
          targetContent.classList.add("active");
        }, 100);
      }
    });

    // Add hover effects
    item.addEventListener("mouseenter", function () {
      if (!this.classList.contains("active")) {
        this.querySelector(".year-circle").style.transform = "scale(1.05)";
        this.querySelector(".year-circle").style.borderColor =
          "var(--bs-primary)";
      }
    });

    item.addEventListener("mouseleave", function () {
      if (!this.classList.contains("active")) {
        this.querySelector(".year-circle").style.transform = "scale(1)";
        this.querySelector(".year-circle").style.borderColor = "#e9ecef";
      }
    });
  });
});
