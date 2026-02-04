/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['"Bebas Neue"', "sans-serif"],
      },
      colors: {
        // Adicione sua cor personalizada aqui
        "apocal-custom": {
          // Exemplo: sua cor original
          amare: "oklch(0.1591 0 0)", // Outra sombra da sua cor (ajuste L, a, b)
          escuro: "oklch(0.1591 0 0 / 79.2%)",
          laranjaClaro: "oklch(0.6634 0.1994 41.81)",
          laranjaEscuro: "oklch(0.5881 0.2 35.92)",
          azulClaro: "oklch(0.3768 0.0032 164.92)",
          cinzaEmer: "oklch(0.2272 0.0025 67.7 / 97.76%)",
        },
      },
    },
  },
  plugins: [],
};
