import gifAngry from '../../../firmware/src/resouces/animaciones/gif/pixie angriy.gif';
import gifBlink from '../../../firmware/src/resouces/animaciones/gif/pixie blink.gif';
import gifBoring from '../../../firmware/src/resouces/animaciones/gif/pixie boring.gif';
import gifCry1 from '../../../firmware/src/resouces/animaciones/gif/pixie cry 1.gif';
import gifCry2 from '../../../firmware/src/resouces/animaciones/gif/pixie cry 2.gif';
import gifHappy from '../../../firmware/src/resouces/animaciones/gif/pixie happy.gif';
import gifZzz1 from '../../../firmware/src/resouces/animaciones/gif/pixie zzz 1.gif';
import gifZzz2 from '../../../firmware/src/resouces/animaciones/gif/pixie zzz 2.gif';

export const gifs = {
  angry: gifAngry,
  blink: gifBlink,
  boring: gifBoring,
  cry1: gifCry1,
  cry2: gifCry2,
  happy: gifHappy,
  zzz1: gifZzz1,
  zzz2: gifZzz2,
} as const;

export const gifCycleDay = [gifHappy, gifBlink, gifBoring, gifZzz1];
export const gifCycleAll = [gifHappy, gifBlink, gifBoring, gifAngry, gifZzz1, gifZzz2, gifCry1, gifCry2];
