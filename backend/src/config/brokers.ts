export type BrokerSlug = "exness" | "xm";
export type PlatformType = "MT4" | "MT5";
export type BrokerAccountType = "DEMO" | "REAL";

export const BROKERS = [
  {
    slug: "exness",
    name: "Exness",
    allowedAccountTypes: ["DEMO", "REAL"],
    platforms: ["MT4", "MT5"],
    servers: [
      { name: "Exness-MT5Trial", platform: "MT5", accountType: "DEMO" },
      { name: "Exness-MT4Trial", platform: "MT4", accountType: "DEMO" },
      { name: "Exness-MT5Real", platform: "MT5", accountType: "REAL" },
      { name: "Exness-MT4Real", platform: "MT4", accountType: "REAL" },
    ],
  },
  {
    slug: "xm",
    name: "XM",
    allowedAccountTypes: ["DEMO", "REAL"],
    platforms: ["MT4", "MT5"],
    servers: [
      { name: "XMGlobal-Demo", platform: "MT5", accountType: "DEMO" },
      { name: "XMGlobal-MT4 Demo", platform: "MT4", accountType: "DEMO" },

      { name: "XMGlobal-MT5", platform: "MT5", accountType: "REAL" },
      { name: "XMGlobal-MT4", platform: "MT4", accountType: "REAL" },

      { name: "XMGlobal-Real", platform: "MT5", accountType: "REAL" },
      { name: "XMGlobal-Real", platform: "MT4", accountType: "REAL" },

      { name: "XMTrading-Demo", platform: "MT5", accountType: "DEMO" },
      { name: "XMTrading-Demo", platform: "MT4", accountType: "DEMO" },
      { name: "XMTrading-Real", platform: "MT5", accountType: "REAL" },
      { name: "XMTrading-Real", platform: "MT4", accountType: "REAL" },
    ],
  },
] as const;

export function validateBroker(
  brokerName: string,
  accountType: string,
  platform: string,
  server: string,
) {
  const broker = BROKERS.find((b) => b.slug === brokerName);
  if (!broker) return false;

  const normalizedServer = server.trim();

  return broker.servers.some((s) => {
    const accountAndPlatformMatch =
      s.platform === platform && s.accountType === accountType;

    if (!accountAndPlatformMatch) return false;

    // Exact match is valid.
    if (s.name === normalizedServer) return true;

    // Allow numbered / suffixed server variants:
    // Exness-MT5Trial9, Exness-MT5Real12, XMGlobal-Real 30, XMTrading-Demo2.
    if (normalizedServer.startsWith(s.name)) {
      return true;
    }

    return false;
  });
}
