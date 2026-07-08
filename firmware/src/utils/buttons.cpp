#include "buttons.h"
#include "../config.h"

#include <Arduino.h>

bool lastUp = HIGH;
bool lastDown = HIGH;
bool lastRight = HIGH;
bool lastLeft = HIGH;

void buttonsSetup()
{
    pinMode(BTN_UP, INPUT_PULLUP);
    pinMode(BTN_DOWN, INPUT_PULLUP);
    pinMode(BTN_RIGHT, INPUT_PULLUP);
    pinMode(BTN_LEFT, INPUT_PULLUP);
}

bool detectPress(int pin, bool &lastState)
{
    bool current = digitalRead(pin);

    if (lastState == HIGH && current == LOW)
    {
        lastState = current;
        return true;
    }

    lastState = current;
    return false;
}

bool btnUpPressed()
{
    return detectPress(BTN_UP, lastUp);
}

bool btnDownPressed()
{
    return detectPress(BTN_DOWN, lastDown);
}

bool btnRightPressed()
{
    return detectPress(BTN_RIGHT, lastRight);
}

bool btnLeftPressed()
{
    return detectPress(BTN_LEFT, lastLeft);
}