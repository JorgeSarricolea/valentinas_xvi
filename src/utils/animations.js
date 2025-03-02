/**
 * Splits text into words with animation spans
 * @param {string} text - The text to split
 * @param {number} baseDelay - The base delay before animation starts
 * @returns {string} HTML string with animated spans
 */
export function animateWords(text, baseDelay = 0) {
  return text
    .split(" ")
    .map(
      (word, index) =>
        `<span class="word-animate" style="transition-delay: ${
          baseDelay + index * 0.08
        }s;">${word}</span>`
    )
    .join(" ");
}

/**
 * Splits text into letters with animation spans
 * @param {string} text - The text to split
 * @param {number} baseDelay - The base delay before animation starts
 * @returns {string} HTML string with animated spans
 */
export function animateLetters(text, baseDelay = 0) {
  return text
    .split("")
    .map(
      (letter, index) =>
        `<span class="letter-animate" style="transition-delay: ${
          baseDelay + index * 0.03
        }s;">${letter}</span>`
    )
    .join("");
}

/**
 * Initialize scroll animations with reset functionality
 * This should be called once the DOM is loaded
 */
export function initScrollAnimations() {
  // Track scroll position to determine direction
  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let scrollDirection = "down"; // Default direction
  let ticking = false;

  // Get all elements with animation classes
  const animatedElements = document.querySelectorAll(
    ".scroll-animate, .letter-container, .word-container, .section-content"
  );

  // Immediately trigger hero animations without waiting for scroll
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    setTimeout(() => {
      heroContent.classList.add("scrolled");
      heroContent.classList.add("scroll-down");

      // Animate all letter and word elements within hero
      const heroLetters = heroContent.querySelectorAll(".letter-animate");
      const heroWords = heroContent.querySelectorAll(".word-animate");

      heroLetters.forEach((letter, index) => {
        setTimeout(() => {
          letter.classList.add("scroll-down");
          letter.classList.add("scrolled");
          letter.classList.add("fade-in");
        }, index * 60);
      });

      heroWords.forEach((word, index) => {
        setTimeout(() => {
          word.classList.add("scroll-down");
          word.classList.add("scrolled");
          word.classList.add("fade-in");
        }, 500 + index * 100);
      });
    }, 300);
  }

  // Add subtle parallax effect on scroll
  const parallaxElements = document.querySelectorAll(".parallax");

  // Listen for scroll events to determine direction with improved performance
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;

        // Determine scroll direction
        if (scrollTop > lastScrollTop) {
          if (scrollDirection !== "down") {
            scrollDirection = "down";
            document.body.classList.remove("scroll-up");
            document.body.classList.add("scroll-down");
          }
        } else if (scrollTop < lastScrollTop) {
          if (scrollDirection !== "up") {
            scrollDirection = "up";
            document.body.classList.remove("scroll-down");
            document.body.classList.add("scroll-up");
          }
        }

        // Apply subtle parallax effect
        parallaxElements.forEach((element) => {
          const speed = element.dataset.speed || 0.2;
          const yPos = -(scrollTop * speed);
          element.style.transform = `translateY(${yPos}px)`;
        });

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
      });

      ticking = true;
    }
  });

  // Set up enhanced scroll observer for elements that resets animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Get all animatable elements within this container
        const letters = entry.target.querySelectorAll(".letter-animate");
        const words = entry.target.querySelectorAll(".word-animate");

        if (entry.isIntersecting) {
          // Element is entering the viewport

          // First reset any existing animations
          entry.target.classList.remove("scrolled");
          entry.target.classList.remove("scroll-up", "scroll-down");

          letters.forEach((letter) => {
            letter.classList.remove("scrolled", "fade-in", "fade-out");
            letter.classList.remove("scroll-up", "scroll-down");
          });

          words.forEach((word) => {
            word.classList.remove("scrolled", "fade-in", "fade-out");
            word.classList.remove("scroll-up", "scroll-down");
          });

          // Then apply new animations with a small delay
          setTimeout(() => {
            // Add direction class based on current scroll direction
            entry.target.classList.add(`scroll-${scrollDirection}`);
            entry.target.classList.add("scrolled");

            // Animate letters with staggered timing
            letters.forEach((letter, index) => {
              setTimeout(() => {
                letter.classList.add(`scroll-${scrollDirection}`);
                letter.classList.add("scrolled");
                letter.classList.add("fade-in");
                letter.classList.remove("fade-out");
              }, index * 30);
            });

            // Animate words with staggered timing
            words.forEach((word, index) => {
              setTimeout(() => {
                word.classList.add(`scroll-${scrollDirection}`);
                word.classList.add("scrolled");
                word.classList.add("fade-in");
                word.classList.remove("fade-out");
              }, index * 60);
            });
          }, 50);
        } else {
          // Element is leaving the viewport - reset animations
          entry.target.classList.remove("scrolled");

          // Apply fade-out effect to elements leaving viewport
          letters.forEach((letter, index) => {
            setTimeout(() => {
              letter.classList.add("fade-out");
              letter.classList.remove("fade-in");

              // Remove scrolled class after animation completes
              setTimeout(() => {
                letter.classList.remove("scrolled");
              }, 300);
            }, index * 20);
          });

          words.forEach((word, index) => {
            setTimeout(() => {
              word.classList.add("fade-out");
              word.classList.remove("fade-in");

              // Remove scrolled class after animation completes
              setTimeout(() => {
                word.classList.remove("scrolled");
              }, 300);
            }, index * 40);
          });
        }
      });
    },
    {
      threshold: 0.15, // Trigger when at least 15% of the element is visible
      rootMargin: "0px 0px -10% 0px", // Slightly before the element comes into view
    }
  );

  // Observe all animated elements
  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  // Handle scroll indicator with smooth fade
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (scrollIndicator) {
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const opacity = 1 - scrollY / 150;

          if (scrollY > 100) {
            scrollIndicator.classList.add("hidden");
          } else {
            scrollIndicator.classList.remove("hidden");
            scrollIndicator.style.opacity = opacity > 0 ? opacity : 0;
          }

          ticking = false;
        });

        ticking = true;
      }
    });
  }

  // Add scroll direction to initial elements
  document
    .querySelectorAll(".letter-animate, .word-animate")
    .forEach((element) => {
      element.classList.add("scroll-down"); // Default direction for initial load
    });
}
