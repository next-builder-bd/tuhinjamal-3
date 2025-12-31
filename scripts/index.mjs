import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("🔹 Running generate-plugin-map...");
  const { default: generatePluginMap } = await import(path.join(__dirname, "generate-plugins.mjs"));
  generatePluginMap();

  console.log("🔹 Running update-prisma-schema...");
  const { default: updatePrismaSchema } = await import(path.join(__dirname, "update-prisma-schema.mjs"));
  updatePrismaSchema();

  console.log("✅ All pre-build scripts executed successfully");
}

main();
