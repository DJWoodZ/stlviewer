/*
 * This work is a derivative of "A Simple STL Viewer with Three.js"
 * (https://tonybox.net/posts/simple-stl-viewer/) by Anthony Biondo (https://tonybox.net/) and is
 * used under The MIT License (https://tonybox.net/posts/license/). A copy of the license is
 * included below:
 *
 * Copyright 2019 Anthony Biondo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the “Software”), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import * as THREE from 'three/build/three.module';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class StlViewer {
  constructor(stl, element) {
    this.camera = new THREE.PerspectiveCamera(70, element.clientWidth / element.clientHeight, 1, 1000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(element.clientWidth, element.clientHeight);
    element.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 5;

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.HemisphereLight(0xffffff, 1.5));

    (new STLLoader()).load(stl, (geometry) => {
      const material = new THREE.MeshPhongMaterial({
        color: 0xbb0000,
        specular: 100, 
        shininess: 100
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -90 * Math.PI / 180;
      this.scene.add(mesh);

      const center = new THREE.Vector3();
      geometry.computeBoundingBox();
      geometry.boundingBox.getCenter(center);
      mesh.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));

      const maxDimension = Math.max(geometry.boundingBox.max.x,
        geometry.boundingBox.max.y,
        geometry.boundingBox.max.z);

      this.camera.position.z = maxDimension * 2;

      const animate = () => {
        requestAnimationFrame(animate);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
      };

      animate();
    });
  }
}
