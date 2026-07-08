#include "standby.h"

#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

#include <utils/display.h>
#include "../../resouces/animaciones/PIXIE START/hexa/animation_start.h"


struct Animation {
  const unsigned char** frames;
  uint8_t frameCount;
  uint16_t frameDelay;
};

Animation angryAnimation = {
  epd_bitmap_allArray,
  epd_bitmap_allArray_LEN,
  120
};

void drawFrame(const unsigned char* frame) {
  display.clearDisplay();
  display.drawBitmap(
    0,
    0,
    frame,
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    WHITE
  );
  display.display();
}

void playAnimation(const Animation& anim) {
  for (uint8_t i = 0; i < anim.frameCount; i++) {
    drawFrame(anim.frames[i]);
    delay(anim.frameDelay);
  }
}

void standbySetup() {
  Wire.begin();

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    while (true) {
    }
  }

  display.clearDisplay();
  display.display();

  playAnimation(angryAnimation);
}

void standbyLoop() {
  // La animación de prueba se muestra al entrar a standby.
}

