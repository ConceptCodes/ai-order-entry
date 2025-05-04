import fs from "fs";
import { graph } from "../src/agent/graph";

const test = await graph.getGraphAsync();
const image = await test.drawMermaidPng();
const arrayBuffer = await image.arrayBuffer();

const filepath = "assets/graph.png";

fs.writeFileSync(filepath, Buffer.from(arrayBuffer));
