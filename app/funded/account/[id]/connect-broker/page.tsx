import ConnectBrokerClient from "./_components/ConnectBrokerClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ConnectBrokerPage({ params }: PageProps) {
  const { id } = await params;

  return <ConnectBrokerClient accountId={id} />;
}
