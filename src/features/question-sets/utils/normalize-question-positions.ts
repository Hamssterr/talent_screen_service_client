/**
 * Chuẩn hóa lại thứ tự `position` liên tục từ 1..N cho danh sách câu hỏi.
 */
export function normalizePositions<T extends { position: number }>(items: T[]): T[] {
  return items.map((item, index) => ({
    ...item,
    position: index + 1,
  }));
}

/**
 * Di chuyển một câu hỏi từ vị trí `fromIndex` sang `toIndex` và chuẩn hóa lại các vị trí.
 */
export function moveItem<T extends { position: number }>(
  items: T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  if (
    fromIndex < 0 ||
    fromIndex >= items.length ||
    toIndex < 0 ||
    toIndex >= items.length ||
    fromIndex === toIndex
  ) {
    return items;
  }

  const result = [...items];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);

  return normalizePositions(result);
}
