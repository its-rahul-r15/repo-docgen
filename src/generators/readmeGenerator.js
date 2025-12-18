import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateSetupInstructions } from "./setupGenerator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function generateReadme(projectFacts, outputDir) {
  const templatePath = path.join(
    __dirname,
    "..",
    "templates",
    "readme.md"
  );

  const template = fs.readFileSync(templatePath, "utf-8");

  // Badges
  const badges = [
    projectFacts.frontend.framework && `![Frontend](https://img.shields.io/badge/Frontend-${projectFacts.frontend.framework}-blue)`,
    projectFacts.backend.framework && `![Backend](https://img.shields.io/badge/Backend-${projectFacts.backend.framework}-green)`,
    projectFacts.architecture && `![Architecture](https://img.shields.io/badge/Type-${projectFacts.architecture.replace(/ /g, "_")}-purple)`
  ]
    .filter(Boolean)
    .join(" ");

  // Frontend stack
  const frontendStack =
    projectFacts.frontend.framework || projectFacts.frontend.bundler
      ? [
        projectFacts.frontend.framework,
        projectFacts.frontend.bundler
      ]
        .filter(Boolean)
        .map(t => `- ${t}`)
        .join("\n")
      : "_Not detected_";

  // Backend stack
  const backendStack =
    projectFacts.backend.runtime || projectFacts.backend.framework
      ? [
        projectFacts.backend.runtime,
        projectFacts.backend.framework
      ]
        .filter(Boolean)
        .map(t => `- ${t}`)
        .join("\n")
      : "_Not detected_";

  // Scripts
  const scripts =
    Object.keys(projectFacts.scripts).length > 0
      ? Object.entries(projectFacts.scripts)
        .map(([key, value]) => `- \`${key}\` → \`${value}\``)
        .join("\n")
      : "_No scripts defined_";

  // Structure
  const folders =
    projectFacts.structure.folders.length > 0
      ? projectFacts.structure.folders.map(f => `- 📁 ${f}`).join("\n")
      : "_No folders detected_";

  const files =
    projectFacts.structure.files.length > 0
      ? projectFacts.structure.files.map(f => `- 📄 ${f}`).join("\n")
      : "_No files detected_";

  // Setup
  const setup = generateSetupInstructions(projectFacts);

  const content = template
    .replace("{{projectName}}", projectFacts.metadata.name)
    .replace("{{description}}", projectFacts.metadata.description)
    .replace("{{badges}}", badges || "")
    .replace("{{architecture}}", projectFacts.architecture || "Not detected")
    .replace("{{frontendStack}}", frontendStack)
    .replace("{{backendStack}}", backendStack)
    .replace("{{setup}}", setup)
    .replace("{{folders}}", folders)
    .replace("{{files}}", files)
    .replace("{{scripts}}", scripts)
    .replace("{{license}}", projectFacts.metadata.license)
    .replace("{{author}}", projectFacts.metadata.author);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  fs.writeFileSync(path.join(outputDir, "README.md"), content);
}
