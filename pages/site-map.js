import React, { Component } from "react";
import Link from 'next/link';
import { connect } from 'react-redux';
import Head from "../components/SEO/head";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import Breadcrumb from "../components/Common/Breadcrumb";
import he from "he";

class Index extends Component {
  render() {
    const { categories } = this.props;
    return (
      <React.Fragment>
        <Head
          title={"Site Map"}
          description={""}
          image={""}
          url={"site-map"}
        />
        <Navbar />
        <Breadcrumb title="Site Map" />
        <section className="about-area ptb-60">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12 col-md-12">
                <div className="terms-conditions-content">
                  <h3 className="title-border mb-4">Site Map</h3>
                  <div className="row m-0">
                    {
                      categories.map(category => {
                        return (
                          <div className="col-md-2 col-sm-12 site-map-col site-border p-0" key={category.id}>
                            <h4 className="site-bg">{category.id === 9 ? "FABRIC CONTENT" : he.decode(category.name)}</h4>
                            {category.children && category.children.length > 0 &&
                              <SubCategories props={category.children} isColor={category.id === 7} />
                            }
                            { category.id === 9 &&
                              <ul className="site-map-ul">
                                <li><a>Acetate</a></li>
                                <li><a>Acrylic</a></li>
                                <li><a>Cotton</a></li>
                                <li><a>Gold</a></li>
                                <li><a>Nylon</a></li>
                                <li><a>Polyester</a></li>
                                <li><a>Rayon / Viscose</a></li>
                                <li><a>Rayon Slub</a></li>
                                <li><a>Silk</a></li>
                                <li><a>Silver</a></li>
                                <li><a>Spandex / Lycra</a></li>
                              </ul>
                            }
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  let categories = state.categoryReducer.categories;
  if (categories && categories.length) {
    categories = categories.slice(0, 7);
  }
  return {
    categories: categories,
  };
};

export default connect(mapStateToProps, null)(Index);


const SubCategories = (data) => {
  return (
    data.props.map(childCat => {
      return (
        <ul className="site-map-ul" key={childCat.id}>
          <Link href="/category/[category]" as={`/category/${childCat.url_key}.html`} >
            <a>
              { data.isColor ?
                <span style={{ background: `${childCat.name.toLowerCase()}` }} className="site-bg-color"></span> :
                null
              }
              {childCat.name}
            </a>
          </Link>
          { childCat.children && childCat.children.map(subChildCat => {
              return (
                <li className="sub_cat" key={subChildCat.id}>
                  <Link href="/category/[category]" as={`/category/${subChildCat.url_key}.html`} >
                    <a>
                      {
                        data.isColor ?
                        <span className="site-bg-color"></span> : null
                      }
                      {subChildCat.name}
                    </a>
                  </Link>
                  {subChildCat.children && subChildCat.children.length > 0 ? <SubCategories props={subChildCat.children} isColor={data.isColor} /> : null }
                </li>
              )
            })
          }
        </ul>
      )
    })
  );
}