// Home page sections: shown when `visible`, in ascending `order`. A hidden section has no block and no page.
export default [
  { key: 'hero', visible: true, order: 10, heading: 'Fresh from our oven, every morning', heading_2nd: 'প্রতি সকালে আমাদের ওভেন থেকে তাজা', text: 'Bread, pastries and cakes baked in Greenfield since 2012.', text_2nd: '২০১২ সাল থেকে গ্রিনফিল্ডে তৈরি রুটি, পেস্ট্রি আর কেক।', image: 'hero.jpg' },
  { key: 'about', visible: true, order: 20, heading: 'About us', heading_2nd: 'আমাদের কথা', text: 'We are a family bakery. Our dough rests overnight, our butter is local and nothing leaves the shop that we would not serve at home.', text_2nd: 'আমরা একটি পারিবারিক বেকারি। আমাদের ডো সারা রাত বিশ্রাম নেয়, মাখন স্থানীয়, আর যা আমরা নিজের বাড়িতে পরিবেশন করব না তা দোকান থেকে বের হয় না।', image: 'about.jpg' },
  { key: 'services', visible: true, order: 30, heading: 'What we bake', heading_2nd: 'আমরা যা বানাই', text: 'From a morning loaf to a wedding cake.', text_2nd: 'সকালের রুটি থেকে বিয়ের কেক পর্যন্ত।', image: null },
  { key: 'pricing', visible: true, order: 35, heading: 'Pricing', heading_2nd: 'মূল্য তালিকা', text: 'Clear prices for everything we bake.', text_2nd: 'আমরা যা বানাই তার স্পষ্ট দাম।', image: null },
  { key: 'testimonials', visible: true, order: 40, heading: 'Kind words', heading_2nd: 'ভালো কথা', text: null, image: null },
  { key: 'gallery', visible: true, order: 50, heading: 'From the bakery', heading_2nd: 'বেকারি থেকে', text: null, image: null },
  { key: 'faq', visible: true, order: 60, heading: 'Questions', heading_2nd: 'প্রশ্নোত্তর', text: null, image: null },
  { key: 'team', visible: false, order: 70, heading: 'Our bakers', heading_2nd: 'আমাদের বেকাররা', text: null, image: null },
  { key: 'contact', visible: true, order: 80, heading: 'Visit or call us', heading_2nd: 'আসুন বা ফোন করুন', text: 'Order a cake, ask about catering, or just say hello.', text_2nd: 'কেকের অর্ডার দিন, ক্যাটারিং সম্পর্কে জানুন, বা শুধু হ্যালো বলুন।', image: null },
]
