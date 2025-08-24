import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, Suspense, useRef, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useThree } from "@react-three/fiber";
import { Grid, OrbitControls, useGLTF, TransformControls, Html } from "@react-three/drei";
import { WebsimSocket, useQuery } from "@websim/use-query";
import * as THREE from "three";
const room = new WebsimSocket();
const COLLECTION_NAME = "scene_objects_v1";
function Model({ obj, onUpdate, onSelect, isSelected }) {
  const { scene } = useGLTF(obj.model_url);
  const transformRef = useRef();
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      setCurrentUser(await window.websim.getCurrentUser());
    };
    fetchUser();
  }, []);
  const isOwner = currentUser && obj.user_id === currentUser.id;
  useEffect(() => {
    const controls = transformRef.current;
    if (!controls) return;
    const onDragChange = (event) => {
      if (!event.value) {
        const target = controls.object;
        const position = { x: target.position.x, y: target.position.y, z: target.position.z };
        const rotation = { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z };
        const scale = { x: target.scale.x, y: target.scale.y, z: target.scale.z };
        onUpdate(obj.id, { position, rotation, scale });
      }
    };
    controls.addEventListener("dragging-changed", onDragChange);
    return () => controls.removeEventListener("dragging-changed", onDragChange);
  }, [transformRef.current, onUpdate, obj.id]);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  return /* @__PURE__ */ jsxDEV(
    TransformControls,
    {
      ref: transformRef,
      object: clonedScene,
      enabled: isSelected && isOwner,
      showX: isSelected && isOwner,
      showY: isSelected && isOwner,
      showZ: isSelected && isOwner,
      position: [obj.position.x, obj.position.y, obj.position.z],
      rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
      scale: [obj.scale.x, obj.scale.y, obj.scale.z],
      onMouseUp: () => {
      },
      children: [
        /* @__PURE__ */ jsxDEV(
          "primitive",
          {
            object: clonedScene,
            onClick: (e) => {
              e.stopPropagation();
              onSelect(obj.id);
            }
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 61,
            columnNumber: 13
          },
          this
        ),
        isSelected && /* @__PURE__ */ jsxDEV(Html, { position: [0, 1.5, 0], children: /* @__PURE__ */ jsxDEV("div", { className: "info-box", children: [
          /* @__PURE__ */ jsxDEV("img", { src: `https://images.websim.com/avatar/${obj.username}`, alt: obj.username }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 71,
            columnNumber: 24
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: obj.username }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 72,
            columnNumber: 24
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 70,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 69,
          columnNumber: 18
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "<stdin>",
      lineNumber: 47,
      columnNumber: 9
    },
    this
  );
}
function Scene() {
  const [selected, setSelected] = useState(null);
  const query = useMemo(() => room.query(`
        SELECT 
            so.id,
            so.user_id,
            so.model_url,
            so.position,
            so.rotation,
            so.scale,
            u.username
        FROM public.scene_objects_v1 so
        JOIN public.user u ON so.user_id = u.id
    `), []);
  const { data: objects, loading } = useQuery(query);
  const handleUpdate = async (id, data) => {
    const gridSize = 1;
    data.position.x = Math.round(data.position.x / gridSize) * gridSize;
    data.position.y = Math.round(data.position.y / gridSize) * gridSize;
    data.position.z = Math.round(data.position.z / gridSize) * gridSize;
    await room.collection(COLLECTION_NAME).upsert({ id, ...data });
  };
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("ambientLight", { intensity: 1.5 }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 111,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("directionalLight", { position: [10, 10, 5], intensity: 1 }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 112,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(Grid, { infiniteGrid: true, followCamera: true, fadeDistance: 100 }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 113,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(OrbitControls, { makeDefault: true }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 114,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(Suspense, { fallback: null, children: objects && objects.map((obj) => /* @__PURE__ */ jsxDEV(
      Model,
      {
        obj,
        onUpdate: handleUpdate,
        onSelect: setSelected,
        isSelected: selected === obj.id
      },
      obj.id,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 118,
        columnNumber: 21
      },
      this
    )) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 116,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("mesh", { position: [0, -0.01, 0], rotation: [-Math.PI / 2, 0, 0], onClick: () => setSelected(null), children: [
      /* @__PURE__ */ jsxDEV("planeGeometry", { args: [1e3, 1e3] }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 129,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("meshStandardMaterial", { color: "#333", transparent: true, opacity: 0 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 130,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 128,
      columnNumber: 14
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 110,
    columnNumber: 9
  }, this);
}
function App() {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".glb")) {
      alert("Please upload a .glb file.");
      return;
    }
    setUploading(true);
    try {
      const url = await window.websim.upload(file);
      await room.collection(COLLECTION_NAME).create({
        model_url: url,
        position: { x: 0, y: 0.5, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("div", { className: "ui-container", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "file",
            accept: ".glb",
            onChange: handleFileUpload,
            style: { display: "none" },
            id: "file-upload",
            ref: fileInputRef
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 172,
            columnNumber: 21
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("button", { onClick: () => document.getElementById("file-upload").click(), className: "upload-btn", disabled: uploading, children: uploading ? "Uploading..." : "Upload .glb Model" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 180,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 171,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "text-gray-400 text-sm hidden md:block", children: "Click to select, Drag gizmos to move, Click empty space to deselect" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 184,
        columnNumber: 18
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 170,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(Canvas, { camera: { position: [5, 5, 5], fov: 50 }, children: /* @__PURE__ */ jsxDEV(Scene, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 189,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 188,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 169,
    columnNumber: 9
  }, this);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 196,
  columnNumber: 13
}));
