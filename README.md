# Oma Osteria Moderna — sito e gestione contenuti

Sito statico responsive con menu romano e prenotazioni via WhatsApp. Il pannello **Pages CMS** modifica i file JSON su GitHub: nessun database, password nel sito o server applicativo richiesto.

## Attivare il pannello

1. Aprire **https://app.pagescms.org/** e accedere con l’account GitHub che amministra `carmann91/folder`.
2. Quando richiesto, installare/autorizzare la GitHub App di Pages CMS, selezionando solo il repository `folder`.
3. Selezionare `carmann91/folder` e il ramo **master**. La configurazione `.pages.yml` mostra **Menu** e **Contatti e homepage**.
4. Modificare i campi e salvare. I salvataggi producono commit nel repository: non occorre modificare codice manualmente.

L’accesso e l’autorizzazione della GitHub App devono essere effettuati dal proprietario. La configurazione è predisposta, ma l’autenticazione del pannello non è stata attivata o verificata con il suo account.

### Cosa puoi modificare

- **Menu**: categorie, ordine, piatti, descrizioni, prezzi numerici in euro e nota dimostrativa. Aggiungi o rimuovi elementi nelle liste.
- **Contatti e homepage**: WhatsApp, messaggio precompilato, indirizzo, orari, link a Google Maps, Instagram e recensioni Google, eventuale menu esterno, titolo e testi introduttivi.
- **Fotografie**: sostituisci le quattro immagini mantenendo l’ordine copertina, cucina, sala e vino. Carica fotografie autorizzate e descrivile nel testo alternativo. La libreria salva i file in `assets/uploads`.

Per WhatsApp inserire il numero internazionale con prefisso: ``. Il click apre un messaggio da completare e inviare: non conferma automaticamente la prenotazione.

## Pubblicare con dominio personalizzato

Su Netlify collegare il repository, ramo `master`, comando di build vuoto e directory di pubblicazione `.`. Attivare la pubblicazione automatica dei commit. I salvataggi dal CMS avvieranno una nuova pubblicazione; il sito si aggiorna al termine del deploy. Poi aggiungere il proprio dominio e seguire le indicazioni DNS dell’hosting. La configurazione Netlify, il dominio e i DNS non sono ancora stati attivati.

### Demo GitHack

Usare **https://raw.githack.com/carmann91/folder/master/index.html** per seguire le modifiche del CMS. Il repository deve essere pubblico. I link a un commit specifico sono versioni fisse e non seguono gli aggiornamenti. La cache del servizio può ritardare la visualizzazione; `cache: no-cache` nel browser non elimina la cache della CDN.

## Sviluppo locale

```sh
python3 -m http.server 8000
```

Aprire il sito tramite il server locale. L’apertura diretta con `file://` non è supportata, perché il sito carica i contenuti JSON attraverso richieste HTTP.

## File

- `.pages.yml`: campi del pannello Pages CMS.
- `data/site.json`: contatti, testi e fotografie.
- `data/menu.json`: menu modificabile.
- `index.html`: struttura e contenuti dimostrativi di riserva.
- `assets/main.js`: caricamento dati, rendering sicuro e WhatsApp.
- `assets/style.css`: grafica desktop e mobile.
- `assets/uploads`: immagini caricate dal pannello.

Le modifiche CMS sono mostrate con JavaScript. Se il caricamento del menu fallisce, il sito segnala il problema e mostra il menu dimostrativo iniziale, non un menu confermato. Se i contatti non si caricano, WhatsApp non viene attivato con un vecchio numero. I testi aggiornati dal CMS non vengono scritti nell’HTML di riserva: anteprime social e crawler senza JavaScript continuano a leggere il contenuto iniziale.

## Contenuti da approvare

I 18 piatti e i prezzi sono dimostrativi. Le immagini esterne Unsplash non raffigurano necessariamente Oma. Indirizzo e orari sono da completare. Sostituire i materiali con quelli reali, verificare i dati e inserire gli eventuali dati legali prima del lancio pubblico. Il sito di riferimento Santini non era accessibile: questa grafica è una proposta originale.

## Maps, Instagram e recensioni

I collegamenti forniti sono configurati in `data/site.json` e modificabili da Pages CMS. La mappa è incorporata nella pagina; Instagram usa un iframe del profilo o dei singoli post. Le anteprime Instagram dipendono dal profilo pubblico, dai permessi di incorporamento e dalle restrizioni del browser. Il box recensioni può mostrare trascrizioni reali inserite dal CMS e apre anche la pagina originale Google. Non importa né aggiorna automaticamente recensioni o valutazioni. Non richiede API key o widget esterni. Il link Google Maps apre la scheda del ristorante; l’indirizzo stradale resta da completare nel CMS.

## Anteprime sulla pagina

- **Mappa**: iframe Google Maps alle coordinate della scheda fornita (41.924737, 12.5250896), senza API key. Il campo CMS `mapEmbedUrl` deve contenere un URL di incorporamento Google Maps, non il normale link alla scheda.
- **Instagram**: profilo incorporato come anteprima iniziale. Per mostrare post specifici, aggiungerne i permalink pubblici nella lista `instagramPosts` del CMS (post o reel). Le foto non sono scaricate o copiate; le anteprime possono essere bloccate da Instagram, dalle impostazioni del profilo o dal browser. Il collegamento diretto resta disponibile.
- **Recensioni**: la lista `reviews` del CMS accetta autore pubblico, testo, stelle intere da 1 a 5 e data facoltativa. La lista contiene le tre recensioni fornite dall’utente: Alpha Chau (estratto Google, 5/5), un recensore TheFork (10/10) e Alessandro (Google, 5/5 confermato dall’utente). Nessuna testimonianza o valutazione è inventata. Le fonti sono collegate e i voti conservano la scala originale. Le date relative incollate non sono state trasformate in date assolute. Non è un feed live di Google.

Maps e Instagram sono risorse esterne caricate dal browser del visitatore. Il caricamento effettivo di tali servizi non è stato verificato nell’ambiente, che ne blocca l’accesso.

Le recensioni sono trascrizioni fornite dall’utente, non verificate tramite API. Dal CMS è possibile modificarne fonte, link originale, voto facoltativo, scala 5/10 e indicazione di estratto.

## Chi siamo — Leo e Alessio

`chi-siamo.html` è collegata alla navigazione principale. Dal CMS, nella sezione dedicata, si modificano testi e foto. I testi sono una proposta editoriale, senza ruoli, biografie o esperienze non forniti. Il post Instagram è incorporato come alternativa iniziale: l’incorporamento non garantisce la selezione della seconda foto del carosello. Per usare esattamente quella foto, caricare il file autorizzato nel campo `photo` di `data/about.json` tramite CMS. Il link al post conserva `img_index=2`. Il caricamento effettivo di Instagram non è verificabile nell’ambiente.

## Proposta grafica scura

`preview-scura.html` e `chi-siamo-scura.html` sono anteprime alternative, con un foglio aggiuntivo `assets/dark-preview.css`. Usano gli stessi dati CMS e mantengono le prenotazioni disattivate. La versione principale chiara rimane in `index.html`. La fascia superiore permette il confronto.

## Anteprima chiara con schizzi graffiti

`preview-graffiti.html` e `chi-siamo-graffiti.html` mantengono il layout chiaro con schizzi neri SVG ai margini, disegnati per questa anteprima. Le decorazioni non ricevono click e si ridimensionano su mobile. I file sono in `assets/graffiti` e lo stile aggiuntivo in `assets/graffiti-preview.css`. La homepage originale non cambia.
