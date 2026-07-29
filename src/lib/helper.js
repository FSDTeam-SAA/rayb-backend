const getEffectivePrice = (item) => {
  if (item.price !== null && item.price !== undefined) {
    const val = Number(item.price);
    return Number.isNaN(val) ? null : val;
  }
  if (item.minPrice !== null && item.minPrice !== undefined) {
    const val = Number(item.minPrice);
    return Number.isNaN(val) ? null : val;
  }
  if (item.maxPrice !== null && item.maxPrice !== undefined) {
    const val = Number(item.maxPrice);
    return Number.isNaN(val) ? null : val;
  }
  return null;
};

export const getBusinessPricingStatus = (business) => {
  const items = [...(business.services || []), ...(business.musicLessons || [])];

  if (!items.length) {
    return 3; // NO_SERVICE
  }

  const hasExactPrice = items.some(
    (item) => item.price !== null && item.price !== undefined && !Number.isNaN(Number(item.price)),
  );

  if (hasExactPrice) {
    return 1; // PRICED
  }

  const hasRangePrice = items.some((item) => {
    const min =
      item.minPrice !== null && item.minPrice !== undefined ? Number(item.minPrice) : null;
    const max =
      item.maxPrice !== null && item.maxPrice !== undefined ? Number(item.maxPrice) : null;

    return (min !== null && !Number.isNaN(min)) || (max !== null && !Number.isNaN(max));
  });

  if (hasRangePrice) {
    return 2; // CONTACT_FOR_PRICING (min/max only, no exact price)
  }

  return 3; // NO_SERVICE / NO_PRICE
};

export const getLowestPrice = (business) => {
  const prices = (business.services || [])
    .map((item) => item.price)
    .filter((price) => price !== null && price !== undefined && !Number.isNaN(Number(price)))
    .map(Number);

  return prices.length ? Math.min(...prices) : null;
};

export const getHighestPrice = (business) => {
  const prices = (business.services || [])
    .map((item) => item.price)
    .filter((price) => price !== null && price !== undefined && !Number.isNaN(Number(price)))
    .map(Number);

  return prices.length ? Math.max(...prices) : null;
};

export { getEffectivePrice };
