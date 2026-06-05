import { Warehouse } from "lucide-react";
import { DecisionCard } from "@/components/DecisionCard";
import { marketDecision } from "@/lib/advisory";
import { getMarketPrices, getStorageAdvisories } from "@/lib/data";

export default function MarketPage() {
  const prices = getMarketPrices();
  const storage = getStorageAdvisories();

  return (
    <section className="section">
      <div className="section-title">
        <Warehouse size={24} />
        <h2>Post-Harvest & Market Intelligence</h2>
      </div>
      <div className="record-grid">
        {storage.map((item) => (
          <DecisionCard
            key={item.farmer_id}
            eyebrow={item.farmer_id}
            title={`${item.quantity_kg.toLocaleString()}kg ${item.commodity}`}
            meta={`${item.location.state}, ${item.location.country} | ${item.current_storage}`}
            badges={[`${item.assessment.shelf_life_current_days} days shelf life`, item.assessment.risk.split(" ")[0]]}
            decision={marketDecision(prices, item)}
          />
        ))}
      </div>
      <div className="section table-wrap">
        <table>
          <thead>
            <tr>
              <th>Commodity</th>
              <th>Market</th>
              <th>Price</th>
              <th>30-day trend</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((price) => (
              <tr key={price.record_id}>
                <td>{price.commodity}</td>
                <td>{price.market_name}, {price.state}</td>
                <td>{price.currency} {price.price_local_currency}/kg</td>
                <td>{price.price_trend_30day}%</td>
                <td>{price.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
