import { Config } from "@remotion/cli/config";

// Entry point for the Remotion studio and bundle CLI
Config.setEntryPoint("./lib/motion/Root.tsx");

// Use webpack overrides if needed (e.g. for custom fonts via publicDir)
Config.overrideWebpackConfig((current) => {
  return current;
});
