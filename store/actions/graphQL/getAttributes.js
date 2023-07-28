export const setAttributesQuery = (sku) => {
  return { query: `query attributeValues{
    attributeValues(sku: "${sku}") {
      atr_data {
        code
        value
        label
      }
    }
  }` }
}
