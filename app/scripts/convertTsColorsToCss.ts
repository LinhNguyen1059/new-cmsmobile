import * as fs from "fs";
import * as path from "path";

interface ColorObject {
  [key: string]: string;
}

interface ColorsStructure {
  colors: {
    light: ColorObject;
    dark?: ColorObject;
  };
}

/**
 * Parse TypeScript colors file and extract color objects
 */
function parseTypeScriptColors(filePath: string): { light: ColorObject; dark: ColorObject } {
  try {
    // Clear require cache to get fresh data
    delete require.cache[require.resolve(filePath)];

    const colorsModule = require(filePath) as ColorsStructure;

    return {
      light: colorsModule.colors.light || {},
      dark: colorsModule.colors.dark || {},
    };
  } catch (error) {
    console.error(`❌ Error parsing TypeScript colors from ${filePath}:`, error);
    return { light: {}, dark: {} };
  }
}

/**
 * Generate CSS variables from color object with grouped spacing
 */
function generateCssVariables(colors: ColorObject): string {
  if (Object.keys(colors).length === 0) {
    return "";
  }

  // Group colors by their prefix (primary, secondary, success, etc.)
  const groups: { [key: string]: Array<{ name: string; value: string }> } = {};

  Object.entries(colors).forEach(([name, value]) => {
    const prefix = name.split("-")[0];
    if (!groups[prefix]) {
      groups[prefix] = [];
    }
    groups[prefix].push({ name, value });
  });

  // Sort groups to maintain consistent order
  const sortedGroupKeys = Object.keys(groups).sort((a, b) => {
    const order = ["primary", "secondary", "success", "info", "warning", "danger", "neutral"];
    const aIndex = order.indexOf(a);
    const bIndex = order.indexOf(b);

    // If both are in the order array, sort by their position
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    // If only one is in the order array, prioritize it
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    // If neither is in the order array, sort alphabetically
    return a.localeCompare(b);
  });

  // Generate CSS variables with spacing between groups
  const groupedVariables = sortedGroupKeys
    .map((groupKey) => {
      const groupColors = groups[groupKey];
      return groupColors.map(({ name, value }) => `    --${name}: ${value};`).join("\n");
    })
    .join("\n\n");

  return groupedVariables;
}

/**
 * Generate complete global.css content
 */
function generateGlobalCssContent(lightColors: ColorObject, darkColors: ColorObject): string {
  const lightVariables = generateCssVariables(lightColors);
  const darkVariables = generateCssVariables(darkColors);

  let cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {`;

  // Add :root section if light colors exist
  if (lightVariables) {
    cssContent += `
  :root {
${lightVariables}
  }`;
  }

  // Add .dark:root section if dark colors exist
  if (darkVariables) {
    if (lightVariables) {
      cssContent += "\n";
    }
    cssContent += `
  .dark:root {
${darkVariables}
  }`;
  }

  cssContent += `
}
`;

  return cssContent;
}

/**
 * Main function to convert TypeScript colors to CSS variables
 */
function convertTsColorsToCss() {
  try {
    // Read the colors.ts file
    const colorsPath = path.join(__dirname, "../theme/colors.ts");

    if (!fs.existsSync(colorsPath)) {
      console.log("❌ colors.ts file not found at", colorsPath);
      return;
    }

    // Parse colors from TypeScript
    const { light: lightColors, dark: darkColors } = parseTypeScriptColors(colorsPath);

    if (Object.keys(lightColors).length === 0 && Object.keys(darkColors).length === 0) {
      console.log("No color variables found in colors.ts");
      return;
    }

    // Generate CSS content
    const cssContent = generateGlobalCssContent(lightColors, darkColors);

    // Write to global.css
    const globalCssPath = path.join(__dirname, "../../global.css");
    fs.writeFileSync(globalCssPath, cssContent);

    console.log(`✅ Colors converted to CSS variables in ${globalCssPath}`);
    console.log(`   Generated ${Object.keys(lightColors).length} light mode variables`);
    console.log(`   Generated ${Object.keys(darkColors).length} dark mode variables`);

    // Display summary
    console.log("\n📋 Conversion Summary:");
    if (Object.keys(lightColors).length > 0) {
      console.log(`\nLight Mode (${Object.keys(lightColors).length} variables):`);
      Object.entries(lightColors).forEach(([name, value]) => {
        console.log(`  --${name}: ${value}`);
      });
    }

    if (Object.keys(darkColors).length > 0) {
      console.log(`\nDark Mode (${Object.keys(darkColors).length} variables):`);
      Object.entries(darkColors).forEach(([name, value]) => {
        console.log(`  --${name}: ${value}`);
      });
    }
  } catch (error) {
    console.error("❌ Error converting TypeScript colors to CSS:", error);
    process.exit(1);
  }
}

// Run the conversion if this script is executed directly
if (require.main === module) {
  convertTsColorsToCss();
}

export {
  convertTsColorsToCss,
  parseTypeScriptColors,
  generateCssVariables,
  generateGlobalCssContent,
};
