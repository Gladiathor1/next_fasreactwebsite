import React, { Component } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import he from 'he';
const OwlCarousel = dynamic(import('react-owl-carousel3'));

const options = {
    loop: false,
    nav: true,
    dots: false,
    autoplayHoverPause: true,
    autoplay: false,
    navText: [
        "<i class='fas fa-chevron-left'></i>",
        "<i class='fas fa-chevron-right'></i>"
    ],
    responsive: {
        0: {
            items: 2
        },
        576: {
            items: 2
        },
        768: {
            items: 3
        },
        1024: {
            items: 4
        },
        1200: {
            items: 6
        }
    }
};

const categories = [{
    name: "Fleece",
    id: 190,
    url_key: "fleece-plush",
    image: "../../images/categories/fleece.jpg"
}, {
    name: "Cotton",
    id: 233,
    url_key: "sports-cotton-fabric",
    image: "../../images/categories/cotton.jpeg"
}, {
    name: "Teams",
    id: 20,
    url_key: "teams",
    image: "../../images/categories/teams.jpg"
}, {
    name: "Prints",
    id: 195,
    url_key: "prints",
    image: "../../images/categories/prints.jpg"
}, {
    name: "Flannel",
    id: 232,
    url_key: "flannel-fabric-by-the-yard",
    image: "../../images/categories/flannel.jpg"
}, {
    name: "Lace",
    id: 31,
    url_key: "lace",
    image: "../../images/categories/lace.jpg"
}, {
    name: "Mesh",
    id: 140,
    url_key: "mesh",
    image: "../../images/categories/mesh.jpg"
}, {
    name: "Solids",
    id: 8,
    url_key: "fleece-plush",
    image: "../../images/categories/solid.jpg"
}, {
    name: "Micro Plush",
    id: 211,
    url_key: "microplush",
    image: "../../images/categories/micro-plush.jpg"
}, {
    name: "Faux Leather",
    id: 226,
    url_key: "faux-leather",
    image: "../../images/categories/fleece.jpg"
}, {
    name: "Home Décor",
    id: 4,
    url_key: "home-decor",
    image: "../../images/categories/home-decor.jpeg"
}, {
    name: "Satins",
    id: 37,
    url_key: "satin",
    image: "../../images/categories/satin.jpg"
}, ]

class CategoryProducts extends Component {
    state = {
        dispaly: false
    }

    componentDidMount() {
        this.setState({ dispaly: true });
    }

    render() {
        const { dispaly } = this.state;
        return (
            <>
                <div className="bg-gray"></div>
                <div className="container category-con">
                    <div className="row">
                        <div className="col-md-12 pt-3">
                            <p className="font-size-16 black">Our Categories</p>
                        </div>
                        { dispaly &&
                            <OwlCarousel
                                className="owl-carousel owl-theme category-slider"
                                {...options}
                            >
                                {
                                    categories.map((category, i) => {
                                        return (
                                            <div key={i} className="item d-flex justify-content-center">
                                                <Link href="/category/[category]" as={`/category/${category.url_key}.html`}>
                                                    <a className="black">
                                                        <div className="text-center">
                                                            <div className="card-body">
                                                                <img 
                                                                    className="rounded-circle shadow-sm p-1 bg-white rounded" 
                                                                    src={category.image} alt="logo"
                                                                />
                                                                <h5 className="card-title font-size-14">{he.decode(category.name)}</h5>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </Link>
                                            </div>
                                        )
                                    })
                                }
                            </OwlCarousel>
                        }
                    </div>
                </div>
            </>
        );
    }
}

export default CategoryProducts;
