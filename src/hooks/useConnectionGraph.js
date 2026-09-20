import { useState, useMemo, useRef, useEffect } from 'react';
import { getNodeCategoryColor } from '../engine/relationshipEngine';

/**
 * Custom React hook for calculating force-directed multi-cluster or celestial
 * radial graph layouts, visible bezier links, pan/zoom transformations, and active neighbor highlights.
 * 
 * @param {Object} relationshipData - { nodes, connections }
 * @returns {Object} Graph layout nodes, visible connections, transforms, and interaction handlers
 */
export function useConnectionGraph(relationshipData) {
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
  const hasDragged = useRef(false);

  const { nodes = [], connections = [] } = relationshipData || {};

  // Global node lookup map
  const allNodesMap = useMemo(() => {
    const map = {};
    nodes.forEach(n => {
      map[n.id] = n;
    });
    return map;
  }, [nodes]);

  // Node connection counts
  const connectionCounts = useMemo(() => {
    const counts = {};
    connections.forEach(c => {
      counts[c.source] = (counts[c.source] || 0) + 1;
      counts[c.target] = (counts[c.target] || 0) + 1;
    });
    return counts;
  }, [connections]);

  // Synchronized candidate nodes prioritizing connected records
  const displayNodes = useMemo(() => {
    if (!nodes || nodes.length === 0) return [];

    const activeNodeIds = new Set();
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

    return [...primaryNodes, ...secondaryNodes].slice(0, 75);
  }, [nodes, connections]);

  // Radial cluster or celestial galaxy node placement
  const layoutNodes = useMemo(() => {
    if (!displayNodes || displayNodes.length === 0) return [];

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

    // Single category (e.g. Spotify) -> Celestial multi-ring galaxy
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
          connectionCount: connectionCounts[item.id] || 0,
          radius: Math.min(22, Math.max(12, 10 + (connectionCounts[item.id] || 0) * 2.2)),
          color: getNodeCategoryColor(item.category)
        });
      });
      return result;
    }

    // Multi-cluster radial layout
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
          connectionCount: connectionCounts[item.id] || 0,
          radius: Math.min(22, Math.max(12, 10 + (connectionCounts[item.id] || 0) * 2.2)),
          color: getNodeCategoryColor(item.category)
        });
      });
    });

    return result;
  }, [displayNodes, connectionCounts]);

  const nodePositionMap = useMemo(() => {
    const map = {};
    layoutNodes.forEach(n => {
      map[n.id] = n;
    });
    return map;
  }, [layoutNodes]);

  const visibleConnections = useMemo(() => {
    return connections.filter(conn => {
      if (!nodePositionMap[conn.source] || !nodePositionMap[conn.target]) return false;
      if (filterType !== 'all' && conn.type !== filterType) return false;
      return true;
    });
  }, [connections, nodePositionMap, filterType]);

  const listConnections = useMemo(() => {
    return connections.filter(conn => {
      if (filterType !== 'all' && conn.type !== filterType) return false;
      return true;
    });
  }, [connections, filterType]);

  const connectionTypes = useMemo(() => {
    const types = new Set();
    connections.forEach(c => {
      if (c.type) types.add(c.type);
    });
    return Array.from(types);
  }, [connections]);

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

  const activeSelectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodePositionMap[selectedNodeId] || allNodesMap[selectedNodeId] || null;
  }, [selectedNodeId, nodePositionMap, allNodesMap]);

  const activeNodeConnections = useMemo(() => {
    if (!selectedNodeId) return [];
    return connections.filter(c => c.source === selectedNodeId || c.target === selectedNodeId);
  }, [selectedNodeId, connections]);

  const resetView = () => {
    setZoomLevel(1);
    setPanX(0);
    setPanY(0);
    setSelectedNodeId(null);
    setHoveredNodeId(null);
  };

  // Keyboard Escape listener
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

  return {
    selectedNodeId,
    setSelectedNodeId,
    hoveredNodeId,
    setHoveredNodeId,
    selectedConnection,
    setSelectedConnection,
    zoomLevel,
    setZoomLevel,
    viewMode,
    setViewMode,
    filterType,
    setFilterType,
    panX,
    setPanX,
    panY,
    setPanY,
    isDragging,
    dragStart,
    hasDragged,
    layoutNodes,
    nodePositionMap,
    visibleConnections,
    listConnections,
    connectionTypes,
    activeNeighborIds,
    activeSelectedNode,
    activeNodeConnections,
    allNodesMap,
    resetView
  };
}
