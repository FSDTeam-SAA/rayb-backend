const isValidPrice = (val) => {
  return (
    val !== null &&
    val !== undefined &&
    val !== '' &&
    !Number.isNaN(Number(val)) &&
    Number(val) > 0
  );
};

const getItemPrices = (item) => {
  if (!item) return [];
  const prices = [];
  if (isValidPrice(item.price)) prices.push(Number(item.price));
  if (isValidPrice(item.minPrice)) prices.push(Number(item.minPrice));
  if (isValidPrice(item.maxPrice)) prices.push(Number(item.maxPrice));
  return prices;
};

const getItemHighestPrice = (item) => {
  const prices = getItemPrices(item);
  return prices.length ? Math.max(...prices) : null;
};

const getItemLowestPrice = (item) => {
  const prices = getItemPrices(item);
  return prices.length ? Math.min(...prices) : null;
};

const getEffectivePrice = (item) => {
  const prices = getItemPrices(item);
  return prices.length ? prices[0] : null;
};

const getAllPrices = (business) => {
  if (!business) return [];
  const items = [...(business.services || []), ...(business.musicLessons || [])];
  const prices = [];
  items.forEach((item) => {
    prices.push(...getItemPrices(item));
  });
  return prices;
};

const getHighestPrice = (business) => {
  const prices = getAllPrices(business);
  return prices.length ? Math.max(...prices) : null;
};

const getLowestPrice = (business) => {
  const prices = getAllPrices(business);
  return prices.length ? Math.min(...prices) : null;
};

const getBusinessPricingStatus = (business) => {
  const prices = getAllPrices(business);
  if (prices.length > 0) {
    return 1; // PRICED
  }

  const items = [...(business.services || []), ...(business.musicLessons || [])];
  if (items.length > 0) {
    return 2; // CONTACT_FOR_PRICING / UNPRICED
  }

  return 3; // NO_SERVICE
};

module.exports = {
  getBusinessPricingStatus,
  getHighestPrice,
  getLowestPrice,
  getEffectivePrice,
  getItemHighestPrice,
  getItemLowestPrice,
  getAllPrices,
};

