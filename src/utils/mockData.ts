import type { User, Category, Product, CartItem, Order } from '../types';

export const mockUser: User = {
  uid: 'usr_982734',
  email: 'alex.developer@omnimart.com',
  fullName: 'Alex Rodriguez',
  role: 'customer',
  phoneNumber: '+1 (555) 019-2834',
  addresses: [
    {
      id: 'addr_1',
      title: 'Home Address',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'IL',
      country: 'United States',
      zipCode: '62704',
      isDefault: true,
      recipientName: 'Alex Rodriguez',
      recipientPhone: '+1 (555) 019-2834',
      building: 'Apt 12B'
    },
    {
      id: 'addr_2',
      title: 'Office Address',
      street: '100 Infinite Loop',
      city: 'Cupertino',
      state: 'CA',
      country: 'United States',
      zipCode: '95014',
      isDefault: false,
      recipientName: 'Alex Rodriguez',
      recipientPhone: '+1 (555) 019-0000',
      building: 'Bldg 3'
    }
  ],
  wishlist: ['prod_101', 'prod_104'],
  createdAt: '2026-01-15T08:30:00Z',
};

export const mockCategories: Category[] = [
  {
    id: 'cat_electronics',
    name: {
      en: 'Electronics',
      ar: 'الإلكترونيات'
    },
    slug: 'electronics',
    icon: 'Laptop',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80',
    parentCategoryId: null,
    featured: true,
    displayOrder: 1,
  },
  {
    id: 'cat_fashion',
    name: {
      en: 'Fashion & Apparel',
      ar: 'الأزياء والملابس'
    },
    slug: 'fashion-apparel',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    parentCategoryId: null,
    featured: true,
    displayOrder: 2,
  },
  {
    id: 'cat_home',
    name: {
      en: 'Home & Kitchen',
      ar: 'المنزل والمطبخ'
    },
    slug: 'home-kitchen',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    parentCategoryId: null,
    featured: true,
    displayOrder: 3,
  },
  {
    id: 'cat_beauty',
    name: {
      en: 'Beauty & Health',
      ar: 'الجمال والصحة'
    },
    slug: 'beauty-health',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
    parentCategoryId: null,
    featured: true,
    displayOrder: 4,
  },
  {
    id: 'cat_sports',
    name: {
      en: 'Sports & Outdoors',
      ar: 'الرياضة والهواء الطلق'
    },
    slug: 'sports-outdoors',
    icon: 'Activity',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=600&q=80',
    parentCategoryId: null,
    featured: true,
    displayOrder: 5,
  }
];

export const mockProducts: Product[] = [
  // 1. Electronics
  {
    id: 'prod_101',
    title: {
      en: 'OmniBook Pro 16" Laptop',
      ar: 'أومني بوك برو ١٦ بوصة'
    },
    slug: 'omnibook-pro-16-laptop',
    sku: 'OMNI-LP-16P-09',
    categoryId: 'cat_electronics',
    subCategoryId: null,
    brand: 'OmniTech',
    price: 1899.99,
    discountPrice: 1699.99,
    stock: 24,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      cpu: 'M3 Max 16-Core',
      ram: '32GB Unified Memory',
      storage: '1TB SSD',
      color: 'Space Black',
    },
    rating: { average: 4.8, count: 142 },
    isFeatured: true,
    createdAt: '2026-02-10T12:00:00Z',
  },
  {
    id: 'prod_102',
    title: {
      en: 'ActiveNoise Wireless Headphones',
      ar: 'سماعات رأس لاسلكية مانعة للضوضاء'
    },
    slug: 'activenoise-wireless-headphones',
    sku: 'OMNI-HP-ANW-02',
    categoryId: 'cat_electronics',
    subCategoryId: null,
    brand: 'SoundWave',
    price: 299.99,
    discountPrice: 249.99,
    stock: 85,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      connectivity: 'Bluetooth 5.3',
      batteryLife: '40 Hours',
      anc: 'Active Noise Cancellation',
      color: 'Matte Black'
    },
    rating: { average: 4.5, count: 98 },
    isFeatured: true,
    createdAt: '2026-03-01T10:15:00Z',
  },
  {
    id: 'prod_105',
    title: {
      en: 'UltraVision 4K Smart TV 55"',
      ar: 'شاشة التلفاز الترا فيجن ٥٥ بوصة ٤كيه'
    },
    slug: 'ultravision-4k-smart-tv-55',
    sku: 'OMNI-TV-UV55-88',
    categoryId: 'cat_electronics',
    subCategoryId: null,
    brand: 'VividImage',
    price: 999.99,
    discountPrice: 899.99,
    stock: 15,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      panel: 'OLED',
      resolution: '4K UHD',
      refreshRate: '120Hz',
      hdr: 'HDR10+'
    },
    rating: { average: 4.7, count: 64 },
    isFeatured: false,
    createdAt: '2026-04-01T09:00:00Z',
  },
  {
    id: 'prod_106',
    title: {
      en: 'ChargeMax 20K Power Bank',
      ar: 'شاحن سفري تشارج ماكس ٢٠ ألف أمبير'
    },
    slug: 'chargemax-20k-power-bank',
    sku: 'OMNI-PB-CM20-12',
    categoryId: 'cat_electronics',
    subCategoryId: null,
    brand: 'OmniTech',
    price: 49.99,
    discountPrice: null,
    stock: 200,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1609592424085-f5596e47ef6b?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      capacity: '20000mAh',
      ports: '2x USB-A, 1x USB-C PD',
      output: '22.5W Fast Charge',
      color: 'Titanium Grey'
    },
    rating: { average: 4.3, count: 320 },
    isFeatured: false,
    createdAt: '2026-04-10T14:30:00Z',
  },
  {
    id: 'prod_107',
    title: {
      en: 'SoundSync Bluetooth Speaker',
      ar: 'سماعة سوند سينك بلوتوث اللاسلكية'
    },
    slug: 'soundsync-bluetooth-speaker',
    sku: 'OMNI-SP-SSBK-05',
    categoryId: 'cat_electronics',
    subCategoryId: null,
    brand: 'SoundWave',
    price: 79.99,
    discountPrice: 69.99,
    stock: 120,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      waterproofRating: 'IPX7 Waterproof',
      batteryLife: '24 Hours Playtime',
      outputPower: '20W Stereo Sound',
      connectivity: 'Bluetooth 5.2'
    },
    rating: { average: 4.4, count: 180 },
    isFeatured: false,
    createdAt: '2026-04-15T11:00:00Z',
  },
  {
    id: 'prod_108',
    title: {
      en: 'SmartTrack Fitness Watch',
      ar: 'ساعة سمارت تراك الذكية للياقة البدنية'
    },
    slug: 'smarttrack-fitness-watch',
    sku: 'OMNI-WT-STFW-10',
    categoryId: 'cat_electronics',
    subCategoryId: null,
    brand: 'OmniTech',
    price: 149.99,
    discountPrice: 129.99,
    stock: 95,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      sensors: 'Heart Rate, Blood Oxygen, Sleep Tracker',
      gps: 'Built-in GPS Navigation',
      batteryLife: '7 Days Active Use',
      color: 'Charcoal Navy'
    },
    rating: { average: 4.6, count: 240 },
    isFeatured: true,
    createdAt: '2026-04-20T16:00:00Z',
  },

  // 2. Fashion & Apparel
  {
    id: 'prod_103',
    title: {
      en: 'Minimalist Leather Chronograph',
      ar: 'ساعة كرونوغراف جلدية كلاسيكية'
    },
    slug: 'minimalist-leather-chronograph',
    sku: 'OMNI-WT-MLC-55',
    categoryId: 'cat_fashion',
    subCategoryId: null,
    brand: 'Chronos',
    price: 175.00,
    discountPrice: 125.00,
    stock: 45,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      strapMaterial: 'Italian Full-Grain Leather',
      waterResistance: '50m (5 ATM)',
      caseSize: '40mm',
      color: 'Tan Brown'
    },
    rating: { average: 4.2, count: 36 },
    isFeatured: false,
    createdAt: '2026-04-12T15:45:00Z',
  },
  {
    id: 'prod_109',
    title: {
      en: 'Premium Wool Blend Coat',
      ar: 'معطف صوف فاخر شتوي'
    },
    slug: 'premium-wool-blend-coat',
    sku: 'OMNI-FA-WCOAT-21',
    categoryId: 'cat_fashion',
    subCategoryId: null,
    brand: 'ModaClass',
    price: 249.00,
    discountPrice: 199.00,
    stock: 30,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      material: '60% Merino Wool, 40% Polyester',
      fit: 'Tailored Slim Fit',
      color: 'Camel Tan',
      size: 'M, L, XL'
    },
    rating: { average: 4.8, count: 52 },
    isFeatured: true,
    createdAt: '2026-05-01T10:00:00Z',
  },
  {
    id: 'prod_110',
    title: {
      en: 'Urban Fit Denim Jacket',
      ar: 'جاكيت جينز عصري مريح'
    },
    slug: 'urban-fit-denim-jacket',
    sku: 'OMNI-FA-DJACK-33',
    categoryId: 'cat_fashion',
    subCategoryId: null,
    brand: 'DenimCo',
    price: 89.99,
    discountPrice: null,
    stock: 65,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      material: '100% Organic Denim Cotton',
      fit: 'Relaxed Casual Fit',
      color: 'Vintage Wash Blue',
      size: 'S, M, L'
    },
    rating: { average: 4.4, count: 110 },
    isFeatured: false,
    createdAt: '2026-05-05T12:00:00Z',
  },
  {
    id: 'prod_111',
    title: {
      en: 'AeroLight Running Shoes',
      ar: 'حذاء أيرولايت الخفيف للجري'
    },
    slug: 'aerolight-running-shoes',
    sku: 'OMNI-FA-RSHOE-44',
    categoryId: 'cat_fashion',
    subCategoryId: null,
    brand: 'SportFlex',
    price: 120.00,
    discountPrice: 99.99,
    stock: 80,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      sole: 'Response Cushioned EVA Sole',
      upperMaterial: 'Breathable Knit Mesh',
      weight: '210g Ultra-Lightweight',
      color: 'Electric Red'
    },
    rating: { average: 4.6, count: 195 },
    isFeatured: true,
    createdAt: '2026-05-10T08:30:00Z',
  },
  {
    id: 'prod_112',
    title: {
      en: 'Classic Aviator Sunglasses',
      ar: 'نظارات شمسية طيار كلاسيكية'
    },
    slug: 'classic-aviator-sunglasses',
    sku: 'OMNI-FA-SUNGL-18',
    categoryId: 'cat_fashion',
    subCategoryId: null,
    brand: 'ShadeSpec',
    price: 55.00,
    discountPrice: 45.00,
    stock: 150,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      lensType: 'Polarized Scratch-Resistant Lenses',
      protection: 'UV400 Ultraviolet Protection',
      frameMaterial: 'Alloy Metallic Frame',
      color: 'Gold/Dark Green'
    },
    rating: { average: 4.3, count: 88 },
    isFeatured: false,
    createdAt: '2026-05-15T15:00:00Z',
  },
  {
    id: 'prod_113',
    title: {
      en: 'Nomad Canvas Backpack',
      ar: 'حقيبة ظهر قماشية نوماد للسفر'
    },
    slug: 'nomad-canvas-backpack',
    sku: 'OMNI-FA-BPACK-07',
    categoryId: 'cat_fashion',
    subCategoryId: null,
    brand: 'DenimCo',
    price: 65.00,
    discountPrice: null,
    stock: 110,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      capacity: '25L Storage Volume',
      features: '15.6" Laptop Compartment, Anti-Theft Pockets',
      material: 'Water-Resistant Cotton Canvas',
      color: 'Forest Green'
    },
    rating: { average: 4.5, count: 130 },
    isFeatured: false,
    createdAt: '2026-05-20T10:30:00Z',
  },

  // 3. Home & Kitchen
  {
    id: 'prod_104',
    title: {
      en: 'Ergonomic Mesh Office Chair',
      ar: 'كرسي مكتب شبكي مريح'
    },
    slug: 'ergonomic-mesh-office-chair',
    sku: 'OMNI-CH-EMO-11',
    categoryId: 'cat_home',
    subCategoryId: null,
    brand: 'ComfortSeat',
    price: 449.99,
    discountPrice: 389.99,
    stock: 12,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      lumbarSupport: 'Adjustable Dynamic Lumbar',
      armrests: '4D Adjustable Armrests',
      weightCapacity: '300 lbs',
      color: 'Slate Grey'
    },
    rating: { average: 4.7, count: 215 },
    isFeatured: true,
    createdAt: '2026-05-20T09:00:00Z',
  },
  {
    id: 'prod_114',
    title: {
      en: 'Barista Express Espresso Machine',
      ar: 'ماكينة صنع إسبريسو باريستا إكسبريس'
    },
    slug: 'barista-express-espresso-machine',
    sku: 'OMNI-HK-ESPRM-99',
    categoryId: 'cat_home',
    subCategoryId: null,
    brand: 'Caffeinate',
    price: 599.99,
    discountPrice: 549.99,
    stock: 8,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      pressure: '15 Bar Italian Pump',
      grinder: 'Built-in Conical Burr Grinder',
      steamWand: 'Commercial Milk Frothing Wand',
      finish: 'Brushed Stainless Steel'
    },
    rating: { average: 4.9, count: 76 },
    isFeatured: true,
    createdAt: '2026-06-01T08:00:00Z',
  },
  {
    id: 'prod_115',
    title: {
      en: 'PureAir True HEPA Air Purifier',
      ar: 'منقي الهواء بيور أير هيبا فلتر'
    },
    slug: 'pureair-true-hepa-air-purifier',
    sku: 'OMNI-HK-APUR-04',
    categoryId: 'cat_home',
    subCategoryId: null,
    brand: 'PureAir',
    price: 129.99,
    discountPrice: null,
    stock: 45,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      filterType: '3-Stage True HEPA Filtration',
      coverage: 'Room sizes up to 250 sq ft',
      noiseLevel: 'Ultra-Quiet 24dB Sleep Mode',
      color: 'Arctic White'
    },
    rating: { average: 4.5, count: 160 },
    isFeatured: false,
    createdAt: '2026-06-05T14:00:00Z',
  },
  {
    id: 'prod_116',
    title: {
      en: 'ProChef 7-Piece Knife Set',
      ar: 'طقم سكاكين برو شيف الاحترافي ٧ قطع'
    },
    slug: 'prochef-7-piece-knife-set',
    sku: 'OMNI-HK-KSET-07',
    categoryId: 'cat_home',
    subCategoryId: null,
    brand: 'KitchenCraft',
    price: 199.99,
    discountPrice: 179.99,
    stock: 25,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      material: 'German High-Carbon Stainless Steel',
      construction: 'Forged Full Tang Handles',
      blockMaterial: 'Natural Acacia Wood Block',
      items: 'Chef Knife, Bread, Santoku, Utility, Paring, Sharpener'
    },
    rating: { average: 4.8, count: 94 },
    isFeatured: false,
    createdAt: '2026-06-10T11:30:00Z',
  },
  {
    id: 'prod_117',
    title: {
      en: 'GreenPan Non-Stick Cookware Set',
      ar: 'طقم أواني طهي سيراميك مانع للالتصاق ١٠ قطع'
    },
    slug: 'greenpan-non-stick-cookware-set',
    sku: 'OMNI-HK-CSET-10',
    categoryId: 'cat_home',
    subCategoryId: null,
    brand: 'KitchenCraft',
    price: 299.99,
    discountPrice: null,
    stock: 18,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      coating: 'Thermolon Ceramic Non-Stick Coating',
      toxins: 'PFAS, PFOA, Lead, and Cadmium Free',
      cooktopCompatibility: 'Induction, Gas, and Electric safe',
      color: 'Oxford Blue/Gold'
    },
    rating: { average: 4.6, count: 112 },
    isFeatured: false,
    createdAt: '2026-06-15T09:00:00Z',
  },
  {
    id: 'prod_118',
    title: {
      en: 'Smart LED Ambient Desk Lamp',
      ar: 'مصباح مكتب ذكي ليد إضاءة محيطية'
    },
    slug: 'smart-led-ambient-desk-lamp',
    sku: 'OMNI-HK-DLAMP-03',
    categoryId: 'cat_home',
    subCategoryId: null,
    brand: 'PureAir',
    price: 39.99,
    discountPrice: 34.99,
    stock: 140,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      control: 'WiFi App Control, Voice Integration (Alexa/Google)',
      lightingModes: 'Warm to Cool White, 16M RGB Ambient Colors',
      powerSource: 'USB-C Cable Powered, 5W output',
      dimmable: '0% - 100% Brightness Control'
    },
    rating: { average: 4.4, count: 205 },
    isFeatured: false,
    createdAt: '2026-06-20T16:00:00Z',
  },

  // 4. Beauty & Health
  {
    id: 'prod_119',
    title: {
      en: 'HydraGlow Hyaluronic Serum',
      ar: 'سيروم حمض الهيالورونيك هايدرا جلو'
    },
    slug: 'hydraglow-hyaluronic-serum',
    sku: 'OMNI-BH-HSERUM-12',
    categoryId: 'cat_beauty',
    subCategoryId: null,
    brand: 'GlowSkin',
    price: 35.00,
    discountPrice: 29.99,
    stock: 350,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      volume: '30ml (1 fl oz)',
      keyIngredients: '2% Pure Hyaluronic Acid, Vitamin B5',
      skinType: 'Suitable for All Skin Types',
      benefits: 'Deep Hydration, Plump Skin appearance'
    },
    rating: { average: 4.6, count: 410 },
    isFeatured: true,
    createdAt: '2026-07-01T08:00:00Z',
  },
  {
    id: 'prod_120',
    title: {
      en: 'Ionic Professional Hair Dryer',
      ar: 'مجفف شعر أيوني احترافي بقوة ٢٢٠٠ واط'
    },
    slug: 'ionic-professional-hair-dryer',
    sku: 'OMNI-BH-HDRYER-88',
    categoryId: 'cat_beauty',
    subCategoryId: null,
    brand: 'StylePro',
    price: 85.99,
    discountPrice: null,
    stock: 90,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      power: '2200W AC Motor Power',
      technology: 'Advanced Ceramic Ionic Heat Generator',
      settings: '3 Heat Settings, 2 Speed Adjustments, Cool Shot Button',
      color: 'Metallic Rose Gold'
    },
    rating: { average: 4.4, count: 185 },
    isFeatured: false,
    createdAt: '2026-07-05T14:30:00Z',
  },
  {
    id: 'prod_121',
    title: {
      en: 'RecoverPro Percussion Massage Gun',
      ar: 'مسدس تدليك العضلات ريكفر برو الاحترافي'
    },
    slug: 'recoverpro-percussion-massage-gun',
    sku: 'OMNI-BH-MGUN-05',
    categoryId: 'cat_beauty',
    subCategoryId: null,
    brand: 'StylePro',
    price: 119.99,
    discountPrice: 99.99,
    stock: 65,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      speedSettings: '6 Adjustable Percussion Speeds',
      massageHeads: '4 Inter-changeable Soft Massage Attachments',
      battery: 'Rechargeable 2500mAh Lithium battery',
      color: 'Matte Gunmetal Grey'
    },
    rating: { average: 4.7, count: 132 },
    isFeatured: true,
    createdAt: '2026-07-10T11:00:00Z',
  },
  {
    id: 'prod_122',
    title: {
      en: 'CleanSonic Smart Electric Toothbrush',
      ar: 'فرشاة أسنان كهربائية ذكية كلين سونيك'
    },
    slug: 'cleansonic-smart-electric-toothbrush',
    sku: 'OMNI-BH-TBRUSH-04',
    categoryId: 'cat_beauty',
    subCategoryId: null,
    brand: 'GlowSkin',
    price: 69.99,
    discountPrice: null,
    stock: 120,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80'], // Placeholder, let's use high quality
    attributes: {
      vibrationFreq: '40,000 Sonic Brush strokes/min',
      modes: 'Clean, White, Gum Care, Sensitive Modes',
      timer: '2-Minute Smart Quadpacer Timer',
      color: 'Obsidian Black'
    },
    rating: { average: 4.5, count: 210 },
    isFeatured: false,
    createdAt: '2026-07-15T09:00:00Z',
  },

  // 5. Sports & Outdoors
  {
    id: 'prod_123',
    title: {
      en: 'EcoFlex Natural Rubber Yoga Mat',
      ar: 'فرشة يوجا مطاطية طبيعية إيكو فليكس'
    },
    slug: 'ecoflex-natural-rubber-yoga-mat',
    sku: 'OMNI-SO-YMAT-09',
    categoryId: 'cat_sports',
    subCategoryId: null,
    brand: 'ActiveGear',
    price: 45.00,
    discountPrice: 39.99,
    stock: 110,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      material: '100% Eco-Friendly Natural Tree Rubber',
      dimensions: '72" L x 24" W, 6mm thickness cushioning',
      grip: 'Non-Slip Textured Traction Grid',
      color: 'Mint Green'
    },
    rating: { average: 4.8, count: 124 },
    isFeatured: true,
    createdAt: '2026-07-20T08:00:00Z',
  },
  {
    id: 'prod_124',
    title: {
      en: 'Cast Iron Kettlebell Set (3-Piece)',
      ar: 'طقم أثقال كيتل بيل حديد صب ٣ قطع'
    },
    slug: 'cast-iron-kettlebell-set-3pc',
    sku: 'OMNI-SO-KBELL-03',
    categoryId: 'cat_sports',
    subCategoryId: null,
    brand: 'ActiveGear',
    price: 79.99,
    discountPrice: null,
    stock: 40,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      weights: '10 lbs, 15 lbs, 20 lbs kettlebells included',
      material: 'Solid Cast Iron with Protective Vinyl coating',
      handle: 'Wide Textured Ergonomic Grip Handle',
      finish: 'Black Anti-Corrosion Matte Paint'
    },
    rating: { average: 4.6, count: 78 },
    isFeatured: false,
    createdAt: '2026-07-25T14:30:00Z',
  },
  {
    id: 'prod_125',
    title: {
      en: 'Hydration Active Trail Backpack',
      ar: 'حقيبة ظهر هايدريشن الرياضية مع كيس ماء'
    },
    slug: 'hydration-active-trail-backpack',
    sku: 'OMNI-SO-HRPACK-11',
    categoryId: 'cat_sports',
    subCategoryId: null,
    brand: 'Outfitter',
    price: 39.99,
    discountPrice: 34.99,
    stock: 95,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'], // High-res Unsplash hydration/backpack
    attributes: {
      bladderVolume: '2L Leak-proof BPA-free Water Bladder',
      backpackVolume: '10L Storage space, reflective piping',
      weight: '450g Lightweight structure',
      color: 'Sporty Charcoal Orange'
    },
    rating: { average: 4.4, count: 115 },
    isFeatured: false,
    createdAt: '2026-07-28T11:00:00Z',
  },
  {
    id: 'prod_126',
    title: {
      en: 'Explorer 4-Person Camping Tent',
      ar: 'خيمة التخييم إكسبلورر تتسع لـ ٤ أشخاص'
    },
    slug: 'explorer-4-person-camping-tent',
    sku: 'OMNI-SO-CTENT-24',
    categoryId: 'cat_sports',
    subCategoryId: null,
    brand: 'Outfitter',
    price: 159.99,
    discountPrice: 139.99,
    stock: 15,
    isAvailable: true,
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80'],
    attributes: {
      capacity: '4 Adults Comfortably',
      waterproofing: 'PU 3000mm Rainfly protection, taped seams',
      poles: 'Heavy Duty Fiberglass Pop-up frame poles',
      setupTime: 'Quick 60 Seconds Instant Deployment setup'
    },
    rating: { average: 4.7, count: 62 },
    isFeatured: true,
    createdAt: '2026-07-30T09:00:00Z',
  }
];

export const mockCartItems: CartItem[] = [];

export const mockOrders: Order[] = [];
