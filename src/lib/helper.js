export const getBusinessPricingStatus = (business) => {
  const items = [...(business.services || []), ...(business.musicLessons || [])];

  if (!items.length) {
    return 3; // NO_SERVICE
  }

  const hasPricedService = items.some((item) => {
    if (item.pricingType === 'range') {
      return (
        item.minPrice !== null &&
        item.minPrice !== undefined &&
        item.maxPrice !== null &&
        item.maxPrice !== undefined
      );
    }

    return item.price !== null && item.price !== undefined;
  });

  if (hasPricedService) {
    return 1; // PRICED / FREE
  }

  return 2; // CONTACT_FOR_PRICING
};

export const getLowestPrice = (business) => {
  const items = [...(business.services || []), ...(business.musicLessons || [])];

  const prices = [];

  items.forEach((item) => {
    if (item.pricingType === 'range') {
      if (item.minPrice !== null && item.minPrice !== undefined) {
        prices.push(Number(item.minPrice));
      }
    } else {
      if (item.price !== null && item.price !== undefined) {
        prices.push(Number(item.price));
      }
    }
  });

  return prices.length ? Math.min(...prices) : null;
};

export const getHighestPrice = (business) => {
  const items = [...(business.services || []), ...(business.musicLessons || [])];

  const prices = [];

  items.forEach((item) => {
    if (item.pricingType === 'range') {
      if (item.maxPrice !== null && item.maxPrice !== undefined) {
        prices.push(Number(item.maxPrice));
      }
    } else {
      if (item.price !== null && item.price !== undefined) {
        prices.push(Number(item.price));
      }
    }
  });

  return prices.length ? Math.max(...prices) : null;
};
