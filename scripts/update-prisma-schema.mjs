import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isVercel = process.env.VERCEL === "1";

export default function updatePrismaSchema() {
  const pluginsDir = path.resolve(__dirname, "../plugins");
  const configPath = path.join(pluginsDir, "plugin-config.json");
  const prismaSchemaPath = path.resolve(__dirname, "../prisma/schema.prisma");

  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  let prismaSchema = fs.readFileSync(prismaSchemaPath, "utf-8");

  function modelExists(name) {
    return new RegExp(`model\\s+${name}\\s+\\{`, "i").test(prismaSchema);
  }

  for (const pluginName of config.enabledPlugins) {
    const schemaJsonPath = path.join(pluginsDir, pluginName, "schema.json");
    if (!fs.existsSync(schemaJsonPath)) continue;

    const pluginSchema = JSON.parse(fs.readFileSync(schemaJsonPath, "utf-8"));

    for (const model of pluginSchema.models) {
      if (modelExists(model.name)) continue;

      prismaSchema += `\nmodel ${model.name} {\n  ${model.fields.join("\n  ")}\n}\n`;
      console.log(`✅ Added model ${model.name}`);
    }
  }

  fs.writeFileSync(prismaSchemaPath, prismaSchema, "utf-8");
  console.log("✅ schema.prisma updated");

  try {
    if (!isVercel) {
      console.log("🔹 Applying DB changes...");
      execSync("npx prisma db push", { stdio: "inherit" });
    } else {
      console.log("⏭ Skipping db push on Vercel");
    }

    console.log("🔹 Generating Prisma Client...");
    execSync("npx prisma generate", { stdio: "inherit" });
  } catch (err) {
    console.error("❌ Prisma failed:", err);
    process.exit(1);
  }
}
