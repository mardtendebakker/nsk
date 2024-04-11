// @ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require('@nx/next/plugins/with-nx');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 */
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  env: {
    AXIOS_BASE_URL:
      process.env.NX_AXIOS_BASE_URL,
    MYPTV_API_KEY:
      'RVVfMjMyYTdmMDdlZjgwNDllMmI1YTUyNGQ0NWNlMTBhYjA6NjNmOTM4ZjAtNTMzZi00M2EwLWEwNDEtYjhjNmE4N2RiN2Iz',
    MYPTV_MAP_STYLE_URL:
      'https://vectormaps-resources.myptv.com/styles/latest/standard.json',
    MYPTV_MAP_TILE_URL:
      'https://api.myptv.com/maps/v1/vector-tiles/{z}/{x}/{y}',
    MYPTV_WAY_POINTS_URL:
      'https://api.myptv.com/routing/v1/routes?results=POLYLINE&options[trafficMode]=AVERAGE',
    MYPTV_WAY_POINTS_SEARCH_PREFIX:
      'waypoints',
    MYPTV_SEARCH_TEXT_URL:
      'https://api.myptv.com/geocoding/v1/locations/by-text?searchText=',
    MYPTV_UNKNOWN_ADDRESS:
      'Yacuiba Null Cañitas',
    MYPTV_FULFILLED_STATUS:
      'fulfilled',
  },
};

module.exports = withNx(nextConfig);
