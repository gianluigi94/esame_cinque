/**
 * Inizializza e configura la libreria Select2 per i campi di selezione (`#sesso`, `#nazione`, `#citta`).
 * 
 * - Imposta un placeholder specifico per ogni campo e abilita la `x` per la deselezione.
 * - Configura il comportamento di focus e blur sugli input per mostrare o nascondere spiegazioni.
 * 
 * @returns {void} - Non restituisce alcun valore.
 */


// ho installato le dipendenze per jQuerry, visto che usato con la libreria select2
$(function () {

    // Configurazione placeholder per ciascun campo select
    const selectConfig: { [key: string]: string } = {
      sesso: "Seleziona il sesso",
      nazione: "Nazione",
      citta: "Città",
    };
  
    // Funzione per configurare Select2 con opzioni comuni
    function initializeSelect2(selector: string, placeholder: string): void {
      $(selector)
        .select2({
          placeholder: placeholder, // Imposta il placeholder
          allowClear: true, // crea la x per deselezionare
          minimumResultsForSearch: Infinity, // disattiva campo ricerca
          width: "65%",
        })
        .on("select2:select", function () {
          $(".select2-selection__rendered").css("color", "white"); // cambia il colore in bianco una volta che viene scelta una option
        })
        .on("select2:unselect", function () {
          $(".select2-selection__rendered").css("color", "rgb(136, 136, 136)"); // colore deselezione
        });
    }
  
    // Inizializza Select2 con il placeholder specifico per ogni campo
    // $.each itera su array o oggetti.
    $.each(selectConfig, function (id: string, placeholder: string) {
      initializeSelect2("#" + id, placeholder); //crea il selettore per avere id e viene attribuito il placeholder
    });
  
    // Imposto il colore di default dell'opzione selezionata
    $(".select2-selection__rendered").css("color", "white");
  
    // Mostra i campi solo dopo l'inizializzazione
    $("#sesso, #nazione, #citta").css("visibility", "visible");
  
    // Gestione focus e blur sugli input normali (faccio comparire spiegazione)
    $("input")
      .on("focus", function () {
        // ascoltatore evento di input
        $(this).closest(".d-flex").find("p").css("opacity", "1"); //cerca in d-flex il paragrafo e lo fa comparire
      })
      .on("blur", function () {
        $(this).closest(".d-flex").find("p").css("opacity", "0"); //cerca in d-flex il paragrafo e lo fa scomparire
      });
  
    // Gestione apertura e chiusura di Select2 per le select
    $("#sesso, #nazione, #citta")
      .on("select2:open", function () {
        $(this).closest(".d-flex").find("p").css("opacity", "1");
      })
      .on("select2:close", function () {
        $(this).closest(".d-flex").find("p").css("opacity", "0");
      });
  });


  //città
//città
//città


  /**
   * Funzione eseguita al caricamento del DOM, che gestisce il campo di selezione della città e attiva o disattiva l'autocompletamento
   * in base alla nazione selezionata. 
   * 
   * - Carica i dati delle città italiane da un file CSV, popolando la select con queste informazioni.
   * - Cambia il campo della città da select a input di testo se viene scelta una nazione diversa dall'Italia.
   * - Rende il campo della provincia visibile solo per l'Italia.
   * 
   * Funzioni interne:
   * - `loadCityData`: Carica la lista delle città italiane da un CSV.
   * - `populateCitySelect`: Popola la select delle città italiane.
   * - `enableAutocomplete`: Trasforma la select della città in un campo di input per l'autocompletamento.
   * - `enableSelect`: Ripristina la select delle città italiane.
   * 
   * @returns {void} - Non restituisce alcun valore.
   */
  document.addEventListener("DOMContentLoaded", function () {
    let cittaList: string[] = []; // Variabile per memorizzare la lista delle città italiane
    let cittaSelect = document.getElementById("citta") as
      | HTMLSelectElement
      | HTMLInputElement;
      //HTMLInputElement e HTMLSelectElement in ts offrono accessi a metodi specifici per input e select
    const volaCitta = document.getElementById("vola-citta") as HTMLElement;
    const nazioneSelect = document.getElementById("nazione") as HTMLSelectElement;
  
    /**
   * Carica i dati delle città italiane da un file CSV e li memorizza in `cittaList`.
   * 
   * - Effettua una richiesta fetch al file CSV.
   * - Parsa i dati del CSV e li ordina alfabeticamente.
   * - In caso di errore, imposta "Roma" come città predefinita.
   * 
   * @returns {Promise<void>} - Una Promise che si risolve al termine del caricamento dei dati.
   */
    async function loadCityData() {
        try {
          const response = await fetch("/resource/comuni_italiani.csv");
          const csvData = await response.text();
          const rows = csvData.split("\n");
          cittaList = rows
            .slice(1)
            .map((row) => row.split(";")[1]?.trim())
            .filter(Boolean) as string[];
          cittaList.sort();
        } catch (error) {
          console.error("Errore durante il caricamento delle città:", error);
          // Aggiunge "Roma" come opzione predefinita in caso di errore
          cittaList = ["Roma"];
        }
      }
      
    /**
     * Popola la select delle città con la lista `cittaList`.
     * 
     * - Svuota le opzioni attuali della select.
     * - Aggiunge "Città" come opzione predefinita.
     * - Aggiunge ogni città in `cittaList` come opzione selezionabile.
     * - Inizializza la libreria Select2 con un placeholder.
     * 
     * @returns {void} - Non restituisce alcun valore.
     */
      function populateCitySelect() {
        const cittaSelect = document.getElementById("citta") as HTMLSelectElement;
        cittaSelect.innerHTML = ""; // Svuota le opzioni attuali
      
        const defaultOption = new Option("Città", "");
        cittaSelect.append(defaultOption); // Opzione predefinita
      
        if (cittaList.length === 0) {
          // Aggiunge "Roma" se non ci sono città nel CSV o in caso di errore
          cittaList = ["Roma"];
        }
      
        cittaList.forEach((citta) => cittaSelect.append(new Option(citta, citta)));
      
        $(cittaSelect).select2({
          placeholder: "Città",
          allowClear: true,
          minimumResultsForSearch: Infinity,
          width: "65%",
        });
      }
      
      // Carica i dati delle città italiane all'inizio
      loadCityData().then(populateCitySelect);
  
  /**
   * Trasforma la select della città in un campo di input di testo per l'autocompletamento.
   * 
   * - Distrugge Select2 se attivo.
   * - Sostituisce la select con un input text configurato per l'autocompletamento.
   * - Aggiorna `cittaSelect` al nuovo input creato.
   * 
   * @returns {void} - Non restituisce alcun valore.
   */
    function enableAutocomplete() {
      // Controlla se cittaSelect è ancora un elemento select
      if (cittaSelect.tagName.toLowerCase() === "select") {
        $(cittaSelect).select2("destroy"); // Rimuove Select2 se presente
        const input = document.createElement("input");
        input.type = "text";
        input.id = "citta";
        input.name = "citta";
        input.required = true;
        input.placeholder = "Inserisci la tua città";
        input.classList.add("form-control");
        const dFlexElement = volaCitta.querySelector(".d-flex");
        if (dFlexElement) {
          dFlexElement.replaceChild(input, cittaSelect);
          cittaSelect = input; // Aggiorna il riferimento a cittaSelect
        }
      }
    }
  
  /**
   * Ripristina il campo della città da input a select per le città italiane.
   * 
   * - Sostituisce l'input con una select.
   * - Ripopola la select con le città italiane utilizzando `populateCitySelect`.
   * - Aggiorna `cittaSelect` al nuovo select creato.
   * 
   * @returns {void} - Non restituisce alcun valore.
   */
    function enableSelect() {
      // Controlla se cittaSelect è già un input
      if (cittaSelect.tagName.toLowerCase() === "input") {
        const select = document.createElement("select");
        select.id = "citta";
        select.name = "citta";
        select.required = true;
        select.classList.add("form-control");
        const dFlexElement = volaCitta.querySelector(".d-flex");
        if (dFlexElement) {
          dFlexElement.replaceChild(select, cittaSelect);
          cittaSelect = select; // Aggiorna il riferimento a cittaSelect
          populateCitySelect(); // Ripopola la select con le città italiane
        }
      }
    }
  
    /**
     * Listener per il cambio di nazione. 
     * 
     * - Se la nazione selezionata è "Italia" (valore 82), mostra la select per la città e il campo provincia.
     * - Altrimenti, trasforma la select della città in input di autocompletamento e nasconde il campo provincia.
     * 
     * @returns {void} - Non restituisce alcun valore.
     */
    $("#nazione").on("change", function () {
      if ((this as HTMLSelectElement).value === "82") {
        // 82 è il valore di "Italia"
        enableSelect();
        $("#provincia-container").show();
        $("#provincia").attr("required", "true");
      } else {
        enableAutocomplete();
        $("#provincia-container").hide();
        $("#provincia").attr("required", "false");
      }
    });
  });

  

  
  /**
   * Popola la select delle nazioni caricando i dati da un file JSON.
   * 
   * - Effettua una richiesta al file JSON `/resource/nazioni.json` per ottenere la lista delle nazioni.
   * - Aggiunge ogni nazione come opzione nella select con `id="nazione"`.
   * 
   * @returns {Promise<void>} - Una Promise che si risolve quando tutte le opzioni sono state aggiunte alla select.
   
   */
  async function popolaNazioni(): Promise<void> {
    // Carica il JSON
    const response = await fetch("/resource/nazioni.json");
    const jsonData: { id?: number; paese: string }[] = await response.json();
  
    const selectElement = document.getElementById("nazione") as HTMLSelectElement;
  
    // Aggiungo ogni nazione come opzione
    jsonData.forEach((item, index) => {
      const option = document.createElement("option");
      option.value = item.id ? item.id.toString() : index.toString();
      option.textContent = item.paese;
      selectElement.appendChild(option);
    });
  }
  
  // Richiamo la funzione quando la pagina è pronta
  document.addEventListener("DOMContentLoaded", popolaNazioni);

  /**
   * Gestisce il cambiamento di colore del campo "data di nascita" in base all'inserimento dell'utente.
   * 
   * - Al caricamento del DOM, seleziona l'input con `id="dataNascita"`.
   * - Cambia il colore del testo a bianco se l'utente ha inserito una data.
   * - Ripristina il colore grigio se il campo è vuoto (placeholder visibile).
   * 
   * @returns {void} - Non restituisce alcun valore.
   */
  document.addEventListener("DOMContentLoaded", function () {
    const dataNascita = document.getElementById(
      "dataNascita"
    ) as HTMLInputElement;
  
    // Cambia colore quando l'utente inserisce una data
    dataNascita.addEventListener("input", function () {
      if (dataNascita.value) {
        dataNascita.style.color = "#ffffff"; // Bianco per la data inserita
      } else {
        dataNascita.style.color = "rgb(136, 136, 136)"; // Grigio per il placeholder
      }
    });
  });


  /**
 * Inizializza la gestione della visibilità della password per i campi "Password" e "Conferma Password" con icone personalizzate(caricamento veloce).
 * 
 * - Al caricamento del DOM, aggiunge un listener `click` alle icone per alternare tra testo e password.
 * - Utilizza un'icona SVG personalizzata come immagine in linea per ridurre i tempi di caricamento.
 * 
 * Funzioni interne:
 * - `toggleVisibility`: Alterna il tipo di input tra `password` e `text`, aggiornando l'icona e l'attributo `alt` per indicare lo stato.
 * 
 * @returns {void} - Non restituisce alcun valore.
 */
  document.addEventListener("DOMContentLoaded", function () {
    function toggleVisibility(
      inputField: HTMLInputElement,
      toggleIcon: HTMLImageElement
    ): void {
      if (inputField.type === "password") {
        inputField.type = "text";
        toggleIcon.src =
          'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"%3E%3Ccircle cx="12" cy="12" r="3"/%3E%3Cpath d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/%3E%3C/svg%3E';
        toggleIcon.alt = "Nascondi Password";
      } else {
        inputField.type = "password";
        toggleIcon.src =
          'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"%3E%3Ccircle cx="12" cy="12" r="3"/%3E%3Cpath d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/%3E%3Cline x1="1" y1="1" x2="23" y2="23" stroke="white" stroke-width="2"/%3E%3C/svg%3E';
        toggleIcon.alt = "Mostra Password";
      }
    }
  
    // Gestione del toggle per il campo "Password"
    const passwordInput = document.querySelector("#password") as HTMLInputElement;
    const togglePassword = document.querySelector(
      "#togglePassword"
    ) as HTMLImageElement;
  
    togglePassword.addEventListener("click", function () {
      // il cambio avviene al click
      toggleVisibility(passwordInput, togglePassword);
    });
  
    // Gestione del toggle per il campo "Conferma Password"
    const confirmPasswordInput = document.querySelector(
      "#confirmPassword"
    ) as HTMLInputElement;
    const toggleConfirmPassword = document.querySelector(
      "#toggleConfirmPassword"
    ) as HTMLImageElement;
  
    toggleConfirmPassword.addEventListener("click", function () {
      toggleVisibility(confirmPasswordInput, toggleConfirmPassword);
    });
  });

  /**
   * Mostra una modale con un'animazione di scala dopo un ritardo di 1.5 secondi al caricamento della finestra.
   * 
   * - Al caricamento completo della finestra (`load`), attiva un timer.
   * - Seleziona l'elemento con `id="little_modal"`.
   * applica una trasformazione `scale(1)` per attivare l'animazione.
   * 
   * @returns {void} - Non restituisce alcun valore.
   */
  window.addEventListener("load", function () {
    setTimeout(function () {
      const littleModal = document.getElementById("little_modal");
      if (littleModal) {
        (littleModal.style as CSSStyleDeclaration).transform = "scale(1)"; // Applico il css per l'animazione
      }
    }, 1500);
  });

// progressbar
// progressbar
// progressbar
let commonWords: string[] = []; // array da popolare con le parole penalizzanti

// Carica il file JSON con le parole
fetch("resource/common_words.json")
  .then((response) => response.json())
  .then((data) => {
    commonWords = data.commonWords.map((word: string) => word.toLowerCase()); // Converte tutto in minuscolo
  })
  .catch((error) =>
    console.error("Errore nel caricamento delle parole comuni:", error)
  );


/**
 * Gestisce la barra di progresso per la robustezza della password.
 * 
 * - Al caricamento del DOM, seleziona il campo password e la barra di progresso.
 * - Al cambiamento del valore della password (`input`), calcola l'entropia, aggiorna la larghezza e il colore della barra
 *   e visualizza un testo indicante la robustezza della password.
 * 
 * Funzioni interne:
 * - `calculateEntropy`: Calcola l'entropia della password per stimarne la complessità.
 * - `getStrengthText`: Restituisce un testo descrittivo della robustezza della password.
 * - `getGradientColor`: Genera un colore per la barra di progresso in base alla percentuale di entropia.
 * 
 * @returns {void} - Non restituisce alcun valore.
 */
document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const progressBar = document.getElementById("passwordStrengthBar") as HTMLDivElement;

  passwordInput.addEventListener("input", function () {
    // input è un evento che si attiva ogni volta che modifico il campo input
    const entropy = calculateEntropy(passwordInput.value); // funzione per calcolare la complessità della password
    const entropyPercentage = Math.min((entropy / 80) * 100, 100); // divide il punteggio in 80 e lo converte in percentuale
    progressBar.style.width = `${entropyPercentage}%`; // aumento visivo della barra
    progressBar.style.backgroundColor = getGradientColor(entropyPercentage); // cambia colore al progredire della barra
    progressBar.textContent = getStrengthText(entropyPercentage); // Mostra il livello di robustezza
    progressBar.style.color = "black";
    progressBar.style.fontWeight = "600";
  });

  /**
 * Calcola l'entropia della password in base alla complessità dei caratteri e penalizzazioni.
 * 
 * - Assegna un valore specifico a lettere maiuscole/minuscole, numeri e simboli.
 * - Penalizza ripetizioni di caratteri e parole comuni.
 * 
 * @param {string} password - La password inserita dall'utente.
 * @returns {number} - L'entropia calcolata per la password.
 */
  function calculateEntropy(password: string): number {
    let symbolsCount = 0;
    if (/[a-z]/.test(password)) symbolsCount += 19;
    if (/[A-Z]/.test(password)) symbolsCount += 21;
    if (/\d/.test(password)) symbolsCount += 22;
    if (/[^A-Za-z\d\s]/.test(password)) symbolsCount += 32;
    // entropy trova il logaritmo che mi serve
    let entropy = password.length * Math.log2(symbolsCount || 1); // 1 è per calcolare il logaritmo di default altrimenti si usa il valore trovato

    // Penalizzazione per valori ripetuti più di tre volte di fila
    if (/(.)\1{2,}/.test(password)) entropy -= 15;

    // Penalizzazione per parole comuni
    const lowerCasePassword = password.toLowerCase();
    for (const word of commonWords) {
      if (lowerCasePassword.includes(word)) {
        entropy -= 20;
      }
    }

    return entropy;
  }

  /**
   * Restituisce un testo descrittivo per indicare il livello di robustezza della password.
   * 
   * - Assegna descrizioni in base alla percentuale di entropia.
   * 
   * @param {number} percentage - Percentuale di entropia della password.
   * @returns {string} - Descrizione del livello di robustezza.
   */
  function getStrengthText(percentage: number): string {
    if (percentage >= 75) {
      return "Forte";
    } else if (percentage >= 50) {
      return "Discreta";
    } else if (percentage >= 25) {
      return "Moderata";
    } else {
      return "Debole";
    }
  }

  /**
   * Genera un colore gradiente per la barra di robustezza della password.
   * 
   * - Passa dal rosso al verde in base alla percentuale di entropia.
   * 
   * @param {number} percentage - Percentuale di entropia della password.
   * @returns {string} - Colore in formato `rgb`.
   */

  function getGradientColor(percentage: number): string {
    if (percentage < 50) {
      let green = Math.round((percentage / 50) * 255);
      return `rgb(255, ${green}, 0)`;
    } else {
      let red = Math.round((1 - (percentage - 50) / 50) * 255);
      return `rgb(${red}, 180, 0)`;
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const progressContainer = document.querySelector(".progress.mt-1.mb-3") as HTMLDivElement;

  // Rimuove la classe 'oscurato' quando il campo password è selezionato
  passwordInput.addEventListener("focus", function () {
    progressContainer.classList.remove("oscurato");
  });

  // Aggiunge di nuovo la classe 'oscurato' quando il campo password perde il focus
  passwordInput.addEventListener("blur", function () {
    progressContainer.classList.add("oscurato");
  });
});
