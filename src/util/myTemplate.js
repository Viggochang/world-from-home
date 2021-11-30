import { fabric } from "fabric";

import icon_full from "../image/template/icon/full.jpeg";
import icon_composition from "../image/template/icon/composition.jpeg";
import icon_photo_text from "../image/template/icon/photo_text.jpeg";
import icon_text from "../image/template/icon/text.jpeg";
import icon_slide_show from "../image/template/icon/slide_show.jpeg";

import full_1 from "../image/template/full_1.jpeg";
import full_2 from "../image/template/full_2.jpeg";
import template_3a from "../image/template/template_3a.jpeg";
import template_4a from "../image/template/template_4a.jpeg";
import template_4b from "../image/template/template_4b.jpeg";
import photoText_1 from "../image/template/photoText_1.jpeg";
import photoText_2 from "../image/template/photoText_2.jpeg";
import photoText_3 from "../image/template/photoText_3.jpeg";
import photoText_4 from "../image/template/photoText_4.jpeg";
import photoText_5 from "../image/template/photoText_5.jpeg";
import text_1 from "../image/template/text_1.jpeg";
import slide_show_1 from "../image/template/slide_show_1.jpeg";

const full = {
  width: "800px",
  height: "auto",
  backgroundColor: "white",
};

const compositionStyle = {
  width: "500px",
  height: "400px",
  backgroundColor: "white",
  display: "flex",
  padding: "20px 150px",
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

const slideShow1 = {
  width: "800px",
  height: "230px",
  backgroundColor: "white",
  display: "flex",
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
  slide_show_1: slideShow1,
};

function FullCanvas(templateObjStyle, preview = false) {
  fabric.Object.NUM_FRACTION_DIGITS = 8;
  let canvasBackgroundColor = "#F0F0F0";
  return function (page) {
    const canvasId = preview
      ? `preview-page${page}-canvas0`
      : `page${page}-canvas0`;
    let coverCanvas = new fabric.Canvas(canvasId, {
      ...templateObjStyle.c,
      backgroundColor: canvasBackgroundColor,
      preserveObjectStacking: true,
    });
    return [coverCanvas];
  };
}

function CompositionCanvas(templateObjStyle, preview = false) {
  fabric.Object.NUM_FRACTION_DIGITS = 8;
  let canvasBackgroundColor = "#F0F0F0";
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
  let canvasBackgroundColor = "#F0F0F0";
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
    const newText = new fabric.IText("edit", {
      left: 50,
      top: 50,
      fontSize: 20,
      fontFamily: "helvetica",
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
    newCanvas.setActiveObject(newText);
    return [newCanvas];
  };
}

function slideShow(templateObjStyle, preview = false) {
  fabric.Object.NUM_FRACTION_DIGITS = 8;
  let canvasBackgroundColor = "#F0F0F0";
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

const cavasStyle = {
  full_1: { c: { height: 230, width: 800 } },
  full_2: { c: { height: 600, width: 800 } },
  "3a": {
    c1: { height: 240, width: 300 },
    c2: { height: 240, width: 190 },
    c3: { height: 150, width: 500 },
  },
  "4a": {
    c1: { height: 195, width: 245 },
    c2: { height: 195, width: 245 },
    c3: { height: 195, width: 245 },
    c4: { height: 195, width: 245 },
  },
  "4b": {
    c1: { height: 240, width: 300 },
    c2: { height: 240, width: 190 },
    c3: { height: 150, width: 190 },
    c4: { height: 150, width: 300 },
  },
  photoText_1: {
    c1: { height: 100, width: 500 },
    c2: { height: 290, width: 500 },
  },
  photoText_2: {
    c1: { height: 290, width: 500 },
    c2: { height: 100, width: 500 },
  },
  photoText_3: {
    c1: { height: 400, width: 220 },
    c2: { height: 400, width: 270 },
  },
  photoText_4: {
    c1: { height: 400, width: 270 },
    c2: { height: 400, width: 220 },
  },
  photoText_5: {
    c1: { height: 160, width: 160 },
    c2: { height: 160, width: 160 },
    c3: { height: 160, width: 160 },
    c4: { height: 80, width: 160 },
    c5: { height: 80, width: 160 },
    c6: { height: 80, width: 160 },
  },
  text_1: {
    c: { height: 100, width: 500 },
  },
  slide_show_1: {
    c1: { height: 230, width: 800 },
    c2: { height: 230, width: 800 },
    c3: { height: 230, width: 800 },
  },
};

const allTemplateParams = (preview) => ({
  full_1: FullCanvas(cavasStyle["full_1"], preview),
  full_2: FullCanvas(cavasStyle["full_2"], preview),
  "3a": CompositionCanvas(cavasStyle["3a"], preview),
  "4a": CompositionCanvas(cavasStyle["4a"], preview),
  "4b": CompositionCanvas(cavasStyle["4b"], preview),
  photoText_1: PhotoTextCanvas(cavasStyle["photoText_1"], 0, preview),
  photoText_2: PhotoTextCanvas(cavasStyle["photoText_2"], 1, preview),
  photoText_3: PhotoTextCanvas(cavasStyle["photoText_3"], 0, preview),
  photoText_4: PhotoTextCanvas(cavasStyle["photoText_4"], 1, preview),
  photoText_5: PhotoTextCanvas(cavasStyle["photoText_5"], 2, preview),
  text_1: text(
    {
      ...cavasStyle["text_1"],
      t1: { height: 100, width: 500, fontSize: 15 },
    },
    preview
  ),
  slide_show_1: slideShow(cavasStyle["slide_show_1"], preview),
});

const allTemplate = {
  full: {
    name: "全版相片",
    icon: icon_full,
    template: [
      [1, "full_1", full_1],
      [1, "full_2", full_2],
    ],
  },
  composition: {
    name: `相片拼貼`,
    icon: icon_composition,
    template: [
      [3, "3a", template_3a],
      [4, "4a", template_4a],
      [4, "4b", template_4b],
    ],
  },
  photoText: {
    name: "圖文搭配",
    icon: icon_photo_text,
    template: [
      [2, "photoText_1", photoText_1],
      [2, "photoText_2", photoText_2],
      [2, "photoText_3", photoText_3],
      [2, "photoText_4", photoText_4],
      [6, "photoText_5", photoText_5],
    ],
  },
  text: {
    name: "文字",
    icon: icon_text,
    template: [[1, "text_1", text_1]],
  },
  slideShow: {
    name: "slide show",
    icon: icon_slide_show,
    template: [[3, "slide_show_1", slide_show_1]],
  },
};

export { templateStyle, allTemplateParams, cavasStyle, allTemplate };
