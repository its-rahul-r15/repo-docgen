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

  // Enhanced Badges
  const badges = generateBadges(projectFacts);

  // Tagline
  const tagline = generateTagline(projectFacts);

  // Project Description
  const projectDescription = generateProjectDescription(projectFacts);

  // Features
  const { feature1Title, feature1Description, feature2Title, feature2Description, feature3Title, feature3Description } = generateFeatures(projectFacts);

  // Features List
  const featuresList = generateFeaturesList(projectFacts);

  // Tech Stack Table
  const techStackTable = generateTechStackTable(projectFacts);

  // Commands
  const installCommand = generateInstallCommand(projectFacts);
  const runCommand = generateRunCommand(projectFacts);
  const buildCommand = generateBuildCommand(projectFacts);

  // Usage
  const usageExample = generateUsageExample(projectFacts);
  const advancedUsage = generateAdvancedUsage(projectFacts);

  // Project Structure
  const projectStructure = generateProjectStructure(projectFacts);
  const directoryDescriptions = generateDirectoryDescriptions(projectFacts);

  // Scripts Table
  const scriptsTable = generateScriptsTable(projectFacts);

  // Architecture
  const architectureDescription = generateArchitectureDescription(projectFacts);
  const workflowDescription = generateWorkflowDescription(projectFacts);

  // Repository URL
  const repositoryUrl = generateRepositoryUrl(projectFacts);

  // Project Stats
  const projectStats = generateProjectStats(projectFacts);

  // Author Links
  const authorLinks = generateAuthorLinks(projectFacts);

  // Social Badges
  const socialBadges = generateSocialBadges(projectFacts);

  // Project Anchor
  const projectAnchor = projectFacts.metadata.name.toLowerCase().replace(/\s+/g, '-');

  const content = template
    .replace(/{{projectName}}/g, projectFacts.metadata.name)
    .replace(/{{description}}/g, projectFacts.metadata.description)
    .replace(/{{tagline}}/g, tagline)
    .replace(/{{badges}}/g, badges)
    .replace(/{{projectDescription}}/g, projectDescription)
    .replace(/{{feature1Title}}/g, feature1Title)
    .replace(/{{feature1Description}}/g, feature1Description)
    .replace(/{{feature2Title}}/g, feature2Title)
    .replace(/{{feature2Description}}/g, feature2Description)
    .replace(/{{feature3Title}}/g, feature3Title)
    .replace(/{{feature3Description}}/g, feature3Description)
    .replace(/{{featuresList}}/g, featuresList)
    .replace(/{{techStackTable}}/g, techStackTable)
    .replace(/{{installCommand}}/g, installCommand)
    .replace(/{{runCommand}}/g, runCommand)
    .replace(/{{buildCommand}}/g, buildCommand)
    .replace(/{{usageExample}}/g, usageExample)
    .replace(/{{advancedUsage}}/g, advancedUsage)
    .replace(/{{projectStructure}}/g, projectStructure)
    .replace(/{{directoryDescriptions}}/g, directoryDescriptions)
    .replace(/{{scriptsTable}}/g, scriptsTable)
    .replace(/{{architecture}}/g, projectFacts.architecture || "Not detected")
    .replace(/{{architectureDescription}}/g, architectureDescription)
    .replace(/{{workflowDescription}}/g, workflowDescription)
    .replace(/{{repositoryUrl}}/g, repositoryUrl)
    .replace(/{{projectStats}}/g, projectStats)
    .replace(/{{license}}/g, projectFacts.metadata.license)
    .replace(/{{author}}/g, projectFacts.metadata.author)
    .replace(/{{authorLinks}}/g, authorLinks)
    .replace(/{{socialBadges}}/g, socialBadges)
    .replace(/{{projectAnchor}}/g, projectAnchor);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  fs.writeFileSync(path.join(outputDir, "README.md"), content);
}

// Helper Functions

function generateBadges(projectFacts) {
  const badges = [];

  if (projectFacts.metadata.version) {
    badges.push(`![Version](https://img.shields.io/badge/version-${projectFacts.metadata.version}-blue?style=for-the-badge)`);
  }

  if (projectFacts.metadata.license) {
    badges.push(`![License](https://img.shields.io/badge/license-${projectFacts.metadata.license}-orange?style=for-the-badge)`);
  }

  if (projectFacts.frontend.framework) {
    badges.push(`![${projectFacts.frontend.framework}](https://img.shields.io/badge/${projectFacts.frontend.framework}-blue?style=for-the-badge&logo=${projectFacts.frontend.framework.toLowerCase()}&logoColor=white)`);
  }

  if (projectFacts.backend.framework) {
    badges.push(`![${projectFacts.backend.framework}](https://img.shields.io/badge/${projectFacts.backend.framework}-green?style=for-the-badge&logo=${projectFacts.backend.framework.toLowerCase()}&logoColor=white)`);
  }

  badges.push(`![Node](https://img.shields.io/badge/Node.js-≥18.0.0-339933?style=for-the-badge&logo=node.js&logoColor=white)`);

  return badges.join('\n');
}

function generateTagline(projectFacts) {
  const arch = projectFacts.architecture;
  if (arch === "Full-stack") {
    return "A modern full-stack application built with cutting-edge technologies";
  } else if (arch === "Frontend-only") {
    return "A beautiful, responsive frontend application";
  } else if (arch === "Backend-only") {
    return "A robust and scalable backend API";
  }
  return "A modern web application";
}

function generateProjectDescription(projectFacts) {
  const desc = projectFacts.metadata.description || "This project";
  const arch = projectFacts.architecture || "application";
  return `**${projectFacts.metadata.name}** is a ${arch.toLowerCase()} that ${desc.toLowerCase()}. Built with modern technologies and best practices, it provides a solid foundation for development.`;
}

function generateFeatures(projectFacts) {
  const arch = projectFacts.architecture;

  if (arch === "Full-stack") {
    return {
      feature1Title: "Full-Stack Power",
      feature1Description: "Complete frontend and backend integration",
      feature2Title: "Modern Tech",
      feature2Description: "Built with latest frameworks and tools",
      feature3Title: "Production Ready",
      feature3Description: "Optimized for deployment"
    };
  } else if (arch === "Frontend-only") {
    return {
      feature1Title: "Responsive Design",
      feature1Description: "Works on all devices seamlessly",
      feature2Title: "Fast Performance",
      feature2Description: "Optimized for speed",
      feature3Title: "Modern UI",
      feature3Description: "Beautiful user interface"
    };
  } else if (arch === "Backend-only") {
    return {
      feature1Title: "RESTful API",
      feature1Description: "Clean and well-documented endpoints",
      feature2Title: "Scalable",
      feature2Description: "Built to handle growth",
      feature3Title: "Secure",
      feature3Description: "Industry-standard security practices"
    };
  }

  return {
    feature1Title: "Modern Stack",
    feature1Description: "Built with latest technologies",
    feature2Title: "Well Structured",
    feature2Description: "Clean and organized codebase",
    feature3Title: "Easy to Use",
    feature3Description: "Simple setup and deployment"
  };
}

function generateFeaturesList(projectFacts) {
  const features = [
    "- 🎯 **Modern Architecture** - Built with industry-standard tools and frameworks",
    "- 📦 **Well-Structured** - Clean and organized codebase",
    "- 🚀 **Production Ready** - Optimized for deployment",
    "- 🛠️ **Developer Friendly** - Easy to set up and contribute"
  ];

  if (projectFacts.frontend.framework) {
    features.push(`- ⚛️ **${projectFacts.frontend.framework}** - Modern frontend framework`);
  }

  if (projectFacts.backend.framework) {
    features.push(`- 🔧 **${projectFacts.backend.framework}** - Powerful backend framework`);
  }

  return features.join('\n');
}

function generateTechStackTable(projectFacts) {
  const rows = [];

  if (projectFacts.frontend.framework || projectFacts.frontend.bundler) {
    const techs = [projectFacts.frontend.framework, projectFacts.frontend.bundler].filter(Boolean).join(', ');
    rows.push(`<tr><td>🎨 <strong>Frontend</strong></td><td>${techs}</td></tr>`);
  }

  if (projectFacts.backend.framework || projectFacts.backend.runtime) {
    const techs = [projectFacts.backend.framework, projectFacts.backend.runtime].filter(Boolean).join(', ');
    rows.push(`<tr><td>⚙️ <strong>Backend</strong></td><td>${techs}</td></tr>`);
  }

  if (projectFacts.database) {
    rows.push(`<tr><td>🗄️ <strong>Database</strong></td><td>${projectFacts.database}</td></tr>`);
  }

  if (Object.keys(projectFacts.devDependencies).length > 0) {
    const devTools = Object.keys(projectFacts.devDependencies).slice(0, 5).join(', ');
    rows.push(`<tr><td>🛠️ <strong>Dev Tools</strong></td><td>${devTools}</td></tr>`);
  }

  return rows.length > 0 ? rows.join('\n') : '<tr><td colspan="2">No technologies detected</td></tr>';
}

function generateInstallCommand(projectFacts) {
  return "npm install";
}

function generateRunCommand(projectFacts) {
  if (projectFacts.scripts.dev) return "npm run dev";
  if (projectFacts.scripts.start) return "npm start";
  return "npm run dev";
}

function generateBuildCommand(projectFacts) {
  if (projectFacts.scripts.build) return "npm run build";
  return "npm run build";
}

function generateUsageExample(projectFacts) {
  return generateRunCommand(projectFacts);
}

function generateAdvancedUsage(projectFacts) {
  return "See the documentation for advanced configuration options.";
}

function generateProjectStructure(projectFacts) {
  const structure = [`${projectFacts.metadata.name}/`];

  projectFacts.structure.folders.slice(0, 10).forEach(folder => {
    structure.push(`├── 📂 ${folder}/`);
  });

  projectFacts.structure.files.slice(0, 5).forEach(file => {
    structure.push(`├── 📄 ${file}`);
  });

  return structure.join('\n');
}

function generateDirectoryDescriptions(projectFacts) {
  const descriptions = [];

  const commonDirs = {
    'src': '📂 **src/** - Source code directory',
    'public': '📂 **public/** - Static assets',
    'components': '📂 **components/** - Reusable components',
    'pages': '📂 **pages/** - Application pages',
    'api': '📂 **api/** - API routes',
    'utils': '📂 **utils/** - Utility functions',
    'lib': '📂 **lib/** - Library code',
    'config': '📂 **config/** - Configuration files'
  };

  projectFacts.structure.folders.forEach(folder => {
    const folderName = folder.split('/').pop();
    if (commonDirs[folderName]) {
      descriptions.push(commonDirs[folderName]);
    }
  });

  return descriptions.length > 0 ? descriptions.join('\n') : 'No key directories detected';
}

function generateScriptsTable(projectFacts) {
  if (Object.keys(projectFacts.scripts).length === 0) {
    return "No scripts defined in package.json";
  }

  const rows = Object.entries(projectFacts.scripts).map(([key, value]) => {
    return `| \`npm run ${key}\` | ${value} |`;
  });

  return `| Command | Description |\n|---------|-------------|\n${rows.join('\n')}`;
}

function generateArchitectureDescription(projectFacts) {
  const arch = projectFacts.architecture;

  if (arch === "Full-stack") {
    return "This is a full-stack application with both frontend and backend components working together seamlessly.";
  } else if (arch === "Frontend-only") {
    return "This is a frontend application focused on delivering an excellent user experience.";
  } else if (arch === "Backend-only") {
    return "This is a backend API application providing robust server-side functionality.";
  }

  return "This project follows modern architectural patterns.";
}

function generateWorkflowDescription(projectFacts) {
  return "1. User interacts with the application\n2. Requests are processed\n3. Data is returned and displayed";
}

function generateRepositoryUrl(projectFacts) {
  return "https://github.com/yourusername/your-repo";
}

function generateProjectStats(projectFacts) {
  const stats = [];

  const depCount = Object.keys(projectFacts.dependencies).length;
  const devDepCount = Object.keys(projectFacts.devDependencies).length;

  stats.push(`**Dependencies:** ${depCount}`);
  stats.push(`**Dev Dependencies:** ${devDepCount}`);
  stats.push(`**Architecture:** ${projectFacts.architecture}`);

  return stats.join(' | ');
}

function generateAuthorLinks(projectFacts) {
  return ""; // Can be enhanced with actual author social links
}

function generateSocialBadges(projectFacts) {
  return ""; // Can be enhanced with GitHub stars, forks, etc.
}
