import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  Layers,
  Maximize2,
  RotateCcw,
} from 'lucide-react';
import { ECOSYSTEM_NODES, EcosystemNode } from '../config/siteConfig';
import type { EcosystemScopeId } from './EcosystemCanvas3D';

const EcosystemCanvas3D = lazy(() =>
  import('./EcosystemCanvas3D').then((m) => ({ default: m.EcosystemCanvas3D })),
);

interface EcosystemSectionProps {
  externalFocusRequest?: { nodeId: string; nonce: number } | null;
}

export function EcosystemSection({ externalFocusRequest }: EcosystemSectionProps) {
  const [focusedScopeId, setFocusedScopeId] = useState<EcosystemScopeId>('poppy-pie');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('poppy-pie');
  const [useStructuredView, setUseStructuredView] = useState<boolean>(false);
  const [resetTrigger, setResetTrigger] = useState<number>(0);

  // Sync when user clicks "Explore in Ecosystem" from Ventures section
  useEffect(() => {
    if (!externalFocusRequest) return;
    handleNodeSelect(externalFocusRequest.nodeId);
  }, [externalFocusRequest]);

  // Respect prefers-reduced-motion as sensible default for 2D accessible view if desired,
  // while still letting user switch cleanly
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setUseStructuredView(true);
    }
  }, []);

  const selectedNode: EcosystemNode =
    ECOSYSTEM_NODES[selectedNodeId] ?? ECOSYSTEM_NODES['poppy-pie'];

  const handleNodeSelect = (nodeId: string) => {
    const target = ECOSYSTEM_NODES[nodeId];
    if (!target) return;

    setSelectedNodeId(nodeId);

    if (nodeId === 'poppy-pie') {
      setFocusedScopeId('poppy-pie');
    } else if (nodeId === 'business-orbit' || nodeId === 'atior' || nodeId === 'from-scratch') {
      setFocusedScopeId(nodeId);
    } else if (
      target.parentId === 'business-orbit' ||
      target.parentId === 'atior' ||
      target.parentId === 'from-scratch'
    ) {
      setFocusedScopeId(target.parentId);
    }
  };

  const handleBackToParent = () => {
    if (selectedNode.parentId) {
      handleNodeSelect(selectedNode.parentId);
    } else {
      handleNodeSelect('poppy-pie');
    }
  };

  const handleResetOverview = () => {
    setFocusedScopeId('poppy-pie');
    setSelectedNodeId('poppy-pie');
    setResetTrigger((c) => c + 1);
  };

  // Build Breadcrumb path
  const breadcrumbs = useMemo(() => {
    const chain: EcosystemNode[] = [];
    let cursor: EcosystemNode | undefined = selectedNode;
    while (cursor) {
      chain.unshift(cursor);
      cursor = cursor.parentId ? ECOSYSTEM_NODES[cursor.parentId] : undefined;
    }
    return chain;
  }, [selectedNode]);

  // Active child nodes for the currently focused scope
  const activeScopeNode = ECOSYSTEM_NODES[focusedScopeId];
  const scopeChildren = activeScopeNode.childrenIds
    .map((id) => ECOSYSTEM_NODES[id])
    .filter(Boolean);

  return (
    <section
      id="ecosystem"
      aria-labelledby="ecosystem-heading"
      className="relative bg-[#F8F9F4] border-y border-[#252B27]/10 py-14 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-medium tracking-[0.08em] uppercase text-[#536B50] mb-3">
              Interactive Organizational Network
            </p>
            <h2
              id="ecosystem-heading"
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.12] text-[#252B27] text-balance"
            >
              The Poppy Pie Ecosystem Map
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label="Ecosystem view mode"
              className="inline-flex items-center p-1 bg-[#E5E8CE]/75 border border-[#252B27]/12 rounded-md"
            >
              <button
                type="button"
                onClick={() => setUseStructuredView(false)}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
                  !useStructuredView
                    ? 'bg-[#252B27] text-[#F8F9F4]'
                    : 'text-[#252B27]/75 hover:text-[#252B27]'
                }`}
              >
                3D Spatial Map
              </button>
              <button
                type="button"
                onClick={() => setUseStructuredView(true)}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
                  useStructuredView
                    ? 'bg-[#252B27] text-[#F8F9F4]'
                    : 'text-[#252B27]/75 hover:text-[#252B27]'
                }`}
              >
                2D Structured Map
              </button>
            </div>
          </div>
        </div>

        {/* Full-Height Interactive Viewport Container */}
        <div className="relative rounded-xl border border-[#252B27]/15 bg-[#E5E8CE]/55 overflow-hidden">
          {/* Top Breadcrumb & Hierarchy Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-[#F8F9F4] border-b border-[#252B27]/10">
            <nav aria-label="Ecosystem breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <div key={crumb.id} className="flex items-center gap-1.5">
                    {idx > 0 && (
                      <ChevronRight className="w-3.5 h-3.5 text-[#252B27]/40 shrink-0" aria-hidden="true" />
                    )}
                    <button
                      type="button"
                      onClick={() => handleNodeSelect(crumb.id)}
                      className={`px-2 py-1 rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
                        isLast
                          ? 'font-semibold text-[#252B27] bg-[#E5E8CE]'
                          : 'text-[#252B27]/70 hover:text-[#252B27] hover:bg-[#E5E8CE]/50'
                      }`}
                    >
                      {crumb.label}
                    </button>
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              {selectedNode.parentId && (
                <button
                  type="button"
                  onClick={handleBackToParent}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#252B27] bg-[#E5E8CE]/70 hover:bg-[#E5E8CE] border border-[#252B27]/12 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                >
                  <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Back to Parent</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleResetOverview}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#252B27]/80 hover:text-[#252B27] bg-[#F8F9F4] hover:bg-[#E5E8CE]/50 border border-[#252B27]/12 rounded-md transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Level 0</span>
              </button>
            </div>
          </div>

          {/* Main Interactive Split: Spatial Canvas + Node Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px] lg:h-[650px]">
            {/* Left / Main 3D or 2D Network Canvas */}
            <div className="relative lg:col-span-8 h-[390px] sm:h-[460px] lg:h-full bg-[radial-gradient(circle_at_50%_45%,rgba(248,249,244,0.85),rgba(229,232,206,0.92))]">
              {!useStructuredView ? (
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center text-sm text-[#252B27]/70">
                      Loading 3D Ecosystem Network...
                    </div>
                  }
                >
                  <EcosystemCanvas3D
                    focusedScopeId={focusedScopeId}
                    selectedNodeId={selectedNodeId}
                    onSelectNode={handleNodeSelect}
                    onWebGLFallback={() => setUseStructuredView(true)}
                    resetTrigger={resetTrigger}
                  />
                </Suspense>
              ) : (
                /* 2D Interactive Spatial Network Fallback & Accessible View */
                <div className="w-full h-full p-5 sm:p-8 flex flex-col justify-between overflow-y-auto">
                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#252B27]/10">
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-[#536B50]">
                        {activeScopeNode.kindLabel}
                      </span>
                      <h3 className="font-display text-xl font-bold text-[#252B27]">
                        {activeScopeNode.label}
                      </h3>
                    </div>
                    {activeScopeNode.parentId && (
                      <button
                        type="button"
                        onClick={() => handleNodeSelect(activeScopeNode.parentId!)}
                        className="px-3 py-1.5 text-xs font-medium bg-[#F8F9F4] border border-[#252B27]/15 rounded-md hover:border-[#789575] cursor-pointer"
                      >
                        Up to {ECOSYSTEM_NODES[activeScopeNode.parentId].label}
                      </button>
                    )}
                  </div>

                  {/* Visual Hub-and-Spoke Layout */}
                  <div className="my-auto py-6 flex flex-col items-center gap-6">
                    <button
                      type="button"
                      onClick={() => handleNodeSelect(activeScopeNode.id)}
                      className={`px-6 py-4 rounded-lg border text-center transition-all cursor-pointer ${
                        selectedNodeId === activeScopeNode.id
                          ? 'bg-[#252B27] text-[#F8F9F4] border-[#252B27] shadow-sm'
                          : 'bg-[#F8F9F4] text-[#252B27] border-[#252B27]/20 hover:border-[#789575]'
                      }`}
                    >
                      <div className="text-[11px] uppercase tracking-wider opacity-75 mb-1">
                        {activeScopeNode.kind === 'parent' ? 'Parent Organization' : 'Focused Venture'}
                      </div>
                      <div className="font-display text-lg font-bold">{activeScopeNode.label}</div>
                    </button>

                    <div className="w-px h-6 bg-[#536B50]/40" aria-hidden="true" />

                    <div
                      className={`grid gap-3 w-full max-w-2xl ${
                        scopeChildren.length === 2
                          ? 'grid-cols-1 sm:grid-cols-2'
                          : scopeChildren.length === 3
                            ? 'grid-cols-1 sm:grid-cols-3'
                            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                      }`}
                    >
                      {scopeChildren.map((child) => {
                        const isSelected = selectedNodeId === child.id;
                        return (
                          <button
                            key={child.id}
                            type="button"
                            onClick={() => handleNodeSelect(child.id)}
                            className={`p-4 rounded-lg border text-left transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#252B27] text-[#F8F9F4] border-[#252B27]'
                                : 'bg-[#F8F9F4] text-[#252B27] border-[#252B27]/15 hover:border-[#789575]'
                            }`}
                          >
                            <div className="text-[11px] opacity-70 mb-1">
                              {child.kind === 'pillar'
                                ? 'Content Pillar'
                                : child.kind === 'venture'
                                  ? 'Primary Venture'
                                  : child.kind === 'division'
                                    ? 'Business Division'
                                    : 'Connected Platform'}
                            </div>
                            <div className="font-display text-sm font-semibold mb-1">{child.label}</div>
                            <div className="text-xs opacity-75 line-clamp-2">{child.headline}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <p className="text-xs text-[#252B27]/60 text-center">
                    Click any venture or node to inspect details and navigate the hierarchy.
                  </p>
                </div>
              )}

              {/* Bottom Quick-Switch Venture Dock inside canvas (solid surface, zero backdrop-blur) */}
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                <div className="pointer-events-auto inline-flex flex-wrap items-center gap-1.5 bg-[#F8F9F4] border border-[#252B27]/15 rounded-md p-1.5 shadow-sm">
                  {(['poppy-pie', 'business-orbit', 'atior', 'from-scratch'] as EcosystemScopeId[]).map(
                    (id) => {
                      const n = ECOSYSTEM_NODES[id];
                      const active = focusedScopeId === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handleNodeSelect(id)}
                          className={`px-2.5 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
                            active
                              ? 'bg-[#252B27] text-[#F8F9F4]'
                              : 'text-[#252B27]/80 hover:bg-[#E5E8CE]/70 hover:text-[#252B27]'
                          }`}
                        >
                          {n.shortLabel}
                        </button>
                      );
                    },
                  )}
                </div>

                {!useStructuredView && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-[#252B27]/75 bg-[#F8F9F4] border border-[#252B27]/12 rounded-md">
                    <Maximize2 className="w-3 h-3 text-[#789575]" aria-hidden="true" />
                    Drag to orbit · Scroll to zoom · Click nodes
                  </span>
                )}
              </div>
            </div>

            {/* Right Inspector Panel (Opaque Soft White Surface, No Backdrop Filter) */}
            <aside
              aria-label="Selected ecosystem node details"
              className="lg:col-span-4 bg-[#F8F9F4] border-t lg:border-t-0 lg:border-l border-[#252B27]/12 p-6 sm:p-7 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-[#536B50] font-medium mb-3">
                  <span>{selectedNode.kindLabel}</span>
                </div>

                <h3 className="font-display text-2xl font-bold text-[#252B27] tracking-tight mb-2">
                  {selectedNode.label}
                </h3>

                <p className="text-sm font-medium text-[#536B50] mb-4">{selectedNode.headline}</p>

                <p className="text-sm leading-relaxed text-[#252B27]/80 mb-6">
                  {selectedNode.description}
                </p>

                {selectedNode.highlights && selectedNode.highlights.length > 0 && (
                  <div className="mb-6 pt-5 border-t border-[#252B27]/10">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#252B27]/60 mb-3">
                      {selectedNode.kind === 'pillar'
                        ? 'Focus Area'
                        : selectedNode.kind === 'division'
                          ? 'Core Capabilities'
                          : 'Connected Components'}
                    </h4>
                    <ul className="space-y-2">
                      {selectedNode.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-sm text-[#252B27]/85"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-[#789575] mt-2 shrink-0"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Child Nodes Navigation List */}
                {selectedNode.childrenIds.length > 0 && (
                  <div className="mb-6 pt-5 border-t border-[#252B27]/10">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#252B27]/60 mb-3">
                      {selectedNode.id === 'from-scratch'
                        ? 'Content Pillars (Click to Inspect)'
                        : selectedNode.id === 'atior'
                          ? 'Business Divisions (Click to Explore)'
                          : selectedNode.id === 'business-orbit'
                            ? 'Connected Platforms (Click to Explore)'
                            : 'Primary Ventures (Click to Enter)'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedNode.childrenIds.map((cid) => {
                        const child = ECOSYSTEM_NODES[cid];
                        if (!child) return null;
                        return (
                          <button
                            key={cid}
                            type="button"
                            onClick={() => handleNodeSelect(cid)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#252B27] bg-[#E5E8CE]/65 hover:bg-[#E5E8CE] border border-[#252B27]/12 rounded-md transition-colors cursor-pointer"
                          >
                            <Layers className="w-3.5 h-3.5 text-[#536B50]" aria-hidden="true" />
                            <span>{child.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedNode.internalPanelNote && (
                  <div className="p-3.5 rounded-md bg-[#E5E8CE]/55 border border-[#252B27]/10 text-xs leading-relaxed text-[#252B27]/75 mb-6">
                    {selectedNode.internalPanelNote}
                  </div>
                )}
              </div>

              {/* Action Footer in Inspector */}
              <div className="pt-5 border-t border-[#252B27]/10 flex flex-wrap items-center gap-3">
                {selectedNode.websiteUrl && (
                  <a
                    href={selectedNode.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-[#F8F9F4] bg-[#252B27] hover:bg-[#536B50] transition-colors rounded-md whitespace-nowrap"
                  >
                    <span>{selectedNode.websiteLabel || 'Explore Website'}</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                )}

                {selectedNode.parentId && (
                  <button
                    type="button"
                    onClick={handleBackToParent}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium text-[#252B27] bg-[#E5E8CE]/75 hover:bg-[#E5E8CE] border border-[#252B27]/15 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    <span>Parent</span>
                  </button>
                )}
              </div>
            </aside>
          </div>
        </div>

        {/* Mobile Touch-Friendly Node Directory Strip */}
        <div className="mt-5 lg:hidden">
          <p className="text-xs font-medium text-[#252B27]/65 mb-2.5">
            Quick Tap Nodes in {activeScopeNode.label}:
          </p>
          <div className="flex flex-wrap gap-2">
            {scopeChildren.map((child) => (
              <button
                key={child.id}
                type="button"
                onClick={() => handleNodeSelect(child.id)}
                className={`px-3.5 py-2.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                  selectedNodeId === child.id
                    ? 'bg-[#252B27] text-[#F8F9F4] border-[#252B27]'
                    : 'bg-[#F8F9F4] text-[#252B27] border-[#252B27]/15'
                }`}
              >
                {child.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
