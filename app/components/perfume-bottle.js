export function createPerfumeBottle(THREE, name, variant = null) {
  const bottle = new THREE.Group();
  const silhouette = new THREE.Shape();
  const nameHash = Array.from(name).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
  const shapeVariant = variant === null ? nameHash % 3 : variant % 3;
  if (shapeVariant === 1) {
    silhouette.moveTo(-0.62, -0.92);
    silhouette.quadraticCurveTo(-0.76, -0.92, -0.76, -0.72);
    silhouette.lineTo(-0.76, 0.28);
    silhouette.quadraticCurveTo(-0.76, 0.68, -0.38, 0.82);
    silhouette.lineTo(-0.3, 0.98);
    silhouette.lineTo(-0.3, 1.13);
    silhouette.lineTo(0.3, 1.13);
    silhouette.lineTo(0.3, 0.98);
    silhouette.lineTo(0.38, 0.82);
    silhouette.quadraticCurveTo(0.76, 0.68, 0.76, 0.28);
    silhouette.lineTo(0.76, -0.72);
    silhouette.quadraticCurveTo(0.76, -0.92, 0.62, -0.92);
    silhouette.closePath();
  } else if (shapeVariant === 2) {
    silhouette.moveTo(-0.64, -0.94);
    silhouette.lineTo(0.64, -0.94);
    silhouette.quadraticCurveTo(0.78, -0.94, 0.78, -0.78);
    silhouette.lineTo(0.78, 0.58);
    silhouette.lineTo(0.46, 0.84);
    silhouette.lineTo(0.46, 1.02);
    silhouette.lineTo(-0.46, 1.02);
    silhouette.lineTo(-0.46, 0.84);
    silhouette.lineTo(-0.78, 0.58);
    silhouette.lineTo(-0.78, -0.78);
    silhouette.quadraticCurveTo(-0.78, -0.94, -0.64, -0.94);
    silhouette.closePath();
  } else {
    silhouette.moveTo(-0.68, -0.92);
    silhouette.lineTo(0.68, -0.92);
    silhouette.quadraticCurveTo(0.78, -0.92, 0.78, -0.8);
    silhouette.lineTo(0.78, 0.54);
    silhouette.quadraticCurveTo(0.78, 0.72, 0.59, 0.78);
    silhouette.lineTo(0.43, 0.84);
    silhouette.lineTo(0.43, 1.02);
    silhouette.lineTo(-0.43, 1.02);
    silhouette.lineTo(-0.43, 0.84);
    silhouette.lineTo(-0.59, 0.78);
    silhouette.quadraticCurveTo(-0.78, 0.72, -0.78, 0.54);
    silhouette.lineTo(-0.78, -0.8);
    silhouette.quadraticCurveTo(-0.78, -0.92, -0.68, -0.92);
  }

  const palette = [0xb4744c, 0x956b78, 0x667b73];
  const color = new THREE.Color(palette[shapeVariant]);
  const glass = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.18,
    metalness: 0.12,
    transmission: 0.32,
    transparent: true,
    opacity: 0.88,
    thickness: 0.4,
    clearcoat: 0.8,
  });
  const gold = new THREE.MeshStandardMaterial({
    color: 0xb89b70,
    metalness: 0.72,
    roughness: 0.28,
  });
  const capMaterial = new THREE.MeshStandardMaterial({
    color: 0x302721,
    metalness: 0.34,
    roughness: 0.27,
  });

  const body = new THREE.Mesh(
    new THREE.ExtrudeGeometry(silhouette, {
      depth: 0.46,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.07,
      bevelThickness: 0.06,
      curveSegments: 10,
    }),
    glass,
  );
  body.position.z = -0.23;
  bottle.add(body);

  const highlightMaterial = new THREE.MeshBasicMaterial({
    color: 0xfff4e5,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
  });
  [-0.61, 0.61].forEach((x) => {
    const highlight = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 1.22, 0.008),
      highlightMaterial,
    );
    highlight.position.set(x, -0.03, 0.247);
    bottle.add(highlight);
  });

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.14, 32), gold);
  collar.position.y = 1.12;
  bottle.add(collar);

  const capGeometry = shapeVariant === 2
    ? new THREE.BoxGeometry(0.48, 0.38, 0.48)
    : new THREE.CylinderGeometry(
        shapeVariant === 1 ? 0.19 : 0.23,
        0.25,
        shapeVariant === 1 ? 0.34 : 0.43,
        shapeVariant === 1 ? 8 : 32,
      );
  const cap = new THREE.Mesh(capGeometry, capMaterial);
  cap.position.y = shapeVariant === 1 ? 1.39 : 1.4;
  if (shapeVariant === 1) cap.rotation.y = Math.PI / 8;
  bottle.add(cap);

  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = 512;
  labelCanvas.height = 320;
  const context = labelCanvas.getContext("2d");
  if (context) {
    context.fillStyle = "#e8dfd0";
    context.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
    context.fillStyle = "#342b27";
    context.textAlign = "center";
    context.font = "26px Georgia";
    context.fillText("LUJAINAE AMOURE", 256, 125);
    context.font = "italic 34px Georgia";
    context.fillText(name.toLocaleUpperCase(), 256, 190, 460);
  }
  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  labelTexture.colorSpace = THREE.SRGBColorSpace;
  const labelMaterial = new THREE.MeshBasicMaterial({
    map: labelTexture,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const label = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.78), labelMaterial);
  label.position.set(0, -0.1, shapeVariant === 1 ? 0.245 : 0.33);
  bottle.add(label);

  return bottle;
}

export function disposeObject(object) {
  object.traverse((child) => {
    if (!child.isMesh && !child.isPoints) return;
    child.geometry.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      material.map?.dispose();
      material.dispose();
    });
  });
}
