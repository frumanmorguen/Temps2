const resultat=document.getElementById("resultat");


function obtenirDades(){

return JSON.parse(
localStorage.getItem("historial")||"[]"
);

}



function format(ms){

let minuts=Math.floor(ms/60000);

let h=Math.floor(minuts/60);
let m=minuts%60;

return h+" h "+
String(m).padStart(2,"0")+" min";

}



function filtrar(tipus){

let historial=obtenirDades();

let ara=new Date();

let iniciFiltre;


if(tipus==="avui"){

iniciFiltre=new Date(
ara.getFullYear(),
ara.getMonth(),
ara.getDate()
).getTime();

}


if(tipus==="setmana"){

let dia=ara.getDay()||7;

iniciFiltre=new Date(
ara.getFullYear(),
ara.getMonth(),
ara.getDate()-dia+1
).getTime();

}


if(tipus==="mes"){

iniciFiltre=new Date(
ara.getFullYear(),
ara.getMonth(),
1
).getTime();

}



let filtrats=historial.filter(r=>
r.inici>=iniciFiltre
);



mostrar(filtrats);

}




function mostrar(historial){


resultat.innerHTML="";


if(historial.length===0){

resultat.innerHTML=`

<div class="targeta">

No hi ha registres en aquest període.

</div>

`;

return;

}



let total=0;
let activitats={};



historial.forEach(r=>{


total+=r.durada;


if(!activitats[r.activitat])
activitats[r.activitat]=0;


activitats[r.activitat]+=r.durada;


});



resultat.innerHTML+=`

<div class="targeta">

<h2>Total</h2>

<div class="rellotge">

${format(total)}

</div>

</div>

`;



Object.keys(activitats)
.sort()
.forEach(a=>{


resultat.innerHTML+=`

<div class="targeta">

<h3>🔧 ${a}</h3>

<div class="rellotge">

${format(activitats[a])}

</div>

</div>

`;

});


}



function tornar(){

location.href="index.html";

}


/* ===============================
   FUNCIONS DE BACKUP I RESTORE
=============================== */

function obtenirBackupComplet(){

const backup={
activitats:localStorage.getItem("temps_activitats"),
historial:localStorage.getItem("historial"),
actiu:localStorage.getItem("temps_actiu"),
data:new Date().toLocaleString("ca-ES")
};

return JSON.stringify(backup, null, 2);

}

function descarregarBackup(){

const backup=obtenirBackupComplet();
const blob=new Blob([backup], {type:"application/json"});
const url=URL.createObjectURL(blob);
const a=document.createElement("a");
a.href=url;
a.download="temps-backup-"+new Date().getTime()+".json";
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);

alert("✅ Backup descarregat!");

}

function mostrarBackup(){

const backup=obtenirBackupComplet();
document.getElementById("textBackup").value=backup;
document.getElementById("modalBackup").classList.remove("ocult");

}

function tancarBackup(){

document.getElementById("modalBackup").classList.add("ocult");

}

function copiarBackup(){

const text=document.getElementById("textBackup");
text.select();
document.execCommand("copy");
alert("✅ Backup copiat al portapapeles!");

}

function restaurarBackup(){

const input=document.createElement("input");
input.type="file";
input.accept=".json";

input.onchange=(e)=>{

const file=e.target.files[0];
const reader=new FileReader();

reader.onload=(event)=>{

try{

const backup=JSON.parse(event.target.result);

if(backup.activitats)
localStorage.setItem("temps_activitats", backup.activitats);

if(backup.historial)
localStorage.setItem("historial", backup.historial);

if(backup.actiu)
localStorage.setItem("temps_actiu", backup.actiu);

alert("✅ Backup restaurat correctament!\n\nRecarregant pàgina...");
location.reload();

}catch(err){

alert("❌ Error en restaurar el backup:\n"+err.message);

}

};

reader.readAsText(file);

};

input.click();

}



window.onload=()=>{

mostrar(obtenirDades());

};
