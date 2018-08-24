# YJY_CLI
For YJY Client ProtoType

#打包后android真机跑不起来问题：
#解决方法：生成assets目录下文件
1.mkdir android/app/src/main/assets
2.react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

#iOS生成bundle文件
react-native bundle --dev false --entry-file index.js --bundle-output ios/main.jsbundle --platform ios

#Android Studio调试报错：Failed to execute aapt
需要在gradle.properties中把android.enableAapt2这句注释掉，不过打包时要再把这句加上，否则会报错。

