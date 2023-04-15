import { useState, useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
import "@reach/combobox/styles.css";
import "../../styles/places.css"

const libraries = ["places"];

export default function Places({ onChange }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
    });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map onChange={onChange} />;
}

function Map({ onChange }) {
  const center = useMemo(() => ({ lat: 43.45, lng: -80.49 }), []);
  const [selected, setSelected] = useState(null);
  const [mapCenter, setMapCenter] = useState(center);

  return (
    <>
      <div className="places-container">
      <PlacesAutocomplete setSelected={setSelected} setMapCenter={setMapCenter} onChange={onChange} />
      </div>

        <GoogleMap
            zoom={10}
            center={mapCenter}
            mapContainerClassName="map-container"
            mapContainerStyle={{ height: "200px", width: "100%" }}
            >
            {selected && <Marker position={selected} />}
        </GoogleMap>
    </>
  );
}

const PlacesAutocomplete = ({ setSelected, setMapCenter, onChange }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
  
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    onChange({ target: { name: "place_of_birth", value: address } });
    setSelected({ lat, lng });
    setMapCenter({ lat, lng });
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className="combobox-input"
        placeholder="Search an address"
      />
      <ComboboxPopover className="react-google-maps-combobox-popover">
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};