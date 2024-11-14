"use strict";
/**
 * Inizializza e configura tutti i caroselli nella pagina selezionando ogni elemento `.carousel-wrapper`.
 * Per ciascun carosello, applica le impostazioni di layout e i comportamenti di navigazione, inclusi i pulsanti "prev" e "next".
 *
 * La funzione interna `updateCarouselSettings` determina il numero di immagini visibili e imposta la dimensione delle immagini
 * in base alla larghezza dello schermo, aggiornando anche i margini per garantire uno scorrimento fluido.
 *
 * La funzione interna `updateButtonVisibility` gestisce la visibilità dei pulsanti "prev" e "next" in base alla posizione corrente del carosello,
 * nascondendoli automaticamente se si raggiunge il limite delle immagini.
 */
function initializeCarousels() {
    const carousels = document.querySelectorAll('.carousel-wrapper');
    let marginTolerance = 11; // Margine di tolleranza in pixel per permettere un 'bel' scroll
    carousels.forEach((carousel) => {
        const track = carousel.querySelector('.image-track'); // contenitore padre
        const slider = carousel.querySelector('.image-slider'); // contenitore medio
        // HTMLElement è il tipo base per tutti gli elementi HTML in TypeScript.
        const images = track ? track.querySelectorAll('img') : []; // immagine all'interno del contenitore medio
        const totalImages = images.length; // lunghezza dell'immagine
        let position = 0;
        // bottoni all'interno del carosello
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        let maxPosition;
        let minPosition = 0;
        let gap;
        /**
         * Configura le dimensioni e le posizioni del carosello in base alla larghezza della finestra.
         * Calcola la larghezza delle immagini e aggiorna i margini per uno scorrimento fluido.
         * Viene richiamata anche al ridimensionamento della finestra.
         * @returns {void} - Non restituisce alcun valore.
         */
        function updateCarouselSettings() {
            // Determina il numero di immagini visibili in base alla larghezza dello schermo
            let visibleImages;
            if (window.innerWidth < 360) {
                visibleImages = 1;
                gap = 11.6;
            }
            else if (window.innerWidth < 560) {
                visibleImages = 2;
                marginTolerance = 12;
                gap = 12;
            }
            else if (window.innerWidth < 860) {
                visibleImages = 3;
                gap = 12;
            }
            else if (window.innerWidth < 1100) {
                visibleImages = 4;
                gap = 12;
            }
            else {
                visibleImages = 5;
                gap = 12;
            }
            const sliderWidth = slider ? slider.clientWidth : 0; // lunghezza del contenitore medio, clientWidth restituisce la lunghezza in px
            // questa formula calcola quanto deve essere grande l'immagine, si sottrae alla larghezza dell'immagine lo spazio tra una e l'altra e lo si moltiplica per le immagini che si deve poter vedere in base alla grandezza dello schermo e lo si divide proprio per quel numero così da 'dividersi equamente lo spazio'
            const imgWidth = (sliderWidth - gap * (visibleImages - 1)) / visibleImages;
            // Imposta la larghezza e l'altezza delle immagini dinamicamente
            images.forEach(img => {
                img.style.width = `${imgWidth}px`;
                img.style.height = `${imgWidth * 0.6}px`; // Altezza calcolata come il 60% della larghezza
            });
            // Calcola le posizioni massime e minime con tolleranza 
            maxPosition = Math.round(-(imgWidth + gap) * (totalImages - visibleImages)) + marginTolerance;
            minPosition = 0;
            // spostamento tramite proprietà css dell'immagine 
            if (track) {
                track.style.transform = `translateX(${position}px)`;
            }
            // aggiorna la visibilità dei bottoni
            updateButtonVisibility();
        }
        /**
         * Aggiorna la visibilità dei pulsanti di navigazione "prev" e "next".
         * Nasconde i pulsanti se si raggiunge il limite del carosello.
         * @returns {void} - Non restituisce alcun valore.
         */
        function updateButtonVisibility() {
            // se il contenitore di immagini 'visibili' è maggiore delle immagini effettive, i pulsanti non servono
            if (slider && track && prevBtn && nextBtn) {
                if (slider.clientWidth >= track.scrollWidth) {
                    prevBtn.style.display = 'none';
                    nextBtn.style.display = 'none';
                    // altrimenti compare dove serve
                }
                else {
                    prevBtn.style.display = position === minPosition ? 'none' : 'block';
                    nextBtn.style.display = position <= maxPosition ? 'none' : 'block';
                }
            }
        }
        /**
         * Evento click per il pulsante "next", che sposta la posizione del carosello in avanti.
         * Calcola la nuova posizione e la imposta nel carosello.
         * @param {Event} event - L'evento click attivato dal pulsante "next".
         * @returns {void} - Non restituisce alcun valore.
         */
        nextBtn === null || nextBtn === void 0 ? void 0 : nextBtn.addEventListener('click', () => {
            var _a;
            const imgWidth = ((_a = images[0]) === null || _a === void 0 ? void 0 : _a.clientWidth) || 0;
            if (position > maxPosition) {
                position -= imgWidth + gap;
                // Arrotondo la posizione per evitare errori di pochi pixel
                position = Math.max(Math.round(position), maxPosition);
                if (track) {
                    track.style.transform = `translateX(${position}px)`;
                }
                updateButtonVisibility();
            }
        });
        /**
         * Evento click per il pulsante "prev", che sposta la posizione del carosello indietro.
         * Calcola la nuova posizione e la imposta nel carosello.
         * @param {Event} event - L'evento click attivato dal pulsante "prev".
         * @returns {void} - Non restituisce alcun valore.
         */
        prevBtn === null || prevBtn === void 0 ? void 0 : prevBtn.addEventListener('click', () => {
            var _a;
            const imgWidth = ((_a = images[0]) === null || _a === void 0 ? void 0 : _a.clientWidth) || 0;
            if (position < minPosition) {
                position += imgWidth + gap;
                // Arrotondo la posizione per evitare errori di pochi pixel
                position = Math.min(Math.round(position), minPosition);
                if (track) {
                    track.style.transform = `translateX(${position}px)`;
                }
                updateButtonVisibility();
            }
        });
        // Inizializzo il carosello e aggiorno al ridimensionamento
        updateCarouselSettings();
        window.addEventListener('resize', updateCarouselSettings);
    });
}
// Inizializzo tutti i caroselli sulla pagina
initializeCarousels();
// per la card
// per la card
// per la card
const card = document.getElementById("dynamic-card"); // elemento di prova che simulerà le carte personalizzate per ogni cambio immagine/video per ogni film
const cardImage = document.getElementById("card-image"); // immagine di default
const cardVideo = document.getElementById("card-video"); // video di default
const footer = document.querySelector("footer");
// larghezza minima della card
const minCardWidth = 200;
// Funzione per mostrare la card con il video
function showCard(event) {
    const image = event.target;
    // getBoundingClientRect fornisce le cordinate e le dimensioni dell'immagine, quindi è possibile definire la sua posizione nello spazio
    const rect = image.getBoundingClientRect();
    const cardWidth = Math.max(rect.width, minCardWidth); // Usa la larghezza minima se l'immagine è troppo piccola
    // Nasconde l'immagine e mostra il video
    if (cardImage && cardVideo) {
        cardImage.style.display = "none";
        cardVideo.style.display = "block";
        cardVideo.play();
        // Imposta le dimensioni del video
        cardVideo.style.width = `${cardWidth - 16}px`; // Calcola la larghezza meno il padding
        cardVideo.style.height = `${(cardWidth - 16) * 0.6}px`; // Altezza calcolata come il 60% della larghezza
    }
    // Calcola la posizione della card
    let leftPosition = rect.left + window.scrollX;
    const rightEdge = leftPosition + cardWidth;
    // Se la card va fuori dallo schermo, allineala a destra dell'immagine
    if (rightEdge > window.innerWidth) {
        leftPosition = window.innerWidth - cardWidth;
    }
    // Posiziona la card
    if (card) {
        card.style.left = `${leftPosition}px`;
        card.style.top = `${rect.top + window.scrollY}px`;
        card.style.width = `${cardWidth}px`;
        card.style.display = "block";
    }
    // Aggiunge l'evento per nascondere la card quando si esce
    image.addEventListener("mouseleave", hideCard);
}
/**
 * @param {MouseEvent} event - L'evento `mouseleave`.
 *
 * - Nasconde la card e mostra l'immagine se il mouse non è più sopra la card o l'immagine.
 * - Pausa e resetta il video nella card. *
 * @returns {void} - Non restituisce alcun valore.
 */
function hideCard(event) {
    const related = event.relatedTarget;
    // Nasconde solo se il mouse non è più sull'immagine o sulla card
    if (!related ||
        (!related.closest(".card") && !related.closest(".image-track img"))) {
        // Mostra l'immagine e nasconde il video
        if (cardImage && cardVideo && card) {
            cardImage.style.display = "block";
            cardVideo.style.display = "none";
            cardVideo.pause();
            cardVideo.currentTime = 0; // Resetta il video
            card.style.display = "none";
        }
    }
}
const images = document.querySelectorAll(".image-track img");
// Aggiunge l'evento mouseenter a ciascuna immagine di tutti i caroselli
images.forEach((img) => {
    img.addEventListener("mouseenter", showCard);
});
// Aggiunge l'evento mouseleave alla card stessa per nasconderla
card === null || card === void 0 ? void 0 : card.addEventListener("mouseleave", hideCard);
//# sourceMappingURL=script.js.map