document.addEventListener("DOMContentLoaded", function () {
  const roleElement = document.querySelector(".role");
  const text = roleElement.textContent.trim();
  const chars = text.split("");
  const wrappedChars = chars.map((char) => `<span>${char}</span>`).join("");
  roleElement.innerHTML = wrappedChars;
  roleElement.classList.add("anim-text-flow");

  // Dynamic background
  const backgrounds = [
    "hatching-7098132_1920.png",
    "flowers-5209386.jpg",
    "classroom-8953770_1920.jpg"
  ];

  const randomIndex = Math.floor(Math.random() * backgrounds.length);
  const selectedBackground = backgrounds[randomIndex];
  const baseImageURL =
    "https://raw.githubusercontent.com/vatsalunadkat/vatsalunadkat.github.io/master/";
  document.body.style.backgroundImage = `url('${baseImageURL}images/backgrounds/${selectedBackground}')`;

  const bubblesContainer = document.querySelector(".footer .bubbles");
  const numberOfBubbles = 100;

  for (let i = 0; i < numberOfBubbles; i++) {
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");

    // Randomly generate values for size, distance, position, time, and delay
    const size = (Math.random() * 2.5 + 1) + 'rem';
    const distance = (Math.random() * 6 + 4) + 'rem';

    // Position with consideration for bubble size to prevent leaks
    const position = (Math.random() * (100 - (parseFloat(size) * 3))) + (parseFloat(size) * 1.5) + '%';

    const time = (Math.random() * 8 + 4) + 's';
    const delay = -(Math.random() * 5) + 's';

    // Set the custom properties
    bubble.style.setProperty('--size', size);
    bubble.style.setProperty('--distance', distance);
    bubble.style.setProperty('--position', position);
    bubble.style.setProperty('--time', time);
    bubble.style.setProperty('--delay', delay);

    // Append the bubble to the container
    bubblesContainer.appendChild(bubble);
  }
});
