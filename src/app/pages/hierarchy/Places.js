import { useState, useMemo, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
import "@reach/combobox/styles.css";
import "../../styles/places.css"

const libraries = ["places"];

function Places({ onChange, name, defaultValue }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [initialValue, setInitialValue] = useState(defaultValue);

  useEffect(() => {
    setInitialValue(defaultValue);
  }, [defaultValue]);

  if (!isLoaded) return <div>Loading...</div>;
  return <Map onChange={onChange} name={name} initialValue={initialValue} />;
}


function Map({ onChange, name, initialValue }) {
  const center = useMemo(() => ({ lat: 43.45, lng: -80.49 }), []);
  const [selected, setSelected] = useState(null);
  const [mapCenter, setMapCenter] = useState(center);

  useEffect(() => {
    async function getInitialLatLng() {
      if (initialValue) {
        const results = await getGeocode({ address: initialValue });
        const { lat, lng } = await getLatLng(results[0]);
        setSelected({ lat, lng });
        setMapCenter({ lat, lng });
      }
    }
    getInitialLatLng();
  }, [initialValue]);

  return (
    <>
      <div className="places-container">
        <PlacesAutocomplete
          setSelected={setSelected}
          setMapCenter={setMapCenter}
          onChange={onChange}
          name={name}
          initialValue={initialValue}
        />
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

const PlacesAutocomplete = ({ setSelected, setMapCenter, onChange, name, initialValue }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
    }
  }, [initialValue, setValue]);

  const [hasInputFocus, setHasInputFocus] = useState(false);

  const [hideSuggestionsTimeoutId, setHideSuggestionsTimeoutId] = useState(null);

  const handleInputFocus = () => {
    setHasInputFocus(true);
    if (hideSuggestionsTimeoutId) {
      clearTimeout(hideSuggestionsTimeoutId);
      setHideSuggestionsTimeoutId(null);
    }
  };

  const handleInputBlur = () => {
    const timeoutId = setTimeout(() => {
      setHasInputFocus(false);
    }, 200);
    setHideSuggestionsTimeoutId(timeoutId);
  };


  useEffect(() => {
    clearSuggestions();
  }, [clearSuggestions]);
  

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    onChange({ target: { name, value: address } });
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
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
    />
    {hasInputFocus && value && (
      <ComboboxPopover className="react-google-maps-combobox-popover">
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    )}
  </Combobox>
  );
};

export default Places;