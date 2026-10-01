export const SITE_URL = "https://drones-porto-2bim.vercel.app";

export const WHATSAPP = "5581996810562";
export const WHATSAPP_DISPLAY = "(81) 99681-0562";
export const INSTAGRAM = "https://www.instagram.com/droneportope/";

export const wa = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

export const WA = {
  geral: wa("Olá! Vim pelo site e quero um orçamento de filmagem com drone."),
  pousada: wa("Olá! Tenho uma pousada/hotel e quero um orçamento de vídeo com drone."),
  imovel: wa("Olá! Quero um orçamento de fotos e vídeo com drone para um imóvel/terreno."),
  evento: wa("Olá! Quero um orçamento de filmagem com drone para um evento."),
  comercio: wa("Olá! Tenho um comércio/restaurante e quero Reels com drone."),
};

export const PLACES = ["Porto de Galinhas", "Muro Alto", "Maracaípe", "Serrambi", "Nossa Senhora do Ó", "Cupe", "Ipojuca"];

export const FAQ = [
  {
    q: "Quanto custa filmar com drone em Porto de Galinhas?",
    a: "Depende do local, do tempo de voo e do que você precisa receber. Cada orçamento é feito sob medida, sem compromisso. Mande o local e o objetivo no WhatsApp e o valor fechado sai na conversa.",
  },
  {
    q: "É permitido voar drone na praia?",
    a: "Sim. O voo é planejado seguindo as regras da ANAC e do DECEA, com o DJI Mini 3, que pesa menos de 250 g, a categoria mais leve e segura para voar perto de pessoas.",
  },
  {
    q: "E se chover ou ventar no dia?",
    a: "A gente acompanha a previsão e remarca para o próximo dia bom, sem custo extra. Imagem com tempo feio não vende, então não vale a pena voar.",
  },
  {
    q: "A entrega é rápida?",
    a: "A entrega é rápida: logo depois do voo você recebe por link para download em alta qualidade, já nos formatos de feed, Reels/Stories e site.",
  },
  {
    q: "Posso usar as imagens em anúncios?",
    a: "Sim. O material é seu para usar no Instagram, Booking, Airbnb, portais de imóveis, site e anúncios pagos.",
  },
  {
    q: "Quais regiões vocês atendem?",
    a: "Porto de Galinhas, Muro Alto, Maracaípe, Serrambi, Cupe, Nossa Senhora do Ó e todo o município de Ipojuca. Outras cidades do litoral sul de Pernambuco sob consulta.",
  },
];
