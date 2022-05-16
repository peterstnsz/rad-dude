import { handleInput } from "./handleInput";
import { handleRun } from "./handleRun";

// The 'input' event listens for text change in the Quick Actions box after a plugin is 'Tabbed' into.
figma.parameters.on("input", handleInput);

// When the user presses Enter after inputting all parameters, the 'run' event is fired.
figma.on("run", handleRun);
