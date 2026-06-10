#include "menu.h"

#include "../utils/display.h"
#include "../utils/buttons.h"

#include "functions/standby.h"
#include "functions/timer.h"
#include "functions/settings.h"

#include <Arduino.h>

enum AppState
{
    MENU_STATE,
    STANDBY_STATE,
    TIMER_STATE,
    SETTINGS_STATE
};

AppState currentState = MENU_STATE;

int selectedOption = 0;

const char *menuItems[] =
    {
        "Standby",
        "Timer",
        "Ajustes"
    };

const int MENU_ITEMS_COUNT = 3;

bool menuNeedsRedraw = true;

void drawMenu()
{
    display.clearDisplay();

    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);

    for (int i = 0; i < MENU_ITEMS_COUNT; i++)
    {
        display.setCursor(10, 10 + (i * 16));

        if (i == selectedOption)
        {
            display.print("> ");
        }
        else
        {
            display.print("  ");
        }

        display.print(menuItems[i]);
    }

    display.display();
}

void enterSelectedOption()
{
    switch (selectedOption)
    {
    case 0:
        standbySetup();
        currentState = STANDBY_STATE;
        break;

    case 1:
        timerSetup();
        currentState = TIMER_STATE;
        break;

    case 2:
        settingsSetup();
        currentState = SETTINGS_STATE;
        break;
    }
}

void menuSetup()
{
    displaySetup();

    buttonsSetup();

    selectedOption = 0;
    currentState = MENU_STATE;

    drawMenu();
}

void menuLoop()
{
    switch (currentState)
    {
    case MENU_STATE:

        if (btnUpPressed())
        {
            selectedOption--;

            if (selectedOption < 0)
            {
                selectedOption = MENU_ITEMS_COUNT - 1;
            }

            menuNeedsRedraw = true;
        }

        if (btnDownPressed())
        {
            selectedOption++;

            if (selectedOption >= MENU_ITEMS_COUNT)
            {
                selectedOption = 0;
            }

            menuNeedsRedraw = true;
        }

        if (btnRightPressed())
        {
            enterSelectedOption();
        }

        if (menuNeedsRedraw)
        {
            drawMenu();
            menuNeedsRedraw = false;
        }

        break;

    case STANDBY_STATE:

        standbyLoop();

        if (btnLeftPressed())
        {
            currentState = MENU_STATE;
            menuNeedsRedraw = true;
        }

        break;

    case TIMER_STATE:

        timerLoop();

        if (btnLeftPressed())
        {
            currentState = MENU_STATE;
            menuNeedsRedraw = true;
        }

        break;

    case SETTINGS_STATE:

        settingsLoop();

        if (btnLeftPressed())
        {
            currentState = MENU_STATE;
            menuNeedsRedraw = true;
        }

        break;
    }
}