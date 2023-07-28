export const setCategoriesQuery = () => {
  return { query: `query getCategories {
    categoryList(filters: {ids: {in: ["2"]}}) {
      children {
        id
        name
        url_path
        url_key
        image
        children {
          id
          name
          url_path
          url_key
          image
        }
      }
    }
  }` }
}