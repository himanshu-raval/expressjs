webpackJsonp([19],{

/***/ 498:
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
var AisRtsComponent = (function () {
    function AisRtsComponent(router) {
        this.router = router;
    }
    AisRtsComponent.prototype.ngOnInit = function () {
        if (this.router.url === '/aisrts') {
            this.router.navigate(['/aisrts/zone']);
        }
    };
    AisRtsComponent = __decorate([
        core_1.Component({
            selector: 'aisrts-component',
            template: __webpack_require__(569),
            styles: [__webpack_require__(592)]
        }),
        __metadata("design:paramtypes", [router_1.Router])
    ], AisRtsComponent);
    return AisRtsComponent;
}());
exports.AisRtsComponent = AisRtsComponent;


/***/ }),

/***/ 532:
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
var aisrts_component_1 = __webpack_require__(498);
var routes = [
    {
        path: '', component: aisrts_component_1.AisRtsComponent,
        children: [
            { path: 'zone', loadChildren: function () { return new Promise(function (resolve) { __webpack_require__.e/* require.ensure */(9).then((function (require) { resolve(__webpack_require__(531)['ZoneModule']); }).bind(null, __webpack_require__)).catch(__webpack_require__.oe); }); } },
            { path: 'player', loadChildren: function () { return new Promise(function (resolve) { __webpack_require__.e/* require.ensure */(11).then((function (require) { resolve(__webpack_require__(527)['PlayerModule']); }).bind(null, __webpack_require__)).catch(__webpack_require__.oe); }); } },
            { path: 'room', loadChildren: function () { return new Promise(function (resolve) { __webpack_require__.e/* require.ensure */(10).then((function (require) { resolve(__webpack_require__(529)['RoomModule']); }).bind(null, __webpack_require__)).catch(__webpack_require__.oe); }); } },
        ]
    }
];
var AisRtsRoutingModule = (function () {
    function AisRtsRoutingModule() {
    }
    AisRtsRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], AisRtsRoutingModule);
    return AisRtsRoutingModule;
}());
exports.AisRtsRoutingModule = AisRtsRoutingModule;


/***/ }),

/***/ 533:
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
var aisrts_routing_module_1 = __webpack_require__(532);
var aisrts_component_1 = __webpack_require__(498);
var AisRtsModule = (function () {
    function AisRtsModule() {
    }
    AisRtsModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                ng_bootstrap_1.NgbModule.forRoot(),
                ng_bootstrap_1.NgbButtonsModule.forRoot(),
                aisrts_routing_module_1.AisRtsRoutingModule,
            ],
            declarations: [aisrts_component_1.AisRtsComponent]
        })
    ], AisRtsModule);
    return AisRtsModule;
}());
exports.AisRtsModule = AisRtsModule;


/***/ }),

/***/ 569:
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>"

/***/ }),

/***/ 592:
/***/ (function(module, exports) {

module.exports = ""

/***/ })

});