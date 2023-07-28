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
          title={"Shipping & Return"}
          description={""}
          image={""}
          url={"shipping-return"}
        />
        <Navbar />
        <Breadcrumb title="Shipping & return" />
        <section className="about-area ptb-60">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12 col-md-12">
                <div className="shipping-return-content">
                  <h3 className="title-border">SHIPPING INFORMATION</h3>
                  <p className="text-justify">
                  We ship products around the world using different carrier options. On average, if an order is placed before 12pm PST on a business day, then it will be queued for same day processing and will ships on the same or next business day. Orders placed afterward will be processed the next business day.
                  </p>

                  <p className="text-justify">
                  Shipping cost is automatically calculated during checkout process using your shipping address and approximate product weight. However, actual cost may be significantly different, in which case we will contact you for adjustment.
                  </p>

                  <p className="text-justify">
                  Most orders are shipped in 1-2 business days (not including the day the order is placed) by:
                  </p>
                  <p className="text-justify">
                  USPS Priority arrives in 2-3 business days once shipped
                  </p>
                  <p className="text-justify">
                  UPS Ground arrives in 3-7 business days once shipped
                  </p>
                  <p className="text-justify">
                  For International customers, it could take 6-10 depending on customs and the country of destination. In unusual cases, it may take a month or longer. Estimated shipping time does not include any time spent at customs office. It is the buyer's responsibility  to pay for any customs fee. We do not ship to all countries.
                  </p>

                  <p className="text-justify">
                  If you would like to provide your own shipping label, please let us know and we can arrange for the order to be sent on your terms.
                  </p>

                  <p className="text-justify">
                  All orders shipped with Fabric and Sewing will have a tracking number and will be updated as soon as your order is shipped.
                  </p>

                  <h4>RETURN POLICY</h4>

                  <p className="text-justify">
                  Customer satisfaction is our goal at FabricAndSewing.com. If, for any reason you wish to return a product, you can do so within 15 days of the purchase date. To authorize a return, the customer must email a request for a RGA (Return of Goods Authorization) to our customer service department. Or call our customer support first at (800) 678-8569. Original shipping charge however is non-refundable. All refunds will be processed against the original form of payment. Refunds are issued upon receipt of the returned merchandise. Please allow up to two (2) weeks for us to inspect and process your return.
                  </p>

                  <p className="text-justify">
                  If we have made an error in your order, or in the unlikely event that you find a flaw in your fabric, we will happily provide either a replacement or a refund. If color or quality match is important to you, we recommend you request a small swatch, as we do not offer refunds if you change your mind or if the color is not to your liking.
                  </p>

                  <p className="text-justify">
                  We try our best to check all fabric carefully before shipping. If, in rare situations, you received a fabric that's completely different from the one you ordered, please contact us and we can work with you in exchanging the fabric with the one you ordered. We are not responsible for items that are lost or damaged in transit. However, in most cases we are willing to work with the carrier to rectify the problem.
                  </p>

                  <p className="text-justify">
                  - Absolutely no returns on sale items or special orders.
                  </p>
                  <p className="text-justify">
                  - A copy of the original order invoice should be included with the return shipment.
                  </p>
                  <p className="text-justify">
                  - No returns will be honored after 15 days from the purchase date.
                  </p>
                  <p className="text-justify">
                  - No returns without prior written authorization.
                  </p>
                  <p className="text-justify">
                  - All fabric must be returned in its original shipping condition WITHOUT ALTERATION, WASHING, or CUTTING.
                  </p>
                  <p className="text-justify">
                  Return Address:
                  </p>
                  <p className="text-justify">
                  Fabric and Sewing Attn: Returns 940 S Hill Street Suite E Los Angeles, CA 90015
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
