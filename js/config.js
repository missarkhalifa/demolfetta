/*
 * De Molfetta — site configuration.
 * Everything that may change (contacts, WhatsApp, hours) lives here.
 */
window.DM_CONFIG = {
  /*
   * TODO: WhatsApp number in international format, digits only, no "+" or spaces
   * (e.g. "393331234567"). The shop's known number (+39 02 463437) is a landline
   * and cannot receive WhatsApp. While this is empty, the WhatsApp buttons open
   * WhatsApp with the message pre-filled and let the visitor pick the contact.
   */
  whatsappNumber: "",

  whatsappMessage: {
    it: "Buongiorno, vi scrivo dal sito di De Molfetta. Vorrei avere qualche informazione.",
    en: "Good morning, I'm writing from the De Molfetta website. I would like some information."
  },

  phoneDisplay: "+39 02 463437",
  phoneHref: "tel:+3902463437",
  email: "demolfetta1938@gmail.com",
  instagramHandle: "@demolfetta",
  instagramUrl: "https://instagram.com/demolfetta",
  instagramDm: "https://ig.me/m/demolfetta",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=De+Molfetta+Corso+Vercelli+11%2C+20144+Milano",

  /*
   * TODO: confirm opening hours with the shop, then set hoursConfirmed to true
   * to remove the "to be confirmed" notice.
   */
  hoursConfirmed: false,
  hours: [
    { it: "Lunedì", en: "Monday", time: { it: "15:30 – 19:30", en: "3:30 – 7:30 pm" } },
    { it: "Martedì – Sabato", en: "Tuesday – Saturday", time: { it: "10:00 – 13:00 · 15:30 – 19:30", en: "10 am – 1 pm · 3:30 – 7:30 pm" } },
    { it: "Domenica", en: "Sunday", time: { it: "Chiuso", en: "Closed" } }
  ]
};
