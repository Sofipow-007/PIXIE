#include "list_menu.h"

#include "display.h"

// Estos valores asumen textSize(1) y el layout que ya venian
// usando menu.cpp y settings.cpp (titulo en y=0, primer item
// en y=12, 13px entre lineas). Si algun dia cambia el tamaño
// de fuente o la resolucion del OLED, hay que ajustarlos aca.

const int TITLE_Y = 0;
const int FIRST_ITEM_Y = 12;
const int LINE_HEIGHT = 13;
const int VISIBLE_ROWS = 4; // (64 - 12) / 13, redondeado hacia abajo

void drawScrollingList(
    const char *title,
    const char *const items[],
    int itemCount,
    int selectedIndex
)
{
    display.clearDisplay();

    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);

    display.setCursor(0, TITLE_Y);
    display.print(title);

    int visibleRows = VISIBLE_ROWS;

    if (visibleRows > itemCount)
        visibleRows = itemCount;

    // Fila de pantalla donde queremos que quede el cursor.
    // Con 4 filas visibles esto da la fila 1 (la 2da de 4),
    // lo mas centrado posible sin una fila del medio exacta.

    int cursorRow = (visibleRows - 1) / 2;

    // A partir de donde arranca la ventana visible para que
    // el item seleccionado caiga en cursorRow.

    int windowStart = selectedIndex - cursorRow;

    int maxStart = itemCount - visibleRows;
    if (maxStart < 0)
        maxStart = 0;

    if (windowStart > maxStart)
        windowStart = maxStart;

    if (windowStart < 0)
        windowStart = 0;

    for (int row = 0; row < visibleRows; row++)
    {
        int itemIndex = windowStart + row;

        if (itemIndex >= itemCount)
            break;

        display.setCursor(0, FIRST_ITEM_Y + (row * LINE_HEIGHT));

        if (itemIndex == selectedIndex)
            display.print("> ");
        else
            display.print("  ");

        display.print(items[itemIndex]);
    }

    display.display();
}
