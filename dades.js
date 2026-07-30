const CLAU_ACTIVITATS="temps_activitats";
const CLAU_HISTORIAL="historial";
const CLAU_ACTIVA="temps_actiu";

function obtenirHistorial(){return JSON.parse(localStorage.getItem(CLAU_HISTORIAL)||"[]");}

function guardarHistorial(h){localStorage.setItem(CLAU_HISTORIAL,JSON.stringify(h));}

function reconstruirActivitats(){
let a=JSON.parse(localStorage.getItem(CLAU_ACTIVITATS)||"[]");
obtenirHistorial().forEach(r=>{if(!a.includes(r.activitat))a.push(r.activitat);});
a=[...new Set(a)].sort((x,y)=>x.localeCompare(y,"ca"));
localStorage.setItem(CLAU_ACTIVITATS,JSON.stringify(a));
return a;
}

function obtenirActivitats(){return reconstruirActivitats();}

function guardarActivitats(a){
a=[...new Set(a)].sort((x,y)=>x.localeCompare(y,"ca"));
localStorage.setItem(CLAU_ACTIVITATS,JSON.stringify(a));
}

function afegirActivitat(nom){
nom=nom.trim();
if(!nom)return false;
let a=obtenirActivitats();
if(a.includes(nom))return false;
a.push(nom);
guardarActivitats(a);
return true;
}

function editarActivitat(antic,nou){
nou=nou.trim();
if(!nou)return false;
let a=obtenirActivitats();
if(a.includes(nou)&&nou!==antic)return false;
let i=a.indexOf(antic);
if(i<0)return false;
a[i]=nou;
guardarActivitats(a);
let h=obtenirHistorial();
h.forEach(r=>{if(r.activitat===antic)r.activitat=nou;});
guardarHistorial(h);
let act=obtenirActivitatActiva();
if(act&&act.activitat===antic){
act.activitat=nou;
guardarActivitatActiva(act);
}
return true;
}

function eliminarActivitat(nom){
guardarActivitats(obtenirActivitats().filter(a=>a!==nom));
guardarHistorial(obtenirHistorial().filter(r=>r.activitat!==nom));
let act=obtenirActivitatActiva();
if(act&&act.activitat===nom)eliminarActivitatActiva();
}

function afegirRegistre(r){

let h=obtenirHistorial();

h.push(r);

// Ordenar tots els registres per data d'entrada
h.sort((a,b)=>a.inici-b.inici);

guardarHistorial(h);


if(!obtenirActivitats().includes(r.activitat)){

let a=obtenirActivitats();

a.push(r.activitat);

guardarActivitats(a);

}

}
function actualitzarRegistre(i,r){
let h=obtenirHistorial();
h[i]=r;
guardarHistorial(h);
reconstruirActivitats();
}

function eliminarRegistre(i){
let h=obtenirHistorial();
h.splice(i,1);
guardarHistorial(h);
reconstruirActivitats();
}

function guardarActivitatActiva(d){localStorage.setItem(CLAU_ACTIVA,JSON.stringify(d));}

function obtenirActivitatActiva(){return JSON.parse(localStorage.getItem(CLAU_ACTIVA)||"null");}

function eliminarActivitatActiva(){localStorage.removeItem(CLAU_ACTIVA);}