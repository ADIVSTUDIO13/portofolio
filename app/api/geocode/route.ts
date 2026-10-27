import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  try {
    if (query) {
      // 1. Forward Geocoding: Search by name / address
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&addressdetails=1&limit=5`;

      const response = await fetch(nominatimUrl, {
        headers: {
          "User-Agent": "myporto-portfolio/1.0 (contact: fakhriaryadzaki@gmail.com)",
          "Accept-Language": "id,en",
        },
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: "Gagal menghubungi server geocoding OpenStreetMap" },
          { status: 502 }
        );
      }

      const raw = await response.json();
      if (!Array.isArray(raw) || raw.length === 0) {
        return NextResponse.json({ results: [] });
      }

      const results = raw.map((item: any) => {
        const addr = item.address || {};
        const title =
          item.name ||
          addr.amenity ||
          addr.school ||
          addr.building ||
          addr.road ||
          query;

        const subtitle = [
          addr.suburb || addr.village,
          addr.city || addr.county || addr.state,
          addr.country,
        ]
          .filter(Boolean)
          .join(", ");

        // Determine optimal zoom level based on place type
        let zoom = 16;
        if (item.type === "city" || item.addresstype === "city") zoom = 12;
        else if (item.type === "administrative" || item.addresstype === "suburb") zoom = 14;
        else if (item.class === "building" || item.class === "amenity") zoom = 17;

        return {
          title,
          subtitle: subtitle || "Area " + (addr.city || "Indonesia"),
          address: item.display_name,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          zoom,
          type: item.type,
          class: item.class,
        };
      });

      return NextResponse.json({ results });
    } else if (lat && lon) {
      // 2. Reverse Geocoding: Coordinate to Address, Title, and Subtitle
      const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
        lat
      )}&lon=${encodeURIComponent(lon)}&addressdetails=1`;

      const response = await fetch(nominatimUrl, {
        headers: {
          "User-Agent": "myporto-portfolio/1.0 (contact: fakhriaryadzaki@gmail.com)",
          "Accept-Language": "id,en",
        },
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: "Gagal melakukan reverse geocoding" },
          { status: 502 }
        );
      }

      const item = await response.json();
      if (!item || item.error) {
        return NextResponse.json(
          { error: item.error || "Lokasi tidak ditemukan" },
          { status: 404 }
        );
      }

      const addr = item.address || {};
      const title =
        item.name ||
        addr.amenity ||
        addr.school ||
        addr.college ||
        addr.university ||
        addr.building ||
        addr.office ||
        addr.shop ||
        addr.tourism ||
        addr.historic ||
        addr.leisure ||
        addr.road ||
        addr.neighbourhood ||
        addr.suburb ||
        "Titik Terpilih";

      const subtitle = [
        addr.suburb || addr.village || addr.neighbourhood,
        addr.city || addr.county || addr.state_district || addr.state,
      ]
        .filter(Boolean)
        .join(", ");

      return NextResponse.json({
        result: {
          title,
          subtitle: subtitle || "Lokasi Portofolio",
          address: item.display_name,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          zoom: 16,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Parameter 'q' atau 'lat'&'lon' diperlukan" },
        { status: 400 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
