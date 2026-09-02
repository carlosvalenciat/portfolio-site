const traces = [
  "M-40 138 H168 L228 198 H420 L486 132 H700 L752 184 H980 L1042 122 H1240",
  "M-20 314 H108 L164 258 H326 L390 322 H566 L630 258 H842 L904 320 H1220",
  "M-30 504 H212 L272 444 H438 L512 518 H688 L750 456 H936 L1010 530 H1230",
  "M-20 720 H142 L206 656 H382 L448 722 H610 L680 652 H862 L926 716 H1220",
] as const;

const branches = [
  "M228 198 V86 H338",
  "M390 322 V412 H510",
  "M630 258 V104 H748",
  "M750 456 V570 H880",
  "M448 722 V602 H548",
  "M1010 530 V410 H1124",
] as const;

const nodes = [
  [168, 138], [228, 198], [486, 132], [752, 184], [1042, 122],
  [164, 258], [390, 322], [630, 258], [904, 320],
  [272, 444], [512, 518], [750, 456], [1010, 530],
  [206, 656], [448, 722], [680, 652], [926, 716],
] as const;

export default function CircuitBackdrop() {
  return (
    <div className="circuit-backdrop" aria-hidden="true">
      <div className="circuit-backdrop__halo" />
      <svg className="circuit-plane circuit-plane--far" viewBox="0 0 1200 860" preserveAspectRatio="xMidYMid slice">
        <g className="circuit-traces circuit-traces--far">
          {traces.map((path) => <path d={path} key={path} />)}
          {branches.map((path) => <path d={path} key={path} />)}
        </g>
      </svg>

      <svg className="circuit-plane circuit-plane--near" viewBox="0 0 1200 860" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="circuit-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g className="circuit-traces circuit-traces--near">
          {traces.map((path, index) => <path d={path} key={path} style={{ animationDelay: `${index * -1.7}s` }} />)}
          {branches.map((path, index) => <path d={path} key={path} style={{ animationDelay: `${index * -1.15}s` }} />)}
        </g>
        <g className="circuit-nodes">
          {nodes.map(([cx, cy], index) => (
            <g key={`${cx}-${cy}`} className={index % 4 === 0 ? "circuit-node circuit-node--active" : "circuit-node"}>
              <circle cx={cx} cy={cy} r="3" />
              <circle cx={cx} cy={cy} r="9" className="circuit-node__ring" />
            </g>
          ))}
        </g>
        <g className="circuit-packets" filter="url(#circuit-glow)">
          <circle r="3"><animateMotion dur="8s" repeatCount="indefinite" path={traces[0]} /></circle>
          <circle r="2.5"><animateMotion dur="11s" begin="-4s" repeatCount="indefinite" path={traces[2]} /></circle>
          <circle r="2.5"><animateMotion dur="13s" begin="-8s" repeatCount="indefinite" path={traces[3]} /></circle>
        </g>
      </svg>

      <div className="circuit-backdrop__readout circuit-backdrop__readout--a">BUS / 24V · LINK ACTIVE</div>
      <div className="circuit-backdrop__readout circuit-backdrop__readout--b">SIGNAL / VALIDATED</div>
    </div>
  );
}
