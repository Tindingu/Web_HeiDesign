"use client";

import { X } from "lucide-react";
import NextImage from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Point = [number, number];
type SurfaceKey = "cabinet_top" | "cabinet_down" | "floor";
type FinishType = "color" | "texture";

type AnnotationObject = {
  classTitle?: string;
  geometryType?: "rectangle" | "polygon" | string;
  points?: {
    exterior?: Point[];
  };
};

type AnnotationFile = {
  size?: {
    width: number;
    height: number;
  };
  objects?: AnnotationObject[];
};

type ColorOption = {
  label: string;
  value: string;
};

type Material = {
  name: string;
  code: string;
  textureUrl: string;
};

type SurfaceSelection = {
  type: FinishType;
  color: string;
  materialCode: string;
  opacity: number;
  scale: number;
  rotation: number;
};

const IMAGE_URL = "upload/phoimau/bep/bep.jpg";
const ANNOTATION_URL =
  "/phoimau/bep/Mau-tu-bep-dep-hien-dai-go-cong-nghiep-LG-TB123.jpg.json";

const surfaceLabels: Record<SurfaceKey, string> = {
  cabinet_top: "Tủ trên",
  cabinet_down: "Tủ dưới",
  floor: "Sàn",
};

const surfaceDescriptions: Record<SurfaceKey, string> = {
  cabinet_top: "Cabinet top",
  cabinet_down: "Cabinet down",
  floor: "Floor",
};

const surfaceKeys: SurfaceKey[] = ["cabinet_top", "cabinet_down", "floor"];

const colorOptions: ColorOption[] = [
  { label: "Trắng", value: "#f8f6ef" },
  { label: "Kem", value: "#d8c7aa" },
  { label: "Xám", value: "#8a8d8f" },
  { label: "Nâu gỗ", value: "#8b5a33" },
  { label: "Đen", value: "#191919" },
];

const cabinetMaterials: Material[] = [
  {
    name: "MFC vân sáng",
    code: "MFC-MS-530-NWM",
    textureUrl: "/phoimau/textures/mfc-ms-530-nwm.jpg",
  },
  {
    name: "Walnut",
    code: "WALNUT",
    textureUrl: "/phoimau/textures/walnut.jpg",
  },
  {
    name: "Oak",
    code: "OAK",
    textureUrl: "/phoimau/textures/oak.jpg",
  },
  {
    name: "Dark wood",
    code: "DARK-WOOD",
    textureUrl: "/phoimau/textures/dark-wood.jpg",
  },
];

const floorMaterials: Material[] = [
  { name: "Sàn 1", code: "SAN-1", textureUrl: "upload/phoimau/san/san_1.jpg" },
  { name: "Sàn 2", code: "SAN-2", textureUrl: "upload/phoimau/san/san_2.jpg" },
  { name: "Sàn 3", code: "SAN-3", textureUrl: "upload/phoimau/san/san_3.jpg" },
  { name: "Sàn 4", code: "SAN-4", textureUrl: "upload/phoimau/san/san_4.jpg" },
  { name: "Sàn 5", code: "SAN-5", textureUrl: "upload/phoimau/san/san_5.jpg" }
];
const initialSelections: Record<SurfaceKey, SurfaceSelection> = {
  cabinet_top: {
    type: "color",
    color: "#d8c7aa",
    materialCode: "MFC-MS-530-NWM",
    opacity: 0.68,
    scale: 1.25,
    rotation: 90,
  },
  cabinet_down: {
    type: "color",
    color: "#8b5a33",
    materialCode: "WALNUT",
    opacity: 0.72,
    scale: 1.2,
    rotation: 90,
  },
  floor: {
    type: "texture",
    color: "#8a8d8f",
    materialCode: "SAN-2",
    opacity: 0.72,
    scale: 0.95,
    rotation: 0,
  },
};

function getMaterials(surface: SurfaceKey) {
  return surface === "floor" ? floorMaterials : cabinetMaterials;
}

function isLightColor(hexColor: string) {
  const hex = hexColor.replace("#", "");
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  return red * 0.299 + green * 0.587 + blue * 0.114 > 170;
}

function loadImage(source: string, errorMessage: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(errorMessage));
    image.src = source;
  });
}

function drawShapePath(
  context: CanvasRenderingContext2D,
  object: AnnotationObject,
) {
  const exterior = object.points?.exterior;
  if (!exterior || exterior.length < 2) return false;

  context.beginPath();

  if (object.geometryType === "rectangle") {
    const [start, end] = exterior;
    const x = Math.min(start[0], end[0]);
    const y = Math.min(start[1], end[1]);
    const width = Math.abs(end[0] - start[0]);
    const height = Math.abs(end[1] - start[1]);
    context.rect(x, y, width, height);
    return true;
  }

  if (object.geometryType === "polygon") {
    const [firstPoint, ...restPoints] = exterior;
    context.moveTo(firstPoint[0], firstPoint[1]);
    restPoints.forEach((point) => context.lineTo(point[0], point[1]));
    context.closePath();
    return true;
  }

  return false;
}

function fillObjects(
  context: CanvasRenderingContext2D,
  objects: AnnotationObject[],
) {
  objects.forEach((object) => {
    if (!drawShapePath(context, object)) return;
    context.fill();
  });
}

export function KitchenColorConfigurator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const objectsBySurfaceRef = useRef<Record<SurfaceKey, AnnotationObject[]>>({
    cabinet_top: [],
    cabinet_down: [],
    floor: [],
  });
  const textureImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const [activeSurface, setActiveSurface] = useState<SurfaceKey>("cabinet_top");
  const [selections, setSelections] =
    useState<Record<SurfaceKey, SurfaceSelection>>(initialSelections);
  const [textureVersion, setTextureVersion] = useState(0);
  const [textureLoadingCode, setTextureLoadingCode] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [objectCounts, setObjectCounts] = useState<Record<SurfaceKey, number>>({
    cabinet_top: 0,
    cabinet_down: 0,
    floor: 0,
  });

  const activeSelection = selections[activeSurface];
  const activeMaterials = getMaterials(activeSurface);

  const loadTexture = useCallback(async (material: Material) => {
    if (textureImagesRef.current.has(material.code)) return;

    setTextureLoadingCode(material.code);
    try {
      const texture = await loadImage(
        material.textureUrl,
        `Không load được texture ${material.code}.`,
      );
      textureImagesRef.current.set(material.code, texture);
      setTextureVersion((version) => version + 1);
    } finally {
      setTextureLoadingCode("");
    }
  }, []);

  const renderColor = useCallback(
    (
      context: CanvasRenderingContext2D,
      objects: AnnotationObject[],
      selection: SurfaceSelection,
    ) => {
      const lightColor = isLightColor(selection.color);

      context.save();
      context.globalAlpha = lightColor ? 0.72 : 0.82;
      context.globalCompositeOperation = "color";
      context.fillStyle = selection.color;
      fillObjects(context, objects);
      context.restore();

      context.save();
      context.globalAlpha = lightColor ? 0.12 : 0.22;
      context.globalCompositeOperation = lightColor ? "overlay" : "multiply";
      context.fillStyle = selection.color;
      fillObjects(context, objects);
      context.restore();
    },
    [],
  );

  const renderTexture = useCallback(
    (
      context: CanvasRenderingContext2D,
      objects: AnnotationObject[],
      selection: SurfaceSelection,
    ) => {
      const texture = textureImagesRef.current.get(selection.materialCode);
      if (!texture) return;

      const pattern = context.createPattern(texture, "repeat");
      if (!pattern) return;

      const patternMatrix = new DOMMatrix();
      patternMatrix.scaleSelf(selection.scale, selection.scale);
      patternMatrix.rotateSelf(selection.rotation);
      pattern.setTransform(patternMatrix);

      context.save();
      context.globalAlpha = selection.opacity;
      context.globalCompositeOperation = "multiply";
      context.fillStyle = pattern;
      fillObjects(context, objects);
      context.restore();

      context.save();
      context.globalAlpha = Math.min(selection.opacity * 0.36, 0.28);
      context.globalCompositeOperation = "overlay";
      context.fillStyle = pattern;
      fillObjects(context, objects);
      context.restore();
    },
    [],
  );

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;
    context.globalCompositeOperation = "source-over";
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    surfaceKeys.forEach((surface) => {
      const selection = selections[surface];
      const objects = objectsBySurfaceRef.current[surface];
      if (!objects.length) return;

      if (selection.type === "texture") {
        renderTexture(context, objects, selection);
      } else {
        renderColor(context, objects, selection);
      }
    });
  }, [renderColor, renderTexture, selections]);

  useEffect(() => {
    let cancelled = false;

    async function loadAssets() {
      try {
        setStatus("loading");
        setErrorMessage("");

        const [annotationResponse, image] = await Promise.all([
          fetch(ANNOTATION_URL),
          loadImage(IMAGE_URL, "Không load được ảnh bếp."),
        ]);

        if (!annotationResponse.ok) {
          throw new Error("Không load được file annotation JSON.");
        }

        const annotation = (await annotationResponse.json()) as AnnotationFile;
        const objects = annotation.objects ?? [];
        const groupedObjects: Record<SurfaceKey, AnnotationObject[]> = {
          cabinet_top: objects.filter(
            (object) => object.classTitle === "cabinet_top",
          ),
          cabinet_down: objects.filter(
            (object) => object.classTitle === "cabinet_down",
          ),
          floor: objects.filter((object) => object.classTitle === "floor"),
        };

        if (!cancelled) {
          const canvas = canvasRef.current;
          if (!canvas) return;

          imageRef.current = image;
          objectsBySurfaceRef.current = groupedObjects;
          canvas.width = annotation.size?.width ?? image.naturalWidth;
          canvas.height = annotation.size?.height ?? image.naturalHeight;
          setObjectCounts({
            cabinet_top: groupedObjects.cabinet_top.length,
            cabinet_down: groupedObjects.cabinet_down.length,
            floor: groupedObjects.floor.length,
          });
          setStatus("ready");
        }
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Có lỗi khi load dữ liệu phối màu.",
          );
        }
      }
    }

    void loadAssets();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    Object.entries(selections).forEach(([surface, selection]) => {
      if (selection.type !== "texture") return;
      const material = getMaterials(surface as SurfaceKey).find(
        (item) => item.code === selection.materialCode,
      );
      if (material) void loadTexture(material);
    });
  }, [loadTexture, selections]);

  useEffect(() => {
    if (status !== "ready") return;
    renderCanvas();
  }, [renderCanvas, status, textureVersion]);

  const updateActiveSelection = (next: Partial<SurfaceSelection>) => {
    setSelections((current) => ({
      ...current,
      [activeSurface]: {
        ...current[activeSurface],
        ...next,
      },
    }));
  };

  const handleMaterialClick = (material: Material) => {
    updateActiveSelection({
      materialCode: material.code,
      type: "texture",
    });
    void loadTexture(material);
  };

  const openPreview = () => {
    const canvas = canvasRef.current;
    if (!canvas || status !== "ready") return;
    setPreviewImage(canvas.toDataURL("image/jpeg", 0.92));
  };

  return (
    <section className="bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            {/* <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
              Kitchen Material Configurator
            </p> */}
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl text-amber-400" >
              Phối Màu Tủ Bếp Và Sàn
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              Chọn tủ trên, tủ dưới hoặc sàn rồi áp màu hoặc vật liệu.
            </p>
          </div>

          {/* <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
            {status === "ready"
              ? `${objectCounts.cabinet_top + objectCounts.cabinet_down + objectCounts.floor} vùng annotation`
              : "Đang chuẩn bị canvas"}
          </div> */}
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          <button
            type="button"
            onClick={openPreview}
            className="overflow-hidden rounded-lg border border-white/10 bg-black text-left shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Phóng to ảnh phối màu"
          >
            <div className="relative">
              {status === "loading" && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/80 text-sm text-white/70">
                  Đang load ảnh và JSON...
                </div>
              )}
              {status === "error" && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-red-950/90 px-6 text-center text-sm text-red-100">
                  {errorMessage}
                </div>
              )}
              <canvas
                ref={canvasRef}
                className="block h-auto w-full"
                aria-label="Kitchen material preview"
              />
              <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                Nhấn để phóng to
              </span>
            </div>
          </button>

          <aside className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <h2 className="text-base font-semibold">Khu vực cần phối</h2>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {surfaceKeys.map((surface) => (
                <button
                  key={surface}
                  type="button"
                  onClick={() => setActiveSurface(surface)}
                  className={`rounded-lg border px-2 py-2 text-center text-sm transition ${
                    activeSurface === surface
                      ? "border-amber-400 bg-amber-400/10 text-white"
                      : "border-white/10 bg-white/5 text-white/65 hover:border-white/25 hover:text-white"
                  }`}
                >
                  <span className="block font-semibold">
                    {surfaceLabels[surface]}
                  </span>
                  {/* <span className="mt-0.5 block text-[11px] text-white/45">
                    {objectCounts[surface]} vùng
                  </span> */}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-white/45">
                Đang chỉnh
              </p>
              <p className="mt-1 text-lg font-semibold">
                {surfaceLabels[activeSurface]}
              </p>
              {/* <p className="text-sm text-white/55">
                {surfaceDescriptions[activeSurface]}
              </p> */}
            </div>

            <div className="mt-5 flex rounded-lg border border-white/10 bg-black/20 p-1">
              <button
                type="button"
                onClick={() => updateActiveSelection({ type: "color" })}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
                  activeSelection.type === "color"
                    ? "bg-white text-slate-950"
                    : "text-white/65 hover:text-white"
                }`}
              >
                Màu đơn sắc
              </button>
              <button
                type="button"
                onClick={() => updateActiveSelection({ type: "texture" })}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
                  activeSelection.type === "texture"
                    ? "bg-white text-slate-950"
                    : "text-white/65 hover:text-white"
                }`}
              >
                Vật liệu
              </button>
            </div>

            {activeSelection.type === "color" ? (
              <div className="mt-5">
                <h3 className="text-sm font-semibold text-white/85">
                  Chọn màu
                </h3>
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() =>
                        updateActiveSelection({
                          color: color.value,
                          type: "color",
                        })
                      }
                      className={`h-10 rounded-lg border transition ${
                        activeSelection.color === color.value
                          ? "border-amber-400 ring-2 ring-amber-400/35"
                          : "border-white/15 hover:border-white/40"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                      aria-label={color.label}
                    />
                  ))}
                </div>

                <label className="mt-3 flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-2 text-sm font-medium text-white/80">
                  Custom
                  <input
                    type="color"
                    value={activeSelection.color}
                    onChange={(event) =>
                      updateActiveSelection({
                        color: event.target.value,
                        type: "color",
                      })
                    }
                    className="h-9 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
                    aria-label="Chọn màu custom"
                  />
                  <span className="font-mono text-xs text-white/55">
                    {activeSelection.color.toUpperCase()}
                  </span>
                </label>
              </div>
            ) : (
              <div className="mt-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-white/85">
                    Chọn vật liệu
                  </h3>
                  {textureLoadingCode && (
                    <span className="text-xs text-amber-300">
                      Đang load {textureLoadingCode}
                    </span>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  {activeMaterials.map((material) => (
                    <button
                      key={material.code}
                      type="button"
                      onClick={() => handleMaterialClick(material)}
                      className={`overflow-hidden rounded-lg border text-left transition ${
                        activeSelection.materialCode === material.code
                          ? "border-amber-400 bg-amber-400/10"
                          : "border-white/10 bg-white/5 hover:border-white/25"
                      }`}
                    >
                      <span
                        className="block h-16 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${material.textureUrl})`,
                        }}
                      />
                      <span className="block px-2.5 py-2">
                        <span className="block text-sm font-semibold text-white">
                          {material.name}
                        </span>
                        <span className="mt-0.5 block text-[11px] uppercase tracking-wide text-white/50">
                          {material.code}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>

                <label className="mt-5 block text-sm font-medium text-white/80">
                  Opacity: {Math.round(activeSelection.opacity * 100)}%
                  <input
                    type="range"
                    min="0.25"
                    max="1"
                    step="0.01"
                    value={activeSelection.opacity}
                    onChange={(event) =>
                      updateActiveSelection({
                        opacity: Number(event.target.value),
                      })
                    }
                    className="mt-2 w-full accent-amber-400"
                  />
                </label>

                <label className="mt-4 block text-sm font-medium text-white/80">
                  Texture scale: {activeSelection.scale.toFixed(2)}x
                  <input
                    type="range"
                    min="0.35"
                    max="3"
                    step="0.05"
                    value={activeSelection.scale}
                    onChange={(event) =>
                      updateActiveSelection({
                        scale: Number(event.target.value),
                      })
                    }
                    className="mt-2 w-full accent-amber-400"
                  />
                </label>
              </div>
            )}
          </aside>
        </div>
      </div>

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button
            type="button"
            onClick={() => setPreviewImage("")}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
            aria-label="Đóng ảnh phóng to"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative h-[92vh] w-[94vw]">
            <NextImage
              src={previewImage}
              alt="Ảnh phối màu phóng to"
              fill
              unoptimized
              className="rounded-lg object-contain shadow-2xl"
              sizes="94vw"
            />
          </div>
        </div>
      )}
    </section>
  );
}
