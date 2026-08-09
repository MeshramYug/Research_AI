import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Network, ZoomIn, ZoomOut, RotateCcw, X, ExternalLink, Play, Pause, Compass } from 'lucide-react';
import { Paper, KnowledgeNode, KnowledgeEdge } from '../../types/research';

interface KnowledgeGraphCanvasProps {
  papers: Paper[];
  onSelectPaper: (paper: Paper) => void;
}

interface Node3D extends KnowledgeNode {
  z: number;
  mesh?: THREE.Mesh;
}

export const KnowledgeGraphCanvas: React.FC<KnowledgeGraphCanvasProps> = ({
  papers,
  onSelectPaper,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [nodes, setNodes] = useState<Node3D[]>([]);
  const [edges, setEdges] = useState<KnowledgeEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node3D | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(350);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const graphGroupRef = useRef<THREE.Group | null>(null);
  const nodeMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());

  // Mouse interaction state
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 1. Build 3D Nodes & Edges dataset
  useEffect(() => {
    const generatedNodes: Node3D[] = [];
    const generatedEdges: KnowledgeEdge[] = [];
    const radius = 140;

    // A. Paper Nodes (Distributed on Fibonacci 3D Sphere)
    papers.forEach((paper, idx) => {
      const phi = Math.acos(-1 + (2 * idx + 1) / papers.length);
      const theta = Math.sqrt(papers.length * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      generatedNodes.push({
        id: paper.id,
        label: paper.title,
        type: 'paper',
        paperId: paper.id,
        x,
        y,
        z,
        color: paper.recommendationScore >= 95 ? '#4f46e5' : '#6366f1',
        radius: Math.max(7, Math.min(13, 6 + Math.log(paper.citationsCount + 10))),
        citationsCount: paper.citationsCount,
        details: {
          publicationYear: paper.publishedDate.split('-')[0],
          coAuthors: paper.authors
        }
      });
    });

    // B. Author Nodes (Inner orbital ring)
    const authorsMap = new Map<string, string[]>();
    papers.forEach(p => {
      p.authors.slice(0, 2).forEach(author => {
        if (!authorsMap.has(author)) authorsMap.set(author, []);
        authorsMap.get(author)!.push(p.id);
      });
    });

    const authorsList = Array.from(authorsMap.entries()).slice(0, 6);
    authorsList.forEach(([author, pIds], idx) => {
      const authorId = `author-${idx}`;
      const angle = (idx / authorsList.length) * Math.PI * 2;
      const innerRadius = 70;
      const x = innerRadius * Math.cos(angle);
      const y = (idx % 2 === 0 ? 30 : -30);
      const z = innerRadius * Math.sin(angle);

      generatedNodes.push({
        id: authorId,
        label: author,
        type: 'author',
        x,
        y,
        z,
        color: '#059669',
        radius: 8,
        details: {
          affiliation: 'Lead Author / Scholar',
          relatedPapersCount: pIds.length
        }
      });

      pIds.forEach(pId => {
        generatedEdges.push({
          id: `edge-${authorId}-${pId}`,
          source: authorId,
          target: pId,
          weight: 2
        });
      });
    });

    // C. Method Nodes (Outer orbital ring)
    const methodsList = ['GRPO Reinforcement Learning', 'FlashAttention Kernel Tiling', 'Pairformer 3D Diffusion', 'Selective State Space Mamba'];
    methodsList.forEach((method, idx) => {
      const methodId = `method-${idx}`;
      const angle = (idx / methodsList.length) * Math.PI * 2 + 0.8;
      const outerRadius = 180;
      const x = outerRadius * Math.cos(angle);
      const y = (idx % 2 === 0 ? -60 : 60);
      const z = outerRadius * Math.sin(angle);

      generatedNodes.push({
        id: methodId,
        label: method,
        type: 'method',
        x,
        y,
        z,
        color: '#7c3aed',
        radius: 9
      });

      if (papers[idx]) {
        generatedEdges.push({
          id: `edge-${methodId}-${papers[idx].id}`,
          source: methodId,
          target: papers[idx].id,
          weight: 3
        });
      }
    });

    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, [papers]);

  // 2. Initialize Three.js 3D Viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container || nodes.length === 0) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 560;

    // A. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#fafaf8');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(0, 0, zoomLevel);
    cameraRef.current = camera;

    // B. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight1.position.set(200, 300, 200);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x4f46e5, 0.8);
    dirLight2.position.set(-200, -200, -200);
    scene.add(dirLight2);

    // C. Graph Group
    const graphGroup = new THREE.Group();
    graphGroupRef.current = graphGroup;
    scene.add(graphGroup);

    // D. Build 3D Spheres for Nodes
    const meshesMap = new Map<string, THREE.Mesh>();
    nodeMeshesRef.current = meshesMap;

    nodes.forEach(node => {
      const geometry = new THREE.SphereGeometry(node.radius, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: node.color || '#4f46e5',
        shininess: 80,
        specular: 0x444444
      });

      const sphereMesh = new THREE.Mesh(geometry, material);
      sphereMesh.position.set(node.x, node.y, node.z);
      sphereMesh.userData = { id: node.id, node };

      graphGroup.add(sphereMesh);
      meshesMap.set(node.id, sphereMesh);
    });

    // E. Build 3D Connecting Lines for Edges
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      if (!sourceNode || !targetNode) return;

      const points = [
        new THREE.Vector3(sourceNode.x, sourceNode.y, sourceNode.z),
        new THREE.Vector3(targetNode.x, targetNode.y, targetNode.z)
      ];

      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xc7d2fe,
        transparent: true,
        opacity: 0.5,
        linewidth: 1.5
      });

      const line = new THREE.Line(lineGeometry, lineMaterial);
      graphGroup.add(line);
    });

    // F. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // G. 3D Animation Loop
    let animationFrameId: number;

    const animate = () => {
      if (graphGroupRef.current && autoRotate && !isDraggingRef.current) {
        graphGroupRef.current.rotation.y += 0.003;
        graphGroupRef.current.rotation.x += 0.001;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // H. Handle Resize
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 560;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [nodes, edges, autoRotate, zoomLevel]);

  // Update Camera Zoom
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = zoomLevel;
    }
  }, [zoomLevel]);

  // Handle Mouse Drag (Rotate 3D Scene)
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !graphGroupRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    graphGroupRef.current.rotation.y += deltaX * 0.006;
    graphGroupRef.current.rotation.x += deltaY * 0.006;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // 3D Raycasting (Click to select node in 3D Space)
  const handleClick = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container || !cameraRef.current || !graphGroupRef.current) return;

    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / container.clientWidth) * 2 - 1,
      -((e.clientY - rect.top) / (container.clientHeight || 560)) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const meshes = Array.from(nodeMeshesRef.current.values());
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object as THREE.Mesh;
      const clickedNodeData = clickedMesh.userData.node as Node3D;
      setSelectedNode(clickedNodeData);
    }
  };

  const selectedPaperObj = selectedNode?.paperId ? papers.find(p => p.id === selectedNode.paperId) : null;

  return (
    <section className="space-y-4 animate-in">
      {/* 3D Toolbar */}
      <div className="surface flex items-center justify-between p-4">
        <div className="flex items-center gap-2.5">
          <Network size={18} className="text-indigo-600" />
          <h3 className="font-serif text-lg font-semibold text-stone-900">3D Knowledge Graph</h3>
          <span className="text-[11px] text-stone-400 font-mono">
            {nodes.length} 3D Nodes · {edges.length} Connections
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition ${
              autoRotate
                ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                : 'border-[#e7e5e0] bg-white text-stone-500 hover:text-stone-800'
            }`}
            title="Toggle 3D Auto Rotation"
          >
            {autoRotate ? <Pause size={13} /> : <Play size={13} />}
            <span>Orbit</span>
          </button>

          <div className="flex items-center gap-1 rounded-lg border border-[#e7e5e0] bg-stone-50 p-1">
            <button
              onClick={() => setZoomLevel(prev => Math.max(150, prev - 40))}
              className="rounded-md p-1.5 text-stone-500 transition hover:bg-stone-200"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.min(600, prev + 40))}
              className="rounded-md p-1.5 text-stone-500 transition hover:bg-stone-200"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => {
                if (graphGroupRef.current) {
                  graphGroupRef.current.rotation.set(0, 0, 0);
                }
                setZoomLevel(350);
              }}
              className="rounded-md p-1.5 text-stone-500 transition hover:bg-stone-200"
              title="Reset 3D Camera"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Canvas Viewport + Side Inspector */}
      <div className="flex overflow-hidden rounded-xl border border-[#e7e5e0] bg-[#fafaf8]" style={{ height: 560 }}>
        {/* 3D WebGL Viewport */}
        <div className="relative flex-1 cursor-grab active:cursor-grabbing overflow-hidden">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleClick}
            className="w-full h-full"
          />

          {/* 3D Drag Hint Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg border border-[#e7e5e0] bg-white/90 px-3 py-1.5 text-[11px] text-stone-500 backdrop-blur-xs shadow-xs pointer-events-none">
            <Compass size={13} className="text-indigo-600" />
            <span>Drag to rotate in 3D · Scroll to zoom · Click node to inspect</span>
          </div>

          {/* 3D Legend */}
          <div className="absolute bottom-3 left-3 space-y-1.5 rounded-lg border border-[#e7e5e0] bg-white/90 p-3 text-[11px] backdrop-blur-xs shadow-xs">
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-indigo-600" /><span className="text-stone-700 font-medium">Paper Node</span></div>
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /><span className="text-stone-700 font-medium">Author Node</span></div>
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-violet-600" /><span className="text-stone-700 font-medium">Method Node</span></div>
          </div>
        </div>

        {/* Node Inspector Panel */}
        {selectedNode ? (
          <div className="w-72 border-l border-[#e7e5e0] bg-white p-5 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase text-indigo-600">
                3D {selectedNode.type} Node
              </span>
              <button onClick={() => setSelectedNode(null)} className="text-stone-400 hover:text-stone-800">
                <X size={15} />
              </button>
            </div>

            <h4 className="font-serif text-[16px] font-semibold text-stone-900 leading-snug">
              {selectedNode.label}
            </h4>

            {selectedNode.citationsCount && (
              <p className="text-[11px] font-mono text-stone-400">
                {selectedNode.citationsCount.toLocaleString()} Citations
              </p>
            )}

            {selectedPaperObj && (
              <>
                <p className="text-[12px] text-stone-600 leading-relaxed line-clamp-4">
                  {selectedPaperObj.abstract}
                </p>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-semibold uppercase text-stone-400 block">Authors</span>
                  <p className="text-[11px] text-stone-600">
                    {selectedPaperObj.authors.join(', ')}
                  </p>
                </div>

                <button
                  onClick={() => onSelectPaper(selectedPaperObj)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-2 text-[12px] font-semibold text-white transition hover:bg-indigo-700 shadow-sm mt-2"
                >
                  Analyze Paper <ExternalLink size={13} />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="hidden w-64 items-center justify-center border-l border-[#e7e5e0] bg-white p-6 text-center md:flex">
            <div className="space-y-2 text-stone-400">
              <Network size={28} className="mx-auto text-stone-300" />
              <p className="text-[12px] font-medium">Click any node in 3D space to inspect citations and related papers.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
