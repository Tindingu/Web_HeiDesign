import {
  LDodaithuoc,
  lkhoang,
  lcung,
  lmau,
  lnumcung,
  lnumkhoang,
  note388c,
  note388k,
  note429c,
  note429c2,
  note429k,
  note522c,
  type LobanCalculationResult,
  type LobanRulerIndex,
  type LobanSectionResult,
} from "../constants/lobanData";

function buildResult(index: LobanRulerIndex, mm: number): LobanSectionResult {
  const cycleLength = LDodaithuoc[index];
  const position = (mm * 10) % cycleLength;
  const cungs = lcung[index];
  const khoangs = lkhoang[index];
  const colors = lmau[index];
  const cungCount = lnumcung[index];
  const khoangCount = lnumkhoang[index];

  let cungIndex = 1;
  let khoangIndex = 1;

  if (position > 0) {
    cungIndex = Math.ceil(position / (cycleLength / cungCount));
    khoangIndex = Math.ceil(position / (cycleLength / khoangCount));
  }

  const majorSection = cungs[cungIndex - 1] || "";
  const minorSection = khoangs[khoangIndex - 1] || "";
  const colorHex = colors[cungIndex - 1] || "#000000";
  const color = colorHex === "#ff0000" ? "red" : "black";

  let description = "";
  if (index === 0) {
    description = `Độ dài ${mm} cm thuộc Cung <b>${minorSection.toUpperCase()}</b> nằm trong khoảng <b>${majorSection.toUpperCase()}</b> - ${note522c[cungIndex - 1] || ""}`;
  } else if (index === 1) {
    description = `Độ dài ${mm} cm thuộc Cung <b>${minorSection.toUpperCase()}</b> (${note429k[khoangIndex - 1] || ""}) nằm trong khoảng <b>${majorSection.toUpperCase()}</b> - ${note429c[cungIndex - 1] || ""} ${note429c2[cungIndex - 1] || ""}`;
  } else {
    description = `Độ dài ${mm} cm thuộc Cung <b>${minorSection.toUpperCase()}</b> (${note388k[khoangIndex - 1] || ""}) nằm trong khoảng <b>${majorSection.toUpperCase()}</b> - ${note388c[cungIndex - 1] || ""}`;
  }

  return {
    majorSection,
    minorSection,
    color,
    colorHex,
    description,
  };
}

export function calculateLoban(mm: number): LobanCalculationResult {
  return {
    mm,
    rulers: [buildResult(0, mm), buildResult(1, mm), buildResult(2, mm)],
  };
}

export default calculateLoban;
