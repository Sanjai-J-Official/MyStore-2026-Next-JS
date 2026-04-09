import Link from 'next/link';
import styles from './region.module.css';

/* Artisan data — same as in ArtisanMap.js, kept server-side for SSR */
const ARTISAN_DATA = {
  'rajasthan': {
    label: 'Rajasthan',
    artisan: 'Ramesh Suthar',
    product: 'Blue Pottery Vase',
    price: '₹2,499',
    image: '/icons/cat-wooden-decor.png',
    story: 'From the sun-soaked workshops of Jaipur, Ramesh crafts iconic blue pottery passed down through 7 generations. The vivid cobalt blue and white palette is derived from natural minerals, making each piece entirely non-toxic and food-safe.',
    craft: 'Blue Pottery',
    region: 'Jaipur, Rajasthan',
    since: '1952',
    category: 'Wooden Decor',
  },
  'tamil-nadu': {
    label: 'Tamil Nadu',
    artisan: 'Kavitha Murugan',
    product: 'Tanjore Painted Box',
    price: '₹3,899',
    image: '/icons/cat-artisan-collection.png',
    story: 'Kavitha practises the 400-year-old Tanjore art form, embedding real gold foil into every panel. The style originates in the royal court of the Marathas and is unique to the town of Thanjavur.',
    craft: 'Tanjore Painting',
    region: 'Thanjavur, Tamil Nadu',
    since: '1987',
    category: 'Artisan Collection',
  },
  'kerala': {
    label: 'Kerala',
    artisan: 'Joseph Varghese',
    product: 'Rosewood Elephant',
    price: '₹4,200',
    image: '/icons/cat-premium-wooden.png',
    story: 'Hand-carved from aged rosewood in the forest belt of Thrissur, each piece takes 3 weeks to complete. Joseph\'s family has been the principal supplier to Kerala\'s famous temple art tradition for four decades.',
    craft: 'Wood Carving',
    region: 'Thrissur, Kerala',
    since: '1978',
    category: 'Premium Wooden',
  },
  'gujarat': {
    label: 'Gujarat',
    artisan: 'Parvati Solanki',
    product: 'Kutch Embroidered Box',
    price: '₹1,850',
    image: '/icons/cat-handcrafted-gifts.png',
    story: 'Parvati\'s mirror-work textiles come from the Rann of Kutch — a tradition of nomadic artisans who once traced the desert trade routes. Each stitch carries centuries of pattern memory.',
    craft: 'Kutch Embroidery',
    region: 'Bhuj, Gujarat',
    since: '1965',
    category: 'Handcrafted Gifts',
  },
  'west-bengal': {
    label: 'West Bengal',
    artisan: 'Debjit Pal',
    product: 'Dokra Tribal Figurine',
    price: '₹2,100',
    image: '/icons/cat-artisan-collection.png',
    story: 'Dokra is one of the world\'s oldest metal casting crafts, practised in the tribal belt of Bengal using the lost-wax technique. Debjit\'s figurines echo the mythology of the Santhali tribe.',
    craft: 'Dokra Metal Casting',
    region: 'Bankura, West Bengal',
    since: '1980',
    category: 'Artisan Collection',
  },
  'karnataka': {
    label: 'Karnataka',
    artisan: 'Lakshmi Narayana',
    product: 'Sandalwood Incense Set',
    price: '₹1,499',
    image: '/icons/cat-limited-edition.png',
    story: 'Carved from Mysore sandalwood — the most prized in the world — each set is a sensory masterpiece. Licensed sourcing ensures every piece is from sustainably managed plantations.',
    craft: 'Sandalwood Carving',
    region: 'Mysuru, Karnataka',
    since: '1990',
    category: 'Limited Edition',
  },
  'uttar-pradesh': {
    label: 'Uttar Pradesh',
    artisan: 'Ashraf Ali',
    product: 'Brass Chikan Gift Set',
    price: '₹2,750',
    image: '/icons/cat-corporate-gifting.png',
    story: 'Hailing from Lucknow\'s old city, Ashraf\'s family has practised Chikan embroidery for over 200 years. Today his workshop trains 60+ women artisans from under-resourced communities.',
    craft: 'Chikan Embroidery',
    region: 'Lucknow, Uttar Pradesh',
    since: '1810',
    category: 'Corporate Gifting',
  },
  'odisha': {
    label: 'Odisha',
    artisan: 'Subhas Pattnaik',
    product: 'Pattachitra Wall Panel',
    price: '₹5,500',
    image: '/icons/cat-artisan-collection.png',
    story: 'Subhas paints intricate mythological scenes on palm leaves and cloth — a 12th-century tradition from the Puri temple town. Natural colours derived from stones, leaves, and conch shells.',
    craft: 'Pattachitra Painting',
    region: 'Raghurajpur, Odisha',
    since: '1100',
    category: 'Artisan Collection',
  },
  'madhya-pradesh': {
    label: 'Madhya Pradesh',
    artisan: 'Urmila Gond',
    product: 'Gond Tribal Painting',
    price: '₹3,200',
    image: '/icons/cat-handcrafted-gifts.png',
    story: 'Gond paintings connect the village of Patangarh to the cosmos through vibrant natural dye art. Urmila is among a rising generation of women who are commercialising this rare tradition.',
    craft: 'Gond Painting',
    region: 'Patangarh, Madhya Pradesh',
    since: '1970',
    category: 'Handcrafted Gifts',
  },
  'himachal-pradesh': {
    label: 'Himachal Pradesh',
    artisan: 'Tenzin Dorje',
    product: 'Hand-knotted Woolen Rug',
    price: '₹6,800',
    image: '/icons/cat-premium-wooden.png',
    story: 'Woven in high-altitude Kangra valleys, each rug takes 2 months of hand-knotting on wooden looms. Tenzin uses undyed Himalayan wool whose natural luster deepens with age.',
    craft: 'Hand-knotted Weaving',
    region: 'Kangra, Himachal Pradesh',
    since: '1945',
    category: 'Premium Wooden',
  },
};

export async function generateMetadata({ params }) {
  const data = ARTISAN_DATA[params.region];
  if (!data) return { title: 'Artisan Region | Hidden Leaf' };
  return {
    title: `${data.label} Artisans | Hidden Leaf`,
    description: data.story.slice(0, 155),
    alternates: { canonical: `/artisans/${params.region}` },
    openGraph: {
      title: `${data.label} Artisans | Hidden Leaf`,
      description: data.story.slice(0, 155),
      url: `https://fromthehiddenleafstore.com/artisans/${params.region}`,
      images: [{ url: data.image, alt: data.product }],
    },
  };
}

export default function ArtisanRegionPage({ params }) {
  const data = ARTISAN_DATA[params.region];

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '16px' }}>
          Region Not Found
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          We haven&#39;t mapped artisans from this region yet. Check back soon.
        </p>
        <Link href="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>
          ← Back to Artisan Map
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <Link href="/#artisan-map" className={styles.backLink}>
            ← Artisan Map
          </Link>
          <div className={styles.badge}>{data.craft}</div>
          <h1 className={styles.heroTitle}>{data.label}</h1>
          <p className={styles.heroSub}>{data.region}</p>
        </div>
      </div>

      <div className={styles.content}>
        {/* FEATURED ARTISAN */}
        <section className={styles.artisanSection}>
          <div className={styles.artisanCard}>
            <div className={styles.artisanImageWrap}>
              <img src={data.image} alt={data.product} className={styles.artisanImage} />
              <div className={styles.artisanBadge}>Since {data.since}</div>
            </div>
            <div className={styles.artisanInfo}>
              <span className={styles.label}>Featured Artisan</span>
              <h2 className={styles.artisanName}>{data.artisan}</h2>
              <p className={styles.artisanStory}>{data.story}</p>
              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Craft</span>
                  <span className={styles.metaValue}>{data.craft}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Based in</span>
                  <span className={styles.metaValue}>{data.region}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Category</span>
                  <span className={styles.metaValue}>{data.category}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SIGNATURE PRODUCT */}
        <section className={styles.productSection}>
          <span className={styles.label}>Signature Piece</span>
          <h2 className={styles.productTitle}>{data.product}</h2>
          <div className={styles.productCard}>
            <div className={styles.productImageWrap}>
              <img src={data.image} alt={data.product} className={styles.productImage} />
            </div>
            <div className={styles.productDetails}>
              <div className={styles.productPrice}>{data.price}</div>
              <p className={styles.productDesc}>
                Each piece is handcrafted by {data.artisan} in {data.region} using traditional techniques passed down for generations. No two pieces are exactly alike — minor variations are a mark of authentic handmade craftsmanship.
              </p>
              <div className={styles.productActions}>
                <Link
                  href={`/products?category=${encodeURIComponent(data.category)}`}
                  className={styles.btnPrimary}
                >
                  Shop {data.category}
                </Link>
                <Link
                  href={`mailto:info@fromthehiddenleafstore.com?subject=Custom Order - ${data.product}`}
                  className={styles.btnOutline}
                >
                  Custom Order
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* EXPLORE MORE */}
        <section className={styles.exploreSection}>
          <h3 className={styles.exploreTitle}>Explore Other Regions</h3>
          <div className={styles.regionGrid}>
            {Object.entries(ARTISAN_DATA)
              .filter(([key]) => key !== params.region)
              .slice(0, 4)
              .map(([key, r]) => (
                <Link key={key} href={`/artisans/${key}`} className={styles.regionCard}>
                  <img src={r.image} alt={r.label} className={styles.regionImg} />
                  <div className={styles.regionLabel}>{r.label}</div>
                  <div className={styles.regionCraft}>{r.craft}</div>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
