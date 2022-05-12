// Recursive function, on selection apply radius to parents and children. The function will call itself to be applied to that group of nodes applied to that group of nodes.
// Define the property names you want to check
const RADII = [
  "topLeftRadius",
  "topRightRadius",
  "bottomRightRadius",
  "bottomLeftRadius",
];

// Check that the input is a valid number
function setSuggestionsForNumberInput(
  query: string,
  result: SuggestionResults,
  completions?: string[]
) {
  if (query === "") {
    result.setSuggestions(completions ?? []);
  } else {
    if (isNaN(+query)) {
      result.setError("🛑 Invalid input, provide a number e.g. 14 🛑");
      return;
    }
    const filteredCompletions = completions
      ? completions.filter((s) => s.includes(query) && s !== query)
      : [];
    result.setSuggestions([query, ...filteredCompletions]);
  }
}

// The 'input' event listens for text change in the Quick Actions box after a plugin is 'Tabbed' into.
figma.parameters.on("input", ({ query, key, result }: ParameterInputEvent) => {
  if (figma.currentPage.selection.length === 0) {
    result.setError("🛑 Please select one or more layers first 🛑");
    return;
  }

  switch (key) {
    case "radius":
      const radiiTokens = [
        "$2xs (2px)",
        "$xs (4px)",
        "$sm (8px)",
        "$md (16px)",
        "$xl (99px)",
      ];
      setSuggestionsForNumberInput(query, result, radiiTokens);
      break;
    default:
      return;
  }
});

// When the user presses Enter after inputting all parameters, the 'run' event is fired.
figma.on("run", ({ parameters }: RunEvent) => {
  const radius = convertInputToRadius(parameters.radius);
  const convertedCount = applyRadius(figma.currentPage.selection, radius);
  // write a function that checks radius and runs figma.notify based on that
  if (convertedCount === 0) {
    figma.notify("🙈 No radius detected, nothing has been changed", {
      timeout: 5000,
    });
    figma.closePlugin();
  } else {
    figma.notify(
      `🏄‍♂️ Radius changed to ${radius}px on ${convertedCount} layer(s) & sublayer(s)`,
      {
        timeout: 5000,
      }
    );
  }
  figma.closePlugin();
});

const applyRadius = (nodes, radius) => {
  let convertedCount = 0;
  nodes.forEach((n) => {
    // For every note selected we count if radius has changed
    let isNodeRadiusConverted = false;
    // Check each property for the current node
    RADII.forEach((r) => {
      if (n[r] && n[r] > 0) {
        // If the node has the property and is > 0
        n[r] = radius; // change it to our value
        isNodeRadiusConverted = true;
      }
    });

    if (isNodeRadiusConverted) {
      convertedCount++;
    }

    let children = n.children;
    if (children && children.length > 0) {
      convertedCount += applyRadius(children, radius);
    }
  });

  return convertedCount;
};

function changeRadius(radius: number) {
  // add functionality to catch errors and parse typed values

  applyRadius(figma.currentPage.selection, radius);
  return radius;
}

const convertInputToRadius = (input: string) => {
  // check if it's a valid token first
  if (isValidToken(input)) {
    //if token is valid we return radius
    return convertTokenToInt(input);
  }
  //if the user input is a number return that
  return +input;
};

const isValidToken = (token: string) => {
  const pattern = /\(([^)]+)\)/;
  return pattern.test(token);
};

const convertTokenToInt = (token: string) => {
  const pattern = /\(([^)]+)\)/;
  const parsedToken = token.match(pattern)[1].replace("px", "");
  return parseInt(parsedToken);
};
