# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.0.0-alpha.30](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.29...v1.0.0-alpha.30) (2020-11-01)


### Bug Fixes

* **duplicate-doc:** prevent duplicating slug and some other fields ([6fe8fff](https://github.com/ecomplus/admin/commit/6fe8fffabb8dfa5553a7c9a1ccbe45846ac611fc))
* **orders-list:** fix handling status records to events array ([a9bd90d](https://github.com/ecomplus/admin/commit/a9bd90dfd8b939a8536402da0d5e3b3a30ebfa1d))

## [1.0.0-alpha.29](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.28...v1.0.0-alpha.29) (2020-10-25)


### Features

* **products-form:** show customization additional price ([fb3cbc1](https://github.com/ecomplus/admin/commit/fb3cbc14756eecec8618755539acb1bceb5a96ea))


### Bug Fixes

* **products-form:** normalize grid id to get grid title ([#250](https://github.com/ecomplus/admin/issues/250)) ([a33c505](https://github.com/ecomplus/admin/commit/a33c505b1f781e6f5a1cbec30c678fa67432164d))

## [1.0.0-alpha.28](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.27...v1.0.0-alpha.28) (2020-10-24)


### Features

* **products-list:** bulk enable/disable products from list ([#189](https://github.com/ecomplus/admin/issues/189)) ([7aa2f0e](https://github.com/ecomplus/admin/commit/7aa2f0e61b7b7931018855a7ad18e714b6aa04de))
* **products-list:** list product\'s orders from link on products list ([8bf176b](https://github.com/ecomplus/admin/commit/8bf176b906f36658f8954295a158a0183dd8b40f))


### Bug Fixes

* **sw:** must declare `self.__WB_MANIFEST` ([d8f388d](https://github.com/ecomplus/admin/commit/d8f388d1d2686cb7996a111ce289869ddd6a0117))

## [1.0.0-alpha.27](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.26...v1.0.0-alpha.27) (2020-10-23)


### Features

* **products-list:** show sales count and add titles for state icons ([#208](https://github.com/ecomplus/admin/issues/208)) ([48e1428](https://github.com/ecomplus/admin/commit/48e1428be1658d262694b7c5b901a69891ffb575))


### Bug Fixes

* **chunk-names:** set chunk filenames to properlly handle cache ([#247](https://github.com/ecomplus/admin/issues/247)) ([16ee0ec](https://github.com/ecomplus/admin/commit/16ee0ece9ce8b04e0fc7027b6f700c5339b7f3c0))
* **sw:** remove precache and route rule, add runtime routes for bundles ([#274](https://github.com/ecomplus/admin/issues/274)) ([e3cd454](https://github.com/ecomplus/admin/commit/e3cd454306a031d7ac18278794acaff831e08a83))

## [1.0.0-alpha.26](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.25...v1.0.0-alpha.26) (2020-10-17)


### Features

* **products-form:** preview variations quantities and prices ([90cad43](https://github.com/ecomplus/admin/commit/90cad43501228f9686d7eef349947c77a56caf53))


### Bug Fixes

* **form-input-watcher:** ensure remove last level property ([#207](https://github.com/ecomplus/admin/issues/207)) ([6caa5c2](https://github.com/ecomplus/admin/commit/6caa5c2e817cbb4964e8086e6ed2f7f274ea9526))
* **products-form:** prevent error setting common grid options on customizations ([#227](https://github.com/ecomplus/admin/issues/227)) ([4255f30](https://github.com/ecomplus/admin/commit/4255f30127b8d8d0b02bce3923714607a547892b))
* **products-form:** rendering variations with specs by text only ([#228](https://github.com/ecomplus/admin/issues/228)) ([3f624dc](https://github.com/ecomplus/admin/commit/3f624dce4bf8c3c481b3a3b5cba15fae0fcd4da9))

## [1.0.0-alpha.25](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.24...v1.0.0-alpha.25) (2020-10-15)


### Bug Fixes

* **deps:** rollback to webpack-cli v3 ([9e3bcb2](https://github.com/ecomplus/admin/commit/9e3bcb2377dec6e75be99bb458f1cd2833fe7a7f))
* **session-persist:** ensure setting EcomAuth session when starting logged ([22836cf](https://github.com/ecomplus/admin/commit/22836cfd241bbe4bf0fe147cd0fb371a7ca88050))

## [1.0.0-alpha.24](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.23...v1.0.0-alpha.24) (2020-10-12)


### Bug Fixes

* **collections-form:** fix handling collections products list ([#212](https://github.com/ecomplus/admin/issues/212)) ([7e974be](https://github.com/ecomplus/admin/commit/7e974be319afd3c9c873ccebfde711b6c0ddbf62))
* **login:** checking and reseting expired access tokens ([9e57604](https://github.com/ecomplus/admin/commit/9e576046d3b2c65af931da5d9eb0cd1285a112ac))

## [1.0.0-alpha.23](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.22...v1.0.0-alpha.23) (2020-10-11)


### Bug Fixes

* **export-csv:** skip 'Object()' columns, hardset papaparse columns ([9e4f9a8](https://github.com/ecomplus/admin/commit/9e4f9a8f7fa535c6385c483c45cba564f2e1438f))
* **resources-list:** specify fields for list all csv export ([714a9d7](https://github.com/ecomplus/admin/commit/714a9d7acee8ac020c228b4b9e6d41455129970f))

## [1.0.0-alpha.22](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.21...v1.0.0-alpha.22) (2020-10-10)


### Features

* **document-title:** set title with store name if available ([8046222](https://github.com/ecomplus/admin/commit/8046222542104d101c4f1c95ed22435ab6237d7a))
* **export-all-list:** partially export all resource documents ([#235](https://github.com/ecomplus/admin/issues/235)) ([9848a33](https://github.com/ecomplus/admin/commit/9848a33ce1829f0f304abb83d00659d72bfc0456))


### Bug Fixes

* **fatal-error:** force logout on fatal error ([9725747](https://github.com/ecomplus/admin/commit/97257473a76469590a6d6740c27ba8f29ab5f44f))

## [1.0.0-alpha.21](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.20...v1.0.0-alpha.21) (2020-10-08)


### Features

* **keep-login:** handle session and local storage to keep login keys ([#217](https://github.com/ecomplus/admin/issues/217)) ([263b3bf](https://github.com/ecomplus/admin/commit/263b3bf6b68e635214fe7bc1c1672df20083f392))


### Bug Fixes

* **ace-editor:** send commit event on editor blur ([#225](https://github.com/ecomplus/admin/issues/225)) ([2d0a088](https://github.com/ecomplus/admin/commit/2d0a0882650bcdcc400be3e6a2201b6b2c3a589b))
* **export-table:** generate table with all keys ([#233](https://github.com/ecomplus/admin/issues/233)) ([dfd0905](https://github.com/ecomplus/admin/commit/dfd090535dd1d3e264b7d8eeefd6d6ea4f695357))
* **orders-form:** ignoring duplicated status entries ([#232](https://github.com/ecomplus/admin/issues/232)) ([30a3a87](https://github.com/ecomplus/admin/commit/30a3a871807beb388139f28bd923f967d986b672))

## [1.0.0-alpha.20](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.19...v1.0.0-alpha.20) (2020-09-30)


### Bug Fixes

* **products-list:** sort _score by default ([a3c33d3](https://github.com/ecomplus/admin/commit/a3c33d3e6a77efbf7936f10332e5e766a32e84a2))
* data promo removing offset time ([c3f2f9f](https://github.com/ecomplus/admin/commit/c3f2f9ffed1f3f01b9406c6a84d1f8eacc1bb1cd))
* fix quantity mass edit and put for variations too ([8f5754d](https://github.com/ecomplus/admin/commit/8f5754d1a3c056d68feb88f876ee40cd092e4534))

## [1.0.0-alpha.19](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.18...v1.0.0-alpha.19) (2020-09-04)


### Features

* **customers-list:** add doc and phone number ([#199](https://github.com/ecomplus/admin/issues/199)) ([132353d](https://github.com/ecomplus/admin/commit/132353d80999fbe737069b4c02571c0d7b0e8e92))
* **media-library:** list images starting from last ones ([#35](https://github.com/ecomplus/admin/issues/35)) ([1db1fbb](https://github.com/ecomplus/admin/commit/1db1fbb424013f3bf8b804b04d5e8b704d59d399))
* **products-list:** optional filters by 'available' and 'visible' [#189](https://github.com/ecomplus/admin/issues/189) ([5efdc59](https://github.com/ecomplus/admin/commit/5efdc597cc6e014e7938da2537e37fa70a9c1efc))
* **produts-form:** handling product customizations ([#115](https://github.com/ecomplus/admin/issues/115)) ([2ecef77](https://github.com/ecomplus/admin/commit/2ecef77cc668523118ee1364e3e9f21a82513d4c))


### Bug Fixes

* **products-list:** fix quantity mass edit and also handle variations ([#210](https://github.com/ecomplus/admin/issues/210)) ([1e11ccf](https://github.com/ecomplus/admin/commit/1e11ccfde8591a09a3bff28e4597d1799c273295))
* **products-list:** using one els sort rule only ([#179](https://github.com/ecomplus/admin/issues/179)) ([308710b](https://github.com/ecomplus/admin/commit/308710b6f0eb399eaddedbbeabbde1cd357492e6))

## [1.0.0-alpha.18](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.17...v1.0.0-alpha.18) (2020-09-02)


### Features

* **error-handling:** better api error msg and try focusing invalid input ([e1d8e48](https://github.com/ecomplus/admin/commit/e1d8e482f2b49da3ca43ab1dc7f9a69001b84178))
* **products-form:** most complete production time info ([5b5ca11](https://github.com/ecomplus/admin/commit/5b5ca11696ce72b85ec49c01514637d16623a339))


### Bug Fixes

* **css:** removing wrong generic btn-group style ([54d32ef](https://github.com/ecomplus/admin/commit/54d32efabc685abd3717f1e6a44b397fda3051c8))
* **duplicate-products:** suffix sku and create new _id for variations [#198](https://github.com/ecomplus/admin/issues/198) ([9d2556a](https://github.com/ecomplus/admin/commit/9d2556ad9c7e15e6ec27d2a0e8c398d537cf9564))
* **products-form:** escape special chars to handle name test for variations ([1a03ed1](https://github.com/ecomplus/admin/commit/1a03ed15e50485842e28a1324b512bcd9069010d))
* **products-form:** fixes for preset grids and options ([ee5eb39](https://github.com/ecomplus/admin/commit/ee5eb39fa336558deca25ffa3b8accd6d2c7397f))
* **router:** prevent having empty routes history ([5339df8](https://github.com/ecomplus/admin/commit/5339df81c566bca72471140e5dcf6b385e417f32))

## [1.0.0-alpha.17](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.16...v1.0.0-alpha.17) (2020-08-29)


### Bug Fixes

* **form:** fix selector for inputs text (no type attr) ([9a7c1f4](https://github.com/ecomplus/admin/commit/9a7c1f47e1a10186acc62cbc64f6dcfd62903e0f))

## [1.0.0-alpha.16](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.15...v1.0.0-alpha.16) (2020-08-29)


### Bug Fixes

* **customiers:** fix printing undefined customer props (empty) ([42657a7](https://github.com/ecomplus/admin/commit/42657a7a05597426a0ebb3a30d50bc371aa2b589))
* **customiers:** prevent error with undefined order info properties (new customer) ([b12fe29](https://github.com/ecomplus/admin/commit/b12fe2901e6cff2b01a7395e724d0e8ad1f6b5bb))
* **deps:** @ecomplus/storefront-twbs still needed for toast plugin ([6aa7e48](https://github.com/ecomplus/admin/commit/6aa7e48037d3b8aefec1526e3ddd7adb93b2b664))

## [1.0.0-alpha.15](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.14...v1.0.0-alpha.15) (2020-08-28)


### Features

* **admin-production-time:** insert production time into product ([42bb5ca](https://github.com/ecomplus/admin/commit/42bb5caace336988738c4ea1d3adca4a027497c2))
* **advanced-dash:** handling optional ace editor and advanced dash option ([38d0fee](https://github.com/ecomplus/admin/commit/38d0feed303fbc35aa35ab3bf37eb15e1fa1cb5c))
* **list-products:** also support search by sku ([#193](https://github.com/ecomplus/admin/issues/193)) ([e05634a](https://github.com/ecomplus/admin/commit/e05634a6e0d2aa38b5769ebbe2ea4d3c9f1eb01b))
* **login:** handle option md5 pass wntry and advanced dash ([d0c2d9f](https://github.com/ecomplus/admin/commit/d0c2d9f4fc472fd50ebbdf3e11306a525a7f84c4))
* **order-admin:** fix global impors and put whatsapp link ([88540f9](https://github.com/ecomplus/admin/commit/88540f9851ec8675e29506afac17b942320230da))
* insert input for google product category id ([73b6675](https://github.com/ecomplus/admin/commit/73b6675e3ac3cfdd584689a11d1ddb34d0917d52))


### Bug Fixes

* **admin-category:** add delay in to post mass edit ([548b9cc](https://github.com/ecomplus/admin/commit/548b9cc2c653b5c381b2ab7b9b08de0f8fa78557))
* **deps:** add jquery libs and sortable to skip using compiled App.js ([98fc668](https://github.com/ecomplus/admin/commit/98fc6682175720bdbae3b10e2f021be8ebd3e880))
* **deps:** fix not used (yet) @ecomplus/storefront packages ([068c273](https://github.com/ecomplus/admin/commit/068c2738a1f614144dd7858ceb89ef4b928cef6a))
* **resources:** hide advanced (json editor) tab by default ([5a7e7cd](https://github.com/ecomplus/admin/commit/5a7e7cd645ccfc2ffd9605dabe9a9c6f2b6868f5))
* **resources-lists:** fix parsing csv booleans ([#176](https://github.com/ecomplus/admin/issues/176)) ([1049f39](https://github.com/ecomplus/admin/commit/1049f39f59cb7363f62ad87347a54861015289c4))
* **scss:** minor fix for custom controls (inline) ([a595f90](https://github.com/ecomplus/admin/commit/a595f901f7a0ea3e8cafc4d8c3ba489ad87949a3))
* items in to invoice with valid quantity ([#185](https://github.com/ecomplus/admin/issues/185)) ([aec749b](https://github.com/ecomplus/admin/commit/aec749b585ab1bae70cbbc18744edf084b0e9722))
* s/n from and to correios and custom ([2aa593d](https://github.com/ecomplus/admin/commit/2aa593de209e0e7b5de84ac332b9bb325a3c7ec1))

## [1.0.0-alpha.14](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.13...v1.0.0-alpha.14) (2020-07-12)


### Features

* **orders-form:** minor form layout edit, add some fields ([97a643d](https://github.com/ecomplus/admin/commit/97a643d083ae68b9531115ace5bdf54525c70880))


### Bug Fixes

* **deps:** update all non-major dependencies ([#166](https://github.com/ecomplus/admin/issues/166)) ([d6e9b65](https://github.com/ecomplus/admin/commit/d6e9b65106d253b6afd649c2ec622508aa6c8e36))
* **lists:** fix infinite edits for some columns ([9a49890](https://github.com/ecomplus/admin/commit/9a4989063f206588a0f49007ab306f0ff5c9f3e0))

## [1.0.0-alpha.13](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.12...v1.0.0-alpha.13) (2020-07-02)


### Bug Fixes

* **home:** fix handling orders data/statistics ([#164](https://github.com/ecomplus/admin/issues/164)) ([ca59b7b](https://github.com/ecomplus/admin/commit/ca59b7b30c080fbcfa58bb12fad700b4d597ac1b))

## [1.0.0-alpha.12](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.11...v1.0.0-alpha.12) (2020-07-01)


### Bug Fixes

* **assets:** fix some img filenames (fix service worker) ([0036cdf](https://github.com/ecomplus/admin/commit/0036cdf68c07a7f90ca2efca9074d6e6f3fbee9e))
* **product-form:** fix GTIN/MPN for variations (string only, not array) ([10b864f](https://github.com/ecomplus/admin/commit/10b864f7baeaf1bd31ca16b345b90985fb27c353))

## [1.0.0-alpha.11](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2020-06-18)


### Features

* **orders-list:** handling orders statistics ([82f8fa0](https://github.com/ecomplus/admin/commit/82f8fa0025126537fa644d068ff3e18ed67cb6f1))

## [1.0.0-alpha.10](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2020-06-18)


### Features

* **products-list:** also handle csv import/export for products ([3c5b22a](https://github.com/ecomplus/admin/commit/3c5b22ab42ddec69807dd9134d65f5373cb5e7fd))

## [1.0.0-alpha.9](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2020-06-16)


### Features

* **shipping-tags:** handling Correios content declaration document ([257b9c7](https://github.com/ecomplus/admin/commit/257b9c7cfc395b079a00e1e5eea85dd7f3e8000d))


### Bug Fixes

* **deps:** update @ecomplus/admin-marketplace, add brazilian-utils ([34cd6b6](https://github.com/ecomplus/admin/commit/34cd6b69ae2d09eafb9a9ac65186d2835749bf4b))
* **i18n:** set $ecomConfig default currency (BRL) ([b41f55f](https://github.com/ecomplus/admin/commit/b41f55f3fec144e6ca72846be7ad3189737b547d))

## [1.0.0-alpha.8](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2020-06-09)


### Bug Fixes

* **prints:** better print styles for invoices and shipping tags ([4db9dcc](https://github.com/ecomplus/admin/commit/4db9dcc84ae56bd91dde0b5777351a8b7e8753c6))
* **resource-forms:** fix handling empty prop to remove ([a6ed257](https://github.com/ecomplus/admin/commit/a6ed257bc6090fa656d03f04296a434943ad61d4))

## [1.0.0-alpha.7](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2020-06-04)


### Features

* **resources-lists:** handling csv table import ([fc203ba](https://github.com/ecomplus/admin/commit/fc203ba9ca0695a2468fd09d7f6f8dbdf50293e1))

## [1.0.0-alpha.6](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2020-05-30)


### Features

* **invoices:** multiple invoices print, fix tab title ([a924113](https://github.com/ecomplus/admin/commit/a92411367f73f66e0e8c9a6e8eff7ed36a6aacc3))
* **list:** handling export to csv and list custom tools ([458a280](https://github.com/ecomplus/admin/commit/458a280c8cbd13a0d8af8ad100d4cdd0442390d1))
* **resources:** default edit btns for lists ([239a47a](https://github.com/ecomplus/admin/commit/239a47aeb248238c28094be8d1e9ae974ea171b2))


### Bug Fixes

* **forms:** general legacy code fixes ([24e8749](https://github.com/ecomplus/admin/commit/24e8749773833e98f70088f8c2fec1e7a44d61d3))
* **resource-forms:** fix handling bottom save buttons ([0cf9f1e](https://github.com/ecomplus/admin/commit/0cf9f1eaaff15d77db4e8336dab6961ac0446362))
* **shipping-tags:** refactoring shipping tags, fix requests and els ([2288f23](https://github.com/ecomplus/admin/commit/2288f23d1e3bea9f43ce983829bab37501e09ce6))
* **util:** skip Mony for now (legacy) ([c909e1d](https://github.com/ecomplus/admin/commit/c909e1d9c58d9c2fe962758c4e59621b0f1eaead))

## [1.0.0-alpha.5](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2020-05-29)

## [1.0.0-alpha.4](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2020-05-28)


### Features

* **list:** 'like' search for names and email ([187cc5b](https://github.com/ecomplus/admin/commit/187cc5b1bf4e03ca5cbbf90d927bae48e65dea1d))


### Bug Fixes

* **resource-forms:** fix handling picture objects without thumbs ([51ee9f6](https://github.com/ecomplus/admin/commit/51ee9f601e359413dec5fa2f16dffe8964046782))

## [1.0.0-alpha.3](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2020-05-25)


### Bug Fixes

* **resource-list:** minor style fixes for resource lists ([4cf6ba7](https://github.com/ecomplus/admin/commit/4cf6ba7cd96bb60b802dab53329173fd446d40ad))

## [1.0.0-alpha.2](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-05-25)


### Features

* **orders-list:** auto set min/max number for equal search by default ([82adce2](https://github.com/ecomplus/admin/commit/82adce2e3c25ec7f69a9b5a8de0a12ade802ebec))
* **resources-list:** multi fields columns, mock default orders fields ([869a388](https://github.com/ecomplus/admin/commit/869a3884ea9144dde77b2e3dbe15fd987b8034ef))


### Bug Fixes

* **deps:** update @ecomplus/utils to v1.4.1 ([49454e1](https://github.com/ecomplus/admin/commit/49454e164ebbb1fd9a5f6525b2f2691042b0f869))
* **imports:** importing json data properly ([fe9cb9f](https://github.com/ecomplus/admin/commit/fe9cb9f3a035b4a43afd9558980ec70227582de3))
* **product-form:** using 'swatches-first' (not only) on colorpickers ([db57fe5](https://github.com/ecomplus/admin/commit/db57fe54cfb9ac5c032759ab2e5a62ea97586df8))
* **resource-lists:** truncate text on limited length cols ([4408e1b](https://github.com/ecomplus/admin/commit/4408e1b86fb5a7b1b783567430f5ab8597bd3ed9))
* **scss:** data list gereral fixes ([40ae06c](https://github.com/ecomplus/admin/commit/40ae06c66b23c96ebf00813a69e825170da6bedc))
* **scss:** minor fixes for select and button styles ([011a101](https://github.com/ecomplus/admin/commit/011a101f728dcb1ec6cfae6cdcf30604d6fc25b8))
* **scss:** minor form components and buttons styles fixes ([4e30812](https://github.com/ecomplus/admin/commit/4e308128a7cb7251d7feae0ae486c086c3ddca2a))
* **selectpicker:** ensuring picker works on first click, set defaults ([5e05330](https://github.com/ecomplus/admin/commit/5e053303ee00ac6681d1d2bd599d035e1aa57c3e))
* **toast:** minor fix to prevent toast container overlaping ([a465afe](https://github.com/ecomplus/admin/commit/a465afe3ad6577cddebe2f7c2ae76ac43285dbbe))

## [1.0.0-alpha.1](https://github.com/ecomplus/admin/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2020-05-24)


### Bug Fixes

* **deps:** update @ecomplus/admin-marketplace to v0.2.22 ([de40887](https://github.com/ecomplus/admin/commit/de40887ddc0f14c43ed3e0d7a9ad2329a5ced3f3))
* **orders-form:** fix payments history & fulfillments order on timeline ([6cdbe21](https://github.com/ecomplus/admin/commit/6cdbe21798e1f428615c414ba12676af54517e6a))
* **products-list:** minor fixes for item component ([bb30bb9](https://github.com/ecomplus/admin/commit/bb30bb99b05c99ee7c8e491e7f2174c072bb3125))
* **tabs:** using link text or title for target blank tabs ([1e4cb01](https://github.com/ecomplus/admin/commit/1e4cb01c59e7716ce6aa4040e9afc9106b84f44a))
* **toast:** warning type by default ([fccf769](https://github.com/ecomplus/admin/commit/fccf7691bf6e41dbe49badc254dec4eb37b9511c))

## [1.0.0-alpha.0](https://github.com/ecomplus/admin/compare/v0.1.0...v1.0.0-alpha.0) (2020-05-23)


### Features

* **toast:** using bootstrap 4 toast (multiple) ([9648d62](https://github.com/ecomplus/admin/commit/9648d62999eec0470823c1ac523d964c65355781))
* add address form ([fc579d3](https://github.com/ecomplus/admin/commit/fc579d3666e5d57cc642612c47ae72fa72a186d8))
* add discounts in to order list ([45f56d9](https://github.com/ecomplus/admin/commit/45f56d90126d23c3f4421c9eaab3e56a6ad888f2))
* add discounts in to order list ([ef5059b](https://github.com/ecomplus/admin/commit/ef5059b91ea9ba165b00038f8e22c6908ef12129))
* add discounts in to order list min js ([5432407](https://github.com/ecomplus/admin/commit/543240732aeca2b124f2d3d01d79d2f8a9d81ba2))
* add doc number at creation order in panel ([c0a9539](https://github.com/ecomplus/admin/commit/c0a9539fe03314c064d5b66e3efc307e490dd2e0))
* add doc number at creation order in panel minify ([2b864f7](https://github.com/ecomplus/admin/commit/2b864f7cdc2668d71135e92ac24d569fbfdc7b57))
* add to all resources ([1f5348a](https://github.com/ecomplus/admin/commit/1f5348a1a30fd17792896acfc1d340ef5af0e955))
* add to all resources ([ba22adf](https://github.com/ecomplus/admin/commit/ba22adf47488c42dac8878698a2f2018aa99186e))
* adding billing and shipping from addresses on orders form ([5bfeac8](https://github.com/ecomplus/admin/commit/5bfeac878b3341b487a559be410ff361fff4943e))
* additional route especific save action callback ([44fc025](https://github.com/ecomplus/admin/commit/44fc025ea5886ef4d2005f3b2a528d2f2c167365))
* category mass edit ([ba134b1](https://github.com/ecomplus/admin/commit/ba134b11268a2858bf89cfe44bf53a41a91ffba9))
* collapsable links with resumed content (em), for addresses blocks ([3d7f4a3](https://github.com/ecomplus/admin/commit/3d7f4a3b91830894f0d6d53c2861004bd8e7295e))
* complete customers page ([eb71ccb](https://github.com/ecomplus/admin/commit/eb71ccb2c8bebe963b909da594e437a9e1016c8f))
* complete info costumer and iniciate shipping address ([20ff97f](https://github.com/ecomplus/admin/commit/20ff97f62a61b32d8525ba341828e8543d635681))
* completing shipping address form ([9b8d9c6](https://github.com/ecomplus/admin/commit/9b8d9c648f2ab22766ad4ad11a2fb63e8bb96ebd))
* coupon and doc number into list ([fcc024e](https://github.com/ecomplus/admin/commit/fcc024e3195b08897bee2f45cd81cca7c6ea4f90))
* coupon insert ([ac3b535](https://github.com/ecomplus/admin/commit/ac3b535117da7c436b95c20d0ff6280d2899ea20))
* create a pre-version of home admin ([6735bac](https://github.com/ecomplus/admin/commit/6735bac8c39b470d71c717012315b66666a931d0))
* create js file collection to insert products into colection ([9f04da2](https://github.com/ecomplus/admin/commit/9f04da2e118f3ce9fb279815f84c9869c5f2422f))
* etiqueta de envio ([94de285](https://github.com/ecomplus/admin/commit/94de285ad198ba1afe13e6c0f4d991f52dead7cb))
* etiqueta de envio em massa ([77bf554](https://github.com/ecomplus/admin/commit/77bf554fdb4f70609250cd39a85063c6d713a715))
* filling delivery address with buyer address by default ([e8595ec](https://github.com/ecomplus/admin/commit/e8595ec714515ec5372c41d538142a3e4fa36725))
* final version 1.0 of home admin ([a6252d6](https://github.com/ecomplus/admin/commit/a6252d6ed1d1980f556a075944891b800c5c57ec))
* finishing shipping lines form on orders edit ([6a0aa17](https://github.com/ecomplus/admin/commit/6a0aa1715c33372f4e17bf3f9840ec7ab8046fda))
* fix orders form structure, adding more fields ([aa85aa8](https://github.com/ecomplus/admin/commit/aa85aa8fcb8ff0f695d463ecba44f16bce288c6f))
* handling orders timeline ([db6170a](https://github.com/ecomplus/admin/commit/db6170a23225cd2e35212cc5c68e8efc743301ed))
* keep toast while mouse is over the element ([df0e833](https://github.com/ecomplus/admin/commit/df0e833de3d5488cdac03881f5e22862361c7a9d))
* mass edit price ([762d3d8](https://github.com/ecomplus/admin/commit/762d3d8fd8f0e29926859367920ff6c35a2b838d))
* medium version of configuration page ([53fa037](https://github.com/ecomplus/admin/commit/53fa037d425f76d33d687b252c50d3c94144d653))
* mocks for transactions pagination ([262393a](https://github.com/ecomplus/admin/commit/262393ad2601fb152adac05c9834c9efd3cb7cf0))
* new logo and plan information at settings page ([dc1851d](https://github.com/ecomplus/admin/commit/dc1851d1373a247ef51586f41643412e59fd2866))
* new version of configuration page ([d89cfd9](https://github.com/ecomplus/admin/commit/d89cfd92f470f05590cb78a643e8b78e3c9307be))
* new version of home admin ([20b4840](https://github.com/ecomplus/admin/commit/20b4840945bc4190ca361470a90c1369fbef4a34))
* notifications version 1.0 ([2e5bde8](https://github.com/ecomplus/admin/commit/2e5bde80ae839e4caf00ed8c5f7f81e6bac46149))
* option to skip api error on call api function ([4a27925](https://github.com/ecomplus/admin/commit/4a279253448a0ab86cb0078f87e3c0bf15ff99ec))
* prompt when resource edit ([2e7a825](https://github.com/ecomplus/admin/commit/2e7a82595c6b0dac7088542dc8081c7e08936d95))
* remove non-numeric chars for tel inputs with data-numeric-string (data-value) ([f6ef94e](https://github.com/ecomplus/admin/commit/f6ef94e73bdf985860f192fa73d6b6aa56523463))
* romaneio ([d56e900](https://github.com/ecomplus/admin/commit/d56e900350e0b40d87248758dc492764389b2901))
* save new grids on product form ([265de62](https://github.com/ecomplus/admin/commit/265de62ba20031005ccbd350f15e6e61405dba35))
* saving handleNestedObjects globally (reuse for customers form) ([cd73663](https://github.com/ecomplus/admin/commit/cd736639ef9b64bfbdb5284c4b7db6b4c20c74c5))
* sending tag standart ([4f1c7a6](https://github.com/ecomplus/admin/commit/4f1c7a656eddd388f1bebb2185570c2c957bfa14))
* setting up dashboard sidebar and header ([0facabd](https://github.com/ecomplus/admin/commit/0facabdee0fefa2be6e856b48588b6b1471572b1))
* setting up inputmask with data-mask ([f003d0d](https://github.com/ecomplus/admin/commit/f003d0d16e8c4e0dd8d9e6e869a43fb7a823040c))
* showing delivery address on orders form ([528b108](https://github.com/ecomplus/admin/commit/528b1084a1e5b8b68bdeb6b8ed3883c6389a0613))
* starting with customers form ([27e6782](https://github.com/ecomplus/admin/commit/27e678222dab1b3cac72411b8ee18cf6b30c8658))
* website url and brand color at settings page ([9483c57](https://github.com/ecomplus/admin/commit/9483c57d1ee54599a9c56eae64f5ab13efad273f))


### Bug Fixes

* **dashboard:** must start with all elements on initial html for plugins ([c576250](https://github.com/ecomplus/admin/commit/c5762508e1d959ed8c8b371e5c453e6ce4f7bf11))
* **i18n:** fix handling array entry ([afbf22c](https://github.com/ecomplus/admin/commit/afbf22c9b7d0d9ff1236d5b6df29a014b64b61c0))
* **product-form:** adjusted problem to load form in product resource ([#130](https://github.com/ecomplus/admin/issues/130)) ([6f1fade](https://github.com/ecomplus/admin/commit/6f1fadeef16df52f4b6415d494129d59660be6d0))
* **product-form:** random sku on product duplication ([6af8a6a](https://github.com/ecomplus/admin/commit/6af8a6a602c8a236f7ce8b948f6a9e70a0854184))
* **products:** fix head in products form ([#123](https://github.com/ecomplus/admin/issues/123)) ([39487f4](https://github.com/ecomplus/admin/commit/39487f408a2a9280828ecd23ab376f762cd0cc80))
* **resources:** render h1, fix checking new document ([81ad23c](https://github.com/ecomplus/admin/commit/81ad23cced0225926fbba7b27615bf0860da25f3))
* **scss:** fix button styles and minor sidebar fixes ([83df7a0](https://github.com/ecomplus/admin/commit/83df7a08d2891168740eeb38389ade349d9dee7f))
* **scss:** fix handling initially hidden dashboard elements ([6ef9f27](https://github.com/ecomplus/admin/commit/6ef9f27f30ff5a41f46a25ec6d58157ccc1565d8))
* **scss:** fix select (btn) styles ([0c98692](https://github.com/ecomplus/admin/commit/0c986929c6ba463465cbd36bcca91918c1f9a7c7))
* **scss:** fix toast styles ([470fa7b](https://github.com/ecomplus/admin/commit/470fa7b3567e4896b21a3222f001b62ad562630a))
* **sidebar:** removing sales channels reference ([cca9b21](https://github.com/ecomplus/admin/commit/cca9b21730d174dae398baf50d3f00ee9871a626))
* abstract customer panel ([317343f](https://github.com/ecomplus/admin/commit/317343f6cd6cb5435708e6cb42af5cfbf3026016))
* abstract customer panel minify ([6c6c56b](https://github.com/ecomplus/admin/commit/6c6c56b03111cf7bd95933bc85e4e0c362bec1ae))
* adjusted order when quantity or price rule ([#128](https://github.com/ecomplus/admin/issues/128)) ([f34844e](https://github.com/ecomplus/admin/commit/f34844e1d6fe65479e04946a4c2ba5ef3fd93e1d))
* app redirect ([f041abd](https://github.com/ecomplus/admin/commit/f041abd2972fc22a4b40b64ff17b501ab4523375))
* brand color fix ([f2dfb8b](https://github.com/ecomplus/admin/commit/f2dfb8ba07108a09f84038c4b7fb0ffabaffd4a8))
* brand color fix ([51c0c26](https://github.com/ecomplus/admin/commit/51c0c26f0191a5d0629d19fc2bc5932ae37fee8a))
* bug at customers ([28f9d0f](https://github.com/ecomplus/admin/commit/28f9d0f5e2332d7d44939db70e5f6c8cc428e4c0))
* bug at customers min ([da9188c](https://github.com/ecomplus/admin/commit/da9188c1c47b9955b68512c9679fb11c0005fdae))
* bug at gender customers ([52404c5](https://github.com/ecomplus/admin/commit/52404c54d89d83065ab277b1f8ee78702bf9f9e1))
* check authentication before css files to redirect to login faster ([b523d7a](https://github.com/ecomplus/admin/commit/b523d7a3c6eb8a85da9e3916b75eca1682756581))
* collection migration, PUT/PATCH, deleting coupon ([b115299](https://github.com/ecomplus/admin/commit/b115299df5928a0f1888bee663703bbba6c1d0cb))
* color brand and logo appearance ([f8db9ae](https://github.com/ecomplus/admin/commit/f8db9ae2493183c5b2c67de56844b6997b4e1ea1))
* color brand ang logo appearance ([d1f8582](https://github.com/ecomplus/admin/commit/d1f8582ce71f15e8709deef52298a661e5a7f43c))
* correcting error with create new customer ([c74dc90](https://github.com/ecomplus/admin/commit/c74dc90e7de0e12559baf87b50ca6002d5b466c6))
* correios change ([2212825](https://github.com/ecomplus/admin/commit/22128256ae930688bf44ed67f855fa0ae2e18aee))
* correios change min js ([bd3072f](https://github.com/ecomplus/admin/commit/bd3072f04693e8588df9f0cbdf94d317d8021c87))
* customers ([d823726](https://github.com/ecomplus/admin/commit/d8237267d79059ad829705c7b2d5af1a773ad844))
* customers ([444eebf](https://github.com/ecomplus/admin/commit/444eebfad73f357e8e13704f199bb6fb9a9a7316))
* customers min ([09fa7a4](https://github.com/ecomplus/admin/commit/09fa7a46e992237769170ff27c2ed3168338ab27))
* customers min ([1dc1bee](https://github.com/ecomplus/admin/commit/1dc1beed7f1d12a0f7971a18f84538022ba7a876))
* data with correct UTC ([124be8b](https://github.com/ecomplus/admin/commit/124be8b1892df53f0270e7289178452acaf7054b))
* data with correct UTC min js ([7df0dd6](https://github.com/ecomplus/admin/commit/7df0dd6aeb0de8119cc93d3899c794d2dbbb79b1))
* delete export route ([b4a0d6d](https://github.com/ecomplus/admin/commit/b4a0d6d328756b1e7cc9b04d59295ce7e5509440))
* delete fixed ([17cc302](https://github.com/ecomplus/admin/commit/17cc302e25cd8a8a2c86cb427326c1de8e5687bd))
* delete fixed minjs ([c202121](https://github.com/ecomplus/admin/commit/c2021212f548d708d79e92cbf559375ea2ae5e08))
* erase data from promo ([b0dbcb8](https://github.com/ecomplus/admin/commit/b0dbcb8de1449fa895342437843884011b0daa08))
* erase data from promo min js ([ae85b81](https://github.com/ecomplus/admin/commit/ae85b811c2b6afb222b8a39840cb88f88986f5aa))
* error at birth mask ([f748824](https://github.com/ecomplus/admin/commit/f74882403e0763a1afe2a926c588dcef57467585))
* etiqueta de envio ([6f97c06](https://github.com/ecomplus/admin/commit/6f97c06db6e093c178a00f53d3c91dc223943563))
* etiqueta de envio em massa ([55f812a](https://github.com/ecomplus/admin/commit/55f812ab10dddf21ab400355dd0745c76b948287))
* fix bug to create any resource ([#129](https://github.com/ecomplus/admin/issues/129)) ([f21d88b](https://github.com/ecomplus/admin/commit/f21d88bd02bb71479b21bd3aa814f18237a12ed3))
* fix erro at customers's admin and update birthdate ([c82a416](https://github.com/ecomplus/admin/commit/c82a41683eac5bbccd2cabfea349b6820b082dbc))
* fix html markup on form elements ([e99fc86](https://github.com/ecomplus/admin/commit/e99fc8600d2b6bf35697895269754bea82691105))
* fix mask and update birth and full name data ([7f202b1](https://github.com/ecomplus/admin/commit/7f202b1028bdb9098bf9ea524735def9e5ab3a3f))
* fixing graphs home.min.js ([1d782ae](https://github.com/ecomplus/admin/commit/1d782aea1980f0f0e1202caae1312e2bdc7530df))
* fixing nested objects handling on orders form ([6fae4d2](https://github.com/ecomplus/admin/commit/6fae4d2d38438ca9d7b82c05ce7580d66abf39d8))
* fixing sso flux (back to sso original url) ([1b561a9](https://github.com/ecomplus/admin/commit/1b561a91c0148d5ea50a9add7b4ac817ca324d5a))
* full name ([afbcc85](https://github.com/ecomplus/admin/commit/afbcc85109008802ffb4fd7d4a6bbdf3184698bc))
* full name ([f2883e9](https://github.com/ecomplus/admin/commit/f2883e9d55d02b45e6503cbcdd586616fae43c70))
* handle data to input for array of objects without objectId ([db8e29e](https://github.com/ecomplus/admin/commit/db8e29e668e5dc5de44aaae54596f40e82e99178))
* home ([df30073](https://github.com/ecomplus/admin/commit/df30073f01de8d7ca0bfa53855b0f46abf456f20))
* home and settings page ([625c721](https://github.com/ecomplus/admin/commit/625c72158d162026231dbfa77605f7a021089ef3))
* home cards count ([98860cb](https://github.com/ecomplus/admin/commit/98860cbc09cbeb2a631d08a0c243cfc89c544a47))
* home cards count min js ([e22480e](https://github.com/ecomplus/admin/commit/e22480eda6c31d9c2cde19b41c99ecfface5c99c))
* home js ([b5e0a9d](https://github.com/ecomplus/admin/commit/b5e0a9d0c20bc37f528ebac4d709e03c30bbb2f2))
* home min ([72f8f7a](https://github.com/ecomplus/admin/commit/72f8f7ad0d2a6bfcd1f5b844938c2f08a9fea737))
* home min js ([5a12897](https://github.com/ecomplus/admin/commit/5a1289793ff3954859ce7ec9be4fb31acf68f8ca))
* home.js fixing graphs ([12ad323](https://github.com/ecomplus/admin/commit/12ad323cb5e724bdb8c763605bd98846c1eea50c))
* ignore currency id onitems to be compatible with orders schema ([0b41910](https://github.com/ecomplus/admin/commit/0b41910d05d9a28be6baa70cc3537a8c4f235b50))
* ignoring errors when trying to get customer addresses ([f411478](https://github.com/ecomplus/admin/commit/f411478c9efd9b363994ffb4ceabb41c6c0a4d64))
* improve .data-list (resources lists) responsivity ([b79a528](https://github.com/ecomplus/admin/commit/b79a528291e2d0c4e3745c2af0048ac56d6e27c4))
* improve cart items table responsivity ([468427a](https://github.com/ecomplus/admin/commit/468427a33efaa76258574154c51560160a7de760))
* intermediatior name inside app object ([d043f67](https://github.com/ecomplus/admin/commit/d043f6769187fba6dba60030b109029c49588c8f))
* invoice price ([7566c8c](https://github.com/ecomplus/admin/commit/7566c8cbe5b4717c7fdc9744ca9b3b067be1f4e2))
* invoice price min js ([ff7b565](https://github.com/ecomplus/admin/commit/ff7b56592d388ea44c1fffd13355b7a747fd6fbb))
* invoices and home ([b8071ba](https://github.com/ecomplus/admin/commit/b8071ba4f1b29abd23dcb61cb354b881f401b764))
* issue for one caracter grid ([ea541ae](https://github.com/ecomplus/admin/commit/ea541aed9b877f210073123f6b2deeaeb33553dc))
* issue for one caracter grid minimal ([c4f903a](https://github.com/ecomplus/admin/commit/c4f903a5d1f3e000e03b77372c083fc9a1341a64))
* login form showing first on mobile ([29e2832](https://github.com/ecomplus/admin/commit/29e2832be192804af0d0bf1ba51b23583375867b))
* middle name appearance ([03da8dc](https://github.com/ecomplus/admin/commit/03da8dc88c35712272b42854838410ab77d994e2))
* middle name appearance ([f992f71](https://github.com/ecomplus/admin/commit/f992f716de49779108ffef708db96a8aa1a43f46))
* minor fix for toggleBlocksByValue global function ([25bd231](https://github.com/ecomplus/admin/commit/25bd231aff4f0896eb5b2a06c755a741ad5b3660))
* must also treat email inputs on handleInputs util ([150452d](https://github.com/ecomplus/admin/commit/150452d84df44bd4da6dc902a08f505ba6b2a33c))
* new changes from correios tag ([5fd2da6](https://github.com/ecomplus/admin/commit/5fd2da64a9c486df5901fd3fc51d313f8baa8f54))
* new changes from correios tag min js ([66055fb](https://github.com/ecomplus/admin/commit/66055fb62a0dda0753045bfd12a8aa8297c5ef16))
* new home js ([9df9d0c](https://github.com/ecomplus/admin/commit/9df9d0c75a9c4b619e7fb84effe07d55837b7757))
* new home min js ([729af41](https://github.com/ecomplus/admin/commit/729af41eb54feab6d86a7418233a7b4522b82c98))
* new product editing discount price js ([ac85fa3](https://github.com/ecomplus/admin/commit/ac85fa3fa73c438982299c920fa8b90c98460bbe))
* new product editing discount price min js ([4431567](https://github.com/ecomplus/admin/commit/4431567cf032f0228163d1a475f7f0f60546fe37))
* notifications version 1.0 ([0c5bdc3](https://github.com/ecomplus/admin/commit/0c5bdc3bb55a4c587a6f97ec29c4776bfb9e8396))
* notifications version 1.1 ([446e631](https://github.com/ecomplus/admin/commit/446e6317a7a4c69c17793afd3a4ad861aa40b923))
* notifications version 1.2 ([5cdb210](https://github.com/ecomplus/admin/commit/5cdb2105e255c2f85a059ec6560c77e0c172a0a8))
* notifications version 2.0 ([aab9eb1](https://github.com/ecomplus/admin/commit/aab9eb1ee30a8290526c3103fc6fdb3fe2648eab))
* order list ([e0b9c04](https://github.com/ecomplus/admin/commit/e0b9c04926d425994d4a5f0ec3c6b94641c9be78))
* order list min js ([b6ad918](https://github.com/ecomplus/admin/commit/b6ad9187db5b124346c436f34ebe7cb15cbf958e))
* problems due to change of put to patch into forms ([1149f01](https://github.com/ecomplus/admin/commit/1149f019e406e2bfdfcb183c7adad33bcffd3a99))
* problems due to change of put to patch into forms min ([f51521a](https://github.com/ecomplus/admin/commit/f51521a94220be68e3ef264b12f4d3ebe120d7ba))
* problems with render list ([1745996](https://github.com/ecomplus/admin/commit/17459960230009058b8052fbc105ecc77865cc12))
* products ([c8f1b8e](https://github.com/ecomplus/admin/commit/c8f1b8ed6354fcffa88099e6774ba7c012f03b72))
* products min ([6618115](https://github.com/ecomplus/admin/commit/66181157df5771cc892dd6cd2f6c72f42fce0e89))
* promotion data new insert ([532f229](https://github.com/ecomplus/admin/commit/532f229769e2c0ca7787530b73acaed5309f5186))
* promotion data new insert min js ([c868482](https://github.com/ecomplus/admin/commit/c8684825c45d7faec9b12da0e6b6d185b2af3576))
* **image-upload:** fix setting picture size (check if bigger than zoom) ([aaede85](https://github.com/ecomplus/admin/commit/aaede85257b5c9e77ecd1643467e1e41c7c6b556))
* **image-upload:** fix setting picture size (check if bigger than zoom) ([edc63d8](https://github.com/ecomplus/admin/commit/edc63d82afa203ed324c241be82417965ec3d417))
* **storage-api:** fixes for storage-api v2 (build) ([57a1109](https://github.com/ecomplus/admin/commit/57a1109a19349f8d1e4d95d5775e490e7a5c9a90))
* **storage-api:** handling new storage apis keys/response ([0734537](https://github.com/ecomplus/admin/commit/0734537ef667b59d0b5351b869bb404077133aa1))
* settings inscription type ([7f10687](https://github.com/ecomplus/admin/commit/7f106877be04f5e87b1006edea426a8f80d200c7))
* sku search ([352f05c](https://github.com/ecomplus/admin/commit/352f05c08c572d505b2f542caaa120549dcd2938))
* solve birtherror and complete address form ([cd615f3](https://github.com/ecomplus/admin/commit/cd615f3c2dc334c2b43f58aead7bcac4b54d5829))
* solving error when creating a collection ([6bdef89](https://github.com/ecomplus/admin/commit/6bdef8913b73283c5a23a88fa9c01566ce64b251))
* solving error when creating a collection ([1678001](https://github.com/ecomplus/admin/commit/1678001135943c6403317e558e3b6173ac0050b3))
* status order list ([9671fbf](https://github.com/ecomplus/admin/commit/9671fbffb13faf6ce51a71fd92b27973fa290727))
* status order list ([86e385c](https://github.com/ecomplus/admin/commit/86e385cadbf0bf3cc70e143a7a5d5885776c1f7b))
* status order list ([7db0f40](https://github.com/ecomplus/admin/commit/7db0f404b07a9a41d9a5ba39ae3236a7e3320f2c))
* status order list ([569a3ed](https://github.com/ecomplus/admin/commit/569a3ed22389ff90fe9d9ddc53a26ebcef0cd504))
* total price invoice ([6632d70](https://github.com/ecomplus/admin/commit/6632d708fca12915e3743d27b9bb81ed9e082bc5))
* total price invoice minify ([c7aa5f8](https://github.com/ecomplus/admin/commit/c7aa5f8aedbaa045daba1276a4159513b93032ba))
* update phones add at customers page ([b4f8234](https://github.com/ecomplus/admin/commit/b4f8234d2a4c3315f1da7017c1e90ef6ad83bab8))
* whatsapp share ([147c349](https://github.com/ecomplus/admin/commit/147c34994fc9f7a91f34994144797062b3c13930))
* whatsapp share ([21e6f9f](https://github.com/ecomplus/admin/commit/21e6f9f777ec7eb7847d5cbf8e7bf901ecf9efaf))
* whatsapp share minjs ([de4e0c5](https://github.com/ecomplus/admin/commit/de4e0c57ef9cf4cf96aa834a38c3b66afbb91102))
* whatsapp share minjs ([b5b8563](https://github.com/ecomplus/admin/commit/b5b8563cdc2074a7532c7e65126abf3b3e4bfde7))
* whatsapp share settings ([2e3c933](https://github.com/ecomplus/admin/commit/2e3c933e17fdc0d4910af8762dad6d9f9ea5596d))
* whatsapp share settings minjs ([e4775f4](https://github.com/ecomplus/admin/commit/e4775f450cb98d5a6fcdde5b25284c37d8598bdd))
* width list ([bfcfc94](https://github.com/ecomplus/admin/commit/bfcfc94dcbf3dc7c5435053525485abad66e0f78))
* **orders:** get customer doc number and add on order buyer ([#57](https://github.com/ecomplus/admin/issues/57)) ([2822de2](https://github.com/ecomplus/admin/commit/2822de2fd6acde6d285af40331916303b6da0840))
