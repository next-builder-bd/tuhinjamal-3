// import { blogPlugin } from "./blog/plugin";
// import type { PluginPage } from "./types";

// export const pluginRoutes: Record<string, PluginPage> = {
//   ...blogPlugin.routes,
// };

// export type PluginRouteKeys = keyof typeof pluginRoutes;
import type { PluginPage } from "./types";
import { pluginConfig } from "./plugin-config";
import { pluginMap } from "./plugin-map";

type Plugin = {
  name: string;
  routes: Record<string, PluginPage>;
};

export const pluginRoutes: Record<string, PluginPage> = {};

for (const pluginName of pluginConfig.enabledPlugins) {
  const plugin = pluginMap[pluginName as keyof typeof pluginMap] as Plugin | undefined;

  if (!plugin) {
    throw new Error(`Plugin not found: ${pluginName}`);
  }

  Object.assign(pluginRoutes, plugin.routes);
}


export type PluginRouteKeys = keyof typeof pluginRoutes;
