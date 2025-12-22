/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @param earthRadius Earth radius in meters (default: 6371000)
 * @returns Distance in meters
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  earthRadius: number = 6371000
): number {
  // Convert from degrees to radians
  const latFrom = deg2rad(lat1);
  const lonFrom = deg2rad(lon1);
  const latTo = deg2rad(lat2);
  const lonTo = deg2rad(lon2);

  const latDelta = latTo - latFrom;
  const lonDelta = lonTo - lonFrom;

  const angle =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(latDelta / 2), 2) +
          Math.cos(latFrom) *
            Math.cos(latTo) *
            Math.pow(Math.sin(lonDelta / 2), 2)
      )
    );

  return angle * earthRadius;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Validate if user is within acceptable distance from store
 * @param userLat User latitude
 * @param userLon User longitude
 * @param storeLat Store latitude
 * @param storeLon Store longitude
 * @param maxDistance Maximum acceptable distance in meters (default: 100)
 * @returns Object with isValid flag and distance
 */
export function validateLocation(
  userLat: number,
  userLon: number,
  storeLat: number,
  storeLon: number,
  maxDistance: number = 100
): { isValid: boolean; distance: number } {
  const distance = haversineDistance(userLat, userLon, storeLat, storeLon);
  return {
    isValid: distance <= maxDistance,
    distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
  };
}
