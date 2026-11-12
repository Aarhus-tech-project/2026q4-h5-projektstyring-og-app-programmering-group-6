module.exports = ({ config }) => {
  const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!mapsApiKey) {
    return config;
  }

  return {
    ...config,
    plugins: [
      ...config.plugins,
      ["react-native-maps", { androidGoogleMapsApiKey: mapsApiKey }],
    ],
  };
};