let distance = 100000; // Kezdeti távolság a Holdig
let clickCount = 0; // Nyersanyagok száma
let fuelRate = 0; // Másodpercenkénti automatikus kattintás (üzemanyag)
let fuelCost = 100; // Üzemanyag fejlesztés kezdő ára
let fuelLevel = 0; // Üzemanyag fejlesztés szintje
let engineRate = 0; // Hajtómű automatikus kattintás
let engineCost = 1000; // Hajtómű fejlesztés kezdő ára
let engineLevel = 0; // Hajtómű fejlesztés szintje
let distancePerClick = 1; // Kattintásonkénti csökkenés
let totalRate = 0; // Összesített termelési érték

const clickButton = document.getElementById("clickButton");
const fuelUpgradeButton = document.getElementById("fuelUpgrade");
const engineUpgradeButton = document.getElementById("engineUpgrade");
const distanceDisplay = document.getElementById("distance");
const clickCountDisplay = document.getElementById("clickCount");
const totalRateDisplay = document.getElementById("totalProduction");
const progressRocket = document.getElementById("progress-rocket");

// Kattintás esemény
clickButton.addEventListener("click", () => {
    if (distance > 0) {
        distance -= distancePerClick;
        clickCount++;
        updateUI();
        checkUpgrades();
        updateTotalProduction(); // Frissítjük a termelést kattintás után
        saveGame(); // Mentsük el minden kattintás után is
    }
});

// Felület frissítése
function updateUI() {
    distanceDisplay.textContent = `${distance}`;
    clickCountDisplay.textContent = `Nyersanyag: ${Math.floor(clickCount)}`; // Kerekítés

    // Rakéta pozíciójának frissítése a távolság alapján
    const progressPercentage = (100000 - distance) / 100000; // Haladás százalékban
    progressRocket.style.bottom = `${progressPercentage * 100}%`;

    if (distance <= 0) {
        distance = 0;
        alert("Gratulálok! Elérted a Holdat! 🚀");
    }

    // Frissítjük a fejlesztési gombokat
    checkUpgrades();
}

// Üzemanyag fejlesztés
fuelUpgradeButton.addEventListener("click", () => {
    if (clickCount >= fuelCost) {
        clickCount -= fuelCost;
        fuelRate++;
        fuelLevel++;
        fuelCost = Math.floor(fuelCost * 1.1);
        updateTotalProduction(); // Frissítjük a termelési értéket
        updateUI();
        checkUpgrades();
        fuelUpgradeButton.textContent = `Üzemanyag fejlesztés ár: ${fuelCost} - Szint ${fuelLevel}`;
        saveGame();
        if (fuelRate === 1) startFuel();
    }
});

// Hajtómű fejlesztés
engineUpgradeButton.addEventListener("click", () => {
    if (clickCount >= engineCost) {
        clickCount -= engineCost;
        engineRate++;
        engineLevel++;
        engineCost = Math.floor(engineCost * 1.2);
        updateTotalProduction(); // Frissítjük a termelési értéket
        updateUI();
        checkUpgrades();
        engineUpgradeButton.textContent = `Hajtómű fejlesztés ár: ${engineCost} - Szint ${engineLevel}`;
        saveGame();
        if (engineRate === 1) startEngine();
    }
});

// Automatikus kattintás üzemanyaghoz
function startFuel() {
    setInterval(() => {
        if (distance > 0) {
            distance -= fuelRate;
            clickCount += fuelRate; // A termelés hozzáadása a nyersanyaghoz
            updateUI();
            saveGame();
        }
    }, 1000);
}

// Automatikus kattintás hajtóműhöz
function startEngine() {
    setInterval(() => {
        if (distance > 0) {
            distance -= engineRate;
            clickCount += engineRate; // A termelés hozzáadása a nyersanyaghoz
            updateUI();
            saveGame();
        }
    }, 1000);
}

// Összesített termelési érték frissítés
function updateTotalProduction() {
    totalRate = fuelRate + engineRate; // Üzemanyag és hajtómű termelés összege
    totalRateDisplay.textContent = `Termelés: ${totalRate} / másodperc`; // Frissítjük a termelés értékét UI-ban
}

// Fejlesztések engedélyezése
function checkUpgrades() {
    fuelUpgradeButton.disabled = clickCount < fuelCost;
    engineUpgradeButton.disabled = clickCount < engineCost;
}

// Játék állapot mentése
function saveGame() {
    const gameData = {
        distance: distance,
        clickCount: clickCount,
        fuelRate: fuelRate,
        fuelCost: fuelCost,
        fuelLevel: fuelLevel,
        engineRate: engineRate,
        engineCost: engineCost,
        engineLevel: engineLevel,
        totalRate: totalRate
    };
    localStorage.setItem("spaceClickerSave", JSON.stringify(gameData));
}

// Játék állapot betöltése
function loadGame() {
    const savedGame = JSON.parse(localStorage.getItem("spaceClickerSave"));
    if (savedGame) {
        distance = savedGame.distance || 100000;
        clickCount = savedGame.clickCount || 0;
        fuelRate = savedGame.fuelRate || 0;
        fuelCost = savedGame.fuelCost || 100;
        fuelLevel = savedGame.fuelLevel || 0;
        engineRate = savedGame.engineRate || 0;
        engineCost = savedGame.engineCost || 1000;
        engineLevel = savedGame.engineLevel || 0;
        totalRate = savedGame.totalRate || 0;

        updateUI();
        updateTotalProduction(); // Betöltjük az összesített termelési értéket is

        fuelUpgradeButton.textContent = `Üzemanyag ár: ${fuelCost} - Szint ${fuelLevel}`;
        engineUpgradeButton.textContent = `Hajtómű ár: ${engineCost} - Szint ${engineLevel}`;

        if (fuelRate > 0) startFuel();
        if (engineRate > 0) startEngine();
    }
}

// Mentés törlése gomb esemény
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
    engineRate = 0;
    engineCost = 1000;
    engineLevel = 0;

    // UI frissítése
    updateUI();
    updateTotalProduction();
    fuelUpgradeButton.textContent = `Üzemanyag ár: ${fuelCost} - Szint ${fuelLevel}`;
    engineUpgradeButton.textContent = `Hajtómű ár: ${engineCost} - Szint ${engineLevel}`;
    totalRateDisplay.textContent = "Termelés: 0 / másodperc";

    alert("A mentésed törölve lett. A játék újrakezdődött.");
}

// Játék betöltése indításkor
loadGame();
