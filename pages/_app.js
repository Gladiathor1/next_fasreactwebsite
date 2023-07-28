import '../assets/styles/bootstrap.min.css';
import '../assets/styles/fontawesome.min.css';
import '../assets/styles/style.scss';
import '../assets/styles/responsive.scss';
import '../assets/styles/customer.scss';
import '../assets/styles/animate.min.css';
import '../assets/styles/slick.css';
import '../assets/styles/slick-theme.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "react-datepicker/dist/react-datepicker.css";
import 'nprogress/nprogress.css';

import { Provider } from "react-redux";
import App, { Container } from "next/app";
import Router from 'next/router';
import withRedux from "next-redux-wrapper";
import { initStore } from "../store";
import { DefaultSeo } from "next-seo";
import TagManager from 'react-gtm-module';
import NProgress from 'nprogress';
import GoTop from "../components/Shared/GoTop";

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default withRedux(initStore)(
  class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
      return {
        pageProps: Component.getInitialProps
          ? await Component.getInitialProps(ctx)
          : {}
      };
    }

    componentDidMount () {
      TagManager.initialize({
        gtmId: 'GTM-KZ8QS6K'
      })
    }

    render() {
      const { Component, pageProps, store } = this.props;

      return (
        <Container>
          <DefaultSeo
            title="Fabric and Sewing: Wholesale prices by the yard to the public"
            description="Wholesale prices by the yard to the public"
            openGraph={{
              type: "website",
              locale: "en_IE",
              url: "https://www.fabricandsewing.com/",
              site_name: "Fabric and Sewing"
            }}
          />
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
          <GoTop scrollStepInPx="50" delayInMs="16.66" />
        </Container>
      );
    }
  }
);
