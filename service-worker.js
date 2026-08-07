const CACHE = "temps-v2";

const FITXERS = [
    "index.html",
    "historial.html",
    "resum.html",
    "style.css",
    "dades.js",
    "app.js",
    "historial.js",
    "resum.js",
    "servei-treballador.js",
    "manifest.json",
    "icon-192.png",
    "icon-512.png",
    "icon-1024.png"
];


self.addEventListener(
"install",
event => {

event.waitUntil(

caches.open(CACHE)
.then(cache =>
cache.addAll(FITXERS)
)

);

});


self.addEventListener(
"fetch",
event => {

event.respondWith(

caches.match(event.request)
.then(resposta => {

return resposta || fetch(event.request);

})

);

});
