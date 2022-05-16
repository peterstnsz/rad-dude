export function handleInput({ query, key, result }: ParameterInputEvent) {
  if (figma.currentPage.selection.length === 0) {
    result.setError("🛑 Please select one or more layers first 🛑");
    return;
  }

  if (key === "radius") {
    const radiiTokens = [
      "$2xs (2px)",
      "$xs (4px)",
      "$sm (8px)",
      "$md (16px)",
      "$xl (99px)",
    ];
    setSuggestionsForNumberInput(query, result, radiiTokens);
  }
  return;
}

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
