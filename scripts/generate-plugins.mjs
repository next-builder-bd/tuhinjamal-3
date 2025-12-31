import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function generatePluginMap() {
  const pluginsDir = path.resolve(__dirname, "../plugins");
  const configPath = path.join(pluginsDir, "plugin-config.json");
  const pluginMapPath = path.join(pluginsDir, "plugin-map.ts");

  let config = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, "utf-8"))
    : { enabledPlugins: [] };

  // Scan plugin folders
  const allPluginFolders = fs.readdirSync(pluginsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  // Enable new plugins
  for (const folder of allPluginFolders) {
    if (!config.enabledPlugins.includes(folder)) {
      config.enabledPlugins.push(folder);
      console.log(`✅ Enabled plugin: ${folder}`);
    }
  }

  // Generate plugin-map.ts
  const imports = [];
  const mappings = [];

  for (const name of config.enabledPlugins) {
    imports.push(`import ${name} from "./${name}/plugin";`);
    mappings.push(`  ${name},`);
  }

  const content = `// ⚠️ AUTO-GENERATED FILE — DO NOT EDIT
${imports.join("\n")}

export const pluginMap = {
${mappings.join("\n")}
};
`;

  fs.writeFileSync(pluginMapPath, content, "utf-8");
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
  console.log("✅ plugin-map.ts and plugin-config.json updated");
}
