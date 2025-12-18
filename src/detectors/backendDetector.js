export function detectBackend(projectFacts) {
  const deps = {
    ...projectFacts.dependencies,
    ...projectFacts.devDependencies
  };

  const backend = {
    runtime: null,
    framework: null
  };

  // Node.js is assumed if package.json exists
  backend.runtime = "Node.js";

  if (deps.express) {
    backend.framework = "Express";
  }

  return backend;
}
