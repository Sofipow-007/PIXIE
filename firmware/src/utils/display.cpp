#include "display.h"

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

void displaySetup()
{
    Wire.begin();

    display.begin(
        SSD1306_SWITCHCAPVCC,
        0x3C
    );

    display.clearDisplay();
    display.display();
}