export function parseCsv<T extends Record<string, unknown>>(content: string): T[] {
  const rows = content.trim().split(/\r?\n/).map(parseCsvLine);
  const headers = rows.shift() ?? [];

  return rows.map((row) => {
    const entry: Record<string, unknown> = {};
    headers.forEach((header, index) => {
      entry[header] = coerceValue(row[index] ?? "");
    });
    return entry as T;
  });
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(value);
      value = "";
    } else {
      value += char;
    }
  }

  values.push(value);
  return values;
}

function coerceValue(value: string): string | number {
  const trimmed = value.trim();
  if (/^[+-]?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }
  return trimmed;
}
