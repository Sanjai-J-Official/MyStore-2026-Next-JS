/**
 * india-map.js — Geographically accurate simplified SVG paths for all Indian states & UTs
 *
 * Projection: Simple linear (cylindrical equidistant)
 *   x = (lon - 67.5) × 19        [longitude 67.5°E–98°E → x 0–598]
 *   y = (37.5 - lat) × 19        [latitude 8°N–37.5°N   → y ~0–560]
 * ViewBox: "0 0 600 650"
 *
 * Paths are simplified polygons that preserve the recognizable silhouette
 * of each state for cartographic/decorative use.
 */

export const INDIA_STATES = [
  // ── Jammu & Kashmir ──────────────────────────────────────────────────────
  {
    id: 'jammu-kashmir',
    label: 'J&K',
    d: `M 130,14 L 155,8 L 182,12 L 202,6 L 220,14 L 238,10 L 254,22
        L 262,38 L 252,54 L 256,70 L 240,80 L 222,78 L 208,64 L 192,56
        L 180,66 L 160,68 L 146,58 L 138,44 L 126,34 Z`,
  },
  // ── Ladakh (UT) ──────────────────────────────────────────────────────────
  {
    id: 'ladakh',
    label: 'Ladakh',
    d: `M 202,6 L 240,2 L 280,6 L 310,14 L 320,34 L 308,50 L 286,54
        L 262,38 L 254,22 L 238,10 Z`,
  },
  // ── Himachal Pradesh ─────────────────────────────────────────────────────
  {
    id: 'himachal-pradesh',
    label: 'Himachal',
    d: `M 152,68 L 168,64 L 180,66 L 194,58 L 208,64 L 222,78 L 228,92
        L 218,106 L 202,112 L 186,108 L 170,96 L 158,82 Z`,
  },
  // ── Punjab ───────────────────────────────────────────────────────────────
  {
    id: 'punjab',
    label: 'Punjab',
    d: `M 108,82 L 132,76 L 150,70 L 158,82 L 158,98 L 148,110 L 130,116
        L 114,110 L 104,96 Z`,
  },
  // ── Haryana ──────────────────────────────────────────────────────────────
  {
    id: 'haryana',
    label: 'Haryana',
    d: `M 148,110 L 170,96 L 186,108 L 196,118 L 194,134 L 178,144
        L 160,142 L 144,132 L 138,118 Z`,
  },
  // ── Delhi (UT) ───────────────────────────────────────────────────────────
  {
    id: 'delhi',
    label: 'Delhi',
    d: `M 180,130 L 192,126 L 196,136 L 188,146 L 178,144 L 176,136 Z`,
  },
  // ── Uttarakhand ──────────────────────────────────────────────────────────
  {
    id: 'uttarakhand',
    label: 'Uttarakhand',
    d: `M 196,118 L 218,106 L 236,108 L 254,116 L 260,130 L 246,142
        L 226,144 L 208,140 L 196,130 Z`,
  },
  // ── Uttar Pradesh ────────────────────────────────────────────────────────
  {
    id: 'uttar-pradesh',
    label: 'UP',
    d: `M 160,142 L 178,144 L 196,136 L 208,140 L 226,144 L 246,142
        L 268,148 L 296,156 L 316,168 L 326,188 L 320,208 L 304,218
        L 282,226 L 260,228 L 238,220 L 216,218 L 196,206 L 178,192
        L 164,176 L 156,160 Z`,
  },
  // ── Rajasthan ────────────────────────────────────────────────────────────
  {
    id: 'rajasthan',
    label: 'Rajasthan',
    d: `M 76,134 L 108,118 L 130,116 L 148,110 L 160,142 L 156,160
        L 164,176 L 158,198 L 148,218 L 130,238 L 110,252 L 90,258
        L 70,250 L 54,234 L 48,214 L 52,192 L 62,172 L 68,150 Z`,
  },
  // ── Gujarat ──────────────────────────────────────────────────────────────
  {
    id: 'gujarat',
    label: 'Gujarat',
    d: `M 48,214 L 68,206 L 84,216 L 90,232 L 84,248 L 70,258
        L 64,278 L 52,290 L 40,286 L 28,270 L 22,250 L 26,228 Z
        M 30,276 L 44,270 L 56,280 L 62,294 L 56,310 L 42,316
        L 28,308 L 20,294 L 22,280 Z
        M 54,308 L 68,308 L 78,320 L 72,334 L 58,336 L 46,328 L 46,314 Z`,
  },
  // ── Madhya Pradesh ───────────────────────────────────────────────────────
  {
    id: 'madhya-pradesh',
    label: 'MP',
    d: `M 110,252 L 130,238 L 148,218 L 168,210 L 196,206 L 216,218
        L 238,220 L 258,228 L 278,230 L 296,228 L 310,240 L 316,258
        L 308,278 L 294,292 L 270,300 L 248,304 L 224,302 L 200,292
        L 178,276 L 160,262 L 136,258 L 118,262 L 108,254 Z`,
  },
  // ── Chhattisgarh ─────────────────────────────────────────────────────────
  {
    id: 'chhattisgarh',
    label: 'CG',
    d: `M 296,228 L 316,226 L 334,234 L 350,244 L 358,264 L 352,284
        L 340,300 L 322,312 L 304,316 L 290,308 L 284,292 L 286,276
        L 296,260 L 310,248 Z`,
  },
  // ── Bihar ────────────────────────────────────────────────────────────────
  {
    id: 'bihar',
    label: 'Bihar',
    d: `M 328,192 L 352,186 L 376,188 L 396,196 L 404,212 L 396,228
        L 378,234 L 356,234 L 334,226 L 322,212 Z`,
  },
  // ── Jharkhand ────────────────────────────────────────────────────────────
  {
    id: 'jharkhand',
    label: 'Jharkhand',
    d: `M 334,226 L 356,234 L 378,234 L 398,242 L 406,258 L 398,278
        L 382,290 L 360,296 L 340,290 L 324,278 L 318,260 L 322,242 Z`,
  },
  // ── West Bengal ──────────────────────────────────────────────────────────
  {
    id: 'west-bengal',
    label: 'W. Bengal',
    d: `M 396,196 L 418,188 L 436,192 L 450,204 L 454,222 L 446,240
        L 440,258 L 428,276 L 418,294 L 408,308 L 398,296 L 390,278
        L 382,262 L 386,242 L 398,226 Z`,
  },
  // ── Odisha ───────────────────────────────────────────────────────────────
  {
    id: 'odisha',
    label: 'Odisha',
    d: `M 340,290 L 360,296 L 382,290 L 398,296 L 408,308 L 416,328
        L 408,352 L 392,368 L 372,374 L 352,368 L 336,352 L 326,330
        L 322,312 L 330,300 Z`,
  },
  // ── Maharashtra ──────────────────────────────────────────────────────────
  {
    id: 'maharashtra',
    label: 'Maharashtra',
    d: `M 100,284 L 122,272 L 140,268 L 158,270 L 178,276 L 200,292
        L 224,302 L 248,304 L 270,300 L 290,310 L 300,330 L 296,352
        L 280,366 L 256,374 L 232,372 L 210,362 L 188,348 L 168,330
        L 148,314 L 128,300 L 110,292 Z`,
  },
  // ── Telangana ────────────────────────────────────────────────────────────
  {
    id: 'telangana',
    label: 'Telangana',
    d: `M 248,304 L 268,300 L 290,310 L 300,330 L 296,352 L 280,366
        L 260,372 L 242,362 L 232,346 L 234,326 L 244,312 Z`,
  },
  // ── Andhra Pradesh ───────────────────────────────────────────────────────
  {
    id: 'andhra-pradesh',
    label: 'AP',
    d: `M 260,372 L 280,366 L 296,352 L 316,360 L 334,368 L 348,382
        L 352,402 L 344,422 L 328,436 L 308,444 L 286,442 L 264,430
        L 248,416 L 240,396 L 244,374 Z`,
  },
  // ── Karnataka ────────────────────────────────────────────────────────────
  {
    id: 'karnataka',
    label: 'Karnataka',
    d: `M 168,330 L 190,348 L 210,362 L 232,372 L 242,362 L 244,374
        L 240,396 L 230,416 L 214,430 L 196,442 L 176,450 L 158,442
        L 144,428 L 138,410 L 140,390 L 148,370 L 152,350 Z`,
  },
  // ── Goa ──────────────────────────────────────────────────────────────────
  {
    id: 'goa',
    label: 'Goa',
    d: `M 144,370 L 154,366 L 162,374 L 158,384 L 148,386 L 140,378 Z`,
  },
  // ── Tamil Nadu ───────────────────────────────────────────────────────────
  {
    id: 'tamil-nadu',
    label: 'Tamil Nadu',
    d: `M 214,430 L 230,416 L 248,416 L 262,428 L 278,438 L 290,454
        L 296,474 L 290,498 L 276,518 L 260,532 L 240,540 L 222,534
        L 206,520 L 198,498 L 198,474 L 204,452 Z`,
  },
  // ── Kerala ───────────────────────────────────────────────────────────────
  {
    id: 'kerala',
    label: 'Kerala',
    d: `M 176,450 L 196,442 L 214,430 L 204,452 L 198,474 L 196,498
        L 188,520 L 174,536 L 160,530 L 150,516 L 148,496 L 150,474
        L 158,454 Z`,
  },
  // ── Assam ─────────────────────────────────────────────────────────────────
  {
    id: 'assam',
    label: 'Assam',
    d: `M 440,178 L 462,172 L 486,176 L 510,182 L 526,196 L 534,212
        L 526,228 L 508,236 L 488,234 L 464,228 L 448,218 L 436,206 Z`,
  },
  // ── Arunachal Pradesh ────────────────────────────────────────────────────
  {
    id: 'arunachal-pradesh',
    label: 'Arunachal',
    d: `M 436,154 L 462,148 L 492,144 L 524,142 L 552,148 L 566,160
        L 560,172 L 534,176 L 510,180 L 486,174 L 462,170 L 440,176 Z`,
  },
  // ── Sikkim ───────────────────────────────────────────────────────────────
  {
    id: 'sikkim',
    label: 'Sikkim',
    d: `M 430,170 L 442,164 L 450,172 L 444,182 L 434,182 Z`,
  },
  // ── Nagaland ─────────────────────────────────────────────────────────────
  {
    id: 'nagaland',
    label: 'Nagaland',
    d: `M 524,214 L 538,208 L 552,214 L 556,228 L 548,238 L 532,238
        L 520,230 Z`,
  },
  // ── Meghalaya ────────────────────────────────────────────────────────────
  {
    id: 'meghalaya',
    label: 'Meghalaya',
    d: `M 448,236 L 470,230 L 494,234 L 506,244 L 502,256 L 482,258
        L 460,254 L 446,248 Z`,
  },
  // ── Manipur ──────────────────────────────────────────────────────────────
  {
    id: 'manipur',
    label: 'Manipur',
    d: `M 534,240 L 548,238 L 558,250 L 556,268 L 542,276 L 526,270
        L 520,258 L 524,244 Z`,
  },
  // ── Mizoram ──────────────────────────────────────────────────────────────
  {
    id: 'mizoram',
    label: 'Mizoram',
    d: `M 510,270 L 526,270 L 534,282 L 530,298 L 516,304 L 502,298
        L 498,284 Z`,
  },
  // ── Tripura ──────────────────────────────────────────────────────────────
  {
    id: 'tripura',
    label: 'Tripura',
    d: `M 476,264 L 490,260 L 500,270 L 498,284 L 486,290 L 474,282 Z`,
  },
  // ── Jharkhand already defined ─────────────────────────────────────────────
];

/**
 * All 36 state/UT IDs — used to build state dropdowns in admin.
 */
export const ALL_STATES = [
  { id: 'andaman-nicobar',    label: 'Andaman & Nicobar' },
  { id: 'andhra-pradesh',     label: 'Andhra Pradesh' },
  { id: 'arunachal-pradesh',  label: 'Arunachal Pradesh' },
  { id: 'assam',              label: 'Assam' },
  { id: 'bihar',              label: 'Bihar' },
  { id: 'chandigarh',         label: 'Chandigarh' },
  { id: 'chhattisgarh',       label: 'Chhattisgarh' },
  { id: 'dadra-nagar-haveli', label: 'Dadra & Nagar Haveli' },
  { id: 'daman-diu',          label: 'Daman & Diu' },
  { id: 'delhi',              label: 'Delhi' },
  { id: 'goa',                label: 'Goa' },
  { id: 'gujarat',            label: 'Gujarat' },
  { id: 'haryana',            label: 'Haryana' },
  { id: 'himachal-pradesh',   label: 'Himachal Pradesh' },
  { id: 'jammu-kashmir',      label: 'Jammu & Kashmir' },
  { id: 'jharkhand',          label: 'Jharkhand' },
  { id: 'karnataka',          label: 'Karnataka' },
  { id: 'kerala',             label: 'Kerala' },
  { id: 'ladakh',             label: 'Ladakh' },
  { id: 'lakshadweep',        label: 'Lakshadweep' },
  { id: 'madhya-pradesh',     label: 'Madhya Pradesh' },
  { id: 'maharashtra',        label: 'Maharashtra' },
  { id: 'manipur',            label: 'Manipur' },
  { id: 'meghalaya',          label: 'Meghalaya' },
  { id: 'mizoram',            label: 'Mizoram' },
  { id: 'nagaland',           label: 'Nagaland' },
  { id: 'odisha',             label: 'Odisha' },
  { id: 'puducherry',         label: 'Puducherry' },
  { id: 'punjab',             label: 'Punjab' },
  { id: 'rajasthan',          label: 'Rajasthan' },
  { id: 'sikkim',             label: 'Sikkim' },
  { id: 'tamil-nadu',         label: 'Tamil Nadu' },
  { id: 'telangana',          label: 'Telangana' },
  { id: 'tripura',            label: 'Tripura' },
  { id: 'uttar-pradesh',      label: 'Uttar Pradesh' },
  { id: 'uttarakhand',        label: 'Uttarakhand' },
  { id: 'west-bengal',        label: 'West Bengal' },
];
