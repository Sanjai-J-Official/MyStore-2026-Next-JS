import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Artisan from '@/models/Artisan';

const SEED_ARTISANS = [
  {
    name: 'Ramesh Suthar',
    stateId: 'rajasthan',
    stateLabel: 'Rajasthan',
    product: 'Blue Pottery Vase',
    craft: 'Blue Pottery',
    region: 'Jaipur, Rajasthan',
    price: 2499,
    image: '/icons/cat-wooden-decor.png',
    description: 'From sun-soaked Jaipur, Ramesh crafts iconic blue pottery passed down through 7 generations. The vivid cobalt blue and white palette is derived from natural minerals, making each piece entirely non-toxic.',
    since: '1952',
    featured: true,
  },
  {
    name: 'Kavitha Murugan',
    stateId: 'tamil-nadu',
    stateLabel: 'Tamil Nadu',
    product: 'Tanjore Painted Box',
    craft: 'Tanjore Painting',
    region: 'Thanjavur, Tamil Nadu',
    price: 3899,
    image: '/icons/cat-artisan-collection.png',
    description: 'Kavitha practises the 400-year-old Tanjore art form, embedding real gold foil into every panel. The style originates in the royal court of the Marathas.',
    since: '1987',
    featured: true,
  },
  {
    name: 'Joseph Varghese',
    stateId: 'kerala',
    stateLabel: 'Kerala',
    product: 'Rosewood Elephant',
    craft: 'Wood Carving',
    region: 'Thrissur, Kerala',
    price: 4200,
    image: '/icons/cat-premium-wooden.png',
    description: "Hand-carved from aged rosewood in the forest belt of Thrissur, each piece takes 3 weeks to complete. Joseph's family has supplied Kerala's famous temple art tradition for four decades.",
    since: '1978',
    featured: true,
  },
  {
    name: 'Parvati Solanki',
    stateId: 'gujarat',
    stateLabel: 'Gujarat',
    product: 'Kutch Embroidered Box',
    craft: 'Kutch Embroidery',
    region: 'Bhuj, Gujarat',
    price: 1850,
    image: '/icons/cat-handcrafted-gifts.png',
    description: "Parvati's mirror-work textiles come from the Rann of Kutch — a tradition of nomadic artisans who once traced the desert trade routes.",
    since: '1965',
    featured: true,
  },
  {
    name: 'Debjit Pal',
    stateId: 'west-bengal',
    stateLabel: 'West Bengal',
    product: 'Dokra Tribal Figurine',
    craft: 'Dokra Metal Casting',
    region: 'Bankura, West Bengal',
    price: 2100,
    image: '/icons/cat-artisan-collection.png',
    description: "Dokra is one of the world's oldest metal casting crafts, practised in the tribal belt of Bengal using the lost-wax technique.",
    since: '1980',
    featured: true,
  },
  {
    name: 'Lakshmi Narayana',
    stateId: 'karnataka',
    stateLabel: 'Karnataka',
    product: 'Sandalwood Incense Set',
    craft: 'Sandalwood Carving',
    region: 'Mysuru, Karnataka',
    price: 1499,
    image: '/icons/cat-limited-edition.png',
    description: 'Carved from Mysore sandalwood — the most prized in the world — each set is a sensory masterpiece.',
    since: '1990',
    featured: true,
  },
  {
    name: 'Ashraf Ali',
    stateId: 'uttar-pradesh',
    stateLabel: 'Uttar Pradesh',
    product: 'Brass Chikan Gift Set',
    craft: 'Chikan Embroidery',
    region: 'Lucknow, Uttar Pradesh',
    price: 2750,
    image: '/icons/cat-corporate-gifting.png',
    description: "Ashraf's family has practised Chikan embroidery in old Lucknow for over 200 years. His workshop now trains 60+ women artisans.",
    since: '1810',
    featured: true,
  },
  {
    name: 'Subhas Pattnaik',
    stateId: 'odisha',
    stateLabel: 'Odisha',
    product: 'Pattachitra Wall Panel',
    craft: 'Pattachitra Painting',
    region: 'Raghurajpur, Odisha',
    price: 5500,
    image: '/icons/cat-artisan-collection.png',
    description: 'Subhas paints intricate mythological scenes on palm leaves and cloth — a 12th-century tradition from the Puri temple town.',
    since: '1100',
    featured: true,
  },
  {
    name: 'Urmila Gond',
    stateId: 'madhya-pradesh',
    stateLabel: 'Madhya Pradesh',
    product: 'Gond Tribal Painting',
    craft: 'Gond Painting',
    region: 'Patangarh, Madhya Pradesh',
    price: 3200,
    image: '/icons/cat-handcrafted-gifts.png',
    description: 'Gond paintings connect the village of Patangarh to the cosmos through vibrant natural dye art.',
    since: '1970',
    featured: true,
  },
  {
    name: 'Tenzin Dorje',
    stateId: 'himachal-pradesh',
    stateLabel: 'Himachal Pradesh',
    product: 'Hand-knotted Woolen Rug',
    craft: 'Hand-knotted Weaving',
    region: 'Kangra, Himachal Pradesh',
    price: 6800,
    image: '/icons/cat-premium-wooden.png',
    description: 'Woven in high-altitude Kangra valleys, each rug takes 2 months of hand-knotting on wooden looms.',
    since: '1945',
    featured: true,
  },
];

// GET /api/artisans/seed — seed default artisans (safe to call multiple times)
export async function GET() {
  try {
    await dbConnect();
    let inserted = 0;
    for (const artisan of SEED_ARTISANS) {
      const exists = await Artisan.findOne({ stateId: artisan.stateId, name: artisan.name });
      if (!exists) {
        await Artisan.create(artisan);
        inserted++;
      }
    }
    return NextResponse.json({
      success: true,
      message: `Seeded ${inserted} artisan(s). ${SEED_ARTISANS.length - inserted} already existed.`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
