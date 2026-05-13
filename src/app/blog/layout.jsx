export const metadata = {
  title: "Blog Archive",
  description:
    "Legacy blog entry point for Sharma Real Estates advice articles and property insights.",
  alternates: {
    canonical: "/advice",
  },
  robots: {
    index: false,
    follow: true,
    nocache: false,
    googleBot: {
      index: false,
      follow: true,
      noimageindex: true,
    },
  },
};

export default function BlogLayout({ children }) {
  return children;
}