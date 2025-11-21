module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel'
    ],
    plugins: [
      'expo-router/babel',
      ['inline-dotenv', {
        path: '.env'
      }],
      'react-native-reanimated/plugin', // Doit être le dernier plugin
    ]
  };
};
