// ══════════════════════════════════════════════════════
//  LANDING.JS — Scroll & Load Animations for the Kanban Landing Page
//  Uses Anime.js v3.2.2 (loaded via CDN in index.html).
//  In v3, anime({...}) creates a single animation,
//  anime.timeline({...}) creates a sequenced timeline,
//  and anime.stagger(value) creates staggered delays.
// ══════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════
//  HELPER: hideEl(selector)
//  Sets opacity to 0 on all elements matching the selector.
//  This is called BEFORE animating so elements are invisible
//  by the time JS runs, then JS fades them in smoothly.
//  Content starts visible in CSS (so it's accessible without JS),
//  and JS adds opacity:0 inline only when it's about to animate.
// ══════════════════════════════════════════════════════

function hideEl(selector) {
  // querySelectorAll returns all DOM elements matching the CSS selector
  document.querySelectorAll(selector).forEach((el) => {
    // Set inline style opacity to "0" — hides the element visually
    // but keeps it in the document flow (unlike display: none)
    el.style.opacity = "0";
  });
}

// ══════════════════════════════════════════════════════
//  1. BACKGROUND GRAPHICS — Fade in on load, move on scroll
//     The decorative shapes (circles, lines, dots) behind
//     the content fade in when the page loads, then slowly
//     drift as the user scrolls (parallax effect).
// ══════════════════════════════════════════════════════

// Grab all elements with class "bg-shape" (8 decorative shapes total)
const bgShapes = document.querySelectorAll(".bg-shape");

// Staggered entrance animation for all background shapes
// In v3: anime({ targets: ..., ...properties }) creates a single animation
anime({
  targets: bgShapes, // All 8 background shapes
  opacity: [0, 0.5], // Fade from 0 (invisible) to 0.5 (semi-transparent)
  duration: 2000, // Takes 2 seconds to complete
  delay: anime.stagger(200, { start: 300 }),
  // anime.stagger(200) means each shape starts 200ms after the previous one
  // { start: 300 } adds an initial 300ms delay before the first shape begins
  // So: shape 1 at 300ms, shape 2 at 500ms, shape 3 at 700ms, etc.
  easing: "easeOutQuad", // Deceleration curve — starts fast, ends slow
});

// Parallax scroll configuration: each shape moves at a different speed
// Positive speed = moves DOWN as user scrolls DOWN (appears to lag behind)
// Negative speed = moves UP as user scrolls DOWN (appears to drift away)
const shapeConfigs = [
  { selector: ".bg-circle-1", speed: 0.03 }, // Moves down slowly
  { selector: ".bg-circle-2", speed: -0.02 }, // Moves up very slowly
  { selector: ".bg-circle-3", speed: 0.015 }, // Moves down very slowly
  { selector: ".bg-line-1", speed: -0.04 }, // Moves up slightly faster
  { selector: ".bg-line-2", speed: 0.025 }, // Moves down
  { selector: ".bg-dot-grid", speed: -0.035 }, // Moves up
  { selector: ".bg-ring-1", speed: 0.02 }, // Moves down
  { selector: ".bg-cross-1", speed: -0.03 }, // Moves up
];
// Each speed is multiplied by scrollY (pixels scrolled).
// E.g., at 1000px scrolled, circle-1 moves 30px (1000 × 0.03)

// `ticking` is a flag to throttle scroll events using requestAnimationFrame.
// Without throttling, the scroll handler would fire dozens of times per frame,
// causing jank. With this pattern, we only run the transform logic once per frame.
let ticking = false;

// Listen for the "scroll" event on the window
window.addEventListener("scroll", () => {
  // Only proceed if we're not already waiting for an animation frame
  if (!ticking) {
    // requestAnimationFrame waits until the browser is ready to paint the next frame
    requestAnimationFrame(() => {
      // window.scrollY = how many pixels the user has scrolled from the top
      const scrollY = window.scrollY;

      // Loop through each shape configuration
      shapeConfigs.forEach(({ selector, speed }) => {
        // Find the DOM element for this shape
        const el = document.querySelector(selector);
        if (el) {
          // Apply a vertical translation based on scroll position × speed factor
          // This creates the parallax effect: shapes move at different rates
          el.style.transform = `translateY(${scrollY * speed}px)`;
        }
      });

      // Reset the flag so the next scroll event can trigger a new frame
      ticking = false;
    });

    // Set the flag to true to prevent multiple rAF calls in one frame
    ticking = true;
  }
});

// ══════════════════════════════════════════════════════
//  2. HERO — Staggered entrance on page load
//     The hero section's label, title, subtitle, and button
//     fade in one after another with a sliding motion.
// ══════════════════════════════════════════════════════

// Hide all hero elements before animating them in
hideEl(".hero-label"); // The "Task Management, Refined" kicker
hideEl(".hero-title"); // The "Versatile workflow..." heading
hideEl(".hero-sub"); // The descriptive paragraph
hideEl(".hero .btn-primary"); // The "Launch Board" button

// Create a timeline: a sequence of animations that play one after another
// (with overlaps controlled by offsets)
const heroTimeline = anime.timeline({
  easing: "easeOutCubic", // Smooth deceleration for all animations in this timeline
});

// Animation 1: The label fades in and slides up 20px
heroTimeline
  .add({
    targets: ".hero-label", // Targets the label element
    opacity: [0, 1], // Fades from invisible to visible
    translateY: [20, 0], // Slides up from 20px below its final position
    duration: 800, // 0.8 seconds
  })

  // Animation 2: The title fades in and slides up 60px
  .add(
    {
      targets: ".hero-title",
      opacity: [0, 1],
      translateY: [60, 0], // Starts 60px lower (bigger entrance for the headline)
      duration: 1000, // 1 second (longer since it's the main headline)
    },
    "-=500",
    // "-=500" is a relative offset: start this animation 500ms BEFORE the previous one ends.
    // This creates an overlapping, staggered effect rather than fully sequential.
  )

  // Animation 3: The subtitle fades in and slides up 30px
  .add(
    {
      targets: ".hero-sub",
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
    },
    "-=600", // Overlaps with the previous animation by 600ms
  )

  // Animation 4: The button fades in and slides up 20px
  .add(
    {
      targets: ".hero .btn-primary",
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
    },
    "-=500", // Overlaps with the previous animation by 500ms
  );

// ══════════════════════════════════════════════════════
//  3. NAV — Subtle entrance
//     The navigation bar slides down from above and fades in.
// ══════════════════════════════════════════════════════

// Hide the nav before animating
hideEl(".nav");

// Animate the nav: fade in + slide down from -20px (above the viewport)
// In v3: anime({ targets: ..., ...properties })
anime({
  targets: ".nav",
  opacity: [0, 1], // Fade from invisible to visible
  translateY: [-20, 0], // Slides down from 20px above its final position
  duration: 800, // 0.8 seconds
  delay: 200, // Wait 0.2 seconds before starting
  easing: "easeOutCubic",
});

// ══════════════════════════════════════════════════════
//  4. SECTION DIVIDERS — Animate on scroll
//     The horizontal divider lines fade in when they
//     scroll into view, using IntersectionObserver.
// ══════════════════════════════════════════════════════

// Hide both section dividers
hideEl(".section-divider");

// Reusable function to observe elements and animate them when visible
function observeElements(selector, animProps) {
  // IntersectionObserver watches elements and fires a callback
  // when they enter or leave the viewport
  const observer = new IntersectionObserver(
    (entries) => {
      // entries = array of observed elements that changed visibility
      entries.forEach((entry) => {
        // entry.isIntersecting is true when the element is in the viewport
        if (entry.isIntersecting) {
          // Animate the element using anime() with targets set to entry.target
          // In v3: anime({ targets: element, ...properties })
          anime({
            targets: entry.target,
            ...animProps, // Spread the passed-in animation properties
            complete: () => observer.unobserve(entry.target),
            // After animation completes, stop observing this element
            // (prevents re-triggering if the user scrolls back up)
          });
        }
      });
    },
    { threshold: 0.2 },
    // threshold: 0.2 means the callback fires when 20% of the element is visible
  );

  // Find all matching elements and start observing each one
  document.querySelectorAll(selector).forEach((el) => observer.observe(el));
}

// Observe section dividers: fade in over 0.8 seconds when 20% visible
observeElements(".section-divider", {
  opacity: [0, 1],
  duration: 800,
  easing: "easeOutCubic",
});

// ══════════════════════════════════════════════════════
//  5. FEATURE CARDS — Staggered scroll entrance + hover lift
//     The four feature cards fade in and slide up when the
//     features section scrolls into view. Each card also
//     lifts up slightly on mouse hover.
// ══════════════════════════════════════════════════════

// Hide all feature cards before the scroll animation
hideEl(".feature-card");

// Create an observer specifically for the features section
const featuresObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // When the features section enters the viewport...
        const cards = entry.target.querySelectorAll(".feature-card");
        // Find all feature cards within the section

        // In v3: anime({ targets: elements, ...properties })
        anime({
          targets: cards,
          opacity: [0, 1], // Fade in from invisible
          translateY: [50, 0], // Slide up from 50px below
          duration: 900, // 0.9 seconds per card
          delay: anime.stagger(150), // Each card starts 150ms after the previous
          easing: "easeOutCubic",
        });

        // Stop observing so the animation doesn't re-trigger
        featuresObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }, // Trigger when 10% of the section is visible
);

// Find the features section and start observing it
const featuresSection = document.querySelector(".features");
if (featuresSection) featuresObserver.observe(featuresSection);
// The if-check prevents errors if the element doesn't exist

// Add hover animations to each feature card
document.querySelectorAll(".feature-card").forEach((card) => {
  // When the mouse enters the card area, lift it up 6px
  card.addEventListener("mouseenter", () => {
    anime({
      targets: card,
      translateY: -6, // Move 6px upward
      duration: 400, // Quick 0.4s animation
      easing: "easeOutQuad",
    });
  });

  // When the mouse leaves, return the card to its original position
  card.addEventListener("mouseleave", () => {
    anime({
      targets: card,
      translateY: 0, // Return to original Y position
      duration: 400,
      easing: "easeOutQuad",
    });
  });
});

// ══════════════════════════════════════════════════════
//  6. STEPS — Staggered scroll entrance
//     The four "How It Works" steps fade in and slide up
//     when their section scrolls into view.
// ══════════════════════════════════════════════════════

// Hide all steps before the scroll animation
hideEl(".step");

// Create an observer for the steps section
const stepsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // When the steps section enters the viewport...
        const steps = entry.target.querySelectorAll(".step");

        anime({
          targets: steps,
          opacity: [0, 1], // Fade in
          translateY: [40, 0], // Slide up from 40px below
          duration: 2000, // 0.8 seconds per step
          delay: anime.stagger(180), // Each step starts 180ms after the previous
          easing: "easeOutCubic",
        });

        // Stop observing after the animation triggers
        stepsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);

// Find the steps section and start observing it
const stepsSection = document.querySelector(".steps");
if (stepsSection) stepsObserver.observe(stepsSection);

// ══════════════════════════════════════════════════════
//  7. QUOTE — Fade in with lines
//     The quote's decorative lines scale in horizontally
//     while the quote text fades in and slides up.
//     Uses a timeline with autoplay: false so it only
//     plays when triggered by the IntersectionObserver.
// ══════════════════════════════════════════════════════

// Hide the quote lines and quote text
hideEl(".quote-line");
hideEl(".quote");

// Create a timeline for the quote animation
const quoteTimeline = anime.timeline({
  easing: "easeOutCubic",
  autoplay: false, // Don't play automatically — wait for the observer to trigger it
});

// Build the timeline:
quoteTimeline
  // Step 1: Both quote lines fade in and scale horizontally from 0 to 1
  .add({
    targets: ".quote-line", // Both .quote-line elements
    opacity: [0, 1],
    scaleX: [0, 1], // Grows from 0 width to full width (centered by CSS transform-origin)
    duration: 600, // 0.6 seconds
    delay: anime.stagger(400), // Second line starts 400ms after the first
  })
  // Step 2: The quote text fades in and slides up, overlapping with the lines
  .add(
    {
      targets: ".quote",
      opacity: [0, 1],
      translateY: [25, 0], // Slides up 25px
      duration: 1000,
    },
    "-=800", // Starts 800ms before the previous animation ends
  );

// Observe the quote section and play the timeline when visible
const quoteObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Play the pre-built timeline animation
        quoteTimeline.play();
        // Stop observing after triggering
        quoteObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }, // Trigger when 30% of the section is visible
);

const quoteSection = document.querySelector(".quote-section");
if (quoteSection) quoteObserver.observe(quoteSection);

// ══════════════════════════════════════════════════════
//  8. CTA — Animate heading + button
//     The CTA heading and button fade in with a timeline
//     when the section scrolls into view.
// ══════════════════════════════════════════════════════

// Hide the CTA heading and button
hideEl(".cta h2");
hideEl(".cta .btn-primary");

// Observe the CTA section
const ctaObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // When visible, create and play a timeline inline
        const ctaTimeline = anime.timeline({
          easing: "easeOutCubic",
        });

        ctaTimeline
          // Step 1: Heading fades in and slides up 40px
          .add({
            targets: ".cta h2",
            opacity: [0, 1],
            translateY: [40, 0],
            duration: 900,
          })
          // Step 2: Button fades in and slides up, overlapping by 500ms
          .add(
            {
              targets: ".cta .btn-primary",
              opacity: [0, 1],
              translateY: [20, 0],
              duration: 800,
            },
            "-=500",
          );

        // Stop observing after triggering
        ctaObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 },
);

const ctaSection = document.querySelector(".cta");
if (ctaSection) ctaObserver.observe(ctaSection);

// ══════════════════════════════════════════════════════
//  9. FOOTER — Fade in on scroll
//     The footer simply fades in when it enters the
//     viewport, using the reusable observeElements helper.
// ══════════════════════════════════════════════════════

// Hide the footer before animating
hideEl(".footer");

// Use the reusable observer: fade in over 0.8 seconds when visible
observeElements(".footer", {
  opacity: [0, 1],
  duration: 800,
  easing: "easeOutCubic",
});
