#include "clock.h"

#include <WiFi.h>
#include <time.h>

#include "../../config.h"
#include "../../utils/display.h"
#include "../../utils/buttons.h"

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
        configTime(
            -3 * 3600,
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

    if (btnLeftPressed())
    {
        // TODO:
        // volver al menu
    }

    delay(100);
}