import { NextRequest, NextResponse } from "next/server";

// Gera query de busca inteligente a partir do texto
function generateSearchQuery(text: string): string {
  const stopWords = ["o", "a", "os", "as", "de", "da", "do", "em", "para", "com", "por", "e", "que", "você", "seu", "sua", "este", "esta"];
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter((w) => w.length > 3 && !stopWords.includes(w));

  return words.slice(0, 3).join(" ") || "professional business";
}

// Busca mídia no Pexels
async function searchPexels(query: string, perPage = 5) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  const results: any[] = [];

  try {
    // Buscar vídeos
    const videoRes = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}`,
      { headers: { Authorization: apiKey } }
    );

    if (videoRes.ok) {
      const data = await videoRes.json();
      if (data.videos) {
        data.videos.forEach((video: any) => {
          const hdFile = video.video_files.find((f: any) => f.quality === "hd");
          if (hdFile) {
            results.push({
              id: `pexels-video-${video.id}`,
              url: hdFile.link,
              thumbnail: video.image,
              type: "video",
              source: "pexels",
            });
          }
        });
      }
    }

    // Buscar imagens
    const imageRes = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`,
      { headers: { Authorization: apiKey } }
    );

    if (imageRes.ok) {
      const data = await imageRes.json();
      if (data.photos) {
        data.photos.forEach((photo: any) => {
          results.push({
            id: `pexels-image-${photo.id}`,
            url: photo.src.large,
            thumbnail: photo.src.medium,
            type: "image",
            source: "pexels",
          });
        });
      }
    }
  } catch (error) {
    console.error("Pexels search failed:", error);
  }

  return results;
}

// Busca mídia no Pixabay
async function searchPixabay(query: string, perPage = 5) {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) return [];

  const results: any[] = [];

  try {
    // Buscar vídeos
    const videoRes = await fetch(
      `https://pixabay.com/api/videos/?key=${apiKey}&q=${encodeURIComponent(query)}&per_page=${perPage}`
    );

    if (videoRes.ok) {
      const data = await videoRes.json();
      if (data.hits) {
        data.hits.forEach((video: any) => {
          const medium = video.videos.medium;
          if (medium) {
            results.push({
              id: `pixabay-video-${video.id}`,
              url: medium.url,
              thumbnail: video.userImageURL || `https://i.vimeocdn.com/video/${video.picture_id}_200x150.jpg`,
              type: "video",
              source: "pixabay",
            });
          }
        });
      }
    }

    // Buscar imagens
    const imageRes = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&per_page=${perPage}&image_type=photo`
    );

    if (imageRes.ok) {
      const data = await imageRes.json();
      if (data.hits) {
        data.hits.forEach((image: any) => {
          results.push({
            id: `pixabay-image-${image.id}`,
            url: image.largeImageURL,
            thumbnail: image.webformatURL,
            type: "image",
            source: "pixabay",
          });
        });
      }
    }
  } catch (error) {
    console.error("Pixabay search failed:", error);
  }

  return results;
}

export async function POST(request: NextRequest) {
  try {
    const { sections } = await request.json();

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json({ error: "Seções inválidas" }, { status: 400 });
    }

    const scenes = await Promise.all(
      sections.map(async (section: any) => {
        const query = generateSearchQuery(section.text);

        // Buscar em paralelo de ambas as fontes
        const [pexelsResults, pixabayResults] = await Promise.all([
          searchPexels(query, 3),
          searchPixabay(query, 3),
        ]);

        // Combinar resultados (priorizar vídeos, depois imagens)
        const allResults = [...pexelsResults, ...pixabayResults];
        const videos = allResults.filter((r) => r.type === "video").slice(0, 3);
        const images = allResults.filter((r) => r.type === "image").slice(0, 3);
        const options = [...videos, ...images].slice(0, 6);

        // Se não encontrou nada, usar placeholder
        if (options.length === 0) {
          options.push({
            id: `placeholder-${section.id}`,
            url: `https://placehold.co/1920x1080/1a1a1a/ffffff?text=${encodeURIComponent(query)}`,
            thumbnail: `https://placehold.co/640x360/1a1a1a/ffffff?text=${encodeURIComponent(query)}`,
            type: "image",
            source: "placeholder",
          });
        }

        return {
          sceneId: section.id,
          options,
          selected: options[0] || null, // Auto-seleciona a primeira opção
        };
      })
    );

    return NextResponse.json({ scenes });
  } catch (error) {
    console.error("Media search error:", error);
    return NextResponse.json(
      { error: "Falha ao buscar mídia" },
      { status: 500 }
    );
  }
}
