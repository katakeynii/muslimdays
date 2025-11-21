// const { getDefaultConfig } = require('expo/metro-config');
// const { withNativeWind } = require('nativewind/metro');

// const config = getDefaultConfig(__dirname);

// // Enlève 'svg' de assetExts (ne PAS le remettre ensuite)
// config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
// // Ajoute 'svg' à sourceExts
// // config.resolver.sourceExts.push("svg");
// config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];
// // Configure le transformer SVG
// config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");

// // Ajouter le support pour expo-router
// config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// // Configuration pour NativeWind
// module.exports = withNativeWind(config, { 
//     input: './global.css',
//     inlineRem: 16
// });

// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// ---- SVG + NativeWind ----
const { resolver, transformer } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"],

  // Workaround for some packages with package.json "exports" + RN 0.79
  unstable_enablePackageExports: false,
};

// ---- NativeWind ----
module.exports = withNativeWind(config, {
  input: "./global.css",
  inlineRem: 16,
});
