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

  return broker.servers.some(
    (s) =>
      s.name === server &&
      s.platform === platform &&
      s.accountType === accountType,
  );
}
