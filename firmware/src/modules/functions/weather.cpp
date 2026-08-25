#include "weather.h"

#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#include "../../config.h"
#include "../../utils/display.h"
#include "../../utils/buttons.h"

// Usa Open-Meteo (https://open-meteo.com), no hace falta API
// key. Las coordenadas estan hardcodeadas en config.h, mismo
// patron que WIFI_SSID/WIFI_PASS.
//
// Se piden estos 6 campos de "current":
// https://open-meteo.com/en/docs?latitude=-34.6037&longitude=-58.3816&current=temperature_2m,precipitation,rain,relative_humidity_2m,wind_speed_10m,weather_code
#define WEATHER_CURRENT_FIELDS "temperature_2m,precipitation,rain,relative_humidity_2m,wind_speed_10m,weather_code"

// ======================================================
// ESTADO
// ======================================================

bool weatherHasData = false;
bool weatherError = false;

float weatherTempC = 0;
float weatherPrecipMm = 0;
float weatherRainMm = 0;
int weatherHumidity = 0;
float weatherWindKmh = 0;
int weatherCode = -1;

unsigned long lastFetchAt = 0;
const unsigned long FETCH_INTERVAL_MS = 10UL * 60UL * 1000UL; // 10 min

// ── Paginas (se navegan con ARRIBA/ABAJO) ─────────────

enum WeatherPage
{
    WEATHER_PAGE_TEMP,
    WEATHER_PAGE_HUMEDAD_VIENTO,
    WEATHER_PAGE_PRECIPITACION
};

const int WEATHER_PAGE_COUNT = 3;
WeatherPage weatherPage = WEATHER_PAGE_TEMP;

// ======================================================
// CODIGO WMO -> TEXTO CORTO
// (https://open-meteo.com/en/docs, tabla de weather_code)
// ======================================================

const char *weatherCodeToText(int code)
{
    if (code == 0)
        return "Despejado";

    if (code == 1 || code == 2)
        return "Algo nublado";

    if (code == 3)
        return "Nublado";

    if (code == 45 || code == 48)
        return "Niebla";

    if (code >= 51 && code <= 57)
        return "Llovizna";

    if (code >= 61 && code <= 67)
        return "Lluvia";

    if (code >= 71 && code <= 77)
        return "Nieve";

    if (code >= 80 && code <= 82)
        return "Chaparrones";

    if (code >= 95)
        return "Tormenta";

    return "Sin datos";
}

// ======================================================
// PEDIR CLIMA
// ======================================================

void fetchWeather()
{
    // Se marca el intento aunque falle, para no reintentar
    // en cada vuelta del loop (rate-limit simple).
    lastFetchAt = millis();

    if (WiFi.status() != WL_CONNECTED)
    {
        weatherError = true;
        weatherHasData = false;
        return;
    }

    WiFiClientSecure client;

    // Sin validar certificado: aceptable para un proyecto
    // hobby, no para produccion.
    client.setInsecure();

    HTTPClient http;

    char url[220];

    snprintf(
        url,
        sizeof(url),
        "https://api.open-meteo.com/v1/forecast?latitude=%.4f&longitude=%.4f&current=" WEATHER_CURRENT_FIELDS,
        (double)WEATHER_LAT,
        (double)WEATHER_LON
    );

    if (!http.begin(client, url))
    {
        weatherError = true;
        weatherHasData = false;
        return;
    }

    int httpCode = http.GET();

    if (httpCode != HTTP_CODE_OK)
    {
        weatherError = true;
        weatherHasData = false;
        http.end();
        return;
    }

    String body = http.getString();
    http.end();

    JsonDocument doc;

    DeserializationError err = deserializeJson(doc, body);

    if (err)
    {
        weatherError = true;
        weatherHasData = false;
        return;
    }

    weatherTempC = doc["current"]["temperature_2m"] | 0.0;
    weatherPrecipMm = doc["current"]["precipitation"] | 0.0;
    weatherRainMm = doc["current"]["rain"] | 0.0;
    weatherHumidity = doc["current"]["relative_humidity_2m"] | 0;
    weatherWindKmh = doc["current"]["wind_speed_10m"] | 0.0;
    weatherCode = doc["current"]["weather_code"] | -1;

    weatherError = false;
    weatherHasData = true;
}

// ======================================================
// DIBUJADO OLED
// ======================================================

void drawWeatherLoading()
{
    display.clearDisplay();

    display.setTextSize(1);
    display.setCursor(0, 0);
    display.print("CLIMA");

    display.setCursor(0, 25);
    display.print("Consultando...");

    display.display();
}

void drawWeatherError()
{
    display.clearDisplay();

    display.setTextSize(1);
    display.setCursor(0, 0);
    display.print("CLIMA");

    display.setCursor(0, 25);
    display.print("Sin datos");

    display.setCursor(0, 56);
    display.print("IZQ = MENU");

    display.display();
}

void drawWeatherPageTemp()
{
    display.clearDisplay();

    display.setTextSize(1);
    display.setCursor(0, 0);
    display.print("CLIMA (1/3)");

    char tempBuffer[10];

    sprintf(
        tempBuffer,
        "%.0fC",
        weatherTempC
    );

    display.setTextSize(3);
    display.setCursor(10, 20);
    display.print(tempBuffer);

    display.setTextSize(1);
    display.setCursor(0, 46);
    display.print(weatherCodeToText(weatherCode));

    display.setCursor(0, 56);
    display.print("IZQ=MENU ARR/ABJ=MAS");

    display.display();
}

void drawWeatherPageHumedadViento()
{
    display.clearDisplay();

    display.setTextSize(1);
    display.setCursor(0, 0);
    display.print("CLIMA (2/3)");

    char buffer[24];

    display.setCursor(0, 16);
    sprintf(buffer, "Humedad: %d%%", weatherHumidity);
    display.print(buffer);

    display.setCursor(0, 30);
    sprintf(buffer, "Viento: %.0f km/h", weatherWindKmh);
    display.print(buffer);

    display.setCursor(0, 56);
    display.print("IZQ=MENU ARR/ABJ=MAS");

    display.display();
}

void drawWeatherPagePrecipitacion()
{
    display.clearDisplay();

    display.setTextSize(1);
    display.setCursor(0, 0);
    display.print("CLIMA (3/3)");

    char buffer[24];

    display.setCursor(0, 16);
    sprintf(buffer, "Precip: %.1f mm", weatherPrecipMm);
    display.print(buffer);

    display.setCursor(0, 30);
    sprintf(buffer, "Lluvia: %.1f mm", weatherRainMm);
    display.print(buffer);

    display.setCursor(0, 56);
    display.print("IZQ=MENU ARR/ABJ=MAS");

    display.display();
}

void drawWeather()
{
    if (weatherError)
    {
        drawWeatherError();
        return;
    }

    if (!weatherHasData)
    {
        drawWeatherLoading();
        return;
    }

    switch (weatherPage)
    {
    case WEATHER_PAGE_TEMP:
        drawWeatherPageTemp();
        break;

    case WEATHER_PAGE_HUMEDAD_VIENTO:
        drawWeatherPageHumedadViento();
        break;

    case WEATHER_PAGE_PRECIPITACION:
        drawWeatherPagePrecipitacion();
        break;
    }
}

// ======================================================
// SETUP
// ======================================================

void weatherSetup()
{
    weatherHasData = false;
    weatherError = false;
    lastFetchAt = 0;
    weatherPage = WEATHER_PAGE_TEMP;

    drawWeatherLoading();
    fetchWeather();
}

// ======================================================
// LOOP
// ======================================================

void weatherLoop()
{
    // El clima no cambia en tiempo real: se re-consulta cada
    // FETCH_INTERVAL_MS en vez de en cada vuelta del loop,
    // para no golpear la API de arriba.

    if (millis() - lastFetchAt >= FETCH_INTERVAL_MS)
    {
        drawWeatherLoading();
        fetchWeather();
    }

    // Navegar entre paginas solo tiene sentido si hay datos
    // para mostrar.

    if (weatherHasData && !weatherError)
    {
        if (btnUpPressed())
        {
            weatherPage = (WeatherPage)(
                (weatherPage - 1 + WEATHER_PAGE_COUNT) % WEATHER_PAGE_COUNT
            );
        }

        if (btnDownPressed())
        {
            weatherPage = (WeatherPage)(
                (weatherPage + 1) % WEATHER_PAGE_COUNT
            );
        }
    }

    drawWeather();

    // IZQUIERDA no se lee aca: el volver al menu lo maneja
    // menu.cpp (mismo patron que Clock).

    delay(100);
}
