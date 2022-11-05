# Changelog

## [4.0.1](https://github.com/erezrokah/aws-testing-library/compare/v4.0.0...v4.0.1) (2022-11-05)


### Bug Fixes

* **deps:** update dependency aws-sdk to v2.1246.0 ([#715](https://github.com/erezrokah/aws-testing-library/issues/715)) ([c9ba7cf](https://github.com/erezrokah/aws-testing-library/commit/c9ba7cfd7cc950b651ee1c0a00f86858363b2f25))

## [4.0.0](https://github.com/erezrokah/aws-testing-library/compare/v3.0.2...v4.0.0) (2022-10-30)


### ⚠ BREAKING CHANGES

* require Node.js 16.10.0 as 12,14 are EOF/Nearing EOF. This is a first step in moving to a pure ESM package. If you're already running on Node.js >= 16.10.0 this shouldn't be breaking for you, as the library is still compiled to commonJS

### Miscellaneous Chores

* require Node.js 16 ([#711](https://github.com/erezrokah/aws-testing-library/issues/711)) ([69458cc](https://github.com/erezrokah/aws-testing-library/commit/69458ccac76e55c3f461004de00fd799c6146697))

## [3.0.2](https://github.com/erezrokah/aws-testing-library/compare/v3.0.1...v3.0.2) (2022-10-29)


### Bug Fixes

* revert "fix(deps): update dependency axios to v1 ([#692](https://github.com/erezrokah/aws-testing-library/issues/692))" ([#709](https://github.com/erezrokah/aws-testing-library/issues/709)) ([53773a9](https://github.com/erezrokah/aws-testing-library/commit/53773a9eb38897e9ca465252428d08c5636cb89a))

## [3.0.1](https://github.com/erezrokah/aws-testing-library/compare/v3.0.0...v3.0.1) (2022-10-29)


### Bug Fixes

* **deps:** update dependency aws-sdk to v2.1238.0 ([#706](https://github.com/erezrokah/aws-testing-library/issues/706)) ([356b677](https://github.com/erezrokah/aws-testing-library/commit/356b677bf88ba92224024aef6c00bb18d30aa221))
* **deps:** update dependency axios to v1 ([#692](https://github.com/erezrokah/aws-testing-library/issues/692)) ([ec6f5e9](https://github.com/erezrokah/aws-testing-library/commit/ec6f5e9103e83657cf16b6838a2bb402c7776361))

## [3.0.0](https://github.com/erezrokah/aws-testing-library/compare/v2.1.7...v3.0.0) (2022-10-21)


### ⚠ BREAKING CHANGES

* The filter pattern to match CloudWatch Logs is now passed without modifications to the AWS API. If you're using the Jest `toHaveLog` or Chai `to.have.log` matchers you might need to quote your pattern, e.g. ``toHaveLog(pattern) -> toHaveLog(`"${pattern}"`)`` or ``to.have.log(pattern) -> to.have.log(`"${pattern}"`)`` to support special characters

### Bug Fixes

* don't quote CloudWatch filter pattern ([#702](https://github.com/erezrokah/aws-testing-library/issues/702)) ([aef13c0](https://github.com/erezrokah/aws-testing-library/commit/aef13c0ab37d4328fd553d7425862bcd9f185383))

## [2.1.7](https://github.com/erezrokah/aws-testing-library/compare/v2.1.6...v2.1.7) (2022-10-21)


### Bug Fixes

* **deps:** update dependency aws-sdk to v2.1237.0 ([#699](https://github.com/erezrokah/aws-testing-library/issues/699)) ([0c90096](https://github.com/erezrokah/aws-testing-library/commit/0c9009616d54266c41fef3cb89079ce4c9b89072))
* **deps:** update dependency uuid to v9 ([#681](https://github.com/erezrokah/aws-testing-library/issues/681)) ([882e08c](https://github.com/erezrokah/aws-testing-library/commit/882e08ca2a1e1dca2631bc28ca45df819225a78b))

## [2.1.6](https://github.com/erezrokah/aws-testing-library/compare/v2.1.5...v2.1.6) (2022-10-17)


### Bug Fixes

* **deps:** update dependency aws-sdk to v2.1204.0 ([#673](https://github.com/erezrokah/aws-testing-library/issues/673)) ([d775c0d](https://github.com/erezrokah/aws-testing-library/commit/d775c0d40f7151eed797650df870ad62da43e9f8))
* **deps:** update dependency aws-sdk to v2.1213.0 ([#680](https://github.com/erezrokah/aws-testing-library/issues/680)) ([c95aca1](https://github.com/erezrokah/aws-testing-library/commit/c95aca155336a4bf43d27c3964af87d6cb4092e6))
* **deps:** update dependency aws-sdk to v2.1218.0 ([#684](https://github.com/erezrokah/aws-testing-library/issues/684)) ([0356e4a](https://github.com/erezrokah/aws-testing-library/commit/0356e4ab3e8009d08a6d545e7f07b80cf99521e6))
* **deps:** update dependency aws-sdk to v2.1227.0 ([#688](https://github.com/erezrokah/aws-testing-library/issues/688)) ([670fd85](https://github.com/erezrokah/aws-testing-library/commit/670fd85cfe9199c254cb34bb63146f4fc0c6a28b))
* **deps:** update dependency aws-sdk to v2.1231.0 ([#691](https://github.com/erezrokah/aws-testing-library/issues/691)) ([1dbf641](https://github.com/erezrokah/aws-testing-library/commit/1dbf641c884e414bbdb2f27e498bc2b297d99f99))
* **deps:** update dependency aws-sdk to v2.1233.0 ([#695](https://github.com/erezrokah/aws-testing-library/issues/695)) ([e5c1097](https://github.com/erezrokah/aws-testing-library/commit/e5c1097df9ad379137d4fece5cc77c6db1999755))

## [2.1.5](https://github.com/erezrokah/aws-testing-library/compare/v2.1.4...v2.1.5) (2022-08-22)


### Bug Fixes

* **deps:** update dependency aws-sdk to v2.1162.0 ([#633](https://github.com/erezrokah/aws-testing-library/issues/633)) ([cf63140](https://github.com/erezrokah/aws-testing-library/commit/cf631401d659532ac29ed18ccc4c51489acd12f6))
* **deps:** update dependency aws-sdk to v2.1167.0 ([#640](https://github.com/erezrokah/aws-testing-library/issues/640)) ([f5ec90a](https://github.com/erezrokah/aws-testing-library/commit/f5ec90add6ec0c527337c7a65878ec01a29ef97e))
* **deps:** update dependency aws-sdk to v2.1171.0 ([#642](https://github.com/erezrokah/aws-testing-library/issues/642)) ([502671d](https://github.com/erezrokah/aws-testing-library/commit/502671d746c4b9a368d8b3c847a9bf265668618b))
* **deps:** update dependency aws-sdk to v2.1176.0 ([#648](https://github.com/erezrokah/aws-testing-library/issues/648)) ([c81f5c2](https://github.com/erezrokah/aws-testing-library/commit/c81f5c27e02d5d2fd3d6efb098967b780a5b5d2a))
* **deps:** update dependency aws-sdk to v2.1181.0 ([#650](https://github.com/erezrokah/aws-testing-library/issues/650)) ([2337d23](https://github.com/erezrokah/aws-testing-library/commit/2337d236ed85dc16e3a0675cac0f85d1236196c0))
* **deps:** update dependency aws-sdk to v2.1185.0 ([#654](https://github.com/erezrokah/aws-testing-library/issues/654)) ([8672b85](https://github.com/erezrokah/aws-testing-library/commit/8672b857e70fbb676dd6479f69afcdf2ae8104e2))
* **deps:** update dependency aws-sdk to v2.1189.0 ([#658](https://github.com/erezrokah/aws-testing-library/issues/658)) ([fcc4080](https://github.com/erezrokah/aws-testing-library/commit/fcc40800367aa94de0e253619e7aef21ee278e02))
* **deps:** update dependency aws-sdk to v2.1194.0 ([#662](https://github.com/erezrokah/aws-testing-library/issues/662)) ([2dadae7](https://github.com/erezrokah/aws-testing-library/commit/2dadae73a0f14a337fd28a1a340e293ed3bc7e60))
* **deps:** update dependency aws-sdk to v2.1199.0 ([#667](https://github.com/erezrokah/aws-testing-library/issues/667)) ([e22d7a3](https://github.com/erezrokah/aws-testing-library/commit/e22d7a305e676da3edee327a21cdfb50959a3db6))

## [2.1.4](https://github.com/erezrokah/aws-testing-library/compare/v2.1.3...v2.1.4) (2022-06-22)


### Bug Fixes

* add batching to clearAllItems ([#629](https://github.com/erezrokah/aws-testing-library/issues/629)) ([54b37b7](https://github.com/erezrokah/aws-testing-library/commit/54b37b7fbf76d0bd5aa7e1790f86c2401a85bd34))
* **deps:** update dependency aws-sdk to v2.1130.0 ([#594](https://github.com/erezrokah/aws-testing-library/issues/594)) ([cb94bf0](https://github.com/erezrokah/aws-testing-library/commit/cb94bf01729e7d7d7aade3a973594938027d7ba8))
* **deps:** update dependency aws-sdk to v2.1145.0 ([#604](https://github.com/erezrokah/aws-testing-library/issues/604)) ([b383f58](https://github.com/erezrokah/aws-testing-library/commit/b383f580e03e4b381b3de320e70c5634526d28ad))
* **deps:** update dependency aws-sdk to v2.1148.0 ([#615](https://github.com/erezrokah/aws-testing-library/issues/615)) ([dabeb76](https://github.com/erezrokah/aws-testing-library/commit/dabeb76689ae45574bba534770d348a2dd16be12))
* **deps:** update dependency aws-sdk to v2.1149.0 ([#619](https://github.com/erezrokah/aws-testing-library/issues/619)) ([39d8782](https://github.com/erezrokah/aws-testing-library/commit/39d8782104770bbf7bd10af198470f26f0d14739))
* **deps:** update dependency aws-sdk to v2.1152.0 ([#621](https://github.com/erezrokah/aws-testing-library/issues/621)) ([0f736de](https://github.com/erezrokah/aws-testing-library/commit/0f736deb661f43899dce410e2c1a3ac12e5c5d4f))
* **deps:** update dependency aws-sdk to v2.1157.0 ([#627](https://github.com/erezrokah/aws-testing-library/issues/627)) ([dc2c8b8](https://github.com/erezrokah/aws-testing-library/commit/dc2c8b8f0ac3b5a519a2847751703d87d7b9852f))

### [2.1.3](https://github.com/erezrokah/aws-testing-library/compare/v2.1.2...v2.1.3) (2022-05-06)


### Bug Fixes

* **deps:** update dependency aws-sdk to v2.1092.0 ([#563](https://github.com/erezrokah/aws-testing-library/issues/563)) ([cce36fa](https://github.com/erezrokah/aws-testing-library/commit/cce36fad96aeb4a654637b8a82078effe177abed))
* **deps:** update dependency aws-sdk to v2.1096.0 ([#568](https://github.com/erezrokah/aws-testing-library/issues/568)) ([85be124](https://github.com/erezrokah/aws-testing-library/commit/85be12433b728415559b47af6c4fad45d7c5c1ed))
* **deps:** update dependency aws-sdk to v2.1101.0 ([#573](https://github.com/erezrokah/aws-testing-library/issues/573)) ([44f0249](https://github.com/erezrokah/aws-testing-library/commit/44f02495930a80a9bc719d63fbeeb47540a97e6b))
* **deps:** update dependency aws-sdk to v2.1106.0 ([#576](https://github.com/erezrokah/aws-testing-library/issues/576)) ([d1091b8](https://github.com/erezrokah/aws-testing-library/commit/d1091b8ea2290b700eac53eeb9ba9d05f432f25c))
* **deps:** update dependency aws-sdk to v2.1111.0 ([#579](https://github.com/erezrokah/aws-testing-library/issues/579)) ([70acc76](https://github.com/erezrokah/aws-testing-library/commit/70acc760f5b825db4bbfc16bf39e573fb4a27653))
* **deps:** update dependency aws-sdk to v2.1116.0 ([#583](https://github.com/erezrokah/aws-testing-library/issues/583)) ([810b20b](https://github.com/erezrokah/aws-testing-library/commit/810b20b40a1927b69dc5d00c92c0be3f3777a985))
* **deps:** update dependency aws-sdk to v2.1125.0 ([#588](https://github.com/erezrokah/aws-testing-library/issues/588)) ([915d61a](https://github.com/erezrokah/aws-testing-library/commit/915d61a4b1a6da0b125197391a814be965cfada8))
* **deps:** update dependency axios to ^0.27.0 ([#589](https://github.com/erezrokah/aws-testing-library/issues/589)) ([095b126](https://github.com/erezrokah/aws-testing-library/commit/095b126f4ee773cef869706b36aa732de6b3ce9c))
* **deps:** update dependency axios to v0.26.1 ([#561](https://github.com/erezrokah/aws-testing-library/issues/561)) ([1159f77](https://github.com/erezrokah/aws-testing-library/commit/1159f7797a0981e0ee5365dca7117bd11d385bce))

### [2.1.2](https://github.com/erezrokah/aws-testing-library/compare/v2.1.1...v2.1.2) (2022-03-07)


### Bug Fixes

* **deps:** update dependency aws-sdk to v2.1069.0 ([#539](https://github.com/erezrokah/aws-testing-library/issues/539)) ([3f45dea](https://github.com/erezrokah/aws-testing-library/commit/3f45dea6b1a50e30bac9a3e12ec36ecca16db6b2))
* **deps:** update dependency aws-sdk to v2.1073.0 ([#546](https://github.com/erezrokah/aws-testing-library/issues/546)) ([bbb57e2](https://github.com/erezrokah/aws-testing-library/commit/bbb57e28a8054a218aebd684ea6c4a1e1d57890c))
* **deps:** update dependency aws-sdk to v2.1077.0 ([#550](https://github.com/erezrokah/aws-testing-library/issues/550)) ([0e08558](https://github.com/erezrokah/aws-testing-library/commit/0e08558204d42d9ad57afae4839a46a6a0a29383))
* **deps:** update dependency aws-sdk to v2.1082.0 ([#554](https://github.com/erezrokah/aws-testing-library/issues/554)) ([46bf443](https://github.com/erezrokah/aws-testing-library/commit/46bf443c5c6453ea1dc58751c336a33164382181))
* **deps:** update dependency aws-sdk to v2.1087.0 ([#559](https://github.com/erezrokah/aws-testing-library/issues/559)) ([c9e3084](https://github.com/erezrokah/aws-testing-library/commit/c9e3084be5c523037d70c25f5582ef8a7d7256a9))
* **deps:** update dependency axios to ^0.26.0 ([#547](https://github.com/erezrokah/aws-testing-library/issues/547)) ([5347d61](https://github.com/erezrokah/aws-testing-library/commit/5347d618fc7365e77504c3d93104d1f457b4bd9e))

### [2.1.1](https://github.com/erezrokah/aws-testing-library/compare/v2.1.0...v2.1.1) (2022-01-31)


### Bug Fixes

* **deps:** update dependency aws-sdk to v2.1066.0 ([#534](https://github.com/erezrokah/aws-testing-library/issues/534)) ([8298f72](https://github.com/erezrokah/aws-testing-library/commit/8298f72f405ca915105a061c6f85caa16c834193))

## [2.1.0](https://github.com/erezrokah/aws-testing-library/compare/v2.0.0...v2.1.0) (2022-01-23)


### Features

* support explicit LogGroupName ([#449](https://github.com/erezrokah/aws-testing-library/issues/449)) ([8dceeaa](https://github.com/erezrokah/aws-testing-library/commit/8dceeaae9a9e15002a785f998fe241f54a148dbf))

## [2.0.0](https://github.com/erezrokah/aws-testing-library/compare/v1.1.6...v2.0.0) (2022-01-23)


### ⚠ BREAKING CHANGES

* drop Node.js 10, update dependency filter-obj to v3 (#528)

### Miscellaneous Chores

* drop Node.js 10, update dependency filter-obj to v3 ([#528](https://github.com/erezrokah/aws-testing-library/issues/528)) ([539360b](https://github.com/erezrokah/aws-testing-library/commit/539360b63f1c6267aa41cfd83bff551e6e090cfe))

### [1.1.6](https://github.com/erezrokah/aws-testing-library/compare/v1.1.5...v1.1.6) (2022-01-23)


### Bug Fixes

* revert "fix(deps): update dependency filter-obj to v3 ([#518](https://github.com/erezrokah/aws-testing-library/issues/518))" ([#526](https://github.com/erezrokah/aws-testing-library/issues/526)) ([d8a4e6b](https://github.com/erezrokah/aws-testing-library/commit/d8a4e6b08655e0566619b4187cff05e849463832))

### [1.1.5](https://github.com/erezrokah/aws-testing-library/compare/v1.1.4...v1.1.5) (2022-01-23)


### Bug Fixes

* **deps:** update dependency aws-sdk to v2.1062.0 ([#522](https://github.com/erezrokah/aws-testing-library/issues/522)) ([ae4fe8f](https://github.com/erezrokah/aws-testing-library/commit/ae4fe8ffea50db648cffd6022ff38ff905a7679d))
* **deps:** update dependency filter-obj to v3 ([#518](https://github.com/erezrokah/aws-testing-library/issues/518)) ([41bd6bb](https://github.com/erezrokah/aws-testing-library/commit/41bd6bb19bc0184633965ae379ede69e7242b234))

### [1.1.4](https://github.com/erezrokah/aws-testing-library/compare/v1.1.3...v1.1.4) (2022-01-19)


### Bug Fixes

* **deps:** update dependency aws-sdk to v2.1059.0 ([#508](https://github.com/erezrokah/aws-testing-library/issues/508)) ([a13b3d1](https://github.com/erezrokah/aws-testing-library/commit/a13b3d1b7cbea4f18dd63785b1108990c15ffb49))

### [1.1.3](https://github.com/erezrokah/aws-testing-library/compare/v1.1.2...v1.1.3) (2022-01-18)


### Bug Fixes

* **deps:** update dependency aws-sdk to v2.1023.0 ([25dd405](https://github.com/erezrokah/aws-testing-library/commit/25dd405b10eb13cfd92ebf043f9b68b6af574fc6))
* **deps:** update dependency aws-sdk to v2.1028.0 ([d3e7835](https://github.com/erezrokah/aws-testing-library/commit/d3e7835a1d26224b4d13b9cc556a55080befcdf6))
* **deps:** update dependency aws-sdk to v2.1048.0 ([4a02fe9](https://github.com/erezrokah/aws-testing-library/commit/4a02fe96cd78260567ad365645895bcc295741c3))
* **deps:** update dependency aws-sdk to v2.1053.0 ([7a79397](https://github.com/erezrokah/aws-testing-library/commit/7a793975269d9d765b94b8cfc0207843a82b2984))
* **deps:** update dependency aws-sdk to v2.983.0 ([056f857](https://github.com/erezrokah/aws-testing-library/commit/056f857b8ec1831bbc6e378aaa66c088e7fd1614))
* **deps:** update dependency axios to ^0.25.0 ([#469](https://github.com/erezrokah/aws-testing-library/issues/469)) ([1bb7348](https://github.com/erezrokah/aws-testing-library/commit/1bb734885254c9056355f910ee81b503164c96e0))
* **deps:** update dependency axios to v0.21.3 ([3995e10](https://github.com/erezrokah/aws-testing-library/commit/3995e10ba5be631150baf723b022e78881a0a947))
* **deps:** update dependency axios to v0.21.4 ([851d989](https://github.com/erezrokah/aws-testing-library/commit/851d9898a41adc993be3e41260bbe3ec0bee5b73))
* **deps:** update jest monorepo (major) ([#426](https://github.com/erezrokah/aws-testing-library/issues/426)) ([0ebff52](https://github.com/erezrokah/aws-testing-library/commit/0ebff52b0eff60db16c5e27a1cafd96da1c2c045))

### [1.1.2](https://www.github.com/erezrokah/aws-testing-library/compare/v1.1.1...v1.1.2) (2021-08-21)


### Bug Fixes

* **deps:** update dependency aws-sdk to v2.614.0 ([2cbc024](https://www.github.com/erezrokah/aws-testing-library/commit/2cbc024557fc9dd1dcaf123434c53ba6ced0ec9b))
* **deps:** update dependency aws-sdk to v2.619.0 ([2ccc85e](https://www.github.com/erezrokah/aws-testing-library/commit/2ccc85ebb119a24115c37b40760ff887fa4f8b92))
* **deps:** update dependency aws-sdk to v2.630.0 ([33f824e](https://www.github.com/erezrokah/aws-testing-library/commit/33f824e2b7680d73d68408da23b03b45c8eea924))
* **deps:** update dependency aws-sdk to v2.639.0 ([aa6e5aa](https://www.github.com/erezrokah/aws-testing-library/commit/aa6e5aa2d79184d3f40cc945862733c5cdfa9904))
* **deps:** update dependency aws-sdk to v2.658.0 ([182fd83](https://www.github.com/erezrokah/aws-testing-library/commit/182fd83287e8f6d131e40190380808c50ac17ef1))
* **deps:** update dependency aws-sdk to v2.663.0 ([#135](https://www.github.com/erezrokah/aws-testing-library/issues/135)) ([b07a8fa](https://www.github.com/erezrokah/aws-testing-library/commit/b07a8fa081fb7d44e5c392337eb7ed3b0758d760))
* **deps:** update dependency aws-sdk to v2.668.0 ([9d8a72b](https://www.github.com/erezrokah/aws-testing-library/commit/9d8a72b4d510b4c26e36e3589ef9ed6fa0b18196))
* **deps:** update dependency aws-sdk to v2.673.0 ([1bc9771](https://www.github.com/erezrokah/aws-testing-library/commit/1bc9771897fb89d869ccedfa130255d58e199ee7))
* **deps:** update dependency aws-sdk to v2.696.0 ([2f8671b](https://www.github.com/erezrokah/aws-testing-library/commit/2f8671b5800a0154a409375a48e28f477edd9d40))
* **deps:** update dependency aws-sdk to v2.701.0 ([d0db24b](https://www.github.com/erezrokah/aws-testing-library/commit/d0db24be6d7155c27e66f7bb10e7803b532f57d4))
* **deps:** update dependency aws-sdk to v2.709.0 ([2b68a71](https://www.github.com/erezrokah/aws-testing-library/commit/2b68a71d5b2dde4dd349655eddc094820cca620d))
* **deps:** update dependency aws-sdk to v2.713.0 ([c45d654](https://www.github.com/erezrokah/aws-testing-library/commit/c45d6540863539b71da1927a817712777b4de268))
* **deps:** update dependency aws-sdk to v2.715.0 ([26954c2](https://www.github.com/erezrokah/aws-testing-library/commit/26954c27f528f946b3cb16a300fd277531ea2b7d))
* **deps:** update dependency aws-sdk to v2.720.0 ([4bb2c03](https://www.github.com/erezrokah/aws-testing-library/commit/4bb2c032c489c0920180bcf7c947601ffe41f5d7))
* **deps:** update dependency aws-sdk to v2.729.0 ([6dbbc18](https://www.github.com/erezrokah/aws-testing-library/commit/6dbbc1833fda1d467b7302442a6b61a300d006fe))
* **deps:** update dependency aws-sdk to v2.734.0 ([3614647](https://www.github.com/erezrokah/aws-testing-library/commit/3614647a184e86acce6391a302e4da4eff878fd5))
* **deps:** update dependency aws-sdk to v2.738.0 ([c37b21c](https://www.github.com/erezrokah/aws-testing-library/commit/c37b21cf5d9bbc02f27b5db5b3ee5a7fbcd80c7d))
* **deps:** update dependency aws-sdk to v2.747.0 ([b48b910](https://www.github.com/erezrokah/aws-testing-library/commit/b48b91069851107af7b3ae451dda3f811de55c2d))
* **deps:** update dependency aws-sdk to v2.751.0 ([e81e2d0](https://www.github.com/erezrokah/aws-testing-library/commit/e81e2d025eef78ffcf958dee4fde5ca5a0f50279))
* **deps:** update dependency aws-sdk to v2.761.0 ([73a5b99](https://www.github.com/erezrokah/aws-testing-library/commit/73a5b9989f94f75e5e034445e10cdd5f92aee093))
* **deps:** update dependency aws-sdk to v2.766.0 ([85e4663](https://www.github.com/erezrokah/aws-testing-library/commit/85e466397c8117f02a48fe4f2e67be94d22e5ad4))
* **deps:** update dependency aws-sdk to v2.771.0 ([b933584](https://www.github.com/erezrokah/aws-testing-library/commit/b933584ee7b286b692a6d1c7a1dd46b6594043e9))
* **deps:** update dependency aws-sdk to v2.773.0 ([586fe04](https://www.github.com/erezrokah/aws-testing-library/commit/586fe045211d1281aefb5dbec3cb05c24e500028))
* **deps:** update dependency aws-sdk to v2.778.0 ([91276c4](https://www.github.com/erezrokah/aws-testing-library/commit/91276c4d047981dfadbbf77027b9a5e70732626f))
* **deps:** update dependency aws-sdk to v2.787.0 ([f18be1c](https://www.github.com/erezrokah/aws-testing-library/commit/f18be1c1f18673da9ef7a2d37f30c26fc35ed0ee))
* **deps:** update dependency aws-sdk to v2.792.0 ([7ede6db](https://www.github.com/erezrokah/aws-testing-library/commit/7ede6db0e6b3e4cc2cff01af62e751f3f0fa6b99))
* **deps:** update dependency aws-sdk to v2.799.0 ([585c242](https://www.github.com/erezrokah/aws-testing-library/commit/585c2428c9b04719581a983bd45b3364b32336cb))
* **deps:** update dependency aws-sdk to v2.814.0 ([896aca6](https://www.github.com/erezrokah/aws-testing-library/commit/896aca6b425e20bab85a1de216a110ecc8b7008f))
* **deps:** update dependency aws-sdk to v2.817.0 ([4126c6c](https://www.github.com/erezrokah/aws-testing-library/commit/4126c6c34c8df8bd5523eb9e52b861b20bf4a96c))
* **deps:** update dependency aws-sdk to v2.834.0 ([136b4ce](https://www.github.com/erezrokah/aws-testing-library/commit/136b4cebbd93059ddfb109c0684ebb09ddee114e))
* **deps:** update dependency aws-sdk to v2.839.0 ([ec162a6](https://www.github.com/erezrokah/aws-testing-library/commit/ec162a6a83840fc65fb641d9a9fae6e3f77e617e))
* **deps:** update dependency aws-sdk to v2.879.0 ([b998ffe](https://www.github.com/erezrokah/aws-testing-library/commit/b998ffe0d59415557511838936aadbed210815d0))
* **deps:** update dependency aws-sdk to v2.892.0 ([690739c](https://www.github.com/erezrokah/aws-testing-library/commit/690739ccc3064e1d25818501a9f5206fd3f801d4))
* **deps:** update dependency aws-sdk to v2.912.0 ([283b5d0](https://www.github.com/erezrokah/aws-testing-library/commit/283b5d0bd4f73772600504f2535125095e3237f5))
* **deps:** update dependency aws-sdk to v2.919.0 ([781f9b9](https://www.github.com/erezrokah/aws-testing-library/commit/781f9b9a71098ec0bda4069d70da7d24c3a79af5))
* **deps:** update dependency aws-sdk to v2.922.0 ([13c5d98](https://www.github.com/erezrokah/aws-testing-library/commit/13c5d9835f1bf89a35ffff96650a262a0fd7691e))
* **deps:** update dependency aws-sdk to v2.927.0 ([90cb876](https://www.github.com/erezrokah/aws-testing-library/commit/90cb876fba79ea98112a6b4c2210c4df6a8ab1c0))
* **deps:** update dependency aws-sdk to v2.931.0 ([1fcb301](https://www.github.com/erezrokah/aws-testing-library/commit/1fcb301cd36f7f68ab6c9128f487060d1f6bc0fd))
* **deps:** update dependency aws-sdk to v2.948.0 ([58a265d](https://www.github.com/erezrokah/aws-testing-library/commit/58a265d5bc8ba6ab6cf1cf64af826e121696530f))
* **deps:** update dependency aws-sdk to v2.953.0 ([481a5b6](https://www.github.com/erezrokah/aws-testing-library/commit/481a5b67398753d85b5218fcd4d0dabd3b9a899e))
* **deps:** update dependency aws-sdk to v2.968.0 ([fc8b90e](https://www.github.com/erezrokah/aws-testing-library/commit/fc8b90e5cf2fe1dfa7c448e469fa82289e01fa44))
* **deps:** update dependency axios to ^0.20.0 ([f545c07](https://www.github.com/erezrokah/aws-testing-library/commit/f545c07d423c6d5650cb465d84cbfe634b822d24))
* **deps:** update dependency axios to ^0.21.0 ([13f3eb9](https://www.github.com/erezrokah/aws-testing-library/commit/13f3eb9077810a488cecbf6aed406273f3870c8f))
* **deps:** update dependency axios to v0.21.1 ([fee434c](https://www.github.com/erezrokah/aws-testing-library/commit/fee434c51a608271194c08a7d141e08c38601939))
* **deps:** update dependency uuid to v7 ([#96](https://www.github.com/erezrokah/aws-testing-library/issues/96)) ([90efa7d](https://www.github.com/erezrokah/aws-testing-library/commit/90efa7d9830bf23a9865974832e79f964ca9275e))
* **deps:** update dependency uuid to v8 ([#146](https://www.github.com/erezrokah/aws-testing-library/issues/146)) ([3111ddf](https://www.github.com/erezrokah/aws-testing-library/commit/3111ddfaff0f3c439690fdb3959217e8a53dbdfd))
* **deps:** update dependency uuid to v8.3.1 ([d853a31](https://www.github.com/erezrokah/aws-testing-library/commit/d853a31eccd65d723f65ee51508a1e58cb2df097))
* **docs:** update readme ([f29783c](https://www.github.com/erezrokah/aws-testing-library/commit/f29783c4631343595ccfef851d9b24ae1f24df00))
