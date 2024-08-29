import { ARROW_HEIGHT } from '@/data/constants';

export function drawArrow(
  context: any,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
) {
  context.strokeStyle = 'red'; // Arrow color
  context.fillStyle = 'red'; // Head arrow color
  context.lineWidth = 2;

  const angle = Math.atan2(toY - fromY, toX - fromX);

  // Draw principal arrow line
  context.beginPath();
  context.moveTo(fromX, fromY);
  context.lineTo(toX, toY);
  context.stroke();

  // Draw arrow head
  context.beginPath();
  context.moveTo(toX, toY);
  context.lineTo(
    toX - ARROW_HEIGHT * Math.cos(angle - Math.PI / 6),
    toY - ARROW_HEIGHT * Math.sin(angle - Math.PI / 6)
  );
  context.lineTo(
    toX - ARROW_HEIGHT * Math.cos(angle + Math.PI / 6),
    toY - ARROW_HEIGHT * Math.sin(angle + Math.PI / 6)
  );
  context.lineTo(toX, toY);
  context.closePath();
  context.fill();
}
