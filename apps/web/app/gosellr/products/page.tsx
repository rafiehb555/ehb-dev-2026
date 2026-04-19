"use client";

import { useState, useMemo, CSSProperties } from "react";
import Link from "next/link";
import { stlLevelChipClasses } from "@/lib/stl/chipTone";

// ============= TYPES =============
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  rating: number;
  ratingCount: number;
  stlLevel: number;
  stlChain: {
    product: number;
    seller: number;
    company: number;
    final: number;
  };
  image: string;
  inStock: boolean;
}

// ============= MOCK DATA =============
const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-001",
    name: "Premium Wireless Headphones",
    category: "Electronics",
    price: 89.99,
    oldPrice: 129.99,
    rating: 4.8,
    ratingCount: 342,
    stlLevel: 7,
    stlChain: { product: 7, seller: 6, company: 6, final: 6 },
    image: "grad-1",
    inStock: true,
  },
  {
    id: "prod-002",
    name: "Organic Cotton T-Shirt",
    category: "Fashion",
    price: 24.99,
    oldPrice: 39.99,
    rating: 4.6,
    ratingCount: 218,
    stlLevel: 6,
    stlChain: { product: 6, seller: 5, company: 5, final: 5 },
    image: "grad-2",
    inStock: true,
  },
  {
    id: "prod-003",
    name: "Vitamin C Supplement 500mg",
    category: "Health",
    price: 14.99,
    oldPrice: 24.99,
    rating: 4.9,
    ratingCount: 1205,
    stlLevel: 8,
    stlChain: { product: 8, seller: 7, company: 7, final: 7 },
    image: "grad-3",
    inStock: true,
  },
  {
    id: "prod-004",
    name: "Organic Gourmet Coffee Beans 1kg",
    category: "Food",
    price: 19.99,
    oldPrice: 28.99,
    rating: 4.7,
    ratingCount: 567,
    stlLevel: 7,
    stlChain: { product: 7, seller: 6, company: 6, final: 6 },
    image: "grad-4",
    inStock: true,
  },
  {
    id: "prod-005",
    name: "Smart Home Hub WiFi 6",
    category: "Electronics",
    price: 119.99,
    oldPrice: 179.99,
    rating: 4.5,
    ratingCount: 421,
    stlLevel: 6,
    stlChain: { product: 6, seller: 5, company: 5, final: 5 },
    image: "grad-5",
    inStock: true,
  },
  {
    id: "prod-006",
    name: "Professional Yoga Mat",
    category: "Services",
    price: 34.99,
    oldPrice: 49.99,
    rating: 4.4,
    ratingCount: 189,
    stlLevel: 5,
    stlChain: { product: 5, seller: 4, company: 4, final: 4 },
    image: "grad-6",
    inStock: true,
  },
  {
    id: "prod-007",
    name: "Business English Course Pack",
    category: "Education",
    price: 49.99,
    oldPrice: 99.99,
    rating: 4.8,
    ratingCount: 876,
    stlLevel: 7,
    stlChain: { product: 7, seller: 6, company: 6, final: 6 },
    image: "grad-7",
    inStock: true,
  },
  {
    id: "prod-008",
    name: "Stainless Steel Kitchen Knife Set",
    category: "Food",
    price: 59.99,
    oldPrice: 99.99,
    rating: 4.6,
    ratingCount: 342,
    stlLevel: 6,
    stlChain: { product: 6, seller: 5, company: 5, final: 5 },
    image: "grad-8",
    inStock: true,
  },
  {
    id: "prod-009",
    name: "Ultra-Soft Bamboo Bed Sheets",
    category: "Fashion",
    price: 79.99,
    oldPrice: 129.99,
    rating: 4.9,
    ratingCount: 654,
    stlLevel: 8,
    stlChain: { product: 8, seller: 7, company: 7, final: 7 },
    image: "grad-9",
    inStock: true,
  },
  {
    id: "prod-010",
    name: "Portable SSD 1TB",
    category: "Electronics",
    price: 99.99,
    oldPrice: 159.99,
    rating: 4.7,
    ratingCount: 512,
    stlLevel: 7,
    stlChain: { product: 7, seller: 6, company: 6, final: 6 },
    image: "grad-10",
    inStock: true,
  },
  {
    id: "prod-011",
    name: "Meditation & Mindfulness App Subscription",
    category: "Health",
    price: 9.99,
    oldPrice: 14.99,
    rating: 4.5,
    ratingCount: 1023,
    stlLevel: 5,
    stlChain: { product: 5, seller: 4, company: 4, final: 4 },
    image: "grad-11",
    inStock: true,
  },
  {
    id: "prod-012",
    name: "Premium Leather Wallet",
    category: "Fashion",
    price: 44.99,
    oldPrice: 74.99,
    rating: 4.6,
    ratingCount: 278,
    stlLevel: 6,
    stlChain: { product: 6, seller: 5, company: 5, final: 5 },
    image: "grad-12",
    inStock: true,
  },
];

const CATEGORIES = ["All", "Electronics", "Fashion", "Health", "Food", "Services", "Education"];

// ============= COMPONENTS =============
function GradientPlaceholder({ variant }: { variant: string }) {
  const gradients: Record<string, CSSProperties> = {
    "grad-1": { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    "grad-2": { background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    "grad-3": { background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    "grad-4": { background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
    "grad-5": { background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
    "grad-6": { background: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)" },
    "grad-7": { background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
    "grad-8": { background: "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)" },
    "grad-9": { background: "linear-gradient(135deg, #2e2e78 0%, #662d8c 100%)" },
    "grad-10": { background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
    "grad-11": { background: "linear-gradient(135deg, #88d3ce 0%, #6e5baa 100%)" },
    "grad-12": { background: "linear-gradient(135deg, #f1a208 0%, #f4723b 100%)" },
  };
  return <div style={gradients[variant] || gradients["grad-1"]} />;
}

function ProductCard({ product }: { product: Product }) {
  const minStl = Math.min(product.stlChain.product, product.stlChain.seller, product.stlChain.company);

  return (
    <Link href={`/gosellr/products/${product.id}`}>
      <div
        style={{
          backgroundColor: "rgba(19, 22, 42, 0.92)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255, 255, 255, 0.14)",
          transition: "all 0.3s ease",
        } as CSSProperties}
        className="rounded-[12px] border p-4 group cursor-pointer hover:shadow-lg hover:shadow-cyan-500/20"
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(0)";
        }}
      >
        {/* Image */}
        <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3">
          <GradientPlaceholder variant={product.image} />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-cyan-200 transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-bold text-cyan-200">${product.price.toFixed(2)}</span>
          <span className="text-xs text-gray-400 line-through">${product.oldPrice.toFixed(2)}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2 text-[11px]">
          <span className="text-amber-300">★ {product.rating.toFixed(1)}</span>
          <span className="text-gray-500">({product.ratingCount})</span>
        </div>

        {/* STL Chain */}
        <div className="mt-2 p-2 rounded-lg bg-black/20 text-[10px] text-gray-300">
          <div className="flex justify-between items-center">
            <span>STL Chain:</span>
            <span className="text-cyan-300 font-mono">
              P{product.stlChain.product} • S{product.stlChain.seller} • C{product.stlChain.company} = L{minStl}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          style={{
            background: "linear-gradient(135deg, #F0A030 0%, #E8942A 100%)",
            boxShadow: "0 4px 12px rgba(240, 160, 48, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
          } as CSSProperties}
          className="w-full mt-3 py-2 rounded-lg text-xs font-semibold text-gray-900 hover:shadow-lg hover:shadow-amber-500/40 transition-all active:translate-y-0.5"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
}

// ============= MAIN PAGE =============
export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [minRating, setMinRating] = useState(0);
  const [minStlLevel, setMinStlLevel] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = MOCK_PRODUCTS.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesRating = p.rating >= minRating;
      const matchesStl = p.stlLevel >= minStlLevel;
      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStl;
    });

    // Apply sorting
    if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "stl") filtered.sort((a, b) => b.stlLevel - a.stlLevel);
    else if (sortBy === "newest") filtered.reverse();

    return filtered;
  }, [searchQuery, selectedCategory, priceRange, minRating, minStlLevel, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="min-h-screen text-white">
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem" }} className="space-y-6">
        {/* Header */}
        <section
          style={{
            backgroundColor: "rgba(10, 22, 40, 1)",
            borderColor: "rgba(51, 195, 255, 0.25)",
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 100% 0%, rgba(34, 197, 94, 0.08), transparent 50%)",
          } as CSSProperties}
          className="rounded-3xl border p-8 space-y-4"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">GoSellr Marketplace</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Explore Products</h1>
            <p className="mt-2 text-sm text-gray-400">
              Verified sellers with transparent STL trust chains. Filter by category, price, rating, and trust level.
            </p>
          </div>
        </section>

        {/* Search & Filters */}
        <section
          style={{
            backgroundColor: "rgba(19, 22, 42, 0.92)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(255, 255, 255, 0.1)",
          } as CSSProperties}
          className="rounded-[12px] border p-4 space-y-4"
        >
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderColor: "rgba(255, 255, 255, 0.15)",
            } as CSSProperties}
            className="w-full rounded-lg border px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />

          {/* Filter Row 1: Category, Price, Rating */}
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-300">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                } as CSSProperties}
                className="w-full rounded-lg border px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-gray-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-300">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
              <input
                type="range"
                min="0"
                max="200"
                value={priceRange[1]}
                onChange={(e) => {
                  setPriceRange([priceRange[0], Number(e.target.value)]);
                  setCurrentPage(1);
                }}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-300">Min Rating</label>
              <select
                value={String(minRating)}
                onChange={(e) => {
                  setMinRating(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                } as CSSProperties}
                className="w-full rounded-lg border px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="0">All</option>
                <option value="3">3★+</option>
                <option value="4">4★+</option>
                <option value="4.5">4.5★+</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-300">Min STL Level</label>
              <select
                value={String(minStlLevel)}
                onChange={(e) => {
                  setMinStlLevel(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                } as CSSProperties}
                className="w-full rounded-lg border px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="0">Any Level</option>
                <option value="4">L4+</option>
                <option value="5">L5+</option>
                <option value="6">L6+</option>
                <option value="7">L7+</option>
              </select>
            </div>
          </div>

          {/* Filter Row 2: Sort */}
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1 text-gray-300">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                } as CSSProperties}
                className="w-full rounded-lg border px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
                <option value="stl">Highest STL Level</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            <div className="text-xs text-gray-400">
              {filteredProducts.length} results found
            </div>
          </div>
        </section>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              style={{
                backgroundColor: selectedCategory === cat ? "rgba(51, 195, 255, 0.2)" : "rgba(255, 255, 255, 0.05)",
                borderColor: selectedCategory === cat ? "rgba(51, 195, 255, 0.5)" : "rgba(255, 255, 255, 0.15)",
              } as CSSProperties}
              className="rounded-full border px-4 py-1.5 text-xs font-medium text-white whitespace-nowrap transition-all"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <section>
          {paginatedProducts.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "rgba(19, 22, 42, 0.92)",
                borderColor: "rgba(255, 255, 255, 0.1)",
              } as CSSProperties}
              className="rounded-[12px] border p-8 text-center text-gray-400"
            >
              No products found matching your filters.
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                backgroundColor: currentPage === 1 ? "rgba(255, 255, 255, 0.05)" : "rgba(51, 195, 255, 0.15)",
                borderColor: "rgba(255, 255, 255, 0.15)",
              } as CSSProperties}
              className="rounded-lg border px-4 py-2 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  backgroundColor: currentPage === page ? "rgba(51, 195, 255, 0.3)" : "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                } as CSSProperties}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                  currentPage === page ? "text-cyan-200" : "text-white"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                backgroundColor: currentPage === totalPages ? "rgba(255, 255, 255, 0.05)" : "rgba(51, 195, 255, 0.15)",
                borderColor: "rgba(255, 255, 255, 0.15)",
              } as CSSProperties}
              className="rounded-lg border px-4 py-2 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
