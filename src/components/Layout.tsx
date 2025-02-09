// Path: src/components/Layout.tsx

import React from 'react';
import NavBar from './NavBar';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <NavBar />
            <main>{children}</main>
        </div>
    );
};

export default Layout;
