const player = { dek: [], tangan: [], kalah: [], menang: [], aktif: null, aktifHp: 0, aktifAtk: 0 };
const opponent = { dek: [], tangan: [], kalah: [], menang: [], aktif: null, aktifHp: 0, aktifAtk: 0 };
let gamePhase = "waiting";
let myPeer = null;
let conn = null;

function log(msg) {
  const logDiv = document.getElementById('game-log');
  if (logDiv) logDiv.textContent += msg + "\n";
}

function startGame() {
  log("Waiting for opponent to connect and ready.");
}

function bothPlayersReady() {
  player.dek = shuffle(generateDeck());
  opponent.dek = shuffle(generateDeck());
  beginPhase();
}

function beginPhase() {
  gamePhase = "begin";
  while (player.tangan.length < 3 && player.dek.length > 0) player.tangan.push(player.dek.pop());
  while (opponent.tangan.length < 3 && opponent.dek.length > 0) opponent.tangan.push(opponent.dek.pop());
  if (player.tangan.length === 3 && opponent.tangan.length === 3) mainPhase();
}

function mainPhase() {
  gamePhase = "main";
  player.aktif = player.tangan.pop();
  opponent.aktif = opponent.tangan.pop();
  flipPhase();
}

function flipPhase() {
  gamePhase = "flip";
  player.aktifHp = 100;
  player.aktifAtk = 20;
  opponent.aktifHp = 100;
  opponent.aktifAtk = 20;
  battlePhase();
}

function battlePhase() {
  gamePhase = "battle";
  let playerChoice = null;
  conn.on('data', data => {
    if (data.type === "rps-choice") resolveBattle(playerChoice, data.choice);
  });
  playerChoice = prompt("Rock, Paper, or Scissors?").toLowerCase();
  if (!["rock", "paper", "scissors"].includes(playerChoice)) return battlePhase();
  conn.send({ type: "rps-choice", choice: playerChoice });
}

function resolveBattle(playerChoice, opponentChoice) {
  log(`Opponent chose ${opponentChoice}`);
  if (playerChoice === opponentChoice) {
    log("It's a draw!");
    battlePhase();
  } else if (
    (playerChoice === "rock" && opponentChoice === "scissors") ||
    (playerChoice === "paper" && opponentChoice === "rock") ||
    (playerChoice === "scissors" && opponentChoice === "paper")
  ) {
    opponent.aktifHp -= player.aktifAtk;
    log("You win this round!");
  } else {
    player.aktifHp -= opponent.aktifAtk;
    log("You lose this round!");
  }
  if (player.aktifHp <= 0) endPhase("opponent");
  else if (opponent.aktifHp <= 0) endPhase("player");
  else battlePhase();
}

function endPhase(winner) {
  gamePhase = "end";
  if (winner === "player") {
    player.menang.push(player.aktif);
    opponent.kalah.push(opponent.aktif);
    log("You win the battle!");
  } else {
    opponent.menang.push(opponent.aktif);
    player.kalah.push(player.aktif);
    log("You lose the battle!");
  }
  player.aktif = opponent.aktif = null;
  if (player.menang.length >= 5) log("You win the game!");
  else if (opponent.menang.length >= 5) log("You lose the game!");
  else beginPhase();
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
