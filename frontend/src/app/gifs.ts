import blink  from '../../firmware/src/resouces/animaciones/gif/pixie blink.gif';
import happy  from '../../firmware/src/resouces/animaciones/gif/pixie happy.gif';
import boring from '../../firmware/src/resouces/animaciones/gif/pixie boring.gif';
import angry  from '../../firmware/src/resouces/animaciones/gif/pixie angriy.gif';
import zzz1   from '../../firmware/src/resouces/animaciones/gif/pixie zzz 1.gif';
import zzz2   from '../../firmware/src/resouces/animaciones/gif/pixie zzz 2.gif';
import cry1   from '../../firmware/src/resouces/animaciones/gif/pixie cry 1.gif';
import cry2   from '../../firmware/src/resouces/animaciones/gif/pixie cry 2.gif';

import type { GifKey } from './types';
export const GIFS: Record<GifKey, string> = { blink, happy, boring, angry, zzz1, zzz2, cry1, cry2 };