# YJY_CLI
For YJY Client ProtoType

#打包后android真机跑不起来问题：
#解决方法：生成assets目录下文件
1.mkdir android/app/src/main/assets
2.react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
