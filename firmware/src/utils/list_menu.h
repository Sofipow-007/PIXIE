#ifndef LIST_MENU_H
#define LIST_MENU_H

// Dibuja un titulo + una lista de items navegable.
//
// Si la lista completa entra en pantalla, se dibuja tal cual
// (como hacia antes cada menu por su cuenta). Si no entra, la
// ventana visible se desplaza para que el cursor ">" quede
// siempre fijo en la fila del medio, y son los items los que
// van scrolleando arriba/abajo -- excepto cerca de las puntas
// de la lista (primer/ultimo item), donde no hay mas contenido
// para scrollear y el cursor se corre del centro.
void drawScrollingList(
    const char *title,
    const char *const items[],
    int itemCount,
    int selectedIndex
);

#endif
