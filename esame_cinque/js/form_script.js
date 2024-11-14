"use strict";
// Classe per rappresentare i dati di registrazione usa nel costruttore i dati raccolti nell'interfaccia IUserData
class UserRegistrazione {
    constructor(data) {
        this.data = data;
        Object.assign(this, data); //Object.assign permette di copiare le proprietà di IUserData
    }
    //metodo per formattare i dati, questa scrittura alleggerisce il codice. Questo metodo lo userò per inviare i dati al server e lo uso ora per scrivere il messaggio di sucesso
    /**
   * Converte l'oggetto corrente in un formato adatto per l'invio al server.
   *
   * - Restituisce una copia dell'oggetto in cui ogni proprietà è di tipo `Record<string, string>`.
   * - La copia è una "shallow copy" (copia superficiale) dell'istanza corrente.
   *
   *
   * @returns {Record<string, string>} - L'oggetto formattato per il server, con chiavi e valori di tipo stringa.
   */
    toServerFormat() {
        return Object.assign({}, this); //...:crea una copia delle proprietà dell'oggetto
    }
}
//funzione per dichiarare i requisiti di validazione di ogni elemento al caricamento della pagina
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#bigForm"); //HTMLFormElement fa riconoscere a ts che si tratta di un form
    // Configurazione dei campi con i relativi limiti, regex e messaggi
    const IfieldsConfig = {
        nome: {
            requiredMessage: ".required-error-nome",
            lengthMessage: ".length-error-nome",
            characterMessage: ".character-error-nome",
            minLength: 3,
            maxLength: 25,
            regex: /^[a-zA-Z\s]+$/,
        },
        cognome: {
            requiredMessage: ".required-error-cognome",
            lengthMessage: ".length-error-cognome",
            characterMessage: ".character-error-cognome",
            minLength: 3,
            maxLength: 35,
            regex: /^[a-zA-Z\s]+$/,
        },
        provincia: {
            requiredMessage: ".required-error-provincia",
            lengthMessage: ".length-error-provincia",
            characterMessage: ".character-error-provincia",
            minLength: 2,
            maxLength: 15,
            regex: /^[a-zA-Z\s]+$/,
        },
        cittadinanza: {
            requiredMessage: ".required-error-cittadinanza",
            lengthMessage: ".length-error-cittadinanza",
            characterMessage: ".character-error-cittadinanza",
            minLength: 5,
            maxLength: 25,
            regex: /^[a-zA-Z\s]+$/,
        },
        codiceFiscale: {
            requiredMessage: ".required-error-codiceFiscale",
            characterMessage: ".incorrect-error-codiceFiscale",
            regex: /^[A-Z]{6}[0-9]{2}[A-Z]{1}[0-9]{2}[A-Z]{1}[0-9]{3}[A-Z]{1}$/i,
        },
        password: {
            requiredMessage: ".required-error-password",
            lengthMessage: ".length-error-password",
            characterMessage: ".character-error-password",
            minLength: 8,
            maxLength: 32,
            regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>?/\\|~]).+$/,
        },
        sesso: {
            requiredMessage: ".sesso-required-error",
        },
        citta: {
            requiredMessage: ".citta-required-error",
        },
        nazione: {
            requiredMessage: ".nazione-required-error",
        },
        dataNascita: {
            requiredMessage: ".required-error-dataNascita",
            invalidDateMessage: ".invalid-date-error",
            minAge: 14,
            maxAge: 100,
        },
        confirmPassword: {
            requiredMessage: ".required-error-confirmPassword",
            mismatchMessage: ".password-mismatch-error",
        },
    };
    /**
   * Calcola l'età basata su una data di nascita.
   *
   * - Sottrae l'anno di nascita dall'anno corrente per ottenere l'età.
   * - Considera i mesi e i giorni per determinare se l'utente ha già compiuto gli anni
   *   nell'anno corrente, altrimenti decrementa l'età di uno.
   *
   * @param {string} birthDate - La data di nascita in formato stringa.
   * @returns {number} - L'età calcolata in anni.
   */
    function calculateAge(birthDate) {
        const today = new Date(); // tempo presente
        const birth = new Date(birthDate); //dato passato dall'utente
        let age = today.getFullYear() - birth.getFullYear(); // calcolo età
        const monthDiff = today.getMonth() - birth.getMonth(); //calcolo differenza mese nascita e attuale e scopro se gli anni sono stati compiuti nel mese in cui ci troviamo, nel caso diminuisco di uno l'età
        if (monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }
    /**
     * Valida la data di nascita inserita in un campo input.
    *
    * - Nasconde eventuali messaggi di errore all'inizio.
    * - Mostra un messaggio di errore se il campo è vuoto o se l'età è fuori dai limiti specificati.
    * - Imposta `is-invalid` sul campo in caso di errore.
    *
    * @param {HTMLInputElement} field - Il campo input che contiene la data di nascita.
    * @param {IFieldConfig} config - La configurazione del campo, che include messaggi di errore e limiti di età.
    * @returns {boolean} - `true` se la data è valida, `false` altrimenti.
    */
    function validateDate(field, config) {
        var _a, _b;
        const requiredMessage = document.querySelector(config.requiredMessage);
        const invalidDateMessage = document.querySelector(config.invalidDateMessage);
        requiredMessage === null || requiredMessage === void 0 ? void 0 : requiredMessage.classList.add("oscurato");
        invalidDateMessage === null || invalidDateMessage === void 0 ? void 0 : invalidDateMessage.classList.add("oscurato");
        field.classList.remove("is-invalid");
        if (field.value === "") {
            requiredMessage === null || requiredMessage === void 0 ? void 0 : requiredMessage.classList.remove("oscurato");
            return false;
        }
        const age = calculateAge(field.value);
        if (age < ((_a = config.minAge) !== null && _a !== void 0 ? _a : 0) || age > ((_b = config.maxAge) !== null && _b !== void 0 ? _b : 0)) {
            invalidDateMessage === null || invalidDateMessage === void 0 ? void 0 : invalidDateMessage.classList.remove("oscurato");
            return false;
        }
        return true;
    }
    /**
     * Valida un campo di un form in base alla configurazione specifica, mostrando messaggi di errore se necessario.
     *
     * - Ignora la validazione se il campo non è visibile.
     * - Gestisce la validazione specifica per "dataNascita" e "confirmPassword".
     * - Controlla la presenza di valori richiesti, lunghezza minima e massima, e validazione tramite regex.
     *
     * @param {string} fieldId - L'ID del campo da validare.
     * @param {boolean} [isSubmit=false] - Indica se la validazione viene eseguita al submit, per mostrare i messaggi di errore.
     * @returns {boolean} - `true` se il campo è valido, `false` altrimenti.
     */
    function validateField(fieldId, isSubmit = false) {
        //isSubmit è impostata su false, così da non comparire in maniera ossessiva messaggi di errore che darebbero fastidio all'utente
        let field = document.getElementById(fieldId);
        //HTMLInputElement e HTMLSelectElement in ts offrono accessi a metodi specifici per input e select
        const config = IfieldsConfig[fieldId];
        let isValid = true;
        // Verifica se il campo è visibile. Se non lo è, salta la validazione.
        if (!$(field).closest(".px-1, .px-sm-3").is(":visible")) {
            //:visible in jQuerry controlla che il campo è visibile, in questo progetto ho usato diverso jQuerry(spesso insieme a selct2, quindi ho installato le dipendenze nel progetto)
            return true;
        }
        // Aggiorna il riferimento al campo citta se necessario
        if (fieldId === "citta") {
            field = document.querySelector("#citta"); // Ottiene l'elemento corrente, sia esso input o select
        }
        // Controllo specifico per dataNascita
        if (fieldId === "dataNascita") {
            isValid = validateDate(field, config);
            return isValid;
        }
        // Validazione per input testuali e select
        if ((field.tagName === "INPUT" &&
            field.type !== "date") ||
            field.tagName === "SELECT") {
            const requiredMessage = config.requiredMessage
                ? document.querySelector(config.requiredMessage)
                : null;
            //modifiche stile
            requiredMessage && requiredMessage.classList.add("oscurato");
            field.classList.remove("is-invalid");
            //se vuoto cambio stile
            if (isSubmit && field.value.trim() === "") {
                requiredMessage && requiredMessage.classList.remove("oscurato");
                field.classList.add("is-invalid");
                isValid = false;
            }
        }
        // Verifica minLength per non essere troppo corto
        if (isValid &&
            config.lengthMessage &&
            ((config.minLength &&
                field.value.length < config.minLength &&
                field.value.trim() !== "") ||
                (config.maxLength &&
                    field.value.length > config.maxLength &&
                    field.value.trim() !== ""))) {
            const lengthMessage = document.querySelector(config.lengthMessage);
            if (lengthMessage) {
                lengthMessage.classList.remove("oscurato");
                lengthMessage.style.display = "block"; // Mostra il messaggio di errore
                // HTMLElement è il tipo base per tutti gli elementi HTML in TypeScript.
            }
            field.classList.add("is-invalid");
            isValid = false;
        }
        else {
            const lengthMessage = config.lengthMessage
                ? document.querySelector(config.lengthMessage)
                : null;
            if (lengthMessage) {
                lengthMessage.classList.add("oscurato");
                lengthMessage.style.display = "none"; // Nasconde il messaggio di errore
                // HTMLElement è il tipo base per tutti gli elementi HTML in TypeScript.
            }
        }
        // Verifica regex
        if (config.regex &&
            !config.regex.test(field.value) &&
            field.value.trim() !== "") {
            const characterMessage = config.characterMessage
                ? document.querySelector(config.characterMessage)
                : null;
            if (characterMessage) {
                characterMessage.classList.remove("oscurato");
                characterMessage.style.display = "block"; // Mostra il messaggio di errore
            }
            field.classList.add("is-invalid");
            isValid = false;
        }
        else {
            const characterMessage = config.characterMessage
                ? document.querySelector(config.characterMessage)
                : null;
            if (characterMessage) {
                characterMessage.classList.add("oscurato");
                characterMessage.style.display = "none"; // Nasconde il messaggio di errore
            }
        }
        // Validazione specifica per confirmPassword
        if (fieldId === "confirmPassword") {
            const passwordValue = document.getElementById("password").value;
            const confirmPasswordValue = field.value;
            const mismatchMessage = config.mismatchMessage
                ? document.querySelector(config.mismatchMessage)
                : null;
            const requiredMessage = document.querySelector(".required-error-confirmPassword");
            // Nasconde messaggi di errore precedenti
            mismatchMessage && mismatchMessage.classList.add("oscurato");
            requiredMessage && requiredMessage.classList.add("oscurato");
            // Verifica se il campo è vuoto
            if (isSubmit && confirmPasswordValue.trim() === "") {
                requiredMessage && requiredMessage.classList.remove("oscurato");
                field.classList.add("is-invalid");
                isValid = false;
            }
            else if (confirmPasswordValue !== passwordValue) {
                // Verifica se le password coincidono
                mismatchMessage && mismatchMessage.classList.remove("oscurato");
                field.classList.add("is-invalid");
                isValid = false;
            }
            else {
                // Tutto ok
                mismatchMessage && mismatchMessage.classList.add("oscurato");
                requiredMessage && requiredMessage.classList.add("oscurato");
                field.classList.remove("is-invalid");
            }
        }
        return isValid;
    }
    const dataNascitaInput = document.getElementById("dataNascita");
    dataNascitaInput.addEventListener("input", function () {
        validateField("dataNascita");
    });
    // Evento di input per ciascun campo configurato
    Object.keys(IfieldsConfig).forEach((fieldId) => {
        const fieldInput = document.getElementById(fieldId);
        if (fieldInput && fieldInput.tagName === "INPUT") {
            //controlla che sia veramente input l'elemento trovato
            fieldInput.addEventListener("input", function () {
                validateField(fieldId, false); // a ogni modifica si controlla che il campo sia valido
            });
        }
    });
    /**
   * Listener per la sottomissione del form che valida tutti i campi, raccoglie i dati e visualizza un messaggio di successo.
   *
   * - Previene l'invio del form per gestire manualmente la validazione e il feedback all'utente.
   * - Valida ogni campo del form utilizzando `validateField`.
   * - Se tutti i campi sono validi:
   *   - Raccoglie i dati dell'utente in un oggetto `IUserData`.
   *   - Crea un'istanza di `UserRegistrazione` con i dati raccolti.
   *   - Formatta la data di nascita e popola un modale di riepilogo con le informazioni dell'utente.
   *   - Mostra un modale di successo.
   * - Se un campo non è valido:
   *   - Scorre al primo campo non valido e lo mette a fuoco.
   *
   * @param {Event} event - L'evento di sottomissione del form.
   * @returns {void} - Non restituisce alcun valore.
   */
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Previene il comportamento predefinito del form
        let isFormValid = true;
        let firstInvalidField = null;
        // verifica della validazione
        Object.keys(IfieldsConfig).forEach((fieldId) => {
            const isValid = validateField(fieldId, true);
            if (!isValid && !firstInvalidField) {
                // firstInvalidField è utile per 'spostarsi sui campi da validare'
                firstInvalidField = document.getElementById(fieldId);
            }
            if (!isValid) {
                isFormValid = false;
            }
        });
        if (isFormValid) {
            // Raccoglie i dati dell'utente per messaggio di successo
            const nome = document.getElementById("nome").value;
            const cognome = document.getElementById("cognome")
                .value;
            const sessoSelect = document.getElementById("sesso");
            const sesso = sessoSelect.options[sessoSelect.selectedIndex].text;
            const dataNascita = document.getElementById("dataNascita").value;
            const nazioneSelect = document.getElementById("nazione");
            const nazione = nazioneSelect.options[nazioneSelect.selectedIndex].text;
            let citta;
            const cittaElement = document.getElementById("citta");
            if (cittaElement.tagName.toLowerCase() === "select") {
                const selectElement = cittaElement;
                citta = selectElement.options[selectElement.selectedIndex].text;
            }
            else {
                citta = cittaElement.value;
            }
            const provincia = document.getElementById("provincia").value;
            const codiceFiscale = document.getElementById("codiceFiscale").value;
            const cittadinanza = document.getElementById("cittadinanza").value;
            const email = window.userEmail;
            const password = document.getElementById("password")
                .value;
            // Creazione dell'oggetto `IuserData` con tutti i campi
            const IuserData = {
                nome,
                cognome,
                sesso,
                dataNascita,
                nazione,
                citta,
                provincia,
                codiceFiscale,
                cittadinanza,
                email,
                password,
            };
            // Passa l'oggetto `IuserData` al costruttore
            const userRegistration = new UserRegistrazione(IuserData);
            // Formatta la data di nascita
            const formattedDate = formatDate(IuserData.dataNascita);
            // Popola il modale con i dati usando toServerFormat()
            const IuserDataFormatted = userRegistration.toServerFormat();
            const userNameElement = document.getElementById("user_name");
            if (userNameElement) {
                userNameElement.textContent = IuserDataFormatted.nome;
            }
            const IuserDataSummary = document.getElementById("user_data_summary");
            if (IuserDataSummary) {
                IuserDataSummary.innerHTML = `
            <li><strong>Email:</strong> ${IuserDataFormatted.email}</li>
            <li><strong>Nome:</strong> ${IuserDataFormatted.nome}</li>
            <li><strong>Cognome:</strong> ${IuserDataFormatted.cognome}</li>
            <li><strong>Sesso:</strong> ${IuserDataFormatted.sesso}</li>
            <li><strong>Data di Nascita:</strong> ${formattedDate}</li>
            <li><strong>Nazione:</strong> ${IuserDataFormatted.nazione}</li>
            <li><strong>Città:</strong> ${IuserDataFormatted.citta}</li>
            <li><strong>Provincia:</strong> ${IuserDataFormatted.provincia}</li>
            <li><strong>Codice Fiscale:</strong> ${IuserDataFormatted.codiceFiscale}</li>
            <li><strong>Cittadinanza:</strong> ${IuserDataFormatted.cittadinanza}</li>
          `;
            }
            // Mostra il modale di successo
            mostraMessaggioSuccesso();
        }
        else {
            // Controllo se firstInvalidField è impostato e di tipo HTMLElement
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                firstInvalidField.focus();
            }
        }
    });
    /**
   * Mostra il messaggio di successo, nascondendo il modale del form e visualizzando il modale di conferma.
   *
   * - Nasconde il modale principale del form riducendolo con una trasformazione.
   * - Dopo un breve ritardo, mostra il modale di successo centrato e in scala.
   *
   * @returns {void} - Non restituisce alcun valore.
   */
    function mostraMessaggioSuccesso() {
        // Nasconde il modale del form
        const bigModal = document.getElementById("big_modal");
        if (bigModal) {
            bigModal.style.transform = "scale(0)";
        }
        // Mostra il modale di successo
        setTimeout(function () {
            const successModal = document.getElementById("success_modal");
            if (successModal) {
                successModal.style.transform =
                    "translate(-50%, -50%) scale(1)";
            }
        }, 100);
    }
    /**
     * Formatta una data in stringa secondo lo stile italiano (gg/mm/aaaa).
     *
     * - Utilizza `toLocaleDateString` per convertire una data in formato leggibile in italiano.
     *
     * @param {string} dateString - La data in formato stringa.
     * @returns {string} - La data formattata in stile italiano.
     */
    function formatDate(dateString) {
        const options = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        };
        const date = new Date(dateString);
        return date.toLocaleDateString("it-IT", options); //conversione in stringa secondo le specifiche italiane
    }
    // Listener per il pulsante di chiusura del modale di successo
    const closeSuccessModalBtn = document.getElementById("closeSuccessModal");
    if (closeSuccessModalBtn) {
        closeSuccessModalBtn.addEventListener("click", function () {
            // Nasconde il modale di successo
            const successModal = document.getElementById("success_modal");
            if (successModal) {
                successModal.style.transform =
                    "translate(-50%, -50%) scale(0)";
            }
            // Resetta il form per una nuova registrazione
            form.reset();
            // Reimposta il primo modale
            setTimeout(function () {
                const littleModal = document.getElementById("little_modal");
                if (littleModal) {
                    littleModal.style.transform = "scale(1)";
                }
            }, 100);
        });
    }
});
// email
// email
// email
// email
// email
/**
 * Gestisce la transizione tra modali e la convalida dell'email.
 *
 * - Al caricamento del DOM:
 *   - Aggiunge listener per cambiare modale (da email a form completo e viceversa).
 *   - Convalida l'email quando si tenta di avanzare al form completo.
 *   - Previene l'invio del form se si preme "Enter" nell'input email.
 *
 * Funzioni interne:
 * - Listener `toggleModals`: Valida l'email e, se valida, passa dal modale dell'email al modale del form completo.
 * - Listener `goBack`: Torna al modale dell'email chiudendo il form completo.
 * - Listener `keypress` su `#email`: Previene l'invio premendo "Enter" nell'input email.
 *
 * @returns {void} - Non restituisce alcun valore.
 */
document.addEventListener("DOMContentLoaded", function () {
    var _a, _b, _c;
    /**
     * Listener per passare dal modale dell'email al modale del form completo.
     *
     * - Convalida l'email inserita utilizzando una regex.
     * - Se l'email è valida:
     *   - Nasconde il messaggio di errore.
     *   - Salva l'email in una variabile globale `userEmail`.
     *   - Nasconde il modale dell'email e mostra il modale del form completo.
     * - Se l'email non è valida, mostra il messaggio di errore.
     *
     * @returns {void} - Non restituisce alcun valore.
     */
    (_a = document
        .getElementById("toggleModals")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        const emailInput = document.getElementById("email");
        const errorMessage = document.querySelector(".valid_email");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // al click si controlla che l'email inserita sia valida
        if (!emailRegex.test(emailInput.value)) {
            errorMessage.classList.remove("oscurato");
        }
        else {
            errorMessage.classList.add("oscurato");
            // Salva l'email in una variabile globale, mi servirà per il messaggio di benvenuto/successo
            window.userEmail = emailInput.value;
            // Nasconde il primo modale e mostra il secondo
            const littleModal = document.getElementById("little_modal");
            if (littleModal) {
                littleModal.style.transform = "scale(0)";
            }
            setTimeout(function () {
                const bigModal = document.getElementById("big_modal");
                if (bigModal) {
                    bigModal.style.transform = "scale(1)";
                }
            }, 100);
        }
    });
    /**
     * Listener per tornare al modale dell'email dal modale del form completo.
     *
     * - Nasconde il modale del form completo.
     * - Dopo un breve ritardo, mostra il modale dell'email.
     *
     * @returns {void} - Non restituisce alcun valore.
     */
    (_b = document.getElementById("goBack")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
        // Imposta la scala di #big_modal a 0 per nasconderlo immediatamente
        const bigModal = document.getElementById("big_modal");
        if (bigModal) {
            bigModal.style.transform = "scale(0)";
        }
        // Ritarda l'apertura di #little_modal
        setTimeout(function () {
            const littleModal = document.getElementById("little_modal");
            if (littleModal) {
                littleModal.style.transform = "scale(1)";
            }
        }, 100);
    });
    /**
     * Listener per prevenire l'invio del form premendo "Enter" nell'input email.
     *
     * - Blocca l'azione predefinita se l'utente preme "Enter" nell'input email.
     *
     * @returns {void} - Non restituisce alcun valore.
     */
    (_c = document
        .getElementById("email")) === null || _c === void 0 ? void 0 : _c.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    });
});
/**
 * Inizializza i campi select con Select2 e gestisce la visualizzazione degli errori associati.
 *
 * - Al caricamento del DOM:
 *   - Inizializza Select2 per i campi `sesso`, `citta` e `nazione`.
 *   - Gestisce il comportamento di Select2 per nascondere i messaggi di errore quando un valore è selezionato.
 *
 * @returns {void} - Non restituisce alcun valore.
 */
document.addEventListener("DOMContentLoaded", function () {
    // gestisce l'errore associato (funziona diversamente da una select normale)
    function initializeSelect2(selectId, errorClass) {
        const selectElement = $(`#${selectId}`);
        const errorMessage = document.querySelector(`.${errorClass}`);
        if (selectElement.length > 0) {
            // Inizializza Select2
            selectElement.select2();
            // Gestisci l'evento change con Select2
            selectElement.on("select2:select", function (e) {
                const selectedValue = e.target.value;
                // Nasconde l'errore se il valore è diverso da quello di default
                if (selectedValue !== "") {
                    errorMessage === null || errorMessage === void 0 ? void 0 : errorMessage.classList.add("oscurato");
                }
            });
        }
    }
    // Inizializza i campi con Select2 e gestione degli errori
    initializeSelect2("sesso", "sesso-required-error");
    initializeSelect2("citta", "citta-required-error");
    initializeSelect2("nazione", "nazione-required-error");
});
//# sourceMappingURL=form_script.js.map