import { promises } from "fs";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import satori from "satori";
import path from "path";
import fs from "fs";
import { getIconCode, loadEmoji } from "./twemoji";

let initialized = false;

export async function convertSvgToPngByResvg(targetSvg: Buffer | string) {
  try {
    const wasmPath = path.resolve(
      "./node_modules/@resvg/resvg-wasm/index_bg.wasm"
    );
    const wasmBuffer = fs.readFileSync(wasmPath);
    if (!initialized) {
      await initWasm(wasmBuffer);
      initialized = true;
    }
    const renderer = new Resvg(targetSvg, {});
    const image = renderer.render();
    return image.asPng();
  } catch (e) {
    console.error(e);
  }
}

export async function tsxToPNGBuffer(
  jsx: JSX.Element,
  fontName: string = "Outfit-Regular",
  fontPath: string = "./public/Outfit-Regular.ttf"
) {
  const svg = await satori(jsx, {
    width: 1080,
    height: 1080,
    fonts: [
      {
        name: fontName,
        data: await promises.readFile(fontPath),
        weight: 400,
        style: "normal",
      },
    ],
    loadAdditionalAsset: async (code: string, segment: string) => {
      if (code === "emoji") {
        console.log(segment);
        return (
          `data:image/svg+xml;base64,` +
          btoa(await loadEmoji("twemoji", getIconCode(segment)))
        );
      }
      return code;
    },
  });
  const png: any = await convertSvgToPngByResvg(svg);
  const pngBuffer = Buffer.from(png);
  // const png: any = await convertSvgToPngBySharp(svg)
  // const pngBuffer = Buffer.from(png)
  // const pngBuffer = png
  return pngBuffer;
}

export function saveAsPNG(buffer: Buffer, filePath: string) {
  try {
    fs.writeFileSync(filePath, buffer);
    return true;
  } catch (error) {
    console.log("Error happened while CREATING the file!");
    return false;
  }
}

export function deleteFileAfter(filePath: string, seconds: number) {
  setTimeout(() => {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete file:", err);
      else console.log("File deleted:", filePath);
    });
  }, seconds * 1000);
}