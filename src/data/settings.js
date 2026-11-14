// Business settings. `x_2nd` is the second-language text; leave it out (or empty) to show the default text.
// Images are files under /images (added in phase L6); null shows none.
export default {
  site_name: 'Riverside Bakery',
  site_name_2nd: 'রিভারসাইড বেকারি',
  tagline: 'Fresh bread, cakes and coffee, baked daily',
  tagline_2nd: 'প্রতিদিন তাজা রুটি, কেক আর কফি',
  logo: null,
  favicon: null,
  hours: {
    mon: { open: '07:00', close: '18:00', closed: false },
    tue: { open: '07:00', close: '18:00', closed: false },
    wed: { open: '07:00', close: '18:00', closed: false },
    thu: { open: '07:00', close: '18:00', closed: false },
    fri: { open: '07:00', close: '20:00', closed: false },
    sat: { open: '08:00', close: '20:00', closed: false },
    sun: { open: null, close: null, closed: true },
  },
  address: '24 River Road\nGreenfield 1207',
  address_2nd: '২৪ রিভার রোড\nগ্রিনফিল্ড ১২০৭',
  phone: '+880 1700 000000',
  whatsapp: '8801700000000',
  email: 'hello@riversidebakery.example',
  social_links: {
    facebook: 'https://www.facebook.com/riversidebakery.example',
    instagram: 'https://www.instagram.com/riversidebakery.example',
  },
  map_url: 'https://www.google.com/maps/search/?api=1&query=24+River+Road+Greenfield',
  seo: {
    title: 'Riverside Bakery | Fresh bread and cakes in Greenfield',
    title_2nd: 'রিভারসাইড বেকারি | গ্রিনফিল্ডে তাজা রুটি ও কেক',
    description: 'A family bakery in Greenfield. Fresh bread every morning, custom cakes, catering and coffee.',
    description_2nd: 'গ্রিনফিল্ডের একটি পারিবারিক বেকারি। প্রতিদিন সকালে তাজা রুটি, অর্ডারে কেক, ক্যাটারিং আর কফি।',
    og_image: null,
  },
  // Which contact methods the Contact page and footer show.
  contact: { call: true, whatsapp: true, email: true, hours: true, map: true },
}
