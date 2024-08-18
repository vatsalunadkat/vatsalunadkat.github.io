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
    "houses-7477950.jpg",
    "flowers-5209386.jpg",
  ];

  const randomIndex = Math.floor(Math.random() * backgrounds.length);
  const selectedBackground = backgrounds[randomIndex];
  const baseImageURL =
    "https://raw.githubusercontent.com/vatsalunadkat/vatsalunadkat.github.io/960b41465e86bcf116332fce9e14cc5dfc517517/";
  document.body.style.backgroundImage = `url('${baseImageURL}images/backgrounds/${selectedBackground}')`;
});
