window.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".menu"),
    menuItem = document.querySelectorAll(".menu__item"),
    hamburger = document.querySelector(".hamburger");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("hamburger-active");
    menu.classList.toggle("menu-active");
  });

  menuItem.forEach((item) => {
    item.addEventListener("click", () => {
      hamburger.classList.toggle("hamburger-active");
      menu.classList.toggle("menu-active");
    });
  });
});
const nextButton = document.getElementById("nextButton");
const answers = document.querySelectorAll('.answers-box input[type="radio"]');
const answerWrappers = document.querySelectorAll('.answers-box');

answers.forEach((answer, index) => {
  answer.addEventListener('change', (event) => {
    if (event.target.checked) {
      answerWrappers.forEach((wrapper, i) => {
        if (index === i) {
          wrapper.style.backgroundColor = '#FFC700';
        } else {
          wrapper.style.backgroundColor = '';
        }
      });
    }
    checkAnswers();
  });
});

function checkAnswers() {
  if (document.querySelector('.answers-box input[type="radio"]:checked')) {
    nextButton.disabled = false;
  } else {
    nextButton.disabled = true;
  }
}
const minutesLabel = document.getElementById("minutes");
const secondsLabel = document.getElementById("seconds");
let totalSeconds = 600;

setInterval(setTime, 1000);

function setTime() {
  --totalSeconds;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  minutesLabel.innerHTML = pad(minutes);
  secondsLabel.innerHTML = pad(seconds);

  if (totalSeconds <= 0) {
    clearInterval(intervalId);
    alert("Время вышло!");
  }
}

function pad(val) {
  const valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}
