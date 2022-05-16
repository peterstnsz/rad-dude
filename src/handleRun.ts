export function handleRun({ parameters }: RunEvent) {
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
}

const applyRadius = (nodes, radius) => {
  const RADII = [
    "topLeftRadius",
    "topRightRadius",
    "bottomRightRadius",
    "bottomLeftRadius",
  ];
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
