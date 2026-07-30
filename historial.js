const contenidor =
document.getElementById("llistaHistorial");


// MODAL NOU REGISTRE

const modalNou =
document.getElementById("modalNou");

const novaActivitat =
document.getElementById("novaActivitat");

const novaDataEntrada =
document.getElementById("novaDataEntrada");

const novaEntrada =
document.getElementById("novaEntrada");

const novaDataSortida =
document.getElementById("novaDataSortida");

const novaSortida =
document.getElementById("novaSortida");

const guardarNou =
document.getElementById("guardarNou");

const cancelarNou =
document.getElementById("cancelarNou");


// MODAL EDITAR REGISTRE

const modalEditar =
document.getElementById("modalEditar");

const editActivitat =
document.getElementById("editActivitat");

const editInici =
document.getElementById("editInici");

const editFinal =
document.getElementById("editFinal");

const guardarEdit =
document.getElementById("guardarEdit");

const cancelarEdit =
document.getElementById("cancelarEdit");


let indexEditant = -1;


// =============================
// FORMAT
// =============================

function data(ms) {

    return new Date(ms)
        .toLocaleDateString("ca-ES");

}


function hora(ms) {

    return new Date(ms)
        .toLocaleTimeString(
            "ca-ES",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


function durada(ms) {

    const minuts =
    Math.floor(ms / 60000);

    const h =
    Math.floor(minuts / 60);

    const m =
    minuts % 60;

    return (
        h +
        " h " +
        String(m).padStart(2, "0") +
        " min"
    );

}


function duradaDecimal(ms) {

    const hores =
    ms / 3600000;

    return hores.toLocaleString(
        "ca-ES",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ) + " h";

}


function inputData(ms) {

    const d =
    new Date(ms);

    return (
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0") +
        "T" +
        String(d.getHours()).padStart(2, "0") +
        ":" +
        String(d.getMinutes()).padStart(2, "0")
    );

}


function dataInputLocal(d = new Date()) {

    return (
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0")
    );

}


// =============================
// MOSTRAR HISTORIAL
// =============================

function carregar() {

    contenidor.innerHTML = "";

    const historial =
    obtenirHistorial();


    if (historial.length === 0) {

        contenidor.innerHTML = `
            <div class="targeta">
                Encara no hi ha registres.
            </div>
        `;

        return;

    }


    const grups = {};


    historial.forEach((registre, index) => {

        if (!grups[registre.activitat]) {

            grups[registre.activitat] = [];

        }

        grups[registre.activitat].push({
            ...registre,
            index
        });

    });


    Object.keys(grups)
        .sort((a, b) =>
            a.localeCompare(b, "ca")
        )
        .forEach(nom => {

            let total = 0;

            let html = `

                <div class="activitatHistorial">

                    <div class="capcaleraActivitat">

                        <h2>🔧 ${nom}</h2>

                        <div class="accionsActivitat">

                            <button
                                class="verd botoPetit"
                                onclick='obrirNou(${JSON.stringify(nom)})'>

                                ➕ Registre

                            </button>

                            <button
                                class="primari botoPetit"
                                onclick='exportarCSV(${JSON.stringify(nom)})'>

                                📄 CSV

                            </button>

                            <button
                                class="primari botoPetit"
                                onclick='canviarNomActivitat(${JSON.stringify(nom)})'>

                                ✏️ Nom

                            </button>

                            <button
                                class="vermell botoPetit"
                                onclick='eliminarActivitatHistorial(${JSON.stringify(nom)})'>

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
                .sort((a, b) =>
                    b.inici - a.inici
                )
                .forEach((registre, index) => {

                    total += registre.durada;

                    html += `

                        <div class="filaHistorial">

                            <div>R${index + 1}</div>

                            <div>
                                ${data(registre.inici)}
                            </div>

                            <div>
                                ${hora(registre.inici)}
                            </div>

                            <div>
                                ${hora(registre.final)}
                            </div>

                            <div>
                                ${durada(registre.durada)}
                            </div>

                            <div class="accionsHistorial">

                                <button
                                    class="primari"
                                    onclick="editar(${registre.index})">

                                    ✏️

                                </button>

                                <button
                                    class="vermell"
                                    onclick="eliminar(${registre.index})">

                                    🗑️

                                </button>

                            </div>

                        </div>
                    `;

                });


            html += `

                    <div class="totalActivitat">

                        Total ${nom}:

                        <strong>
                            ${durada(total)}
                        </strong>

                        <span class="horesDecimals">
                            (${duradaDecimal(total)})
                        </span>

                    </div>

                </div>
            `;


            contenidor.innerHTML += html;

        });

}


// =============================
// NOU REGISTRE
// =============================

function obrirNou(nom) {

    const avui =
    dataInputLocal();

    novaActivitat.value =
    nom;

    novaDataEntrada.value =
    avui;

    novaDataSortida.value =
    avui;

    novaEntrada.value =
    "";

    novaSortida.value =
    "";

    modalNou.classList.remove(
        "ocult"
    );

}


guardarNou.onclick = () => {

    if (
        !novaDataEntrada.value ||
        !novaEntrada.value ||
        !novaDataSortida.value ||
        !novaSortida.value
    ) {

        alert(
            "Completa les dates i les hores."
        );

        return;

    }


    const inici =
    new Date(
        novaDataEntrada.value +
        "T" +
        novaEntrada.value
    ).getTime();


    const final =
    new Date(
        novaDataSortida.value +
        "T" +
        novaSortida.value
    ).getTime();


    if (
        !Number.isFinite(inici) ||
        !Number.isFinite(final)
    ) {

        alert(
            "Les dates o les hores no són correctes."
        );

        return;

    }


    if (final <= inici) {

        alert(
            "La sortida ha de ser posterior a l'entrada."
        );

        return;

    }


    afegirRegistre({

        activitat:
        novaActivitat.value,

        inici,

        final,

        durada:
        final - inici

    });


    modalNou.classList.add(
        "ocult"
    );

    carregar();

};


cancelarNou.onclick = () => {

    modalNou.classList.add(
        "ocult"
    );

};


// =============================
// EDITAR REGISTRE
// =============================

function editar(index) {

    indexEditant =
    index;

    const registre =
    obtenirHistorial()[index];

    if (!registre) {

        alert(
            "No s'ha trobat el registre."
        );

        return;

    }

    editActivitat.value =
    registre.activitat;

    editInici.value =
    inputData(registre.inici);

    editFinal.value =
    inputData(registre.final);

    modalEditar.classList.remove(
        "ocult"
    );

}


guardarEdit.onclick = () => {

    const historial =
    obtenirHistorial();

    const registre =
    historial[indexEditant];


    if (!registre) {

        alert(
            "No s'ha trobat el registre."
        );

        return;

    }


    const inici =
    new Date(
        editInici.value
    ).getTime();

    const final =
    new Date(
        editFinal.value
    ).getTime();


    if (
        !Number.isFinite(inici) ||
        !Number.isFinite(final)
    ) {

        alert(
            "Les dates o les hores no són correctes."
        );

        return;

    }


    if (final <= inici) {

        alert(
            "La sortida ha de ser posterior a l'entrada."
        );

        return;

    }


    registre.inici =
    inici;

    registre.final =
    final;

    registre.durada =
    final - inici;


    guardarHistorial(
        historial
    );


    modalEditar.classList.add(
        "ocult"
    );

    carregar();

};


cancelarEdit.onclick = () => {

    modalEditar.classList.add(
        "ocult"
    );

};


// =============================
// ELIMINAR REGISTRE
// =============================

function eliminar(index) {

    if (
        !confirm(
            "Eliminar aquest registre?"
        )
    ) {

        return;

    }

    eliminarRegistre(index);

    carregar();

}


// =============================
// ACCIONS D'ACTIVITAT
// =============================

function canviarNomActivitat(nom) {

    let nou =
    prompt(
        "Nou nom de l'activitat:",
        nom
    );

    if (!nou) {

        return;

    }

    nou =
    nou.trim();

    if (!nou) {

        return;

    }


    if (
        editarActivitat(
            nom,
            nou
        )
    ) {

        carregar();

    }
    else {

        alert(
            "No s'ha pogut canviar el nom. Potser ja existeix una activitat amb aquest nom."
        );

    }

}


function eliminarActivitatHistorial(nom) {

    if (
        !confirm(
            "Eliminar l'activitat \"" +
            nom +
            "\" i tots els seus registres?"
        )
    ) {

        return;

    }

    eliminarActivitat(nom);

    carregar();

}


// =============================
// EXPORTAR CSV
// =============================

function exportarCSV(nom) {

    const historial =
    obtenirHistorial()
        .filter(registre =>
            registre.activitat === nom
        )
        .sort((a, b) =>
            b.inici - a.inici
        );


    if (historial.length === 0) {

        alert(
            "No hi ha registres per exportar."
        );

        return;

    }


    let csv =
    "\uFEFF";

    csv +=
    "Activitat;" +
    nom +
    "\n\n";

    csv +=
    "Registre;Data entrada;Hora entrada;Data sortida;Hora sortida;Hores;Decimal\n";


    let total = 0;


    historial.forEach(
        (registre, index) => {

            total +=
            registre.durada;

            const decimal =
            (
                registre.durada /
                3600000
            ).toLocaleString(
                "ca-ES",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );


            csv +=
            `R${index + 1};` +
            `${data(registre.inici)};` +
            `${hora(registre.inici)};` +
            `${data(registre.final)};` +
            `${hora(registre.final)};` +
            `${durada(registre.durada)};` +
            `${decimal}\n`;

        }
    );


    csv +=
    "\n;;;;;TOTAL;" +
    (
        total /
        3600000
    ).toLocaleString(
        "ca-ES",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );


    const blob =
    new Blob(
        [csv],
        {
            type:
            "text/csv;charset=utf-8;"
        }
    );


    const url =
    URL.createObjectURL(blob);


    const enllac =
    document.createElement("a");


    const nomFitxer =
    nom
        .trim()
        .replace(
            /[^\p{L}\p{N}_-]+/gu,
            "_"
        );


    enllac.href =
    url;

    enllac.download =
    nomFitxer +
    ".csv";


    document.body.appendChild(
        enllac
    );

    enllac.click();

    enllac.remove();


    setTimeout(
        () =>
        URL.revokeObjectURL(url),
        1000
    );

}


window.onload =
carregar;