export function extractBinaryWithDrop(event: React.DragEvent<HTMLDivElement>) {
  event.preventDefault();
  return event.dataTransfer.files[0];
}

export function extractBinaryWithInput(
  event: React.ChangeEvent<HTMLInputElement>
) {
  event.preventDefault();
  if (event.target.files) return event.target.files[0];
  return;
}
