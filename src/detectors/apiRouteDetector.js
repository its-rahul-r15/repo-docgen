import fs from "fs";
import path from "path";

/**
 * Recursively scan directories for API route files
 */
function scanForRouteFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (["node_modules", ".git", "dist", "build"].includes(entry.name)) {
        continue;
      }

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scanForRouteFiles(fullPath, files);
      } else if (entry.name.endsWith(".js") || entry.name.endsWith(".ts")) {
        files.push(fullPath);
      }
    }
  } catch (err) {
    // Skip directories we can't read
  }

  return files;
}

/**
 * Extract routes from file content
 */
function extractRoutes(content, filePath) {
  const routes = [];

  // Pattern 1: app.METHOD('path', ...)
  const appPattern = /(?:app|router)\.(get|post|put|delete|patch|head|options|all)\s*\(\s*['\"`](.*?)['\"`]/g;

  // Pattern 2: router.route('path').METHOD(...)
  const routePattern = /(?:app|router)\.route\s*\(\s*['\"`](.*?)['\"`]\s*\)\s*\.\s*(get|post|put|delete|patch)/g;

  let match;

  // Extract from Pattern 1
  while ((match = appPattern.exec(content)) !== null) {
    routes.push({
      method: match[1].toUpperCase(),
      path: match[2],
      file: path.basename(filePath)
    });
  }

  // Extract from Pattern 2
  while ((match = routePattern.exec(content)) !== null) {
    routes.push({
      method: match[2].toUpperCase(),
      path: match[1],
      file: path.basename(filePath)
    });
  }

  return routes;
}

export function detectApiRoutes(rootPath) {
  const routes = [];

  // Directories to scan for API routes
  const scanDirs = [
    rootPath,
    path.join(rootPath, "src"),
    path.join(rootPath, "routes"),
    path.join(rootPath, "api"),
    path.join(rootPath, "src", "routes"),
    path.join(rootPath, "src", "api"),
    path.join(rootPath, "server"),
    path.join(rootPath, "backend"),
    path.join(rootPath, "backend", "routes")
  ];

  const allFiles = [];

  // Scan all potential directories
  for (const dir of scanDirs) {
    scanForRouteFiles(dir, allFiles);
  }

  // Remove duplicates
  const uniqueFiles = [...new Set(allFiles)];

  // Extract routes from each file
  for (const filePath of uniqueFiles) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const fileRoutes = extractRoutes(content, filePath);
      routes.push(...fileRoutes);
    } catch (err) {
      // Skip files we can't read
    }
  }

  // Remove duplicate routes
  const uniqueRoutes = routes.filter((route, index, self) =>
    index === self.findIndex(r => r.method === route.method && r.path === route.path)
  );

  return uniqueRoutes;
}
