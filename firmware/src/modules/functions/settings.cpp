#include "settings.h"

#include <Arduino.h>
#include <WiFi.h>
#include <Preferences.h>

#include "../../utils/display.h"
#include "../../utils/buttons.h"
#include "../../utils/prefs_keys.h"
#include "../../utils/list_menu.h"
#include "../../config.h"

// ── Pantallas de Ajustes ──────────────────────────────

enum SettingsScreen
{
    SETTINGS_LIST,
    SETTINGS_BRIGHTNESS,
    SETTINGS_TIMEZONE,
    SETTINGS_INFO,
    SETTINGS_RESTART_CONFIRM
};

SettingsScreen settingsScreen = SETTINGS_LIST;
bool settingsNeedsRedraw = true;

// ── Lista principal ────────────────────────────────────

int settingsSelected = 0;

const char *settingsItems[] = {
    "Brillo",
    "Zona horaria",
    "Info",
    "Reiniciar"
};

const int SETTINGS_ITEMS_COUNT = 4;

// ── Valores configurables (persisten en NVS) ──────────

bool dimEnabled;
int tzOffsetHours;

// ── Reiniciar (mantener 2s, igual que el reset del timer)

unsigned long restartHoldStart = 0;

// ======================================================
// PREFERENCES (guardado persistente)
// ======================================================

void loadPrefs()
{
    Serial.println("[SETTINGS] loadPrefs: antes de prefs.begin()");

    Preferences prefs;
    bool ok = prefs.begin(PREFS_NAMESPACE, true);

    Serial.print("[SETTINGS] loadPrefs: prefs.begin() devolvio ");
    Serial.println(ok ? "true" : "false");

    dimEnabled = prefs.getBool(PREFS_KEY_DIM, false);
    tzOffsetHours = prefs.getInt(PREFS_KEY_TZ_OFFSET, -3);

    Serial.println("[SETTINGS] loadPrefs: valores leidos, cerrando prefs.end()");

    prefs.end();

    Serial.println("[SETTINGS] loadPrefs: listo");
}

void saveDim(bool value)
{
    Preferences prefs;
    prefs.begin(PREFS_NAMESPACE, false);

    prefs.putBool(PREFS_KEY_DIM, value);

    prefs.end();
}

void saveTimezone(int value)
{
    Preferences prefs;
    prefs.begin(PREFS_NAMESPACE, false);

    prefs.putInt(PREFS_KEY_TZ_OFFSET, value);

    prefs.end();
}

// ======================================================
// DIBUJADO OLED
// ======================================================

void drawSettingsList()
{
    drawScrollingList(
        "--- AJUSTES ---",
        settingsItems,
        SETTINGS_ITEMS_COUNT,
        settingsSelected
    );
}

void drawBrightness()
{
    display.clearDisplay();

    display.setTextSize(1);
    display.setCursor(0, 0);
    display.print("BRILLO");

    display.setTextSize(2);
    display.setCursor(10, 25);
    display.print(dimEnabled ? "BAJO" : "ALTO");

    display.setTextSize(1);
    display.setCursor(0, 56);
    display.print("ARRIBA/ABAJO CAMBIA");

    display.display();
}

void drawTimezone()
{
    display.clearDisplay();

    display.setTextSize(1);
    display.setCursor(0, 0);
    display.print("ZONA HORARIA");

    char buffer[12];

    sprintf(
        buffer,
        "UTC%+d",
        tzOffsetHours
    );

    display.setTextSize(2);
    display.setCursor(10, 25);
    display.print(buffer);

    display.setTextSize(1);
    display.setCursor(0, 56);
    display.print("ARRIBA/ABAJO CAMBIA");

    display.display();
}

void drawInfo()
{
    display.clearDisplay();

    display.setTextSize(1);
    display.setCursor(0, 0);
    display.print("INFO");

    display.setCursor(0, 16);

    if (WiFi.status() == WL_CONNECTED)
    {
        display.print("WiFi: conectado");

        display.setCursor(0, 26);
        display.print(WiFi.localIP());
    }
    else
    {
        display.print("WiFi: sin conexion");
    }

    unsigned long totalSeconds = millis() / 1000;

    unsigned int hh = totalSeconds / 3600;
    unsigned int mm = (totalSeconds % 3600) / 60;
    unsigned int ss = totalSeconds % 60;

    char buffer[16];

    sprintf(
        buffer,
        "%02u:%02u:%02u",
        hh,
        mm,
        ss
    );

    display.setCursor(0, 42);
    display.print("Encendido:");

    display.setCursor(0, 52);
    display.print(buffer);

    display.display();
}

void drawRestartConfirm()
{
    display.clearDisplay();

    display.setTextSize(1);
    display.setCursor(0, 0);
    display.print("REINICIAR");

    display.setCursor(0, 25);
    display.print("Manten DERECHA");

    display.setCursor(0, 35);
    display.print("2s para reiniciar");

    display.display();
}

// ======================================================
// SETUP
// ======================================================

void settingsSetup()
{
    Serial.println("[SETTINGS] settingsSetup: arranco");

    loadPrefs();

    Serial.println("[SETTINGS] settingsSetup: antes de display.dim()");

    display.dim(dimEnabled);

    Serial.println("[SETTINGS] settingsSetup: despues de display.dim()");

    settingsSelected = 0;
    settingsScreen = SETTINGS_LIST;
    settingsNeedsRedraw = true;
    restartHoldStart = 0;

    Serial.print("[SETTINGS] Setup OK - dim=");
    Serial.print(dimEnabled);
    Serial.print(" tz=");
    Serial.println(tzOffsetHours);
}

// ======================================================
// LOOP
// ======================================================

void settingsLoop()
{
    switch (settingsScreen)
    {

    // --------------------------------------------------
    // LISTA PRINCIPAL
    // --------------------------------------------------

    case SETTINGS_LIST:

        if (settingsNeedsRedraw)
        {
            drawSettingsList();
            settingsNeedsRedraw = false;
        }

        if (btnUpPressed())
        {
            settingsSelected =
                (settingsSelected - 1 + SETTINGS_ITEMS_COUNT)
                % SETTINGS_ITEMS_COUNT;

            Serial.print("[SETTINGS] UP -> ");
            Serial.println(settingsSelected);

            settingsNeedsRedraw = true;
        }

        if (btnDownPressed())
        {
            settingsSelected =
                (settingsSelected + 1)
                % SETTINGS_ITEMS_COUNT;

            Serial.print("[SETTINGS] DOWN -> ");
            Serial.println(settingsSelected);

            settingsNeedsRedraw = true;
        }

        if (btnRightPressed())
        {
            Serial.print("[SETTINGS] RIGHT en item ");
            Serial.print(settingsSelected);
            Serial.print(" (");
            Serial.print(settingsItems[settingsSelected]);
            Serial.println(")");

            switch (settingsSelected)
            {
            case 0:
                settingsScreen = SETTINGS_BRIGHTNESS;
                break;

            case 1:
                settingsScreen = SETTINGS_TIMEZONE;
                break;

            case 2:
                settingsScreen = SETTINGS_INFO;
                break;

            case 3:
                settingsScreen = SETTINGS_RESTART_CONFIRM;
                restartHoldStart = 0;
                break;
            }

            settingsNeedsRedraw = true;
        }

        // IZQUIERDA no se lee aca. El volver al menu principal
        // lo maneja menu.cpp (SETTINGS_STATE). Si leyeramos
        // btnLeftPressed() en este nivel, consumiriamos el
        // flanco antes de que menu.cpp lo detecte y el boton
        // dejaria de funcionar (mismo bug que tenia Clock).

        break;

    // --------------------------------------------------
    // BRILLO
    // --------------------------------------------------

    case SETTINGS_BRIGHTNESS:

        if (settingsNeedsRedraw)
        {
            drawBrightness();
            settingsNeedsRedraw = false;
        }

        if (btnUpPressed() || btnDownPressed())
        {
            dimEnabled = !dimEnabled;

            display.dim(dimEnabled);
            saveDim(dimEnabled);

            settingsNeedsRedraw = true;
        }

        if (btnLeftPressed())
        {
            Serial.println("[SETTINGS] LEFT brillo -> lista");

            settingsScreen = SETTINGS_LIST;
            settingsNeedsRedraw = true;
        }

        break;

    // --------------------------------------------------
    // ZONA HORARIA
    // --------------------------------------------------

    case SETTINGS_TIMEZONE:

        if (settingsNeedsRedraw)
        {
            drawTimezone();
            settingsNeedsRedraw = false;
        }

        if (btnUpPressed())
        {
            if (tzOffsetHours < 14)
                tzOffsetHours++;

            saveTimezone(tzOffsetHours);
            settingsNeedsRedraw = true;
        }

        if (btnDownPressed())
        {
            if (tzOffsetHours > -12)
                tzOffsetHours--;

            saveTimezone(tzOffsetHours);
            settingsNeedsRedraw = true;
        }

        if (btnLeftPressed())
        {
            Serial.println("[SETTINGS] LEFT zona horaria -> lista");

            settingsScreen = SETTINGS_LIST;
            settingsNeedsRedraw = true;
        }

        break;

    // --------------------------------------------------
    // INFO
    // --------------------------------------------------

    case SETTINGS_INFO:

        // Se redibuja siempre (sin flag) para que el
        // contador de "Encendido" se vea avanzar.

        drawInfo();

        if (btnLeftPressed())
        {
            Serial.println("[SETTINGS] LEFT info -> lista");

            settingsScreen = SETTINGS_LIST;
            settingsNeedsRedraw = true;
        }

        delay(200);

        break;

    // --------------------------------------------------
    // REINICIAR
    // --------------------------------------------------

    case SETTINGS_RESTART_CONFIRM:

        if (settingsNeedsRedraw)
        {
            drawRestartConfirm();
            settingsNeedsRedraw = false;
        }

        if (digitalRead(BTN_RIGHT) == LOW)
        {
            if (restartHoldStart == 0)
                restartHoldStart = millis();

            if (millis() - restartHoldStart >= 2000)
                ESP.restart();
        }
        else
        {
            restartHoldStart = 0;
        }

        if (btnLeftPressed())
        {
            Serial.println("[SETTINGS] LEFT reiniciar -> lista");

            settingsScreen = SETTINGS_LIST;
            settingsNeedsRedraw = true;
        }

        break;
    }
}
