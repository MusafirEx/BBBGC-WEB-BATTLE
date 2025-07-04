// effect.js

/**
 * Apply effect based on effect_id.
 * @param {Object} card - The card object with effect fields.
 * @param {Object} context - Game context (player, opponent, etc.)
 */
function applyEffect(card, context) {
  switch (card.effect_id) {
    case 0:
      // No effect
      break;

    case 1:
      // Enemy attack ineffective after 2 wins
      if (context.cardWins >= 2) {
        context.opponentAtk = 0;
        context.effectLog?.push("Opponent's attack blocked due to 2 wins.");
      }
      break;

    case 2:
      // HP & ATK +100 if opponent's ATK > 100
      if (context.opponentAtk > 100) {
        context.playerHp += 100;
        context.playerAtk += 100;
        context.effectLog?.push("Player's HP & ATK +100 (opponent's ATK > 100).");
      }
      break;

    case 3:
      // Opponent ATK -50
      context.opponentAtk -= 50;
      context.effectLog?.push("Opponent's ATK -50.");
      break;

    case 4:
      // HP & ATK +100 if previous card was Bellbot
      if (context.previousCardName === "Bellbot") {
        context.playerHp += 100;
        context.playerAtk += 100;
        context.effectLog?.push("Player's HP & ATK +100 (previous was Bellbot).");
      }
      break;

    case 5:
      // HP x2 if previous card is Papazola type
      if (context.previousCardType === "Papazola") {
        context.playerHp *= 2;
        context.effectLog?.push("Player's HP x2 (previous was Papazola).");
      }
      break;

    case 6:
      // Move 1 card from opponent's win pile to their lose pile
      if (context.moveCardBetweenPiles) {
        context.moveCardBetweenPiles(context.opponent, "win", "lose", 1);
        context.effectLog?.push("Moved 1 card from opponent's win to lose pile.");
      }
      break;

    case 7:
      // ATK & HP +50 if you've used [character] (from effect_condition)
      let usedChar = card.effect_condition.replace("Pernah guna kad ", "").replace(/\./g, "");
      if (context.usedCards?.includes(usedChar)) {
        context.playerHp += 50;
        context.playerAtk += 50;
        context.effectLog?.push(`Player's HP & ATK +50 (used card: ${usedChar}).`);
      }
      break;

    case 8:
      // Auto-win if opponent is BoBoiBoy type
      if (context.opponentType === "BoBoiBoy") {
        context.playerWins = true;
        context.effectLog?.push("Player wins automatically (opponent is BoBoiBoy).");
      }
      break;

    case 9:
      // Set opponent's ATK & HP to 50
      context.opponentAtk = 50;
      context.opponentHp = 50;
      context.effectLog?.push("Set opponent's ATK & HP to 50.");
      break;

    case 10:
      // Opponent's first attack ineffective
      context.blockNextOpponentAttack = true;
      context.effectLog?.push("Blocked opponent's first attack.");
      break;

    case 11:
      // ATK +50 if opponent is BoBoiBot (or Air, etc. depending on effect_condition)
      let typeTarget = card.effect_condition.split("adalah kad jenis ")[1]?.replace(/\./g, "");
      if (context.opponentType === typeTarget) {
        context.playerAtk += 50;
        context.effectLog?.push(`Player's ATK +50 (opponent type: ${typeTarget}).`);
      }
      break;

    case 12:
      // HP +50 if opponent's ATK > 100
      if (context.opponentAtk > 100) {
        context.playerHp += 50;
        context.effectLog?.push("Player's HP +50 (opponent's ATK > 100).");
      }
      break;

    case 13:
      // Swap opponent's ATK and HP
      [context.opponentAtk, context.opponentHp] = [context.opponentHp, context.opponentAtk];
      context.effectLog?.push("Opponent's ATK and HP swapped.");
      break;

    case 14:
      // HP +50 if previous card was Bagogo
      if (context.previousCardName === "Bagogo") {
        context.playerHp += 50;
        context.effectLog?.push("Player's HP +50 (previous was Bagogo).");
      }
      break;

    case 15:
      // ATK +50 if previous card is BoBoiBoy Tanah or Gempa
      if (["BoBoiBoy Tanah", "BoBoiBoy Gempa"].includes(context.previousCardName)) {
        context.playerAtk += 50;
        context.effectLog?.push("Player's ATK +50 (previous was BoBoiBoy Tanah or Gempa).");
      }
      break;

    case 16:
      // Opponent's ATK & HP -50
      context.opponentAtk -= 50;
      context.opponentHp -= 50;
      context.effectLog?.push("Opponent's ATK & HP -50.");
      break;

    case 17:
      // ATK +100 if previous card is BoBoiBoy Petir or Angin
      if (["BoBoiBoy Petir", "BoBoiBoy Angin"].includes(context.previousCardName)) {
        context.playerAtk += 100;
        context.effectLog?.push("Player's ATK +100 (previous was BoBoiBoy Petir or Angin).");
      }
      break;

    case 18:
      // ATK +100 if opponent is Yaya
      if (context.opponentType === "Yaya") {
        context.playerAtk += 100;
        context.effectLog?.push("Player's ATK +100 (opponent is Yaya).");
      }
      break;

    case 19:
      // All opponent effects are nullified (for the current round/turn)
      context.nullifyOpponentEffects = true;
      context.effectLog?.push("Opponent's card effects nullified.");
      break;

    case 20:
      // ATK +50 if opponent's card has an effect (effect_id !== 0)
      if (context.opponentEffectId && context.opponentEffectId !== 0) {
        context.playerAtk += 50;
        context.effectLog?.push("Player's ATK +50 (opponent's card has effect).");
      }
      break;

    case 21:
      // HP +50 if previous card is BoBoiBoy Petir
      if (context.previousCardName === "BoBoiBoy Petir") {
        context.playerHp += 50;
        context.effectLog?.push("Player's HP +50 (previous was BoBoiBoy Petir).");
      }
      break;

    case 22:
      // ATK & HP +50 if previous card is Kapten Separo
      if (context.previousCardName === "Kapten Separo") {
        context.playerHp += 50;
        context.playerAtk += 50;
        context.effectLog?.push("Player's HP & ATK +50 (previous was Kapten Separo).");
      }
      break;

    case 23:
      // See opponent's hand
      if (context.showOpponentHand) {
        context.showOpponentHand();
        context.effectLog?.push("Player sees opponent's hand.");
      }
      break;

    case 24:
      // ATK +100 if previous card is Adu Du
      if (context.previousCardName === "Adu Du") {
        context.playerAtk += 100;
        context.effectLog?.push("Player's ATK +100 (previous was Adu Du).");
      }
      break;

    case 25:
      // Swap this card with any in lose pile
      if (context.swapCardWithLosePile) {
        context.swapCardWithLosePile(card);
        context.effectLog?.push("Swapped this card with a card in lose pile.");
      }
      break;

    default:
      context.effectLog?.push("Unknown effect_id: " + card.effect_id);
      break;
  }
}

export { applyEffect };
