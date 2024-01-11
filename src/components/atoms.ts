import { atom } from 'jotai';

export const pageAtom = atom<number>(1);
export const scaleAtom = atom<number>(0);
export const searchTextAtom = atom<string>('');
