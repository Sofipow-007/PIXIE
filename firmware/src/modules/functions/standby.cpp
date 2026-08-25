#include "standby.h"

#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

#include <utils/display.h>
#include "../../utils/buttons.h"
#include "../../resouces/animaciones/PIXIE START/hexa/animation_start.h"


struct Animation {
  const unsigned char** frames;
  uint8_t frameCount;
  uint16_t frameDelay;
};

Animation introAnimation = {
  epd_bitmap_allArray,
  epd_bitmap_allArray_LEN,
  120
};

// La animacion de intro se reproduce una unica vez por
// encendido/reset. Una vez mostrada, volver a standby desde
// el menu no la repite.
bool introAlreadyPlayed = false;

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

void playIntroAnimation(const Animation& anim) {
  for (uint8_t i = 0; i < anim.frameCount; i++) {
    drawFrame(anim.frames[i]);

    // DERECHA omite el resto de la animacion.
    if (btnRightPressed()) {
      break;
    }

    delay(anim.frameDelay);
  }
}

void standbySetup() {
  // El init de la pantalla (Wire.begin / display.begin) ya lo
  // hace displaySetup() una sola vez al arrancar (menuSetup()),
  // no hace falta repetirlo cada vez que volvemos a standby.

  if (!introAlreadyPlayed) {
    playIntroAnimation(introAnimation);
    introAlreadyPlayed = true;
  } else {
    // La intro ya se mostro una vez: dejamos la pantalla en el
    // ultimo frame en vez de repetir toda la animacion.
    drawFrame(introAnimation.frames[introAnimation.frameCount - 1]);
  }
}

void standbyLoop() {
  // La animación de intro ya se mostró (una sola vez) en standbySetup().
}
