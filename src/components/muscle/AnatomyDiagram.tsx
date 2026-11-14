import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { MuscleView } from '../../types';

interface AnatomyDiagramProps {
  currentView: MuscleView;
}

export const AnatomyDiagram: React.FC<AnatomyDiagramProps> = ({ currentView }) => {
  const { muscleGroups, selectedMuscleId, setSelectedMuscleId } = useGame();
  const [hoveredMuscleId, setHoveredMuscleId] = useState<string | null>(null);

  const muscleMap = new Map(muscleGroups.map((m) => [m.id, m]));

  const getMuscleProps = (id: string) => {
    const muscle = muscleMap.get(id);
    const effort = muscle?.effort || 'rested';
    const isSelected = selectedMuscleId === id;
    const isHovered = hoveredMuscleId === id;

    if (isSelected) {
      return {
        fill: '#00ff87',
        fillOpacity: 0.9,
        stroke: '#ffffff',
        strokeWidth: 2.5,
        filter: 'drop-shadow(0 0 16px rgba(0,255,135,1))',
        className: 'cursor-pointer transition-all duration-200',
      };
    }

    if (effort === 'high') {
      return {
        fill: '#00ff87',
        fillOpacity: isHovered ? 0.9 : 0.75,
        stroke: '#00ff87',
        strokeWidth: isHovered ? 2 : 1.5,
        filter: 'drop-shadow(0 0 12px rgba(0,255,135,0.85))',
        className: 'cursor-pointer transition-all duration-200 animate-pulse',
      };
    }

    if (effort === 'moderate') {
      return {
        fill: '#39b8fd',
        fillOpacity: isHovered ? 0.85 : 0.7,
        stroke: '#39b8fd',
        strokeWidth: isHovered ? 2 : 1.5,
        filter: 'drop-shadow(0 0 10px rgba(57,184,253,0.8))',
        className: 'cursor-pointer transition-all duration-200',
      };
    }

    // Rested: shows underlying athletic body, brightens on hover
    return {
      fill: isHovered ? '#ffffff' : '#222736',
      fillOpacity: isHovered ? 0.35 : 0.15,
      stroke: isHovered ? 'rgba(255,255,255,0.8)' : 'transparent',
      strokeWidth: 1.5,
      filter: isHovered ? 'drop-shadow(0 0 8px rgba(255,255,255,0.6))' : 'none',
      className: 'cursor-pointer transition-all duration-200',
    };
  };

  const getPinCoordinate = (muscleId: string) => {
    const coords: Record<string, { x: number; y: number }> = {
      chest: { x: 200, y: 190 },
      delts: { x: 108, y: 180 },
      biceps: { x: 105, y: 235 },
      forearms: { x: 92, y: 290 },
      core: { x: 200, y: 255 },
      quads: { x: 165, y: 395 },
      'calves-front': { x: 160, y: 545 },
      traps: { x: 200, y: 150 },
      triceps: { x: 295, y: 230 },
      lats: { x: 140, y: 240 },
      lowerback: { x: 200, y: 305 },
      glutes: { x: 200, y: 375 },
      hamstrings: { x: 165, y: 460 },
      calves: { x: 160, y: 555 },
    };
    return coords[muscleId] || { x: 200, y: 360 };
  };

  const visibleMuscles = muscleGroups.filter((m) => m.view === currentView);
  const activeOrSelectedMuscles = visibleMuscles.filter(
    (m) => m.effort !== 'rested' || m.id === selectedMuscleId
  );

  return (
    <div className="relative w-full h-[450px] my-2 rounded-3xl overflow-hidden bg-[#0d1017] border border-outline-variant/30 flex items-center justify-center shadow-2xl select-none">
      {/* 1. Tactical Grid & Radar Concentric Circles */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d25_1px,transparent_1px),linear-gradient(to_bottom,#1f293d25_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,255,135,0.08)_0%,transparent_75%)] pointer-events-none"></div>

      {/* 2. Tactical Corner HUD Brackets */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-primary-container/40 pointer-events-none"></div>
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-primary-container/40 pointer-events-none"></div>
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-primary-container/40 pointer-events-none"></div>
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-primary-container/40 pointer-events-none"></div>

      {/* 3. Anatomical Frame Container */}
      <div className="relative h-full aspect-[400/720] flex items-center justify-center">
        {/* Layer 1: Sketch Solid Silhouette Base */}
        <img
          src={
            currentView === 'front'
              ? '/assets/diagram_front_clean.png'
              : '/assets/diagram_back_clean.png'
          }
          alt={currentView === 'front' ? 'Anterior Silhouette' : 'Posterior Silhouette'}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10 brightness-75 contrast-110"
        />

        {/* Layer 2: Interactive Colored Muscle Highlight Masks */}
        <svg
          viewBox="0 0 400 720"
          className="absolute inset-0 w-full h-full z-20 overflow-visible"
        >
          {currentView === 'front' ? (
            /* ==================== FRONT SKETCH MUSCLES ==================== */
            <g id="front-muscles">
              {/* Shoulders / Delts (delts) */}
              <g
                id="delts"
                onClick={() => setSelectedMuscleId('delts')}
                onMouseEnter={() => setHoveredMuscleId('delts')}
                onMouseLeave={() => setHoveredMuscleId(null)}
                {...getMuscleProps('delts')}
              >
                {/* Left Deltoid */}
                <path d="M 144 162 C 126 162 112 172 110 188 C 108 202 120 214 132 210 C 138 200 144 184 148 168 Z" />
                {/* Right Deltoid */}
                <path d="M 256 162 C 274 162 288 172 290 188 C 292 202 280 214 268 210 C 262 200 256 184 252 168 Z" />
              </g>

              {/* Chest / Pectorals (chest) */}
              <g
                id="chest"
                onClick={() => setSelectedMuscleId('chest')}
                onMouseEnter={() => setHoveredMuscleId('chest')}
                onMouseLeave={() => setHoveredMuscleId(null)}
                {...getMuscleProps('chest')}
              >
                {/* Left Pec */}
                <path d="M 197 165 C 172 163 148 166 140 178 C 136 194 146 216 175 218 C 188 219 197 212 197 195 Z" />
                {/* Right Pec */}
                <path d="M 203 165 C 228 163 252 166 260 178 C 264 194 254 216 225 218 C 212 219 203 212 203 195 Z" />
              </g>

              {/* Biceps (biceps) */}
              <g
                id="biceps"
                onClick={() => setSelectedMuscleId('biceps')}
                onMouseEnter={() => setHoveredMuscleId('biceps')}
                onMouseLeave={() => setHoveredMuscleId(null)}
                {...getMuscleProps('biceps')}
              >
                {/* Left Bicep */}
                <path d="M 130 208 C 120 218 116 230 118 248 C 120 260 132 262 138 254 C 144 242 144 222 136 210 Z" />
                {/* Right Bicep */}
                <path d="M 270 208 C 280 218 284 230 282 248 C 280 260 268 262 262 254 C 256 242 256 222 264 210 Z" />
              </g>

              {/* Forearms (forearms) */}
              <g
                id="forearms"
                onClick={() => setSelectedMuscleId('forearms')}
                onMouseEnter={() => setHoveredMuscleId('forearms')}
                onMouseLeave={() => setHoveredMuscleId(null)}
                {...getMuscleProps('forearms')}
              >
                {/* Left Forearm */}
                <path d="M 120 258 C 108 270 98 295 98 322 C 100 332 110 334 116 325 C 124 308 132 284 130 262 Z" />
                {/* Right Forearm */}
                <path d="M 280 258 C 292 270 302 295 302 322 C 300 332 290 334 284 325 C 276 308 268 284 270 262 Z" />
              </g>

              {/* Abdominals & Core (core) */}
              <g
                id="core"
                onClick={() => setSelectedMuscleId('core')}
                onMouseEnter={() => setHoveredMuscleId('core')}
                onMouseLeave={() => setHoveredMuscleId(null)}
                {...getMuscleProps('core')}
              >
                {/* Upper 6-Pack */}
                <rect x="183" y="222" width="14" height="15" rx="3" />
                <rect x="203" y="222" width="14" height="15" rx="3" />
                {/* Mid 6-Pack */}
                <rect x="183" y="242" width="14" height="16" rx="3" />
                <rect x="203" y="242" width="14" height="16" rx="3" />
                {/* Lower 6-Pack */}
                <path d="M 183 263 L 197 263 L 197 286 L 183 282 Z" />
                <path d="M 203 263 L 217 263 L 217 282 L 203 286 Z" />
                {/* Obliques Left & Right */}
                <path d="M 172 232 C 160 248 160 274 164 298 C 166 312 176 316 176 316 L 174 290 L 174 256 Z" />
                <path d="M 228 232 C 240 248 240 274 236 298 C 234 312 224 316 224 316 L 226 290 L 226 256 Z" />
              </g>

              {/* Quadriceps (quads) */}
              <g
                id="quads"
                onClick={() => setSelectedMuscleId('quads')}
                onMouseEnter={() => setHoveredMuscleId('quads')}
                onMouseLeave={() => setHoveredMuscleId(null)}
                {...getMuscleProps('quads')}
              >
                {/* Left Quad */}
                <path d="M 170 324 C 150 344 142 382 146 432 C 148 454 156 470 168 474 C 178 476 188 466 190 446 C 194 416 194 356 188 328 Z" />
                {/* Right Quad */}
                <path d="M 230 324 C 250 344 258 382 254 432 C 252 454 244 470 232 474 C 222 476 212 466 210 446 C 206 416 206 356 212 328 Z" />
              </g>

              {/* Calves & Tibialis Front (calves-front) */}
              <g
                id="calves-front"
                onClick={() => setSelectedMuscleId('calves-front')}
                onMouseEnter={() => setHoveredMuscleId('calves-front')}
                onMouseLeave={() => setHoveredMuscleId(null)}
                {...getMuscleProps('calves-front')}
              >
                {/* Left Front Calf */}
                <path d="M 168 492 C 156 510 152 540 156 580 C 158 598 168 600 174 592 C 180 574 182 542 180 496 Z" />
                {/* Right Front Calf */}
                <path d="M 232 492 C 244 510 248 540 244 580 C 242 598 232 600 226 592 C 220 574 218 542 220 496 Z" />
              </g>
            </g>
          ) : (
            /* ==================== BACK SKETCH MUSCLES ==================== */
            <g id="back-muscles">
              {/* Trapezius (traps) */}
              <g
                id="traps"
                onClick={() => setSelectedMuscleId('traps')}
                onMouseEnter={() => setHoveredMuscleId('traps')}
                onMouseLeave={() => setHoveredMuscleId(null)}
                {...getMuscleProps('traps')}
              >
                <path d="M 200 115 L 216 130 L 244 148 C 232 168 220 190 200 224 C 180 190 168 168 156 148 L 184 130 Z" />
              </g>

              {/* Triceps (triceps) */}
              <g
                id="triceps"
                onClick={() => setSelectedMuscleId('triceps')}
                onMouseEnter={() => setHoveredMuscleId('triceps')}
                onMouseLeave={() => setHoveredMuscleId(null)}
                {...getMuscleProps('triceps')}
              >
                {/* Left Tricep */}
                <path d="M 126 200 C 112 214 110 234 112 254 C 116 264 126 264 132 256 C 136 242 138 220 134 204 Z" />
                {/* Right Tricep */}
                <path d="M 274 200 C 288 214 290 234 288 254 C 284 264 274 264 268 256 C 264 242 262 220 266 204 Z" />
              </g>

              {/* Latissimus Dorsi (lats) */}
              <g
                id="lats"
                onClick={() => setSelectedMuscleId('lats')}
                onMouseEnter={() => setHoveredMuscleId('lats')}
                onMouseLeave={() => setHoveredMuscleId(null)}
                {...getMuscleProps('lats')}
              >
                {/* Left Lat */}
                <path d="M 165 168 C 148 186 142 212 150 258 C 156 274 170 280 184 280 C 186 255 192 228 195 210 C 184 195 174 180 165 168 Z" />
                {/* Right Lat */}
                <path d="M 235 168 C 252 186 258 212 250 258 C 244 274 230 280 216 280 C 214 255 208 228 205 210 C 216 195 226 180 235 168 Z" />
              </g>

              {/* Lower Back (lowerback) */}
              <g
                id="lowerback"
                onClick={() => setSelectedMuscleId('lowerback')}
                onMouseEnter={() => setHoveredMuscleId('lowerback')}
                onMouseLeave={() => setHoveredMuscleId(null)}
                {...getMuscleProps('lowerback')}
              >
                <path d="M 186 278 L 214 278 C 216 300 216 320 214 340 L 186 340 C 184 320 184 300 186 278 Z" />
              </g>

              {/* Glutes (glutes) */}
              <g
                id="glutes"
                onClick={() => setSelectedMuscleId('glutes')}
                onMouseEnter={() => setHoveredMuscleId('glutes')}
                onMouseLeave={() => setHoveredMuscleId(null)}
                {...getMuscleProps('glutes')}
              >
                {/* Left Glute */}
                <path d="M 197 340 C 176 340 156 348 150 365 C 144 385 150 408 165 416 C 180 422 194 416 197 396 Z" />
                {/* Right Glute */}
                <path d="M 203 340 C 224 340 244 348 250 365 C 256 385 250 408 235 416 C 220 422 206 416 203 396 Z" />
              </g>

              {/* Hamstrings (hamstrings) */}
              <g
                id="hamstrings"
                onClick={() => setSelectedMuscleId('hamstrings')}
                onMouseEnter={() => setHoveredMuscleId('hamstrings')}
                onMouseLeave={() => setHoveredMuscleId(null)}
                {...getMuscleProps('hamstrings')}
              >
                {/* Left Hamstring */}
                <path d="M 166 422 C 154 444 150 475 154 502 C 162 510 178 510 186 502 C 192 480 194 450 192 422 Z" />
                {/* Right Hamstring */}
                <path d="M 234 422 C 246 444 250 475 246 502 C 238 510 222 510 214 502 C 208 480 206 450 208 422 Z" />
              </g>

              {/* Calves (calves) */}
              <g
                id="calves"
                onClick={() => setSelectedMuscleId('calves')}
                onMouseEnter={() => setHoveredMuscleId('calves')}
                onMouseLeave={() => setHoveredMuscleId(null)}
                {...getMuscleProps('calves')}
              >
                {/* Left Calf */}
                <path d="M 166 508 C 152 530 152 562 160 596 C 166 612 180 612 186 596 C 192 574 192 542 184 508 Z" />
                {/* Right Calf */}
                <path d="M 234 508 C 248 530 248 562 240 596 C 234 612 220 612 214 596 C 208 574 208 542 216 508 Z" />
              </g>
            </g>
          )}
        </svg>

        {/* Layer 3: Crisp Pen Ink Sketch Lines ON TOP of the colors */}
        <img
          src={
            currentView === 'front'
              ? '/assets/diagram_front_lines.png'
              : '/assets/diagram_back_lines.png'
          }
          alt="Sketch Linework"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-30 filter contrast-125"
        />

        {/* Layer 4: Tactical Pinned Badges & Interactive Callouts */}
        <div className="absolute inset-0 pointer-events-none z-40">
          {activeOrSelectedMuscles.map((muscle) => {
            const isSelected = selectedMuscleId === muscle.id;
            const isWorked = muscle.effort !== 'rested';
            const { x, y } = getPinCoordinate(muscle.id);

            const topPercent = (y / 720) * 100;
            const leftPercent = (x / 400) * 100;

            return (
              <div
                key={muscle.id}
                style={{
                  top: `${topPercent}%`,
                  left: `${leftPercent}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              >
                <button
                  onClick={() => setSelectedMuscleId(muscle.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border backdrop-blur-md transition-all shadow-xl active:scale-95 ${
                    isSelected
                      ? 'bg-surface text-on-surface ring-2 ring-primary-container border-primary-container scale-105 shadow-[0_0_16px_rgba(0,255,135,0.7)]'
                      : muscle.effort === 'high'
                      ? 'bg-[#10141e]/90 text-primary-container border-primary-container/70 shadow-[0_0_12px_rgba(0,255,135,0.45)]'
                      : muscle.effort === 'moderate'
                      ? 'bg-[#10141e]/90 text-tertiary-fixed-dim border-tertiary-fixed-dim/70 shadow-[0_0_10px_rgba(57,184,253,0.4)]'
                      : 'bg-[#10141e]/70 text-on-surface-variant border-outline-variant/30'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      muscle.effort === 'high'
                        ? 'bg-primary-container animate-ping'
                        : muscle.effort === 'moderate'
                        ? 'bg-secondary'
                        : 'bg-outline'
                    }`}
                  ></span>
                  <span className="truncate max-w-[85px]">{muscle.name.split(' ')[0]}</span>
                  {isWorked && (
                    <span className="text-[8px] opacity-80 uppercase">
                      {muscle.effort === 'high' ? 'High' : 'Mod'}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating HUD View Watermark Pill */}
      <div className="absolute bottom-3 right-3.5 z-50 font-mono text-[9px] font-bold tracking-widest text-on-surface uppercase bg-[#141824]/90 backdrop-blur-md px-3 py-1 rounded-lg border border-outline-variant/40 shadow-lg flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
        <span>{currentView === 'front' ? 'Anterior (Front)' : 'Posterior (Back)'}</span>
      </div>
    </div>
  );
};
