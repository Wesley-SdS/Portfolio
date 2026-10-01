import type { Crop, CropBox, CropMask, ImageAsset } from "./types";

/**
 * Image registry + named crops (v3spec §12, v2spec §11, finalSpec §8).
 * Use with <CropImage crop={crops.orbita.visaoGeral.c} /> (components/ui-v3/CropImage.tsx).
 * Alt text keys live under the `images` messages namespace.
 *
 * Never use (v3spec §12.3): orbitmind Agents/Analytics/Membros/Inicio/Kanban/…,
 * dev-portfolio/*, orbitfinance Painel/Relatorios/…, any Adalink/Revoluna screenshot.
 */

const img = (src: string, width: number, height: number): ImageAsset => ({ src, width, height });
const crop = (image: ImageAsset, box: CropBox, altKey: string, masks?: CropMask[]): Crop => ({
  image,
  box,
  altKey,
  masks,
});
const full = (image: ImageAsset, altKey: string): Crop =>
  crop(image, { x: 0, y: 0, w: image.width, h: image.height }, altKey);

/* ------------------------------------------------------------ files */
export const images = {
  wesley: img("/Wesley.jpg", 864, 1184),
  adalinkLogo: img("/Adalink.png", 512, 512),
  revolunaLogo: img("/Revoluna.png", 225, 225),
  mgLogo: img("/MG.png", 240, 240),
  ecommerce: img("/ecommerce.png", 1882, 831),
  orbita: {
    escuroVisaoGeral: img("/projects/orbita/escuro-visao-geral.png", 2880, 1800),
    claroConexoes: img("/projects/orbita/claro-conexoes.png", 2880, 1800),
    claroGestao: img("/projects/orbita/claro-gestao.png", 2880, 1800),
    escuroConhecimento: img("/projects/orbita/escuro-conhecimento.png", 2880, 1800),
    claroReunioes: img("/projects/orbita/claro-reunioes.png", 2880, 1800),
    claroMemoria: img("/projects/orbita/claro-memoria.png", 2880, 1800),
    escuroLogin: img("/projects/orbita/escuro-login.png", 2880, 1800),
    claroCelularVisaoGeral: img("/projects/orbita/claro-celular-visao-geral.png", 1170, 2532),
  },
  orb: {
    idle: img("/orbita/orb-idle.png", 696, 471),
    thinking: img("/orbita/orb-thinking.png", 696, 471),
    searching: img("/orbita/orb-searching.png", 696, 471),
    speaking: img("/orbita/orb-speaking.png", 696, 471),
    success: img("/orbita/orb-success.png", 696, 471),
  },
  orbitmind: {
    flow: img("/projects/orbitmind/flow.png", 2560, 911),
    appNav: img("/projects/orbitmind/app-nav.png", 1280, 720),
  },
  orbitfinance: {
    inicio: img("/projects/orbitfinance/Inicio.png", 1920, 869),
    recurso: img("/projects/orbitfinance/Recurso.png", 1920, 869),
  },
  vibecoding: {
    editor: img("/projects/orbitmind-vibecoding/Editor-.png", 1920, 869),
    geracao: img("/projects/orbitmind-vibecoding/Geracao-.png", 1920, 869),
    demo: img("/projects/orbitmind-vibecoding/Demo.png", 1920, 869),
  },
  fsjpii: {
    login: img("/projects/fsjpii/Login.png", 1920, 869),
  },
  influencerIcon: "/projects/influencerai/icon.svg",
} as const;

/* ------------------------------------------------------------ crops */
/** Órbita "C crop": removes sidebar + top bar (stage front, peeks, previews, gallery plates). */
const ORBITA_C: CropBox = { x: 576, y: 158, w: 2304, h: 1440 };
/** Shared circular crop for the five orb stills. */
export const ORB_BOX: CropBox = { x: 157, y: 52, w: 380, h: 380 };

const white = (left: string, top: string, width: string, height: string): CropMask => ({
  left,
  top,
  width,
  height,
  color: "#FFFFFF",
});

export const crops = {
  wesley: {
    /** circle avatar (hero byline 64 / mobile 48) */
    avatar: crop(images.wesley, { x: 205, y: 20, w: 520, h: 520 }, "wesley.avatar"),
    /** Sobre portrait 4:5 (desktop 379×473); removes the watermark at the bottom */
    portrait: crop(images.wesley, { x: 0, y: 0, w: 864, h: 1080 }, "wesley.portrait"),
    /** mobile portrait 4:3 (326×245) */
    portraitMobile: crop(images.wesley, { x: 0, y: 0, w: 864, h: 648 }, "wesley.portrait"),
  },
  orbita: {
    visaoGeral: {
      c: crop(images.orbita.escuroVisaoGeral, ORBITA_C, "orbita.visaoGeral"),
      full: full(images.orbita.escuroVisaoGeral, "orbita.visaoGeral"),
    },
    conexoes: {
      /** stage 01 back / case cover back (1.8 ratio) */
      back: crop(images.orbita.claroConexoes, { x: 605, y: 216, w: 2218, h: 1231 }, "orbita.conexoes"),
      c: crop(images.orbita.claroConexoes, ORBITA_C, "orbita.conexoes"),
      full: full(images.orbita.claroConexoes, "orbita.conexoes"),
    },
    gestao: {
      c: crop(images.orbita.claroGestao, ORBITA_C, "orbita.gestao"),
      full: full(images.orbita.claroGestao, "orbita.gestao"),
    },
    conhecimento: {
      c: crop(images.orbita.escuroConhecimento, ORBITA_C, "orbita.conhecimento"),
      full: full(images.orbita.escuroConhecimento, "orbita.conhecimento"),
    },
    reunioes: {
      c: crop(images.orbita.claroReunioes, ORBITA_C, "orbita.reunioes"),
      full: full(images.orbita.claroReunioes, "orbita.reunioes"),
    },
    memoria: {
      c: crop(images.orbita.claroMemoria, ORBITA_C, "orbita.memoria"),
      full: full(images.orbita.claroMemoria, "orbita.memoria"),
    },
    login: {
      c: crop(images.orbita.escuroLogin, ORBITA_C, "orbita.login"),
      full: full(images.orbita.escuroLogin, "orbita.login"),
    },
    /** phone, full frame (case cover 180×390, case §06 270×584) */
    phone: full(images.orbita.claroCelularVisaoGeral, "orbita.phone"),
  },
  orb: {
    idle: crop(images.orb.idle, ORB_BOX, "orb.idle"),
    thinking: crop(images.orb.thinking, ORB_BOX, "orb.thinking"),
    searching: crop(images.orb.searching, ORB_BOX, "orb.searching"),
    speaking: crop(images.orb.speaking, ORB_BOX, "orb.speaking"),
    success: crop(images.orb.success, ORB_BOX, "orb.success"),
  },
  orbitmind: {
    /** stage 02 back (1.8) — label "v1 · 2025" */
    flowBack: crop(images.orbitmind.flow, { x: 650, y: 0, w: 1640, h: 911 }, "orbitmind.flow", [
      white("76.46%", "62.13%", "2.68%", "5.05%"),
      white("46.59%", "40.18%", "4.76%", "2.63%"),
    ]),
    /** rail peek / mobile back 16:10 */
    flowPeek: crop(images.orbitmind.flow, { x: 650, y: 0, w: 1458, h: 911 }, "orbitmind.flow", [
      white("86.01%", "62.13%", "3.02%", "5.05%"),
      white("52.40%", "40.18%", "5.35%", "2.63%"),
    ]),
    /** stage 02 loupe (rendered 220×276): menu Dashboard…Escritório, no "Plano Free" */
    appNav: crop(images.orbitmind.appNav, { x: 0, y: 76, w: 256, h: 321 }, "orbitmind.appNav"),
  },
  orbitfinance: {
    inicio: crop(images.orbitfinance.inicio, { x: 280, y: 0, w: 1264, h: 790 }, "orbitfinance.inicio"),
    recursoBack: crop(images.orbitfinance.recurso, { x: 480, y: 270, w: 1078, h: 599 }, "orbitfinance.recurso"),
    recurso: crop(images.orbitfinance.recurso, { x: 480, y: 270, w: 958, h: 599 }, "orbitfinance.recurso"),
  },
  vibecoding: {
    editor: crop(images.vibecoding.editor, { x: 70, y: 0, w: 1264, h: 790 }, "vibecoding.editor"),
    geracaoBack: crop(images.vibecoding.geracao, { x: 520, y: 208, w: 1190, h: 661 }, "vibecoding.geracao"),
    geracao: crop(images.vibecoding.geracao, { x: 500, y: 208, w: 1058, h: 661 }, "vibecoding.geracao"),
    demo: crop(images.vibecoding.demo, { x: 971, y: 88, w: 741, h: 463 }, "vibecoding.demo"),
  },
  fsjpii: {
    login: crop(images.fsjpii.login, { x: 560, y: 30, w: 780, h: 487 }, "fsjpii.login"),
  },
  ecommerce: {
    home: crop(images.ecommerce, { x: 280, y: 0, w: 1330, h: 831 }, "ecommerce.home"),
  },
} as const;

/**
 * CSS for the crop formula (finalSpec §4.5):
 * img { width: W/w×100%; left: −x/w×100%; top: −y/h×100%; height:auto; max-width:none }
 * Returned values are strings with 4 decimals, e.g. { width: "125%", left: "-25%", top: "-10.9722%" }.
 */
export function cropStyle(image: ImageAsset, box: CropBox): { width: string; left: string; top: string } {
  const pct = (n: number) => `${Number(n.toFixed(4))}%`;
  return {
    width: pct((image.width / box.w) * 100),
    left: pct((-box.x / box.w) * 100),
    top: pct((-box.y / box.h) * 100),
  };
}
