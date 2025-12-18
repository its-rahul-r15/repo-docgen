export function analyzeProject(scanResult) {
  const rootPkg = scanResult.packageJson || {};

  // ---- Merge dependencies from ALL package.json files ----
  const mergedDependencies = {};
  const mergedDevDependencies = {};

  // Root package.json
  Object.assign(mergedDependencies, rootPkg.dependencies || {});
  Object.assign(mergedDevDependencies, rootPkg.devDependencies || {});

  // Sub-project package.json files
  (scanResult.subProjects || []).forEach(sub => {
    Object.assign(
      mergedDependencies,
      sub.packageJson?.dependencies || {}
    );
    Object.assign(
      mergedDevDependencies,
      sub.packageJson?.devDependencies || {}
    );
  });

  return {
    metadata: {
      name: rootPkg.name || "Unnamed Project",
      description: rootPkg.description || "No description provided",
      version: rootPkg.version || "0.0.0",
      author: rootPkg.author || "Not specified",
      license: rootPkg.license || "Not specified"
    },

    scripts: rootPkg.scripts || {},

    dependencies: mergedDependencies,

    devDependencies: mergedDevDependencies,

    subProjects: scanResult.subProjects || [],

    structure: {
      rootPath: scanResult.rootPath,
      folders: scanResult.folders || [],
      files: scanResult.files || []
    }
  };
}
