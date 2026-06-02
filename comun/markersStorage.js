import AsyncStorage from "@react-native-async-storage/async-storage";

const buildStorageKey = (uid, routeKey) => `markers:${uid}:${routeKey}`;

export const getUserRouteMarkers = async (uid, routeKey) => {
  if (!uid || !routeKey) {
    return [];
  }

  const storedValue = await AsyncStorage.getItem(buildStorageKey(uid, routeKey));
  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    return [];
  }
};

export const saveUserRouteMarkers = async (uid, routeKey, markers) => {
  if (!uid || !routeKey) {
    return;
  }

  await AsyncStorage.setItem(buildStorageKey(uid, routeKey), JSON.stringify(markers));
};

export const addUserRouteMarker = async (uid, routeKey, marker) => {
  const currentMarkers = await getUserRouteMarkers(uid, routeKey);

  if (marker.pointId && currentMarkers.some((item) => item.pointId === marker.pointId)) {
    return currentMarkers;
  }

  const nextMarkers = [...currentMarkers, marker];
  await saveUserRouteMarkers(uid, routeKey, nextMarkers);
  return nextMarkers;
};

export const removeUserRouteMarker = async (uid, routeKey, markerId) => {
  const currentMarkers = await getUserRouteMarkers(uid, routeKey);
  const nextMarkers = currentMarkers.filter((marker) => marker.id !== markerId);

  await saveUserRouteMarkers(uid, routeKey, nextMarkers);
  return nextMarkers;
};
