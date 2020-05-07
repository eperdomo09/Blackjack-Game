
//card variables
let suits = ['Heart', 'Clubs', 'Diamonds', 'Spades'],
		numbers = [
			'Ace', 'King', 'Qeen', 'Jack',
			'Ten', 'Nine', 'Eight', 'Seven', 'Six',
			'Five', 'Four', 'Three', 'Two'
		];


//DOM variables
let textArea = document.getElementById('text-area'),
		newGameButton = document.getElementById('new-game-button'),
		hitButton = document.getElementById('hit-button'),
		stayButton = document.getElementById('stay-button');


//Game variables
let gameStarted = false,
		gameOver = false,
		playerWon = false,
		dealerCards = [],
		playerCards = [],
		dealerScore = 0,
		playerScore = 0,
		desck = [];

hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

//starting new game
newGameButton.addEventListener('click', () => {
	gameStarted = true,
	gameOver = false,
	playerWon = false,

	deck = createDeck();
	shuffleDeck(deck);
	dealerCards = [ getNextCard(), getNextCard() ];
	playerCards = [ getNextCard(), getNextCard() ];
	
	newGameButton.style.display = 'none';
	hitButton.style.display = 'inline';
	stayButton.style.display = 'inline';
	showStatus()
});

//taking cards
hitButton.addEventListener('click', () => {
	playerCards.push(getNextCard());
	checkForEndOfGame();
	showStatus();
});

//staying button
stayButton.addEventListener('click', () => {
	gameOver = true;
	checkForEndOfGame();
	showStatus();
});

//creating all the cards
function createDeck(){
	deck = [];
	for(let suit = 0; suit < suits.length; suit++){
		createCards(suits[suit],numbers);
	}
	return deck;
}

//creating card per suits
function createCards(theSuit, cardsNumbers){
	for(let i = 0; i < cardsNumbers.length; i++){
		let card = {
			suit: theSuit,
			value: cardsNumbers[i]
		};
		deck.push(card);
	}
}

function shuffleDeck(deck){
	for(let i = 0; i < deck.length; i++){
		let swapIdx = Math.floor(Math.random() * deck.length);
		let tmp = deck[swapIdx];
		deck[swapIdx] = deck[i];
		deck[i] = tmp;
	}
}

function getCardNumericValue(card){
	if(card.value === 'Ace') return 1;
	if(card.value === 'Two') return 2;
	if(card.value === 'Three') return 3;
	if(card.value === 'Four') return 4;
	if(card.value === 'Five') return 5;
	if(card.value === 'Six') return 6;
	if(card.value === 'Seven') return 7;
	if(card.value === 'Eight') return 8;
	if(card.value === 'Nine') return 9;
	return 10;
}

function getCardString(card){
	return `${card.value} of ${card.suit}`
}

function getNextCard(){
	return deck.shift();
}


function getScore(cardArray){
	let score = 0;
	let hasAce = false;
	for(let i = 0; i < cardArray.length; i++){
		let card = cardArray[i];
		score += getCardNumericValue(card);
		if(card.value === 'Ace'){
			hasAce = true;
		}
	}
	if(hasAce && score + 10 <= 21){
		return score + 10;
	}
	return score;
}


function updateScore(){
	dealerScore = getScore(dealerCards);
	playerScore = getScore(playerCards);
}


function checkForEndOfGame(){
	updateScore();

	if(gameOver){
		//let dealer take cards
		while(dealerScore < playerScore
					&& playerScore <= 21
					&& dealerScore <= 21){
			dealerCards.push(getNextCard());
			updateScore();
		}
	}

	if(playerScore > 21){
		playerWon = false;
		gameOver = true;
	}
	else if(dealerScore > 21){
		playerWon = true;
		gameOver = true;
	}
	//verify the winner
	else if(gameOver){
		if(playerScore > dealerScore) playerWon = true;
		else if(playerScore == dealerScore) playerWon = false;
		else playerWon = false;
	}
}

function showStatus(){
	if(!gameStarted){
		textArea.innerHTML = 'Welcome to Blackjack!';
		return;
	}
	
	let dealerCardString = '';
	for(let i = 0; i < dealerCards.length; i ++){
		dealerCardString += `${getCardString(dealerCards[i])} <br>`;
	}

	let playerCardString = '';
	for(let i = 0; i < playerCards.length; i++){
		playerCardString += `${getCardString(playerCards[i])} <br>`;
	}

	updateScore();

	textArea.innerHTML = 
		`Dealer has: <br>
		${dealerCardString}
		(Score: ${dealerScore})<br><br>
		
		Player has:<br>
		${playerCardString}
		(Score: ${playerScore})<br><br>`
		if(gameOver){
			if(playerWon){
				textArea.innerHTML += 'YOU WIN!';
			}
			else{
				textArea.innerHTML += 'DEALER WIN!';
			}
			newGameButton.style.display = 'inline';
			hitButton.style.display = 'none';
			stayButton.style.display= 'none';
		}
}