import { BUTTON_HEIGHT } from "./Values";

/**
 * 주어진 Y 좌표(offsetY)에서 가장 가까운 중앙 위치 반환
 */
export const getCenterPosition = (offsetY: number): number => {
  return getIndexFromOffset(offsetY) * BUTTON_HEIGHT;
};

/**
 * 주어진 인덱스에서 중앙 위치 반환
 */
export const getCenterPositionFromIndex = (index: number): number => {
  return index * BUTTON_HEIGHT;
};

/**
 * 주어진 Y 좌표(offsetY)에서 가장 가까운 인덱스 반환
 */
export const getIndexFromOffset = (offsetY: number): number => {
  return Math.round(offsetY / BUTTON_HEIGHT);
};

/**
 * 리스트에 공백 요소를 추가하여 보이는 개수를 맞춤
 */
export const fillEmpty = (visibleCount: number, values: string[]): string[] => {
  const filledValues = [...values]; // 원본 배열을 수정하지 않기 위해 복사
  const fillCount = (visibleCount - 1) / 2;
  for (let i = 0; i < fillCount; i++) {
    filledValues.unshift("");
    filledValues.push("");
  }
  return filledValues;
};

/**
 * 주어진 날짜를 Time Picker 형식으로 변환
 */
export const asPickerFormat = (date: Date): Date => {
  const _date = new Date(date.getTime());
  const hour = _date.getHours();
  const min = _date.getMinutes();

  _date.setTime(Date.now());
  _date.setHours(hour);
  _date.setMinutes(min + (5 - (min % 5)));
  _date.setSeconds(0);
  _date.setMilliseconds(0);

  return _date;
};
