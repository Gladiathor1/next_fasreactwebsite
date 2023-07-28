export const setSearchQuery = (str, page, filters) => {
  return { query: `query getProducts {
    products(
      search: "${str}"
      filter: { ${filters} }
      pageSize: 24
      currentPage: ${page}
    ) {
      items {
        id
        url_key
        name
        sku
        stock_status
        __typename
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
        small_image{
          url
        }
        price_range{
          minimum_price{
            regular_price{
              value
              currency
            }
          }
        }
        categories {
          id
          name
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
              price_range{
                minimum_price{
                  regular_price{
                    value
                    currency
                  }
                }
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
  }` };
};
