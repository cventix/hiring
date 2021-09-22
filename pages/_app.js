import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import '../styles/normalize.css';
import '../styles/globals.css';

import { Toaster } from 'react-hot-toast';
import WorkspaceContextWrapper from '../contexts/workspace-context';

function MyApp({ Component, pageProps }) {
  return (
    <WorkspaceContextWrapper>
      <Component {...pageProps} />
      <Toaster />
    </WorkspaceContextWrapper>
  );
}

export default MyApp;
