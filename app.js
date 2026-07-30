let activitat=null,inici=null,temporitzador=null;

const pantallaInici=document.getElementById("pantallaInici");
const activitatActiva=document.getElementById("activitatActiva");
const nomActivitat=document.getElementById("nomActivitat");
const llistaActivitats=document.getElementById("llistaActivitats");
const nomMostrat=document.getElementById("nomMostrat");
const temps=document.getElementById("temps");
const horaInici=document.getElementById("horaInici");

const botoComencar=document.getElementById("botoComencar");
const botoFinalitzar=document.getElementById("botoFinalitzar");
const botoNova=document.getElementById("novaActivitat");


function carregarActivitats(){

llistaActivitats.innerHTML="";

obtenirActivitats().forEach(nom=>{

let fila=document.createElement("div");
fila.className="activitatBoton";

fila.innerHTML=`
<button class="botoActivitat">${nom}</button>
<button class="petitEditar">✏️</button>
<button class="petitEliminar">🗑️</button>
`;

fila.querySelector(".botoActivitat").onclick=()=>{
nomActivitat.value=nom;
};

fila.querySelector(".petitEditar").onclick=()=>{

let nou=prompt("Nou nom de l'activitat:",nom);

if(nou&&nou.trim()){
if(editarActivitat(nom,nou.trim())){
carregarActivitats();
}
}

};


fila.querySelector(".petitEliminar").onclick=()=>{

if(confirm("Eliminar aquesta activitat i tots els seus registres?")){
eliminarActivitat(nom);
carregarActivitats();
}

};

llistaActivitats.appendChild(fila);

});

}



botoNova.onclick=()=>{

let nom=nomActivitat.value.trim();

if(!nom){
alert("Escriu el nom de l'activitat.");
return;
}

if(afegirActivitat(nom)){
nomActivitat.value="";
carregarActivitats();
}else{
alert("Aquesta activitat ja existeix.");
}

};



function formatTemps(ms){

let s=Math.floor(ms/1000);

let h=Math.floor(s/3600);
let m=Math.floor((s%3600)/60);
let seg=s%60;

return String(h).padStart(2,"0")+":"+
String(m).padStart(2,"0")+":"+
String(seg).padStart(2,"0");

}



function actualitzarTemps(){

if(!inici)return;

temps.textContent=formatTemps(Date.now()-inici);

}



function mostrarActivitat(){

pantallaInici.classList.add("ocult");
activitatActiva.classList.remove("ocult");

nomMostrat.textContent=activitat;

horaInici.textContent=
"Inici: "+
new Date(inici).toLocaleString("ca-ES");

clearInterval(temporitzador);

temporitzador=setInterval(actualitzarTemps,1000);

actualitzarTemps();

}



botoComencar.onclick=()=>{

let nom=nomActivitat.value.trim();

if(!nom){
alert("Selecciona una activitat.");
return;
}

if(!obtenirActivitats().includes(nom)){
afegirActivitat(nom);
carregarActivitats();
}

activitat=nom;
inici=Date.now();

guardarActivitatActiva({
activitat,
inici
});

mostrarActivitat();

};



botoFinalitzar.onclick=()=>{

let final=Date.now();

afegirRegistre({
activitat,
inici,
final,
durada:final-inici
});

eliminarActivitatActiva();

clearInterval(temporitzador);

activitat=null;
inici=null;

activitatActiva.classList.add("ocult");
pantallaInici.classList.remove("ocult");

temps.textContent="00:00:00";

};



window.onload=()=>{

carregarActivitats();

let activa=obtenirActivitatActiva();

if(activa){

activitat=activa.activitat;
inici=activa.inici;

mostrarActivitat();

}

};