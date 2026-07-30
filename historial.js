const contenidor=document.getElementById("llistaHistorial");

const modalNou=document.getElementById("modalNou");
const novaActivitat=document.getElementById("novaActivitat");
const novaData=document.getElementById("novaData");
const novaEntrada=document.getElementById("novaEntrada");
const novaSortida=document.getElementById("novaSortida");
const guardarNou=document.getElementById("guardarNou");
const cancelarNou=document.getElementById("cancelarNou");

const modalEditar=document.getElementById("modalEditar");
const editActivitat=document.getElementById("editActivitat");
const editInici=document.getElementById("editInici");
const editFinal=document.getElementById("editFinal");
const guardarEdit=document.getElementById("guardarEdit");
const cancelarEdit=document.getElementById("cancelarEdit");

let indexEditant=-1;


function data(ms){
return new Date(ms).toLocaleDateString("ca-ES");
}


function hora(ms){
return new Date(ms).toLocaleTimeString(
"ca-ES",
{hour:"2-digit",minute:"2-digit"}
);
}


function durada(ms){

let minuts=Math.floor(ms/60000);
let h=Math.floor(minuts/60);
let m=minuts%60;

return h+" h "+String(m).padStart(2,"0")+" min";

}


function duradaDecimal(ms){

    let hores=ms/3600000;

    return hores.toLocaleString("ca-ES",{
        minimumFractionDigits:2,
        maximumFractionDigits:2
    })+" h";

}

function inputData(ms){

let d=new Date(ms);

return d.getFullYear()+"-"+
String(d.getMonth()+1).padStart(2,"0")+"-"+
String(d.getDate()).padStart(2,"0")+"T"+
String(d.getHours()).padStart(2,"0")+":"+
String(d.getMinutes()).padStart(2,"0");

}



function carregar(){

contenidor.innerHTML="";

let historial=obtenirHistorial();

if(historial.length===0){

contenidor.innerHTML=`
<div class="targeta">
Encara no hi ha registres.
</div>`;

return;

}


let grups={};


historial.forEach((r,i)=>{

if(!grups[r.activitat])
grups[r.activitat]=[];

grups[r.activitat].push({
...r,
index:i
});

});



Object.keys(grups)
.sort()
.forEach(nom=>{


let total=0;


let html=`

<div class="activitatHistorial">

<div class="capcaleraActivitat">

<h2>🔧 ${nom}</h2>


<div class="accionsActivitat">


<button
class="verd botoPetit"
onclick="obrirNou('${nom}')">

➕ Registre

</button>


<button
class="primari botoPetit"
onclick="exportarCSV('${nom}')">

📄 CSV

</button>


<button
class="primari botoPetit"
onclick="canviarNomActivitat('${nom}')">

✏️ Nom

</button>


<button
class="vermell botoPetit"
onclick="eliminarActivitatHistorial('${nom}')">

🗑️ Activitat

</button>


</div>

</div>


<div class="capcaleraHistorial">

<div>Registre</div>
<div>Data</div>
<div>Entrada</div>
<div>Sortida</div>
<div>Total</div>
<div></div>

</div>

`;



grups[nom]
.slice()
.reverse()
.forEach((r,i)=>{

total+=r.durada;


html+=`

<div class="filaHistorial">

<div>R${i+1}</div>

<div>${data(r.inici)}</div>

<div>${hora(r.inici)}</div>

<div>${hora(r.final)}</div>

<div>${durada(r.durada)}</div>

<div class="accionsHistorial">

<button class="primari"
onclick="editar(${r.index})">
✏️
</button>

<button class="vermell"
onclick="eliminar(${r.index})">
🗑️
</button>

</div>

</div>

`;

});


html+=`

<div class="totalActivitat">

Total ${nom}:
<strong>${durada(total)}</strong>
<span class="horesDecimals">(${duradaDecimal(total)})</span>

</div>

</div>

`;


contenidor.innerHTML+=html;


});


}




function obrirNou(nom){

novaActivitat.value=nom;

let avui=new Date();

novaData.value=
avui.toISOString().substring(0,10);

novaEntrada.value="";
novaSortida.value="";

modalNou.classList.remove("ocult");

}



guardarNou.onclick=()=>{


if(!novaEntrada.value||!novaSortida.value){

alert("Completa les hores.");
return;

}


let inici=new Date(
novaData.value+"T"+novaEntrada.value
).getTime();


let final=new Date(
novaData.value+"T"+novaSortida.value
).getTime();


if(final<=inici){

alert("La sortida ha de ser posterior.");
return;

}


afegirRegistre({

activitat:novaActivitat.value,
inici,
final,
durada:final-inici

});


modalNou.classList.add("ocult");

carregar();

};



cancelarNou.onclick=()=>{

modalNou.classList.add("ocult");

};




function editar(index){

indexEditant=index;

let r=obtenirHistorial()[index];

editActivitat.value=r.activitat;
editInici.value=inputData(r.inici);
editFinal.value=inputData(r.final);

modalEditar.classList.remove("ocult");

}



guardarEdit.onclick=()=>{


let h=obtenirHistorial();

let r=h[indexEditant];


let inici=new Date(editInici.value).getTime();
let final=new Date(editFinal.value).getTime();


if(final<=inici){

alert("Data incorrecta.");
return;

}


r.activitat=editActivitat.value;
r.inici=inici;
r.final=final;
r.durada=final-inici;


guardarHistorial(h);

modalEditar.classList.add("ocult");

carregar();

};



cancelarEdit.onclick=()=>{

modalEditar.classList.add("ocult");

};



function eliminar(index){

if(confirm("Eliminar aquest registre?")){

eliminarRegistre(index);

carregar();

}

}



function canviarNomActivitat(nom){

let nou=prompt(
"Nou nom de l'activitat:",
nom
);


if(!nou || nou.trim()===""){
return;
}


if(editarActivitat(nom,nou.trim())){

carregar();

}
else{

alert(
"No s'ha pogut canviar el nom."
);

}

}



function eliminarActivitatHistorial(nom){

if(confirm(
"Eliminar l'activitat '"+nom+"' i tots els seus registres?"
)){

eliminarActivitat(nom);

carregar();

}

}




function exportarCSV(nom){


let historial=obtenirHistorial()
.filter(r=>r.activitat===nom);



if(historial.length===0){

alert(
"No hi ha registres per exportar."
);

return;

}



let csv="Registre;Data;Entrada;Sortida;Hores;Decimal\n";


let total=0;


historial
.slice()
.reverse()
.forEach((r,i)=>{


total+=r.durada;


let hores=(r.durada/3600000)
.toLocaleString(
"ca-ES",
{
minimumFractionDigits:2,
maximumFractionDigits:2
}
);


csv+=
`R${i+1};${data(r.inici)};${hora(r.inici)};${hora(r.final)};${durada(r.durada)};${hores}\n`;



});


csv+=
`;;;;TOTAL;${(total/3600000).toLocaleString("ca-ES",{minimumFractionDigits:2,maximumFractionDigits:2})}`;



let blob=new Blob(
[csv],
{
type:"text/csv;charset=utf-8;"
}
);



let url=URL.createObjectURL(blob);



let a=document.createElement("a");

a.href=url;

a.download=
nom.replaceAll(" ","_")+".csv";


a.click();


URL.revokeObjectURL(url);


}

window.onload=carregar;