"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DirectAccessComponent = void 0;
var core_1 = require("@angular/core");
var panel_action_1 = require("../../../store/panel/panel.action");
var link_icon_component_1 = require("../link-icon/link-icon.component");
var DirectAccessComponent = /** @class */ (function () {
    function DirectAccessComponent(store) {
        this.store = store;
    }
    DirectAccessComponent.prototype.clickDirectAccess = function () {
        console.log("hexNum", this.hexNum);
        console.log("nPage", this.nPage);
        var directAccess = { hexNum: this.hexNum, nPage: this.nPage };
        this.store.dispatch(new panel_action_1.AccessPanelDirect(directAccess));
    };
    __decorate([
        core_1.Input()
    ], DirectAccessComponent.prototype, "linkText");
    __decorate([
        core_1.Input()
    ], DirectAccessComponent.prototype, "hexNum");
    __decorate([
        core_1.Input()
    ], DirectAccessComponent.prototype, "nPage");
    DirectAccessComponent = __decorate([
        core_1.Component({
            selector: 'app-direct-access',
            standalone: true,
            imports: [link_icon_component_1.LinkIconComponent],
            providers: [],
            templateUrl: './direct-access.component.html',
            styleUrl: './direct-access.component.scss'
        })
    ], DirectAccessComponent);
    return DirectAccessComponent;
}());
exports.DirectAccessComponent = DirectAccessComponent;
