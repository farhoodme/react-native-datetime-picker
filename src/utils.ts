import dayjs from 'dayjs';
import type { DateType, IDayObject } from './types';

export const CALENDAR_FORMAT = 'YYYY-MM-DD HH:mm';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const YEAR_PAGE_SIZE = 12;

export const getMonths = () => dayjs.months();

export const getMonthName = (month: number) => dayjs.months()[month];

export const getWeekdays = () => dayjs.weekdays();

export const getWeekdaysShort = () => dayjs.weekdaysShort();

export const getWeekdaysMin = (firstDayOfWeek: number) => {
  let days = dayjs.weekdaysMin();
  if (firstDayOfWeek > 0) {
    days = [
      ...days.slice(firstDayOfWeek, days.length),
      ...days.slice(0, firstDayOfWeek),
    ] as dayjs.WeekdayNames;
  }
  return days;
};

export const getFormated = (date: DateType) =>
  dayjs(date).format(CALENDAR_FORMAT);

export const getDateMonth = (date: DateType) => dayjs(date).month();

export const getDateYear = (date: DateType) => dayjs(date).year();

export const getToday = () => dayjs().format(DATE_FORMAT);

export function areDatesOnSameDay(a: DateType, b: DateType) {
  if (!a || !b) {
    return false;
  }

  const date_a = dayjs(a).format(DATE_FORMAT);
  const date_b = dayjs(b).format(DATE_FORMAT);

  return date_a === date_b;
}

export function isDateBetween(
  date: DateType,
  {
    startDate,
    endDate,
  }: {
    startDate?: DateType;
    endDate?: DateType;
  }
): boolean {
  if (!startDate || !endDate) {
    return false;
  }

  return dayjs(date) <= endDate && dayjs(date) >= startDate;
}

export function isDateDisabled(
  date: dayjs.Dayjs,
  {
    minDate,
    maxDate,
    disabledDates,
  }: {
    minDate?: DateType;
    maxDate?: DateType;
    disabledDates?: DateType[] | ((date: DateType) => boolean) | undefined;
  }
): boolean {
  if (minDate && date < getDate(minDate)) return true;
  if (maxDate && date > getDate(maxDate)) return true;

  if (disabledDates) {
    if (Array.isArray(disabledDates)) {
      const isDisabled = disabledDates.some((disabledDate) =>
        areDatesOnSameDay(date, disabledDate)
      );
      return isDisabled;
    } else if (disabledDates instanceof Function) {
      return disabledDates(date);
    }
  }

  return false;
}

export function isYearDisabled(
  year: number,
  {
    minDate,
    maxDate,
  }: {
    minDate?: DateType;
    maxDate?: DateType;
  }
): boolean {
  if (minDate && year < getDateYear(minDate)) return true;
  if (maxDate && year > getDateYear(maxDate)) return true;

  return false;
}

export function isMonthDisabled(
  month: number,
  date: DateType,
  {
    minDate,
    maxDate,
  }: {
    minDate?: DateType;
    maxDate?: DateType;
  }
): boolean {
  if (minDate && month < getDateMonth(minDate) && getDateYear(date) === getDateYear(minDate)) return true;
  if (maxDate && month > getDateMonth(maxDate) && getDateYear(date) === getDateYear(maxDate)) return true;

  return false;
}

export const getFormatedDate = (date: DateType, format: string) =>
  dayjs(date).format(format);

export const getDate = (date: DateType) => dayjs(date, DATE_FORMAT);

export const getYearRange = (year: number) => {
  const endYear = YEAR_PAGE_SIZE * Math.ceil(year / YEAR_PAGE_SIZE);
  let startYear = endYear === year ? endYear : endYear - YEAR_PAGE_SIZE;

  if (startYear < 0) {
    startYear = 0;
  }
  return Array.from({ length: YEAR_PAGE_SIZE }, (_, i) => startYear + i);
};

export function getDaysInMonth(
  date: DateType,
  displayFullDays: boolean | undefined,
  firstDayOfWeek: number
) {
  const daysInCurrentMonth = dayjs(date).daysInMonth();

  const prevMonthDays = dayjs(date).add(-1, 'month').daysInMonth();
  const firstDay = dayjs(date).date(1 - firstDayOfWeek);
  const prevMonthOffset = firstDay.day() % 7;
  const daysInPrevMonth = displayFullDays ? prevMonthOffset : 0;
  const monthDaysOffset = prevMonthOffset + daysInCurrentMonth;
  const daysInNextMonth = displayFullDays
    ? monthDaysOffset > 35
      ? 42 - monthDaysOffset
      : 35 - monthDaysOffset
    : 0;

  const fullDaysInMonth =
    daysInPrevMonth + daysInCurrentMonth + daysInNextMonth;

  return {
    prevMonthDays,
    prevMonthOffset,
    daysInCurrentMonth,
    daysInNextMonth,
    fullDaysInMonth,
  };
}

export function getFirstDayOfMonth(
  date: DateType,
  firstDayOfWeek: number
): number {
  const d = getDate(date);
  return d.date(1 - firstDayOfWeek).day();
}

export function getStartOfDay(date: DateType): DateType {
  return dayjs(date).startOf('day');
}

export function getEndOfDay(date: DateType): DateType {
  return dayjs(date).endOf('day');
}

export function dateToUnix(date: DateType): number {
  return dayjs(date).unix();
}

/**
 * Get detailed date object
 *
 * @param date Get detailed date object
 *
 * @returns parsed date object
 */
export const getParsedDate = (date: DateType) => {
  return {
    year: dayjs(date).year(),
    month: dayjs(date).month(),
    hour: dayjs(date).hour(),
    minute: dayjs(date).minute(),
  };
};

/**
 * Calculate month days array based on current date
 *
 * @param datetime - The current date that selected
 * @param displayFullDays
 * @param minDate - min selectable date
 * @param maxDate - max selectable date
 * @param disabledDates - array of disabled dates, or a function that returns true for a given date
 * @param firstDayOfWeek - first day of week, number 0-6, 0 – Sunday, 6 – Saturday
 *
 * @returns days array based on current date
 */
export const getMonthDays = (
  datetime: DateType = dayjs(),
  displayFullDays: boolean,
  minDate: DateType,
  maxDate: DateType,
  firstDayOfWeek: number,
  disabledDates: DateType[] | ((date: DateType) => boolean) | undefined
): IDayObject[] => {
  const date = getDate(datetime);
  const {
    prevMonthDays,
    prevMonthOffset,
    daysInCurrentMonth,
    daysInNextMonth,
  } = getDaysInMonth(datetime, displayFullDays, firstDayOfWeek);

  const prevDays = displayFullDays
    ? Array.from({ length: prevMonthOffset }, (_, index) => {
        const day = index + (prevMonthDays - prevMonthOffset + 1);
        const thisDay = date.add(-1, 'month').date(day);
        return generateDayObject(
          day,
          thisDay,
          minDate,
          maxDate,
          disabledDates,
          false,
          index + 1
        );
      })
    : Array(prevMonthOffset).fill(null);

  const currentDays = Array.from({ length: daysInCurrentMonth }, (_, index) => {
    const day = index + 1;
    const thisDay = date.date(day);
    return generateDayObject(
      day,
      thisDay,
      minDate,
      maxDate,
      disabledDates,
      true,
      prevMonthOffset + day
    );
  });

  const nextDays = Array.from({ length: daysInNextMonth }, (_, index) => {
    const day = index + 1;
    const thisDay = date.add(1, 'month').date(day);
    return generateDayObject(
      day,
      thisDay,
      minDate,
      maxDate,
      disabledDates,
      false,
      daysInCurrentMonth + prevMonthOffset + day
    );
  });

  return [...prevDays, ...currentDays, ...nextDays];
};

/**
 * Generate day object for displaying inside day cell
 *
 * @param day - number of day
 * @param date - calculated date based on day, month, and year
 * @param minDate - min selectable date
 * @param maxDate - max selectable date
 * @param disabledDates - array of disabled dates, or a function that returns true for a given date
 * @param isCurrentMonth - define the day is in the current month
 *
 * @returns days object based on current date
 */
const generateDayObject = (
  day: number,
  date: dayjs.Dayjs,
  minDate: DateType,
  maxDate: DateType,
  disabledDates: DateType[] | ((date: DateType) => boolean) | undefined,
  isCurrentMonth: boolean,
  dayOfMonth: number
) => {
  return {
    text: day.toString(),
    day: day,
    date: getFormatedDate(date, DATE_FORMAT),
    disabled: isDateDisabled(date, { minDate, maxDate, disabledDates }),
    isCurrentMonth,
    dayOfMonth,
  };
};

export function addColorAlpha(color: string | undefined, opacity: number) {
  //if it has an alpha, remove it
  if (!color) {
    color = '#000000';
  }

  if (color.length > 7) {
    color = color.substring(0, color.length - 2);
  }

  // coerce values so ti is between 0 and 1.
  const _opacity = Math.round(Math.min(Math.max(opacity, 0), 1) * 255);
  let opacityHex = _opacity.toString(16).toUpperCase();

  // opacities near 0 need a trailing 0
  if (opacityHex.length === 1) {
    opacityHex = '0' + opacityHex;
  }

  return color + opacityHex;
}
