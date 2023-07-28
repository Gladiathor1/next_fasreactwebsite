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
          title={"Terms & Conditions"}
          description={""}
          image={""}
          url={"terms-conditions"}
        />
        <Navbar />
        <Breadcrumb title="Terms & Conditions" />
        <section className="about-area ptb-60">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12 col-md-12">
                <div className="terms-conditions-content">
                  <h3 className="title-border">Terms & Conditions</h3>
                  <p>
                    <strong>TERMS & CONDITIONS</strong>
                  </p>
                  <p>
                    <strong>Legal Notices</strong>
                  </p>
                  <p>
                    <strong>Terms and Conditions Of Use</strong>
                  </p>

                  <p>
                    Please Read These Terms Carefully Before Using This Site
                  </p>

                  <p>
                    This website is provided by FabricAndSewing.com, and may be used for informational and shopping purposes only. By using the site, you agree to abide by the terms and conditions set forth in this notice. If you do not agree to abide by these terms and conditions do not use the site.
                  </p>
                  <p>
                    <strong>Copyright</strong>
                  </p>

                  <p>
                  This website is the copyright property of FabricAndSewing.com. You may download, display, print and reproduce material from this site provided it remains in unaltered form and acknowledges FabricAndSewing.com’s copyright ownership. Apart from any use as permitted under the Copyright Act 1968, you may not, in any form or by any means:
                  </p>

                  <p>
                  1. Adapt, reproduce, store, distribute, transmit, print, display, perform, publish or create derivative works from any part of this website; or
                  </p>

                  <p>
                  2.    Commercialize any information, products or services obtained from any part of this web site, without the written permission of FabricAndSewing.com.
                  </p>

                  <p>
                    <strong>Disclaimer</strong>
                  </p>

                  <p>
                  THE MATERIALS MAY CONTAIN INACCURACIES AND TYPOGRAPHICAL ERRORS. <strong>FabricAndSewing.com</strong> DOES NOT WARRANT THE ACCURACY OR COMPLETENESS OF THE MATERIALS OR THE RELIABILITY OF ANY ADVICE, OPINION, STATEMENT OR OTHER INFORMATION DISPLAYED OR DISTRIBUTED THROUGH THE SITE.
                  </p>

                  <p>
                  <strong>FabricAndSewing.com</strong> RESERVES THE RIGHT, IN ITS SOLE DISCRETION, TO CORRECT ANY ERRORS OR OMISSIONS IN ANY PORTION OF THE SITE. <strong>FabricAndSewing.com</strong> MAY MAKE ANY OTHER CHANGES TO THE SITE, THE MATERIALS AND THE PRODUCTS, PROGRAMS, SERVICES OR PRICES (IF ANY) DESCRIBED IN THE SITE AT ANY TIME WITHOUT NOTICE.
                  </p>

                  <p>
                    <strong>Color Disclaimer</strong>
                  </p>

                  <p>
                  Although we do our best to make sure that the colors on our website are accurate, actual colors will vary. Subtle color differences and textures may not be fully appreciated on some systems due to differences in monitors and/or display cards.
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
