#include "clock.h"

#include <WiFi.h>
#include <time.h>
#include <Preferences.h>

#include "../../config.h"
#include "../../utils/display.h"
#include "../../utils/buttons.h"
#include "../../utils/prefs_keys.h"

bool wifiReady = false;

// =====================================================
// CONECTAR WIFI
// =====================================================

void connectWifi()
{
    WiFi.begin(
        WIFI_SSID,
        WIFI_PASS
    );

    unsigned long startTime = millis();

    while (
        WiFi.status() != WL_CONNECTED &&
        millis() - startTime < 10000
    )
    {
        delay(100);
    }

    if (WiFi.status() == WL_CONNECTED)
    {
        wifiReady = true;
    }
}

// =====================================================
// SETUP
// =====================================================

void clockSetup()
{
    connectWifi();

    if (wifiReady)
    {
        // La zona horaria se configura en Ajustes y se
        // guarda en NVS (por defecto UTC-3 si nunca se toco).

        Preferences prefs;
        prefs.begin(PREFS_NAMESPACE, true);

        int tzOffsetHours = prefs.getInt(PREFS_KEY_TZ_OFFSET, -3);

        prefs.end();

        configTime(
            tzOffsetHours * 3600,
            0,
            "pool.ntp.org"
        );
    }
}

// =====================================================
// DIBUJAR
// =====================================================

void drawClock()
{
    display.clearDisplay();

    display.setTextSize(1);
    display.setCursor(0, 0);
    display.print("CLOCK");

    if (!wifiReady)
    {
        display.setCursor(0, 25);
        display.print("NO WIFI");

        display.display();
        return;
    }

    struct tm timeinfo;

    if (!getLocalTime(&timeinfo))
    {
        display.setCursor(0, 25);
        display.print("SIN HORA");

        display.display();
        return;
    }

    char buffer[16];

    strftime(
        buffer,
        sizeof(buffer),
        "%H:%M:%S",
        &timeinfo
    );

    display.setTextSize(2);
    display.setCursor(12, 25);
    display.print(buffer);

    display.setTextSize(1);
    display.setCursor(0, 56);
    display.print("IZQ = MENU");

    display.display();
}

// =====================================================
// LOOP
// =====================================================

void clockLoop()
{
    drawClock();

    // El volver al menu con IZQUIERDA lo maneja menu.cpp
    // (CLOCK_STATE). No leer btnLeftPressed() aca: al ser
    // deteccion por flanco, consumiria la pulsacion antes
    // de que menu.cpp la vea y el boton dejaria de funcionar.

    delay(100);
}
