// js/maintain.js

document.addEventListener("DOMContentLoaded", function () {
    // --- Countdown Timer ---
    // SET YOUR LAUNCH DATE AND TIME HERE!
    const launchDate = new Date("Dec 31, 2025 23:59:00").getTime();

    const countdownFunction = setInterval(function () {
        const now = new Date().getTime();
        const distance = launchDate - now;

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Add leading zero if number is less than 10
        const format = (num) => (num < 10 ? "0" + num : num);

        // Display the result in the elements
        document.getElementById("days").innerText = format(days);
        document.getElementById("hours").innerText = format(hours);
        document.getElementById("minutes").innerText = format(minutes);
        document.getElementById("seconds").innerText = format(seconds);

        // If the countdown is finished, write some text
        if (distance < 0) {
            clearInterval(countdownFunction);
            document.getElementById("countdown").innerHTML = `<div class="launched-message">Situs Kami Telah Diluncurkan!</div>`;
        }
    }, 1000);

    // --- Auto-update Copyright Year ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});