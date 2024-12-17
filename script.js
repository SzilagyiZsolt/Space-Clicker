let distance = 100000; // Kezdő távolság (km)
let clickCount = 0; // Kattintások száma
let distancePerClick = 1; // Mennyivel csökkenti a távolságot egy kattintás
let fuelRate = 0; // Automatikus kattintások száma másodpercenként
let fuelCost = 100; // Fejlesztés ára
let fuelInterval; // Időzítő az automatikus kattintásokhoz
let fuelLevel = 0; // Az üzemanyag fejlesztés szintje

const distanceDisplay = document.getElementById("distance");
const clickCountDisplay = document.getElementById("clickCount");
const fuelStatus = document.getElementById("fuelStatus");
const clickButton = document.getElementById("clickButton");
const fuelUpgradeButton = document.getElementById("fuelUpgrade");

// Adatok betöltése Local Storage-ből
function loadGame() {
    const savedGame = JSON.parse(localStorage.getItem("spaceClickerSave"));
    if (savedGame) {
        distance = savedGame.distance || 100000;
        clickCount = savedGame.clickCount || 0;
        fuelRate = savedGame.fuelRate || 0;
        fuelCost = savedGame.fuelCost || 100;
        fuelLevel = savedGame.fuelLevel || 0; // Szint visszatöltése

        updateUI(); // Felület frissítése
        fuelUpgradeButton.textContent = `Üzemanyag ár: ${fuelCost} - Szint ${fuelLevel}`; // Gomb szövegének frissítése
        if (fuelRate > 0) startFuel(); // Ha van automata kattintás, újraindítjuk
    }
}

// Adatok mentése Local Storage-be
function saveGame() {
    const gameData = {
        distance: distance,
        clickCount: clickCount,
        fuelRate: fuelRate,
        fuelCost: fuelCost,
        fuelLevel: fuelLevel // Fejlesztés szintjének mentése
    };
    localStorage.setItem("spaceClickerSave", JSON.stringify(gameData));
}

// Mentés törlés gomb esemény
const resetButton = document.getElementById("resetButton");

resetButton.addEventListener("click", () => {
    const confirmation = confirm("Biztos szeretnéd törölni a mentésedet?");
    if (confirmation) {
        resetGame();
    }
});

// Játékállás visszaállítása
function resetGame() {
    // Local Storage törlése
    localStorage.removeItem("spaceClickerSave");
    
    // Alapértékek visszaállítása
    distance = 100000;
    clickCount = 0;
    fuelRate = 0;
    fuelCost = 100;
    fuelLevel = 0;

    // Automatikus kattintások időzítőjének leállítása
    if (fuelInterval) clearInterval(fuelInterval);

    // UI frissítése
    updateUI();
    fuelUpgradeButton.textContent = `Üzemanyag ár: ${fuelCost} - Szint ${fuelLevel}`;
    fuelStatus.textContent = "Termelés: 0 / másodperc";

    alert("A mentésed törölve lett. A játék újrakezdődött.");
}

// Kattintás esemény
clickButton.addEventListener("click", () => {
    handleClick();
});

// Fejlesztés vásárlása - Üzemanyag
fuelUpgradeButton.addEventListener("click", () => {
    if (clickCount >= fuelCost) {
        clickCount -= fuelCost;
        fuelCost += 5; // Növeljük a fejlesztés árát
        fuelRate += 0.5; // Automatikus kattintások növelése
        fuelLevel++;
        startFuel();
        updateUI();
        checkUpgrades();
        fuelUpgradeButton.textContent = `Üzemanyag ár: ${fuelCost} - Szint ${fuelLevel}`;
        saveGame();
    }
});

// Automata kattintás indítása
function startFuel() {
    if (fuelInterval) clearInterval(fuelInterval);
    fuelInterval = setInterval(() => {
        handleClick(fuelRate);
    }, 1000);
    fuelStatus.textContent = `Termelés: ${fuelRate} / másodperc`;
}

// Kattintás kezelése
function handleClick(multiplier = 1) {
    clickCount += multiplier;
    distance -= distancePerClick * multiplier;
    if (distance < 0) distance = 0;
    updateUI();
    checkUpgrades();
    saveGame(); // Mentjük az állást minden kattintásnál
}

// Felület frissítése
function updateUI() {
    distanceDisplay.textContent = Math.floor(distance);
    clickCountDisplay.textContent = Math.floor(clickCount);
    fuelStatus.textContent = `Termelés: ${fuelRate} / másodperc`;
    checkUpgrades();
}

// Fejlesztések aktiválása
function checkUpgrades() {
    fuelUpgradeButton.disabled = clickCount < fuelCost;
}

// Játék betöltése
window.addEventListener("load", () => {
    loadGame();
    updateUI();
});

// Biztonsági mentés bezáráskor
window.addEventListener("beforeunload", () => {
    saveGame();
});
