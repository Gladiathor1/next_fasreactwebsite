export const setQuery = (id, page, filters) => {
  return { query: `query getProducts {
    category( id: ${parseInt(id)} ) {
      name
      id
    }
    products(
      filter: { category_id: { eq: "${id}" }${filters} }
      pageSize: 12
      currentPage: ${page}
    ) {
      items {
        id
        url_key
        name
        sku
        __typename
        stock_status
        url_key
        price_tiers{
          quantity
          discount{
            amount_off
            percent_off
          }
          final_price{
            value
          }
        }
        image{
          url
        }
        price_range{
          minimum_price{
            regular_price{
              value
            }
          }
        }
        ... on ConfigurableProduct {
          variants {
            product {
              id
              name
              sku
              small_image{
                  url
              }
            }
            attributes {
              label
              code
            }
          }
        }
      }
      total_count
      page_info {
        page_size
        current_page
      }
    }
    categoryFilters(category_id: ${parseInt(id)}) {
      pfilters {
        label
        attribute_code
        option {
          label
          value
        }
      }
    }
  }`}
}
