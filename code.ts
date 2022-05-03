// Check that the input is a valid number
function setSuggestionsForNumberInput(
  query: string,
  result: SuggestionResults,
  completions?: string[]
) {
  if (query === "") {
    result.setSuggestions(completions ?? []);
  } else {
    const filteredCompletions = completions
      ? completions.filter((s) => s.includes(query) && s !== query)
      : [];
    result.setSuggestions([query, ...filteredCompletions]);
  }
}

// The 'input' event listens for text change in the Quick Actions box after a plugin is 'Tabbed' into.
figma.parameters.on("input", ({ query, key, result }: ParameterInputEvent) => {
  if (figma.currentPage.selection.length === 0) {
    result.setError("Please select one or more layers first");
    return;
  }

  switch (key) {
    case "radius":
      const radii = [
        "$2xs (2px)",
        "$xs (4px)",
        "$sm (8px)",
        "$md (16px)",
        "$xl (99px)",
      ];
      setSuggestionsForNumberInput(query, result, radii);
      break;
    default:
      return;
  }
});

// When the user presses Enter after inputting all parameters, the 'run' event is fired.
figma.on("run", ({ parameters }: RunEvent) => {
  changeRadius(parameters);
  figma.closePlugin();
});

function changeRadius(parameters: ParameterValues) {
  // add functionality to catch errors and parse typed values
  const radius = convertTokenToInt(parameters.radius);
  for (const node of figma.currentPage.selection) {
    // Recursive function, on selection apply radius to parents and children. The function will call itself to be applied to that group of nodes applied to that group of nodes.
    // Define the property names you want to check
    const radii = [
      "topLeftRadius",
      "topRightRadius",
      "bottomRightRadius",
      "bottomLeftRadius",
    ];

    const applyRadius = (nodes, radius) => {
      // console.log(radius);
      nodes.forEach((n) => {
        // Check each property for the current node
        radii.forEach((r) => {
          if (n[r] && n[r] > 0) {
            // If the node has the property and is > 0
            n[r] = radius; // change it to our value
          }
        });

        let children = n.children;
        if (children && children.length > 0) {
          applyRadius(children, radius);
        }
      });
    };
    applyRadius(figma.currentPage.selection, radius);

    figma.notify("Radius changed to " + radius, {
      timeout: 2000,
    });
  }
}

const convertTokenToInt = (token: string) => {
  const pattern = /\(([^)]+)\)/;
  const parsedToken = token.match(pattern)[1].replace("px", "");
  return parseInt(parsedToken);
};
