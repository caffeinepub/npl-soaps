import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronRight,
  CreditCard,
  FlaskConical,
  Heart,
  Leaf,
  Mail,
  Menu,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  Shield,
  ShoppingCart,
  Star,
  Truck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSubmitContactForm } from "./hooks/useQueries";

const products = [
  {
    id: 1,
    name: "Rose Glow Soap",
    benefits: "Brightening & Anti-aging",
    price: "৳450",
    priceNum: 450,
    image: "/assets/generated/soap-rose-glow.dim_400x400.jpg",
  },
  {
    id: 2,
    name: "Charcoal Detox Soap",
    benefits: "Deep Cleansing & Anti-acne",
    price: "৳480",
    priceNum: 480,
    image: "/assets/generated/soap-charcoal.dim_400x400.jpg",
  },
  {
    id: 3,
    name: "Lavender Dream Soap",
    benefits: "Calming & Moisturizing",
    price: "৳420",
    priceNum: 420,
    image: "/assets/generated/soap-lavender.dim_400x400.jpg",
  },
  {
    id: 4,
    name: "Honey Oat Soap",
    benefits: "Nourishing & Softening",
    price: "৳460",
    priceNum: 460,
    image: "/assets/generated/soap-honey-oat.dim_400x400.jpg",
  },
  {
    id: 5,
    name: "Citrus Fresh Soap",
    benefits: "Energizing & Brightening",
    price: "৳430",
    priceNum: 430,
    image: "/assets/generated/soap-citrus.dim_400x400.jpg",
  },
  {
    id: 6,
    name: "Aloe Vera Soap",
    benefits: "Soothing & Hydrating",
    price: "৳440",
    priceNum: 440,
    image: "/assets/generated/soap-aloe.dim_400x400.jpg",
  },
];

interface CartItem {
  id: number;
  name: string;
  price: string;
  priceNum: number;
  image: string;
  qty: number;
}

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function FadeSection({
  children,
  className = "",
  delay = 0,
}: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const submitContact = useSubmitContactForm();

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.priceNum * item.qty,
    0,
  );

  function addToCart(product: (typeof products)[0]) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    toast.success(`${product.name} added to cart!`);
  }

  function removeFromCart(id: number) {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQty(id: number, delta: number) {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i,
      ),
    );
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await submitContact.mutateAsync(contactForm);
      toast.success("Message sent! We'll get back to you soon.");
      setContactForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  }

  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Thank you for subscribing!");
    setNewsletterEmail("");
  }

  const navLinks = [
    "Shop",
    "Our Story",
    "Collections",
    "Ingredients",
    "Contact",
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      <Toaster position="top-right" />

      {/* Announcement Bar */}
      <div className="bg-gold text-white text-center text-xs md:text-sm py-2 px-4 font-body tracking-wide">
        🌿 Free delivery on orders over ৳1500 across Bangladesh — Handcrafted
        with love
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="font-display text-2xl font-bold text-foreground tracking-tight"
          >
            Npl <span className="text-gold">Soaps</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href={
                  link === "Shop"
                    ? "#products"
                    : link === "Contact"
                      ? "#contact"
                      : link === "Our Story"
                        ? "#about"
                        : "#"
                }
                data-ocid={`nav.${link.toLowerCase().replace(" ", "_")}.link`}
                className="text-sm font-body text-foreground/70 hover:text-gold transition-colors duration-200 tracking-wide"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Cart + Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              data-ocid="cart.open_modal_button"
              className="relative p-2 hover:bg-cream rounded-full transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart size={22} className="text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border bg-white overflow-hidden"
            >
              <nav className="flex flex-col px-6 py-4 gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link}
                    href={
                      link === "Shop"
                        ? "#products"
                        : link === "Contact"
                          ? "#contact"
                          : link === "Our Story"
                            ? "#about"
                            : "#"
                    }
                    className="text-sm font-body text-foreground/70 hover:text-gold transition-colors py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative h-[520px] md:h-[680px] w-full">
          <img
            src="/assets/generated/hero-banner.dim_1400x700.jpg"
            alt="Npl Soaps - Luxury Handmade Soaps"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-6xl mx-auto px-6 md:px-12 w-full">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="max-w-xl"
              >
                <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-4">
                  Pure Luxury for Your Skin
                </p>
                <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-5">
                  Indulge Your Skin in{" "}
                  <span className="text-gold italic">Pure Luxury</span>
                </h1>
                <p className="text-white/85 font-body text-base md:text-lg mb-8 leading-relaxed">
                  Handcrafted soaps made with natural ingredients for healthy,
                  glowing skin
                </p>
                <a href="#products" data-ocid="hero.primary_button">
                  <Button
                    size="lg"
                    className="bg-gold hover:bg-gold-dark text-white font-body font-medium px-8 py-3 rounded-full tracking-wide transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    Shop Now <ChevronRight size={18} className="ml-1" />
                  </Button>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <FadeSection>
            <div className="text-center mb-14">
              <p className="text-gold font-body text-xs tracking-[0.3em] uppercase mb-3">
                Our Story
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Crafted with Purpose
              </h2>
              <div className="gold-divider mb-6" />
              <p className="text-warm-gray font-body text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                At Npl Soaps, we believe skincare should be as pure as nature
                itself. Every bar is handcrafted in small batches with the
                finest botanical ingredients — no shortcuts, no compromise.
              </p>
            </div>
          </FadeSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Heart size={28} />,
                title: "Handmade with Care",
                desc: "Every bar lovingly crafted by hand in small artisan batches.",
              },
              {
                icon: <Leaf size={28} />,
                title: "Natural Ingredients",
                desc: "Botanicals, essential oils, and plant-based butters only.",
              },
              {
                icon: <Shield size={28} />,
                title: "No Harsh Chemicals",
                desc: "Free from sulfates, parabens, synthetic fragrances, and dyes.",
              },
              {
                icon: <FlaskConical size={28} />,
                title: "Inspired by Nature",
                desc: "Formulas rooted in traditional herbal wisdom and modern science.",
              },
            ].map((item, i) => (
              <FadeSection key={item.title} delay={i * 0.1}>
                <div className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-cream text-gold mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-warm-gray font-body text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* Thin divider */}
      <div className="h-px bg-border max-w-6xl mx-auto" />

      {/* Products Section */}
      <section id="products" className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <FadeSection>
            <div className="text-center mb-14">
              <p className="text-gold font-body text-xs tracking-[0.3em] uppercase mb-3">
                Explore
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Our Signature Soaps
              </h2>
              <div className="gold-divider mb-6" />
              <p className="text-warm-gray font-body text-base max-w-xl mx-auto">
                Each soap is a sensory experience — rich lather, captivating
                scent, and skin-loving ingredients.
              </p>
            </div>
          </FadeSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <FadeSection key={product.id} delay={i * 0.08}>
                <div
                  data-ocid={`products.item.${i + 1}`}
                  className="product-card bg-white rounded-2xl overflow-hidden border border-border shadow-card group"
                >
                  <div className="relative overflow-hidden h-56">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                      {product.name}
                    </h3>
                    <p className="text-warm-gray font-body text-sm mb-3">
                      {product.benefits}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xl font-bold text-gold">
                        {product.price}
                      </span>
                      <Button
                        onClick={() => addToCart(product)}
                        data-ocid={`products.item.${i + 1}.primary_button`}
                        size="sm"
                        className="bg-secondary hover:bg-gold hover:text-white text-foreground font-body text-xs px-4 py-2 rounded-full border border-border transition-all duration-300"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features / Benefits Section */}
      <section className="py-20 md:py-24 bg-cream">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <FadeSection>
            <div className="text-center mb-14">
              <p className="text-gold font-body text-xs tracking-[0.3em] uppercase mb-3">
                Why Choose Us
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                The Npl Difference
              </h2>
              <div className="gold-divider" />
            </div>
          </FadeSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Leaf size={32} />,
                title: "100% Natural Ingredients",
                desc: "Pure botanicals, cold-pressed oils, and organic butters — nothing artificial.",
              },
              {
                icon: <Heart size={32} />,
                title: "Handmade with Love",
                desc: "Each bar is poured, cut, and cured by hand with meticulous attention to detail.",
              },
              {
                icon: <Star size={32} />,
                title: "All Skin Types",
                desc: "Gentle enough for sensitive skin, effective for all skin types and concerns.",
              },
              {
                icon: <Shield size={32} />,
                title: "Chemical-Free & Safe",
                desc: "No parabens, SLS, artificial colors, or synthetic fragrances. Ever.",
              },
            ].map((item, i) => (
              <FadeSection key={item.title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-7 text-center shadow-card border border-border hover:shadow-card-hover transition-shadow duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cream-deep text-gold mb-5">
                    {item.icon}
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-warm-gray font-body text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-24 bg-beige">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <FadeSection>
            <div className="text-center mb-14">
              <p className="text-gold font-body text-xs tracking-[0.3em] uppercase mb-3">
                Testimonials
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                What Our Customers Say
              </h2>
              <div className="gold-divider" />
            </div>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote:
                  "My skin feels so soft and fresh after using Npl Soaps! I've tried so many brands but nothing compares to this natural goodness.",
                name: "Fatima K.",
                role: "Verified Customer",
                rating: 5,
              },
              {
                quote:
                  "Best handmade soap I've ever used! The Rose Glow soap has completely transformed my skincare routine. Absolutely love it!",
                name: "Rina A.",
                role: "Loyal Customer",
                rating: 5,
              },
              {
                quote:
                  "Finally found a soap that doesn't irritate my sensitive skin. The Lavender Dream is incredibly calming and smells divine.",
                name: "Sadia M.",
                role: "Verified Customer",
                rating: 5,
              },
              {
                quote:
                  "I ordered the Charcoal Detox soap and my acne has improved significantly. Will definitely order again!",
                name: "Tasnim R.",
                role: "Verified Customer",
                rating: 5,
              },
            ].map((t, i) => (
              <FadeSection key={t.name} delay={i * 0.1}>
                <div
                  data-ocid={`testimonials.item.${i + 1}`}
                  className="bg-white rounded-2xl p-8 shadow-card border border-border"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={String(j)}
                        size={16}
                        fill="currentColor"
                        className="text-gold"
                      />
                    ))}
                  </div>
                  <p className="font-body text-foreground/80 text-sm md:text-base leading-relaxed mb-6 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cream-deep flex items-center justify-center font-display font-bold text-gold">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-body font-semibold text-sm text-foreground">
                        {t.name}
                      </p>
                      <p className="font-body text-xs text-warm-gray">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery & Payment Section */}
      <section className="py-20 md:py-24 bg-cream">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <FadeSection>
            <div className="text-center mb-14">
              <p className="text-gold font-body text-xs tracking-[0.3em] uppercase mb-3">
                Convenience
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Delivery & Payment
              </h2>
              <div className="gold-divider" />
            </div>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Truck size={32} />,
                title: "Fast Delivery",
                desc: "Swift delivery across all of Bangladesh. Orders processed within 24 hours. Free delivery on orders over ৳1500.",
              },
              {
                icon: <CreditCard size={32} />,
                title: "Payment Options",
                desc: "Pay via Cash on Delivery, bKash, or Nagad. Safe, secure, and convenient — choose what works best for you.",
                tags: ["Cash on Delivery", "bKash", "Nagad"],
              },
              {
                icon: <Shield size={32} />,
                title: "Satisfaction Guarantee",
                desc: "Not happy with your purchase? We offer hassle-free returns and exchanges within 7 days.",
              },
            ].map((item, i) => (
              <FadeSection key={item.title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-card border border-border text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cream-deep text-gold mb-5">
                    {item.icon}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-warm-gray font-body text-sm leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  {item.tags && (
                    <div className="flex flex-wrap justify-center gap-2">
                      {item.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="font-body text-xs bg-cream border border-border text-foreground/70"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <FadeSection>
            <div className="text-center mb-14">
              <p className="text-gold font-body text-xs tracking-[0.3em] uppercase mb-3">
                Get in Touch
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Contact Us
              </h2>
              <div className="gold-divider mb-6" />
              <p className="text-warm-gray font-body text-base max-w-xl mx-auto">
                Have a question or need help? We'd love to hear from you.
              </p>
            </div>
          </FadeSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <FadeSection>
              <div className="space-y-8">
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                    Reach Us Directly
                  </h3>
                  <div className="space-y-4">
                    <a
                      href="https://wa.me/8801700000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ocid="contact.whatsapp.button"
                      className="flex items-center gap-4 p-4 rounded-xl bg-cream border border-border hover:border-gold transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Phone size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-body font-semibold text-sm text-foreground group-hover:text-gold transition-colors">
                          WhatsApp
                        </p>
                        <p className="font-body text-xs text-warm-gray">
                          Chat with us instantly
                        </p>
                      </div>
                      <ChevronRight
                        size={16}
                        className="ml-auto text-warm-gray group-hover:text-gold transition-colors"
                      />
                    </a>

                    <a
                      href="https://m.me/nplsoaps"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ocid="contact.messenger.button"
                      className="flex items-center gap-4 p-4 rounded-xl bg-cream border border-border hover:border-gold transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <MessageCircle size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-body font-semibold text-sm text-foreground group-hover:text-gold transition-colors">
                          Messenger
                        </p>
                        <p className="font-body text-xs text-warm-gray">
                          Message us on Facebook
                        </p>
                      </div>
                      <ChevronRight
                        size={16}
                        className="ml-auto text-warm-gray group-hover:text-gold transition-colors"
                      />
                    </a>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-cream border border-border">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Mail size={20} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="font-body font-semibold text-sm text-foreground">
                          Email
                        </p>
                        <p className="font-body text-xs text-warm-gray">
                          hello@nplsoaps.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeSection>

            {/* Contact Form */}
            <FadeSection delay={0.15}>
              <form
                onSubmit={handleContactSubmit}
                data-ocid="contact.dialog"
                className="bg-cream rounded-2xl p-8 border border-border space-y-5"
              >
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  Send a Message
                </h3>
                <div>
                  <label
                    htmlFor="contact-name"
                    className="font-body text-sm font-medium text-foreground/80 block mb-1.5"
                  >
                    Your Name
                  </label>
                  <Input
                    id="contact-name"
                    placeholder="e.g. Fatima Khan"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm((p) => ({ ...p, name: e.target.value }))
                    }
                    data-ocid="contact.input"
                    required
                    className="bg-white border-border focus:border-gold font-body"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="font-body text-sm font-medium text-foreground/80 block mb-1.5"
                  >
                    Email Address
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="your@email.com"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm((p) => ({ ...p, email: e.target.value }))
                    }
                    required
                    className="bg-white border-border focus:border-gold font-body"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="font-body text-sm font-medium text-foreground/80 block mb-1.5"
                  >
                    Message
                  </label>
                  <Textarea
                    id="contact-message"
                    placeholder="How can we help you?"
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm((p) => ({ ...p, message: e.target.value }))
                    }
                    data-ocid="contact.textarea"
                    required
                    rows={4}
                    className="bg-white border-border focus:border-gold font-body resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  data-ocid="contact.submit_button"
                  disabled={submitContact.isPending}
                  className="w-full bg-gold hover:bg-gold-dark text-white font-body tracking-wide rounded-full transition-all duration-300"
                >
                  {submitContact.isPending ? "Sending..." : "Send Message"}
                </Button>
                {submitContact.isSuccess && (
                  <p
                    data-ocid="contact.success_state"
                    className="text-center text-sm font-body text-green-600"
                  >
                    ✓ Message sent successfully!
                  </p>
                )}
              </form>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sand pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                Npl <span className="text-gold">Soaps</span>
              </h3>
              <p className="font-body text-sm text-warm-gray leading-relaxed mb-5">
                Pure Luxury for Your Skin. Handcrafted with love using the
                finest natural ingredients for healthy, glowing skin. Inspired
                by nature, trusted by thousands.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://wa.me/8801700000000"
                  className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-gold hover:text-white transition-colors duration-200 text-foreground/60"
                >
                  <Phone size={16} />
                </a>
                <a
                  href="https://m.me/nplsoaps"
                  className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-gold hover:text-white transition-colors duration-200 text-foreground/60"
                >
                  <MessageCircle size={16} />
                </a>
                <a
                  href="mailto:hello@nplsoaps.com"
                  className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-gold hover:text-white transition-colors duration-200 text-foreground/60"
                >
                  <Mail size={16} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display text-base font-semibold text-foreground mb-5">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {[
                  "Shop All",
                  "Our Story",
                  "Ingredients",
                  "Delivery & Payment",
                  "Contact Us",
                ].map((link) => (
                  <li key={link}>
                    <a
                      href={
                        link === "Shop All"
                          ? "#products"
                          : link === "Contact Us"
                            ? "#contact"
                            : "#about"
                      }
                      data-ocid={`footer.${link.toLowerCase().replace(/ /g, "_").replace("&", "and")}.link`}
                      className="font-body text-sm text-warm-gray hover:text-gold transition-colors duration-200 flex items-center gap-1"
                    >
                      <ChevronRight size={14} /> {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-display text-base font-semibold text-foreground mb-3">
                Stay in the Loop
              </h4>
              <p className="font-body text-sm text-warm-gray mb-5">
                Subscribe for exclusive offers, skincare tips, and new arrivals.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="bg-white border-border font-body text-sm flex-1"
                />
                <Button
                  type="submit"
                  data-ocid="newsletter.submit_button"
                  className="bg-sage hover:bg-sage/90 text-white font-body text-sm px-4 rounded-lg whitespace-nowrap"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          <Separator className="bg-border mb-6" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="font-body text-xs text-warm-gray">
              © {new Date().getFullYear()} Npl Soaps. All rights reserved.
            </p>
            <p className="font-body text-xs text-warm-gray">
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              data-ocid="cart.dialog"
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Your Cart{" "}
                  {cartCount > 0 && (
                    <span className="text-gold">({cartCount})</span>
                  )}
                </h2>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  data-ocid="cart.close_button"
                  className="p-2 hover:bg-cream rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                {cart.length === 0 ? (
                  <div
                    data-ocid="cart.empty_state"
                    className="flex flex-col items-center justify-center h-full text-center py-16"
                  >
                    <ShoppingCart size={48} className="text-border mb-4" />
                    <p className="font-display text-lg font-medium text-foreground/60">
                      Your cart is empty
                    </p>
                    <p className="font-body text-sm text-warm-gray mt-2">
                      Add some luxurious soaps!
                    </p>
                    <Button
                      onClick={() => setCartOpen(false)}
                      className="mt-6 bg-gold text-white hover:bg-gold-dark font-body rounded-full px-6"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, i) => (
                      <div
                        key={item.id}
                        data-ocid={`cart.item.${i + 1}`}
                        className="flex gap-3 p-3 rounded-xl bg-cream border border-border"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-sm font-semibold text-foreground truncate">
                            {item.name}
                          </p>
                          <p className="font-body text-xs text-warm-gray mb-2">
                            {item.price} each
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, -1)}
                              className="w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center hover:bg-gold hover:text-white hover:border-gold transition-colors"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="font-body text-sm font-medium w-4 text-center">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, 1)}
                              className="w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center hover:bg-gold hover:text-white hover:border-gold transition-colors"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            data-ocid={`cart.item.${i + 1}.delete_button`}
                            className="p-1 hover:text-red-500 transition-colors text-warm-gray"
                          >
                            <X size={14} />
                          </button>
                          <span className="font-display text-sm font-bold text-gold">
                            ৳{item.priceNum * item.qty}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-border px-6 py-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm text-warm-gray">
                      Subtotal
                    </span>
                    <span className="font-display text-xl font-bold text-gold">
                      ৳{cartTotal}
                    </span>
                  </div>
                  {cartTotal < 1500 && (
                    <p className="font-body text-xs text-warm-gray text-center bg-cream rounded-lg py-2 px-3">
                      Add ৳{1500 - cartTotal} more for free delivery!
                    </p>
                  )}
                  <Button
                    data-ocid="cart.primary_button"
                    className="w-full bg-gold hover:bg-gold-dark text-white font-body font-medium rounded-full py-3 tracking-wide transition-all duration-300"
                    onClick={() =>
                      toast.success("Order placed! We'll contact you shortly.")
                    }
                  >
                    Place Order
                  </Button>
                  <Button
                    variant="outline"
                    data-ocid="cart.secondary_button"
                    className="w-full font-body text-sm border-border hover:border-gold rounded-full"
                    onClick={() => setCartOpen(false)}
                  >
                    Continue Shopping
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
