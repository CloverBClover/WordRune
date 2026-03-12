let characters = [];
let targetChar;
let maxGuesses = 6;
let currentGuess = 0;

const gameBoard = document.getElementById('gameBoard');
const guessInput = document.getElementById('guessInput');
const submitBtn = document.getElementById('submitBtn');
const resultPanel = document.getElementById('resultPanel');

function getParams(){
  const params = new URLSearchParams(window.location.search);
  return { mode: params.get('mode')||'main', type: params.get('type')||'random' };
}

async function init(){
  const {mode,type} = getParams();
  const file = mode==='main' ? 'data/undertale_main.json' : 'data/undertale_all.json';
  characters = await fetch(file).then(r=>r.json());
  targetChar = pickTarget(type);
  currentGuess=0;
  renderBoard();
}

function pickTarget(type){
  if(type==='daily'){
    const today = new Date().toISOString().slice(0,10);
    const index = today.split('-').reduce((a,b)=>a+b.charCodeAt(0),0) % characters.length;
    return characters[index];
  } else {
    return characters[Math.floor(Math.random()*characters.length)];
  }
}

function renderBoard(){
  gameBoard.innerHTML='';
  for(let i=0;i<maxGuesses;i++){
    const row=document.createElement('div'); row.className='guessRow';
    for(let j=0;j<6;j++){
      const tile=document.createElement('div'); tile.className='tile';
      row.appendChild(tile);
    }
    gameBoard.appendChild(row);
  }
  resultPanel.innerHTML='';
}

submitBtn.addEventListener('click',()=>{
  const guessName = guessInput.value.trim();
  const char = characters.find(c=>c.name.toLowerCase()===guessName.toLowerCase());
  if(!char){ alert('Character not found'); return;}
  checkGuess(char);
  guessInput.value='';
});

function checkGuess(char){
  const row = gameBoard.children[currentGuess];
  const keys = ["name","species","first_seen","role","gender","in_deltarune"];
  keys.forEach((key,i)=>{
    const tile = row.children[i];
    let val = char[key]; let targetVal = targetChar[key];
    if(key==='first_seen'){
      if(val===targetVal) tile.className='tile green';
      else if(val<targetVal){ tile.className='tile yellow'; val+=' ↑'; }
      else { tile.className='tile yellow'; val+=' ↓'; }
    } else { tile.className = val===targetVal?'tile green':'tile gray'; }
    tile.textContent = val;
  });
  currentGuess++;
  if(char.name===targetChar.name) showResult(true);
  else if(currentGuess>=maxGuesses) showResult(false);
}

function showResult(win){
  resultPanel.innerHTML=`<h3>${win?'You Win!':'Game Over!'}</h3>
  <p>Name: ${targetChar.name}</p>
  <p>Species: ${targetChar.species}</p>
  <p>First Seen: ${targetChar.first_seen}</p>
  <p>Role: ${targetChar.role}</p>
  <p>Gender: ${targetChar.gender}</p>
  <p>In Deltarune: ${targetChar.in_deltarune}</p>
  <button onclick="init()">Play Again</button>`;
}

init();
