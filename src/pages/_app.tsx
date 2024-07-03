//Path: src/app/pages/_app.tsx

import { AppProps } from 'next/app';
import '../globals.css';
import {trpc} from "@/utils/trpc";
import Layout from "@/components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Layout>
        <Component {...pageProps} />
        </Layout>
    );
}

export default trpc.withTRPC(MyApp);
