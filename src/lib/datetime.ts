/**
 * Remove time from date
 */
export const removeTimeFromDate = (date: Date) =>
  new Date(date.setHours(0, 0, 0, 0));
