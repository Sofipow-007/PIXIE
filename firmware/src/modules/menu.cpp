#include "menu.h"

#include "../utils/display.h"
#include "../utils/buttons.h"
#include "../utils/list_menu.h"

#include "functions/standby.h"
#include "functions/timer.h"
#include "functions/settings.h"
#include "functions/clock.h"
#include "functions/weather.h"

#include <Arduino.h>

// ── Estados ───────────────────────────────────────────

enum AppState
{
    STANDBY_STATE,
    MENU_STATE,
    TIMER_STATE,
    SETTINGS_STATE,
    WEATHER_STATE,
    CLOCK_STATE
};

AppState currentState = STANDBY_STATE;

// ── Menú ──────────────────────────────────────────────

int selectedOption = 0;

const char *menuItems[] = {
    "Clock",
    "Timer",
    "Ajustes",
    "Clima",
    "Volver"
};

const int MENU_ITEMS_COUNT = 5;

bool menuNeedsRedraw = true;

// ── Dibujar menú ──────────────────────────────────────

void drawMenu()
{
    drawScrollingList(
        "--- PIXIE ---",
        menuItems,
        MENU_ITEMS_COUNT,
        selectedOption
    );
}

// ── Entrar a opción seleccionada ──────────────────────

void enterSelectedOption()
{
    switch (selectedOption)
    {
    case 0:
        Serial.println("[MENU] Entrando a Clock");
        clockSetup();
        currentState = CLOCK_STATE;
        break;

    case 1:
        Serial.println("[MENU] Entrando a Timer");
        timerSetup();
        currentState = TIMER_STATE;
        break;

    case 2:
        Serial.println("[MENU] Entrando a Ajustes");
        settingsSetup();
        currentState = SETTINGS_STATE;
        break;

    case 3:
        Serial.println("[MENU] Entrando a Clima");
        weatherSetup();
        currentState = WEATHER_STATE;
        break;

    case 4:
        Serial.println("[MENU] Volviendo a Standby");
        standbySetup();
        currentState = STANDBY_STATE;
        break;
    }
    
}

// ── Setup ─────────────────────────────────────────────

void menuSetup()
{
    Serial.begin(115200);
    Serial.print("Prueba reloj de PIXIE");

    displaySetup();
    buttonsSetup();

    standbySetup();

    currentState = STANDBY_STATE;
}

// ── Loop principal ────────────────────────────────────

void menuLoop()
{
    switch (currentState)
    {

    case STANDBY_STATE:

        standbyLoop();

        if (btnRightPressed())
        {
            Serial.println("[BTN] RIGHT standby -> menu");

            selectedOption = 0;
            currentState = MENU_STATE;
            menuNeedsRedraw = true;
        }

        break;

    case MENU_STATE:

        if (menuNeedsRedraw)
        {
            drawMenu();
            menuNeedsRedraw = false;
        }

        if (btnRightPressed())
        {
            Serial.print("[BTN] RIGHT menu -> ");
            Serial.println(selectedOption);

            enterSelectedOption();
            menuNeedsRedraw = true;
        }

        if (btnLeftPressed())
        {
            if (selectedOption == 0)
            {
                Serial.println("[BTN] LEFT menu[0] -> standby");

                standbySetup();
                currentState = STANDBY_STATE;
            }
            else
            {
                selectedOption--;

                Serial.print("[BTN] LEFT menu -> ");
                Serial.println(selectedOption);

                menuNeedsRedraw = true;
            }
        }

        if (btnUpPressed())
        {
            selectedOption =
                (selectedOption - 1 + MENU_ITEMS_COUNT)
                % MENU_ITEMS_COUNT;

            Serial.print("[BTN] UP menu -> ");
            Serial.println(selectedOption);

            menuNeedsRedraw = true;
        }

        if (btnDownPressed())
        {
            selectedOption =
                (selectedOption + 1)
                % MENU_ITEMS_COUNT;

            Serial.print("[BTN] DOWN menu -> ");
            Serial.println(selectedOption);

            menuNeedsRedraw = true;
        }

        break;

    case TIMER_STATE:

        timerLoop();

        if (btnLeftPressed())
        {
            Serial.println("[BTN] LEFT timer -> menu");

            currentState = MENU_STATE;
            menuNeedsRedraw = true;
        }

        break;

    case SETTINGS_STATE:

        settingsLoop();

        if (btnLeftPressed())
        {
            Serial.println("[BTN] LEFT ajustes -> menu");

            currentState = MENU_STATE;
            menuNeedsRedraw = true;
        }

        break;
    
    case WEATHER_STATE:
        weatherLoop();

        if (btnLeftPressed())
        {
            Serial.println("[BTN] LEFT clock -> menu");

            currentState = MENU_STATE;
            menuNeedsRedraw = true;
        }

        break;

    case CLOCK_STATE:

        clockLoop();

        if (btnLeftPressed())
        {
            Serial.println("[BTN] LEFT clock -> menu");

            currentState = MENU_STATE;
            menuNeedsRedraw = true;
        }

        break;
    }
}
