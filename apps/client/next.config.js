// @ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require('@nrwl/next/plugins/with-nx');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 */
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  env: {
    MY_PTV_API_KEY: 'RVVfMjMyYTdmMDdlZjgwNDllMmI1YTUyNGQ0NWNlMTBhYjA6NjNmOTM4ZjAtNTMzZi00M2EwLWEwNDEtYjhjNmE4N2RiN2Iz',
  },
};

module.exports = withNx(nextConfig);
