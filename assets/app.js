const CHATBOT_IFRAME_URL = "PASTE_YOUR_CHATBOT_URL_HERE"; // <-- МЫНАУДЫ ауыстырасыз

const routes = ["home","diagnostic","path","assistant","teacher"];
function show(route){
  routes.forEach(r=>{
    const el=document.getElementById(`page-${r}`);
    if(el) el.classList.toggle("active", r===route);
  });
  document.querySelectorAll(".nav__btn").forEach(b=>{
    b.classList.toggle("active", b.dataset.route===route);
  });
  if(route==="assistant") setupAssistant();
  if(route==="path") renderPath();
  if(route==="teacher") renderTeacher();
}
document.addEventListener("click",(e)=>{
  const t=e.target.closest("[data-route]");
  if(!t) return;
  show(t.dataset.route);
});

const QUESTIONS=[
 {q:"Python-да айнымалы деген не?",a:["Мәлімет сақтайтын атаулы орын","Тек цикл","Графика","Протокол"],correct:0},
 {q:"if не үшін керек?",a:["Файл өшіру","Шарт тексеру","Мәтін ғана","Экран тазалау"],correct:1},
 {q:"Цикл не істейді?",a:["Қайталап орындайды","Өшіреді","Сурет салады","Бір рет"],correct:0},
 {q:"List не үшін?",a:["Бір сан","Көп элемент","Принтер","Желі"],correct:1},
 {q:"print()?",a:["Экранға шығару","Файл өшіру","Өшіру","Пароль"],correct:0},
 {q:"int('12')?",a:["12 саны","'12' мәтіні","Қате","12.0"],correct:0},
 {q:"== ?",a:["Теңдігін салыстыру","Меншіктеу","Көбейту","Бөлу"],correct:0},
 {q:"for қашан?",a:["Желі","Қайталау саны белгілі","Графика","Дыбыс"],correct:1},
 {q:"Алгоритм?",a:["Қадам-қадам","Комп бөлік","Ойын","Файл"],correct:0},
 {q:"Қате болса?",a:["Лақтыру","Қате мәтінін оқып табу","Өшіру","Интернет"],correct:1},
];

const quizBox=document.getElementById("quizBox");
const resultBox=document.getElementById("resultBox");
const scoreNum=document.getElementById("scoreNum");
const levelText=document.getElementById("levelText");
const adviceText=document.getElementById("adviceText");

function renderQuiz(){
  quizBox.innerHTML="";
  QUESTIONS.forEach((it,i)=>{
    const d=document.createElement("div");
    d.className="q";
    d.innerHTML=`<div class="q__title">${i+1}. ${it.q}</div>
      <div class="opts">
        ${it.a.map((o,oi)=>`
          <label class="opt"><input type="radio" name="q${i}" value="${oi}"><span>${o}</span></label>
        `).join("")}
      </div>`;
    quizBox.appendChild(d);
  });
  resultBox.hidden=true;
}
function calcScore(){
  let s=0;
  QUESTIONS.forEach((it,i)=>{
    const c=document.querySelector(`input[name="q${i}"]:checked`);
    if(c && Number(c.value)===it.correct) s++;
  });
  return s;
}
function levelFromScore(s){
  if(s<=4) return {level:"Базалық (Жеңіл)", advice:"Айнымалы, шарт, цикл тақырыптарын қайталаңыз. Күніне 15 минут практика."};
  if(s<=7) return {level:"Орта", advice:"Функция, тізім және қате талдау бойынша жаттығу көбейтіңіз."};
  return {level:"Жоғары (Қиын)", advice:"Күрделі алгоритмдер мен жобалық тапсырмаларға өтіңіз."};
}

document.getElementById("finishQuiz").addEventListener("click",()=>{
  const s=calcScore();
  const m=levelFromScore(s);
  localStorage.setItem("ai_score",String(s));
  localStorage.setItem("ai_level",m.level);
  localStorage.setItem("ai_advice",m.advice);
  scoreNum.textContent=`${s}/10`;
  levelText.textContent=m.level;
  adviceText.textContent=m.advice;
  resultBox.hidden=false;
  renderPath(); renderTeacher();
});
document.getElementById("resetQuiz").addEventListener("click",()=>{
  document.querySelectorAll('input[type="radio"]').forEach(i=>i.checked=false);
  resultBox.hidden=true;
});

function renderPath(){
  const lvl=localStorage.getItem("ai_level")||"—";
  const adv=localStorage.getItem("ai_advice")||"—";
  const a=document.getElementById("pathLevel");
  const b=document.getElementById("pathAdvice");
  if(a) a.textContent=lvl;
  if(b) b.textContent=adv;
}
function renderTeacher(){
  const s=localStorage.getItem("ai_score");
  const l=localStorage.getItem("ai_level");
  const a=localStorage.getItem("ai_advice");
  const tScore=document.getElementById("tScore");
  const tLevel=document.getElementById("tLevel");
  const tAdvice=document.getElementById("tAdvice");
  if(tScore) tScore.textContent=s?`${s}/10`:"—";
  if(tLevel) tLevel.textContent=l||"—";
  if(tAdvice) tAdvice.textContent=a||"—";
}
document.getElementById("clearData").addEventListener("click",()=>{
  localStorage.removeItem("ai_score");
  localStorage.removeItem("ai_level");
  localStorage.removeItem("ai_advice");
  renderTeacher(); renderPath();
});

// ассистент
function setupAssistant(){
  const frame=document.getElementById("assistantFrame");
  const open=document.getElementById("assistantOpen");
  if(!CHATBOT_IFRAME_URL || CHATBOT_IFRAME_URL.includes("PASTE_")){
    if(open) open.href="#";
    if(frame) frame.srcdoc=`<div style="padding:18px;font-family:Inter,Arial;color:white">
      <b>Чатбот URL қойылмаған.</b><br>app.js ішіндегі CHATBOT_IFRAME_URL мәнін ауыстырыңыз.
    </div>`;
    return;
  }
  if(open) open.href=CHATBOT_IFRAME_URL;
  if(frame) frame.src=CHATBOT_IFRAME_URL;
}
document.getElementById("assistantReload").addEventListener("click",setupAssistant);

renderQuiz();
show("home");
