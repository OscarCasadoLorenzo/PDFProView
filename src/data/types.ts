export type FileInfoType = {
  name: string;
  url: string;
};

export type OCRMark = {
  x: number;
  y: number;
  page: number;
  id: number;
  description: string;
  text: string;
};
