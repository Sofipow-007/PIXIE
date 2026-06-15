[!PIXIE](./docs/images/pixie.png)

## Descripción

Reloj de escritorio inteligente construido con microcontrolador ESP32 y pantalla OLED de menos de 3 cm. Tiene distintas funciones que complementan su uso gracias a un botón:

1) Standby: Cuando no se usa, se muestra una cara animada con expresiones aleatorias

2) Reloj y fecha: Hora sincronizada por internet (NTP)

3) Clima en tiempo real: Temperatura y condición actual de tu ciudad. Se actualiza cada 5 minutos con una API gratuita

4) Timer: Cronómetro regresivo configurable, termina con sonido del buzzer

### Tecnologías y herramientas

- C++/C
- Librerías Adafruit SSD1306, Adafruit GFX, ArduinoJson, etc.
- Arduino IDE y VS Code con PlatformIO
- Wokwi (simulación de hardware)

#### Nota especial: Todo el código se encuentra en la rama 'development', por lo que todavía se encuentra en proceso

## Integrantes

- Sofia Power
- Thomas Barrera Fuentes
- Mauro Joel Beltrán
- Lautaro Gabriel Palombo