import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import Tab from "./components/Tabs/Tab";
import TabList from "./components/Tabs/TabList";
import TabPanel from "./components/Tabs/TabPanel";
import Tabs from "./components/Tabs/Tabs";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <main className="demo">
      <h1>Tabs component</h1>

      <section className="demo-section" aria-labelledby="pill-heading">
        <h2 id="pill-heading">Pill</h2>
        <Tabs defaultValue="overview">
          <TabList aria-label="Pill account sections">
            <Tab value="overview" label="Overview" badge={{ label: "3", variant: "neutral" }} />
            <Tab value="activity" label="Activity" />
            <Tab value="settings" label="Settings" />
          </TabList>
          <TabPanel value="overview">Account overview.</TabPanel>
          <TabPanel value="activity">Recent account activity.</TabPanel>
          <TabPanel value="settings">Account settings.</TabPanel>
        </Tabs>
      </section>

      <section className="demo-section" aria-labelledby="underline-heading">
        <h2 id="underline-heading">Underline</h2>
        <Tabs variant="underline" defaultValue="overview">
          <TabList aria-label="Underline account sections">
            <Tab value="overview" label="Overview" badge={{ label: "3", variant: "neutral" }} />
            <Tab value="activity" label="Activity" />
            <Tab value="settings" label="Settings" />
          </TabList>
          <TabPanel value="overview">Account overview.</TabPanel>
          <TabPanel value="activity">Recent account activity.</TabPanel>
          <TabPanel value="settings">Account settings.</TabPanel>
        </Tabs>
      </section>
    </main>
  </React.StrictMode>,
);
