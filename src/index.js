import path from "path";
import fs from "fs";

import { scanProject } from "./analyzer/scanProject.js";
import { analyzeProject } from "./analyzer/analyzeProject.js";

import { detectFrontend } from "./detectors/frontendDetector.js";
import { detectBackend } from "./detectors/backendDetector.js";
import { detectArchitecture } from "./detectors/architectureDetector.js";
import { detectApiRoutes } from "./detectors/apiRouteDetector.js";

import { generateReadme } from "./generators/readmeGenerator.js";
import { generateStructureDoc } from "./generators/structureDoc.js";
import { generateApiDoc } from "./generators/apiDoc.js";

export async function run(options = {}) {
  const projectPath = process.cwd();
  const outputDir = options.output ? path.join(projectPath, options.output) : projectPath;

  // Check if files already exist (only if not overwriting)
  if (!options.overwrite) {
    const readmePath = path.join(outputDir, "README.md");
    if (fs.existsSync(readmePath)) {
      console.log("⚠️  Documentation files already exist. Use --overwrite to regenerate.");
      return;
    }
  }

  // Create output directory only if it's not the root
  if (options.output && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const scanResult = await scanProject(projectPath);
  const projectFacts = analyzeProject(scanResult);

  const frontend = detectFrontend(projectFacts);
  const backend = detectBackend(projectFacts);
  const architecture = detectArchitecture({ frontend, backend });
  const apiRoutes = detectApiRoutes(projectPath);

  const finalModel = {
    ...projectFacts,
    frontend,
    backend,
    architecture,
    apiRoutes
  };

  generateReadme(finalModel, outputDir);
  generateStructureDoc(finalModel, outputDir);
  generateApiDoc(apiRoutes, outputDir);

  console.log("\n✅ Documentation generated successfully!");
  console.log("\n📄 Generated files:");
  const displayPath = options.output || ".";
  console.log(`   → ${displayPath}/README.md`);
  console.log(`   → ${displayPath}/STRUCTURE.md`);
  if (apiRoutes && apiRoutes.length > 0) {
    console.log(`   → ${displayPath}/API.md`);
  }
  console.log("");
}
