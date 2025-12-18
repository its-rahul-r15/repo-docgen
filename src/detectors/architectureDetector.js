export function detectArchitecture(projectFacts) {
  const hasFrontend =
    Boolean(projectFacts.frontend?.framework) ||
    Boolean(projectFacts.frontend?.bundler);

  const hasBackend =
    Boolean(projectFacts.backend?.runtime) ||
    Boolean(projectFacts.backend?.framework);

  const subProjectCount = projectFacts.subProjects?.length || 0;

  // ---- Monorepo detection ----
  if (subProjectCount > 1) {
    if (hasFrontend && hasBackend) {
      return "Full-stack monorepo application";
    }

    if (hasFrontend && !hasBackend) {
      return "Frontend monorepo application";
    }

    if (!hasFrontend && hasBackend) {
      return "Backend monorepo application";
    }

    return "Monorepo application";
  }

  // ---- Single project detection ----
  if (hasFrontend && hasBackend) {
    return "Full-stack application";
  }

  if (hasFrontend && !hasBackend) {
    return "Frontend-only application";
  }

  if (!hasFrontend && hasBackend) {
    return "Backend-only application";
  }

  return "Architecture not detected";
}
