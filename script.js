const container = document.getElementById("container");
const shape1 = document.getElementById("shape1");
const shape2 = document.getElementById("shape2");
const cutout = document.getElementById("cutout");

const containerTop = document.getElementById("containerTop");
const shapeTop = document.getElementById("shapeTop");

const containerBottom = document.getElementById("containerBottom");
const shapeBottom = document.getElementById("shapeBottom");

const containerDoor = document.getElementById("containerDoor");
const upperDoor = document.getElementById("upperDoor");
const bottomDoor = document.getElementById("bottomDoor");
const upperDoorSeal = document.getElementById("upperDoorSeal");
const bottomDoorSeal = document.getElementById("bottomDoorSeal");
const upperDoorFoam = document.getElementById("upperDoorFoam");
const bottomDoorFoam = document.getElementById("bottomDoorFoam");

// Gasket view elements
const containerGasket = document.getElementById("containerGasket");
const upperGasketRow = document.getElementById("upperGasketRow");
const lowerGasketRow = document.getElementById("lowerGasketRow");
const upperGasketFrame = document.getElementById("upperGasketFrame");
const lowerGasketFrame = document.getElementById("lowerGasketFrame");
const upperGasketThickness = document.getElementById("upperGasketThickness");
const lowerGasketThickness = document.getElementById("lowerGasketThickness");

// Grey rectangle element
const greyRectangle = document.getElementById("greyRectangle");

const containerRect = container.getBoundingClientRect();
const leftEdge = 0;
const padding = 10; // 10px padding on top, right, bottom, and between shapes

// ========================================
// Thermal Calculation Constants
// ========================================

// Freezer Side Constants
const FRZ_TEMP_DIFF = 50;
const FRZ_OUT_THICKNESS = 0.5;
const FRZ_OUT_THERMAL_COND = 50;
const FRZ_INN_THICKNESS = 1;
const FRZ_INN_THERMAL_COND = 2.3368;
const FRZ_MID_THERMAL_COND = 0.023;
const FRZ_FACTOR = 1000;

// Fresh Food Constants
const FF_TEMP_DIFF = 27.5;
const FF_OUT_THICKNESS = 0.5;
const FF_OUT_THERMAL_COND = 50;
const FF_INN_THICKNESS = 1;
const FF_INN_THERMAL_COND = 2.3368;
const FF_MID_THERMAL_COND = 0.023;
const FF_FACTOR = 1000;

//door sheet thickness
const DOOR_GLASS_THICKNESS = 0.3;
const GASKET_WALL_THICKNESS = 20;

// Freezer Gasket Constants
const FRZ_GASKET_TEMP_DIFF = 50;
const FRZ_GASKET_OUT_THICKNESS = 1;
const FRZ_GASKET_OUT_THERMAL_COND = 1;
const FRZ_GASKET_INN_THICKNESS = 1;
const FRZ_GASKET_INN_THERMAL_COND = 1;
const FRZ_GASKET_MID_THERMAL_COND = 0.07;
const FRZ_GASKET_FACTOR = 1000;

// Fresh Food Gasket Constants
const FF_GASKET_TEMP_DIFF = 27.5;
const FF_GASKET_OUT_THICKNESS = 1;
const FF_GASKET_OUT_THERMAL_COND = 1;
const FF_GASKET_INN_THICKNESS = 1;
const FF_GASKET_INN_THERMAL_COND = 1;
const FF_GASKET_MID_THERMAL_COND = 0.07;
const FF_GASKET_FACTOR = 1000;

// Compressor Constants
const COMP_TEMP_DIFF = 37.5;
const COMP_OUT_THICKNESS = 0.5;
const COMP_OUT_THERMAL_COND = 50;
const COMP_INN_THICKNESS = 1;
const COMP_INN_THERMAL_COND = 2.3368;
const COMP_MID_THERMAL_COND = 0.023;
const COMP_FACTOR = 1000;

// Air Exchange Constants
const DELTA_AIR_HOUR = 0.33;
const SPEC_VOL_AIR = 0.78;

// Freezer Enthalpy Constants
const DELTA_H_FRZ = 127.184;
const DELTA_W_G_FRZ = 0.02993;
const H_F_G_FRZ = 2465;

// Fresh Food Enthalpy Constants
const DELTA_H_FF = 92.347;
const DELTA_W_G_FF = 0.0253;
const H_F_G_FF = 2466;

// Defrost Constants
const C1 = 3.52;
const C2 = 2.12;
const DELTA_T1 = 34;
const DELTA_T2 = 16;
const LATENT_HEAT = 233;
const TIME = 24;

// Product Load Constants
const SPEC_HEAT_CP = 3.67;
const DELTA_T = 27;

// Runtime & Safety Constants
const RUNTIME = 0.75;
const SAFETY_FACTOR = 15;

let isDragging = false;
let currentEdge = null;
let startPos = 0;
let startValue = 0;

// Initialize top view shape with equal top/bottom gaps
const containerTopInitialHeight = 200;
const gap = 20; // Equal gap on top and bottom
const shapeTopInitialHeight = containerTopInitialHeight - 2 * gap;

shapeTop.style.top = gap + "px";
shapeTop.style.left = "0px";
shapeTop.style.width = "260px";
shapeTop.style.height = shapeTopInitialHeight + "px";

// Initialize bottom cabinet top view with equal top/bottom gaps
const containerBottomInitialHeight = 200; // syncs with REF WIDTH
const gapBottom = 20; // Equal gap on top and bottom
const shapeBottomInitialHeight = containerBottomInitialHeight - 2 * gapBottom;

shapeBottom.style.top = gapBottom + "px";
shapeBottom.style.left = "0px";
shapeBottom.style.width = "260px";
shapeBottom.style.height = shapeBottomInitialHeight + "px";

// Sync containerBottom dimensions with REF DEPTH and REF WIDTH
containerBottom.style.width = container.clientWidth + "px"; // REF DEPTH
containerBottom.style.height = containerTopInitialHeight + "px"; // REF WIDTH

// Initialize door shapes with equal padding on all 4 sides
const doorPadding = 20;
const sealWidth = 5;
const gapBetweenDoorAndSeal = 5; // Gap between main door and seal
const upperDoorHeight = 160; // 320mm / 2 (doubled from 80)
const bottomDoorHeight = 300; // 600mm / 2 (doubled from 150)
const doorWidth = 200; // 400mm / 2 (doubled from 100)
const upperFoamWidth = 30; // 60mm / 2 (doubled from 15)
const bottomFoamWidth = 30; // 60mm / 2 (doubled from 15)

// Upper door
upperDoor.style.top = doorPadding + "px";
upperDoor.style.left = doorPadding + "px";
upperDoor.style.width = doorWidth + "px";
upperDoor.style.height = upperDoorHeight + "px";

// Upper door seal (positioned after door + gap)
const upperSealLeft = doorPadding + doorWidth + gapBetweenDoorAndSeal;
upperDoorSeal.style.top = doorPadding + "px";
upperDoorSeal.style.left = upperSealLeft + "px";
upperDoorSeal.style.height = upperDoorHeight + "px";

// Upper door foam (positioned after seal)
upperDoorFoam.style.top = doorPadding + "px";
upperDoorFoam.style.left = upperSealLeft + sealWidth + "px";
upperDoorFoam.style.width = upperFoamWidth + "px";
upperDoorFoam.style.height = upperDoorHeight + "px";

// Bottom door (maintain equal gap between doors and to bottom)
const gapBetweenDoors = doorPadding;
const bottomDoorTop = doorPadding + upperDoorHeight + gapBetweenDoors;
bottomDoor.style.top = bottomDoorTop + "px";
bottomDoor.style.left = doorPadding + "px";
bottomDoor.style.width = doorWidth + "px";
bottomDoor.style.height = bottomDoorHeight + "px";

// Bottom door seal (positioned after door + gap)
const bottomSealLeft = doorPadding + doorWidth + gapBetweenDoorAndSeal;
bottomDoorSeal.style.top = bottomDoorTop + "px";
bottomDoorSeal.style.left = bottomSealLeft + "px";
bottomDoorSeal.style.height = bottomDoorHeight + "px";

// Bottom door foam (positioned after seal)
bottomDoorFoam.style.top = bottomDoorTop + "px";
bottomDoorFoam.style.left = bottomSealLeft + sealWidth + "px";
bottomDoorFoam.style.width = bottomFoamWidth + "px";
bottomDoorFoam.style.height = bottomDoorHeight + "px";

// Initialize gasket view
if (containerGasket && upperGasketRow && lowerGasketRow) {
  const gasketPadding = 20;
  const gasketBorderThickness = 15; // Fixed border thickness for frames

  // Set initial dimensions for gasket rows
  upperGasketRow.style.height = "160px";
  lowerGasketRow.style.height = "300px";

  // Set initial dimensions for gasket frames
  upperGasketFrame.style.width = "200px";
  lowerGasketFrame.style.width = "200px";

  // Set initial border width explicitly as inline style to override CSS
  upperGasketFrame.style.borderWidth = gasketBorderThickness + "px";
  lowerGasketFrame.style.borderWidth = gasketBorderThickness + "px";

  // Set initial dimensions for thickness indicators
  upperGasketThickness.style.width = "20px";
  lowerGasketThickness.style.width = "20px";
}

// Get current dimensions
function getCurrentDimensions() {
  return {
    shape1: {
      top: parseInt(shape1.style.top) || 20,
      height: parseInt(shape1.style.height) || 160,
      width: parseInt(shape1.style.width) || 260,
    },
    shape2: {
      top: parseInt(shape2.style.top) || 200,
      height: parseInt(shape2.style.height) || 300,
      width: parseInt(shape2.style.width) || 260,
    },
    cutout: {
      width: parseInt(cutout.style.width) || 70,
      height: parseInt(cutout.style.height) || 80,
    },
    shapeTop: {
      top: parseInt(shapeTop.style.top) || 20,
      left: 0,
      width: parseInt(shapeTop.style.width) || 260,
      height: parseInt(shapeTop.style.height) || 140,
    },
    shapeBottom: {
      top: parseInt(shapeBottom.style.top) || 20,
      left: 0,
      width: parseInt(shapeBottom.style.width) || 260,
      height: parseInt(shapeBottom.style.height) || 140,
    },
    upperDoor: {
      top: parseInt(upperDoor.style.top) || 20,
      left: parseInt(upperDoor.style.left) || 20,
      width: parseInt(upperDoor.style.width) || 200,
      height: parseInt(upperDoor.style.height) || 160,
    },
    bottomDoor: {
      top: parseInt(bottomDoor.style.top) || 200,
      left: parseInt(bottomDoor.style.left) || 20,
      width: parseInt(bottomDoor.style.width) || 200,
      height: parseInt(bottomDoor.style.height) || 300,
    },
    upperDoorFoam: {
      width: parseInt(upperDoorFoam.style.width) || 30,
    },
    bottomDoorFoam: {
      width: parseInt(bottomDoorFoam.style.width) || 30,
    },
    greyRectangle: {
      width: parseInt(greyRectangle.style.width) || 65,
      height: parseInt(greyRectangle.style.height) || 90,
      left: 0, // Always calculated as containerWidth - width
      top: 0, // Always calculated as containerHeight - height
    },
  };
}

// Debug: Calculate and display refrigerator side view measurements
//function ok
function calculateFRZSide() {
  const dims = getCurrentDimensions();
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  const shape1Right = parseInt(shape1.style.width) || 260;
  const shape2Top = parseInt(shape2.style.top) || 200;

  const frzSideThickness = Math.round(dims.shapeTop.top);

  const FRZ_SIDE_HEIGHT = shape2Top; // Distance from top of container to top of shape2
  const FRZ_SIDE_WIDTH = containerWidth; // Width of the container
  const FRZ_SIDE_FOAM = frzSideThickness; // Distance from right edge of container to right edge of shape1

  // Convert to mm (1 pixel = 2mm)
  const FRZ_SIDE_HEIGHT_MM = Math.round(FRZ_SIDE_HEIGHT * 2);
  const FRZ_SIDE_WIDTH_MM = Math.round(FRZ_SIDE_WIDTH * 2);
  const FRZ_SIDE_FOAM_MM = Math.round(FRZ_SIDE_FOAM * 2);

  // console.log("=== REFRIGERATOR SIDE VIEW DEBUG ===");
  // console.log("FRZ_SIDE_HEIGHT:", FRZ_SIDE_HEIGHT_MM, "mm");
  // console.log("FRZ_SIDE_WIDTH:", FRZ_SIDE_WIDTH_MM, "mm");
  // console.log("FRZ_SIDE_FOAM:", FRZ_SIDE_FOAM_MM, "mm");
  // console.log("====================================");

  const numerator = FRZ_SIDE_HEIGHT_MM * FRZ_SIDE_WIDTH_MM * FRZ_TEMP_DIFF;
  const denominator =
    FRZ_OUT_THICKNESS / FRZ_OUT_THERMAL_COND +
    FRZ_INN_THICKNESS / FRZ_INN_THERMAL_COND +
    FRZ_SIDE_FOAM_MM / FRZ_MID_THERMAL_COND;

  const singleLoad = ((numerator / denominator) * FRZ_FACTOR) / 1000000;

  // Calculate total cooling load (2 sides)
  const totalLoad = 2 * singleLoad;

  document.getElementById("frzSideCoolingLoad").textContent =
    totalLoad.toFixed(2);
  //   updateFRZTotalTransmission();

  // return {
  //     FRZ_SIDE_HEIGHT: FRZ_SIDE_HEIGHT_MM,
  //     FRZ_SIDE_WIDTH: FRZ_SIDE_WIDTH_MM,
  //     FRZ_SIDE_FOAM: FRZ_SIDE_FOAM_MM
  // };
}

//function OK
function calculateFRZTop() {
  const dims = getCurrentDimensions();
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const containerDepth = containerTop.clientHeight;

  const shape1Right = parseInt(shape1.style.width) || 260;
  const shape2Top = parseInt(shape2.style.top) || 200;

  const frzTopThickness = Math.round(dims.shape1.top);

  const FRZ_TOP_HEIGHT = containerDepth; // Distance from top of container to top of shape2
  const FRZ_TOP_WIDTH = containerWidth; // Width of the container
  const FRZ_TOP_FOAM = frzTopThickness; // Distance from right edge of container to right edge of shape1

  // Convert to mm (1 pixel = 2mm)
  const FRZ_TOP_HEIGHT_MM = Math.round(FRZ_TOP_HEIGHT * 2);
  const FRZ_TOP_WIDTH_MM = Math.round(FRZ_TOP_WIDTH * 2);
  const FRZ_TOP_FOAM_MM = Math.round(FRZ_TOP_FOAM * 2);

  //   console.log("=== REFRIGERATOR SIDE VIEW DEBUG ===");
  //   console.log("FRZ_TOP_HEIGHT:", FRZ_TOP_HEIGHT_MM, "mm");
  //   console.log("FRZ_TOP_WIDTH:",  FRZ_TOP_WIDTH_MM, "mm");
  //   console.log("FRZ_TOP_FOAM:",   FRZ_TOP_FOAM_MM, "mm");
  //   console.log("====================================");

  const numerator = FRZ_TOP_HEIGHT_MM * FRZ_TOP_WIDTH_MM * FRZ_TEMP_DIFF;
  const denominator =
    FRZ_OUT_THICKNESS / FRZ_OUT_THERMAL_COND +
    FRZ_INN_THICKNESS / FRZ_INN_THERMAL_COND +
    FRZ_TOP_FOAM_MM / FRZ_MID_THERMAL_COND;

  const singleLoad = ((numerator / denominator) * FRZ_FACTOR) / 1000000;

  // Calculate total cooling load (2 sides)
  const totalLoad = 1 * singleLoad;

  document.getElementById("frzTopCoolingLoad").textContent =
    totalLoad.toFixed(2);
  //   updateFRZTotalTransmission();

  // return {
  //     FRZ_SIDE_HEIGHT: FRZ_SIDE_HEIGHT_MM,
  //     FRZ_SIDE_WIDTH: FRZ_SIDE_WIDTH_MM,
  //     FRZ_SIDE_FOAM: FRZ_SIDE_FOAM_MM
  // };
}

//function ok
function calculateFRZBack() {
  const dims = getCurrentDimensions();
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const containerDepth = containerTop.clientHeight;

  const shape1Right = parseInt(shape1.style.width) || 260;
  const shape2Top = parseInt(shape2.style.top) || 200;

  const frzBackThickness = Math.round(
    containerWidth - dims.shape1.width - leftEdge,
  );

  const FRZ_BACK_HEIGHT = shape2Top; // Distance from top of container to top of shape2
  const FRZ_BACK_WIDTH = containerDepth; // Width of the container
  const FRZ_BACK_FOAM = frzBackThickness; // Distance from right edge of container to right edge of shape1

  // Convert to mm (1 pixel = 2mm)
  const FRZ_BACK_HEIGHT_MM = Math.round(FRZ_BACK_HEIGHT * 2);
  const FRZ_BACK_WIDTH_MM = Math.round(FRZ_BACK_WIDTH * 2);
  const FRZ_BACK_FOAM_MM = Math.round(FRZ_BACK_FOAM * 2);

  //   console.log("=== REFRIGERATOR SIDE VIEW DEBUG ===");
  //   console.log("FRZ_BACK_HEIGHT:", FRZ_BACK_HEIGHT_MM, "mm");
  //   console.log("FRZ_BACK_WIDTH:", FRZ_BACK_WIDTH_MM, "mm");
  //   console.log("FRZ_BACK_FOAM:", FRZ_BACK_FOAM_MM, "mm");
  //   console.log("====================================");

  const numerator = FRZ_BACK_HEIGHT_MM * FRZ_BACK_WIDTH_MM * FRZ_TEMP_DIFF;
  const denominator =
    FRZ_OUT_THICKNESS / FRZ_OUT_THERMAL_COND +
    FRZ_INN_THICKNESS / FRZ_INN_THERMAL_COND +
    FRZ_BACK_FOAM_MM / FRZ_MID_THERMAL_COND;

  const singleLoad = ((numerator / denominator) * FRZ_FACTOR) / 1000000;

  // Calculate total cooling load (2 sides)
  const totalLoad = 1 * singleLoad;

  document.getElementById("frzBackCoolingLoad").textContent =
    totalLoad.toFixed(2);
  //   updateFRZTotalTransmission();

  // return {
  //     FRZ_SIDE_HEIGHT: FRZ_SIDE_HEIGHT_MM,
  //     FRZ_SIDE_WIDTH: FRZ_SIDE_WIDTH_MM,
  //     FRZ_SIDE_FOAM: FRZ_SIDE_FOAM_MM
  // };
}

//function ok
function calculateFRZDoor() {
  const dims = getCurrentDimensions();

  const upperDoorLength = Math.round(dims.upperDoor.height);
  const upperDoorWidth = Math.round(dims.upperDoor.width);

  const frzDoorThickness = Math.round(dims.upperDoorFoam.width);

  const FRZ_DOOR_HEIGHT = upperDoorLength; // Distance from top of container to top of shape2
  const FRZ_DOOR_WIDTH = upperDoorWidth; // Width of the container
  const FRZ_DOOR_FOAM = frzDoorThickness; // Distance from right edge of container to right edge of shape1

  // Convert to mm (1 pixel = 2mm)
  const FRZ_DOOR_HEIGHT_MM = Math.round(FRZ_DOOR_HEIGHT * 2);
  const FRZ_DOOR_WIDTH_MM = Math.round(FRZ_DOOR_WIDTH * 2);
  const FRZ_DOOR_FOAM_MM = Math.round(FRZ_DOOR_FOAM * 2);

  //   console.log("=== REFRIGERATOR SIDE VIEW DEBUG ===");
  //   console.log("FRZ_BACK_HEIGHT:", FRZ_DOOR_HEIGHT_MM, "mm");
  //   console.log("FRZ_BACK_WIDTH:", FRZ_DOOR_WIDTH_MM, "mm");
  //   console.log("FRZ_BACK_FOAM:", FRZ_DOOR_FOAM_MM, "mm");
  //   console.log("====================================");

  const numerator = FRZ_DOOR_HEIGHT_MM * FRZ_DOOR_WIDTH_MM * FRZ_TEMP_DIFF;
  const denominator =
    DOOR_GLASS_THICKNESS / FRZ_OUT_THERMAL_COND +
    FRZ_INN_THICKNESS / FRZ_INN_THERMAL_COND +
    FRZ_DOOR_FOAM_MM / FRZ_MID_THERMAL_COND;

  const singleLoad = ((numerator / denominator) * FRZ_FACTOR) / 1000000;

  // Calculate total cooling load (2 sides)
  const totalLoad = 1 * singleLoad;

  document.getElementById("frzDoorCoolingLoad").textContent =
    totalLoad.toFixed(2);
  //   updateFRZTotalTransmission();

  // return {
  //     FRZ_SIDE_HEIGHT: FRZ_SIDE_HEIGHT_MM,
  //     FRZ_SIDE_WIDTH: FRZ_SIDE_WIDTH_MM,
  //     FRZ_SIDE_FOAM: FRZ_SIDE_FOAM_MM
  // };
}

//function under construction
function calculateFRZGasket() {
  const dims = getCurrentDimensions();
  const gasketDims = getGasketDimensions();
  const upperGasketLength = Math.round(gasketDims.upperGasketRow.height);
  const upperGasketWidth = Math.round(gasketDims.upperGasketFrame.width);

  const frzGasketThickness = Math.round(gasketDims.upperGasketThickness.width);

  const FRZ_GASKET_HEIGHT = upperGasketLength; // Distance from top of container to top of shape2
  const FRZ_GASKET_WIDTH = upperGasketWidth; // Width of the container
  const FRZ_GASKET_THICKNESS = frzGasketThickness; // Distance from right edge of container to right edge of shape1

  // Convert to mm (1 pixel = 2mm)
  const FRZ_GASKET_HEIGHT_MM = Math.round(FRZ_GASKET_HEIGHT * 2);
  const FRZ_GASKET_WIDTH_MM = Math.round(FRZ_GASKET_WIDTH * 2);
  const FRZ_GASKET_THICKNESS_MM = Math.round(FRZ_GASKET_THICKNESS * 2);

  //   console.log("=== REFRIGERATOR SIDE VIEW DEBUG ===");
  //   console.log("FRZ_BACK_HEIGHT:", FRZ_GASKET_HEIGHT_MM, "mm");
  //   console.log("FRZ_BACK_WIDTH:", FRZ_GASKET_WIDTH_MM, "mm");
  //   console.log("FRZ_BACK_FOAM:", FRZ_GASKET_THICKNESS_MM, "mm");
  //   console.log("====================================");

  const gasketAreaBIG = FRZ_GASKET_HEIGHT_MM * FRZ_GASKET_WIDTH_MM;
  const gasketAreaSML =
    (FRZ_GASKET_HEIGHT_MM - GASKET_WALL_THICKNESS * 2) *
    (FRZ_GASKET_WIDTH_MM - GASKET_WALL_THICKNESS * 2);
  const gasketAreaACTUAL = gasketAreaBIG - gasketAreaSML;
  const numerator = gasketAreaACTUAL * FRZ_TEMP_DIFF;
  const denominator =
    FRZ_GASKET_OUT_THICKNESS / FRZ_GASKET_OUT_THERMAL_COND +
    FRZ_GASKET_INN_THICKNESS / FRZ_GASKET_INN_THERMAL_COND +
    FRZ_GASKET_THICKNESS_MM / FRZ_GASKET_MID_THERMAL_COND;

  const singleLoad = ((numerator / denominator) * FRZ_GASKET_FACTOR) / 1000000;

  // Calculate total cooling load (2 sides)
  const totalLoad = 1 * singleLoad;

  document.getElementById("frzGasketCoolingLoad").textContent =
    totalLoad.toFixed(2);
  //   updateFRZTotalTransmission();

  // return {
  //     FRZ_SIDE_HEIGHT: FRZ_SIDE_HEIGHT_MM,
  //     FRZ_SIDE_WIDTH: FRZ_SIDE_WIDTH_MM,
  //     FRZ_SIDE_FOAM: FRZ_SIDE_FOAM_MM
  // };
}

//frz ends ff starts
//function ok
function calculateFFSide() {
  const dims = getCurrentDimensions();
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  const shape1Right = parseInt(shape1.style.width) || 260;
  const shape2Top = parseInt(shape2.style.top) || 200;

  const ffSideThickness = Math.round(dims.shapeBottom.top);

  const FF_SIDE_HEIGHT = containerHeight - shape2Top; // Distance from top of container to top of shape2
  const FF_SIDE_WIDTH = containerWidth; // Width of the container
  const FF_SIDE_FOAM = ffSideThickness; // Distance from right edge of container to right edge of shape1

  // Convert to mm (1 pixel = 2mm)
  const FF_SIDE_HEIGHT_MM = Math.round(FF_SIDE_HEIGHT * 2);
  const FF_SIDE_WIDTH_MM = Math.round(FF_SIDE_WIDTH * 2);
  const FF_SIDE_FOAM_MM = Math.round(FF_SIDE_FOAM * 2);

  console.log("=== REFRIGERATOR SIDE VIEW DEBUG ===");
  console.log("FF_SIDE_HEIGHT:", FF_SIDE_HEIGHT_MM, "mm");
  console.log("FF_SIDE_WIDTH:", FF_SIDE_WIDTH_MM, "mm");
  console.log("FF_SIDE_FOAM:", FF_SIDE_FOAM_MM, "mm");
  console.log("====================================");

  const numerator = FF_SIDE_HEIGHT_MM * FF_SIDE_WIDTH_MM * FF_TEMP_DIFF;
  const denominator =
    FRZ_OUT_THICKNESS / FRZ_OUT_THERMAL_COND +
    FRZ_INN_THICKNESS / FRZ_INN_THERMAL_COND +
    FF_SIDE_FOAM_MM / FRZ_MID_THERMAL_COND;

  const singleLoad = ((numerator / denominator) * FRZ_FACTOR) / 1000000;

  // Calculate total cooling load (2 sides)
  const totalLoad = 2 * singleLoad;

  document.getElementById("ffSideCoolingLoad").textContent =
    totalLoad.toFixed(2);
  //   updateFFTotalTransmission();

  // return {
  //     FRZ_SIDE_HEIGHT: FRZ_SIDE_HEIGHT_MM,
  //     FRZ_SIDE_WIDTH: FRZ_SIDE_WIDTH_MM,
  //     FRZ_SIDE_FOAM: FRZ_SIDE_FOAM_MM
  // };
}

//function OK
function calculateFFBase() {
  const dims = getCurrentDimensions();
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const containerDepth = containerTop.clientHeight;
  const compressorLength = cutout.clientWidth;

  const shape1Right = parseInt(shape1.style.width) || 260;
  const shape2Top = parseInt(shape2.style.top) || 200;

  const bottomThickness =
    containerHeight - (dims.shape2.top + dims.shape2.height);
  const baseFoamThickness = Math.round(bottomThickness);

  const frzBackThickness = Math.round(
    containerWidth - dims.shape1.width - leftEdge,
  );

  const FF_TOP_HEIGHT = containerDepth; // Distance from top of container to top of shape2
  const FF_TOP_WIDTH = containerWidth - frzBackThickness - compressorLength; // front to compre
  const FF_TOP_FOAM = baseFoamThickness; // Distance from right edge of container to right edge of shape1

  // Convert to mm (1 pixel = 2mm)
  const FF_TOP_HEIGHT_MM = Math.round(FF_TOP_HEIGHT * 2);
  const FF_TOP_WIDTH_MM = Math.round(FF_TOP_WIDTH * 2);
  const FF_TOP_FOAM_MM = Math.round(FF_TOP_FOAM * 2);

  // console.log("=== REFRIGERATOR SIDE VIEW DEBUG ===");
  // console.log("FF_TOP_HEIGHT:", FF_TOP_HEIGHT_MM, "mm");
  // console.log("FF_TOP_WIDTH:",  FF_TOP_WIDTH_MM, "mm");
  // console.log("FF_TOP_FOAM:",   FF_TOP_FOAM_MM, "mm");
  // console.log("====================================");

  const numerator = FF_TOP_HEIGHT_MM * FF_TOP_WIDTH_MM * FF_TEMP_DIFF;
  const denominator =
    FRZ_OUT_THICKNESS / FRZ_OUT_THERMAL_COND +
    FRZ_INN_THICKNESS / FRZ_INN_THERMAL_COND +
    FF_TOP_FOAM_MM / FRZ_MID_THERMAL_COND;

  const singleLoad = ((numerator / denominator) * FRZ_FACTOR) / 1000000;

  // Calculate total cooling load (2 sides)
  const totalLoad = 1 * singleLoad;

  document.getElementById("ffBaseCoolingLoad").textContent =
    totalLoad.toFixed(2);
  //   updateFFTotalTransmission();

  // return {
  //     FRZ_SIDE_HEIGHT: FRZ_SIDE_HEIGHT_MM,
  //     FRZ_SIDE_WIDTH: FRZ_SIDE_WIDTH_MM,
  //     FRZ_SIDE_FOAM: FRZ_SIDE_FOAM_MM
  // };
}

//function ok
function calculateFFBack() {
  const dims = getCurrentDimensions();
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const containerDepth = containerTop.clientHeight;

  const shape1Right = parseInt(shape1.style.width) || 260;
  const shape2Top = parseInt(shape2.style.top) || 200;

  const ffBackThickness = Math.round(
    containerWidth - dims.shape1.width - leftEdge,
  );

  const FF_BACK_HEIGHT = containerHeight - shape2Top; // Distance from top of container to top of shape2
  const FF_BACK_WIDTH = containerDepth; // Width of the container
  const FF_BACK_FOAM = ffBackThickness; // Distance from right edge of container to right edge of shape1

  // Convert to mm (1 pixel = 2mm)
  const FF_BACK_HEIGHT_MM = Math.round(FF_BACK_HEIGHT * 2);
  const FF_BACK_WIDTH_MM = Math.round(FF_BACK_WIDTH * 2);
  const FF_BACK_FOAM_MM = Math.round(FF_BACK_FOAM * 2);

  //   console.log("=== REFRIGERATOR SIDE VIEW DEBUG ===");
  //   console.log("FFBACK_HEIGHT:", FF_BACK_HEIGHT_MM, "mm");
  //   console.log("FFBACK_WIDTH:",  FF_BACK_WIDTH_MM, "mm");
  //   console.log("FFBACK_FOAM:",   FF_BACK_FOAM_MM, "mm");
  //   console.log("====================================");

  const numerator = FF_BACK_HEIGHT_MM * FF_BACK_WIDTH_MM * FF_TEMP_DIFF;
  const denominator =
    FRZ_OUT_THICKNESS / FRZ_OUT_THERMAL_COND +
    FRZ_INN_THICKNESS / FRZ_INN_THERMAL_COND +
    FF_BACK_FOAM_MM / FRZ_MID_THERMAL_COND;

  const singleLoad = ((numerator / denominator) * FRZ_FACTOR) / 1000000;

  // Calculate total cooling load (2 sides)
  const totalLoad = 1 * singleLoad;

  document.getElementById("ffBackCoolingLoad").textContent =
    totalLoad.toFixed(2);
  //   updateFFTotalTransmission();

  // return {
  //     FRZ_SIDE_HEIGHT: FRZ_SIDE_HEIGHT_MM,
  //     FRZ_SIDE_WIDTH: FRZ_SIDE_WIDTH_MM,
  //     FRZ_SIDE_FOAM: FRZ_SIDE_FOAM_MM
  // };
}

//function ok
function calculateFFDoor() {
  const dims = getCurrentDimensions();

  const bottomDoorLength = Math.round(dims.bottomDoor.height);
  const bottomDoorWidth = Math.round(dims.bottomDoor.width);

  const ffDoorThickness = Math.round(dims.bottomDoorFoam.width);

  const FF_DOOR_HEIGHT = bottomDoorLength; // Distance from top of container to top of shape2
  const FF_DOOR_WIDTH = bottomDoorWidth; // Width of the container
  const FF_DOOR_FOAM = ffDoorThickness; // Distance from right edge of container to right edge of shape1

  // Convert to mm (1 pixel = 2mm)
  const FF_DOOR_HEIGHT_MM = Math.round(FF_DOOR_HEIGHT * 2);
  const FF_DOOR_WIDTH_MM = Math.round(FF_DOOR_WIDTH * 2);
  const FF_DOOR_FOAM_MM = Math.round(FF_DOOR_FOAM * 2);

  //   console.log("=== REFRIGERATOR SIDE VIEW DEBUG ===");
  //   console.log("FRZ_BACK_HEIGHT:", FF_DOOR_HEIGHT_MM, "mm");
  //   console.log("FRZ_BACK_WIDTH:", FF_DOOR_WIDTH_MM, "mm");
  //   console.log("FRZ_BACK_FOAM:", FF_DOOR_FOAM_MM, "mm");
  //   console.log("====================================");

  const numerator = FF_DOOR_HEIGHT_MM * FF_DOOR_WIDTH_MM * FF_TEMP_DIFF;
  const denominator =
    DOOR_GLASS_THICKNESS / FRZ_OUT_THERMAL_COND +
    FRZ_INN_THICKNESS / FRZ_INN_THERMAL_COND +
    FF_DOOR_FOAM_MM / FRZ_MID_THERMAL_COND;

  const singleLoad = ((numerator / denominator) * FRZ_FACTOR) / 1000000;

  // Calculate total cooling load (2 sides)
  const totalLoad = 1 * singleLoad;

  document.getElementById("ffDoorCoolingLoad").textContent =
    totalLoad.toFixed(2);
  //   updateFFTotalTransmission();

  // return {
  //     FRZ_SIDE_HEIGHT: FRZ_SIDE_HEIGHT_MM,
  //     FRZ_SIDE_WIDTH: FRZ_SIDE_WIDTH_MM,
  //     FRZ_SIDE_FOAM: FRZ_SIDE_FOAM_MM
  // };
}

//function under construction
function calculateFFGasket() {
  const dims = getCurrentDimensions();
  const gasketDims = getGasketDimensions();
  const bottomGasketLength = Math.round(gasketDims.lowerGasketRow.height);
  const bottomGasketWidth = Math.round(gasketDims.lowerGasketFrame.width);

  const ffGasketThickness = Math.round(gasketDims.lowerGasketThickness.width);

  const FF_GASKET_HEIGHT = bottomGasketLength; // Distance from top of container to top of shape2
  const FF_GASKET_WIDTH = bottomGasketWidth; // Width of the container
  const FF_GASKET_THICKNESS = ffGasketThickness; // Distance from right edge of container to right edge of shape1

  // Convert to mm (1 pixel = 2mm)
  const FF_GASKET_HEIGHT_MM = Math.round(FF_GASKET_HEIGHT * 2);
  const FF_GASKET_WIDTH_MM = Math.round(FF_GASKET_WIDTH * 2);
  const FF_GASKET_THICKNESS_MM = Math.round(FF_GASKET_THICKNESS * 2);

  //   console.log("=== REFRIGERATOR SIDE VIEW DEBUG ===");
  //   console.log("FRZ_BACK_HEIGHT:", FF_GASKET_HEIGHT_MM, "mm");
  //   console.log("FRZ_BACK_WIDTH:", FF_GASKET_WIDTH_MM, "mm");
  //   console.log("FRZ_BACK_FOAM:", FF_GASKET_THICKNESS_MM, "mm");
  //   console.log("====================================");

  const gasketAreaBIG = FF_GASKET_HEIGHT_MM * FF_GASKET_WIDTH_MM;
  const gasketAreaSML =
    (FF_GASKET_HEIGHT_MM - GASKET_WALL_THICKNESS * 2) *
    (FF_GASKET_WIDTH_MM - GASKET_WALL_THICKNESS * 2);
  const gasketAreaACTUAL = gasketAreaBIG - gasketAreaSML;
  const numerator = gasketAreaACTUAL * FF_TEMP_DIFF;
  const denominator =
    FRZ_GASKET_OUT_THICKNESS / FRZ_GASKET_OUT_THERMAL_COND +
    FRZ_GASKET_INN_THICKNESS / FRZ_GASKET_INN_THERMAL_COND +
    FF_GASKET_THICKNESS_MM / FRZ_GASKET_MID_THERMAL_COND;

  const singleLoad = ((numerator / denominator) * FRZ_GASKET_FACTOR) / 1000000;

  // Calculate total cooling load (2 sides)
  const totalLoad = 1 * singleLoad;

  document.getElementById("ffGasketCoolingLoad").textContent =
    totalLoad.toFixed(2);
  //   updateFFTotalTransmission();

  // return {
  //     FRZ_SIDE_HEIGHT: FRZ_SIDE_HEIGHT_MM,
  //     FRZ_SIDE_WIDTH: FRZ_SIDE_WIDTH_MM,
  //     FRZ_SIDE_FOAM: FRZ_SIDE_FOAM_MM
  // };
}

//function under const
function calculateCompTop() {
  const dims = getCurrentDimensions();
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const containerDepth = containerTop.clientHeight;

  // Compressor foam thicknesses
  // Top foam = gap between cutout top and grey rectangle top
  const cutoutTopPosition =
    dims.shape2.top + dims.shape2.height - dims.cutout.height;
  const greyRectTopPosition =
    container.clientHeight - dims.greyRectangle.height;
  const compressorTopFoam = greyRectTopPosition - cutoutTopPosition;

  const compressorDepth = Math.round(dims.greyRectangle.width);
  const compressorTopFoamThickness = Math.round(compressorTopFoam);

  const COMP_TOP_HEIGHT = containerDepth; // Distance from top of container to top of shape2
  const COMP_TOP_WIDTH = compressorDepth; // Width of the container
  const COMP_TOP_FOAM = compressorTopFoamThickness; // Distance from right edge of container to right edge of shape1

  // Convert to mm (1 pixel = 2mm)
  const COMP_TOP_HEIGHT_MM = Math.round(COMP_TOP_HEIGHT * 2);
  const COMP_TOP_WIDTH_MM = Math.round(COMP_TOP_WIDTH * 2);
  const COMP_TOP_FOAM_MM = Math.round(COMP_TOP_FOAM * 2);

  // console.log("=== REFRIGERATOR SIDE VIEW DEBUG ===");
  // console.log("FFBACK_HEIGHT:", COMP_TOP_HEIGHT_MM, "mm");
  // console.log("FFBACK_WIDTH:", COMP_TOP_WIDTH_MM, "mm");
  // console.log("FFBACK_FOAM:", COMP_TOP_FOAM_MM, "mm");
  // console.log("====================================");

  const numerator = COMP_TOP_HEIGHT_MM * COMP_TOP_WIDTH_MM * FF_TEMP_DIFF;
  const denominator =
    FRZ_OUT_THICKNESS / FRZ_OUT_THERMAL_COND +
    FRZ_INN_THICKNESS / FRZ_INN_THERMAL_COND +
    COMP_TOP_FOAM_MM / FRZ_MID_THERMAL_COND;

  const singleLoad = ((numerator / denominator) * FRZ_FACTOR) / 1000000;

  // Calculate total cooling load (2 sides)
  const totalLoad = 1 * singleLoad;

  document.getElementById("compTopCoolingLoad").textContent =
    totalLoad.toFixed(2);
  //   updateFFTotalTransmission();

  // return {
  //     FRZ_SIDE_HEIGHT: FRZ_SIDE_HEIGHT_MM,
  //     FRZ_SIDE_WIDTH: FRZ_SIDE_WIDTH_MM,
  //     FRZ_SIDE_FOAM: FRZ_SIDE_FOAM_MM
  // };
}

//function under const
function calculateCompFront() {
  const dims = getCurrentDimensions();
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const containerDepth = containerTop.clientHeight;

  // Compressor foam thicknesses
  // Front foam = gap between cutout left and grey rectangle left
  const cutoutLeftPosition = dims.shape2.width - dims.cutout.width;
  const greyRectLeftPosition = container.clientWidth - dims.greyRectangle.width;
  const compressorFrontFoam = greyRectLeftPosition - cutoutLeftPosition;

  const compressorFrontFoamThickness = Math.round(compressorFrontFoam);

  const compressorHeight = Math.round(dims.greyRectangle.height);

  const COMP_FRONT_HEIGHT = containerDepth; // Distance from top of container to top of shape2
  const COMP_FRONT_WIDTH = compressorHeight; // Width of the container
  const COMP_FRONT_FOAM = compressorFrontFoamThickness; // Distance from right edge of container to right edge of shape1

  // Convert to mm (1 pixel = 2mm)
  const COMP_FRONT_HEIGHT_MM = Math.round(COMP_FRONT_HEIGHT * 2);
  const COMP_FRONT_WIDTH_MM = Math.round(COMP_FRONT_WIDTH * 2);
  const COMP_FRONT_FOAM_MM = Math.round(COMP_FRONT_FOAM * 2);

  // console.log("=== REFRIGERATOR SIDE VIEW DEBUG ===");
  // console.log("FFBACK_HEIGHT:", COMP_FRONT_HEIGHT_MM, "mm");
  // console.log("FFBACK_WIDTH:", COMP_FRONT_WIDTH_MM, "mm");
  // console.log("FFBACK_FOAM:", COMP_FRONT_FOAM_MM, "mm");
  // console.log("====================================");

  const numerator = COMP_FRONT_HEIGHT_MM * COMP_FRONT_WIDTH_MM * FF_TEMP_DIFF;
  const denominator =
    FRZ_OUT_THICKNESS / FRZ_OUT_THERMAL_COND +
    FRZ_INN_THICKNESS / FRZ_INN_THERMAL_COND +
    COMP_FRONT_FOAM_MM / FRZ_MID_THERMAL_COND;

  const singleLoad = ((numerator / denominator) * FRZ_FACTOR) / 1000000;

  // Calculate total cooling load (2 sides)
  const totalLoad = 1 * singleLoad;

  document.getElementById("compFrontCoolingLoad").textContent =
    totalLoad.toFixed(2);
  //   updateFFTotalTransmission();

  // return {
  //     FRZ_SIDE_HEIGHT: FRZ_SIDE_HEIGHT_MM,
  //     FRZ_SIDE_WIDTH: FRZ_SIDE_WIDTH_MM,
  //     FRZ_SIDE_FOAM: FRZ_SIDE_FOAM_MM
  // };
}

// Add gasket dimensions if elements exist
function getGasketDimensions() {
  if (upperGasketRow && lowerGasketRow) {
    return {
      upperGasketRow: {
        height: parseInt(upperGasketRow.style.height) || 160,
      },
      lowerGasketRow: {
        height: parseInt(lowerGasketRow.style.height) || 300,
      },
      upperGasketFrame: {
        width: parseInt(upperGasketFrame.style.width) || 200,
      },
      lowerGasketFrame: {
        width: parseInt(lowerGasketFrame.style.width) || 200,
      },
      upperGasketThickness: {
        width: parseInt(upperGasketThickness.style.width) || 20,
      },
      lowerGasketThickness: {
        width: parseInt(lowerGasketThickness.style.width) || 20,
      },
    };
  }
  return null;
}

function updateFRZTotalTransmission() {
    const leftRight = parseFloat(document.getElementById('frzSideCoolingLoad').textContent) || 0;
    const top = parseFloat(document.getElementById('frzTopCoolingLoad').textContent) || 0;
    const back = parseFloat(document.getElementById('frzBackCoolingLoad').textContent) || 0;
    const gasket = parseFloat(document.getElementById('frzGasketCoolingLoad').textContent) || 0;
    const door = parseFloat(document.getElementById('frzDoorCoolingLoad').textContent) || 0;
    
    const total = leftRight + top + back + gasket + door;
    
    document.getElementById('frzTotalTransmission').textContent = total.toFixed(2);
    updateGrandTotal();

}

function updateFFTotalTransmission() {
    const side = parseFloat(document.getElementById('ffSideCoolingLoad').textContent) || 0;
    const base = parseFloat(document.getElementById('ffBaseCoolingLoad').textContent) || 0;
    const back = parseFloat(document.getElementById('ffBackCoolingLoad').textContent) || 0;
    const gasket = parseFloat(document.getElementById('ffGasketCoolingLoad').textContent) || 0;
    const door = parseFloat(document.getElementById('ffDoorCoolingLoad').textContent) || 0;
    const cTop = parseFloat(document.getElementById('compTopCoolingLoad').textContent) || 0;
    const cFront = parseFloat(document.getElementById('compFrontCoolingLoad').textContent) || 0;
    
    const total = side + base + back + gasket + door+cFront+cTop;
    
    document.getElementById('ffTotalTransmission').textContent = total.toFixed(2);
    updateGrandTotal();
}

function updateGrandTotal() {
    const freezerTotal = parseFloat(document.getElementById('frzTotalTransmission').textContent) || 0;
    const freshFoodTotal = parseFloat(document.getElementById('ffTotalTransmission').textContent) || 0;
    
    const grandTotal = freezerTotal + freshFoodTotal;
    
    document.getElementById('grandTotalTransLoss').textContent = grandTotal.toFixed(2);
}

// Update dimension display values
function updateDimensionDisplay() {
  const dims = getCurrentDimensions();
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const containerTopWidth = containerTop.clientWidth;
  const containerTopHeight = containerTop.clientHeight;

  // Container (double the pixel values for mm)
  document.getElementById("refDepth").textContent = Math.round(
    containerWidth * 2,
  );
  document.getElementById("refHeight").textContent = Math.round(
    containerHeight * 2,
  );
  document.getElementById("refWidth").textContent = Math.round(
    containerTopHeight * 2,
  );

  // Top Rectangle (double the pixel values for mm)
  document.getElementById("upperCabinetTopFoamThickness").textContent =
    Math.round(dims.shape1.top * 2);
  const topBackThickness = Math.round(
    (containerWidth - dims.shape1.width - leftEdge) * 2,
  );
  document.getElementById("upperCabinetBackFoamThickness").textContent =
    topBackThickness;
  document.getElementById("upperCabinetHeight").textContent = Math.round(
    dims.shape1.height * 2,
  );
  const topWidth = Math.round(dims.shape1.width * 2);
  document.getElementById("upperCabinetDepth").textContent = topWidth;
  document.getElementById("upperCabinetWidth").textContent = Math.round(
    dims.shapeTop.height * 2,
  );
  document.getElementById("upperCabinetSideFoamThickness").textContent =
    Math.round(dims.shapeTop.top * 2);

  // Middle (double the pixel values for mm)
  document.getElementById("middleFoamThickness").textContent = Math.round(
    (dims.shape2.top - (dims.shape1.top + dims.shape1.height)) * 2,
  );

  // Bottom Rectangle (double the pixel values for mm)
  const bottomThickness =
    containerHeight - (dims.shape2.top + dims.shape2.height);
  document.getElementById("baseFoamThickness").textContent = Math.round(
    bottomThickness * 2,
  );
  document.getElementById("bottomCabinetBackFoamThickness").textContent =
    Math.round((containerWidth - dims.shape2.width - leftEdge) * 2);
  document.getElementById("bottomCabinetHeight").textContent = Math.round(
    dims.shape2.height * 2,
  );
  document.getElementById("bottomCabinetDepth").textContent = Math.round(
    dims.shapeBottom.width * 2,
  );

  // Notch (double the pixel values for mm)
  document.getElementById("notchHeight").textContent = Math.round(
    dims.greyRectangle.height * 2,
  );
  document.getElementById("notchWidth").textContent = Math.round(
    dims.greyRectangle.width * 2,
  );

  // Compressor foam thicknesses
  // Top foam = gap between cutout top and grey rectangle top
  const cutoutTopPosition =
    dims.shape2.top + dims.shape2.height - dims.cutout.height;
  const greyRectTopPosition =
    container.clientHeight - dims.greyRectangle.height;
  const compressorTopFoam = greyRectTopPosition - cutoutTopPosition;

  // Front foam = gap between cutout left and grey rectangle left
  const cutoutLeftPosition = dims.shape2.width - dims.cutout.width;
  const greyRectLeftPosition = container.clientWidth - dims.greyRectangle.width;
  const compressorFrontFoam = greyRectLeftPosition - cutoutLeftPosition;

  document.getElementById("compressorTopFoamThickness").textContent =
    Math.round(compressorTopFoam * 2);
  document.getElementById("compressorFrontFoamThickness").textContent =
    Math.round(compressorFrontFoam * 2);

  // Bottom Cabinet Top View (double the pixel values for mm)
  document.getElementById("bottomCabinetWidth").textContent = Math.round(
    dims.shapeBottom.height * 2,
  );
  document.getElementById("bottomCabinetSideFoamThickness").textContent =
    Math.round(dims.shapeBottom.top * 2);

  // Door dimensions (double the pixel values for mm)
  document.getElementById("upperDoorLength").textContent = Math.round(
    dims.upperDoor.height * 2,
  );
  document.getElementById("upperDoorWidth").textContent = Math.round(
    dims.upperDoor.width * 2,
  );
  document.getElementById("upperDoorFoamThickness").textContent = Math.round(
    dims.upperDoorFoam.width * 2,
  );
  document.getElementById("bottomDoorLength").textContent = Math.round(
    dims.bottomDoor.height * 2,
  );
  document.getElementById("bottomDoorWidth").textContent = Math.round(
    dims.bottomDoor.width * 2,
  );
  document.getElementById("bottomDoorFoamThickness").textContent = Math.round(
    dims.bottomDoorFoam.width * 2,
  );

  // Gasket dimensions (double the pixel values for mm)
  const gasketDims = getGasketDimensions();
  if (gasketDims) {
    const upperGasketHeightEl = document.getElementById("upperGasketHeight");
    const lowerGasketHeightEl = document.getElementById("lowerGasketHeight");
    const upperGasketWidthEl = document.getElementById("upperGasketWidth");
    const gasketBorderThicknessEl = document.getElementById(
      "gasketBorderThickness",
    );
    const upperGasketThicknessValueEl = document.getElementById(
      "upperGasketThicknessValue",
    );

    if (upperGasketHeightEl)
      upperGasketHeightEl.textContent = Math.round(
        gasketDims.upperGasketRow.height * 2,
      );
    if (lowerGasketHeightEl)
      lowerGasketHeightEl.textContent = Math.round(
        gasketDims.lowerGasketRow.height * 2,
      );
    if (upperGasketWidthEl)
      upperGasketWidthEl.textContent = Math.round(
        gasketDims.upperGasketFrame.width * 2,
      );

    // Get dynamic border width from upper gasket frame
    if (gasketBorderThicknessEl && upperGasketFrame) {
      const computedStyle = window.getComputedStyle(upperGasketFrame);
      const borderWidth = parseInt(computedStyle.borderWidth) || 15;
      gasketBorderThicknessEl.textContent = Math.round(borderWidth * 2);
    }

    if (upperGasketThicknessValueEl)
      upperGasketThicknessValueEl.textContent = Math.round(
        gasketDims.upperGasketThickness.width * 2,
      );
  }

  // Debug: Calculate and log measurements
  calculateFRZSide();
  calculateFRZTop();
  calculateFRZBack();
  calculateFRZDoor();
  calculateFRZGasket();

  calculateFFSide();
  calculateFFBase();
  calculateFFBack();
  calculateFFDoor();
  calculateFFGasket();
  calculateCompTop();
  calculateCompFront();

  updateFFTotalTransmission();
  updateFRZTotalTransmission();

}

// Initialize dimension display
updateDimensionDisplay();

// Handle edge interaction
document.querySelectorAll(".edge").forEach((edge) => {
  edge.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    isDragging = true;
    currentEdge = edge;
    edge.classList.add("dragging");

    const edgeType = edge.dataset.edge;
    const shapeId = edge.dataset.shape;
    const viewType = edge.dataset.view;

    if (edgeType === "top" || edgeType === "bottom") {
      startPos = e.clientY;
    } else {
      startPos = e.clientX;
    }

    const dims = getCurrentDimensions();

    if (shapeId === "REFRIGERATOR-SIDE-SHAPE") {
      if (edgeType === "right") startValue = container.clientWidth;
      else if (edgeType === "bottom") startValue = container.clientHeight;
    } else if (shapeId === "REFRIGERATOR-TOP-SHAPE") {
      if (edgeType === "right") startValue = containerTop.clientWidth;
      else if (edgeType === "bottom") startValue = containerTop.clientHeight;
    } else if (shapeId === "UPPER-CABINET-SIDE-SHAPE") {
      if (edgeType === "top") startValue = dims.shape1.top;
      else if (edgeType === "bottom") startValue = dims.shape1.height;
      else if (edgeType === "right") startValue = dims.shape1.width;
    } else if (shapeId === "BOTTOM-CABINET-SIDE-SHAPE") {
      if (edgeType === "top") startValue = dims.shape2.top;
      else if (edgeType === "bottom") startValue = dims.shape2.height;
      else if (edgeType === "right") startValue = dims.shape2.width;
    } else if (shapeId === "COMPRESSOR-AREA-SHAPE") {
      if (edgeType === "top") startValue = dims.cutout.height;
      else if (edgeType === "left") startValue = dims.cutout.width;
    } else if (shapeId === "UPPER-CABINET-TOP-SHAPE") {
      if (edgeType === "top") startValue = dims.shapeTop.top;
      else if (edgeType === "bottom") startValue = dims.shapeTop.height;
      else if (edgeType === "right") startValue = dims.shapeTop.width;
    } else if (shapeId === "REFRIGERATOR-BOTTOM-SHAPE") {
      if (edgeType === "right") startValue = containerBottom.clientWidth;
      else if (edgeType === "bottom") startValue = containerBottom.clientHeight;
    } else if (shapeId === "BOTTOM-CABINET-TOP-SHAPE") {
      if (edgeType === "top") startValue = dims.shapeBottom.top;
      else if (edgeType === "bottom") startValue = dims.shapeBottom.height;
      else if (edgeType === "right") startValue = dims.shapeBottom.width;
    } else if (shapeId === "DOOR-CONTAINER-SHAPE") {
      if (edgeType === "right") startValue = containerDoor.clientWidth;
      else if (edgeType === "bottom") startValue = containerDoor.clientHeight;
    } else if (shapeId === "UPPER-DOOR-SHAPE") {
      if (edgeType === "top") startValue = dims.upperDoor.top;
      else if (edgeType === "bottom") startValue = dims.upperDoor.height;
      else if (edgeType === "right") startValue = dims.upperDoor.width;
    } else if (shapeId === "BOTTOM-DOOR-SHAPE") {
      if (edgeType === "top") startValue = dims.bottomDoor.top;
      else if (edgeType === "bottom") startValue = dims.bottomDoor.height;
      else if (edgeType === "right") startValue = dims.bottomDoor.width;
    } else if (shapeId === "UPPER-DOOR-FOAM") {
      if (edgeType === "right") startValue = dims.upperDoorFoam.width;
    } else if (shapeId === "BOTTOM-DOOR-FOAM") {
      if (edgeType === "right") startValue = dims.bottomDoorFoam.width;
    } else if (shapeId === "UPPER-GASKET-FRAME") {
      const gasketDims = getGasketDimensions();
      if (gasketDims) {
        if (edgeType === "bottom")
          startValue = gasketDims.upperGasketRow.height;
        else if (edgeType === "right")
          startValue = gasketDims.upperGasketFrame.width;
      }
    } else if (shapeId === "LOWER-GASKET-FRAME") {
      const gasketDims = getGasketDimensions();
      if (gasketDims) {
        if (edgeType === "bottom")
          startValue = gasketDims.lowerGasketRow.height;
        else if (edgeType === "right")
          startValue = gasketDims.lowerGasketFrame.width;
      }
    } else if (shapeId === "UPPER-GASKET-THICKNESS") {
      const gasketDims = getGasketDimensions();
      if (gasketDims && edgeType === "right")
        startValue = gasketDims.upperGasketThickness.width;
    } else if (shapeId === "LOWER-GASKET-THICKNESS") {
      const gasketDims = getGasketDimensions();
      if (gasketDims && edgeType === "right")
        startValue = gasketDims.lowerGasketThickness.width;
    } else if (shapeId === "GASKET-CONTAINER-SHAPE") {
      if (containerGasket) {
        if (edgeType === "right") startValue = containerGasket.clientWidth;
        else if (edgeType === "bottom")
          startValue = containerGasket.clientHeight;
      }
    } else if (shapeId === "GASKET-WALL-THICKNESS") {
      // Get current border width from computed style
      const upperFrame = document.getElementById("upperGasketFrame");
      if (upperFrame) {
        const computedStyle = window.getComputedStyle(upperFrame);
        const borderWidth = parseInt(computedStyle.borderWidth) || 15;
        startValue = borderWidth;
      }
    } else if (shapeId === "UPPER-GASKET-OUTER") {
      const gasketDims = getGasketDimensions();
      if (gasketDims) {
        if (edgeType === "outer-bottom")
          startValue = gasketDims.upperGasketRow.height;
        else if (edgeType === "outer-right")
          startValue = gasketDims.upperGasketFrame.width;
      }
    } else if (shapeId === "LOWER-GASKET-OUTER") {
      const gasketDims = getGasketDimensions();
      if (gasketDims) {
        if (edgeType === "outer-bottom")
          startValue = gasketDims.lowerGasketRow.height;
        else if (edgeType === "outer-right")
          startValue = gasketDims.lowerGasketFrame.width;
      }
    } else if (shapeId === "GREY-RECTANGLE-SHAPE") {
      if (edgeType === "left") startValue = dims.greyRectangle.width;
      else if (edgeType === "top") startValue = dims.greyRectangle.height;
    }
  });
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging || !currentEdge) return;

  const edgeType = currentEdge.dataset.edge;
  const shapeId = currentEdge.dataset.shape;
  const dims = getCurrentDimensions();

  let delta, newValue;

  if (edgeType === "top" || edgeType === "bottom") {
    delta = e.clientY - startPos;
  } else {
    delta = e.clientX - startPos;
  }

  if (shapeId === "REFRIGERATOR-SIDE-SHAPE") {
    if (edgeType === "right") {
      // Container right edge - must be at least wide enough for shapes + padding
      newValue = Math.max(
        dims.shape1.width + padding,
        dims.shape2.width + padding,
        startValue + delta,
      );
      container.style.width = newValue + "px";
      // Sync with containerTop width
      containerTop.style.width = newValue + "px";
      // Sync with containerBottom width (REF DEPTH)
      containerBottom.style.width = newValue + "px";
    } else if (edgeType === "bottom") {
      // Container bottom edge - must be tall enough for all shapes + gaps + padding
      const minHeight =
        dims.shape1.top +
        dims.shape1.height +
        padding +
        dims.shape2.height +
        padding;
      newValue = Math.max(minHeight, startValue + delta);
      container.style.height = newValue + "px";
    }
  } else if (shapeId === "REFRIGERATOR-TOP-SHAPE") {
    if (edgeType === "right") {
      // Container top right edge
      newValue = Math.max(dims.shapeTop.width + padding, startValue + delta);
      containerTop.style.width = newValue + "px";
      // Sync with container width
      container.style.width = newValue + "px";
      // Sync with containerBottom width
      containerBottom.style.width = newValue + "px";
    } else if (edgeType === "bottom") {
      // Container top bottom edge - maintain equal top/bottom gaps in shapeTop with min 20px padding
      const minPadding = 20;
      const minHeight = 2 * minPadding + 1; // Minimum container height to fit shapeTop with padding
      newValue = Math.max(minHeight, startValue + delta);
      containerTop.style.height = newValue + "px";
      // Sync with containerBottom height (REF WIDTH)
      containerBottom.style.height = newValue + "px";

      // Recalculate to maintain equal gaps with minimum padding
      const gap = Math.max(minPadding, dims.shapeTop.top);
      const newHeight = newValue - 2 * gap;
      shapeTop.style.top = gap + "px";
      shapeTop.style.height = Math.max(1, newHeight) + "px";

      // Also recalculate shapeBottom to maintain equal gaps
      const gapBottom = Math.max(minPadding, dims.shapeBottom.top);
      const newHeightBottom = newValue - 2 * gapBottom;
      shapeBottom.style.top = gapBottom + "px";
      shapeBottom.style.height = Math.max(1, newHeightBottom) + "px";
    }
  } else if (shapeId === "UPPER-CABINET-SIDE-SHAPE") {
    if (edgeType === "top") {
      // Top edge: 10px from container top
      newValue = Math.max(
        padding,
        Math.min(startValue + delta, dims.shape1.top + dims.shape1.height - 1),
      );
      const heightChange = dims.shape1.top - newValue;
      shape1.style.top = newValue + "px";
      shape1.style.height = dims.shape1.height + heightChange + "px";
    } else if (edgeType === "bottom") {
      // Bottom edge: 10px from shape2 top or container bottom
      newValue = Math.max(1, startValue + delta);
      const maxBottom = container.clientHeight - padding;
      const bottomPosition = dims.shape1.top + newValue;
      const maxHeight =
        dims.shape2.top > dims.shape1.top
          ? Math.min(
              maxBottom - dims.shape1.top,
              dims.shape2.top - dims.shape1.top - padding,
            )
          : maxBottom - dims.shape1.top;
      shape1.style.height = Math.max(1, Math.min(newValue, maxHeight)) + "px";
    } else if (edgeType === "right") {
      // Right edge: 10px from container right
      newValue = Math.max(1, startValue + delta);
      const maxWidth = container.clientWidth - leftEdge - padding;
      const newWidth = Math.min(newValue, maxWidth);
      shape1.style.width = newWidth + "px";
      // Sync with shapeTop width (they should be equal)
      shapeTop.style.width = newWidth + "px";
    }
  } else if (shapeId === "BOTTOM-CABINET-SIDE-SHAPE") {
    if (edgeType === "top") {
      // Top edge: 10px below shape1 bottom
      const shape1Bottom = dims.shape1.top + dims.shape1.height;
      const minTop = shape1Bottom + padding;
      const maxTop = dims.shape2.top + dims.shape2.height - 1;
      newValue = Math.max(minTop, Math.min(startValue + delta, maxTop));
      const heightChange = dims.shape2.top - newValue;
      shape2.style.top = newValue + "px";
      shape2.style.height = dims.shape2.height + heightChange + "px";
    } else if (edgeType === "bottom") {
      // Bottom edge: 10px from container bottom
      newValue = Math.max(dims.cutout.height, startValue + delta);
      const maxHeight = container.clientHeight - dims.shape2.top - padding;
      shape2.style.height = Math.min(newValue, maxHeight) + "px";
    } else if (edgeType === "right") {
      // Right edge: 10px from container right
      newValue = Math.max(dims.cutout.width, startValue + delta);
      const maxWidth = container.clientWidth - leftEdge - padding;
      const newWidth = Math.min(newValue, maxWidth);
      shape2.style.width = newWidth + "px";
      // Sync with shapeBottom width
      shapeBottom.style.width = newWidth + "px";
    }
  } else if (shapeId === "COMPRESSOR-AREA-SHAPE") {
    if (edgeType === "top") {
      // Cutout top can move within shape2
      newValue = Math.max(0, startValue - delta);
      newValue = Math.min(newValue, dims.shape2.height);
      cutout.style.height = newValue + "px";
    } else if (edgeType === "left") {
      // Cutout left can move within shape2
      newValue = Math.max(0, startValue - delta);
      newValue = Math.min(newValue, dims.shape2.width);
      cutout.style.width = newValue + "px";
    }
  } else if (shapeId === "UPPER-CABINET-TOP-SHAPE") {
    if (edgeType === "top") {
      // Top edge: maintain equal gaps on top and bottom with minimum 20px padding
      const minPadding = 20;
      newValue = Math.max(
        minPadding,
        Math.min(
          startValue + delta,
          dims.shapeTop.top + dims.shapeTop.height - 1,
        ),
      );
      const heightChange = dims.shapeTop.top - newValue;

      // Calculate what the bottom gap would be
      const newHeight = dims.shapeTop.height + heightChange;
      const bottomGap = containerTop.clientHeight - newValue - newHeight;

      // Ensure minimum padding and equal gaps
      const maxPossibleHeight = containerTop.clientHeight - 2 * minPadding;
      const averageGap = Math.max(minPadding, (newValue + bottomGap) / 2);
      const adjustedTop = averageGap;
      const adjustedHeight = Math.min(
        maxPossibleHeight,
        containerTop.clientHeight - 2 * averageGap,
      );

      shapeTop.style.top = adjustedTop + "px";
      shapeTop.style.height = adjustedHeight + "px";
    } else if (edgeType === "bottom") {
      // Bottom edge: maintain equal gaps on top and bottom with minimum 20px padding
      const minPadding = 20;
      newValue = Math.max(1, startValue + delta);
      const newBottom = dims.shapeTop.top + newValue;
      const bottomGap = containerTop.clientHeight - newBottom;

      // Ensure minimum padding and equal gaps
      const maxPossibleHeight = containerTop.clientHeight - 2 * minPadding;
      const averageGap = Math.max(
        minPadding,
        (dims.shapeTop.top + bottomGap) / 2,
      );
      const adjustedTop = averageGap;
      const adjustedHeight = Math.min(
        maxPossibleHeight,
        containerTop.clientHeight - 2 * averageGap,
      );

      shapeTop.style.top = adjustedTop + "px";
      shapeTop.style.height = adjustedHeight + "px";
    } else if (edgeType === "right") {
      // Right edge: 10px from container right
      newValue = Math.max(1, startValue + delta);
      const maxWidth = containerTop.clientWidth - padding;
      const newWidth = Math.min(newValue, maxWidth);
      shapeTop.style.width = newWidth + "px";
      // Sync with shape1 width (they should be equal)
      shape1.style.width = newWidth + "px";
    }
  } else if (shapeId === "REFRIGERATOR-BOTTOM-SHAPE") {
    if (edgeType === "right") {
      // Container bottom right edge - syncs with REF DEPTH
      newValue = Math.max(dims.shapeBottom.width + padding, startValue + delta);
      containerBottom.style.width = newValue + "px";
      // Sync with container width (REF DEPTH)
      container.style.width = newValue + "px";
      containerTop.style.width = newValue + "px";
    } else if (edgeType === "bottom") {
      // Container bottom bottom edge - syncs with REF WIDTH
      const minPadding = 20;
      const minHeight = 2 * minPadding + 1;
      newValue = Math.max(minHeight, startValue + delta);
      containerBottom.style.height = newValue + "px";
      // Sync with containerTop height (REF WIDTH)
      containerTop.style.height = newValue + "px";

      // Recalculate shapeBottom to maintain equal gaps
      const gapBottom = Math.max(minPadding, dims.shapeBottom.top);
      const newHeight = newValue - 2 * gapBottom;
      shapeBottom.style.top = gapBottom + "px";
      shapeBottom.style.height = Math.max(1, newHeight) + "px";

      // Also recalculate shapeTop to maintain equal gaps
      const newHeightTop = newValue - 2 * dims.shapeTop.top;
      shapeTop.style.height = Math.max(1, newHeightTop) + "px";
    }
  } else if (shapeId === "BOTTOM-CABINET-TOP-SHAPE") {
    if (edgeType === "top") {
      // Top edge: maintain equal gaps on top and bottom with minimum 20px padding
      const minPadding = 20;
      newValue = Math.max(
        minPadding,
        Math.min(
          startValue + delta,
          dims.shapeBottom.top + dims.shapeBottom.height - 1,
        ),
      );
      const heightChange = dims.shapeBottom.top - newValue;

      // Calculate what the bottom gap would be
      const newHeight = dims.shapeBottom.height + heightChange;
      const bottomGap = containerBottom.clientHeight - newValue - newHeight;

      // Ensure minimum padding and equal gaps
      const maxPossibleHeight = containerBottom.clientHeight - 2 * minPadding;
      const averageGap = Math.max(minPadding, (newValue + bottomGap) / 2);
      const adjustedTop = averageGap;
      const adjustedHeight = Math.min(
        maxPossibleHeight,
        containerBottom.clientHeight - 2 * averageGap,
      );

      shapeBottom.style.top = adjustedTop + "px";
      shapeBottom.style.height = adjustedHeight + "px";
    } else if (edgeType === "bottom") {
      // Bottom edge: maintain equal gaps on top and bottom with minimum 20px padding
      const minPadding = 20;
      newValue = Math.max(1, startValue + delta);
      const newBottom = dims.shapeBottom.top + newValue;
      const bottomGap = containerBottom.clientHeight - newBottom;

      // Ensure minimum padding and equal gaps
      const maxPossibleHeight = containerBottom.clientHeight - 2 * minPadding;
      const averageGap = Math.max(
        minPadding,
        (dims.shapeBottom.top + bottomGap) / 2,
      );
      const adjustedTop = averageGap;
      const adjustedHeight = Math.min(
        maxPossibleHeight,
        containerBottom.clientHeight - 2 * averageGap,
      );

      shapeBottom.style.top = adjustedTop + "px";
      shapeBottom.style.height = adjustedHeight + "px";
    } else if (edgeType === "right") {
      // Right edge: 10px from container right (syncs with shape2)
      newValue = Math.max(1, startValue + delta);
      const maxWidth = containerBottom.clientWidth - padding;
      const newWidth = Math.min(newValue, maxWidth);
      shapeBottom.style.width = newWidth + "px";
      // Sync with shape2 width
      shape2.style.width = newWidth + "px";
    }
  } else if (shapeId === "UPPER-DOOR-SHAPE") {
    const doorPadding = 20;
    const sealWidth = 5;
    const gapBetweenDoorAndSeal = 5;
    const gapBetweenDoors = 20;

    if (edgeType === "bottom") {
      // Bottom edge: change upper door height only, maintain constant gaps
      newValue = Math.max(1, startValue + delta);
      upperDoor.style.height = newValue + "px";

      // Update seal and foam heights
      upperDoorSeal.style.height = newValue + "px";
      upperDoorFoam.style.height = newValue + "px";

      // Auto-resize container to maintain padding
      const newContainerHeight =
        doorPadding +
        newValue +
        gapBetweenDoors +
        dims.bottomDoor.height +
        doorPadding;
      containerDoor.style.height = newContainerHeight + "px";

      // Adjust bottom door position to maintain constant gap (upper door top stays at doorPadding)
      const newBottomDoorTop = doorPadding + newValue + gapBetweenDoors;
      bottomDoor.style.top = newBottomDoorTop + "px";
      bottomDoorSeal.style.top = newBottomDoorTop + "px";
      bottomDoorFoam.style.top = newBottomDoorTop + "px";
    } else if (edgeType === "right") {
      // Right edge: change upper door width only (no syncing with bottom door)
      newValue = Math.max(1, startValue + delta);
      upperDoor.style.width = newValue + "px";

      // Update seal and foam positions for upper door only
      const upperSealLeft =
        dims.upperDoor.left + newValue + gapBetweenDoorAndSeal;
      upperDoorSeal.style.left = upperSealLeft + "px";
      upperDoorFoam.style.left = upperSealLeft + sealWidth + "px";

      // Auto-resize container to fit the widest door + components
      const maxDoorWidth = Math.max(newValue, dims.bottomDoor.width);
      const maxFoamWidth = Math.max(
        dims.upperDoorFoam.width,
        dims.bottomDoorFoam.width,
      );
      const newContainerWidth =
        doorPadding +
        maxDoorWidth +
        gapBetweenDoorAndSeal +
        sealWidth +
        maxFoamWidth +
        doorPadding;
      containerDoor.style.width = newContainerWidth + "px";
    }
  } else if (shapeId === "BOTTOM-DOOR-SHAPE") {
    const doorPadding = 20;
    const sealWidth = 5;
    const gapBetweenDoorAndSeal = 5;
    const gapBetweenDoors = 20;

    if (edgeType === "bottom") {
      // Bottom edge: change bottom door height only, maintain constant gaps
      newValue = Math.max(1, startValue + delta);
      bottomDoor.style.height = newValue + "px";

      // Update seal and foam heights
      bottomDoorSeal.style.height = newValue + "px";
      bottomDoorFoam.style.height = newValue + "px";

      // Auto-resize container to maintain padding
      // Bottom door position is always: doorPadding + upperDoorHeight + gapBetweenDoors
      const newContainerHeight =
        doorPadding +
        dims.upperDoor.height +
        gapBetweenDoors +
        newValue +
        doorPadding;
      containerDoor.style.height = newContainerHeight + "px";
    } else if (edgeType === "right") {
      // Right edge: change bottom door width only (no syncing with upper door)
      newValue = Math.max(1, startValue + delta);
      bottomDoor.style.width = newValue + "px";

      // Update seal and foam positions for bottom door only
      const bottomSealLeft =
        dims.bottomDoor.left + newValue + gapBetweenDoorAndSeal;
      bottomDoorSeal.style.left = bottomSealLeft + "px";
      bottomDoorFoam.style.left = bottomSealLeft + sealWidth + "px";

      // Auto-resize container to fit the widest door + components
      const maxDoorWidth = Math.max(dims.upperDoor.width, newValue);
      const maxFoamWidth = Math.max(
        dims.upperDoorFoam.width,
        dims.bottomDoorFoam.width,
      );
      const newContainerWidth =
        doorPadding +
        maxDoorWidth +
        gapBetweenDoorAndSeal +
        sealWidth +
        maxFoamWidth +
        doorPadding;
      containerDoor.style.width = newContainerWidth + "px";
    }
  } else if (shapeId === "UPPER-DOOR-FOAM") {
    const doorPadding = 20;
    const sealWidth = 5;
    const gapBetweenDoorAndSeal = 5;

    if (edgeType === "right") {
      // Foam right edge (increases width when dragged right)
      newValue = Math.max(1, startValue + delta);
      upperDoorFoam.style.width = newValue + "px";

      // Auto-resize container to fit the widest foam
      const maxDoorWidth = Math.max(
        dims.upperDoor.width,
        dims.bottomDoor.width,
      );
      const maxFoamWidth = Math.max(newValue, dims.bottomDoorFoam.width);
      const newContainerWidth =
        doorPadding +
        maxDoorWidth +
        gapBetweenDoorAndSeal +
        sealWidth +
        maxFoamWidth +
        doorPadding;
      containerDoor.style.width = newContainerWidth + "px";
    }
  } else if (shapeId === "BOTTOM-DOOR-FOAM") {
    const doorPadding = 20;
    const sealWidth = 5;
    const gapBetweenDoorAndSeal = 5;

    if (edgeType === "right") {
      // Foam right edge (increases width when dragged right)
      newValue = Math.max(1, startValue + delta);
      bottomDoorFoam.style.width = newValue + "px";

      // Auto-resize container to fit the widest foam
      const maxDoorWidth = Math.max(
        dims.upperDoor.width,
        dims.bottomDoor.width,
      );
      const maxFoamWidth = Math.max(dims.upperDoorFoam.width, newValue);
      const newContainerWidth =
        doorPadding +
        maxDoorWidth +
        gapBetweenDoorAndSeal +
        sealWidth +
        maxFoamWidth +
        doorPadding;
      containerDoor.style.width = newContainerWidth + "px";
    }
  } else if (shapeId === "UPPER-GASKET-FRAME") {
    const gasketPadding = 20;
    const gasketGap = 20; // Gap between upper and lower gasket rows
    const gasketDims = getGasketDimensions();

    if (gasketDims && containerGasket) {
      if (edgeType === "bottom") {
        // Bottom edge: adjust height of upper gasket row and expand container
        newValue = Math.max(1, startValue + delta);

        upperGasketRow.style.height = newValue + "px";

        // Expand container to accommodate the change
        // Container height = top padding + upper row height + gap + lower row height + bottom padding
        const lowerRowHeight = gasketDims.lowerGasketRow.height;
        const newContainerHeight =
          2 * gasketPadding + newValue + gasketGap + lowerRowHeight;
        containerGasket.style.height = newContainerHeight + "px";
      } else if (edgeType === "right") {
        // Right edge: adjust width of upper gasket frame, sync with lower, and expand container
        newValue = Math.max(1, startValue + delta);

        upperGasketFrame.style.width = newValue + "px";
        // Sync with lower gasket frame
        lowerGasketFrame.style.width = newValue + "px";

        // Expand container to accommodate the change
        // Container width = left padding + frame width + gap + thickness width + right padding
        const thicknessWidth = gasketDims.upperGasketThickness.width;
        const newContainerWidth =
          2 * gasketPadding + newValue + gasketPadding + thicknessWidth;
        containerGasket.style.width = newContainerWidth + "px";
      }
    }
  } else if (shapeId === "LOWER-GASKET-FRAME") {
    const gasketPadding = 20;
    const gasketGap = 20;
    const gasketDims = getGasketDimensions();

    if (gasketDims && containerGasket) {
      if (edgeType === "bottom") {
        // Bottom edge: adjust height of lower gasket row and expand container
        newValue = Math.max(1, startValue + delta);

        lowerGasketRow.style.height = newValue + "px";

        // Expand container to accommodate the change
        // Container height = top padding + upper row height + gap + lower row height + bottom padding
        const upperRowHeight = gasketDims.upperGasketRow.height;
        const newContainerHeight =
          2 * gasketPadding + upperRowHeight + gasketGap + newValue;
        containerGasket.style.height = newContainerHeight + "px";
      } else if (edgeType === "right") {
        // Right edge: adjust width of lower gasket frame, sync with upper, and expand container
        newValue = Math.max(1, startValue + delta);

        lowerGasketFrame.style.width = newValue + "px";
        // Sync with upper gasket frame
        upperGasketFrame.style.width = newValue + "px";

        // Expand container to accommodate the change
        // Container width = left padding + frame width + gap + thickness width + right padding
        const thicknessWidth = gasketDims.lowerGasketThickness.width;
        const newContainerWidth =
          2 * gasketPadding + newValue + gasketPadding + thicknessWidth;
        containerGasket.style.width = newContainerWidth + "px";
      }
    }
  } else if (shapeId === "UPPER-GASKET-THICKNESS") {
    const gasketPadding = 20;
    const gasketDims = getGasketDimensions();

    if (gasketDims && containerGasket && edgeType === "right") {
      // Thickness indicator right edge - sync both thickness indicators and expand container
      newValue = Math.max(1, startValue + delta);

      upperGasketThickness.style.width = newValue + "px";
      // Sync with lower gasket thickness
      lowerGasketThickness.style.width = newValue + "px";

      // Expand container to accommodate the change
      // Container width = left padding + frame width + gap + thickness width + right padding
      const frameWidth = gasketDims.upperGasketFrame.width;
      const newContainerWidth =
        2 * gasketPadding + frameWidth + gasketPadding + newValue;
      containerGasket.style.width = newContainerWidth + "px";
    }
  } else if (shapeId === "LOWER-GASKET-THICKNESS") {
    const gasketPadding = 20;
    const gasketDims = getGasketDimensions();

    if (gasketDims && containerGasket && edgeType === "right") {
      // Thickness indicator right edge - sync both thickness indicators and expand container
      newValue = Math.max(1, startValue + delta);

      lowerGasketThickness.style.width = newValue + "px";
      // Sync with upper gasket thickness
      upperGasketThickness.style.width = newValue + "px";

      // Expand container to accommodate the change
      // Container width = left padding + frame width + gap + thickness width + right padding
      const frameWidth = gasketDims.lowerGasketFrame.width;
      const newContainerWidth =
        2 * gasketPadding + frameWidth + gasketPadding + newValue;
      containerGasket.style.width = newContainerWidth + "px";
    }
  } else if (shapeId === "GASKET-CONTAINER-SHAPE") {
    const gasketPadding = 20;

    if (containerGasket) {
      if (edgeType === "right") {
        // Container right edge
        const minFrameWidth = 50;
        const minThicknessWidth = 10;
        const minWidth =
          2 * gasketPadding + minFrameWidth + gasketPadding + minThicknessWidth;

        newValue = Math.max(minWidth, startValue + delta);
        containerGasket.style.width = newValue + "px";
      } else if (edgeType === "bottom") {
        // Container bottom edge
        const minRowHeight = 50;
        const gasketGap = 20;
        const minHeight = 2 * gasketPadding + 2 * minRowHeight + gasketGap;

        newValue = Math.max(minHeight, startValue + delta);
        containerGasket.style.height = newValue + "px";
      }
    }
  } else if (shapeId === "GASKET-WALL-THICKNESS") {
    // Handle inner edges - change wall thickness, keep total size constant
    if (
      upperGasketFrame &&
      lowerGasketFrame &&
      upperGasketRow &&
      lowerGasketRow
    ) {
      const gasketDims = getGasketDimensions();
      if (!gasketDims) return;

      if (edgeType === "inner-bottom" || edgeType === "inner-right") {
        // Calculate delta for thickness change
        // Dragging inward (left for right edge, up for bottom edge) increases thickness
        let thicknessDelta = 0;

        if (edgeType === "inner-right") {
          thicknessDelta = -delta; // Dragging left increases thickness
        } else if (edgeType === "inner-bottom") {
          thicknessDelta = -delta; // Dragging up increases thickness
        }

        // Get current border width
        const computedStyle = window.getComputedStyle(upperGasketFrame);
        const currentBorderWidth = parseInt(computedStyle.borderWidth) || 15;

        newValue = Math.max(1, currentBorderWidth + thicknessDelta);
        const maxBorderWidth = 50;
        const newBorderWidth = Math.min(newValue, maxBorderWidth);

        // Apply new border width to both frames
        upperGasketFrame.style.borderWidth = newBorderWidth + "px";
        lowerGasketFrame.style.borderWidth = newBorderWidth + "px";

        // Total size stays the same - no need to adjust container or row heights
      }
    }
  } else if (shapeId === "UPPER-GASKET-OUTER") {
    // Handle outer edges - change total size, keep wall thickness constant
    const gasketPadding = 20;
    const gasketGap = 20;
    const gasketDims = getGasketDimensions();

    if (gasketDims && containerGasket && upperGasketRow) {
      if (edgeType === "outer-bottom") {
        // Outer bottom edge - change row height, expand container
        newValue = Math.max(1, startValue + delta);

        upperGasketRow.style.height = newValue + "px";

        // Expand container
        const lowerRowHeight = gasketDims.lowerGasketRow.height;
        const newContainerHeight =
          2 * gasketPadding + newValue + gasketGap + lowerRowHeight;
        containerGasket.style.height = newContainerHeight + "px";
      } else if (edgeType === "outer-right") {
        // Outer right edge - change frame width, expand container
        newValue = Math.max(1, startValue + delta);

        upperGasketFrame.style.width = newValue + "px";
        lowerGasketFrame.style.width = newValue + "px"; // Sync both frames

        // Expand container
        const thicknessWidth = gasketDims.upperGasketThickness.width;
        const newContainerWidth =
          2 * gasketPadding + newValue + gasketPadding + thicknessWidth;
        containerGasket.style.width = newContainerWidth + "px";
      }
    }
  } else if (shapeId === "LOWER-GASKET-OUTER") {
    // Handle outer edges - change total size, keep wall thickness constant
    const gasketPadding = 20;
    const gasketGap = 20;
    const gasketDims = getGasketDimensions();

    if (gasketDims && containerGasket && lowerGasketRow) {
      if (edgeType === "outer-bottom") {
        // Outer bottom edge - change row height, expand container
        newValue = Math.max(1, startValue + delta);

        lowerGasketRow.style.height = newValue + "px";

        // Expand container
        const upperRowHeight = gasketDims.upperGasketRow.height;
        const newContainerHeight =
          2 * gasketPadding + upperRowHeight + gasketGap + newValue;
        containerGasket.style.height = newContainerHeight + "px";
      } else if (edgeType === "outer-right") {
        // Outer right edge - change frame width, expand container
        newValue = Math.max(1, startValue + delta);

        lowerGasketFrame.style.width = newValue + "px";
        upperGasketFrame.style.width = newValue + "px"; // Sync both frames

        // Expand container
        const thicknessWidth = gasketDims.lowerGasketThickness.width;
        const newContainerWidth =
          2 * gasketPadding + newValue + gasketPadding + thicknessWidth;
        containerGasket.style.width = newContainerWidth + "px";
      }
    }
  } else if (shapeId === "GREY-RECTANGLE-SHAPE") {
    // Grey rectangle - must always stay inside cutout (compressor area)
    const minSize = 10; // Minimum 20mm / 2 = 10px

    if (edgeType === "left") {
      // Left edge: dragging left (negative delta) increases width, dragging right (positive delta) decreases width
      // Invert the delta because we're dragging the left edge
      newValue = Math.max(minSize, startValue - delta); // Subtract delta to invert direction

      // Constraint: grey rectangle must stay inside cutout
      // Cutout left edge = container width - cutout width
      const cutoutWidth = dims.cutout.width;
      const maxWidth = cutoutWidth; // Cannot be wider than cutout

      newValue = Math.min(newValue, maxWidth);
      greyRectangle.style.width = Math.max(minSize, newValue) + "px";
    } else if (edgeType === "top") {
      // Top edge: dragging up (negative delta) increases height, dragging down (positive delta) decreases height
      // Invert the delta because we're dragging the top edge
      newValue = Math.max(minSize, startValue - delta); // Subtract delta to invert direction

      // Constraint: grey rectangle must stay inside cutout area
      // The cutout area spans from (shape2.top + shape2.height - cutout.height) to container.bottom
      // Grey rectangle bottom is at container.bottom
      // Grey rectangle top can go up to cutout top = (shape2.top + shape2.height - cutout.height)
      // Maximum height = container.height - (shape2.top + shape2.height - cutout.height)
      const cutoutTopPosition =
        dims.shape2.top + dims.shape2.height - dims.cutout.height;
      const maxHeight = container.clientHeight - cutoutTopPosition;

      newValue = Math.min(newValue, maxHeight);
      greyRectangle.style.height = Math.max(minSize, newValue) + "px";
    }
  }

  // Update dimension display in real-time
  updateDimensionDisplay();
});

document.addEventListener("mouseup", () => {
  if (currentEdge) {
    currentEdge.classList.remove("dragging");
  }
  isDragging = false;
  currentEdge = null;

  // Final update of dimension display
  updateDimensionDisplay();
});

// Dimension label hover to highlight edges
const dimensionMapping = {
  // Side View - Freezer Cabinet
  frzHeight: {
    edge: "bottom",
    shape: "UPPER-CABINET-SIDE-SHAPE",
    view: "side",
  },
  frzWidth: { edge: "right", shape: "UPPER-CABINET-SIDE-SHAPE", view: "side" },
  frzTopGap: { edge: "top", shape: "UPPER-CABINET-SIDE-SHAPE", view: "side" },
  frzBackThickness: {
    edge: "top",
    shape: "UPPER-CABINET-TOP-SHAPE",
    view: "top",
  },

  // Side View - FF Cabinet
  ffHeight: {
    edge: "bottom",
    shape: "BOTTOM-CABINET-SIDE-SHAPE",
    view: "side",
  },
  ffWidth: { edge: "right", shape: "BOTTOM-CABINET-SIDE-SHAPE", view: "side" },
  ffTopGap: { edge: "top", shape: "BOTTOM-CABINET-SIDE-SHAPE", view: "side" },
  ffBottomGap: {
    edge: "bottom",
    shape: "REFRIGERATOR-SIDE-SHAPE",
    view: "side",
  },

  // Compressor Area (Grey Rectangle)
  notchHeight: { edge: "top", shape: "GREY-RECTANGLE-SHAPE", view: "side" },
  notchWidth: { edge: "left", shape: "GREY-RECTANGLE-SHAPE", view: "side" },

  // Top View
  upperCabinetWidth: {
    edge: "bottom",
    shape: "REFRIGERATOR-TOP-SHAPE",
    view: "top",
  },
  upperCabinetSideFoamThickness: {
    edge: "top",
    shape: "UPPER-CABINET-TOP-SHAPE",
    view: "top",
  },
};

// ========================================
// Infiltration and Product Loss Calculations
// ========================================

function infiltrationLossFF() {
    console.log('=== infiltrationLossFF called ===');
    const inputElement = document.getElementById('freshfoodNetVolume');
    console.log('freshfoodNetVolume element:', inputElement);
    const FF_VOL = parseFloat(inputElement?.value) || 0;
    console.log('FF_VOL:', FF_VOL);
    
    const massFlowRateFFAir = (DELTA_AIR_HOUR * FF_VOL) / (SPEC_VOL_AIR*1000);
    console.log('massFlowRateFFAir:', massFlowRateFFAir);
    
    const FF_SENSIBLE_HEAT = (massFlowRateFFAir * DELTA_H_FF) / 3.6;
    const FF_LATENT_HEAT = (massFlowRateFFAir * DELTA_W_G_FF * H_F_G_FF) / 3.6;

    const infiltrationFF = FF_SENSIBLE_HEAT + FF_LATENT_HEAT;
    console.log('infiltrationFF calculated:', infiltrationFF);
    
    const infiltrationFFElement = document.getElementById('infiltrationFF');
    console.log('infiltrationFF output element:', infiltrationFFElement);
    
    if (infiltrationFFElement) {
        infiltrationFFElement.textContent = infiltrationFF.toFixed(2);
        console.log('Set infiltrationFF to:', infiltrationFF.toFixed(2));
    } else {
        console.error('infiltrationFF element not found!');
    }
    updateTotalInfiltration();
    return infiltrationFF;
}

function infiltrationLossFRZ() {
    console.log('=== infiltrationLossFRZ called ===');
    const inputElement = document.getElementById('freezerNetVolume');
    console.log('freezerNetVolume element:', inputElement);
    const FRZ_VOL = parseFloat(inputElement?.value) || 0;
    console.log('FRZ_VOL:', FRZ_VOL);
    
    const massFlowRateFRZAir = (DELTA_AIR_HOUR * FRZ_VOL) / (SPEC_VOL_AIR*1000);
    console.log('massFlowRateFRZAir:', massFlowRateFRZAir);
    
    const FRZ_SENSIBLE_HEAT = (massFlowRateFRZAir * DELTA_H_FRZ) / 3.6;
    const FRZ_LATENT_HEAT = (massFlowRateFRZAir * DELTA_W_G_FRZ * H_F_G_FRZ) / 3.6;
    
    const infiltrationFRZ = FRZ_SENSIBLE_HEAT + FRZ_LATENT_HEAT;
    console.log('infiltrationFRZ calculated:', infiltrationFRZ);
    
    const infiltrationFRZElement = document.getElementById('infiltrationFRZ');
    console.log('infiltrationFRZ output element:', infiltrationFRZElement);
    
    if (infiltrationFRZElement) {
        infiltrationFRZElement.textContent = infiltrationFRZ.toFixed(2);
        console.log('Set infiltrationFRZ to:', infiltrationFRZ.toFixed(2));
    } else {
        console.error('infiltrationFRZ element not found!');
    }
    updateTotalInfiltration();
    return infiltrationFRZ;
}

function updateTotalInfiltration() {
    console.log('=== updateTotalInfiltration called ===');
    const ffElement = document.getElementById('infiltrationFF');
    const frzElement = document.getElementById('infiltrationFRZ');
    const totalElement = document.getElementById('totalInfiltration');
    
    console.log('Elements found:', {ffElement, frzElement, totalElement});
    
    if (!ffElement || !frzElement || !totalElement) {
        console.error('Missing elements for total infiltration calculation!');
        return;
    }
    
    const ffLoss = parseFloat(ffElement.textContent) || 0;
    const frzLoss = parseFloat(frzElement.textContent) || 0;
    
    console.log('ffLoss:', ffLoss, 'frzLoss:', frzLoss);
    
    const totalInfiltration = ffLoss + frzLoss;
    console.log('totalInfiltration:', totalInfiltration);
    
    totalElement.textContent = totalInfiltration.toFixed(2);
    console.log('Set totalInfiltration to:', totalInfiltration.toFixed(2));
}

function productLoss() {
    console.log('=== productLoss called ===');
    const ffInput = document.getElementById('freshfoodNetVolume');
    const frzInput = document.getElementById('freezerNetVolume');
    
    console.log('Input elements:', {ffInput, frzInput});
    
    const FF_VOL = parseFloat(ffInput?.value) || 0;
    const FRZ_VOL = parseFloat(frzInput?.value) || 0;
    
    console.log('Volumes - FF_VOL:', FF_VOL, 'FRZ_VOL:', FRZ_VOL);
    
    const FF_PROD_WEIGHT = FF_VOL * 0.05;
    const FRZ_PROD_WEIGHT = FRZ_VOL * 0.05;

    console.log('Product weights - FF:', FF_PROD_WEIGHT, 'FRZ:', FRZ_PROD_WEIGHT);

    const FRZ_PROD_LOSS = (((FRZ_PROD_WEIGHT * C1 * DELTA_T1) + (FRZ_PROD_WEIGHT * LATENT_HEAT) + (FRZ_PROD_WEIGHT * C2 * DELTA_T2)) / (3.6 * TIME));
    const FF_PROD_LOSS = ((FF_PROD_WEIGHT * SPEC_HEAT_CP * DELTA_T) / (3.6 * TIME));

    const TOTAL_PRODUCT_LOSS = FRZ_PROD_LOSS + FF_PROD_LOSS;
    
    console.log('Product losses - FRZ:', FRZ_PROD_LOSS, 'FF:', FF_PROD_LOSS, 'TOTAL:', TOTAL_PRODUCT_LOSS);
    
    const frzElement = document.getElementById('frzProductLoss');
    const ffElement = document.getElementById('ffProductLoss');
    const totalElement = document.getElementById('totalProductLoss');
    
    console.log('Output elements:', {frzElement, ffElement, totalElement});
    
    if (frzElement) {
        frzElement.textContent = FRZ_PROD_LOSS.toFixed(2);
        console.log('Set frzProductLoss to:', FRZ_PROD_LOSS.toFixed(2));
    } else {
        console.error('frzProductLoss element not found!');
    }
    
    if (ffElement) {
        ffElement.textContent = FF_PROD_LOSS.toFixed(2);
        console.log('Set ffProductLoss to:', FF_PROD_LOSS.toFixed(2));
    } else {
        console.error('ffProductLoss element not found!');
    }
    
    if (totalElement) {
        totalElement.textContent = TOTAL_PRODUCT_LOSS.toFixed(2);
        console.log('Set totalProductLoss to:', TOTAL_PRODUCT_LOSS.toFixed(2));
    } else {
        console.error('totalProductLoss element not found!');
    }
    
    updateSummary();
    return TOTAL_PRODUCT_LOSS;
}

// Function to update all calculations (called by event listeners)
function updateAllCalculations() {
    console.log('========================================');
    console.log('=== updateAllCalculations called ===');
    console.log('========================================');
    infiltrationLossFF();
    infiltrationLossFRZ();
    productLoss();
    updateSummary();
    console.log('=== updateAllCalculations finished ===');
}

function updateSummary() {
    console.log('=== updateSummary called ===');
    const transmissionElement = document.getElementById('grandTotalTransLoss');
    const infiltrationElement = document.getElementById('totalInfiltration');
    const productElement = document.getElementById('totalProductLoss');
    
    console.log('Summary input elements:', {transmissionElement, infiltrationElement, productElement});
    
    const transmissionLoss = parseFloat(transmissionElement?.textContent) || 0;
    const infiltrationLoss = parseFloat(infiltrationElement?.textContent) || 0;
    const productLoss = parseFloat(productElement?.textContent) || 0;
    
    console.log('Summary values - Transmission:', transmissionLoss, 'Infiltration:', infiltrationLoss, 'Product:', productLoss);
    
    const GRAND_TOTAL_LOSS = transmissionLoss + infiltrationLoss + productLoss;
    console.log('GRAND_TOTAL_LOSS:', GRAND_TOTAL_LOSS);
    
    const COMPRESSOR_REQUIRED = (GRAND_TOTAL_LOSS + (GRAND_TOTAL_LOSS * SAFETY_FACTOR / 100)) / RUNTIME;
    console.log('COMPRESSOR_REQUIRED:', COMPRESSOR_REQUIRED, '(SAFETY_FACTOR:', SAFETY_FACTOR, 'RUNTIME:', RUNTIME, ')');
    
    const summaryElements = {
        summaryTransmission: document.getElementById('summaryTransmission'),
        summaryInfiltration: document.getElementById('summaryInfiltration'),
        summaryProduct: document.getElementById('summaryProduct'),
        grandTotalLoss: document.getElementById('grandTotalLoss'),
        compressorRequired: document.getElementById('compressorRequired')
    };
    
    console.log('Summary output elements:', summaryElements);
    
    if (summaryElements.summaryTransmission) {
        summaryElements.summaryTransmission.textContent = transmissionLoss.toFixed(2);
        console.log('Set summaryTransmission to:', transmissionLoss.toFixed(2));
    } else {
        console.error('summaryTransmission element not found!');
    }
    
    if (summaryElements.summaryInfiltration) {
        summaryElements.summaryInfiltration.textContent = infiltrationLoss.toFixed(2);
        console.log('Set summaryInfiltration to:', infiltrationLoss.toFixed(2));
    } else {
        console.error('summaryInfiltration element not found!');
    }
    
    if (summaryElements.summaryProduct) {
        summaryElements.summaryProduct.textContent = productLoss.toFixed(2);
        console.log('Set summaryProduct to:', productLoss.toFixed(2));
    } else {
        console.error('summaryProduct element not found!');
    }
    
    if (summaryElements.grandTotalLoss) {
        summaryElements.grandTotalLoss.textContent = GRAND_TOTAL_LOSS.toFixed(2);
        console.log('Set grandTotalLoss to:', GRAND_TOTAL_LOSS.toFixed(2));
    } else {
        console.error('grandTotalLoss element not found!');
    }
    
    if (summaryElements.compressorRequired) {
        summaryElements.compressorRequired.textContent = COMPRESSOR_REQUIRED.toFixed(2);
        console.log('Set compressorRequired to:', COMPRESSOR_REQUIRED.toFixed(2));
    } else {
        console.error('compressorRequired element not found!');
    }
    console.log('=== updateSummary finished ===');
}

// Add event listeners for real-time updates when user types
document.addEventListener('DOMContentLoaded', function() {
    console.log('========================================');
    console.log('=== DOM Content Loaded ===');
    console.log('========================================');
    
    const freezerInput = document.getElementById('freezerNetVolume');
    const freshfoodInput = document.getElementById('freshfoodNetVolume');
    
    console.log('Input elements found:', {freezerInput, freshfoodInput});
    
    if (freezerInput) {
        console.log('Adding input listener to freezerNetVolume');
        freezerInput.addEventListener('input', updateAllCalculations);
    } else {
        console.error('freezerNetVolume input element not found!');
    }
    
    if (freshfoodInput) {
        console.log('Adding input listener to freshfoodNetVolume');
        freshfoodInput.addEventListener('input', updateAllCalculations);
    } else {
        console.error('freshfoodNetVolume input element not found!');
    }
    
    // Run calculations on page load with default values
    // Use setTimeout to ensure DOM is fully ready
    console.log('Setting timeout to run initial calculations...');
    setTimeout(function() {
        console.log('Timeout fired - running initial calculations');
        updateAllCalculations();
    }, 100);
});