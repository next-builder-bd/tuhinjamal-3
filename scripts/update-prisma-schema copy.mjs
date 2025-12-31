import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function updatePrismaSchema() {
  const pluginsDir = path.resolve(__dirname, "../plugins");
  const configPath = path.join(pluginsDir, "plugin-config.json");
  const prismaSchemaPath = path.resolve(__dirname, "../prisma/schema.prisma");

  // Read enabled plugins
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  let prismaSchema = fs.readFileSync(prismaSchemaPath, "utf-8");

  function modelExists(name) {
    return new RegExp(`model\\s+${name}\\s+\\{`, "i").test(prismaSchema);
  }

  // Add models from enabled plugins
  for (const pluginName of config.enabledPlugins) {
    const schemaJsonPath = path.join(pluginsDir, pluginName, "schema.json");
    if (!fs.existsSync(schemaJsonPath)) continue;

    const pluginSchema = JSON.parse(fs.readFileSync(schemaJsonPath, "utf-8"));
    for (const model of pluginSchema.models) {
      if (modelExists(model.name)) {
        console.log(`⚠️ Model ${model.name} exists, skipping.`);
        continue;
      }

      const fieldsStr = model.fields.join("\n  ");
      prismaSchema += `\nmodel ${model.name} {\n  ${fieldsStr}\n}\n`;
      console.log(`✅ Added model ${model.name} from plugin ${pluginName}`);
    }
  }

  // Write updated schema.prisma
  fs.writeFileSync(prismaSchemaPath, prismaSchema, "utf-8");
  console.log("✅ schema.prisma updated");

  // ------------------------
  // Push to database and generate Prisma Client
  // ------------------------
  try {
    console.log("🔹 Applying database changes...");
    execSync("npx prisma db push", { stdio: "inherit" });

    console.log("🔹 Generating Prisma Client...");
    execSync("npx prisma generate", { stdio: "inherit" });

    console.log("✅ Database schema and Prisma Client are ready");
  } catch (err) {
    console.error("❌ Failed to update DB or generate Prisma Client:", err);
    process.exit(1);
  }
}
