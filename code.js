// TODO
// - Change radius on the selected node
// - Change radius on the selected node and it's children only if radius is already applied (it's >0)
// Check that the input is a valid number
function setSuggestionsForNumberInput(query, result, completions) {
    if (query === "") {
        result.setSuggestions(completions !== null && completions !== void 0 ? completions : []);
    }
    else {
        const filteredCompletions = completions
            ? completions.filter((s) => s.includes(query) && s !== query)
            : [];
        result.setSuggestions([query, ...filteredCompletions]);
    }
}
// The 'input' event listens for text change in the Quick Actions box after a plugin is 'Tabbed' into.
figma.parameters.on("input", ({ query, key, result }) => {
    if (figma.currentPage.selection.length === 0) {
        result.setError("Please select one or mode nodes first");
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
figma.on("run", ({ parameters }) => {
    changeRadius(parameters);
    figma.closePlugin();
});
function changeRadius(parameters) {
    const radius = convertTokenToInt(parameters.radius);
    for (const node of figma.currentPage.selection) {
        if (node.type === "RECTANGLE") {
            node.cornerRadius = radius;
        }
    }
}
const convertTokenToInt = (token) => {
    const pattern = /\(([^)]+)\)/;
    const parsedToken = token.match(pattern)[1].replace("px", "");
    return parseInt(parsedToken);
};
