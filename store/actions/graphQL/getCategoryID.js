export const setCategoryIDQuery = (url) => {
  return { query: `query getCategoryID {
    categoryList(filters: { url_key: { eq: "${url}" } }) {
      id
    }
  }` }
}