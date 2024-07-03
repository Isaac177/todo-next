import { AppProps } from 'next/app';
import { trpc } from '../utils/trpc';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default trpc.withTRPC(MyApp);
