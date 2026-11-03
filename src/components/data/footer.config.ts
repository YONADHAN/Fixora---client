export const clientFooterConfig = {
  sections: [
    {
      title: "Explore",
      links: [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/customer/about_us" },
      ],
    },
    {
      title: "Authentication",
      links: [
        {
          label: "Sign In", href: "/customer/signin"
        },
        {
          label: "Sign Up", href: "/customer/signup"
        },
      ]
    },
    {
      title: "For Professionals",
      links: [
        {label:"Professionals Sign In", href:"/vendor/signin"},
        {label:"Professionals Sign Up", href:"/vendor/signup"}
      ]
    },
    {
      title: 'Explore Services',
      links: [],
    },
    
  ],
};


export const customerFooterConfig= {
  sections: [
    {
      title: "Explore",
      links: [
        {label: "Home", href: "/"},
        {label: "About Us", href: "/customer/about_us"}
      ]
    },
    {
      title:"Account",
      links: [
        {label: "Profile", href:"/customer/profile"},
        {label: "Wallet", href: "/customer/wallet"},
        {label: "Bookings", href:"/customer/booking/list"},
      ]
    },
    {
      title: 'Explore Services',
      links: [],
    },
  ]
}
export const vendorFooterConfig = {
  sections: [
    {
      title: "Business",
      links: [
        { label: "Dashboard", href: "/vendor/dashboard" },
        { label: "My Services", href: "/vendor/service" },
        { label: "Bookings", href: "/vendor/booking/list" },
      ],
    },
  ],
};


export const adminPublicFooterConfig = {
  sections: [
    {
      title: 'Explore',
      links: [
        { label: 'Home', href: '/' },
        { label: 'About Us', href: '/customer/about_us' },
      ],
    },
    {
      title: 'Customer',
      links: [
        { label: 'Customer Sign In', href: '/customer/signin' },
        { label: 'Customer Sign Up', href: '/customer/signup' },
      ],
    },
    {
      title: 'Professionals',
      links: [
        { label: 'Professional Sign In', href: '/vendor/signin' },
        { label: 'Professional Sign Up', href: '/vendor/signup' },
      ],
    },
  ],
}


export const adminFooterConfig = {
  sections: [
    {
      title: "Management",
      links: [
        {
          label: "Dashboard",
          href: "/admin/dashboard",
        },
        {
          label: "Customers",
          href: "/admin/dashboard/management/customer-management",
        },
        {
          label: "Vendors",
          href: "/admin/dashboard/management/vendor-management",
        },
        {
          label: "Requests",
          href: "/admin/dashboard/management/request-management",
        },
      ],
    },
    {
      title: "Platform",
      links: [
        {
          label: "Services",
          href: "/admin/dashboard/service",
        },
        {
          label: "Subscriptions",
          href: "/admin/dashboard/subscription",
        },
        {
          label: "Wallet",
          href: "/admin/dashboard/wallet",
        },
      ],
    },
  ],
};