import React, { Component } from "react";
import Head from "../components/SEO/head";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import Breadcrumb from "../components/Common/Breadcrumb";

class Index extends Component {
  render() {
    return (
      <React.Fragment>
        <Head
          title={"FAQ"}
          description={""}
          image={""}
          url={"faq"}
        />
        <Navbar />
        <Breadcrumb title="FAQs" />
        <section className="about-area ptb-60">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12 col-md-12">
                <div className="terms-conditions-content">
                  <h3 className="title-border">FAQs</h3>
                  <p>
                  <strong>Q:</strong> Why should I order a swatch before I purchase fabric online?
                  </p>
                  <p>
                  <strong>A:</strong> At FabricAndSewing.com, we strive to provide our clients with the most accurate color representation possible. However, even with the great care we take to provide true-to-life color matching, we cannot ensure the accuracy of the colors shown on a computer screen. Color variations beyond our control exist which prevent us from giving a guarantee on the correctness of the colors being viewed. These variations include web color variations, such as differences in browser settings; system-to-system platform color variations; and monitor color variations.
                  </p>

                  <p>
                  Monitor color variations present the most difficulty in providing 100% accuracy. Laptops and LCD screens vary greatly in how they display color. Most LCD screens display color ranges from 16bit (65,536 colors) to true color, which display 16.7 million colors. Older monitors, which display color in flat 8bit (256 colors) are still in circulation and rarely give true-to-life color depiction.
                  </p>

                  <p>
                  These variations make it impossible to give any assurance on color, so it is essential that our clients order a swatch of the fabric before purchasing it over the internet.
                  </p>

                  <p>
                  <strong>Q:</strong> What if I need to modify or cancel my order?
                  </p>

                  <p>
                  <strong>A:</strong> Please email us at customerservice@FabricAndSewing.com, and we will be more than happy to help you with your order.
                  </p>

                  <p>
                  <strong>Q:</strong> What forms of payment do you accept?
                  </p>
                  <p>
                  <strong>A:</strong> We accept all major credit cards (American Express, VISA, MasterCard, and Discover Card), as well as payment through PayPal.
                  </p>

                  <p>
                  <strong>Q:</strong> What is your exchange policy?
                  </p>

                  <p>
                  <strong>A:</strong> We strongly recommend that you order a swatch of the material before purchase to assure color accuracy.  Please view our Returns & Exchange policy for more information.
                  </p>

                  <p>
                  <strong>Q:</strong> Do you wholesale?
                  </p>

                  <p>
                  <strong>A:</strong> Yes, we do. If you have a business that requires any of our products, please contact us via phone at (800) 678-8569(800) 678-8569 FREE or email at sales@FabricAndSewing.com.
                  </p>

                  <p>
                  <strong>Q:</strong> Are the fabrics shipped in pieces?
                  </p>

                  <p>
                  <strong>A:</strong> We always cut from the roll or bolt, so the fabrics will arrive in one piece. For example, if you order 5 yards of a material, you will receive one piece of fabric measuring 5 yards. If we cannot provide the fabric in one piece, we will notify you prior to completing your order.
                  </p>

                  <p>
                  <strong>Q:</strong> Is there a required minimum order size?
                  </p>

                  <p>
                  <strong>A:</strong> Yes, the minimum is 1 yard.
                  </p>

                  <p>
                  <strong>Q:</strong> Are the Fabrics priced per yard?
                  </p>

                  <p>
                  <strong>A:</strong> Yes, all of our materials are priced per yard.  
                  </p>

                  <p>
                  <strong>Q:</strong> Do you stock all colors?
                  </p>

                  <p>
                  <strong>A:</strong> We carry all colors that are listed on our website. However, we also supply to manufacturers, so our inventory changes every day. If you would like to check inventory before placing an order, please contact us and we can provide that information to you.
                  </p>

                  <p>
                  Didn't find the answer to your question? Need to contact us?
                  </p>

                  <p>
                  Send us an email at: sales@FabricAndSewing.com 24 hours a day, 7 days a week. We pride ourselves on responding quickly to all inquiries.
                  </p>
                  
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

export default Index;
