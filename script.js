let gamesList = []; // Oyun listesini saklamak için global değişken

async function getGamesList() {
    if (gamesList.length > 0) {
        return gamesList; // Eğer liste zaten yüklenmişse, tekrar yükleme
    }

    try {
        const response = await fetch('https://api.steampowered.com/ISteamApps/GetAppList/v2/');
        const data = await response.json();
        gamesList = data.applist.apps; // Oyun listesini güncelle
        return gamesList;
    } catch (error) {
        console.error('Steam oyun listesi alınamadı:', error);
        return []; // Hata durumunda boş liste dön
    }
}

/* async function getSteamGamePrice(gameId) {
    // Steam API isteği (burada yer tutucu olarak sabit bir değer kullanıldı)
    return 59.99; // Gerçek değer API'den alınmalı
}*/

async function getSteamGameDetails(appid, countryCode = 'tr') {
    try {
        const url = `http://store.steampowered.com/api/appdetails?appids=${appid}&cc=${countryCode}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data[appid].success && data[appid].data && data[appid].data.price_overview) {
            // Fiyat bilgisini çek
            let priceInfo = data[appid].data.price_overview;
            return priceInfo.final / 100; // Sent cinsinden olan fiyatı dolar cinsine çevir
        } else {
            return null; // Fiyat bilgisi yoksa null döndür
        }
    } catch (error) {
        console.error('Steam oyun detayları alınamadı:', error);
        return null;
    }
}




async function getCurrentExchangeRate() {
    try {
        const response = await fetch('https://doviz.dev/v1/try.json');
        const exchangeRates = await response.json();
        
        // Örnek olarak, USD/TRY döviz kuru. 'USD' yerine başka bir kur için anahtar kullanılabilir.
        const usdRate = exchangeRates.USDTRY;
        return usdRate;
    } catch (error) {
        console.error('Döviz kuru bilgisi alınamadı:', error);
        return null; // Hata durumunda null dön
    }
}

async function calculateLocalPriceUI() {
    const appid = document.getElementById('gameIdInput').value;
    if (!appid) {
        alert('Lütfen geçerli bir oyun ID giriniz.');
        return;
    }
    displayPrice(appid);
}

async function findGameByName() {
    const gameName = document.getElementById('gameNameInput').value.trim().toLowerCase();
    const gamesList = await getGamesList(); // API'den oyun listesini al

    const foundGame = gamesList.find(game => game.name.toLowerCase().includes(gameName));
    if (foundGame) {
        displayPrice(foundGame.appid); // Bulunan oyunun ID'si ile fiyatı hesapla
    } else {
        alert('Oyun bulunamadı.');
    }
}

async function displayPrice(appid) {
    try {
        // Fetching game details from your server-side proxy
        const response = await fetch(`http://localhost:3001/steam/gameDetails?appid=${appid}`);
        const data = await response.json();

        // Ensure the data is returned successfully from the Steam API
        if (data[appid].success && data[appid].data && data[appid].data.price_overview) {
            const priceInfo = data[appid].data.price_overview;
            const priceInUSD = priceInfo.final / 100; // Convert to dollars if the price is in cents

            // Convert USD price to local currency (example uses TRY)
            const exchangeRate = await getCurrentExchangeRate(); // Make sure this function is defined and working
            const localPrice = Math.round(priceInUSD * exchangeRate);
            const formattedPrice = `${localPrice} ₺`;

            // Display the formatted price
            document.getElementById('priceResult').innerText = `Yerel para birimindeki fiyat: ${formattedPrice}`;
        } else {
            document.getElementById('priceResult').innerText = 'Fiyat bilgisi bulunamadı.';
        }
    } catch (error) {
        console.error('Fiyat hesaplama hatası:', error);
        document.getElementById('priceResult').innerText = 'Fiyat hesaplanamadı.';
    }
}



/* async function displayPrice(appid) {
    try {
        const priceInUSD = await getSteamGameDetails(appid);
        if (priceInUSD === null) {
            document.getElementById('priceResult').innerText = 'Fiyat bilgisi bulunamadı.';
            return;
        }

        const exchangeRate = await getCurrentExchangeRate();
        const localPrice = Math.round(priceInUSD * exchangeRate);
        const formattedPrice = `${localPrice} ₺`;

        document.getElementById('priceResult').innerText = `Yerel para birimindeki fiyat: ${formattedPrice}`;
    } catch (error) {
        console.error('Fiyat hesaplama hatası:', error);
        document.getElementById('priceResult').innerText = 'Fiyat hesaplanamadı.';
    }
} */



/* async function displayPrice(gameId) {
    try {
        const priceInUSD = await getSteamGamePrice(gameId);
        const exchangeRate = await getCurrentExchangeRate();
        const localPrice = Math.round(priceInUSD * exchangeRate);
        const formattedPrice = `${localPrice} ₺`;
        document.getElementById('priceResult').innerText = `Yerel para birimindeki fiyat: ${formattedPrice}`;
    } catch (error) {
        console.error('Fiyat hesaplama hatası:', error);
        document.getElementById('priceResult').innerText = 'Fiyat hesaplanamadı.'; 
    } 
} */
