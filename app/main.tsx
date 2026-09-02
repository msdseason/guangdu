import React from 'react';
import {createRoot} from 'react-dom/client';
import Home from './page';
import {SiteProvider} from '@/lib/site';
import './globals.css';
import './reading.css';
createRoot(document.getElementById('root')!).render(<SiteProvider><Home/></SiteProvider>);
