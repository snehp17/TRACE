import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Network, ZoomIn, ZoomOut, RotateCcw, Filter, Eye, ShieldAlert, Sparkles, Layers, ListFilter, Info, ArrowRight, ExternalLink, X, ChevronRight } from 'lucide-react';

export function getNodeCategoryColor(category) {
  if (!category) return '#D9A15C';
  const norm = String(category).trim().toLowerCase();
  if (norm.includes('trans') || norm.includes('travel') || norm.includes('commute')) return '#7CB49C'; // Sage
  if (norm.includes('food') || norm.includes('dining') || norm.includes('grocery') || norm.includes('snack')) return '#D9A15C'; // Amber
  if (norm.includes('music') || norm.includes('audio') || norm.includes('stream') || norm.includes('sub')) return '#9B83D8'; // Lavender
  if (norm.includes('shop') || norm.includes('ecommerce')) return '#BEAEE8';
  if (norm.includes('fest') || norm.includes('cultur')) return '#E6A868';
  if (norm.includes('fam') || norm.includes('home') || norm.includes('house')) return '#548C74';
  if (norm.includes('fit') || norm.includes('health') || norm.includes('med')) return '#489B85';
  if (norm.includes('tech') || norm.includes('elect')) return '#8EA7E9';
  if (norm.includes('anom') || norm.includes('fraud') || norm.includes('risk')) return '#E06C75';
  return '#D9A15C';
}

export default function ConnectionMap({
  relationshipData,
  activeAdapter,
  onSelectReceipt,
  onOpenEvidence
}) {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState('graph'); // 'graph' | 'list'
  const [filterType, setFilterType] = useState('all');
  
  // Pan state
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const hasDragged = useRef(false); // distinguish click from drag

  const { nodes = [], connections = [] } = relationshipData || {};

  // Global node lookup map
  const allNodesMap = useMemo(() => {
    const map = {};
    nodes.forEach(n => {
      map[n.id] = n;
    });
    return map;
  }, [nodes]);

  // Compute actual connection degree per node
  const connectionCounts = useMemo(() => {
    const counts = {};
    connections.forEach(c => {
      counts[c.source] = (counts[c.source] || 0) + 1;
      counts[c.target] = (counts[c.target] || 0) + 1;
    });
    return counts;
  }, [connections]);

  // Prioritize nodes that actually participate in connections so lines connect them on the canvas
  const displayNodes = useMemo(() => {
    if (!nodes || nodes.length === 0) return [];

    const activeNodeIds = new Set();
    // Include both endpoints of discovered connections
    connections.slice(0, 90).forEach(c => {
      activeNodeIds.add(c.source);
      activeNodeIds.add(c.target);
    });

    const primaryNodes = [];
    const secondaryNodes = [];

    nodes.forEach(n => {
      if (activeNodeIds.has(n.id)) {
        primaryNodes.push(n);
      } else {
        secondaryNodes.push(n);
      }
    });

    // Select up to 75 total nodes for dense, fluid, beautiful graph performance
    return [...primaryNodes, ...secondaryNodes].slice(0, 75);
  }, [nodes, connections]);

  // Compute node positions in a structured multi-cluster or galaxy radial layout
  const layoutNodes = useMemo(() => {
    if (!displayNodes || displayNodes.length === 0) return [];

    // Group nodes by category or subcategory
    const catGroups = {};
    displayNodes.forEach((n) => {
      const cat = n.category || n.subcategory || 'General';
      if (!catGroups[cat]) catGroups[cat] = [];
      catGroups[cat].push(n);
    });

    const categories = Object.keys(catGroups);
    const result = [];
    const centerX = 700;
    const centerY = 450;

    // Single category (e.g. Spotify music stream) -> multi-tier concentric celestial layout
    if (categories.length <= 1) {
      displayNodes.forEach((item, itemIdx) => {
        const ring = Math.floor(itemIdx / 12);
        const ringRadius = 100 + ring * 72;
        const itemsInThisRing = Math.min(12 + ring * 6, displayNodes.length);
        const itemAngle = (itemIdx % itemsInThisRing) * ((2 * Math.PI) / itemsInThisRing) - Math.PI / 2;
        const x = centerX + Math.cos(itemAngle) * ringRadius;
        const y = centerY + Math.sin(itemAngle) * (ringRadius * 0.72);

        result.push({
          ...item,
          x: Math.round(Math.max(50, Math.min(1350, x))),
          y: Math.round(Math.max(50, Math.min(850, y))),
          connectionCount: connectionCounts[item.id] || item.connectionCount || 0,
          radius: Math.min(22, Math.max(12, 10 + (connectionCounts[item.id] || 0) * 2.2)),
          color: getNodeCategoryColor(item.category)
        });
      });
      return result;
    }

    // Multi-cluster radial layout for datasets with multiple categories
    const clusterRadius = 330;
    categories.forEach((cat, catIdx) => {
      const clusterAngle = (catIdx / categories.length) * 2 * Math.PI - Math.PI / 2;
      const groupCenterX = centerX + Math.cos(clusterAngle) * clusterRadius;
      const groupCenterY = centerY + Math.sin(clusterAngle) * (clusterRadius * 0.78);

      const items = catGroups[cat];
      items.forEach((item, itemIdx) => {
        const itemAngle = (itemIdx / Math.max(items.length, 1)) * 2 * Math.PI;
        const itemDist = 55 + Math.min(75, items.length * 9) * (0.6 + 0.4 * ((itemIdx % 3) / 2));
        const x = groupCenterX + Math.cos(itemAngle) * itemDist;
        const y = groupCenterY + Math.sin(itemAngle) * itemDist;

        result.push({
          ...item,
          x: Math.round(Math.max(50, Math.min(1350, x))),
          y: Math.round(Math.max(50, Math.min(850, y))),
          connectionCount: connectionCounts[item.id] || item.connectionCount || 0,
          radius: Math.min(22, Math.max(12, 10 + (connectionCounts[item.id] || 0) * 2.2)),
          color: getNodeCategoryColor(item.category)
        });
      });
    });

    return result;
  }, [displayNodes, connectionCounts]);

  // Position lookup map for graph rendering
  const nodePositionMap = useMemo(() => {
    const map = {};
    layoutNodes.forEach(n => {
      map[n.id] = n;
    });
    return map;
  }, [layoutNodes]);

  // Filter connections visible on the SVG canvas
  const visibleConnections = useMemo(() => {
    return connections.filter(conn => {
      if (!nodePositionMap[conn.source] || !nodePositionMap[conn.target]) return false;
      if (filterType !== 'all' && conn.type !== filterType) return false;
      return true;
    });
  }, [connections, nodePositionMap, filterType]);

  // All connections matching filter for list view
  const listConnections = useMemo(() => {
    return connections.filter(conn => {
      if (filterType !== 'all' && conn.type !== filterType) return false;
      return true;
    });
  }, [connections, filterType]);

  // Connection types for filter
  const connectionTypes = useMemo(() => {
    const types = new Set();
    connections.forEach(c => {
      if (c.type) types.add(c.type);
    });
    return Array.from(types);
  }, [connections]);

  // Active highlighted neighbor IDs
  const activeNeighborIds = useMemo(() => {
    const targetId = hoveredNodeId || selectedNodeId;
    if (!targetId) return null;
    const set = new Set([targetId]);
    visibleConnections.forEach(c => {
      if (c.source === targetId) set.add(c.target);
      if (c.target === targetId) set.add(c.source);
    });
    return set;
  }, [hoveredNodeId, selectedNodeId, visibleConnections]);

  // Currently selected node object (for HUD drawer)
  const activeSelectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodePositionMap[selectedNodeId] || allNodesMap[selectedNodeId] || null;
  }, [selectedNodeId, nodePositionMap, allNodesMap]);

  // Connections associated with currently selected node
  const activeNodeConnections = useMemo(() => {
    if (!selectedNodeId) return [];
    return connections.filter(c => c.source === selectedNodeId || c.target === selectedNodeId);
  }, [selectedNodeId, connections]);

  const handleNodeClick = (node) => {
    // Don't fire click if user was panning/dragging
    if (hasDragged.current) return;
    setSelectedNodeId(node.id === selectedNodeId ? null : node.id);
  };

  // Close evidence modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedConnection(null);
        setSelectedNodeId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ─── Pan/drag handlers ───────────────────────────────────────────
  const handleSvgMouseDown = (e) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    hasDragged.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY, panX, panY };
    e.currentTarget.style.cursor = 'grabbing';
  };

  const handleSvgMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged.current = true;
    const svgEl = e.currentTarget;
    const rect = svgEl.getBoundingClientRect();
    const scaleX = 1400 / (rect.width * zoomLevel);
    const scaleY = 900 / (rect.height * zoomLevel);
    setPanX(dragStart.current.panX + dx * scaleX);
    setPanY(dragStart.current.panY + dy * scaleY);
  };

  const handleSvgMouseUp = (e) => {
    isDragging.current = false;
    e.currentTarget.style.cursor = 'grab';
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanX(0);
    setPanY(0);
    setSelectedNodeId(null);
    setHoveredNodeId(null);
  };

  const handleConnectionClick = (conn) => {
    setSelectedConnection(conn);
    if (onOpenEvidence) {
      onOpenEvidence(conn);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16" role="region" aria-label="Interactive Relationship Graph">
      
      {/* Top Controls Header */}
      <div className="bg-archive-850 border border-archive-700/70 rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-lavender-accent/20 border border-lavender-accent/40 text-lavender-light">
                <Network className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-editorial font-medium text-paper">
                Interactive Relationship Graph
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-archive-400 font-mono mt-1">
              Visualizing verified temporal, behavioral, and cross-category connections across life receipts.
            </p>
          </div>

          {/* View Mode Toggle & Zoom Controls */}
          <div className="flex items-center space-x-2">
            <div className="bg-archive-900 p-1 rounded-xl border border-archive-700/60 flex items-center space-x-1 text-xs font-mono">
              <button
                type="button"
                onClick={() => setViewMode('graph')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'graph'
                    ? 'bg-archive-800 text-amber-accent font-semibold border border-amber-accent/30'
                    : 'text-archive-400 hover:text-white'
                }`}
              >
                SVG Canvas Map
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-archive-800 text-amber-accent font-semibold border border-amber-accent/30'
                    : 'text-archive-400 hover:text-white'
                }`}
              >
                Connected Stream List ({listConnections.length})
              </button>
            </div>

            {viewMode === 'graph' && (
              <div className="flex items-center space-x-1 bg-archive-900 p-1 rounded-xl border border-archive-700/60">
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                  className="p-1.5 text-archive-400 hover:text-white hover:bg-archive-800 rounded-lg transition-colors cursor-pointer"
                  title="Zoom In"
                  aria-label="Zoom in on connection graph"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.4))}
                  className="p-1.5 text-archive-400 hover:text-white hover:bg-archive-800 rounded-lg transition-colors cursor-pointer"
                  title="Zoom Out"
                  aria-label="Zoom out on connection graph"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={resetView}
                  className="p-1.5 text-archive-400 hover:text-white hover:bg-archive-800 rounded-lg transition-colors cursor-pointer"
                  title="Reset View"
                  aria-label="Reset zoom and center view"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter by Connection Type */}
        <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-archive-700/50 text-xs font-mono">
          <span className="text-archive-400 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Connection Filter:</span>
          </span>
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-amber-accent text-archive-950 font-semibold'
                : 'bg-archive-900 text-archive-300 hover:text-white border border-archive-700'
            }`}
          >
            All Connections ({connections.length})
          </button>
          {connectionTypes.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-amber-accent text-archive-950 font-semibold'
                  : 'bg-archive-900 text-archive-300 hover:text-white border border-archive-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visual Canvas or List Fallback */}
      {viewMode === 'graph' ? (
        <div className="relative bg-archive-950 border border-archive-700/70 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Instructions Overlay */}
          <div className="absolute top-4 left-4 z-10 bg-archive-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-archive-700/60 text-xs font-mono text-archive-300 shadow-md pointer-events-none hidden sm:block">
            <div className="flex items-center space-x-2 text-[11px] text-amber-accent font-semibold mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Navigation</span>
            </div>
            <p className="text-archive-400 text-[11px] leading-relaxed">
              • <strong className="text-paper">Drag</strong> to pan the canvas<br />
              • <strong className="text-paper">Scroll</strong> to zoom in/out<br />
              • <strong className="text-paper">Hover</strong> a node to illuminate neighbors<br />
              • <strong className="text-paper">Click</strong> a node to view HUD details<br />
              • <strong className="text-paper">Click</strong> a link line to inspect evidence
            </p>
          </div>

          {/* SVG Canvas */}
          <div className="w-full h-[640px] sm:h-[780px] overflow-hidden relative" style={{ cursor: 'grab' }}>
            <svg
              viewBox="0 0 1400 900"
              className="w-full h-full select-none"
              style={{ display: 'block', overflow: 'visible' }}
              onMouseDown={handleSvgMouseDown}
              onMouseMove={handleSvgMouseMove}
              onMouseUp={handleSvgMouseUp}
              onMouseLeave={handleSvgMouseUp}
              onDoubleClick={resetView}
              onWheel={(e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.12 : 0.12;
                setZoomLevel(prev => Math.max(0.3, Math.min(3, prev + delta)));
              }}
            >
              <defs>
                {/* Glow Filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                {/* Linear gradient for links */}
                <linearGradient id="link-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D9A15C" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#9B83D8" stopOpacity="0.6" />
                </linearGradient>
              </defs>

              {/* All pannable/zoomable content inside this group */}
              <g transform={`translate(${700 + panX}, ${450 + panY}) scale(${zoomLevel}) translate(-700, -450)`}>

                {/* Background Archival Grid — click to deselect */}
                <rect
                  x="-2000" y="-2000" width="6000" height="6000" fill="#141411"
                  onClick={() => { if (!hasDragged.current) { setSelectedNodeId(null); setHoveredNodeId(null); } }}
                  style={{ cursor: 'default' }}
                />

                <g opacity="0.12">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <line key={`gx-${i}`} x1={(i - 10) * 50} y1="-2000" x2={(i - 10) * 50} y2="4000" stroke="#7CB49C" strokeWidth="0.5" strokeDasharray="2 4" />
                  ))}
                  {Array.from({ length: 40 }).map((_, i) => (
                    <line key={`gy-${i}`} x1="-2000" y1={(i - 10) * 50} x2="4000" y2={(i - 10) * 50} stroke="#7CB49C" strokeWidth="0.5" strokeDasharray="2 4" />
                  ))}
                </g>
                {/* Central hub marker */}
                <circle cx="700" cy="450" r="4" fill="#D9A15C" fillOpacity="0.25" />
                <circle cx="700" cy="450" r="180" fill="none" stroke="#D9A15C" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="4 6" />

                {/* Connecting Links */}
                <g className="connections-layer">
                  {visibleConnections.map((conn) => {
                    const src = nodePositionMap[conn.source];
                    const tgt = nodePositionMap[conn.target];
                    if (!src || !tgt || isNaN(src.x) || isNaN(src.y) || isNaN(tgt.x) || isNaN(tgt.y)) return null;

                    const isHighlighted =
                      activeNeighborIds &&
                      activeNeighborIds.has(conn.source) &&
                      activeNeighborIds.has(conn.target);
                    const isDimmed = activeNeighborIds && !isHighlighted;

                    // Curved quadratic bezier curve
                    const midX = (src.x + tgt.x) / 2 + (src.y - tgt.y) * 0.15;
                    const midY = (src.y + tgt.y) / 2 + (tgt.x - src.x) * 0.15;
                    const pathData = `M ${src.x} ${src.y} Q ${midX} ${midY} ${tgt.x} ${tgt.y}`;

                    return (
                      <g key={conn.id} className="cursor-pointer" onClick={() => handleConnectionClick(conn)}>
                        {/* Invisible wider hit area for easy clicking */}
                        <path
                          d={pathData}
                          stroke="transparent"
                          strokeWidth="16"
                          fill="none"
                        />
                        {/* Visible stroke */}
                        <path
                          d={pathData}
                          stroke={isHighlighted ? '#D9A15C' : '#48473F'}
                          strokeWidth={isHighlighted ? 2.5 : 1.2}
                          strokeOpacity={isDimmed ? 0.15 : isHighlighted ? 0.95 : 0.45}
                          strokeDasharray={conn.type && conn.type.includes('Proximity') ? '4 3' : 'none'}
                          fill="none"
                          className="transition-all duration-200"
                          filter={isHighlighted ? 'url(#glow)' : undefined}
                        />
                      </g>
                    );
                  })}
                </g>

                {/* Nodes */}
                <g className="nodes-layer">
                  {layoutNodes.map((node) => {
                    const isHovered = hoveredNodeId === node.id;
                    const isSelected = selectedNodeId === node.id;
                    const isNeighbor = activeNeighborIds && activeNeighborIds.has(node.id);
                    const isDimmed = activeNeighborIds && !isNeighbor;

                    return (
                      <g
                        key={node.id}
                        transform={`translate(${node.x}, ${node.y})`}
                        className="cursor-pointer transition-transform duration-200"
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        onClick={() => handleNodeClick(node)}
                      >
                        {/* Outer pulse ring if selected or hovered */}
                        {(isHovered || isSelected) && (
                          <circle
                            r={node.radius + 7}
                            fill="none"
                            stroke={node.color}
                            strokeWidth="2"
                            strokeOpacity="0.7"
                            className="animate-ping"
                          />
                        )}

                        {/* Main Node Circle */}
                        <circle
                          r={node.radius}
                          fill={isDimmed ? '#23231F' : '#1D1D19'}
                          stroke={node.color}
                          strokeWidth={isHovered || isSelected ? 3 : 1.8}
                          strokeOpacity={isDimmed ? 0.2 : 1}
                          filter={isHovered || isSelected ? 'url(#glow)' : undefined}
                        />

                        {/* Center pip */}
                        <circle
                          r={Math.max(3, node.radius * 0.4)}
                          fill={node.color}
                          fillOpacity={isDimmed ? 0.2 : 0.9}
                        />

                        {/* Label on Hover / Selection / high connectivity */}
                        {(isHovered || isSelected || (node.connectionCount && node.connectionCount > 2)) && (
                          <text
                            y={node.radius + 14}
                            textAnchor="middle"
                            fill="#ECE8DD"
                            fontSize="10"
                            fontFamily="JetBrains Mono"
                            fontWeight="500"
                            opacity={isDimmed ? 0.2 : 1}
                            className="pointer-events-none drop-shadow"
                          >
                            {node.title?.length > 18 ? node.title.slice(0, 16) + '…' : node.title}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              </g>
            </svg>
          </div>

          {/* Interactive Selected Node HUD Drawer */}
          {activeSelectedNode && (
            <div className="absolute bottom-16 right-4 max-w-sm w-full bg-archive-900/95 backdrop-blur-md border border-amber-accent/50 rounded-xl p-4 shadow-2xl z-20 animate-slide-up text-left space-y-3">
              <div className="flex items-center justify-between border-b border-archive-700/60 pb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-accent font-semibold flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Selected Node Inspector</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedNodeId(null)}
                  className="text-archive-400 hover:text-white p-1 rounded hover:bg-archive-800 transition-colors"
                  aria-label="Close Inspector"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h4 className="font-editorial text-base text-paper font-semibold leading-tight">
                  {activeSelectedNode.title}
                </h4>
                <div className="flex items-center space-x-2 mt-1.5 text-xs font-mono">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-semibold border"
                    style={{
                      color: activeSelectedNode.color,
                      borderColor: `${activeSelectedNode.color}40`,
                      backgroundColor: `${activeSelectedNode.color}15`
                    }}
                  >
                    {activeSelectedNode.category || 'General'}
                  </span>
                  {activeSelectedNode.rawDate && (
                    <span className="text-archive-400">{activeSelectedNode.rawDate.slice(0, 10)}</span>
                  )}
                  {activeSelectedNode.amount !== undefined && activeSelectedNode.amount !== null && (
                    <span className="text-amber-light font-bold">₹{activeSelectedNode.amount.toLocaleString()}</span>
                  )}
                </div>
              </div>

              {/* Active Connections List */}
              <div className="text-xs font-mono text-archive-400">
                <span className="text-archive-300 font-medium">
                  {activeNodeConnections.length} Connected Relationship{activeNodeConnections.length === 1 ? '' : 's'}:
                </span>
                <div className="mt-1.5 space-y-1 max-h-24 overflow-y-auto pr-1">
                  {activeNodeConnections.slice(0, 4).map(c => {
                    const otherId = c.source === activeSelectedNode.id ? c.target : c.source;
                    const otherNode = allNodesMap[otherId] || { title: otherId };
                    return (
                      <div
                        key={c.id}
                        onClick={() => handleConnectionClick(c)}
                        className="p-1.5 rounded bg-archive-800 hover:bg-archive-750 border border-archive-700/60 cursor-pointer flex items-center justify-between text-[11px] group"
                      >
                        <span className="truncate max-w-[75%] text-paper group-hover:text-amber-accent">
                          › {otherNode.title}
                        </span>
                        <span className="text-amber-accent/80 text-[10px]">{c.confidence}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action to view full details modal */}
              {onSelectReceipt && (
                <button
                  type="button"
                  onClick={() => onSelectReceipt(activeSelectedNode)}
                  className="w-full py-1.5 px-3 rounded-lg bg-amber-accent/15 hover:bg-amber-accent/25 border border-amber-accent/40 text-amber-accent hover:text-amber-light text-xs font-mono font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Open Full Receipt Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Graph Legend Footer */}
          <div className="bg-archive-900 border-t border-archive-700/60 p-3.5 px-6 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-archive-400">
            <div className="flex items-center space-x-4">
              <span className="text-archive-300 font-semibold">Category Nodes:</span>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-accent" />
                <span>Food & Dining</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sage-accent" />
                <span>Transit & Mobility</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-lavender-accent" />
                <span>Audio & Subscriptions</span>
              </div>
            </div>

            <div className="text-archive-400">
              Showing <strong className="text-paper">{layoutNodes.length}</strong> nodes · <strong className="text-paper">{visibleConnections.length}</strong> links
            </div>
          </div>

        </div>
      ) : (
        /* Connected Stream List */
        <div className="bg-archive-850 border border-archive-700/70 rounded-2xl p-4 sm:p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-archive-700/50">
            <h3 className="font-editorial text-lg text-paper font-semibold">
              Discovered Connection Streams
            </h3>
            <span className="text-xs font-mono text-archive-400">
              {listConnections.length} Relationships Found
            </span>
          </div>

          <div className="space-y-3">
            {listConnections.slice(0, 30).map((conn) => {
              const src = allNodesMap[conn.source] || { title: conn.source };
              const tgt = allNodesMap[conn.target] || { title: conn.target };

              return (
                <div
                  key={conn.id}
                  onClick={() => handleConnectionClick(conn)}
                  className="p-4 rounded-xl bg-archive-900 hover:bg-archive-800 border border-archive-700/60 hover:border-amber-accent/50 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-amber-accent/20 text-amber-accent border border-amber-accent/30 font-semibold">
                      {conn.type}
                    </span>
                    <span className="text-archive-400">Confidence: {conn.confidence}%</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm font-semibold text-paper group-hover:text-amber-accent transition-colors">
                    <span className="truncate max-w-[42%]">{src.title}</span>
                    <ArrowRight className="w-4 h-4 text-archive-400 flex-shrink-0" />
                    <span className="truncate max-w-[42%]">{tgt.title}</span>
                  </div>

                  <p className="text-xs text-archive-400 leading-relaxed font-sans">
                    {conn.interpretation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Connection Evidence Card Modal */}
      {selectedConnection && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="evidence-inspector-title"
          className="fixed inset-0 z-50 bg-archive-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedConnection(null); }}
        >
          <div className="bg-archive-850 border border-amber-accent/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-slide-up relative text-left">
            
            <div className="flex items-center justify-between border-b border-archive-700/60 pb-3">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded bg-amber-accent/20 text-amber-accent">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span id="evidence-inspector-title" className="font-mono text-xs uppercase tracking-wider text-amber-accent font-bold">
                  Connection Evidence Inspector
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedConnection(null)}
                aria-label="Close Connection Evidence Inspector"
                className="text-archive-400 hover:text-white font-mono text-sm px-2 py-1 rounded bg-archive-900 border border-archive-700 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div>
              <span className="text-xs font-mono text-archive-400">Relationship Classification:</span>
              <h3 className="text-xl font-editorial font-bold text-paper mt-0.5">
                {selectedConnection.type}
              </h3>
            </div>

            {/* Evidence Facts List */}
            <div className="space-y-2 bg-archive-900 p-4 rounded-xl border border-archive-700/70">
              <span className="text-xs font-mono uppercase text-sage-accent font-semibold block">
                Observed Dataset Facts (Evidence):
              </span>
              <ul className="space-y-1.5 text-xs text-archive-300 font-mono">
                {selectedConnection.evidence?.map((ev, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-amber-accent font-bold">›</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cautious Interpretation */}
            <div className="space-y-1.5 bg-archive-900/60 p-4 rounded-xl border border-archive-700/60">
              <span className="text-xs font-mono uppercase text-lavender-accent font-semibold block">
                Cautious Analytical Interpretation:
              </span>
              <p className="text-xs text-archive-300 leading-relaxed font-sans italic">
                “{selectedConnection.interpretation}”
              </p>
            </div>

            {/* Interactive Inspector Links */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs font-mono text-archive-400 border-t border-archive-700/50">
              <span>Statistical Confidence: <strong className="text-amber-accent">{selectedConnection.confidence}%</strong></span>
              <div className="flex items-center space-x-2">
                {onSelectReceipt && allNodesMap[selectedConnection.source] && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectReceipt(allNodesMap[selectedConnection.source]);
                      setSelectedConnection(null);
                    }}
                    className="inline-flex items-center space-x-1 text-paper hover:text-amber-accent font-semibold transition-colors cursor-pointer"
                  >
                    <span>Inspect Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
                {onSelectReceipt && allNodesMap[selectedConnection.target] && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectReceipt(allNodesMap[selectedConnection.target]);
                      setSelectedConnection(null);
                    }}
                    className="inline-flex items-center space-x-1 text-paper hover:text-amber-accent font-semibold transition-colors cursor-pointer"
                  >
                    <span>Inspect Target</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
