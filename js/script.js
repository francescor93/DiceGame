"use strict"

// AGGIUNGO IL LISTENER AL CLIC SUL PULSANTE
window.onload = function () {
    document.querySelector('#run').addEventListener("click", diceRoll);
}

// IMPOSTO IL GIOCATORE INIZIALE
var activeplayer = 1;

// IMPOSTO LO SCOMMETTITORE INIZIALE
var activebettor = 1;

// IMPOSTO I CREDITI INIZIALI
var credits = [100, 100, 100, 100];

// IMPOSTO I VALORI CHE HA IL DADO E LE RELATIVE ICONE
var values = [1, 2, 3, 4, 5, 6];
var icons = ["", "\u2680", "\u2681", "\u2682", "\u2683", "\u2684", "\u2685"]

// INIZIALIZZO IL CONTATORE DEL NUMERO DI MANCHES
var manche = 0;

// INIZIALIZZO L'ARRAY CON I RISULTATI DEI LANCI
var rolls = new Array();

// DICHIARO LA VARIABILE DELLA PUNTATA
var bet;

// RICHIAMO QUESTA FUNZIONE OGNI VOLTA CHE PREMO IL PULSANTE DI GIOCO
function diceRoll() {

    // SVOTO GLI INDICATORI DEI DADI
    document.querySelector('#dice1').innerHTML = '';
    document.querySelector('#dice2').innerHTML = '';

    // SE STO INIZIANDO UN NUOVO TURNO
    if (activeplayer == 1) {

        // SVUOTO IL TAVOLO
        document.querySelector('#dice1').innerHTML = "";
        document.querySelector('#dice1').className = "";
        document.querySelector('#dice2').innerHTML = "";
        document.querySelector('#dice2').className = "";
        for (let i = 1; i < 5; i++) {
            document.querySelector('#dicesPlayer' + i).innerHTML = "";
        }

        // SELEZIONO L'INPUT DELLO SCOMMETTITORE ATTIVO
        var betInput = document.querySelector('#betPlayer' + activebettor);

        // SE È STATO DEFINITO UN VALORE NEL RANGE AMMESSO ED IN POSSESSO DELLO SCOMMETTITORE
        if ((betInput.value >= 10) && (betInput.value <= 50) && (betInput.value <= credits[activebettor - 1])) {

            //LO SALVO NELLA VARIABILE DELLA PUNTATA
            bet = betInput.value;

            // SELEZIONO TUTTI GLI INPUT PER LE PUNTATE
            var betInputs = document.querySelectorAll('input');

            // PER CIASCUN INPUT IMPOSTO IL VALORE A QUELLO DELLA PUNTATA ATTUALE
            betInputs.forEach(function (item, index) {
                item.value = bet;
            });
        }

        // SE È STATO RICHIESTO IL GIOCO CON UN VALORE DI PUNTATA ERRATO MOSTRO UN ERRORE E TERMINO
        else {
            alert('Devi fare una puntata compresa fra 10 e 50 crediti.\nNon puntare più crediti di quelli che possiedi!');
            return;
        }
    }

    // OTTENGO UN NUMERO CASUALE FRA I VALORI POSSIBILI DEL DADO PER OGNUNO DEI DUE DADI
    var dice1 = values[Math.floor(Math.random() * values.length)];
    var dice2 = values[Math.floor(Math.random() * values.length)];

    // MOSTRO IL RISULTATO NEGLI INDICATORI DEI DADI AL CENTRO
    document.querySelector('#dice1').innerHTML = createface(dice1);
    document.querySelector('#dice1').className = 'face-' + dice1;
    document.querySelector('#dice2').innerHTML = createface(dice2);
    document.querySelector('#dice2').className = 'face-' + dice2;

    // MOSTRO IL RISULTATO SUL PIATTO DEL GIOCATORE
    document.querySelector('#dicesPlayer' + activeplayer).innerHTML = icons[dice1] + icons[dice2];

    // CALCOLO IL TOTALE DEI DUE DADI
    var total = dice1 + dice2;

    // SALVO IL TOTALE DEL LANCIO NELL'ARRAY DEI LANCI
    rolls.push(total);

    // SE SONO ALLA FINE DEL TURNO
    if (activeplayer == 4) {

        // INCREMENTO IL NUMERO DI MANCHES
        manche++;

        // CALCOLO L'ELEMENTO CON PUNTEGGIO MAGGIORE NELL'ARRAY DEI LANCI, DA CUI SO CHI L'HA FATTO
        var winnerposition = rolls.indexOf(Math.max(...rolls));

        // PER OGNI LANCIO 
        for (let i = 0; i < 4; i++) {

            // SE LA POSIZIONE È QUELLA DEL VINCITORE INCREMENTO I CREDITI
            if (i == winnerposition) {
                credits[i] += (parseInt(bet) * 3);
            }

            // ALTRIMENTI LI DECREMENTO
            else {
                credits[i] -= parseInt(bet);

                // SE DECREMENTANDOLI DIVENTANO INFERIORI A 10 NON SI PUÒ PIÙ SCOMMETTERE, QUINDI LI CONSIDERO AZZERATI
                if (credits[i] < 10) { credits[i] = 0; }
            }

            // AGGIORNO IL VISUALIZZATORE DEI CREDITI SUL TAVOLO
            document.querySelector('#creditsPlayer' + (i + 1)).innerHTML = credits[i];
        }

        // PASSO ALLO SCOMMETTITORE SUCCESSIVO O TORNO AL PRIMO SE HO SUPERATO I QUATTRO
        activebettor++;
        if (activebettor > 4) {
            activebettor = 1;
        }

        // SELEZIONO TUTTI GLI INPUT PER LE PUNTATE
        var betInputs = document.querySelectorAll('input');

        // PER CIASCUN INPUT
        betInputs.forEach(function (item, index) {

            // SVUOTO IL CAMPO
            item.value = "";

            // NE CANCELLO IL PLACEHOLDER
            item.placeholder = "";

            // E LO DISABILITO
            item.disabled = true;
        });

        // SE NON CI SONO GIOCATORI CON ZERO CREDITI
        if (credits.indexOf(0) == -1) {

            // ABILITO L'INPUT DELLO SCOMMETTITORE SUCCESSIVO
            document.querySelector('#betPlayer' + activebettor).disabled = false;

            // NE IMPOSTO IL PLACEHOLDER
            document.querySelector('#betPlayer' + activebettor).placeholder = "Puntata";

            // E LO PREPARO PER L'INSERIMENTO
            document.querySelector('#betPlayer' + activebettor).focus();
        }

        // ALTRIMENTI ESCO DALLA FUNZIONE SEGNALANDO IL TERMINE DEL GIOCO
        else {
            alert('Un giocatore è rimasto senza crediti.\nIl gioco è terminato dopo ' + manche + ' manche.');
            return;
        }

        // SVUOTO L'ARRAY DEI LANCI
        rolls = [];
    }

    // PASSO AL GIOCATORE SUCCESSIVO O TORNO AL PRIMO SE HO SUPERATO I QUATTRO
    activeplayer++;
    if (activeplayer > 4) {
        activeplayer = 1;
    }
}

// QUESTA FUNZIONE GENERA E RESTITUISCE IL CODICE HTML PER MOSTRARE UNA FACCIA DEL DADO IN BASE AL PUNTEGGIO PASSATO
function createface(points) {
    switch (points) {
        case 1:
            var face = `<div class="point"></div>`;
            break;
        case 2:
            var face = `
                <div class="point"></div>
                <div class="point"></div>
            `;
            break;
        case 3:
            var face = `
                <div class="point"></div>
                <div class="point"></div>
                <div class="point"></div>
            `;
            break;
        case 4:
            var face = `
                <div class="column">
                    <div class="point"></div>
                    <div class="point"></div>
                </div>
                <div class="column">
                    <div class="point"></div>
                    <div class="point"></div>
                </div>
            `;
            break;
        case 5:
            var face = `
                <div class="column">
                    <div class="point"></div>
                    <div class="point"></div>
                </div>
                <div class="column">
                    <div class="point"></div>
                </div>
                <div class="column">
                    <div class="point"></div>
                    <div class="point"></div>
                </div>
            `;
            break;
        case 6:
            var face = `
                <div class="column">
                    <div class="point"></div>
                    <div class="point"></div>
                    <div class="point"></div>
                </div>
                <div class="column">
                    <div class="point"></div>
                    <div class="point"></div>
                    <div class="point"></div>
                </div>
            `;
            break;
    }
    return face;
}