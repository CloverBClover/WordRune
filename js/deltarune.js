// deltarune.js
let characters = [];
let targetChar;

const tbody = document.querySelector("#gameTable tbody");
const guessInput = document.getElementById("guessInput");
const submitBtn = document.getElementById("submitBtn");

function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    mode: params.get('mode') || 'main',
    type: params.get('type') || 'random'
  };
}

async function init() {
  const {mode, type} = getParams();
  const file = mode === 'main' ? 'data/deltarune_main.json' : 'data/deltarune_all.json';
  characters = await fetch(file).then(r => r.json());
  pickTarget(type);
  tbody.innerHTML = "";
}

function pickTarget(type) {
  if(type === 'daily') {
    const today = new Date().toISOString().slice(0,10);
    const index = today.split('-').reduce((a,b)=>a+b.charCodeAt(0),0) % characters.length;
    targetChar = characters[index];
  } else {
    targetChar = characters[Math.floor(Math.random()*characters.length)];
  }
}

function addRow(char) {
  const tr = document.createElement("tr");
  const keys = ["name","light_dark","chapter","role","gender","in_undertale"];
  keys.forEach(key => {
    const td = document.createElement("td");
    let val = char[key];
    let targetVal = targetChar[key];

    if(key === "chapter") {
      if(val === targetVal) td.className = "green";
      else if(val < targetVal){ td.className = "yellow"; val += " ↑"; }
      else { td.className = "yellow"; val += " ↓"; }
    } else if(key === "in_undertale") {
      val = val ? "Yes" : "No";
      td.className = (val === (targetVal ? "Yes":"No")) ? "green" : "gray";
    } else {
      td.className = (val === targetVal) ? "green" : "gray";
    }

    td.textContent = val;
    tr.appendChild(td);
  });
  tbody.appendChild(tr);

  if(char.name === targetChar.name){
    alert("You Win! Target: " + targetChar.name);
  }
}

submitBtn.addEventListener("click", ()=>{
  const guess = guessInput.value.trim();
  const char = characters.find(c=>c.name.toLowerCase()===guess.toLowerCase());
  if(!char){ alert("Character not found!"); return; }
  addRow(char);
  guessInput.value = "";
});

init();
