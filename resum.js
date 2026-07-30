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



window.onload=()=>{

mostrar(obtenirDades());

};