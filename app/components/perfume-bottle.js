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
  labelCanvas.height = 512;
  const context = labelCanvas.getContext("2d");
  if (context) {
    const goldInk = "rgba(245, 218, 176, 0.96)";
    context.strokeStyle = goldInk;
    context.fillStyle = goldInk;
    context.lineWidth = 3;
    context.lineCap = "round";
    context.lineJoin = "round";

    context.beginPath();
    context.ellipse(256, 162, 92, 106, 0, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.ellipse(256, 162, 81, 95, 0, 0, Math.PI * 2);
    context.stroke();

    context.save();
    context.translate(256, 162);
    for (let petal = 0; petal < 8; petal += 1) {
      context.save();
      context.rotate((Math.PI * 2 * petal) / 8);
      context.beginPath();
      context.moveTo(0, -10);
      context.bezierCurveTo(-23, -29, -21, -63, 0, -73);
      context.bezierCurveTo(21, -63, 23, -29, 0, -10);
      context.stroke();
      context.restore();
    }
    context.beginPath();
    context.arc(0, 0, 11, 0, Math.PI * 2);
    context.stroke();
    context.restore();

    context.beginPath();
    context.moveTo(256, 44);
    context.lineTo(256, 30);
    context.moveTo(256, 280);
    context.lineTo(256, 266);
    context.stroke();
    context.beginPath();
    context.moveTo(251, 37);
    context.lineTo(256, 32);
    context.lineTo(261, 37);
    context.lineTo(256, 42);
    context.closePath();
    context.fill();
    context.beginPath();
    context.moveTo(251, 273);
    context.lineTo(256, 268);
    context.lineTo(261, 273);
    context.lineTo(256, 278);
    context.closePath();
    context.fill();

    context.textAlign = "center";
    context.font = "28px Georgia";
    context.fillText("LUJAINAE", 256, 333);
    context.font = "italic 22px Georgia";
    context.fillText("AMOURE", 256, 361);
    context.beginPath();
    context.moveTo(154, 386);
    context.lineTo(358, 386);
    context.stroke();
    context.font = "italic 42px Georgia";
    context.fillText(name.toLocaleUpperCase(), 256, 439, 460);
  }
  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  labelTexture.colorSpace = THREE.SRGBColorSpace;
  const labelMaterial = new THREE.MeshBasicMaterial({
    map: labelTexture,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const label = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), labelMaterial);
  label.position.set(0, -0.04, 0.43);
  bottle.add(label);

  const backCanvas = document.createElement("canvas");
  backCanvas.width = 512;
  backCanvas.height = 512;
  const backContext = backCanvas.getContext("2d");
  if (backContext) {
    const goldInk = "rgba(245, 218, 176, 0.96)";
    backContext.strokeStyle = goldInk;
    backContext.fillStyle = goldInk;
    backContext.lineWidth = 3;
    backContext.lineCap = "round";
    backContext.lineJoin = "round";

    backContext.beginPath();
    backContext.ellipse(256, 244, 126, 178, 0, 0, Math.PI * 2);
    backContext.stroke();
    backContext.ellipse(256, 244, 114, 166, 0, 0, Math.PI * 2);
    backContext.stroke();

    [-1, 1].forEach((direction) => {
      backContext.save();
      backContext.translate(256, 294);
      backContext.scale(direction, 1);
      backContext.beginPath();
      backContext.moveTo(0, 95);
      backContext.bezierCurveTo(12, 42, 16, -26, 0, -96);
      backContext.stroke();
      for (let leaf = 0; leaf < 5; leaf += 1) {
        const y = 66 - leaf * 34;
        const side = leaf % 2 === 0 ? 1 : -1;
        backContext.beginPath();
        backContext.moveTo(0, y);
        backContext.bezierCurveTo(side * 13, y - 5, side * 25, y - 20, side * 31, y - 31);
        backContext.bezierCurveTo(side * 12, y - 30, side * 1, y - 18, 0, y);
        backContext.stroke();
      }
      backContext.restore();
    });

    backContext.textAlign = "center";
    backContext.font = "28px Georgia";
    backContext.fillText("LUJINAE AMOURE", 256, 92);
    backContext.beginPath();
    backContext.moveTo(174, 112);
    backContext.lineTo(338, 112);
    backContext.stroke();
    backContext.font = "italic 37px Georgia";
    backContext.fillText(name.toLocaleUpperCase(), 256, 158, 330);
    backContext.beginPath();
    backContext.moveTo(206, 356);
    backContext.lineTo(306, 356);
    backContext.stroke();
    backContext.font = "italic 24px Georgia";
    backContext.fillText("COMPOSED TO LINGER", 256, 397);
    backContext.font = "18px Georgia";
    backContext.fillText("EAU DE PARFUM", 256, 427);
  }

  const backTexture = new THREE.CanvasTexture(backCanvas);
  backTexture.colorSpace = THREE.SRGBColorSpace;
  const backMaterial = new THREE.MeshBasicMaterial({
    map: backTexture,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const backLabel = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 1.2), backMaterial);
  backLabel.position.set(0, -0.04, -0.43);
  backLabel.rotation.y = Math.PI;
  bottle.add(backLabel);

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
