import { atom } from 'jotai';

type fileInfoType = {
  name: string;
  url: string;
};

export const fileAtom = atom<fileInfoType | null>(null);

export const pageAtom = atom<number>(1);
export const scaleAtom = atom<number>(1);
export const searchTextAtom = atom<string>('');

export const totalPagesAtom = atom<number>(0);
