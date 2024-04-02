"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LayoutComponent = void 0;
var core_1 = require("@angular/core");
var menu_component_1 = require("./menu/menu/menu.component");
var content_component_1 = require("./content/content/content.component");
var arrow_component_1 = require("../shared/components/arrow/arrow.component");
var LayoutComponent = /** @class */ (function () {
    function LayoutComponent() {
    }
    LayoutComponent.prototype.ngAfterViewInit = function () {
        this.screenHeight = window.innerHeight;
        this.contentLayout.nativeElement.style["height"] = this.screenHeight / 4 * 3 + 'px';
        this.contentLayout.nativeElement.style["width"] = '100%';
        this.contentLayout.nativeElement.style["top"] = '0';
        this.contentLayout.nativeElement.style["left"] = '0';
        this.menuLayout.nativeElement.style["height"] = this.screenHeight / 4 + 'px';
        this.menuLayout.nativeElement.style["width"] = '100%';
        this.menuLayout.nativeElement.style["bottom"] = '0';
        this.menuLayout.nativeElement.style["left"] = '0';
    };
    __decorate([
        core_1.ViewChild('contentLayout')
    ], LayoutComponent.prototype, "contentLayout");
    __decorate([
        core_1.ViewChild('menuLayout')
    ], LayoutComponent.prototype, "menuLayout");
    LayoutComponent = __decorate([
        core_1.Component({
            selector: 'app-layout',
            standalone: true,
            imports: [menu_component_1.MenuComponent, content_component_1.ContentComponent, arrow_component_1.ArrowComponent],
            templateUrl: './layout.component.html',
            styleUrl: './layout.component.scss'
        })
    ], LayoutComponent);
    return LayoutComponent;
}());
exports.LayoutComponent = LayoutComponent;
