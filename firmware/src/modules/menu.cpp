#include "menu.h"

#include "../utils/display.h"
#include "../utils/buttons.h"

#include "functions/standby.h"
#include "functions/timer.h"
#include "functions/settings.h"

#include <Arduino.h>

// ── Estados ───────────────────────────────────────────────────────────────────

enum AppState
{
    STANDBY_STATE,
    MENU_STATE,
    TIMER_STATE,
    SETTINGS_STATE
};

AppState currentState = STANDBY_STATE;

// ── Menú ──────────────────────────────────────────────────────────────────────

int selectedOption = 0;

const char *menuItems[] = { "Reloj", "Timer", "Ajustes", "Volver" };
const int MENU_ITEMS_COUNT = 4;

bool menuNeedsRedraw = true;

void drawMenu()
{
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);

    display.setCursor(0, 0);
    display.print("--- PIXIE ---");

    for (int i = 0; i < MENU_ITEMS_COUNT; i++)
    {
        display.setCursor(0, 12 + (i * 13));
        display.print(i == selectedOption ? "> " : "  ");
        display.print(menuItems[i]);
    }

    display.display();
}

void enterSelectedOption()
{
    switch (selectedOption)
    {
    case 0:
        Serial.println("[MENU] Reloj (no impl.)");
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
        Serial.println("[MENU] Volviendo a Standby");
        standbySetup();
        currentState = STANDBY_STATE;
        break;
    }
}

// ── Setup / Loop ──────────────────────────────────────────────────────────────

void menuSetup()
{
    Serial.begin(115200);
    displaySetup();
    buttonsSetup();

    standbySetup();
    currentState = STANDBY_STATE;
}

void menuLoop()
{
    switch (currentState)
    {

    case STANDBY_STATE:
        standbyLoop();

        if (btnRightPressed())
        {
            Serial.println("[BTN] RIGHT standby -> menu");
            selectedOption  = 0;
            currentState    = MENU_STATE;
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
            selectedOption = (selectedOption - 1 + MENU_ITEMS_COUNT) % MENU_ITEMS_COUNT;
            Serial.print("[BTN] UP menu -> ");
            Serial.println(selectedOption);
            menuNeedsRedraw = true;
        }

        if (btnDownPressed())
        {
            selectedOption = (selectedOption + 1) % MENU_ITEMS_COUNT;
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
            currentState    = MENU_STATE;
            menuNeedsRedraw = true;
        }
        break;

    case SETTINGS_STATE:
        settingsLoop();

        if (btnLeftPressed())
        {
            Serial.println("[BTN] LEFT ajustes -> menu");
            currentState    = MENU_STATE;
            menuNeedsRedraw = true;
        }
        break;
    }
}