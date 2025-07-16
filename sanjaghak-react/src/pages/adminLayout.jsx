import React from "react";
import { Outlet } from "react-router-dom";
import AdminNav from "./adminNav";
import AdminParticlesBackground from "./adminParticleBackground";

function AdminLayout() {
  return (
    <div className="adminPageRoot" style={{ position: "relative", minHeight: "100vh", overflowX: "hidden" }}>
      <AdminParticlesBackground />

      <div className="adminMainContent" style={{ position: "relative", zIndex: 1, display: "flex" }}>
        <AdminNav />
        <div className="adminContent" style={{ flexGrow: 1, padding: "20px" }}>
          <Outlet /> {/* this is where child routes will be rendered */}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;