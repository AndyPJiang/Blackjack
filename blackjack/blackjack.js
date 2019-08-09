let total = 1000;
let dealer_score = 0
let player_score = 0
let player_hand = [];
let dealer_hand = [];
const start = document.getElementsByClassName('bet');
const hit_card = document.getElementById('h');
const stand_card = document.getElementById('s');
const double_card = document.getElementById('d');

deck = create_deck();

hit_card.addEventListener("click",function(){
  hit();
});

stand_card.addEventListener("click",function(){
  stand();
});
double_card.addEventListener("click",function(){
  double();
});


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
  await sleep(1000);
  show("playerhand");
  await sleep(1000);
  show("dealerhand");
  await sleep(1000);
  show("playerhand");
  await sleep(1000);
  if (check_bj(player_hand)){
    end_game("blackjack");
    document.getElementById('choices').style.display = "none";
  }

  // Sleep in loop
  for (let i = 0; i < 5; i++) {
    if (i === 3)
      await sleep(1000);
  }
}


function create_deck(){
  class Deck {
    constructor() {
      this.deck = [];

      const suits = ['hearts', 'spades', 'clubs', 'diamonds'];
      const values = ['ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king'];

      for (let suit in suits) {
        for (let value in values) {
          this.deck.push(`${values[value]}_of_${suits[suit]}`);
        }
      }
    }
  }
  const deck1 = new Deck();
  return deck1.deck;

}

function check_bj(hand){
  if (hand.includes('a') && hand.includes('1')){
    return true;
  }
  else if (hand.includes('a') && hand.includes('j')){
    return true;
  }
  else if (hand.includes('a') && hand.includes('q')){
    return true;
  }
  else if (hand.includes('a') && hand.includes('k')){
    return true;
  }
  return false;

}

function deal(deck){
  var len = deck.length;
  const rand = Math.floor(Math.random()*len);
  var card1 = deck[rand]
  deck.splice(rand, 1);
  return card1;
}


function check_card(id, card){
  if (card[0] === "j" || card[0] === "q" || card[0] === "k" || card[0]==="1"){
    return 10;
  }
  else if (card[0] === "a"){
    return 1;
  }
  else {
    return parseInt(card[0]);
  }

}

function update_score2(id, hand){
  var score = 0;
  var ace = false;
  var score2 = 22;

  for (let i=0; i<hand.length; i++){
    var card_val = check_card(id, hand[i]);
    score += card_val;
    if (card_val === 1 ){
      ace = true;
    }
  }

  if (ace === true){
    score2 = parseInt(score+10)
  }
  if (score2 > 21 && id==="dealerhand"){
    document.getElementById("dealer").innerHTML = "Dealer's hand: " + score;
    dealer_score = score;
  }
  else if (score2 > 21 && id==="playerhand"){
    document.getElementById("player").innerHTML = "Your hand: " + score;
    player_score = score;
  }
  else if (score2 <= 21 && id==="dealerhand"){
    document.getElementById("dealer").innerHTML = "Dealer's hand: " + score2;
    dealer_score = score2;
  }
  else{
    document.getElementById("player").innerHTML = "Your hand: " + score2;
    player_score = score2;

  }

}

function end_game(result){
  if (result === "blackjack"){
    document.getElementById('result').innerHTML = "Blackjack, Player wins!"
    total += bet*2.5;
    document.getElementById('credit').innerHTML = "Total: $" + total;
  }
  else if (result === "draw"){
    document.getElementById('result').innerHTML = "Stand Off!"
    total += bet;
    document.getElementById('credit').innerHTML = "Total: $" + total;
  }
  else if (result === "player_win"){
    document.getElementById('result').innerHTML = "Player wins!"
    total += bet*2;
    document.getElementById('credit').innerHTML = "Total: $" + total;
  }
  else if (result === "dealer_win"){
    document.getElementById('result').innerHTML = "Dealer wins!"
  }
  dealer_score -= dealer_score;
  player_score -= player_score;
  player_hand.length = 0;
  dealer_hand.length = 0;

  document.getElementById('makenone').style.display = "inline-block"

}


function check_result(){
  if (dealer_score > 21 || dealer_score < player_score){
    end_game("player_win");
  }
  else if (dealer_score > player_score){
    end_game("dealer_win");
  }
  else{
    end_game("draw");
  }
}


function update_hand(id, card){
  if (id==="playerhand"){
    player_hand.push(card[0]);
  }
  else{
    dealer_hand.push(card[0]);
  }
}


function show(id){
  card = deal(deck);
  let new_card = '<img src="png/'+card+'.png">'
  document.getElementById(id).innerHTML += new_card;
  update_hand(id, card);

  if (id === "playerhand"){
    update_score2(id, player_hand);
  }
  else{
    update_score2(id, dealer_hand);
  }

}


function hit(){
  myvar2 = setTimeout(function(){
    show("playerhand");
    if (player_score > 21){
      clearTimeout(myvar2);
      document.getElementById("choices").style.display = "none";
      end_game("dealer_win")
    }
  }, 1000);
}


function my_function(){
  if (dealer_score < 17){
    show("dealerhand");
    }
  else if (dealer_score === 17 && dealer_hand.includes('a')){
    show("dealerhand");
  }
  else{
    check_result();
    clearInterval(myvar);
  }


}

function stand(){
  document.getElementById("choices").style.display = "none";
  myvar = setInterval(my_function, 1000);

}

function double(){
  if (total-bet < 0){
    alert("Not Enough Credit");
    return false;
  }
  total -= bet;
  bet *= 2 ;
  document.getElementById('credit').innerHTML = "Total: $" + total;
  myvar3 = setTimeout(function(){
    show("playerhand");
    if (player_score > 21){
      clearTimeout(myvar3);
      end_game("dealer_win");
    }
    else{
      clearTimeout(myvar3);
      stand();
    }

}, 1000)


}

function game(){
  bet = parseInt(document.getElementById("betamount").value);

  if (isNaN(bet) || bet === 0){
    alert("Please Place Valid Bet");
    return false;
  }
  else if(total-bet <0){
    alert("Not Enough Credit");
    return false;
  }
  if (deck.length === 0){
    alert("Deck has run out, please refresh!");
    return false;
  }

  document.getElementById('playerhand').innerHTML = "";
  document.getElementById('dealerhand').innerHTML = "";
  document.getElementById('dealer').innerHTML = "Dealer's Hand: ";
  document.getElementById('player').innerHTML = "Your Hand: ";

  document.getElementById('result').innerHTML = "";

  total -= bet ;
  document.getElementById('credit').innerHTML = "Total: $" + total;
  document.getElementById('makenone').style.display = 'none';

  demo();

  document.getElementById("choices").style.display = "block";


}
