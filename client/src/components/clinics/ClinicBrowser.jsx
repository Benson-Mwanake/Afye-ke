import React from "react";
import ClinicList from "./ClinicList";
import SearchBar from "./SearchBar";
import CountyFilter from "./CountyFilter";
import DistanceFilter from "./DistanceFilter";
import MapView from "./MapView";

const ClinicBrowser = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Find a Clinic</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <SearchBar />
        <div className="flex gap-4">
          <CountyFilter />
          <DistanceFilter />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ClinicList />
        </div>
        <div className="lg:col-span-1">
          <MapView />
        </div>
      </div>
    </div>
  );
};

export default ClinicBrowser;
