import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Select } from '@ngxs/store';
import { AppStateModel } from 'app/store/general/general.model';
import { AppState } from 'app/store/general/general.state';
import { Observable } from 'rxjs';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Component({
  selector: 'app-egg',
  standalone: true,
  imports: [],
  templateUrl: './egg.component.html',
  styleUrl: './egg.component.scss'
})
export class EggComponent implements OnInit {

  @Input() sunGameOn!: boolean;
  @ViewChild('egg') private egg!: ElementRef;

  @Select(AppState) appState$!: Observable<AppStateModel>;

  private camera!: THREE.PerspectiveCamera;
  private gltfLoader!: GLTFLoader;
  private renderer!: THREE.WebGLRenderer;
  private scene: THREE.Scene | undefined;
  private ambientLight!: THREE.AmbientLight;
  private dirLight!: THREE.DirectionalLight;

  private eggActive: boolean = false;
  private goingUp: boolean = true;
  // private sunGameOn!: boolean;

  ngOnInit(): void {
    this.appState$.subscribe(appState => {
      if (appState.eggActive !== this.eggActive) {
        this.eggActive = appState.eggActive;
      }
      if (this.eggActive === false) {
        if (this.camera) {
          this.camera.position.z = 4;
        }
      } else {
        this.goingUp = true;
        if (this.eggActive) {
          setTimeout(() => {
            this.goingUp = false;
          }, 250);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.createScene();
    this.importGltf();
    this.startRenderingLoop();
  }

  // ngOnChanges(changes: any) {
    // if (changes.sunGameOn) {
    // this.sunGameOn = changes.sunGameOn.currentValue;
    // console.log("CH this.sunGameOn", this.sunGameOn);
    // }
  // }

  ngOnDestroy() {
    this.scene = undefined;
  }

  private createScene() {
    this.scene = new THREE.Scene();

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xefefff, 1.5);
    this.dirLight.position.set(5, 5, 5);
    this.scene.add(this.dirLight);

    this.camera = new THREE.PerspectiveCamera(
      45,
      1,
      2,
      2000
    )
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 4;
  }

  private importGltf() {
    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.load('assets/threeD/egg/scene.gltf', (gltf: GLTF) => {
      this.scene!.add(gltf.scene.children[0]);
    });
  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.egg.nativeElement, alpha: true });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.egg.nativeElement.clientWidth, this.egg.nativeElement.clientHeight);

    let that = this;

    (function render() {
      if (that.sunGameOn && that.scene) {
        requestAnimationFrame(render);
        if (that.eggActive) {
          if (that.goingUp) {
            that.camera.position.z -= 0.035;
          } else {
            that.camera.position.z += 0.04;
          }
          that.scene.children[2].rotateX(-0.1);
          that.scene.children[2].rotateY(0.05);
        }
        that.renderer.render(that.scene!, that.camera);
      }
    }());
  }

}
