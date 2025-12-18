import fs from "fs";
import path from "path";

/**
 * Recursively build a tree structure for a directory
 */
function buildTree(dirPath, prefix = "", isLast = true, maxDepth = 3, currentDepth = 0) {
  if (currentDepth >= maxDepth) return "";

  let tree = "";

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    // Filter out node_modules, .git, and hidden files
    const filtered = entries.filter(
      entry => !["node_modules", ".git", "dist", "build"].includes(entry.name) && !entry.name.startsWith(".")
    );

    filtered.forEach((entry, index) => {
      const isLastEntry = index === filtered.length - 1;
      const connector = isLastEntry ? "└── " : "├── ";
      const icon = entry.isDirectory() ? "📁" : "📄";

      tree += `${prefix}${connector}${icon} ${entry.name}\n`;

      if (entry.isDirectory()) {
        const newPrefix = prefix + (isLastEntry ? "    " : "│   ");
        const subPath = path.join(dirPath, entry.name);
        tree += buildTree(subPath, newPrefix, isLastEntry, maxDepth, currentDepth + 1);
      }
    });
  } catch (err) {
    // Skip directories we can't read
  }

  return tree;
}

/**
 * Get file extension statistics
 */
function getFileStats(dirPath) {
  const stats = {};

  function scanDir(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      entries.forEach(entry => {
        if (["node_modules", ".git", "dist", "build"].includes(entry.name) || entry.name.startsWith(".")) {
          return;
        }

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else {
          const ext = path.extname(entry.name) || "no extension";
          stats[ext] = (stats[ext] || 0) + 1;
        }
      });
    } catch (err) {
      // Skip
    }
  }

  scanDir(dirPath);
  return stats;
}

export function generateStructureDoc(projectFacts, outputDir) {
  const rootPath = projectFacts.structure?.rootPath || process.cwd();

  let content = `<div align="center">

# 📁 Project Structure

> **Automatically generated directory tree and file organization**

</div>

---

## 🌳 Directory Tree

\`\`\`
📦 ${path.basename(rootPath)}
${buildTree(rootPath, "", true, 4, 0)}
\`\`\`

---

## 📊 File Statistics

`;

  // Get file stats
  const fileStats = getFileStats(rootPath);
  const totalFiles = Object.values(fileStats).reduce((a, b) => a + b, 0);

  content += `**Total Files:** ${totalFiles}\n\n`;

  if (Object.keys(fileStats).length > 0) {
    content += `| File Type | Count |\n`;
    content += `|-----------|-------|\n`;

    // Sort by count descending
    const sorted = Object.entries(fileStats).sort((a, b) => b[1] - a[1]);
    sorted.forEach(([ext, count]) => {
      const displayExt = ext === "no extension" ? "No extension" : ext;
      content += `| \`${displayExt}\` | ${count} |\n`;
    });
  }

  content += `\n---

## 📂 Key Directories

`;

  // Add descriptions for common folders
  const folderDescriptions = {
    "src": "Source code and application logic",
    "public": "Static assets and public files",
    "components": "Reusable UI components",
    "pages": "Application pages/routes",
    "utils": "Utility functions and helpers",
    "api": "API routes and endpoints",
    "lib": "Library code and external integrations",
    "config": "Configuration files",
    "tests": "Test files and test utilities",
    "docs": "Documentation files",
    "scripts": "Build and utility scripts",
    "assets": "Images, fonts, and other assets",
    "styles": "CSS and styling files",
    "hooks": "Custom React hooks",
    "context": "React context providers",
    "services": "API services and data fetching",
    "models": "Data models and schemas",
    "controllers": "Route controllers",
    "middleware": "Express middleware",
    "routes": "API route definitions",
    "database": "Database configuration and migrations"
  };

  const folders = projectFacts.structure.folders || [];

  if (folders.length > 0) {
    folders.forEach(folder => {
      const description = folderDescriptions[folder] || "Project directory";
      content += `### 📁 \`${folder}/\`\n${description}\n\n`;
    });
  } else {
    content += "_No major directories detected_\n\n";
  }

  content += `---

## 📄 Root Files

`;

  const files = projectFacts.structure.files || [];

  if (files.length > 0) {
    const fileDescriptions = {
      "package.json": "📦 Node.js package configuration and dependencies",
      "package-lock.json": "🔒 Locked versions of dependencies",
      "tsconfig.json": "⚙️ TypeScript configuration",
      "vite.config.js": "⚡ Vite bundler configuration",
      "webpack.config.js": "📦 Webpack bundler configuration",
      ".gitignore": "🚫 Git ignore rules",
      "README.md": "📖 Project documentation",
      ".env": "🔐 Environment variables",
      ".eslintrc": "✅ ESLint configuration",
      ".prettierrc": "💅 Prettier configuration",
      "docker-compose.yml": "🐳 Docker compose configuration",
      "Dockerfile": "🐳 Docker container configuration"
    };

    files.forEach(file => {
      const description = fileDescriptions[file] || "📄 Project file";
      content += `- **\`${file}\`** - ${description}\n`;
    });
  } else {
    content += "_No root files detected_\n";
  }

  content += `\n---

<div align="center">

**Generated by [repo-docgen](https://www.npmjs.com/package/repo-docgen)** 🚀

</div>
`;

  fs.writeFileSync(path.join(outputDir, "STRUCTURE.md"), content);
}

