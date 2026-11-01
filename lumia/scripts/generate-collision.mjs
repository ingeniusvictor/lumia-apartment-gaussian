/**
 * AP-03: lightweight physical proxies for the synthetic Gaussian room.
 * Node.js 20+, no packages, no source-engine changes.
 * Geometry is in PlayCanvas world coordinates (splat content is rotated 180deg around Z).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const target = resolve(root, 'public/lumia-ap03-collision.glb');

const positions = [];
const indices = [];
const shapes = [
    // Name, center XYZ, width/height/depth. Approximate AP-02 demo scene, meters.
    ['floor',          0,    -0.06, -0.90, 6.82, 0.12, 6.14],
    ['left-wall',     -3.40,  1.55, -0.90, 0.12, 3.10, 6.14],
    ['right-wall',     3.40,  1.55, -0.90, 0.12, 3.10, 6.14],
    ['rear-wall',      0,     1.55, -3.98, 6.82, 3.10, 0.12],
    // Deliberately invisible physical barrier at the open presentation-facing edge.
    ['front-barrier',  0,     1.15,  2.16, 6.82, 2.30, 0.10],
    // First-pass furniture proxies. These are not a precision reconstruction.
    ['sofa',           0,     0.43, -2.70, 2.45, 0.86, 0.92],
    ['coffee-table',   0,     0.27, -1.13, 1.62, 0.54, 0.86],
    ['plant',         -2.30,  0.45, -2.91, 0.56, 0.90, 0.56],
    ['lamp',           2.36,  0.56, -2.85, 0.45, 1.12, 0.45]
];

// Write world-coordinate vertices directly. MeshCollision.fromGlb reads mesh buffers
// and does NOT apply a transform hierarchy when extracting collision triangles.
for (const [name, cx, cy, cz, sx, sy, sz] of shapes) {
    if (![cx, cy, cz, sx, sy, sz].every(Number.isFinite) || sx <= 0 || sy <= 0 || sz <= 0) {
        throw new Error('Invalid collision box: ' + name);
    }
    const [hx, hy, hz] = [sx / 2, sy / 2, sz / 2];
    const base = positions.length / 3;
    const verts = [
        [-hx, -hy, -hz], [hx, -hy, -hz], [hx, hy, -hz], [-hx, hy, -hz],
        [-hx, -hy, hz], [hx, -hy, hz], [hx, hy, hz], [-hx, hy, hz]
    ];
    for (const p of verts) positions.push(p[0] + cx, p[1] + cy, p[2] + cz);
    const faces = [
        [0, 2, 1], [0, 3, 2], [4, 5, 6], [4, 6, 7],
        [0, 1, 5], [0, 5, 4], [3, 7, 6], [3, 6, 2],
        [0, 4, 7], [0, 7, 3], [1, 2, 6], [1, 6, 5]
    ];
    for (const face of faces) indices.push(...face.map(i => i + base));
}
const pad4 = n => (n + 3) & ~3;
const posLen = positions.length * 4;
const indexOffset = pad4(posLen);
const indexLen = indices.length * 2;
const binary = Buffer.alloc(pad4(indexOffset + indexLen));
positions.forEach((value, i) => binary.writeFloatLE(value, i * 4));
indices.forEach((value, i) => binary.writeUInt16LE(value, indexOffset + 2 * i));
const axisValues = axis => positions.filter((_, i) => i % 3 === axis);
const gltf = {
    asset: { version: '2.0', generator: 'LUMIA AP-03 mesh collision' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ name: 'AP03-Collision', mesh: 0 }],
    meshes: [{ name: 'Static-Room-Proxies', primitives: [{ attributes: { POSITION: 0 }, indices: 1, mode: 4 }] }],
    buffers: [{ byteLength: binary.length }],
    bufferViews: [
        { buffer: 0, byteOffset: 0, byteLength: posLen, target: 34962 },
        { buffer: 0, byteOffset: indexOffset, byteLength: indexLen, target: 34963 }
    ],
    accessors: [
        {
            bufferView: 0, componentType: 5126, count: positions.length / 3, type: 'VEC3',
            min: [0, 1, 2].map(a => Math.min(...axisValues(a))),
            max: [0, 1, 2].map(a => Math.max(...axisValues(a)))
        },
        { bufferView: 1, componentType: 5123, count: indices.length, type: 'SCALAR' }
    ]
};
const jsonString = JSON.stringify(gltf);
const jsonSize = pad4(Buffer.byteLength(jsonString));
const json = Buffer.alloc(jsonSize, 0x20);
json.write(jsonString, 'utf8');
const glb = Buffer.alloc(12 + 8 + jsonSize + 8 + binary.length);
glb.write('glTF', 0, 'ascii');
glb.writeUInt32LE(2, 4);
glb.writeUInt32LE(glb.length, 8);
glb.writeUInt32LE(jsonSize, 12);
glb.write('JSON', 16, 'ascii');
json.copy(glb, 20);
const binStart = 20 + jsonSize;
glb.writeUInt32LE(binary.length, binStart);
glb.write('BIN\u0000', binStart + 4, 'binary');
binary.copy(glb, binStart + 8);
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, glb);
console.log('[AP-03] Collision mesh: ' + target);
console.log('[AP-03] ' + shapes.length + ' boxes, ' + indices.length / 3 + ' triangles, ' + glb.length + ' bytes');
