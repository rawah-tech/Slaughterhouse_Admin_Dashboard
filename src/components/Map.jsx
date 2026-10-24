import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  GoogleMap,
  InfoWindowF,
  LoadScript,
  MarkerF,
} from "@react-google-maps/api";

import { environment, hasGoogleMapsApiKey } from "../config/env";

const MAP_LIBRARIES = ["places"];

const getAddressPart = (components, acceptedTypes) =>
  components?.find((component) =>
    component.types?.some((type) => acceptedTypes.includes(type))
  )?.long_name ?? "";

const getAddressDetails = (result) => ({
  address: result?.formatted_address ?? "",
  city: getAddressPart(result?.address_components, ["administrative_area_level_2"]),
  area: getAddressPart(result?.address_components, ["sublocality_level_1", "locality"]),
  state: getAddressPart(result?.address_components, ["administrative_area_level_1"]),
});

const MapContent = ({ center, height, zoom, onLocationChange }) => {
  const [position, setPosition] = useState(center);
  const [addressDetails, setAddressDetails] = useState({
    address: "",
    city: "",
    area: "",
    state: "",
  });
  const autocompleteRef = useRef(null);

  const reverseGeocode = useCallback((nextPosition) => {
    if (!window.google?.maps) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: nextPosition }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        setAddressDetails(getAddressDetails(results[0]));
      }
    });
  }, []);

  const updatePosition = useCallback(
    (nextPosition) => {
      setPosition(nextPosition);
      reverseGeocode(nextPosition);
      onLocationChange?.(nextPosition);
    },
    [onLocationChange, reverseGeocode]
  );

  useEffect(() => {
    setPosition(center);
    reverseGeocode(center);
  }, [center, reverseGeocode]);

  const handleMarkerDragEnd = (event) => {
    const lat = event.latLng?.lat();
    const lng = event.latLng?.lng();

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      updatePosition({ lat, lng });
    }
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    const location = place?.geometry?.location;

    if (!location) return;

    const nextPosition = { lat: location.lat(), lng: location.lng() };
    setAddressDetails(getAddressDetails(place));
    setPosition(nextPosition);
    onLocationChange?.(nextPosition);
  };

  return (
    <div>
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label htmlFor="map-city" className="form-label">المدينة</label>
          <input id="map-city" className="form-control" readOnly value={addressDetails.city} />
        </div>
        <div className="col-md-6">
          <label htmlFor="map-area" className="form-label">المنطقة</label>
          <input id="map-area" className="form-control" readOnly value={addressDetails.area} />
        </div>
        <div className="col-md-6">
          <label htmlFor="map-state" className="form-label">الولاية</label>
          <input id="map-state" className="form-control" readOnly value={addressDetails.state} />
        </div>
        <div className="col-md-6">
          <label htmlFor="map-address" className="form-label">العنوان</label>
          <input id="map-address" className="form-control" readOnly value={addressDetails.address} />
        </div>
      </div>

      <Autocomplete
        onLoad={(instance) => {
          autocompleteRef.current = instance;
        }}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="search"
          className="form-control mb-3"
          placeholder="ابحث عن عنوان"
          aria-label="البحث عن عنوان على الخريطة"
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={{ width: "100%", height }}
        center={position}
        zoom={zoom}
      >
        {addressDetails.address && (
          <InfoWindowF
            position={{ lat: position.lat + 0.0018, lng: position.lng }}
          >
            <span>{addressDetails.address}</span>
          </InfoWindowF>
        )}
        <MarkerF draggable position={position} onDragEnd={handleMarkerDragEnd} />
      </GoogleMap>
    </div>
  );
};

const Map = ({ center, height = "300px", zoom = 15, onLocationChange }) => {
  if (!hasGoogleMapsApiKey) {
    return (
      <div className="alert alert-info" role="status">
        الخريطة غير متاحة لأن مفتاح Google Maps غير مُعدّ. أضف مفتاح متصفح مقيّدًا إلى
        <code className="mx-1">VITE_GOOGLE_MAPS_API_KEY</code>.
      </div>
    );
  }

  if (!Number.isFinite(center?.lat) || !Number.isFinite(center?.lng)) {
    return <div style={{ height }} />;
  }

  return (
    <LoadScript
      googleMapsApiKey={environment.googleMapsApiKey}
      libraries={MAP_LIBRARIES}
      loadingElement={<div style={{ height }} role="status" aria-label="جارٍ تحميل الخريطة" />}
    >
      <MapContent
        center={center}
        height={height}
        zoom={zoom}
        onLocationChange={onLocationChange}
      />
    </LoadScript>
  );
};

export default Map;
