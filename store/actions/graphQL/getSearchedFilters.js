export const setSearchFilterQuery = (str) => {
  return { query: `query getProducts {
    searchFilters(search: "${str}") {
      pfilters {
        label
        attribute_code
        option {
          label
          value
        }
      }
    }
  }` };
};
