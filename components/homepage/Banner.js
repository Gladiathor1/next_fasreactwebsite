import React, { Component } from 'react';
import Link from 'next/link';
import dynamic from "next/dynamic";
const OwlCarousel = dynamic(import("react-owl-carousel3"));

const options = {
    loop: false,
    nav: false,
    dots: false,
    autoplayHoverPause: true,
    autoplay: true,
    navText: [
        "<i className='fas fa-chevron-left'></i>",
        "<i className='fas fa-chevron-right'></i>"
    ],
    responsive: {
        0: {
            items: 1
        },
        576: {
            items: 1
        },
        768: {
            items: 1
        },
        1024: {
            items: 1
        },
        1200: {
            items: 1
        }
    }
};

class Banner extends Component {
    state = {
        dispaly: false
    }

    componentDidMount() {
        this.setState({ dispaly: true });
    }
    
    render() {
        const { dispaly } = this.state;
        return (
            dispaly &&
            <OwlCarousel
                className="owl-theme"
                {...options}
            >
                {/* <div className="item">
                    <img className="slide-img" src={require("../../images/bg1.png")} alt="logo" height={550} />
                </div> */}
                <div className="item">
                    <div className="banner-position">
                        <div className="container">
                            <div className="row">
                                <div className="text-center">
                                    <h1 className="slide-title">LOVE TO SAVE?</h1>
                                    <h1 className="my-2 percent-off">SAVE UP TO 50%</h1>
                                    <p className="black">Wholesale prices by the Yard to Public</p>
                                    <Link href="/category/[category]" as={"/category/shop-by-fabric.html"}>
                                        <a className="btn btn-lg btn-primary">SHOP NOW</a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <img className="slide-img" src={require("../../images/bg2.png")} alt="logo" height={550} />
                </div>
            </OwlCarousel>
        );
    }
}

export default Banner;
