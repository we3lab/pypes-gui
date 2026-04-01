import type { AppProps } from "next/app";
import { trpc } from "../utils/trpc";
import { SessionProvider } from "next-auth/react";
import "./global.css";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import Layout from "@/components/layout";
import { ThemeProvider, createTheme } from "@mui/material";
import { grey, blue } from "@mui/material/colors";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const theme = createTheme({
  palette: {
    primary: {
      main: grey[100],
    },
    secondary: {
      main: blue[700],
    },
  },
});


const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <Layout>{
          <Component {...pageProps} />}
        </Layout>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
