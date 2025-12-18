export function generateSetupInstructions(projectFacts) {
  const commands = [];

  // Always valid if package.json exists
  commands.push("npm install");

  const scripts = projectFacts.scripts || {};

  if (scripts.dev) {
    commands.push("npm run dev");
  } else if (scripts.start) {
    commands.push("npm start");
  }

  return commands.join("\n");
}
