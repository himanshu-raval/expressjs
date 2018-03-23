webpackJsonp([2],{

/***/ 478:
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
var core_2 = __webpack_require__(81);
var layout_routing_module_1 = __webpack_require__(531);
var layout_component_1 = __webpack_require__(496);
var shared_1 = __webpack_require__(133);
var LayoutModule = (function () {
    function LayoutModule() {
    }
    LayoutModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                ng_bootstrap_1.NgbDropdownModule.forRoot(),
                ng_bootstrap_1.NgbAlertModule.forRoot(),
                layout_routing_module_1.LayoutRoutingModule,
                core_2.TranslateModule
            ],
            declarations: [
                layout_component_1.LayoutComponent,
                shared_1.HeaderComponent,
                shared_1.SidebarComponent,
                shared_1.AlertComponent
            ]
        })
    ], LayoutModule);
    return LayoutModule;
}());
exports.LayoutModule = LayoutModule;


/***/ }),

/***/ 496:
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
var LayoutComponent = (function () {
    function LayoutComponent(router) {
        this.router = router;
    }
    LayoutComponent.prototype.ngOnInit = function () {
        if (this.router.url === '/') {
            this.router.navigate(['/dashboard']);
        }
    };
    LayoutComponent = __decorate([
        core_1.Component({
            selector: 'app-layout',
            template: __webpack_require__(565),
            styles: [__webpack_require__(586)],
        }),
        __metadata("design:paramtypes", [router_1.Router])
    ], LayoutComponent);
    return LayoutComponent;
}());
exports.LayoutComponent = LayoutComponent;


/***/ }),

/***/ 531:
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
var layout_component_1 = __webpack_require__(496);
var routes = [
    {
        path: '', component: layout_component_1.LayoutComponent,
        children: [
            // { path: 'aisrts', loadChildren: () => new Promise(function (resolve) {  (require as any).ensure([], function (require: any) {    resolve(require('../../../AisRts/Angular/aisrts.module')['AisRtsModule']);  });}) },
            { path: 'dashboard', loadChildren: function () { return new Promise(function (resolve) { __webpack_require__.e/* require.ensure */(11).then((function (require) { resolve(__webpack_require__(530)['DashboardModule']); }).bind(null, __webpack_require__)).catch(__webpack_require__.oe); }); } },
            { path: 'player', loadChildren: function () { return new Promise(function (resolve) { __webpack_require__.e/* require.ensure */(15).then((function (require) { resolve(__webpack_require__(537)['PlayerModule']); }).bind(null, __webpack_require__)).catch(__webpack_require__.oe); }); } },
            { path: 'shop', loadChildren: function () { return new Promise(function (resolve) { __webpack_require__.e/* require.ensure */(17).then((function (require) { resolve(__webpack_require__(551)['ShopModule']); }).bind(null, __webpack_require__)).catch(__webpack_require__.oe); }); } },
            { path: 'help', loadChildren: function () { return new Promise(function (resolve) { __webpack_require__.e/* require.ensure */(12).then((function (require) { resolve(__webpack_require__(535)['HelpModule']); }).bind(null, __webpack_require__)).catch(__webpack_require__.oe); }); } },
            { path: 'wheel', loadChildren: function () { return new Promise(function (resolve) { __webpack_require__.e/* require.ensure */(13).then((function (require) { resolve(__webpack_require__(557)['WheelModule']); }).bind(null, __webpack_require__)).catch(__webpack_require__.oe); }); } },
            { path: 'achievement', loadChildren: function () { return new Promise(function (resolve) { __webpack_require__.e/* require.ensure */(16).then((function (require) { resolve(__webpack_require__(522)['AchievementModule']); }).bind(null, __webpack_require__)).catch(__webpack_require__.oe); }); } },
            { path: 'tournament', loadChildren: function () { return new Promise(function (resolve) { __webpack_require__.e/* require.ensure */(14).then((function (require) { resolve(__webpack_require__(555)['TournamentModule']); }).bind(null, __webpack_require__)).catch(__webpack_require__.oe); }); } },
        ]
    }
];
var LayoutRoutingModule = (function () {
    function LayoutRoutingModule() {
    }
    LayoutRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], LayoutRoutingModule);
    return LayoutRoutingModule;
}());
exports.LayoutRoutingModule = LayoutRoutingModule;


/***/ }),

/***/ 565:
/***/ (function(module, exports) {

module.exports = "<app-header></app-header>\n<app-sidebar></app-sidebar>\n<section class=\"main-container\">\n\t<app-alert></app-alert>\n    <router-outlet></router-outlet>\n</section>\n"

/***/ }),

/***/ 586:
/***/ (function(module, exports) {

module.exports = ".main-container {\n  margin-top: 60px;\n  margin-left: 235px;\n  padding: 15px;\n  -ms-overflow-x: hidden;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  position: relative;\n  overflow: hidden; }\n\n@media screen and (max-width: 992px) {\n  .main-container {\n    margin-left: 0px !important; } }\n"

/***/ })

});