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
    "ai-generated-8550365_1920.jpg",
    "ai-generated-8566567_1920.jpg",
    "ai-generated-8723703_1920.jpg",
    "ai-generated-8866025_1280.jpg",
    "ai-generated-8915485_1280.jpg",
    "compass-7592447_1920.jpg",
    "garage-8848215_1920.jpg",
    "sea-7364988_1920.jpg",
    "trees-4051288_1920.jpg",
    "classroom-8953770_1920.jpg"
  ];

  const randomIndex = Math.floor(Math.random() * backgrounds.length);
  const selectedBackground = backgrounds[randomIndex];
  const baseImageURL =
    "https://raw.githubusercontent.com/vatsalunadkat/vatsalunadkat.github.io/master/";
  document.body.style.backgroundImage = `url('${baseImageURL}images/backgrounds/${selectedBackground}')`;
});
