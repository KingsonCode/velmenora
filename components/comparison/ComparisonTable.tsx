import type { Broker } from "@/lib/types/broker";

type Props = {
    brokerA: Broker;
    brokerB: Broker;
};

export default function ComparisonTable({ brokerA, brokerB }: Props) {
    return (
        <table className="w-full border mt-8">
            <thead>
                <tr>
                    <th>Feature</th>
                    <th>{brokerA.name}</th>
                    <th>{brokerB.name}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Rating</td>
                    <td>{brokerA.rating}</td>
                    <td>{brokerB.rating}</td>
                </tr>
                <tr>
                    <td>Min Deposit</td>
                    <td>${brokerA.minDeposit}</td>
                    <td>${brokerB.minDeposit}</td>
                </tr>
            </tbody>
        </table>
    );
}
