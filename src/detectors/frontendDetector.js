export function detectFrontend(projectFacts) {
  const deps = {
    ...projectFacts.dependencies,
    ...projectFacts.devDependencies
  };

  const frontend = {
    framework: null,
    bundler: null
  };

  if (deps.react) {
    frontend.framework = "React";
  }

  if (deps.vite) {
    frontend.bundler = "Vite";
  }

  return frontend;
}
