let distance = 100000; // Kezdeti távolság a Holdig
let clickCount = 0; // Nyersanyagok száma
let fuelRate = 0; // Másodpercenkénti automatikus kattintás (üzemanyag)
let fuelCost = 100; // Üzemanyag fejlesztés kezdő ára
let fuelLevel = 0; // Üzemanyag fejlesztés szintje
let isFuelRunning = false; // Állapotjelző az üzemanyaghoz
let engineRate = 0; // Hajtómű automatikus kattintás
let engineCost = 1000; // Hajtómű fejlesztés kezdő ára
let engineLevel = 0; // Hajtómű fejlesztés szintje
let isEngineRunning = false; // Állapotjelző a hajtóműhöz
let distancePerClick = 1; // Kattintásonkénti csökkenés
let totalRate = 0; // Összesített termelési érték

const clickButton = document.getElementById("clickButton");
const fuelUpgradeButton = document.getElementById("fuelUpgrade");
const engineUpgradeButton = document.getElementById("engineUpgrade");
const distanceDisplay = document.getElementById("distance");
const clickCountDisplay = document.getElementById("clickCount");
const totalRateDisplay = document.getElementById("totalProduction");
const progressRocket = document.getElementById("progress-rocket");
const flame = document.querySelector('.flame');

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
    distanceDisplay.textContent = `${Math.floor(distance)}`;
    clickCountDisplay.textContent = `Nyersanyag: ${Math.floor(clickCount)}`; // Kerekítés

    // Rakéta pozíciójának frissítése a távolság alapján
    const progressPercentage = (100000 - distance) / 100000;
    progressRocket.style.bottom = `${progressPercentage * 100}%`; // Rakéta mozgása
    updateFlameVisibility(distance); // Lángcsóva állapota

    if (distance <= 0) {
        distance = 0;
        alert("Gratulálok! Elérted a Holdat! 🚀");
    }

    // Frissítjük a fejlesztési gombokat
    checkUpgrades();
}

function updateFlameVisibility(distance) {
    if (distance > 0 && distance < 100000) {
        flame.style.display = 'block'; // Lángcsóva látható
    } else {
        flame.style.display = 'none'; // Lángcsóva eltűnik
    }
}

// Rakd be az `updateUI` funkcióba



// Üzemanyag fejlesztés
fuelUpgradeButton.addEventListener("click", () => {
    if (clickCount >= fuelCost) {
        clickCount -= fuelCost;
        fuelRate += 0.5;
        fuelLevel++;
        fuelCost = Math.floor(fuelCost * 1.1);
        updateTotalProduction(); // Frissítjük a termelési értéket
        updateUI();
        checkUpgrades();
        fuelUpgradeButton.textContent = `Üzemanyag ár: ${fuelCost} - Szint ${fuelLevel}`;
        saveGame();

        // Leállítjuk az előző termelést, ha van
        isFuelRunning = false;

        if (fuelRate > 0) startFuel();
    }
});

// Hajtómű fejlesztés
engineUpgradeButton.addEventListener("click", () => {
    if (clickCount >= engineCost) {
        clickCount -= engineCost;
        engineRate += 5;
        engineLevel++;
        engineCost = Math.floor(engineCost * 1.2);
        updateTotalProduction(); // Frissítjük a termelési értéket
        updateUI();
        checkUpgrades();
        engineUpgradeButton.textContent = `Hajtómű ár: ${engineCost} - Szint ${engineLevel}`;
        saveGame();
        if (engineRate > 0) startEngine(); // Ha már van termelés, indítsuk el
    }
});

// Automatikus kattintás üzemanyaghoz
function startFuel() {
    if (isFuelRunning) return; // Ha már fut, ne indítsuk el újra
    isFuelRunning = true; // Beállítjuk, hogy mostantól fut

    const interval = 100; // 1 másodperc / 10 lépés = 100 ms
    const steps = 10; // Hány lépésben történjen az összeadás
    const increment = fuelRate / steps; // Egy lépésnyi termelési érték

    setInterval(() => {
        if (distance > 0) {
            for (let i = 0; i < steps; i++) {
                setTimeout(() => {
                    distance -= increment;
                    clickCount += increment; // Fokozatos hozzáadás
                    updateUI();
                    saveGame();
                }, i * interval); // Az időintervallum lépésenként nő
            }
        }
    }, 1000);
}

// Automatikus kattintás hajtóműhöz
function startEngine() {
    if (isEngineRunning) return; // Ha már fut, ne indítsuk el újra
    isEngineRunning = true; // Beállítjuk, hogy mostantól fut

    const interval = 100; // 1 másodperc / 10 lépés = 100 ms
    const steps = 10; // Hány lépésben történjen az összeadás
    const increment = engineRate / steps; // Egy lépésnyi termelési érték

    setInterval(() => {
        if (distance > 0) {
            for (let i = 0; i < steps; i++) {
                setTimeout(() => {
                    distance -= increment;
                    clickCount += increment; // Fokozatos hozzáadás
                    updateUI();
                    saveGame();
                }, i * interval); // Az időintervallum lépésenként nő
            }
        }
    }, 1000);
}

// Összesített termelési érték frissítés
function updateTotalProduction() {
    totalRate = fuelRate + engineRate; // Üzemanyag és hajtómű termelés összege
    totalRateDisplay.textContent = `Termelés: ${totalRate} / másodperc`; // Frissítjük a termelés értékét UI-ban
    saveGame();
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

    // Időzítők leállítása
    isFuelRunning = false;
    isEngineRunning = false;

    // Az összes `setInterval` leállítása
    const highestIntervalId = setInterval(() => {}, 0); // Legmagasabb azonosító
    for (let i = 0; i <= highestIntervalId; i++) {
        clearInterval(i);
    }

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
