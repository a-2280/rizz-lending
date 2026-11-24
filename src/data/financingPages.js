// Approved SEO and loan names for the hub and brand pages.
// Sanity `page.seo` overrides the title and description once those fields are set.

export const FINANCING_PAGES = {
  'exotic-car-financing': {
    seoTitle: 'Exotic Car Financing | Supercar & Collector Car Loans | Rizz',
    seoDescription: 'Exotic car financing from a Riverton, Utah lender built by car people. Dealer, private-party, auction and lease buyout loans. Soft pull to check your options.',
    loanName: 'Exotic car financing',
    image: 'https://cdn.sanity.io/images/gx0bybp7/production/a4cc86a0ffa59d9a10a29aee7b1383927c81fdf3-1600x2400.jpg',
  },
  'porsche-financing': {
    seoTitle: 'Porsche Financing for 911, GT and Turbo Cars | Rizz Lending',
    seoDescription: 'Porsche financing from a lender that knows a 996 from a 992. Dealer, private-party and lease buyout loans for the 911, GT3, Turbo S and more. Soft pull to check.',
    loanName: 'Porsche financing',
    category: 'Porsche vehicle financing',
    image: 'https://cdn.sanity.io/images/gx0bybp7/production/aaa17c4cbce3b016a3cb944a6337527b89e5dac2-1600x1067.jpg',
  },
  'ferrari-financing': {
    seoTitle: 'Ferrari Financing for Modern and Classic Cars | Rizz Lending',
    seoDescription: 'Ferrari financing from car people. 296, F8, 812, Roma, Purosangue and the older V8 and V12 cars, from dealers, private sellers or a lease buyout. Soft pull to check.',
    loanName: 'Ferrari financing',
    category: 'Ferrari vehicle financing',
    image: 'https://cdn.sanity.io/images/gx0bybp7/production/86338de8b96e70b8e82b59493b413bfd27f289da-2400x1600.jpg',
  },
  'lamborghini-financing': {
    seoTitle: 'Lamborghini Financing: Huracán, Urus, Revuelto | Rizz Lending',
    seoDescription: 'Lamborghini financing from a lender that knows the cars. Huracán, Urus, Aventador, Revuelto and the older V12s, from dealers, private sellers or a lease buyout.',
    loanName: 'Lamborghini financing',
    category: 'Lamborghini vehicle financing',
    image: 'https://cdn.sanity.io/images/gx0bybp7/production/59c170b6c4b372bd4c56a58a813fb28a9ace9ce1-1600x1067.jpg',
  },
  'mclaren-financing': {
    seoTitle: 'McLaren Financing: 720S, 750S, Artura and More | Rizz Lending',
    seoDescription: 'McLaren financing from car people. 12C, 570S, 720S, 765LT, 750S, Artura and GT, plus the Ultimate Series, from dealers, private sellers or a lease buyout.',
    loanName: 'McLaren financing',
    category: 'McLaren vehicle financing',
    image: 'https://cdn.sanity.io/images/gx0bybp7/production/4a9e959ba9a22a82de30dc796412b7bac7fe3c4f-2400x1350.jpg',
  },
  'bentley-financing': {
    seoTitle: 'Bentley Financing: Continental GT, Bentayga | Rizz Lending',
    seoDescription: 'Bentley financing from a lender that knows the cars. Continental GT, Flying Spur and Bentayga, from dealers, private sellers or a lease buyout. Soft pull to check.',
    loanName: 'Bentley financing',
    category: 'Bentley vehicle financing',
    image: 'https://cdn.sanity.io/images/gx0bybp7/production/2565295b789689fb4466dbf61e2d05c531eaaca1-2400x1599.jpg',
  },
  'aston-martin-financing': {
    seoTitle: 'Aston Martin Financing: DB12, Vantage, DBX | Rizz Lending',
    seoDescription: 'Aston Martin financing from people who know the cars. DB11, DB12, Vantage, DBS, Vanquish and DBX, from dealers, private sellers or a lease buyout. Soft pull to check.',
    loanName: 'Aston Martin financing',
    category: 'Aston Martin vehicle financing',
    image: 'https://cdn.sanity.io/images/gx0bybp7/production/b91ea88d15251e8341b18641e9387f1cc1480abd-2400x1349.jpg',
  },
};

export const FINANCING_SEO = Object.fromEntries(Object.entries(FINANCING_PAGES).map(([slug, page]) => [slug, { title: page.seoTitle, description: page.seoDescription }]));
