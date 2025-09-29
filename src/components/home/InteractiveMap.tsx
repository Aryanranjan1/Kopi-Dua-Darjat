'use client';

import React from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import { outlets } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 2.96,
  lng: 101.75,
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [
        { "color": "#7c93a3" },
        { "lightness": "-10" }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "geometry",
      "stylers": [
        { "visibility": "on" }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "geometry.stroke",
      "stylers": [
        { "color": "#a0a4a5" }
      ]
    },
    {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [
        { "color": "#62838e" }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry.fill",
      "stylers": [
        { "color": "#f3ede6" }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
        { "color": "#f3ede6" },
        { "lightness": "0" },
        { "gamma": "1" }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [
        { "saturation": -100 },
        { "lightness": 45 }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [
        { "visibility": "simplified" }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
        { "color": "#f4d7b9" },
        { "visibility": "simplified" }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text",
      "stylers": [
        { "color": "#4e4e4e" }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry.fill",
      "stylers": [
        { "color": "#f4d7b9" }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "geometry.fill",
      "stylers": [
        { "color": "#f4d7b9" },
        { "lightness": "1" },
        { "gamma": "1" }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        { "color": "#a2daf2" },
        { "visibility": "on" }
      ]
    },
     {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        { "color": "#a6cbe3" }
      ]
    }
  ],
};

const libraries: ('places')[] = ['places'];

export default function InteractiveMap() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  if (loadError) return <div className="p-4">Error loading map. Please ensure your API key is correct.</div>;
  if (!isLoaded) return <Skeleton className="w-full h-full" />;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={11}
      options={mapOptions}
    >
      {outlets.map((outlet) => (
        <MarkerF
          key={outlet.id}
          position={{ lat: outlet.lat, lng: outlet.lng }}
          title={outlet.name}
          icon={{
            url: '/coffee-pin.svg',
            scaledSize: new window.google.maps.Size(40, 40)
          }}
        />
      ))}
    </GoogleMap>
  );
}
