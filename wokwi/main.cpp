#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

// OLED I2C
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// ---------- CARAS ----------

// Cara normal
void caraNormal() {
  display.clearDisplay();

  // Ojos
  display.fillCircle(40, 24, 8, WHITE);
  display.fillCircle(88, 24, 8, WHITE);

  // Boca feliz
  display.drawLine(50, 45, 78, 45, WHITE);
  display.drawPixel(49, 44, WHITE);
  display.drawPixel(79, 44, WHITE);

  display.display();
}

// Cara parpadeando
void caraParpadeo() {
  display.clearDisplay();

  // Ojos cerrados
  display.drawLine(32, 24, 48, 24, WHITE);
  display.drawLine(80, 24, 96, 24, WHITE);

  // Boca feliz
  display.drawLine(50, 45, 78, 45, WHITE);

  display.display();
}

// Cara sorprendida
void caraSorprendida() {
  display.clearDisplay();

  // Ojos grandes
  display.drawCircle(40, 24, 8, WHITE);
  display.drawCircle(88, 24, 8, WHITE);

  // Boca abierta
  display.drawCircle(64, 46, 6, WHITE);

  display.display();
}

// ---------- SETUP ----------

void setup() {
  Serial.begin(115200);

  // Inicializar OLED
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("No se encontró la OLED");
    while (true);
  }

  display.clearDisplay();
  display.display();
}

// ---------- LOOP ----------

void loop() {

  // Cara normal
  caraNormal();
  delay(1500);

  // Parpadeo rápido
  caraParpadeo();
  delay(150);

  caraNormal();
  delay(1000);

  // Cara sorprendida
  caraSorprendida();
  delay(1200);
}