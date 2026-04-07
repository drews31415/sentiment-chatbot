/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Capture } from "./pages/Capture";
import { Insight } from "./pages/Insight";
import { Summary } from "./pages/Summary";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="capture" element={<Capture />} />
          <Route path="insight" element={<Insight />} />
          <Route path="discovery" element={<Summary />} />
          <Route path="profile" element={<div className="pt-24 px-6 text-center font-serif text-on-surface-variant">프로필</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

