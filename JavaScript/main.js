let overlay = document.querySelector(".overlay");
let duration = 1000;

const blocksContainer = document.querySelector(".game");
let countdownElement = document.querySelector(".time");
let blocks = Array.from(blocksContainer.children);

let orderRange = [...Array(blocks.length).keys()];
shuffle(orderRange);

// Flip 4 ranodm cards
function revealRandomCards() {
  let flippedIndexes = orderRange.slice(0, 4);
  flippedIndexes.forEach((i) => {
    let card = blocks[i];
    card.classList.add("flipped");
    setTimeout(() => {
      card.classList.remove("flipped");
    }, duration);
  });
}

function showOverlay(title, message) {
  let h2 = document.querySelector(".overlay h2");
  let p = document.querySelector(".overlay p");
  h2.textContent = title;
  p.textContent = message;
}

function allCheck() {
  if (blocks.every((block) => block.classList.contains("done"))) {
    document.querySelector(".win").play();
    overlay.style.display = "block";
    showOverlay(
      "🎉 Congratulations! You Win 🏆",
      "You completed the game successfully 👏"
    );
  }
}

blocks.forEach((block, index) => {
  block.style.order = orderRange[index];
  block.addEventListener("click", function () {
    flipblock(block);
    allCheck();
  });
});

// flip Block Function

function flipblock(selectCard) {
  selectCard.classList.add("flipped");
  let everyFlipped = blocks.filter((block) =>
    block.classList.contains("flipped")
  );
  if (everyFlipped.length === 2) {
    stopClicked();
    checkMatchedBlocks(everyFlipped[0], everyFlipped[1]);
  }
}
// Stop Clicked Fucntion
function stopClicked() {
  blocksContainer.classList.add("no-clicking");

  setTimeout(() => {
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}
// ===================

// Check Matched Block
let triesElement = document.querySelector(".tries span");
function checkMatchedBlocks(first, second) {
  if (first.dataset.image === second.dataset.image) {
    first.classList.remove("flipped");
    second.classList.remove("flipped");

    first.classList.add("done");
    second.classList.add("done");
    document.querySelector(".correct-audio").play();
  } else {
    triesElement.textContent = parseInt(triesElement.textContent) + 1;
    document.querySelector(".wrong-audio").play();
    setTimeout(() => {
      first.classList.remove("flipped");
      second.classList.remove("flipped");
    }, duration);
  }
}

// ===================

function shuffle(array) {
  let current = array.length,
    temp,
    random;

  while (current > 0) {
    random = Math.floor(Math.random() * current);
    current--;

    temp = array[current];
    array[current] = array[random];
    array[random] = temp;
  }
  return array;
}

let timer;
function countdown() {
  let minutes = 1;
  let seconds = 30;

  let timer = setInterval(() => {
    if (minutes === 0 && seconds === 0) {
      clearInterval(timer);
      countdownElement.textContent = "Time: 00:00";
      overlay.style.display = "block";
      showOverlay("😢 Game Over", "You failed the game.");
      document.querySelector(".fail").play();
      return;
    }

    if (seconds > 0) {
      seconds--;
    } else {
      minutes--;
      seconds = 59;
    }
    if (blocks.every((block) => block.classList.contains("done"))) {
      clearInterval(timer);
      return;
    }
    let formatted = `0${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    countdownElement.textContent = `Time: ${formatted}`;
  }, 1000);
}

document.querySelector(".control span").addEventListener("click", function () {
  let yourName = prompt("What Your Name ?");

  if (yourName === null || yourName === "") {
    document.querySelector(".name span").textContent = "Unknown";
  } else {
    document.querySelector(".name span").textContent = yourName;
  }
  revealRandomCards();

  countdown();

  document.querySelector(".control").remove();
});

// Restart Game

function resetBlocks() {
  blocks.forEach((block, index) => {
    block.style.order = orderRange[index];
    block.classList.remove("done", "flipped");
  });
}

function restartGame() {
  clearInterval(timer);
  countdownElement.textContent = "Time: 00:00";
  overlay.style.display = "none";
  triesElement.textContent = "0";
  countdown();
  resetBlocks();

  setTimeout(() => {
    shuffle(orderRange);
    resetBlocks();
  }, 300);

  setTimeout(() => {
    revealRandomCards();
  }, 600);
}
