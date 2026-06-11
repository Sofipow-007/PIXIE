#include "timer.h"

#include <Arduino.h>

#include "../../utils/display.h"
#include "../../utils/buttons.h"
#include "../../config.h"

enum TimerState
{
    SETTING,
    RUNNING,
    PAUSED,
    FINISHED
};

enum SelectedField
{
    MINUTES,
    SECONDS
};

TimerState timerState;
SelectedField selectedField;

int minutes;
int seconds;

unsigned long lastTick;
unsigned long rightPressStart;

// ======================================================
// UTILIDADES
// ======================================================

int getTotalSeconds()
{
    return (minutes * 60) + seconds;
}

void fromTotalSeconds(int total)
{
    minutes = total / 60;
    seconds = total % 60;
}

void resetTimer()
{
    timerState = SETTING;

    minutes = 5;
    seconds = 0;

    selectedField = MINUTES;
}


// ======================================================
// DIBUJADO OLED
// ======================================================

void drawTimer()
{
    display.clearDisplay();

    display.setTextSize(1);
    display.setCursor(0, 0);
    display.print("TIMER");

    char buffer[10];

    sprintf(
        buffer,
        "%02d:%02d",
        minutes,
        seconds
    );

    display.setTextSize(3);
    display.setCursor(10, 18);
    display.print(buffer);

    display.setTextSize(1);

    if (timerState == SETTING)
    {
        display.setCursor(0, 56);

        if (selectedField == MINUTES)
            display.print("EDITANDO MIN");
        else
            display.print("EDITANDO SEG");
    }

    else if (timerState == RUNNING)
    {
        display.setCursor(0, 56);
        display.print("CORRIENDO");
    }

    else if (timerState == PAUSED)
    {
        display.setCursor(0, 56);
        display.print("PAUSADO");
    }

    else if (timerState == FINISHED)
    {
        display.setCursor(0, 56);
        display.print("TERMINADO");
    }

    display.display();
}

// ======================================================
// SETUP
// ======================================================

void timerSetup()
{
    resetTimer();

    lastTick = 0;
    rightPressStart = 0;
}

// ======================================================
// LOOP
// ======================================================

void timerLoop()
{
    // ----------------------------------
    // DERECHA MANTENIDO 2s = RESET
    // ----------------------------------

    if (digitalRead(BTN_RIGHT) == LOW)
    {
        if (rightPressStart == 0)
        {
            rightPressStart = millis();
        }

        if (millis() - rightPressStart >= 2000)
        {
            resetTimer();

            rightPressStart = 0;
        }
    }
    else
    {
        rightPressStart = 0;
    }

    // ----------------------------------
    // CONFIGURACION
    // ----------------------------------

    if (timerState == SETTING)
    {
        // ARRIBA
        // Incrementa el campo seleccionado

        if (btnUpPressed())
        {
            if (selectedField == MINUTES)
            {
                if (minutes < 99)
                    minutes++;
            }
            else
            {
                seconds++;

                if (seconds > 59)
                    seconds = 0;
            }
        }

        // ABAJO
        // Cambia entre minutos y segundos

        if (btnDownPressed())
        {
            if (selectedField == MINUTES)
                selectedField = SECONDS;
            else
                selectedField = MINUTES;
        }

        // DERECHA
        // Inicia timer

        if (btnRightPressed())
        {
            if (getTotalSeconds() > 0)
            {
                timerState = RUNNING;

                lastTick = millis();
            }
        }

        // IZQUIERDA
        // TODO: volver al menu
    }

    // ----------------------------------
    // CORRIENDO
    // ----------------------------------

    else if (timerState == RUNNING)
    {
        if (millis() - lastTick >= 1000)
        {
            int total = getTotalSeconds();

            if (total > 0)
            {
                total--;

                fromTotalSeconds(total);
            }

            lastTick = millis();

            if (total <= 0)
            {
                timerState = FINISHED;
            }
        }

        // DERECHA
        // Pausa

        if (btnRightPressed())
        {
            timerState = PAUSED;
        }

        // IZQUIERDA
        // TODO: volver al menu
    }

    // ----------------------------------
    // PAUSADO
    // ----------------------------------

    else if (timerState == PAUSED)
    {
        // DERECHA
        // Reanuda

        if (btnRightPressed())
        {
            timerState = RUNNING;

            lastTick = millis();
        }

        // IZQUIERDA
        // TODO: volver al menu
    }

    // ----------------------------------
    // TERMINADO
    // ----------------------------------

    else if (timerState == FINISHED)
    {
        // TODO:
        // buzzer 3 veces

        if (btnRightPressed())
        {
            resetTimer();
        }
    }
    drawTimer();
}