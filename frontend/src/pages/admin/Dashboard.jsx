import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import Inventory from "./Inventory";
import Orders from "./Orders";
import Users from "./Users";
import Reports from "./Reports";
import Navbar from "../../components/Navbar";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("inventory");

  const renderContent = () => {
    switch (activeTab) {
      case "inventory":
        return <Inventory />;
      case "orders":
        return <Orders />;
      case "users":
        return <Users />;
      case "reports":
        return <Reports />;
      default:
        return <Inventory />;
    }
  };

  return (
    <>
      <Navbar />{" "}
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
      </div>
    </>
  );
}
