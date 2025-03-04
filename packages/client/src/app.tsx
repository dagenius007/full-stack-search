import { useState, type ChangeEvent } from "react";
import useDebounce from "./hooks/useDebounce";
import useSearch from "./hooks/useSearch";
import SearchItem from "./components/search-item";
import Input from "./components/input";

function App() {
  const [value, setValue] = useState("");
  const [showClearBtn, setShowClearBtn] = useState(false);
  const debounceValue = useDebounce(value);
  const {
    searchResult: { hotels, countries, cities },
    isLoading,
    error,
  } = useSearch(debounceValue);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValue(value);
    if (value === "") {
      setShowClearBtn(false);
      return;
    }
    setShowClearBtn(true);
  };

  if (error) {
    // basic window toast
    console.error(error);
  }

  const hasSearchResults =
    hotels.length > 0 || countries.length > 0 || cities.length > 0;

  return (
    <div className="App">
      <div className="container">
        <div className="row height d-flex justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="dropdown">
              <Input
                onChange={handleChange}
                value={value}
                showClearBtn={showClearBtn}
                isLoading={isLoading}
                handleClear={() => {
                  setValue("");
                  setShowClearBtn(false);
                }}
              />
              {hasSearchResults && (
                <div
                  className="search-dropdown-menu dropdown-menu w-100 show p-2"
                  data-testid="search-result"
                >
                  <SearchItem
                    header="Hotels"
                    results={hotels}
                    emptyStateText="No hotels matched"
                  />
                  <SearchItem
                    header="Countries"
                    results={countries}
                    emptyStateText="No countries matched"
                  />
                  <SearchItem
                    header="Cities"
                    results={cities}
                    emptyStateText="No cities matched"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
