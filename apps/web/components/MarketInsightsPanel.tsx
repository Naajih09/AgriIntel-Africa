"use client";

import { useMemo, useRef, useState } from "react";
import { BarChart3, Database, FileSpreadsheet, PieChart as PieChartIcon, Upload } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { MarketPrice } from "@agriintel/types";
import { parseCsv } from "@/lib/csv";

type MarketInsightsPanelProps = {
  prices: MarketPrice[];
};

const chartColors = ["#27714b", "#c98222", "#256f8f", "#8b4f35", "#526a5a", "#9a6f1e"];

export function MarketInsightsPanel({ prices }: MarketInsightsPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadedPrices, setUploadedPrices] = useState<MarketPrice[] | null>(null);
  const [fileName, setFileName] = useState("market_prices.csv");
  const [uploadError, setUploadError] = useState("");
  const activePrices = uploadedPrices?.length ? uploadedPrices : prices;

  const barData = useMemo(() => {
    const byCommodity = new Map<string, { commodity: string; total: number; count: number }>();

    activePrices.forEach((price) => {
      const current = byCommodity.get(price.commodity) ?? { commodity: price.commodity, total: 0, count: 0 };
      current.total += Number(price.price_local_currency);
      current.count += 1;
      byCommodity.set(price.commodity, current);
    });

    return Array.from(byCommodity.values())
      .map((item) => ({
        commodity: item.commodity,
        averagePrice: Math.round(item.total / item.count)
      }))
      .sort((a, b) => b.averagePrice - a.averagePrice)
      .slice(0, 6);
  }, [activePrices]);

  const pieData = useMemo(() => {
    const byCountry = new Map<string, number>();

    activePrices.forEach((price) => {
      byCountry.set(price.country, (byCountry.get(price.country) ?? 0) + 1);
    });

    return Array.from(byCountry.entries()).map(([country, records]) => ({ country, records }));
  }, [activePrices]);

  async function handleUpload(file: File | null) {
    if (!file) return;

    const content = await file.text();
    const parsedPrices = parseCsv<MarketPrice>(content).filter((price) => price.commodity && price.market_name);

    if (!parsedPrices.length) {
      setUploadError("CSV needs commodity and market_name columns.");
      return;
    }

    setUploadedPrices(parsedPrices);
    setFileName(file.name);
    setUploadError("");
  }

  return (
    <section className="section">
      <div className="section-title">
        <BarChart3 size={24} />
        <h2>Market Charts</h2>
      </div>

      <div className="analytics-layout">
        <aside className="data-binding-aside">
          <div className="aside-heading">
            <h3>Data Binding</h3>
            <Database size={20} />
          </div>

          <input
            ref={inputRef}
            accept=".csv,text/csv"
            className="visually-hidden"
            type="file"
            onChange={(event) => handleUpload(event.target.files?.[0] ?? null)}
          />
          <button className="upload-button" type="button" onClick={() => inputRef.current?.click()}>
            <Upload size={18} />
            Upload CSV
          </button>

          <div className="source-card">
            <FileSpreadsheet size={18} />
            <div>
              <strong>{fileName}</strong>
              <span>{activePrices.length.toLocaleString()} bound records</span>
            </div>
          </div>

          {uploadError ? <p className="upload-error">{uploadError}</p> : null}

          <dl className="binding-list">
            <div>
              <dt>Pie segment</dt>
              <dd>country</dd>
            </div>
            <div>
              <dt>Pie value</dt>
              <dd>record count</dd>
            </div>
            <div>
              <dt>Bar category</dt>
              <dd>commodity</dd>
            </div>
            <div>
              <dt>Bar value</dt>
              <dd>avg price_local_currency</dd>
            </div>
          </dl>
        </aside>

        <div className="chart-grid">
          <article className="chart-panel">
            <div className="chart-heading">
              <PieChartIcon size={20} />
              <div>
                <h3>Records by Country</h3>
                <p>{fileName}</p>
              </div>
            </div>
            <div className="chart-frame">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="records" nameKey="country" innerRadius={52} outerRadius={86}>
                    {pieData.map((item, index) => (
                      <Cell key={item.country} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="chart-panel">
            <div className="chart-heading">
              <BarChart3 size={20} />
              <div>
                <h3>Average Price by Commodity</h3>
                <p>{activePrices.length.toLocaleString()} price records</p>
              </div>
            </div>
            <div className="chart-frame">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 8, right: 12, bottom: 6, left: 0 }}>
                  <XAxis dataKey="commodity" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} width={48} />
                  <Tooltip />
                  <Bar dataKey="averagePrice" name="Average price" radius={[6, 6, 0, 0]} fill="#27714b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
