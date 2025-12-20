import fs from "fs";
import path from "path";


function findAllPackages(dir, packages = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (
      entry.name === "node_modules" ||
      entry.name === ".git" ||
      entry.name.startsWith(".")
    ) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const pkgPath = path.join(fullPath, "package.json");

      if (fs.existsSync(pkgPath)) {
        const raw = fs.readFileSync(pkgPath, "utf-8");
        const pkg = JSON.parse(raw);

        packages.push({
          name: pkg.name || entry.name,
          path: fullPath,
          packageJson: pkg
        });
      }

      // Recurse deeper
      findAllPackages(fullPath, packages);
    }
  }

  return packages;
}

export async function scanProject(rootPath) {
  const result = {
    rootPath,
    hasPackageJson: false,
    packageJson: null,
    folders: [],
    files: [],
    subProjects: []
  };

  // ---- Root package.json ----
  const rootPkgPath = path.join(rootPath, "package.json");
  if (fs.existsSync(rootPkgPath)) {
    result.hasPackageJson = true;
    result.packageJson = JSON.parse(fs.readFileSync(rootPkgPath, "utf-8"));
  }

  // ---- Root folder structure ----
  const entries = fs.readdirSync(rootPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!["node_modules", ".git"].includes(entry.name)) {
        result.folders.push(entry.name);
      }
    } else {
      result.files.push(entry.name);
    }
  }

  // ---- Recursive sub-project scan ----
  result.subProjects = findAllPackages(rootPath);

  return result;
}
