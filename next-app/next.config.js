/**
 * Configuración de producción de Next.js (Tema 13).
 * - Minificación/optimización: Next.js usa SWC + Terser para minimizar el
 *   bundle del cliente; se eliminan console.log/info en producción y se
 *   conservan warn/error para el monitoreo.
 * - Webpack: se personaliza splitChunks para separar el vendor (React) del
 *   código de la aplicación y mejorar el cacheo del navegador.
 * - `poweredByHeader: false` evita revelar el framework.
 * - `compress: true` habilita compresión gzip/Brotli en el servidor.
 */
const nextConfig = {
    reactStrictMode: true,
    compress: true,
    poweredByHeader: false,
    productionBrowserSourceMaps: false,
    compiler: {
        removeConsole:
            process.env.NODE_ENV === "production"
                ? { exclude: ["error", "warn"] }
                : false
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.optimization.splitChunks = {
                chunks: "all",
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendor",
                        chunks: "all",
                        priority: -10
                    }
                }
            };
        }
        return config;
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "X-Frame-Options", value: "SAMEORIGIN" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
                ]
            }
        ];
    }
};

module.exports = nextConfig;
