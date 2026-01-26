"use client";

import React from 'react';

const UltraFastPage = () => {
  // Basic state management for each step
  const [sheetData, setSheetData] = React.useState<any[]>([]);
  const [researchData, setResearchData] = React.useState<any[]>([]);
  const [proposals, setProposals] = React.useState<any[]>([]);
  const [approved, setApproved] = React.useState<any>({});
  const [storyboard, setStoryboard] = React.useState<any>(null);
  const [render, setRender] = React.useState<any>(null);
  const [publish, setPublish] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const run = async (url: string, body: any) => {
    setLoading(true);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const result = await res.json();
    setLoading(false);
    return result;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ultra-Fast Mode</h1>

      {/* 1. Upload */}
      <div className="p-4 border rounded mb-4">
        <h2 className="font-bold">1. Upload Sheet</h2>
        <button onClick={async () => {
          const res = await run('/api/ultra-fast/upload-sheet', {});
          setSheetData(res.data);
        }}>Upload & Normalize</button>
        {sheetData.length > 0 && <pre>{JSON.stringify(sheetData, null, 2)}</pre>}
      </div>

      {/* 2. Research */}
      {sheetData.length > 0 && <div className="p-4 border rounded mb-4">
        <h2 className="font-bold">2. Research</h2>
        <button onClick={async () => {
          const res = await run('/api/ultra-fast/research', { data: sheetData });
          setResearchData(res.data);
        }}>Run Research</button>
        {researchData.length > 0 && <pre>{JSON.stringify(researchData, null, 2)}</pre>}
      </div>}

      {/* 3. Proposals */}
      {researchData.length > 0 && <div className="p-4 border rounded mb-4">
        <h2 className="font-bold">3. Generate Proposals</h2>
        <button onClick={async () => {
          const res = await run('/api/ultra-fast/proposals', { data: researchData });
          setProposals(res.data);
        }}>Generate</button>
        {proposals.length > 0 && <pre>{JSON.stringify(proposals, null, 2)}</pre>}
      </div>}

      {/* 4. Approval */}
      {proposals.length > 0 && <div className="p-4 border rounded mb-4">
        <h2 className="font-bold">4. Approve Assets</h2>
        {proposals.map(p => (
          <div key={p.id} className="flex items-center gap-2">
            <span>{p.title}</span>
            <button
              className="bg-green-500 text-white p-1"
              onClick={async () => {
                const res = await run('/api/ultra-fast/approve', { itemId: p.id, itemData: p });
                setApproved({ ...approved, [p.id]: res.approvedItem });
              }}>Approve</button>
          </div>
        ))}
        {Object.keys(approved).length > 0 && <pre>{JSON.stringify(approved, null, 2)}</pre>}
      </div>}

      {/* 5. Storyboard */}
      {Object.keys(approved).length > 0 && <div className="p-4 border rounded mb-4">
        <h2 className="font-bold">5. Create Storyboard</h2>
        <button onClick={async () => {
          const res = await run('/api/ultra-fast/storyboard', { approvedItems: Object.values(approved) });
          setStoryboard(res.storyboard);
        }}>Build Storyboard</button>
        {storyboard && <pre>{JSON.stringify(storyboard, null, 2)}</pre>}
      </div>}

      {/* 6. Render */}
      {storyboard && <div className="p-4 border rounded mb-4">
        <h2 className="font-bold">6. Render Video</h2>
        <button onClick={async () => {
          const res = await run('/api/ultra-fast/render', { storyboard });
          setRender(res.result);
        }}>Render</button>
        {render && <pre>{JSON.stringify(render, null, 2)}</pre>}
      </div>}

      {/* 7. Publish */}
      {render && <div className="p-4 border rounded mb-4">
        <h2 className="font-bold">7. Publish to YouTube</h2>
        <button onClick={async () => {
          const res = await run('/api/ultra-fast/publish', { renderResult: render, finalApproval: true });
          setPublish(res.result);
        }}>Publish</button>
        {publish && <pre>{JSON.stringify(publish, null, 2)}</pre>}
      </div>}

      {loading && <div className="fixed top-0 left-0 w-full h-full bg-gray-500/50 flex items-center justify-center">Loading...</div>}

    </div>
  );
};

export default UltraFastPage;
