
// GameplayManager.js - Button-based RPS and Phase Label

import { applyEffect } from './effect.js';

let cardData = [];
let playerDeck = [];
let aiDeck = [];

const cardFiles = [ 'cards/Adiwira.json' ];
cardFiles.forEach(file => { fetch(file).then(res => res.json()).then(data => { cardData = cardData.concat(data); console.log(`Loaded ${file}`, data); }).catch(err => console.error(`Failed to load ${file}`, err)); });
fetch('player_deck.json').then(res => res.json()).then(data => { playerDeck = data; console.log('Player deck loaded:', playerDeck); }).catch(err => console.error('Failed to load player deck:', err));
fetch('ai_deck.json').then(res => res.json()).then(data => { aiDeck = data; console.log('AI deck loaded:', aiDeck); }).catch(err => console.error('Failed to load ai deck:', err));

let player = { dek: [], tangan: [], kalah: [], menang: [], aktif: null, aktifHp: 0, aktifAtk: 0 };
let opponent = { dek: [], tangan: [], kalah: [], menang: [], aktif: null, aktifHp: 0, opponentAtk: 0 };
let gamePhase = "waiting";

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.createElement('button');
  startBtn.textContent = "Start Game vs AI";
  startBtn.style.position = "fixed";
  startBtn.style.top = "10px";
  startBtn.style.right = "10px";
  startBtn.onclick = () => startGame();
  document.body.appendChild(startBtn);
});

function startGame() { bothPlayersReady(); }

function bothPlayersReady() { player.dek = shuffle([...playerDeck]); opponent.dek = shuffle([...aiDeck]); beginPhase(); }
function beginPhase() { announcePhase("Begin Phase"); while (player.tangan.length < 3 && player.dek.length > 0) player.tangan.push(player.dek.pop()); while (opponent.tangan.length < 3 && opponent.dek.length > 0) opponent.tangan.push(opponent.dek.pop()); renderOverlayZones(); if (player.tangan.length === 3 && opponent.tangan.length === 3) mainPhase(); }
function mainPhase() { announcePhase("Main Phase"); player.aktif = player.tangan.pop(); opponent.aktif = opponent.tangan.pop(); renderOverlayZones(); flipPhase(); }

function flipPhase() {
  announcePhase("Flip Phase");
  const playerCard = getCardDetail(player.aktif);
  const opponentCard = getCardDetail(opponent.aktif);
  player.aktifHp = playerCard.hp;
  player.aktifAtk = playerCard.atk;
  opponent.aktifHp = opponentCard.hp;
  opponent.aktifAtk = opponentCard.atk;
  let context = { playerHp: player.aktifHp, playerAtk: player.aktifAtk, opponentHp: opponent.aktifHp, opponentAtk: opponent.aktifAtk, opponentType: opponentCard.type, opponentEffectId: opponentCard.effect_id, previousCardName: "Unknown", previousCardType: "Unknown", cardWins: player.menang.length, usedCards: [], effectLog: [] };
  applyEffect(playerCard, context);
  player.aktifHp = context.playerHp;
  player.aktifAtk = context.playerAtk;
  opponent.aktifHp = context.opponentHp;
  opponent.aktifAtk = context.opponentAtk;
  console.log("Player active card:", playerCard);
  console.log("Opponent active card:", opponentCard);
  console.log(context.effectLog);
  battlePhase();
}

function battlePhase() {
  announcePhase("Battle Phase");
  const overlay = document.getElementById('overlay-zones');
  const rpsDiv = document.createElement('div');
  rpsDiv.innerHTML = "<strong>Choose:</strong> ";
  ["rock", "paper", "scissors"].forEach(choice => {
    const btn = document.createElement('button');
    btn.textContent = choice.charAt(0).toUpperCase() + choice.slice(1);
    btn.onclick = () => handleBattleChoice(choice);
    rpsDiv.appendChild(btn);
  });
  overlay.appendChild(rpsDiv);
}

function handleBattleChoice(playerChoice) {
  const opponentChoice = ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)];
  alert(`Opponent chose ${opponentChoice}`);
  const overlay = document.getElementById('overlay-zones');
  overlay.innerHTML = ''; // Clear buttons

  if (playerChoice === opponentChoice) alert("Draw, repeat"), battlePhase();
  else if ((playerChoice === "rock" && opponentChoice === "scissors") || (playerChoice === "paper" && opponentChoice === "rock") || (playerChoice === "scissors" && opponentChoice === "paper")) opponent.aktifHp -= player.aktifAtk, alert("You win the round!");
  else player.aktifHp -= opponent.aktifAtk, alert("You lose the round!");

  if (player.aktifHp <= 0) endPhase("opponent");
  else if (opponent.aktifHp <= 0) endPhase("player");
  else battlePhase();
}

function endPhase(winner) { announcePhase("End Phase"); if (winner === "player") player.menang.push(player.aktif), opponent.kalah.push(opponent.aktif), alert("You win the battle!"); else opponent.menang.push(opponent.aktif), player.kalah.push(player.aktif), alert("You lose the battle!"); player.aktif = opponent.aktif = null; renderOverlayZones(); if (player.menang.length >= 5) alert("You win the game!"); else if (opponent.menang.length >= 5) alert("You lose the game!"); else beginPhase(); }

function announcePhase(phaseName) {
  const overlay = document.getElementById('overlay-zones');
  overlay.innerHTML = `<h3>${phaseName}</h3>`;
  console.log(phaseName);
}

function shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
function getCardDetail(cardId) { return cardData.find(card => card.id === cardId) || { name: "Unknown Card", type: "Unknown", hp: 100, atk: 20, image: "cards/card_back.jpg" }; }

function renderOverlayZones() {
  const overlay = document.getElementById('overlay-zones');
  overlay.innerHTML = `<h3>${gamePhase} Phase</h3>`;
  const zones = [ { title: 'Player Deck', cards: player.dek }, { title: 'Player Hand', cards: player.tangan }, { title: 'Player Active', cards: player.aktif ? [player.aktif] : [] }, { title: 'Player Win', cards: player.menang }, { title: 'Player Lose', cards: player.kalah }, { title: 'Opponent Deck', cards: opponent.dek }, { title: 'Opponent Hand', cards: opponent.tangan }, { title: 'Opponent Active', cards: opponent.aktif ? [opponent.aktif] : [] }, { title: 'Opponent Win', cards: opponent.menang }, { title: 'Opponent Lose', cards: opponent.kalah } ];
  zones.forEach(zone => {
    const zoneDiv = document.createElement('div');
    zoneDiv.innerHTML = `<strong>${zone.title}</strong><br>`;
    zone.cards.forEach(cardId => {
      const card = getCardDetail(cardId);
      const img = document.createElement('img');
      img.src = card.image || 'cards/card_back.jpg';
      img.width = 50;
      img.height = 65;
      img.style.margin = '2px';
      zoneDiv.appendChild(img);
    });
    zoneDiv.style.marginBottom = '10px';
    overlay.appendChild(zoneDiv);
  });
}
