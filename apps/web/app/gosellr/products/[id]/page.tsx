"use client";

import { useState, CSSProperties } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { stlLevelChipClasses } from "@/lib/stl/chipTone";

// ============= TYPES =============
interface ProductDetail {
  id: string;
  name: string;
  description: string;
  longDescription: string;
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
    owner: number;
    final: number;
  };
  images: string[];
  inStock: boolean;
  seller: {
    id: string;
    name: string;
    stlLevel: number;
    rating: number;
    ratingCount: number;
    verified: boolean;
    pssVerified: boolean;
    crbVerified: boolean;
  };
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    stlLevel: number;
    comment: string;
    date: string;
  }>;
  ratingBreakdown: Record<number, number>;
  deliveryDays: number;
  deliveryOptions: string[];
  commission: {
    seller: number;
    franchise: number;
    platform: number;
  };
  similarProducts: Array<{
    id: string;
    name: string;
    price: number;
    rating: number;
    image: string;
  }>;
}

// ============= MOCK DATA =============
const MOCK_PRODUCTS_MAP: Record<string, ProductDetail> = {
  "prod-001": {
    id: "prod-001",
    name: "Premium Wireless Headphones Pro X",
    description: "High-fidelity audio with active noise cancellation",
    longDescription:
      "Experience premium sound with our Pro X headphones featuring advanced noise-cancellation technology, 40-hour battery life, and premium comfort design. Perfect for professionals and audio enthusiasts.",
    category: "Electronics",
    price: 89.99,
    oldPrice: 129.99,
    rating: 4.8,
    ratingCount: 342,
    stlLevel: 7,
    stlChain: { product: 7, seller: 6, company: 6, owner: 6, final: 6 },
    images: ["grad-1", "grad-2", "grad-3", "grad-4"],
    inStock: true,
    seller: {
      id: "seller-001",
      name: "AudioTech Verified Store",
      stlLevel: 6,
      rating: 4.7,
      ratingCount: 1243,
      verified: true,
      pssVerified: true,
      crbVerified: true,
    },
    reviews: [
      {
        id: "rev-1",
        author: "James M.",
        rating: 5,
        stlLevel: 5,
        comment: "Excellent sound quality and comfort. Highly recommended!",
        date: "2026-04-15",
      },
      {
        id: "rev-2",
        author: "Sarah K.",
        rating: 5,
        stlLevel: 6,
        comment: "Best headphones I've ever owned. Battery life is amazing.",
        date: "2026-04-10",
      },
      {
        id: "rev-3",
        author: "Michael R.",
        rating: 4,
        stlLevel: 4,
        comment: "Great product, shipping was quick.",
        date: "2026-04-08",
      },
      {
        id: "rev-4",
        author: "Emma L.",
        rating: 5,
        stlLevel: 7,
        comment: "Premium quality. Worth the price.",
        date: "2026-04-05",
      },
      {
        id: "rev-5",
        author: "David P.",
        rating: 4,
        stlLevel: 5,
        comment: "Good value for money.",
        date: "2026-04-01",
      },
    ],
    ratingBreakdown: { 5: 45, 4: 30, 3: 15, 2: 7, 1: 3 },
    deliveryDays: 3,
    deliveryOptions: ["Standard Shipping (3 days)", "Express Shipping (1 day)"],
    commission: { seller: 85, franchise: 10, platform: 5 },
    similarProducts: [
      { id: "prod-005", name: "Smart Home Hub WiFi 6", price: 119.99, rating: 4.5, image: "grad-5" },
      { id: "prod-010", name: "Portable SSD 1TB", price: 99.99, rating: 4.7, image: "grad-10" },
      { id: "prod-003", name: "Vitamin C Supplement 500mg", price: 14.99, rating: 4.9, image: "grad-3" },
      { id: "prod-007", name: "Business English Course Pack", price: 49.99, rating: 4.8, image: "grad-7" },
    ],
  },
};

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
  };
  return <div style={gradients[variant] || gradients["grad-1"]} />;
}

function RatingBar({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold w-8">{rating}★</span>
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.1)",
        } as CSSProperties}
        className="flex-1 h-2 rounded-full border overflow-hidden"
      >
        <div
          style={{
            width: `${count}%`,
            background: "linear-gradient(90deg, #F0A030 0%, #E8942A 100%)",
          } as CSSProperties}
          className="h-full"
        />
      </div>
      <span className="text-xs text-gray-400 w-12">{count}%</span>
    </div>
  );
}

// ============= MAIN PAGE =============
export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  // Fallback for demo
  const product = MOCK_PRODUCTS_MAP[productId] || MOCK_PRODUCTS_MAP["prod-001"];
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 3000);
  };

  const minStl = Math.min(product.stlChain.product, product.stlChain.seller, product.stlChain.company);

  return (
    <main className="min-h-screen text-white pb-8">
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }} className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex gap-2 text-xs text-gray-400">
          <Link href="/gosellr/products" className="hover:text-cyan-300">
            Products
          </Link>
          <span>/</span>
          <span className="text-cyan-300">{product.name}</span>
        </div>

        {/* Product Main Section */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Images */}
          <div className="lg:col-span-1 space-y-3">
            {/* Main Image */}
            <div
              style={{
                backgroundColor: "rgba(19, 22, 42, 0.92)",
                borderColor: "rgba(255, 255, 255, 0.1)",
              } as CSSProperties}
              className="relative w-full aspect-square rounded-[12px] border overflow-hidden"
            >
              <GradientPlaceholder variant={product.images[selectedImage]} />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    backgroundColor: "rgba(19, 22, 42, 0.92)",
                    borderColor: selectedImage === idx ? "rgba(51, 195, 255, 0.5)" : "rgba(255, 255, 255, 0.1)",
                  } as CSSProperties}
                  className="w-20 h-20 rounded-lg border overflow-hidden transition-all"
                >
                  <GradientPlaceholder variant={img} />
                </button>
              ))}
            </div>
          </div>

          {/* Middle: Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-3">{product.name}</h1>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-amber-300">★ {product.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">({product.ratingCount.toLocaleString()} reviews)</span>
                </div>
                <span
                  style={{
                    backgroundColor: product.inStock ? "rgba(34, 197, 94, 0.15)" : "rgba(240, 88, 88, 0.15)",
                    borderColor: product.inStock ? "rgba(34, 197, 94, 0.3)" : "rgba(240, 88, 88, 0.3)",
                  } as CSSProperties}
                  className="rounded-full border px-3 py-1 text-xs font-semibold"
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <p className="text-gray-300">{product.description}</p>
            </div>

            {/* Price */}
            <div
              style={{
                backgroundColor: "rgba(19, 22, 42, 0.92)",
                borderColor: "rgba(51, 195, 255, 0.2)",
                borderWidth: "2px",
              } as CSSProperties}
              className="rounded-[12px] border p-4 space-y-2"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-cyan-200">${product.price.toFixed(2)}</span>
                <span className="text-lg text-gray-500 line-through">${product.oldPrice.toFixed(2)}</span>
                <span className="text-sm font-semibold text-amber-300">
                  Save ${(product.oldPrice - product.price).toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-400">Category: {product.category}</p>
            </div>

            {/* STL Trust Chain */}
            <div
              style={{
                backgroundColor: "rgba(19, 22, 42, 0.92)",
                borderColor: "rgba(255, 255, 255, 0.1)",
              } as CSSProperties}
              className="rounded-[12px] border p-4 space-y-3"
            >
              <h3 className="text-sm font-semibold">STL Trust Chain</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Product Level:</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono font-semibold ${stlLevelChipClasses(
                      product.stlChain.product
                    )}`}
                  >
                    L{product.stlChain.product}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Seller Level:</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono font-semibold ${stlLevelChipClasses(
                      product.stlChain.seller
                    )}`}
                  >
                    L{product.stlChain.seller}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Company Level:</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono font-semibold ${stlLevelChipClasses(
                      product.stlChain.company
                    )}`}
                  >
                    L{product.stlChain.company}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Owner Level:</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono font-semibold ${stlLevelChipClasses(
                      product.stlChain.owner
                    )}`}
                  >
                    L{product.stlChain.owner}
                  </span>
                </div>
                <div className="border-t border-gray-600 pt-2 flex items-center justify-between bg-black/30 px-2 py-2 rounded">
                  <span className="font-semibold text-amber-300">Final Trust Level:</span>
                  <span
                    className={`rounded-full px-3 py-0.5 font-mono font-bold ${stlLevelChipClasses(
                      minStl
                    )}`}
                  >
                    L{minStl}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 pt-2">
                Final STL is the minimum across all trust chain components.
              </p>
            </div>

            {/* Add to Cart & Quantity */}
            <div className="flex gap-3 items-end">
              <div>
                <label className="block text-xs font-semibold mb-2 text-gray-300">Quantity</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderColor: "rgba(255, 255, 255, 0.15)",
                    } as CSSProperties}
                    className="rounded-lg border w-10 h-10 flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderColor: "rgba(255, 255, 255, 0.15)",
                    } as CSSProperties}
                    className="rounded-lg border w-10 h-10 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                style={{
                  background: "linear-gradient(135deg, #F0A030 0%, #E8942A 100%)",
                  boxShadow: "0 4px 12px rgba(240, 160, 48, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                } as CSSProperties}
                className="flex-1 py-3 rounded-lg text-sm font-semibold text-gray-900 hover:shadow-lg hover:shadow-amber-500/40 transition-all active:translate-y-0.5"
              >
                Add {quantity} to Cart
              </button>
            </div>

            {showAddedToCart && (
              <div className="rounded-lg bg-emerald-500/20 border border-emerald-400/40 px-4 py-3 text-sm text-emerald-100">
                ✓ Added to cart successfully!
              </div>
            )}
          </div>
        </div>

        {/* Seller Info Section */}
        <div
          style={{
            backgroundColor: "rgba(19, 22, 42, 0.92)",
            borderColor: "rgba(255, 255, 255, 0.1)",
          } as CSSProperties}
          className="rounded-[12px] border p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold">Seller Information</h3>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h4 className="text-base font-semibold text-white">{product.seller.name}</h4>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-amber-300">★ {product.seller.rating.toFixed(1)}</span>
                <span className="text-gray-400">({product.seller.ratingCount.toLocaleString()} reviews)</span>
              </div>
              <div className="flex gap-2">
                {product.seller.pssVerified && (
                  <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-100 font-semibold">
                    ✓ PSS Verified
                  </span>
                )}
                {product.seller.crbVerified && (
                  <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-2 py-1 text-[10px] text-cyan-100 font-semibold">
                    ✓ CRB Verified
                  </span>
                )}
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 font-mono font-semibold text-xs ${stlLevelChipClasses(
                product.seller.stlLevel
              )}`}
            >
              STL L{product.seller.stlLevel}
            </span>
          </div>
          <p className="text-xs text-gray-400 pt-2">
            Delivery estimate: {product.deliveryDays} business day(s). Free shipping on orders over $50.
          </p>
        </div>

        {/* Delivery & Commission Info */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Delivery Options */}
          <div
            style={{
              backgroundColor: "rgba(19, 22, 42, 0.92)",
              borderColor: "rgba(255, 255, 255, 0.1)",
            } as CSSProperties}
            className="rounded-[12px] border p-6 space-y-4"
          >
            <h3 className="text-sm font-semibold">Delivery Options</h3>
            <div className="space-y-2">
              {product.deliveryOptions.map((opt, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    defaultChecked={idx === 0}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-300">{opt}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 pt-2">
              Choose between DMO rider delivery or self-delivery pickup at local partner locations.
            </p>
          </div>

          {/* Commission Transparency */}
          <div
            style={{
              backgroundColor: "rgba(19, 22, 42, 0.92)",
              borderColor: "rgba(255, 255, 255, 0.1)",
            } as CSSProperties}
            className="rounded-[12px] border p-6 space-y-4"
          >
            <h3 className="text-sm font-semibold">Commission Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Seller receives:</span>
                <span className="text-emerald-300 font-semibold">{product.commission.seller}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Franchise network:</span>
                <span className="text-blue-300 font-semibold">{product.commission.franchise}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Platform:</span>
                <span className="text-purple-300 font-semibold">{product.commission.platform}%</span>
              </div>
            </div>
            <div
              style={{
                background: "linear-gradient(90deg, rgba(34, 197, 94, 0.1), rgba(51, 195, 255, 0.1), rgba(168, 85, 247, 0.1))",
              } as CSSProperties}
              className="rounded-lg p-3 mt-3 text-xs text-gray-400"
            >
              Transparent revenue split ensures fair compensation across the EHB ecosystem.
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div
          style={{
            backgroundColor: "rgba(19, 22, 42, 0.92)",
            borderColor: "rgba(255, 255, 255, 0.1)",
          } as CSSProperties}
          className="rounded-[12px] border p-6 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Customer Reviews</h3>
            <button
              style={{
                background: "linear-gradient(135deg, #F0A030 0%, #E8942A 100%)",
                boxShadow: "0 2px 6px rgba(240, 160, 48, 0.25)",
              } as CSSProperties}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-900"
            >
              Write Review
            </button>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-400 mb-3">Rating Distribution</h4>
            <RatingBar rating={5} count={product.ratingBreakdown[5]} />
            <RatingBar rating={4} count={product.ratingBreakdown[4]} />
            <RatingBar rating={3} count={product.ratingBreakdown[3]} />
            <RatingBar rating={2} count={product.ratingBreakdown[2]} />
            <RatingBar rating={1} count={product.ratingBreakdown[1]} />
          </div>

          {/* Review List */}
          <div className="space-y-4 border-t border-gray-700 pt-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="text-sm font-semibold text-white">{review.author}</h5>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="text-amber-300">{"★".repeat(review.rating)}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 font-mono font-semibold ${stlLevelChipClasses(
                          review.stlLevel
                        )}`}
                      >
                        L{review.stlLevel}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
                <p className="text-sm text-gray-300">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Products / AI Recommendations */}
        <div
          style={{
            backgroundColor: "rgba(19, 22, 42, 0.92)",
            borderColor: "rgba(255, 255, 255, 0.1)",
          } as CSSProperties}
          className="rounded-[12px] border p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold">Customers Also Bought</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {product.similarProducts.map((prod) => (
              <Link key={prod.id} href={`/gosellr/products/${prod.id}`}>
                <div
                  style={{
                    backgroundColor: "rgba(19, 22, 42, 0.92)",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  } as CSSProperties}
                  className="rounded-lg border p-3 group cursor-pointer hover:border-cyan-500/40 transition-all"
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden mb-2">
                    <GradientPlaceholder variant={prod.image} />
                  </div>
                  <h4 className="text-xs font-semibold text-white group-hover:text-cyan-200 line-clamp-2">
                    {prod.name}
                  </h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-cyan-200">${prod.price.toFixed(2)}</span>
                    <span className="text-[10px] text-amber-300">★ {prod.rating.toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Product Description */}
        <div
          style={{
            backgroundColor: "rgba(19, 22, 42, 0.92)",
            borderColor: "rgba(255, 255, 255, 0.1)",
          } as CSSProperties}
          className="rounded-[12px] border p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold">Product Details</h3>
          <p className="text-sm text-gray-300 leading-relaxed">{product.longDescription}</p>
          <div className="grid gap-4 md:grid-cols-2 pt-4 border-t border-gray-700">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-2">Specifications</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>Category: {product.category}</li>
                <li>Stock Status: {product.inStock ? "In Stock" : "Out of Stock"}</li>
                <li>Seller: {product.seller.name}</li>
                <li>Returns: 30-day money back guarantee</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-2">Shipping</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>Delivery: {product.deliveryDays} business day(s)</li>
                <li>Free shipping on orders $50+</li>
                <li>Track your order in real-time</li>
                <li>Secure packaging guaranteed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
