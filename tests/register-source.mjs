// Compile the real TSX modules in memory for dependency-free server rendering tests.
import { registerHooks } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && context.parentURL) {
      for (const extension of [".ts", ".tsx"]) {
        const url = new URL(specifier + extension, context.parentURL);
        if (existsSync(fileURLToPath(url))) return { url: url.href, shortCircuit: true };
      }
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (/\.tsx?$/.test(url)) {
      const source = readFileSync(fileURLToPath(url), "utf8").replaceAll("import.meta.env.BASE_URL", '"/"');
      return { format: "module", shortCircuit: true, source: ts.transpileModule(source, {
        compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      }).outputText };
    }
    return nextLoad(url, context);
  },
});
