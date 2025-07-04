// GameplayManager.js with card detail loading from JSON

let cardData = [];

fetch('cards.json')
  .then(response => response.json())
  .then(data => {
    cardData = data;
    console.log('Card data loaded:', cardData);
  })
  .catch(err => console.error('Failed to load card data:', err));

let player = {
  dek: [],
  tangan: [],
  kalah: [],
  menang: [],
  aktif: null,
  aktifHp: 0,
  aktifAtk: 0
};

let opponent = {
  dek: [],
  tangan: [],
  kalah: [],
  menang: [],
  aktif: null,
  aktifHp: 0,
  aktifAtk: 0
};

let gamePhase = "waiting";

function startGame() {
  showReadyPopup();
}

function showReadyPopup() {
  alert("Waiting for opponent to connect and ready.");
}

function bothPlayersReady() {
  player.dek = shuffle(generateDeck());
  opponent.dek = shuffle(generateDeck());
  beginPhase();
}

function beginPhase() {
  announcePhase("Begin Phase");
  while (player.tangan.length < 3 && player.dek.length > 0) player.tangan.push(player.dek.pop());
  while (opponent.tangan.length < 3 && opponent.dek.length > 0) opponent.tangan.push(opponent.dek.pop());
  if (player.tangan.length === 3 && opponent.tangan.length === 3) mainPhase();
}

function mainPhase() {
  announcePhase("Main Phase");
  player.aktif = player.tangan.pop();
  opponent.aktif = opponent.tangan.pop();
  flipPhase();
}

function flipPhase() {
  announcePhase("Flip Phase");
  player.aktifHp = 100;
  player.aktifAtk = 20;
  opponent.aktifHp = 100;
  opponent.aktifAtk = 20;
  console.log("Player active card:", getCardDetail(player.aktif));
  console.log("Opponent active card:", getCardDetail(opponent.aktif));
  battlePhase();
}

function battlePhase() {
  announcePhase("Battle Phase");
  let playerChoice = prompt("Rock, Paper, or Scissors?").toLowerCase();
  let opponentChoice = ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)];
  alert(`Opponent chose ${opponentChoice}`);

  if (playerChoice === opponentChoice) {
    alert("Draw, repeat");
    battlePhase();
  } else if (
    (playerChoice === "rock" && opponentChoice === "scissors") ||
    (playerChoice === "paper" && opponentChoice === "rock") ||
    (playerChoice === "scissors" && opponentChoice === "paper")
  ) {
    opponent.aktifHp -= player.aktifAtk;
    alert("You win the round!");
  } else {
    player.aktifHp -= opponent.aktifAtk;
    alert("You lose the round!");
  }

  if (player.aktifHp <= 0) endPhase("opponent");
  else if (opponent.aktifHp <= 0) endPhase("player");
  else battlePhase();
}

function endPhase(winner) {
  announcePhase("End Phase");
  if (winner === "player") {
    player.menang.push(player.aktif);
    opponent.kalah.push(opponent.aktif);
    alert("You win the battle!");
  } else {
    opponent.menang.push(opponent.aktif);
    player.kalah.push(player.aktif);
    alert("You lose the battle!");
  }
  player.aktif = opponent.aktif = null;

  if (player.menang.length >= 5) alert("You win the game!");
  else if (opponent.menang.length >= 5) alert("You lose the game!");
  else beginPhase();
}

function announcePhase(phaseName) {
  console.log(phaseName);
}

function generateDeck() {
  return Array.from({ length: 20 }, (_, i) => i + 1);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getCardDetail(cardId) {
  return cardData.find(card => card.id === cardId) || { name: "Unknown Card", type: "Unknown" };
}
