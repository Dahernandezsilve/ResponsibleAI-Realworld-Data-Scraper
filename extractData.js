import fs from "fs";
import "dotenv/config";

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

async function fetchAllProperties() {
  let allData = [];
  let offset = 0;
  const pageSize = 1000;

  while (true) {
    const res = await fetch(
      `${API_URL}?select=*&offset=${offset}&limit=${pageSize}&order=property_order.desc,created_at.desc`,
      {
        method: "GET",
        headers: {
          "apikey": API_KEY,
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Error:", errorText);
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    if (data.length === 0) {
      break; // ya no hay más páginas
    }

    allData = allData.concat(data);
    console.log(`📦 Página con ${data.length} registros descargada. Total: ${allData.length}`);
    offset += pageSize;
  }

  console.log(`✅ Total de registros obtenidos: ${allData.length}`);
  fs.writeFileSync("data.json", JSON.stringify(allData, null, 2), "utf-8");
  console.log("📁 Archivo 'data.json' creado con éxito!");
}

fetchAllProperties();
