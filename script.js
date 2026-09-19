/* =========================================
   MOBILE NAVIGATION
   ========================================= */

const menuToggle = document.getElementById("menuToggle");

const mobileMenu = document.getElementById("mobileMenu");

if (menuToggle && mobileMenu) {
  /*
   * Open / close hamburger menu
   */

  menuToggle.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");

    menuToggle.classList.toggle("active", open);

    menuToggle.setAttribute("aria-expanded", String(open));

    menuToggle.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu",
    );
  });

  /*
   * Close menu after clicking a link
   */

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");

      menuToggle.classList.remove("active");

      menuToggle.setAttribute("aria-expanded", "false");

      menuToggle.setAttribute("aria-label", "Open navigation menu");
    });
  });
}

/* =========================================
   SUPABASE
   ========================================= */

const supabaseClient = window.supabase.createClient(
  window.RAWWAYFITT_SUPABASE_URL,
  window.RAWWAYFITT_SUPABASE_PUBLISHABLE_KEY,
);

/* =========================================
   SECURITY / HTML ESCAPING
   ========================================= */

function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[c],
  );
}

/* =========================================
   STAR RATING
   ========================================= */

function stars(rating) {
  const n = Number(rating) || 0;

  return "★".repeat(n) + "☆".repeat(5 - n);
}

/* =========================================
   DISPLAY APPROVED FEEDBACK
   ========================================= */

async function renderPublishedFeedback() {
  const box = document.getElementById("publishedFeedback");

  if (!box) {
    return;
  }

  box.innerHTML =
    '<div class="empty-feedback">' + "Loading client feedback..." + "</div>";

  const { data, error } = await supabaseClient

    .from("feedback")

    .select("id,name,rating,feedback,created_at")

    .eq("status", "approved")

    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Could not load feedback:", error);

    box.innerHTML =
      '<div class="empty-feedback">' +
      "Client feedback is temporarily unavailable." +
      "</div>";

    return;
  }

  if (!data || !data.length) {
    box.innerHTML =
      '<div class="empty-feedback">' +
      "No client feedback has been published yet." +
      "</div>";

    return;
  }

  box.innerHTML = data
    .map(
      (item) => `

      <article class="testimonial">

        <div
          class="rating"
          aria-label="${escapeHTML(item.rating)} out of 5 stars"
        >
          ${stars(item.rating)}
        </div>

        <p>
          “${escapeHTML(item.feedback)}”
        </p>

        <strong>
          — ${escapeHTML(item.name)}
        </strong>

      </article>

    `,
    )
    .join("");
}

/* =========================================
   FEEDBACK FORM
   ========================================= */

const feedbackForm = document.getElementById("feedbackForm");

if (feedbackForm) {
  feedbackForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitButton = feedbackForm.querySelector('button[type="submit"]');

    const name = document.getElementById("clientName").value.trim();

    const rating = Number(document.getElementById("rating").value);

    const feedback = document.getElementById("feedbackText").value.trim();

    const permission = document.getElementById("permission").checked;

    const message = document.getElementById("formMessage");

    message.textContent = "";

    /*
     * Check fields
     */

    if (!name || !rating || !feedback) {
      message.textContent = "Please complete all fields.";

      return;
    }

    /*
     * Permission required
     */

    if (!permission) {
      message.textContent =
        "Please give permission before submitting feedback for publication.";

      return;
    }

    /*
     * Character limits
     */

    if (name.length > 100 || feedback.length > 2000) {
      message.textContent =
        "Please keep your name under 100 characters and feedback under 2000 characters.";

      return;
    }

    /*
     * Disable submit button
     */

    submitButton.disabled = true;

    submitButton.textContent = "SUBMITTING...";

    /*
     * Submit to Supabase
     */

    const { error } = await supabaseClient

      .from("feedback")

      .insert([
        {
          name: name,

          rating: rating,

          feedback: feedback,

          permission: true,

          status: "pending",
        },
      ]);

    /*
     * Re-enable button
     */

    submitButton.disabled = false;

    submitButton.textContent = "SUBMIT FEEDBACK";

    /*
     * Error
     */

    if (error) {
      console.error("Feedback submission failed:", error);

      message.textContent =
        "We could not submit your feedback right now. Please try again.";

      return;
    }

    /*
     * Success
     */

    feedbackForm.reset();

    message.textContent =
      "Thank you! Your feedback has been submitted and is awaiting review.";
  });
}

/* =========================================
   LOAD FEEDBACK
   ========================================= */

renderPublishedFeedback();
