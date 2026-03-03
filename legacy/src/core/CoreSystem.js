class CoreSystem {

  static instance;

  static getInstance() {
    if (!CoreSystem.instance) {
      CoreSystem.instance = new CoreSystem();
    }
    return CoreSystem.instance;
  }

  constructor() {

    // 🔐 AUTH
    this.auth = {

      checkAuth: () => true,

      secureWS: (url) => {
        const token = localStorage.getItem("auth_token");
        return new WebSocket(`${url}?token=${token}`);
      },

      async getKey() {
        const rawKey = new TextEncoder().encode("secret-key");
        return crypto.subtle.importKey(
          "raw",
          rawKey,
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["verify"]
        );
      }
    };

    // ⚙️ CONFIG
    this.config = {

      env: 'simu', // dev | simu | prod

      services: {
        ws: {
          dev: "ws://localhost:8080",
          simu: "ws://localhost:8080",
          prod: "wss://robot.mycompany.com"
        }
      },

      setEnvironment: (env) => {
        this.config.env = env;
        console.log("Environment changé vers", env);
      }
    };

    // 🧩 MODULES
    this.modules = {
      loadFromFolder: async () => {
        console.log("Modules chargés");
      }
    };

    console.log("✅ CoreSystem initialisé");
  }
}

export { CoreSystem };
