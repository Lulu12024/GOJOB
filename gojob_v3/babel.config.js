// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
// };
// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'],
//   plugins: [
//     ["module:react-native-dotenv", {
//       "moduleName": "@env",
//       "path": ".env",
//       "blacklist": null,
//       "whitelist": null,
//       "safe": false,
//       "allowUndefined": true
//     }]
//   ]
// };
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    ['@babel/plugin-proposal-class-properties', { 'loose': true }]
  ]
};