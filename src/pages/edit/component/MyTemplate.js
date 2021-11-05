import { fabric } from "fabric";

const full = {
  width: "800px",
  height: "auto",
  backgroundColor: "white",
};

const compositionStyle = {
  /* width: calc(100vw - 610px); */
  /* aspect-ratio: calc(4 / 3); */
  width: "500px",
  height: "400px",
  /* margin: 20px 0; */
  /* box-shadow: 0px 0px 10px #bbbbbb; */
  // borderBottom: '0.5px #B8C3D0 dashed',
  backgroundColor: "white",
  display: "flex",
  padding: "20px 150px",
  /* margin: 0 100px; */
  justifyContent: "space-between",
  alignContent: "space-between",
  flexWrap: "wrap",
};

const photoText5 = {
  width: "500px",
  height: "250px",
  backgroundColor: "white",
  display: "flex",
  padding: "20px 150px",
  justifyContent: "space-between",
  alignContent: "space-between",
  flexWrap: "wrap",
};

const text1 = {
  width: "500px",
  height: "100px",
  backgroundColor: "white",
  padding: "20px 150px",
};

const templateStyle = {
  full_1: full,
  full_2: full,
  "3a": compositionStyle,
  "4a": compositionStyle,
  "4b": compositionStyle,
  photoText_1: compositionStyle,
  photoText_2: compositionStyle,
  photoText_3: compositionStyle,
  photoText_4: compositionStyle,
  photoText_5: photoText5,
  text_1: text1,
};

function FullCanvas(templateObjStyle, preview = false) {
  fabric.Object.NUM_FRACTION_DIGITS = 8;
  let canvasBackgroundColor = "#E0E0E0";
  return function (page) {
    const canvasId = preview
      ? `preview-page${page}-canvas0`
      : `page${page}-canvas0`;
    let coverCanvas = new fabric.Canvas(canvasId, {
      ...templateObjStyle.c,
      backgroundColor: canvasBackgroundColor,
      preserveObjectStacking: true,
    });
    const title = new fabric.IText("新增標題", {
      ...templateObjStyle.t1,
    });
    const subtitle = new fabric.Textbox("新增副標題", {
      ...templateObjStyle.t2,
    });
    coverCanvas.add(title);
    coverCanvas.add(subtitle);
    return [coverCanvas];
  };
}

function CompositionCanvas(templateObjStyle, preview = false) {
  fabric.Object.NUM_FRACTION_DIGITS = 8;
  let canvasBackgroundColor = "#E0E0E0";
  return function (page) {
    return Object.values(templateObjStyle).map((objStyle, index) => {
      const canvasId = preview
        ? `preview-page${page}-canvas${index}`
        : `page${page}-canvas${index}`;
      return new fabric.Canvas(canvasId, {
        height: objStyle.height,
        width: objStyle.width,
        backgroundColor: canvasBackgroundColor,
        preserveObjectStacking: true,
      });
    });
  };
}

function PhotoTextCanvas(templateObjStyle, style, preview = false) {
  fabric.Object.NUM_FRACTION_DIGITS = 8;
  let canvasBackgroundColor = "#E0E0E0";
  const colorStyle = (index) => [
    index % 2 ? canvasBackgroundColor : "white",
    index % 2 ? "white" : canvasBackgroundColor,
    index < 3 ? canvasBackgroundColor : "white",
  ];
  return function (page) {
    return Object.values(templateObjStyle).map((objStyle, index) => {
      const canvasId = preview
        ? `preview-page${page}-canvas${index}`
        : `page${page}-canvas${index}`;
      return new fabric.Canvas(canvasId, {
        height: objStyle.height,
        width: objStyle.width,
        backgroundColor: colorStyle(index)[style],
        preserveObjectStacking: true,
      });
    });
  };
}

function text(templateObjStyle, preview = false) {
  fabric.Object.NUM_FRACTION_DIGITS = 8;
  let canvasBackgroundColor = "white";
  return function (page) {
    const canvasId = preview
      ? `preview-page${page}-canvas0`
      : `page${page}-canvas0`;
    let newCanvas = new fabric.Canvas(canvasId, {
      ...templateObjStyle.c,
      backgroundColor: canvasBackgroundColor,
      preserveObjectStacking: true,
    });
    const newText = new fabric.Textbox("新增文字", {
      ...templateObjStyle.t1,
    });
    newText.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
      bl: false,
      br: false,
      tl: false,
      tr: false,
    });
    newCanvas.add(newText);
    return [newCanvas];
  };
}

const allTemplateParams = (preview) => ({
  full_1: FullCanvas(
    {
      c: { height: 230, width: 800 },
      t1: { left: 240, top: 50, fontSize: 80 },
      t2: { left: 325, top: 150, fontSize: 30 },
    },
    preview
  ),
  full_2: FullCanvas(
    {
      c: { height: 600, width: 800 },
      t1: {
        left: 240,
        top: 300,
        fontSize: 80,
        fontWeight: "bold",
        fontStyle: "italic",
        textAlign: "right",
      },
      t2: { left: 325, top: 400, fontSize: 30 },
    },
    preview
  ),
  "3a": CompositionCanvas(
    {
      c1: { height: 240, width: 300 },
      c2: { height: 240, width: 190 },
      c3: { height: 150, width: 500 },
    },
    preview
  ),
  "4a": CompositionCanvas(
    {
      c1: { height: 195, width: 245 },
      c2: { height: 195, width: 245 },
      c3: { height: 195, width: 245 },
      c4: { height: 195, width: 245 },
    },
    preview
  ),
  "4b": CompositionCanvas(
    {
      c1: { height: 240, width: 300 },
      c2: { height: 240, width: 190 },
      c3: { height: 150, width: 190 },
      c4: { height: 150, width: 300 },
    },
    preview
  ),
  photoText_1: PhotoTextCanvas(
    { c1: { height: 100, width: 500 }, c2: { height: 290, width: 500 } },
    0,
    preview
  ),
  photoText_2: PhotoTextCanvas(
    { c1: { height: 290, width: 500 }, c2: { height: 100, width: 500 } },
    1,
    preview
  ),
  photoText_3: PhotoTextCanvas(
    { c1: { height: 400, width: 220 }, c2: { height: 400, width: 270 } },
    0,
    preview
  ),
  photoText_4: PhotoTextCanvas(
    { c1: { height: 400, width: 270 }, c2: { height: 400, width: 220 } },
    1,
    preview
  ),
  photoText_5: PhotoTextCanvas(
    {
      c1: { height: 160, width: 160 },
      c2: { height: 160, width: 160 },
      c3: { height: 160, width: 160 },
      c4: { height: 80, width: 160 },
      c5: { height: 80, width: 160 },
      c6: { height: 80, width: 160 },
    },
    2,
    preview
  ),
  text_1: text({
    c: { height: 100, width: 500 },
    t1: { height: 100, width: 500, fontSize: 15 },
  }),
});

export { templateStyle, allTemplateParams };
