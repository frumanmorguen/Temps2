const CACHE = "temps-v1";

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
    "icona-192.png",
    "icona-512.png",
    "icona-1024.png"
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
