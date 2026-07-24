import contrasteMonopolio from "./obj_1.js";
import contrasteTiers from "./obj_2.js"; 
import pozoSinFondo from "./obj_3.js"; // Asegúrate de importar el obj_3

(() => {
    const setMonopolio = contrasteMonopolio();
    const setTiers = contrasteTiers();
    const setPozo = pozoSinFondo(); // Instancia de la gráfica 3

    document.addEventListener("DOMContentLoaded", async () => {
        
        await setMonopolio.setup(); 
        await setTiers.setup();
        await setPozo.setup(); // Inicialización de la gráfica 3

        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        // --- OBSERVADOR 1 (Epic vs Steam) ---
        const steps1 = document.querySelectorAll('.step');
        const observer1 = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    steps1.forEach(step => step.classList.remove('is-active'));
                    entry.target.classList.add('is-active');
                    setMonopolio.updateChart(entry.target.getAttribute('data-index'));
                }
            });
        }, observerOptions);
        steps1.forEach(step => observer1.observe(step));

        // --- OBSERVADOR 2 (Indie vs AA vs AAA) ---
        const steps2 = document.querySelectorAll('.step-2');
        const observer2 = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    steps2.forEach(step => step.classList.remove('is-active'));
                    entry.target.classList.add('is-active');
                    setTiers.updateChart(entry.target.getAttribute('data-index'));
                }
            });
        }, observerOptions);
        steps2.forEach(step => observer2.observe(step));

        // --- OBSERVADOR 3 (Pozo sin fondo) ---
        const steps3 = document.querySelectorAll('.step-3');
        const observer3 = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    steps3.forEach(step => step.classList.remove('is-active'));
                    entry.target.classList.add('is-active');
                    setPozo.updateChart(entry.target.getAttribute('data-index'));
                }
            });
        }, observerOptions);
        steps3.forEach(step => observer3.observe(step));
    });
})();