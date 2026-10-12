# Oma Osteria Moderna — demo statica

Landing page responsive in italiano, pronta per GitHub e raw.githack.com. HTML, CSS e JavaScript: nessuna installazione, build, API, cookie di tracciamento o modulo di prenotazione.

## Anteprima locale

Dalla cartella del progetto:

```sh
python3 -m http.server 8000
```

Aprire la pagina nel browser attraverso il server locale. È possibile anche aprire direttamente `index.html`.

## Pubblicazione su GitHack

1. Caricare `index.html`, la cartella `assets` e questo README nella radice del repository `carmann91/folder`, mantenendo la struttura.
2. Su GitHub aprire `index.html` e copiare il suo URL, ad esempio `https://github.com/carmann91/folder/blob/master/index.html` (usare il nome del ramo realmente creato).
3. Incollare l’URL su **https://raw.githack.com/** e utilizzare il collegamento generato per la demo.
4. Per una demo stabile, usare l’URL di un commit specifico al posto del nome del ramo. I collegamenti CDN possono mantenere una versione precedente in cache.

Il ramo `master` inizialmente non esisteva sul repository remoto. La creazione dei file non li pubblica automaticamente: è necessario caricarli o effettuare commit e push su GitHub.

## Dati del ristorante

Modificare solo `assets/config.js` per impostare:

- `whatsappNumber`: configurato a `393890849395`, assumendo il prefisso italiano +39 per il numero fornito 3890849395.
- `bookingMessage`: testo precompilato, con data, ora, persone e nome da completare direttamente su WhatsApp.
- `address` e `hours`: indirizzo e orari verificati, attualmente segnaposto.
- `mapUrl`, `instagramUrl`, `menuUrl`: URL HTTPS opzionali. I collegamenti non configurati sono nascosti; senza un menu, il pulsante invita a chiederlo su WhatsApp.

Il click apre WhatsApp con il messaggio precompilato. **Non invia automaticamente il messaggio e non conferma una prenotazione**: il cliente lo completa e lo invia, e il ristorante conferma la disponibilità.

## Immagini e contenuti

Le quattro fotografie sono dimostrative, caricate da Unsplash; non raffigurano necessariamente Oma. Richiedono connessione e accesso a `images.unsplash.com`. Per una demo autosufficiente, sostituirle con fotografie autorizzate del ristorante, salvate in `assets`, e aggiornare i percorsi `src` e i testi alternativi in `index.html`.

I testi sono una proposta editoriale da approvare. Nessun indirizzo, orario, menu, premio o altro dato commerciale è stato inventato. Il sito santiniroma.it non era raggiungibile dall’ambiente: questa è una proposta originale, non una riproduzione verificata di quel sito. Prima dell’uso pubblico sostituire i dati mancanti e la dicitura di demo, verificare i diritti sui materiali e inserire gli eventuali dati legali dell’attività.

## Struttura

- `index.html`: contenuti e sezioni.
- `assets/style.css`: layout desktop/mobile, colori e tipografia.
- `assets/config.js`: dati configurabili e messaggio WhatsApp.
- `assets/main.js`: link WhatsApp, menu mobile e dati dei contatti.
- `assets/favicon.svg`: icona Oma.

## Verifica manuale

Controllare navigazione desktop/mobile, menu mobile (anche con Escape), link WhatsApp e testo precompilato, e assenza di scorrimento orizzontale. Indirizzo e orari restano esplicitamente in aggiornamento finché non configurati.
