import { notFound } from "next/navigation";
import { pluginRoutes, PluginRouteKeys } from "./plugin-registry";

function normalizePath(segments: string[]) {
  for (const key of Object.keys(pluginRoutes)) {
    const keyParts = key.split("/").filter(Boolean);
    if (keyParts.length !== segments.length) continue;

    const match = keyParts.every((part, i) => {
      const seg = segments[i];
      if (part === "[id]") return !Number.isNaN(Number(seg));
      if (part.startsWith("[") && part.endsWith("]")) return true;
      return part === seg;
    });

    if (match) return key;
  }

  return "/" + segments.join("/");
}

export function loadPluginPage() {
  return async function PluginPage({
    params,
  }: {
    params: Promise<{ path?: string[] }>;
  }) {
    const resolvedParams = await params;
    const segments = resolvedParams?.path ?? [];

    if (segments.length === 0) notFound();

    const normalizedPath = normalizePath(segments);
    const Page = pluginRoutes[normalizedPath as PluginRouteKeys];

    if (!Page) notFound();

    const routeParams: Record<string, string> = {};
    const patternParts = normalizedPath.split("/").filter(Boolean);

    patternParts.forEach((part, index) => {
      if (part.startsWith("[") && part.endsWith("]")) {
        routeParams[part.slice(1, -1)] = segments[index];
      }
    });

    return <Page params={routeParams} />;
  };
}
