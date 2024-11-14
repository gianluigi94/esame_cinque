"use strict";
class Contatto {
    constructor(id_contatto, nome, cognome, sesso, codice_fiscale, partita_iva, cittadinanza, citta_nascita, provincia_nascita, data_nascita, blocco_password, id_stato_utente = 1 // di default è attivo
    ) {
        this.id_contatto = id_contatto;
        this.nome = nome;
        this.cognome = cognome;
        this.sesso = sesso;
        this.codice_fiscale = codice_fiscale;
        this.partita_iva = partita_iva;
        this.cittadinanza = cittadinanza;
        this.citta_nascita = citta_nascita;
        this.provincia_nascita = provincia_nascita;
        this.data_nascita = data_nascita;
        this.blocco_password = blocco_password;
        this.id_stato_utente = id_stato_utente;
    }
    /**
     * Valida il codice fiscale dell'utente.
     *
     * - Utilizza un'espressione regolare per verificare se il codice fiscale è conforme al formato italiano.
     * - La regex accetta:
     *   - 6 lettere iniziali,
     *   - 2 cifre,
     *   - 1 lettera,
     *   - 2 cifre,
     *   - 1 lettera,
     *   - 3 cifre,
     *   - 1 lettera finale.
     *
     * @returns {boolean} - `true` se il codice fiscale è valido o vuoto (per contatti non fisici), `false` altrimenti.
     */
    validateCodiceFiscale() {
        const codice = this.codice_fiscale || ""; //anche il campo vuoto va bene per eventuali contatti non fisici
        const regexp = /^[A-Z]{6}[0-9]{2}[A-Z]{1}[0-9]{2}[A-Z]{1}[0-9]{3}[A-Z]{1}$/i;
        return regexp.test(codice); //.test è un metodo integrato di js per la verifica delle espressioni regolari
    }
    /**
     * Valida la partita IVA dell'utente.
     *
     * - Utilizza un'espressione regolare per verificare se la partita IVA è composta esattamente da 11 cifre.
     * - Accetta il campo vuoto per contatti non aziendali.
     *
     * @returns {boolean} - `true` se la partita IVA è valida o vuota, `false` altrimenti.
     */
    validatePartitaIva() {
        const partitaIva = this.partita_iva || "";
        const regexp = /^[0-9]{11}$/;
        return regexp.test(partitaIva);
    }
    /**
     * Calcola l'età basata sulla data di nascita dell'utente.
     *
     * - Se la data di nascita (`data_nascita`) non è definita, restituisce `null`.
     * - Calcola l'età sottraendo l'anno di nascita dall'anno corrente.
     * - Considera i mesi e i giorni per determinare se l'utente ha già compiuto gli anni nell'anno corrente;
     *   se non li ha ancora compiuti, decrementa l'età di uno.
     *
     * @returns {number | null} - L'età calcolata in anni o `null` se la data di nascita non è presente.
     */
    calculateAge() {
        const oggi = new Date();
        if (!this.data_nascita) {
            //controllo se la data di nascita è inserita
            return null;
        }
        //primo calcolo
        let eta = oggi.getFullYear() - this.data_nascita.getFullYear();
        //differenza mese, nel caso tolgo un anno
        const meseDiff = oggi.getMonth() - this.data_nascita.getMonth();
        if (meseDiff < 0 ||
            (meseDiff === 0 && oggi.getDate() < this.data_nascita.getDate())) {
            eta--;
        }
        return eta;
    }
    //Metodo per generare un eventuale saluto
    generateSalutation() {
        return `Bentornato su CodeX, ${this.nome}! Ti auguriamo buona visione`;
    }
    /**
     * Verifica se la password dell'utente è scaduta.
     *
     * - Controlla se la data di scadenza della password (`blocco_password`) è definita.
     *
     * @returns {boolean} - `true` se la password è scaduta, `false` altrimenti.
     */
    isExpiredPassword() {
        if (!this.blocco_password) {
            //controllo che il dato esista
            return false;
        }
        const now = new Date();
        // se la data del momento presente è inferiore alla data di scadenza, significa che la password è ancora valida
        if (now < this.blocco_password) {
            return true;
        }
        else {
            return false;
        }
    }
    //Metodo per facilitare la lettura dello stato utente
    getAccountStatus() {
        if (this.id_stato_utente === 1) {
            return "Attivo";
        }
        else {
            return "Bannato";
        }
    }
}
// Classe base per Film e Serie
class Media {
    constructor(id, titolo, descrizione, durata, regista, attori, anno, id_locandina, id_trailer) {
        this.id = id;
        this.titolo = titolo;
        this.descrizione = descrizione;
        this.durata = durata;
        this.regista = regista;
        this.attori = attori;
        this.anno = anno;
        this.id_locandina = id_locandina;
        this.id_trailer = id_trailer;
    }
    /**
   * Restituisce una stringa formattata con il titolo e l'anno di uscita.
   *
   * - Se l'anno di uscita (`anno`) non è disponibile, visualizza "Anno non disponibile".
   * - La stringa risultante include il titolo e l'anno formattati.
   *
   * @returns {string}
   */
    getTitoloAnno() {
        const annoText = this.anno ? this.anno.toString() : "Anno non disponibile";
        return `Titolo: ${this.titolo} | Anno di uscita: ${annoText}`;
    }
    /**
   * Restituisce una stringa formattata con il nome del regista e la lista degli attori.
   * - Se è presente una lista di attori, li separa e li formatta con virgole.
   *
   * @returns {string}
   */
    getDirectorAndActors() {
        const director = this.regista ? this.regista : "Regista sconosciuto";
        const actors = this.attori
            ? this.attori.split(",").map((a) => a.trim()).join(", ")
            : "Attori sconosciuti";
        return `Regista: ${director} | Attori: ${actors}`;
    }
    /**
   * Restituisce una descrizione abbreviata limitata a 100 caratteri.
   *
   * - Se la descrizione (`descrizione`) supera i 100 caratteri, restituisce i primi 100 caratteri seguiti da "...".
   *
   * @returns {string} - La descrizione abbreviata o completa.
   */
    getDescription() {
        return this.descrizione.length > 100
            ? `${this.descrizione.slice(0, 100)}...`
            : this.descrizione;
    }
    /**
   * Restituisce una lista di percorsi file multimediali associati all'elemento.
   *
   * - Se `id_locandina` è presente, aggiunge il percorso dell'immagine della locandina.
   * - Se `id_trailer` è presente, aggiunge il percorso del file del trailer.
   *
   * @returns {string[]} - Un array di stringhe con i percorsi dei file multimediali o un messaggio di default.
   */
    getMediaFiles() {
        const files = [];
        if (this.id_locandina)
            files.push(`multimedia/locandine/${this.id_locandina}.jpg`);
        if (this.id_trailer)
            files.push(`multimedia/trailer/${this.id_trailer}.mp4`);
        return files.length > 0 ? files : ["Nessun file multimediale disponibile"];
    }
}
// Classe Film che estende Media
class Film extends Media {
    constructor(id_film, titolo, descrizione, durata, id_categoria, regista, attori, anno, id_locandina, id_video_film, id_trailer) {
        super(id_film, titolo, descrizione, durata, regista, attori, anno, id_locandina, id_trailer);
        this.id_film = id_film;
        this.titolo = titolo;
        this.descrizione = descrizione;
        this.durata = durata;
        this.id_categoria = id_categoria;
        this.regista = regista;
        this.attori = attori;
        this.anno = anno;
        this.id_locandina = id_locandina;
        this.id_video_film = id_video_film;
        this.id_trailer = id_trailer;
    }
    // Implementazione del metodo per la descrizione della durata specifica per il film
    getDurationDescription() {
        const hours = Math.floor(this.durata / 60);
        const minutes = this.durata % 60;
        return `${hours}h ${minutes}m`;
    }
}
// Classe Serie che estende Media
class Serie extends Media {
    constructor(id_serie, titolo, descrizione, totale_stagioni, totale_episodi, anno_inizio, id_categoria, regista, attori, anno_fine, id_locandina, id_trailer) {
        super(id_serie, titolo, descrizione, undefined, regista, attori, anno_inizio, id_locandina, id_trailer);
        this.id_serie = id_serie;
        this.titolo = titolo;
        this.descrizione = descrizione;
        this.totale_stagioni = totale_stagioni;
        this.totale_episodi = totale_episodi;
        this.anno_inizio = anno_inizio;
        this.id_categoria = id_categoria;
        this.regista = regista;
        this.attori = attori;
        this.anno_fine = anno_fine;
        this.id_locandina = id_locandina;
        this.id_trailer = id_trailer;
    }
    // Implementazione del metodo per la durata specifica per le serie (numero di stagioni e episodi)
    getDurationDescription() {
        return `La serie "${this.titolo}" ha un totale di ${this.totale_stagioni} stagioni e ${this.totale_episodi} episodi.`;
    }
    // Metodo specifico per controllare se la serie è completa
    isCompleted() {
        return this.anno_fine !== undefined;
    }
}
class Episodio {
    constructor(id_episodio, id_serie, id_stagione, titolo, descrizione, durata, id_video_episodio, anno, numero_stagione, numero_episodio) {
        this.id_episodio = id_episodio;
        this.id_serie = id_serie;
        this.id_stagione = id_stagione;
        this.titolo = titolo;
        this.descrizione = descrizione;
        this.durata = durata;
        this.id_video_episodio = id_video_episodio;
        this.anno = anno;
        this.numero_stagione = numero_stagione;
        this.numero_episodio = numero_episodio;
    }
    /**
   * Restituisce una stringa formattata con informazioni sulla serie, stagione e numero dell'episodio.
   *
   * - Include l'ID della serie (`id_serie`).
   *
   * @returns {string}
   */
    getEpisodeInfo() {
        const serie = `Serie: ${this.id_serie}`;
        const stagione = this.numero_stagione
            ? `Stagione: ${this.numero_stagione}`
            : "Stagione non specificata";
        const episodio = this.numero_episodio
            ? `Episodio: ${this.numero_episodio}`
            : "Episodio non specificato";
        return `${serie}, ${stagione}, ${episodio}`;
    }
    /**
     * Restituisce una lista di percorsi per i file multimediali dell'episodio sotto forma di array.
     *
     * - Se `id_video_episodio` è presente, aggiunge il percorso del video dell'episodio.
     *
     * @returns {string[]}
     */
    getMediaFiles() {
        const files = [];
        if (this.id_video_episodio)
            files.push(`multimedia/video/${this.id_video_episodio}.mp4`);
        return files.length > 0 ? files : ["Nessun file multimediale disponibile"];
    }
    /**
     * Restituisce una descrizione abbreviata dell'episodio, limitata a 100 caratteri.
     *
     * - Se la descrizione (`descrizione`) supera i 100 caratteri, restituisce i primi 100 caratteri seguiti da "...".
     *
     * @returns {string} - La descrizione abbreviata o completa dell'episodio.
     */
    getDescription() {
        return this.descrizione.length > 100
            ? `${this.descrizione.slice(0, 100)}...`
            : this.descrizione;
    }
    /**
     * Restituisce una stringa formattata con il titolo e l'anno di uscita dell'episodio.
     *
     * @returns {string}
     */
    getTitoloAnno() {
        let annoText;
        if (this.anno !== undefined && this.anno !== null) {
            annoText = this.anno.toString();
        }
        else {
            annoText = "Anno non disponibile";
        }
        return `Titolo: ${this.titolo} | Anno di uscita: ${annoText}`;
    }
}
class Categoria {
    constructor(id_categoria, categoria) {
        this.id_categoria = id_categoria;
        this.categoria = categoria;
    }
    /**
     * Restituisce una descrizione formattata per la categoria di un film o di una serie.
     *
     * - Determina se l'oggetto passato è un film (`Film`) o una serie (`Serie`) e personalizza il tipo di descrizione.
     * - Se disponibile, utilizza la categoria (`categoria`)
     * - Recupera l'ID corretto in base al tipo di media .
     *
     * @param {Film | Serie} media - L'oggetto media, che può essere di tipo `Film` o `Serie`.
     * @returns {string} - Una stringa descrittiva con il formato:
     */
    getDescriptionFor(media) {
        // Determina se l'oggetto è un Film o una Serie
        const tipoDescrizione = media instanceof Film ? "Il film" : "La serie";
        // Determina il genere, se disponibile, o usa un valore predefinito
        let genere;
        if (this.categoria) {
            genere = this.categoria;
        }
        else {
            genere = "genere sconosciuto";
        }
        // Determina l'ID a seconda che sia un Film o una Serie
        const idMedia = media instanceof Film ? media.id_film : media.id_serie;
        // Costruisce e restituisce la stringa formattata
        return `${tipoDescrizione} "${media.titolo}" di id: ${idMedia} è di genere ${genere}`;
    }
}
//# sourceMappingURL=types.js.map