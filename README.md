# Drone Porto PE — site

Site de filmagem e fotografia aérea com drone em Porto de Galinhas e Ipojuca (PE). Next.js 14 (App Router), página estática, sem bibliotecas de animação: tudo em CSS.

## Rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Onde editar

- `src/lib/site.js`: WhatsApp, Instagram, URL do site, regiões atendidas e perguntas frequentes (também alimentam o JSON-LD de SEO).
- `src/app/page.js`: seções da página (problema, para quem, pacotes, voos, como funciona, piloto, dúvidas, CTA).
- `src/components/Hero.jsx`: primeira dobra com o visor aéreo animado.
- `src/components/Header.jsx`: navegação, menu hambúrguer no mobile e botões fixos de WhatsApp.
- `src/app/globals.css`: paleta (areia `#F3ECDF`, café `#211B14`, terracota `#A8471A`) e animações.

A galeria "Voos recentes" usa ilustrações provisórias: troque pelas fotos e vídeos reais do Instagram.
