import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  Truck,
  ShieldCheck,
  Headphones,
  Loader,
} from "lucide-react";

import {
  FaInstagram,
  FaFacebook,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import { toast } from "react-hot-toast";
import { useFeedbackStore } from "../stores/useFeedbackStore";
import { useUserStore } from "../stores/useUserStore";

const Footer = () => {
  const [feedback, setFeedback] = useState("");
  const { submitFeedback, loading } = useFeedbackStore();
  const { user } = useUserStore();

  const isAdmin = user?.role === "admin";

  const handleFeedback = async (e) => {
    e.preventDefault();

    if (!feedback.trim()) {
      toast.error("Please enter your feedback");
      return;
    }

    const success = await submitFeedback({ comment: feedback });
    if (success) {
      setFeedback("");
    }
  };

  return (
    <footer
      className="
        bg-gray-100
        text-gray-700
        border-t
        border-gray-200

        dark:bg-slate-950
        dark:text-slate-300
        dark:border-slate-800

        transition-colors
        duration-300
      "
    >
      {/* FEATURES */}
      <div
        className="
          bg-gray-200
          border-b
          border-gray-300

          dark:bg-slate-900
          dark:border-slate-800
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-6
            px-6
            py-8
          "
        >
          {[
            [Truck, "Fast Delivery", "Across Nepal"],
            [ShieldCheck, "Secure Shopping", "Safe & Trusted"],
            [Headphones, "24/7 Support", "Customer Assistance"],
          ].map(([Icon, title, text]) => (
            <div key={title} className="flex gap-4 items-center">
              <Icon className="text-emerald-500 dark:text-emerald-400" />

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className={`grid gap-12 ${isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-5"}`}>
          {/* BRAND */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Nep
              <span className="text-emerald-600 dark:text-emerald-400">
                Cart
              </span>
            </h2>

            <p
              className="
              mt-4
              text-gray-600
              dark:text-slate-400
              max-w-md
            "
            >
              NepCart is Nepal's modern ecommerce platform for fashion,
              electronics and lifestyle products with trusted delivery and
              quality service.
            </p>

            <div className="mt-6 space-y-3">
              <a
                href="https://maps.google.com/?q=Thamel,Kathmandu,Nepal"
                target="_blank"
                rel="noreferrer"
                className="flex gap-3 items-center hover:text-emerald-500"
              >
                <MapPin size={18} />
                Kathmandu, Nepal
              </a>

              <a
                href="mailto:support@nepcart.com"
                className="flex gap-3 items-center hover:text-emerald-500"
              >
                <Mail size={18} />
                support@nepcart.com
              </a>

              <a
                href="tel:+977015551234"
                className="flex gap-3 items-center hover:text-emerald-500"
              >
                <Phone size={18} />
                +977 01-5551234
              </a>
            </div>

            <div className="flex gap-3 mt-8">
              {[FaFacebook, FaInstagram, FaXTwitter, FaYoutube].map(
                (Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="
                      p-3
                      rounded-full

                      bg-gray-300
                      text-gray-800

                      dark:bg-slate-800
                      dark:text-white

                      hover:bg-emerald-500
                      hover:text-black

                      transition
                    "
                  >
                    <Icon />
                  </a>
                ),
              )}
            </div>
          </div>

          {/* LINKS */}

          <div>
            <h3 className="font-semibold mb-5 text-gray-900 dark:text-white">
              Shop
            </h3>

            <div className="space-y-3">
              {[
                ["Fashion", "/category/fashion"],
                ["Shoes", "/category/shoes"],
                ["Electronics", "/category/electronics"],
                ["Bags", "/category/bags"],
                ["Accessories", "/category/accessories"],
              ].map(([name, path]) => (
                <Link
                  key={name}
                  to={path}
                  className="
                    block
                    text-gray-600
                    dark:text-slate-400
                    hover:text-emerald-500
                  "
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-5 text-gray-900 dark:text-white">
              Customer Service
            </h3>

            <div className="space-y-3">
              {[
                ["Help Center", "/help-center"],
                ["Track Order", "/track-order"],
                ["Return Policy", "/return-policy"],
                ["Privacy Policy", "/privacy-policy"],
                ["Terms & Conditions", "/terms"],
              ].map(([name, path]) => (
                <Link
                  key={name}
                  to={path}
                  className="
                    block
                    text-gray-600
                    dark:text-slate-400
                    hover:text-emerald-500
                  "
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>

          {/* FEEDBACK - Only rendered for customers and guests */}

          {!isAdmin && (
            <div>
              <h3 className="font-semibold mb-5 text-gray-900 dark:text-white">
                Feedback
              </h3>

              <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                Help us improve NepCart.
              </p>

              <form onSubmit={handleFeedback}>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Write your feedback..."
                  className="
                    w-full
                    h-28
                    rounded-xl
                    px-4
                    py-3

                    bg-white
                    border-gray-300
                    text-gray-900

                    dark:bg-slate-900
                    dark:border-slate-700
                    dark:text-white

                    border
                    outline-none
                    resize-none
                    focus:border-emerald-500
                  "
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-3
                    w-full
                    bg-emerald-500
                    text-black
                    font-semibold
                    rounded-xl
                    py-3
                    hover:bg-emerald-400
                    disabled:opacity-50
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition
                  "
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Feedback"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        <div
          className="
          mt-10
          border-t
          pt-6
          text-center
          text-sm

          border-gray-300
          text-gray-500

          dark:border-slate-800
          dark:text-slate-500
        "
        >
          © 2026 NepCart. All Rights Reserved.
          <br />
          NepCart - Nepal's trusted ecommerce platform.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
