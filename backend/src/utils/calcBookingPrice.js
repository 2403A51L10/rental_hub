const MS_PER_HOUR = 1000 * 60 * 60;

export const calcBookingPrice = (startDate, endDate, pricePerHour) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const hours = Math.ceil((end - start) / MS_PER_HOUR);

  if (hours <= 0) {
    return { hours: 0, total: 0 };
  }

  return {
    hours,
    total: hours * pricePerHour
  };
};
