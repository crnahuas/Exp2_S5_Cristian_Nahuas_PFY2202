const text = (value) => typeof value === "string" && value.trim().length > 0;
const amount = (value) => Number.isSafeInteger(value) && value >= 0;
const date = (value) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
const texts = (value) => Array.isArray(value) && value.every(text);
export const isDestination = (item) =>
  item != null &&
  [
    item.id,
    item.name,
    item.country,
    item.category,
    item.region,
    item.airport,
    item.image,
    item.description,
    item.bestSeason,
    item.recommendedDays,
    item.tip,
  ].every(text) &&
  texts(item.activities);
export const isDestinationList = (data) =>
  Array.isArray(data) && data.every(isDestination);
export const isFlight = (item) =>
  item != null &&
  [
    item.id,
    item.destinationId,
    item.airline,
    item.origin,
    item.arrival,
    item.duration,
  ].every(text) &&
  item.currency === "CLP" &&
  amount(item.price) &&
  amount(item.availableSeats) &&
  amount(item.stops) &&
  date(item.departureDate) &&
  date(item.returnDate) &&
  item.returnDate > item.departureDate &&
  /^\d{2}:\d{2}$/.test(item.departureTime) &&
  /^\d{2}:\d{2}$/.test(item.arrivalTime);
export const isHotel = (item) =>
  item != null &&
  [item.id, item.destinationId, item.name, item.area].every(text) &&
  item.currency === "CLP" &&
  amount(item.pricePerNight) &&
  amount(item.availableRooms) &&
  Number.isInteger(item.stars) &&
  item.stars >= 1 &&
  item.stars <= 5 &&
  date(item.checkIn) &&
  date(item.checkOut) &&
  item.checkOut > item.checkIn &&
  texts(item.amenities);
export function validateOptions(data, destinationId) {
  if (!data || data.destinationId !== destinationId) return false;
  return [
    [data.flights, isFlight],
    [data.hotels, isHotel],
  ].every(
    ([list, validate]) =>
      list === null ||
      (Array.isArray(list) &&
        list.every(
          (item) => validate(item) && item.destinationId === destinationId,
        )),
  );
}
