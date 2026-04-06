const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const calcBookingPrice = (startDate, endDate, pricePerDay) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / MS_PER_DAY) + 1;

  if (days <= 0) {
    return { days: 0, total: 0 };
  }

  return {
    days,
    total: days * pricePerDay
  };
};
