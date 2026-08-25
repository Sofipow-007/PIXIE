#ifndef PREFS_KEYS_H
#define PREFS_KEYS_H

// Namespace y claves compartidas para Preferences (NVS).
// Ajustes escribe estos valores y otros modulos (ej: Clock)
// los leen, asi que viven en un solo lugar para no repetir
// los strings (y arriesgarse a un typo entre archivos).

#define PREFS_NAMESPACE      "pixie"
#define PREFS_KEY_DIM         "dim"
#define PREFS_KEY_TZ_OFFSET   "tz_offset"

#endif
