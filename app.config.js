export default {
  "expo": {
    "name": "easydonate",
    "slug": "easydonate",
    "platforms": ["ios", "android"],
    "permissions": ["LOCATION", "ACESS_FINE_LOCATION"],
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "easydonate",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "permissions": ["ACESS_FINE_LOCATION", "ACESS_COARSE_LOCATION"],
      "softwareKeyboardLayoutMode": "pan",
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#F6F7F9"
      },
      "edgeToEdgeEnabled": true
    },
    "androidStatusBar": {
      "backgroundColor": "#F6F7F9"
    },
    "androidNavigationBar": {
      "visible": "auto",
      "backgroundColor": "#F6F7F9",
      "barStyle": "dark-content"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "extra": {
      "apiUrl": process.env.API_URL || "http://10.64.44.19:5062",
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/mao.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#F6F7F9"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
};
