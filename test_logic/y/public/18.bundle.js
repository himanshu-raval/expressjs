webpackJsonp([18],{

/***/ 519:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var router_1 = __webpack_require__(53);
var ShopComponent = (function () {
    function ShopComponent(router) {
        this.router = router;
    }
    ShopComponent.prototype.ngOnInit = function () {
        if (this.router.url === '/shop') {
            this.router.navigate(['/shop/avatar']);
        }
    };
    ShopComponent = __decorate([
        core_1.Component({
            selector: 'shop-component',
            template: __webpack_require__(585),
            styles: [__webpack_require__(608)]
        }),
        __metadata("design:paramtypes", [router_1.Router])
    ], ShopComponent);
    return ShopComponent;
}());
exports.ShopComponent = ShopComponent;


/***/ }),

/***/ 559:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var router_1 = __webpack_require__(53);
var shop_component_1 = __webpack_require__(519);
var routes = [
    {
        path: '', component: shop_component_1.ShopComponent,
        children: [
            { path: 'avatar', loadChildren: function () { return new Promise(function (resolve) { __webpack_require__.e/* require.ensure */(8).then((function (require) { resolve(__webpack_require__(550)['AvatarModule']); }).bind(null, __webpack_require__)).catch(__webpack_require__.oe); }); } },
            { path: 'card', loadChildren: function () { return new Promise(function (resolve) { __webpack_require__.e/* require.ensure */(7).then((function (require) { resolve(__webpack_require__(552)['CardModule']); }).bind(null, __webpack_require__)).catch(__webpack_require__.oe); }); } },
            { path: 'chest', loadChildren: function () { return new Promise(function (resolve) { __webpack_require__.e/* require.ensure */(6).then((function (require) { resolve(__webpack_require__(554)['ChestModule']); }).bind(null, __webpack_require__)).catch(__webpack_require__.oe); }); } },
            { path: 'coin', loadChildren: function () { return new Promise(function (resolve) { __webpack_require__.e/* require.ensure */(15).then((function (require) { resolve(__webpack_require__(556)['CoinModule']); }).bind(null, __webpack_require__)).catch(__webpack_require__.oe); }); } },
            { path: 'landmark', loadChildren: function () { return new Promise(function (resolve) { __webpack_require__.e/* require.ensure */(5).then((function (require) { resolve(__webpack_require__(558)['LandmarkModule']); }).bind(null, __webpack_require__)).catch(__webpack_require__.oe); }); } },
            { path: 'sound', loadChildren: function () { return new Promise(function (resolve) { __webpack_require__.e/* require.ensure */(4).then((function (require) { resolve(__webpack_require__(562)['SoundModule']); }).bind(null, __webpack_require__)).catch(__webpack_require__.oe); }); } },
        ]
    }
];
var ShopRoutingModule = (function () {
    function ShopRoutingModule() {
    }
    ShopRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], ShopRoutingModule);
    return ShopRoutingModule;
}());
exports.ShopRoutingModule = ShopRoutingModule;


/***/ }),

/***/ 560:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(9);
var ng_bootstrap_1 = __webpack_require__(235);
var shop_routing_module_1 = __webpack_require__(559);
var shop_component_1 = __webpack_require__(519);
var ShopModule = (function () {
    function ShopModule() {
    }
    ShopModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                ng_bootstrap_1.NgbModule.forRoot(),
                ng_bootstrap_1.NgbButtonsModule.forRoot(),
                shop_routing_module_1.ShopRoutingModule,
            ],
            declarations: [shop_component_1.ShopComponent]
        })
    ], ShopModule);
    return ShopModule;
}());
exports.ShopModule = ShopModule;


/***/ }),

/***/ 585:
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>"

/***/ }),

/***/ 608:
/***/ (function(module, exports) {

module.exports = ""

/***/ })

});