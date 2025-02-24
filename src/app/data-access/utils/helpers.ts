import { GuessItemModel } from '../models/guess-item.model';
import { SONGS } from './constants/songs.constants';
import { SOUNDS } from './constants/sounds.constants';

export function getRandomGuessItem(): GuessItemModel {
  const randomSongIndex = Math.floor(Math.random() * SONGS.length);
  const randomSoundIndex = Math.floor(Math.random() * SOUNDS.length);

  return {
    sound: SONGS[randomSoundIndex],
    song: SOUNDS[randomSongIndex],
  };
}
