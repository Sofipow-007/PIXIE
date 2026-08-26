#include "display.h"

#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

Adafruit_SSD1306 display(
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    &Wire,
    -1
);

bool displayReady = false;

void displaySetup()
{
    // Si el I2C esta flojo/mal cableado, una transaccion puede
    // quedarse esperando una respuesta que nunca llega. Sin este
    // limite, eso termina en un reset por watchdog (TG1WDT_SYS_RESET)
    // y un bucle de reinicios infinito que desde afuera parece que
    // "no prende". Con el timeout, en el peor caso la pantalla
    // simplemente no arranca, pero el resto del firmware sigue.
    Wire.setTimeOut(1000);
    Wire.begin();

    displayReady = display.begin(
        SSD1306_SWITCHCAPVCC,
        0x3C
    );

    if (!displayReady)
    {
        Serial.println(
            "[DISPLAY] No se pudo inicializar la OLED "
            "(revisar cableado I2C: SDA=21, SCL=22, VCC, GND)"
        );
        return;
    }

    display.clearDisplay();
    display.display();
}