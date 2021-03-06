import * as fs from "fs-extra";
import * as jpeg from "jpeg-js";
import * as upng from "upng-js";
import { ImageData } from "../core/ImageData";

/**
 * Loads local image to ImageData interface
 *
 * @export
 * @param {string} path - Local path to image
 * @returns {Promise<ImageData>}
 */
export async function loadPng(path: string): Promise<ImageData> {
    const buf = await fs.readFile(path);
    const data = upng.decode(buf.buffer);
    return {
        // bug at package upng-js types, upng.toRGBA8 returns ArrayBuffer[] not ArrayBuffer
        data: new Uint8ClampedArray((upng.toRGBA8(data) as any)[0]),
        width: data.width,
        height: data.height,
    };
}

export async function loadJpeg(path: string): Promise<ImageData> {
    const buf = await fs.readFile(path);
    const data = jpeg.decode(buf.buffer, true);
    return {
        data: new Uint8ClampedArray(data.data),
        width: data.width,
        height: data.height,
    };
}

export async function savePng(path: string, data: ImageData): Promise<void> {
    const buf = upng.encode([data.data.buffer] as any, data.width, data.height, 0);
    await fs.writeFile(path, new Uint8Array(buf));
}
