import { BarChart, MessageSquare, PlusCircle, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import FeedbackTab from "../components/FeedbackTab";
import { useProductStore } from "../stores/useProductStore";

const tabs = [
  {
    id: "create",
    label: "Create Product",
    icon: PlusCircle,
  },
  {
    id: "products",
    label: "Products",
    icon: ShoppingBasket,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart,
  },
  {
    id: "feedback",
    label: "Feedbacks",
    icon: MessageSquare,
  },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("create");

  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.h1
          className="
            text-4xl
            font-bold
            mb-8
            text-center
            text-emerald-500
          "
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
        >
          Admin Dashboard
        </motion.h1>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex
                  items-center
                  gap-2
                  px-5
                  py-3
                  rounded-lg
                  transition

                  ${
                    activeTab === tab.id
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }
                `}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}

        {activeTab === "create" && <CreateProductForm />}

        {activeTab === "products" && <ProductsList />}

        {activeTab === "analytics" && <AnalyticsTab />}

        {activeTab === "feedback" && <FeedbackTab />}
      </div>
    </div>
  );
};

export default AdminPage;
