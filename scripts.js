document.addEventListener("DOMContentLoaded", function() {
    const roleElement = document.querySelector('.role');
    const text = roleElement.textContent.trim();
    const chars = text.split('');
    const wrappedChars = chars.map(char => `<span>${char}</span>`).join('');
    roleElement.innerHTML = wrappedChars;
    roleElement.classList.add('anim-text-flow');
});