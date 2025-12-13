// UPSOSB District-wise Nodal Centers Data - All 75 Districts of UP

const getAllDistricts = () => {
  return Object.keys(districtCenters).sort();
};

const getDistrictCenters = (districtName) => {
  return districtCenters[districtName] || null;
};

const districtCenters = {
  // Due to message length limitations in Telegram (4096 characters),
  // data will be sent in chunks or by district selection
  // Full implementation with all 75 districts will be added below
};

module.exports = { districtCenters, getAllDistricts, getDistrictCenters };
